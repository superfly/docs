---
title: "Private Networking"
layout: docs
sitemap: false
nav: firecracker
---

Fly apps are connected by a mesh of Wireguard tunnels using IPV6.

Applications within the same organization are assigned special addresses ("6PN addresses") tied to the organization. Those applications can talk to each other because of those 6PN addresses, but applications from other organizations can't; the Fly platform won't forward between different 6PN networks.

This connectivity is always available to applications; you don't have to do anything special to get it.

You can connect applications running outside of Fly to your 6PN network using WireGuard; for that matter, you can connect your dev laptop to your 6PN network. To do that, you'll use `flyctl` to generate a WireGuard configuration that is addressed with a 6PN address.

## Discovering Apps through DNS on an instance

Instances are configured with their DNS server pointing to `fdaa::3`. The DNS server on this address can resolve arbitrary DNS queries, so you can look up "google.com" with it. But it's also aware of 6PN addresses, and, when queried from an instance, will let you look up the addresses of other applications in your organization. Those addresses live under the synthetic top-level domain `.internal`.

Since this is the default configuration we set up for instances on Fly, you probably don't need to do anything special to make this work; if your instance shares an organization with an application called `random-potato-45`, then you should be able to `ping6 random-potato-45.internal`.

If you want to get fancy, you can install `dig` and query the DNS directly.

```bash
$ root@f066b83b:/# dig +short aaaa paulgra-ham.internal @fdaa::3
```
```output
fdaa:0:18:a7b:7d:f066:b83b:2
```

## Discovering Apps through DNS on a WireGuard connection

**The DNS server address is different on WireGuard connections than on instances**. That's because you can run multiple WireGuard connections; your dev laptop could be WireGuard-connected to multiple organizations, but an instance can't be. So DNS is just a little more complicated over WireGuard.

Your DNS server address for a WireGuard connection is a part of the WireGuard connection `flyctl` generates. Your platform WireGuard tools might read and automatically configure DNS from that configuration, or it might not. Here's how to find it:

```
[Interface]
PrivateKey = [redacted]
Address = fdaa:0:18:a7b:d6b:0:a:2/120
DNS = fdaa:0:18::3
```

You guessed it; it's the `DNS` line.

If you look carefully, you'll notice something about the DNS address: it shares the first couple parts with the WireGuard IP address. That's because 6PN addresses are prefixed by the organization's network ID; that's the part of the address that locks it to your organization. All our WireGuard DNS addresses follow this pattern: take the organization prefix, and tack `::3` onto the end:

```
fdaa:0:18:a7b:d6b:0:a:2
^^^^ ^ ^^
6PN prefix; the first 3 :-separated parts

fdaa:0:18::3
```

To use `dig` to probe DNS on a WireGuard connection, supply the DNS server address to it. Note that `dig`'s syntax is silly, and that you have to put a `@` at the beginning of the address; this trips us up all the time.

```bash
$ root@f066b83b:/# dig +short aaaa paulgra-ham.internal @fdaa:0:18::3
```
```output
fdaa:0:18:a7b:7d:f066:b83b:2
```

## Fly `.internal` addresses

A typical .internal address is composed of a region qualifier, followed by the app name followed by `.internal`.

The simplest regional qualifier is a region name. `iad.appname.internal`. This would return the IPv6 internal address (or addresses) of the instances of app `appname` in the `iad` region.

Applications can use this form of `.internal` address to look up address of a host. Rather than returning a list of addresses, it will return the first address.

The regional qualifier `global` will return the IPv6 internal addresses for all instances of the app in every region.

As well, as being able to query and lookup addresses, there's a TXT record associated with `regions.appname.internal` which will list the regions that `appname` is deployed in.

Finally, You can discover all the apps in the organization by requesting the TXT records associated with `_apps.internal`. This will contain a comma-separated list of the application names.

| name | aaaa | txt |
| -- | --- | -- |
|`top<number>.nearest.of.<appname>.internal`| top _number_ closest app instances|none
|`<alloc_id>.vm.<appname>.internal`|specific app instance<br/>|none
|`vms.<appname>.internal`|none|comma-separated alloc-ids<br/> of app instances|none
|`<region>.<appname>.internal`|app instances<br/> in region|none
|`global.<appname>.internal`|app instances<br/> in all regions|none
|`regions.<appname>.internal`|none|region names<br/> where app is deployed|
|`<appname>.internal`|app instances<br/> in any region|none
|`_apps.internal`|none|names of all 6PN<br/> private networking apps<br/> in the same organization|
|`_peer.internal`|none|names of all wireguard peers|
|`<peername>._peer.internal`|IPv6 of peer|none|

