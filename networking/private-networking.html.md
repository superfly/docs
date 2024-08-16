---
title: "Private Networking"
layout: docs
nav: firecracker
redirect_from:
  - /docs/reference/privatenetwork/
  - /docs/reference/private-networking/
---

Fly Apps in an organization are connected by a mesh of WireGuard tunnels using IPv6 called a 6PN. Private networking over your 6PN is always available to apps by default; you don't have to do anything special to get it.

Apps within the same organization are assigned special addresses (6PN addresses) tied to 6PN. Those applications can talk to each other because of their 6PN addresses, but applications from other organizations can't. The Fly.io platform won't forward packets between different 6PNs, unless you explicitly allow it, for example when you [allocate a Flycast address](/docs/networking/flycast/#allocate-a-flycast-address).

You can connect apps running outside of Fly.io to your 6PN using WireGuard. You can even connect your dev laptop to your 6PN. To do that, you'll use flyctl, the Fly.io CLI, to generate a [WireGuard configuration that has a 6PN address](#private-network-vpn).

## Fly.io `.internal` DNS

You can use `.internal` domains to connect your app to databases, API servers, or other apps in your 6PN. If you don't need the granular subdomains and routing available with `.internal`, and you want to use Fly Proxy features for your internal apps, then you should use [Flycast](/docs/networking/flycast/) instead.

A Fly Machine is configured to resolve domain names with a custom DNS server from the Fly Platform. This DNS server can resolve arbitrary DNS queries, so you can look up `google.com` with it. But it’s also aware of 6PN addresses, and will let you look up 6PN addresses for other apps in your organization. Those addresses live under the custom top-level domain `.internal`. 

Underneath `.internal` there are second-level domains for every app in your Fly organization. For example, if your app is in an organization with another app called `my-app-name`, then there will be a AAAA record at `my-app-name.internal`. The AAAA record will contain all the 6PN addresses of the started Fly Machines that belong to the `my-app-name` Fly App. Note that different libraries and tools will use multi-address AAAA records differently; most will only use the first address that is returned, but others might round-robin between entries for every request -- if you'd like to know more, consult the documentation for the library or tool you are using for DNS lookup.

<div class="important icon">
**Important:** All queries to Fly.io `.internal` domains only return information for started (running) Machines. Any stopped Machines, including those autostopped by Fly Proxy, are not included in the response to the DNS query.
</div>

Each `<appname>.internal` domain has further subdomains which can be used to return a more precise subset of the started Machines in that app. For example, you can add a region name qualifier to return the 6PN addresses of an app's Machines in a specific region: `iad.my-app-name.internal`. Querying this domain returns the 6PN addresses of `my-app-name` Machines in the `iad` region.

Some `.internal` domains do not contain an AAAA record, but instead contain a TXT record with Machine, app, or region information. For example, if you request the TXT records using `regions.my-app-name.internal`, then you'll get back a comma-separated list of regions that `my-app-name` is deployed in. And you can discover all the apps in the organization by requesting the TXT records associated with `_apps.internal`. This will return a comma-separated list of the app names.

The following table lists the available `.internal` domains:

| Name | AAAA | TXT |
| -- | --- | -- |
|`<appname>.internal`|6PN addresses of all<br> Machines in any<br> region for the app|none
|`top<number>.nearest.of.<appname>.internal`|6PN addresses of<br> top _number_ closest<br> Machines for the app|none
|`<machine_id>.vm.<appname>.internal`|6PN address of<br> a specific Machine<br> for the app|none
|`vms.<appname>.internal`|none|comma-separated list<br> of Machine ID and region<br>name for the app
|`<process_group>.process.<appname>.internal`|6PN addresses of<br> Machines in process<br> group for the app|none
|`<region>.<appname>.internal`|6PN addresses of<br> Machines in region<br> for the app|none
|`global.<appname>.internal`|alias for<br>`<appname>.internal`|none
|`regions.<appname>.internal`|none|comma-separated list<br> of region names where<br>Machines are deployed<br> for app|
|`<value>.<key>.kv._metadata.<appname>.internal`|6PN addresses of<br> Machines with<br> matching [metadata](https://community.fly.io/t/dynamic-machine-metadata/13115)|none|
|`_apps.internal`|none|comma-separated list<br> of the names of all apps<br> in current organization|
|`_peer.internal`|none|comma-separated list<br> of the names of all<br> WireGuard peers in<br> current organization|
|`<peername>._peer.internal`|6PN address of peer|none|
|`_instances.internal`|none|comma-separated list<br> of Machine ID, app name,<br>6PN address, and region for<br> all Machines in current<br> organization|

See the [fly-examples/privatenet](https://github.com/fly-apps/privatenet+external) repo for examples that use the `.internal` domains.

## Listening for connections on 6PN addresses

When deploying a Fly Machine, we alias the 6PN address of the Machine to `fly-local-6pn` in the Machine's `/etc/hosts` file.

Your app's service needs to bind to/listen on `fly-local-6pn` to be accessible via its 6PN address. For example, if you have a service running on port 8080, then you need to bind it to `fly-local-6pn:8080` for it to be accessible to other Machines over the 6PN.

<div class="note icon">
`fly-local-6pn` is to 6PN addresses as `localhost` is to 127.0.0.1, so you can also bind directly to the 6PN address itself.
</div>

Learn more about [connecting to app services](/docs/networking/app-services/).

## Connect a Fly Machine to the Fly.io DNS

The custom Fly.io DNS server is always available at the IPv6 address `fdaa::3`. If you want to get fancy, you can install `dig` on the Machine and query the DNS directly. For example:

```cmd
root@f066b83b:/# dig +short aaaa my-app-name.internal @fdaa::3
```
```output
fdaa:0:18:a7b:7d:f066:b83b:2
```

When deploying a Fly Machine, we overwrite `/etc/resolv.conf` to point the DNS server to `fdaa::3`. Since this is the default configuration we set up for Machines on Fly.io, you probably don't need to do anything special to make this work.

In rare cases, such as having an unusual file system layout, or using a networking stack that needs the nameserver explicitly indicated, you might need to point your app to the Fly.io DNS yourself. From any Fly Machine, the nameserver is always at `fdaa::3`.

## 6PN addresses in detail

<div class="note icon">
**Note:** 6PN addresses directly connect one Fly Machine with another, bypassing the Fly Proxy. To use Fly Proxy features like autostop/autostart on your private network, you can use [Flycast](/docs/networking/flycast/).
</div>

Most of the time, the `.internal` DNS is all you'll need for routing. If you need more complicated routing, you might be able to take advantage of the structure of 6PN addresses in your app's design. Rather than a single address, each Fly Machine is assigned a `/112` 6PN subnet, which is structured as follows:

| &nbsp; | &nbsp; | &nbsp; |
| ------- | ------- | ---------------------- |
| `fdaa`  | 16 bits | ULA prefix             |
| network | 32 bits | network identifier     |
| host    | 32 bits | host server identifier |
| machine | 32 bits | fly machine identifier |
| &mdash; | 16 bits | free space             |

<div class="warning icon">
**Caution:** 6PN addresses are **not** static and will change over time, for various reasons. If you need an unchanging method to address an individual Fly Machine, you can use the domain `<machine_id>.vm.<appname>.internal`.
</div>

The machine identifier portion of the 6PN address is not related to the 14 character Machine ID; the two are independent. A Fly Machine's current 6PN address can be found in the environment variable `FLY_PRIVATE_IP`. A Machine's 6PN address is not static, so do not assume that a Fly Machine's Machine ID can be permanently mapped to a particular 6PN address. 6PN addresses will change when an app is moved into a new organization, or when a Fly Machine is migrated onto a new host server. However, a 6PN address change can only happen on a reboot, so supplying a procedure to check for a change in 6PN address on Machine startup is sufficient to handle this event.

## Custom private networks

You can create additional private networks within your organization. Custom private networks are useful when you need to isolate tenants or users for security purposes. For example, if you run a software-as-service platform on top of Fly.io, and your customers are running untrusted code on Machines or you want every customer to have their own secure app.

Learn more about [custom private networks](/docs/networking/custom-private-networks/) and how to create them.

## Private Network VPN

You can use the [WireGuard](https://wireguard.com/+external) VPN to connect to the 6PN private network. WireGuard is a flexible and secure way to plug into each one of your Fly.io organizations and connect to any app within that organization.

### Set up a private network VPN

To set up your VPN, you'll use flyctl to generate a tunnel configuration file with private keys already embedded. Then you can load that file into your local WireGuard application to create a tunnel. Activate the tunnel and you'll be using the internal Fly.io DNS service which resolves `.internal` addresses - and passes on other requests to Google's DNS for resolution.

#### 1. Install your WireGuard App

Visit the [WireGuard](https://www.wireguard.com/install/+external) site for installation options. Install the software that is appropriate for your system. Windows and macOS have apps available to install. Linux systems have packages, typically named wireguard and wireguard-tools, you should install both.

#### 2. Create your tunnel configuration

To create your tunnel, run:

```cmd
fly wireguard create
```

Select the organization you want the WireGuard tunnel to work with:

```output
? Select organization:  [Use arrows to move, type to filter]
> My Org (personal)
  Test Org (test-org)
```

The `fly wireguard create` command configures the WireGuard service and generates a tunnel configuration file, complete with private keys which cannot be recovered. This configuration file will be used in the next step. First, save the configuration file:

```output
!!!! WARNING: Output includes private key. Private keys cannot be recovered !!!!
!!!! after creating the peer; if you lose the key, you’ll need to remove    !!!!
!!!! and re-add the peering connection.                                     !!!!
? Filename to store WireGuard configuration in, or 'stdout':  mypeer.conf
Wrote WireGuard configuration to 'mypeer.conf'; load in your WireGuard client
```

We suggest you name your saved configuration with the same name as the peer you have created. Add the extension `.conf` to ensure it will be recognized by the various WireGuard apps as a configuration file for a tunnel. Note that the name (excluding the `.conf` extension) shouldn't exceed 15 characters since this is the maximum length for an interface name on Linux.

<div class="important icon">
**Important:** If you want to interact with your peer using its name, such as queries to `_peer.internal` or `<peername>._peer.internal`, then you need to specify a name when you create the tunnel.

Defaults are used when you don't specify a `region` and `name` in the `fly wireguard create` command. Default generated names start with `interactive-*` and we filter `interactive-*` out of DNS (because of the sheer volume of them).

To specify a peer name and region, first look up available regions by running `fly platform regions`. Select a region with a check mark in the Gateway column.

Then run: `fly wireguard create [your-org] [region] [peer-name]`
</div>

#### 3. Import your tunnel

##### Windows

Run the WireGuard app. Click **Import tunnel(s) from file**. Select your configuration file. The WireGuard app will display the details of your tunnel. Click **Activate** to bring the tunnel online.

##### macOS

Run the WireGuard app. Click **Import tunnel(s) from file**. Select your configuration file and click **Import**. You might be prompted by the OS that WireGuard would like to add VPN configurations; click **Allow**. The WireGuard app will display the details of your tunnel. Click **Activate** to bring the tunnel online.

##### Ubuntu Linux

If you don't have `wg-quick` installed, then run the command below. For Ubuntu 18.04 to 22.04, `openresolv` is also required.

```
sudo apt install wireguard-tools openresolv
```

Copy the configuration file to `/etc/wireguard`; you'll need root/sudo permissions:

```
sudo cp basic.conf /etc/wireguard
```

Run `wg-quick` to bring `up` the connection by name (i.e. less the `.conf` extension). For example:

```cmd
wg-quick up mypeer
```
```output
[#] ip link add mypeer type wireguard
[#] wg setconf mypeer /dev/fd/63
[#] ip -6 address add fdaa:0:4:a7b:ab6:0:a:102/120 dev mypeer
[#] ip link set mtu 1420 up dev mypeer
[#] resolvconf -a tun.mypeer -m 0 -x
[#] ip -6 route add fdaa:0:4::/48 dev mypeer
```
### Connect to the Fly.io DNS over WireGuard

The DNS server address is different on WireGuard connections than on Machines. That's because you can run multiple WireGuard connections; your dev laptop could be WireGuard-connected to multiple organizations, but a Machine can't be.

Your DNS server address for a WireGuard connection is part of the WireGuard tunnel configuration that flyctl generates. Your platform WireGuard tools might read and automatically configure DNS from that configuration, or they might not. Here's an example of a WireGuard configuration file generated by the `fly wireguard create` command:

```yaml
[Interface]
PrivateKey = [redacted]
Address = fdaa:0:18:a7b:d6b:0:a:2/120
DNS = fdaa:0:18::3
```

You guessed it; it's the `DNS` line. Your DNS server address will also start with `fdaa:`, but the next two parts are unique to your organization's network. All 6PN addresses are prefixed by the organization's network ID; that's the part of the address that locks it to your organization.

All our WireGuard DNS addresses follow this pattern: take the organization prefix, and tack `::3` onto the end. In this example, the WireGuard peer address is:

```
fdaa:0:18:a7b:d6b:0:a:2
```

The 6PN prefix is the first 3 `:`-separated parts, so the DNS server address for this example is:

```
fdaa:0:18::3
```

To use `dig` to probe DNS on a WireGuard connection, supply the DNS server address to it. For example:

```cmd
root@f066b83b:/# dig +short aaaa my-app-name.internal @fdaa:0:18::3
```
```output
fdaa:0:18:a7b:7d:f066:b83b:2
```

### Test the VPN tunnel

If you have the `dig` tool installed, a TXT query to `_apps.internal` will show all the apps in the organization you are connected to:

```cmd
dig +noall +answer _apps.internal txt
```
```output
_apps.internal.		5	IN	TXT	"my-app-name,my-app-name-0,my-app-name-1"
```

You can also query for peer names and addresses:

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

Query for the 6PN addresses of all started Machines in an app:

```
dig +short aaaa my-app-name.internal
```

### Manage WireGuard on Fly.io

#### List the tunnels

To list all the tunnels set up for an organization, run `fly wireguard list`. You can provide an organization on the command line or select an org when prompted.

#### Remove a tunnel

To remove a tunnel, run `fly wireguard remove`. You can specify the organization and tunnel name on the command line or be prompted for both.

### Troubleshoot a WireGuard VPN connection

Having trouble connecting to a Fly.io hosted app? When you can't connect to something, it's helpful to establish a baseline of what is, or what is not, working.

#### Am I connected to Fly.io VPN?

When connected locally, you can run a `dig` command to list all the apps your connection has access to.

```cmd
dig _apps.internal TXT +short
```
```output
my-app,my-app-db
```

If results are returned, you have a VPN connection to an org at Fly.io and the results list all the app names.

If no results are returned, either you do not have a WireGuard VPN connection open or there are NO apps running in the org.

#### Am I connected to the right Fly.io org?

WireGuard connections are created to a specific org. Each org's network is isolated from other orgs. You may have a VPN connection to Fly.io, but it may be to a different org than where your app is located. By default, you are working with your **personal** organization. If the app is in a business focused org or a shared org, you need to ensure your VPN connection is the org where the app lives.

You can also try to ping your app's Machine.

Mac version:
```cmd
ping6 my-app.internal
```

Linux version:
```cmd
ping -6 my-app.internal
```

If the ping succeeds, you have a VPN connection to the same org that your application's Machine is running in.

If the ping fails, check which org the application is deployed in.

```cmd
fly status
```
```output
App
  Name     = my-app
  Owner    = my-biz
  Hostname = my-app.fly.dev
  Image    = my-app:deployment-0123456789

Machines
PROCESS ID              VERSION REGION  STATE   ROLE    CHECKS  LAST UPDATED
app     90706e10f12094  10      ord     started                 2024-04-16T20:20:59Z
```

The `Owner` is the **organization**. In this example, it is `my-biz`.

Then check that your WireGuard connection is to the same organization. To be certain, you can remove the current connection and re-create it explicitly specifying the org.
