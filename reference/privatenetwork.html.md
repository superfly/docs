---
title: "Private Networking"
layout: docs
sitemap: false
nav: firecracker
---

## Private Networking

Fly apps are connected by a mesh of Wireguard tunnels using IPV6. Applications within the same organization can connect over that mesh if they have the IPV6 address of another application host. This connectivity is always available to applications. 

### Discovering Apps through DNS

There is a DNS server available on `fdaa:0:33::3` that can answer all queries. Queries to `.internal` addresses are resolved dynamically using application names, regions, and keywords to return particular sets of addresses. If the query is not resolvable locally, the query will recursively resolved using the DNS service at 8.8.8.8 (Google's DNS service).

### Using Fly DNS

By default, applications on Fly go to the 8.8.8.8 DNS service and do not use the internal DNS server. Applications may make use of it by directing queries to `fdaa:0:33::3`.

To activate the internal DNS server for all address resolution, add:

 ```
[experimental]
  private_network=true
```

to the application's `fly.toml` file.


## Fly `.internal` addresses

A typical .internal address is composed of a region qualifier, followed by the app name followed by `.internal`. 

The simplest regional qualifier is a region name. `iad.appname.internal`. This would return the IPv6 internal address (or addresses) of the instances of app `appname` in the `iad` region. 

Applications can use this form of `.internal` address to look up address of a host. Rather than returning a list of addresses, it will return the first address.

The regional qualifier `global` will return the IPv6 internal addresses for all instances of the app in every region. 

As well, as being able to query and lookup addresses, there's a TXT record associated with `regions.appname.internal` which will list the regions that `appname` is deployed in.

Finally, You can discover all the apps in the organization by requesting the TXT records associated with `_apps.internal`. This will contain a comma-separated list of the application names. 

| name | aaaa | txt |
| -- | --- | -- |
|`<region>.<appname>.internal`|app instances<br/> in region|none
|`regions.<appname>.internal`|none|region names<br/> where app is deployed|
|`<appname>.internal`|app instances<br/> in any region|none
|`_apps.internal`|none|names of all 6PN<br/> private networking apps<br/> in the same organization|
|`_peer.internal`|none|names of all wireguard peers|
|`<peername>._peer.internal`|IPv6 of peer|none|

Examples of retrieving this information are in the [fly-examples/privatenet](https://github.com/fly-apps/privatenet) repository.

## Private Network VPN

Along with our [6PN private networking](/docs/reference/privatenetwork/),  [WireGuard](https://wireguard.com/) networking software. This is a flexible and secure way to plug into each one of your Fly organizations and connect to any and all apps within that organization.

### TL:DR; 

Fly's command line  can generate you a tunnel configuration file with private keys already embedded. You can load that file into your local WireGuard application to create a tunnel. Activate the tunnel and you'll be using the internal Fly DNS service which resolves `.internal` addresses - and passes on other requests to Google's DNS for resolution.

### Step by Step

#### Install your WireGuard App

There are many options for installing WireGuard on your system, detailed on the [WireGuard](https://www.wireguard.com/install/) site. Install the software that is appropriate for your system. Window and macOS have apps available to install. Linux systems have packages, typically named wireguard and wireguard-tools, you should install both.

#### Creating your tunnel configuration

To create your tunnel, run:

```cmd
fly wireguard create
```

You'll be asked to select which organization you want the WireGuard tunnel to work with:

```output
? Select organization:  [Use arrows to move, type to filter]
> Dj (personal)
  Demo Sandbox (demo-sandbox)
```

You'll then be asked for a region where the gateway is. The available regions can be found by running `fly platform regions`. Select a region with a check mark in the Gateway column.

```output
? Region in which to add WireGuard peer:  lhr
```

Now it's time to name our WireGuard peer, effectively a name for the connection. We'll call this connection `basic` for this example:

```output
? Name of WireGuard peer to add:  basic
Creating WireGuard peer "basic" in region "lhr" for organization personal
```

As well as configuring the Wireguard service, the create command also generates a tunnel configuration file, complete with private keys which cannot be recovered. This configuration file will be used in the next step. First it has to be saved:

```output
!!!! WARNING: Output includes private key. Private keys cannot be recovered !!!!
!!!! after creating the peer; if you lose the key, you’ll need to remove    !!!!
!!!! and re-add the peering connection.                                     !!!!
? Filename to store WireGuard configuration in, or 'stdout':  basic.conf
Wrote WireGuard configuration to 'basic.conf'; load in your WireGuard client
```

We suggest you name your saved configuration with the same name as the peer you have created. Add the extension `.conf` to ensure it can will be recognized by the various WireGuard apps as a configuration file for a tunnel.

#### Importing your tunnel

##### Windows

Run the WireGuard app. Click the `Import tunnel(s) from file` button. Select your configuration file. The Wireguard app will display the details of your tunnel. Click `Activate` to bring the tunnel online.

##### macOS

Run the WireGuard app. Click the `Import tunnel(s) from file` button. Select your configuration file and click Ok. You will be prompted by the OS that WireGuard would like to add VPN configurations; click `Allow`. The Wireguard app will display the details of your tunnel. Click `Activate` to bring the tunnel online.

##### Ubuntu Linux

Ensure you have `wg-quick` installed, if not, run:

```
sudo apt install wireguard-tools
```

Copy the configuration file to `/etc/wireguard`; you'll need root/sudo permissions:

```
sudo cp basic.conf /etc/wireguard
```

Run `wg-quick` to bring `up` the connection by name (i.e. less the `.conf` extension):

```cmd
wg-quick up basic 
```
```output
[#] ip link add basic type wireguard
[#] wg setconf basic /dev/fd/63
[#] ip -6 address add fdaa:0:4:a7b:ab6:0:a:102/120 dev basic
[#] ip link set mtu 1420 up dev basic
[#] resolvconf -a tun.basic -m 0 -x
[#] ip -6 route add fdaa:0:4::/48 dev basic
```

### Testing the tunnel

If you have the `dig` tool installed, a TXT query to `_apps.internal` will show all the application names available in the organization you are connected to.

### Managing Wireguard on Fly

#### Listing the tunnels

To list all the tunnels set up for an organization, run `fly wireguard list`. You can provide an organization on the command line or you'll be prompted for one.

#### Removing a tunnel

To remove a tunnel, run `fly wireguard remove`. You can specify the organization and tunnel name on the command line or be prompted for both. 