Examples of retrieving this information are in the [fly-examples/privatenet](https://github.com/fly-apps/privatenet) repository.

## Flycast - Private Load Balancing

Flycast offers the same [geographically-aware load balancing](/docs/reference/load-balancing/) as the public Fly proxy while restricting traffic to private networks.

Use this feature under the following circumstances:

* Your app can't use DNS
* You're using 3rd party software, like a database, that doesn't support round-robin DNS entries
* Your want to limit access to specific ports/services in your app from other Fly organizations
* You private service needs advanced proxy features like TLS termination or proxy protocol support

The general flow for setting this up is:

1. Allocate a private IPv6 address on one of your Fly organization networks
2. Expose services in your app's fly.toml `[services]` block
3. Deploy your app
4. Access the services on the private IP from the target organization network

Flycast IP have no associated DNS entry.

**Note: If you have a public IP address assigned to your app, services in fly.toml will be exposed to the public internet. Verify this with `fly ips list`.**

### Assigning a Flycast address

By default, the Flycast IP is allocated on app's parent organization network.

```cmd
 fly ips allocate-v6 --private
 ```
 ```output
VERSION	IP                	TYPE   	REGION	CREATED AT
v6     	fdaa:0:22b7:0:1::3	private	global	just now
```

If you want to expose services to another Fly organization you have access to, use the `--org` flag.

```cmd
 fly ips allocate-v6 --private --org my-other-org
 ```
 ```output
VERSION	IP                	TYPE   	REGION	CREATED AT
v6     	fdaa:0:22b7:0:1::3	private	global	just now
```

## Private Network VPN

You can use the [WireGuard](https://wireguard.com/) VPN to connect to our [6PN private network](/docs/reference/private-networking/). This is a flexible and secure way to plug into each one of your Fly organizations and connect to any and all apps within that organization.


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

As well as configuring the Wireguard service, the create command also generates a tunnel configuration file, complete with private keys which cannot be recovered. This configuration file will be used in the next step. First it has to be saved:

```output
!!!! WARNING: Output includes private key. Private keys cannot be recovered !!!!
!!!! after creating the peer; if you lose the key, you’ll need to remove    !!!!
!!!! and re-add the peering connection.                                     !!!!
? Filename to store WireGuard configuration in, or 'stdout':  basic.conf
Wrote WireGuard configuration to 'basic.conf'; load in your WireGuard client
```

We suggest you name your saved configuration with the same name as the peer you have created. Add the extension `.conf` to ensure it can will be recognized by the various WireGuard apps as a configuration file for a tunnel. Note that the name (excluding the `.conf` extension) shouldn't exceed 15 characters since this is the maximum length for an interface name on Linux.

##### Dealing with Defaults

A default `region` and `name` will be used if they are not provided to the create command. In most cases, this is fine. However, the default generated name will start with `interactive-*` which are filtered out of DNS (because of the sheer volume of them) and subsequently can't be queried with `_peer.internal` or `<peername>._peer.internal`. If you wish to interact with your peer via it's name, be sure to specify it when creating.

First, look up available regions by running `fly platform regions`. Select a region with a check mark in the Gateway column.

Then run:
```cmd
fly wireguard create [your-org] [region] [peer-name]
```

After that you'll be able to `dig` to your heart's desire:

```cmd
dig +short txt _peer.internal @fdaa:0:18::3
```
```output
"my-peer"
```

```cmd
dig +short aaaa my-peer._peer.internal @fdaa:0:18::3
```
```output
fdaa:0:18:a7b:7d:f066:b83b:102
```

#### Importing your tunnel

##### Windows

Run the WireGuard app. Click the `Import tunnel(s) from file` button. Select your configuration file. The Wireguard app will display the details of your tunnel. Click `Activate` to bring the tunnel online.

##### macOS

Run the WireGuard app. Click the `Import tunnel(s) from file` button. Select your configuration file and click Ok. You will be prompted by the OS that WireGuard would like to add VPN configurations; click `Allow`. The Wireguard app will display the details of your tunnel. Click `Activate` to bring the tunnel online.

##### Ubuntu Linux

Ensure you have `wg-quick` installed, if not, run the below command.
From Ubuntu 18 onwards, `openresolv` is also required.

```
sudo apt install wireguard-tools openresolv
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

```cmd
dig +noall +answer _apps.internal txt
```
```output
_apps.internal.		5	IN	TXT	"datasette-apache-proxy-demo,datasette-demo"
```

### Managing Wireguard on Fly

#### Listing the tunnels

To list all the tunnels set up for an organization, run `fly wireguard list`. You can provide an organization on the command line or you'll be prompted for one.

#### Removing a tunnel

To remove a tunnel, run `fly wireguard remove`. You can specify the organization and tunnel name on the command line or be prompted for both.













