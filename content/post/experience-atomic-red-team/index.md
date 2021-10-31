---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Using Atomic Red Team library for detection engineering"
subtitle: ""
summary: "The author's experience using Invoke-Atomic inside a closed off domain-joined Windows (ESXI) lab."
authors: []
tags: []
categories: []
date: 2021-10-29T19:08:24+02:00
lastmod: 2021-10-29T19:08:24+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: "Photo by [UX Indonesia](https://unsplash.com/@uxindo) on [Unsplash](https://unsplash.com)"
  focal_point: ""
  preview_only: false
  alt_text: Person writing on white paper to sketch out UI design during a meet-up.

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
## What is Atomic Red Team?
> Atomic Red Team&trade; is a library of simple tests mapped to the MITRE ATT&CK&reg; framework that every security team can execute to test their defenses. Tests are focused, have few dependencies, and are defined in a structured format that can be used by automation frameworks.[^1] - RedCanaryCo

Atomic Red Team is the main testing repository in the Atomic Family, first created by the esteemded folks from Red Canary.[^2] The Atomic Family also provides a couple of utility tools to help execute the tests, namely:
* `Invoke-AtomicRedTeam` - A PowerShell-based framework for developing and executing atomic tests.[^3]
* AtomicTestHarnesses - A PowerShell module for executing many variations of an attack technique at once.[^4]
* Chain Reactor - A tool for testing detection and response coverage on Linux machines.[^5]

In this blog post we will only talk about Atomic Red Team; the library of tests & `Invoke-AtomicRedTeam`; the powershell framework/script to run the tests.

## Lab Overview
{{< figure src="/img/lab-example.png" >}}
* pfSense acts as the router and the firewall - rules are set to disallow communication with the Internet, unless explicitly allowed.
* Windows Server Domain Controller provides DHCP and DNS for internal domain.
* RHEL 8 server running Splunk 8 - for centralised logging.
* Fedora 34 client as administrator workstation - allowed to connect to the Internet. Main test execution management platform.
* Windows 10 client - main test execution host.
{{% alert note %}}
We used an existing lab we built, which is closed off of from the Internet, so that may not be the most convenient setup as Atomic Red Team downloads certain scripts from the repo for execution, thus not all tests might run properly.
{{% /alert %}}
## Setting up pre-requisites
To execute tests remotely from a Linux machine (which we did here), it requires PowerShell core to be installed.[^6]

### Setting up openssh remoting
If you are keen, you could also use OpenSSH[^7] remoting feature now built-in to Windows. This feature is available in:
* Windows 10
* Windows Server 2019
* Windows Server 2022

Steps to enable:
* Right-click Windows Icon
* Click `Settings`
* Select `Apps > Apps & Features > Optional Features`
* Find `OpenSSH Server`
* Click `Install`

To connect to the machine, you can execute:
```bash
ssh username@machine-ip
```

{{% alert note %}}
We noticed that if you have a machine that is joined to a domain (otherthan `WORKGROUP`), the way you connect is slightly different. Like so:
```bash
ssh domain\\username@machine-ip
```
{{% /alert %}}


### PSWSMan module for WinRM PSRemoting on Linux
You will need to install `PSWSMan` to use WinRM remoting feature.[^8]

To do so:
```bash
$ sudo pwsh -Command "Install-Module -Name PSWSMan"
$ sudo pwsh -Command "Install-WSMan"
```

Once this is out of your way, you could create a session variable in your PowerShell instance that points to your test execution machine, and start the Atomic Red Team tests.
```powershell
# Setting a session in PowerShell
PS> $sess = New-PSSession -ComputerName testexecutionmachine -Credentials domain\username
```

## Using Invoke-AtomicTest - the real deal
First install the Execution Framework (`Invoke-AtomicTest`) and Atomics folder on the test execution management platform:
```powershell
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing);
Install-AtomicRedTeam -getAtomics
```
{{% alert note %}}
The imported `Invoke-AtomicTest` module will live as long as the current PowerShell session is a live. If you want to load the module on startup, you will need to set that in the [PowerShell profile](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles).
{{% /alert %}}
Once installed, you are ready to rock-n-roll.

{{% alert }}
However, here are a few commands to check out the library contents:
```powershell
PS> Invoke-AtomicTest All -ShowDetailsBrief
```
{{< figure src="/img/invoke-atomictest-example1.png" >}}

Say you wanted to know full details of all the tests related to **T1003 - OS Credential Dumping**[^9], you can do:
```powershell
PS> Invoke-AtomicTest T1003 -ShowDetails
```
{{< figure src="/img/invoke-atomictest-example2.png" >}}


**_hic sunt dracones (Here be dragons!)_** :dragon:

[^1]: https://atomicredteam.io/
[^2]: https://www.redcanary.com/
[^3]: https://atomicredteam.io/invokeatomic
[^4]: https://atomicredteam.io/atomictestharnesses
[^5]: https://atomicredteam.io/chainreactor
[^6]: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux
[^7]: https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse
[^8]: https://www.bloggingforlogging.com/2020/08/21/wacky-wsman-on-linux/
[^9]: https://attack.mitre.org/techniques/T1003/