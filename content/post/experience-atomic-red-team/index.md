---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "First time experience with Atomic Red Team"
subtitle: ""
summary: "The author's experience using Atomic Red Team for the first time inside a closed off domain-joined lab."
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
# What is Atomic Red Team?
> Atomic Red Team&trade; is a library of simple tests mapped to the MITRE ATT&CK&reg; framework that every security team can execute to test their defenses. Tests are focused, have few dependencies, and are defined in a structured format that can be used by automation frameworks.[^1] - RedCanaryCo

Atomic Red Team is the main testing repository in the Atomic Family, first created by the esteemed folks from Red Canary.[^2] The Atomic Family also provides a couple of utility tools to help execute the tests, namely:
* Invoke-AtomicRedTeam - A PowerShell-based framework for developing and executing atomic tests.[^3]
* AtomicTestHarnesses - A PowerShell module for executing many variations of an attack technique at once.[^4]
* Chain Reactor - A tool for testing detection and response coverage on Linux machines.[^5]

In this post it will only be about Atomic Red Team - the library of tests & `Invoke-AtomicRedTeam` - the powershell framework to run the tests.

## Security Monitoring and role of testing defenses
Security monitoring involves collection and analysis of information to detect suspicious behaviour and or unauthorised system changes on an organization's network. This includes defining what types of behaviour and changes should trigger (an) alert(s), and what actions are to be taken.

Think of it this way, just because an organization has put up gates around the building and also have guards, does not mean other essential entrances are without locks. There would still be regular maintenance on the physical structures of the gates, door locks, reviewing of policies and background checks of guards, etc.
Similar here, just because there are network and host security monitoring setup with triggers and actions for alerts defined, the work does not stop here. The organization will have to stay up to date with new vulnerabilities, techniques and regularly reassess whether those triggers and or actions are enough.

This is where a test framework like Atomic Red Team comes in, especially, for organizations that cannot spend a lot of resources around research on vulnerabilities and techniques, can make use of such a test framework to help in developing more security monitoring alert triggers, use cases or to create tests for already deployed triggers to make sure those work as intended regularly.

# Lab Overview
{{< figure src="/img/lab-example.png" >}}
* pfSense acts as the router and the firewall - rules are set to disallow communication with the Internet, unless explicitly allowed.
* Windows Server Domain Controller provides DHCP and DNS for internal domain.
* RHEL 8 server running Splunk 8 - for centralised logging.
* Fedora 34 client as administrator workstation - allowed to connect to the Internet. Main test execution management platform.
* Windows 10 client - main test execution host.
{{% alert note %}}
For this test, an existing lab was reused, which is closed off of from the Internet. This may not have been the most convenient setup as Atomic Red Team downloads certain scripts from the repo for execution, thus not all tests might run properly.
{{% /alert %}}

# Setting up pre-requisites
To execute tests remotely from a Linux machine (which was done here), it requires PowerShell core to be installed.[^6]

## Setting up openssh remoting
OpenSSH[^7] remoting feature now built-in to Windows can also be used here. This feature is available in:
* Windows 10
* Windows Server 2019
* Windows Server 2022

Steps to enable:
* Right-click Windows Icon
* Click `Settings`
* Select `Apps > Apps & Features > Optional Features`
* Find `OpenSSH Server`
* Click `Install`

To connect to the machine, execute:
```bash

$ ssh username@machine-ip

```

{{% alert note %}}
From observation, a machine that is joined to a domain (other than `WORKGROUP`), the way to connect is slightly different. Like so:
```bash
$ ssh domain\\username@machine-ip
```
{{% /alert %}}


## PSWSMan module for WinRM PSRemoting on Linux
{{% alert warning %}}
In this test, WinRM remoting was used as the author encountered a problem with using the SSH remoting feature. It may have something to do with passing in the domain with the username and `New-PSSession` not being happy about it.
Although, it works if using plain old `ssh` command as seen above.
{{% /alert %}}
To use WinRM remoting feature on Linux, `PSWSMan` module needs to be installed.[^8]

To do so:
```bash
$ sudo pwsh -Command "Install-Module -Name PSWSMan"
$ sudo pwsh -Command "Install-WSMan"
```

Once this is out of the way, a session variable in a PowerShell instance that points to the test execution machine can be created, and start the Atomic Red Team tests.
```powershell

  # Setting a session in PowerShell
  PS> $sess = New-PSSession -ComputerName testexecutionmachine -Credentials domain\username

```
{{% alert note %}}
If SSH remoting worked, a session can be created as follows:
```powershell
  PS> $sess = New-PSSession -HostName testexecutionmachine -UserName username
```
{{% /alert %}}

# Test Execution - the real deal
First install the Execution Framework (`Invoke-AtomicTest`) and Atomics folder on the test execution management platform:
```powershell

  IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing);
  Install-AtomicRedTeam -getAtomics

```
{{% alert note %}}
The imported `Invoke-AtomicTest` module will live as long as the current PowerShell session is alive. Tp load the module on startup, it needs to be set in the [PowerShell profile](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles).
{{% /alert %}}
Once installed, it is time to rock-n-roll.

{{% alert warning %}}
The screenshots below are made on a Windows machine, as PowerShell does not seem to display all info when calling via `-ShowDetails` argument on a Linux machine.
{{% /alert %}}
However, here are a few commands to check out the library contents:
```powershell

  PS> Invoke-AtomicTest All -ShowDetailsBrief

```
{{< figure src="/img/invoke-atomictest-example1.png" >}}

To know the full details of all the tests related to **T1003 - OS Credential Dumping**[^9]:
```powershell

  PS> Invoke-AtomicTest T1003 -ShowDetails

```
{{< figure src="/img/invoke-atomictest-example2.png" >}}

From the details above, it shows that there are multiple test cases associated with **T1003**, and it also notes the dependencies for running the test. So let's get the dependency for test number #2 - Credential Dumping with NPPSpy.
```powershell

  PS> Invoke-AtomicTest T1003 -TestNumbers 2 -GetPrereqs

```
{{< figure src="/img/invoke-atomictest-example3.png" >}}
{{% alert warning %}}
In the above figure, the downloading of the prerequisite dependecy failed, as the machine is not allowed to connect to the Internet.
{{% /alert %}}

After transferring over the dependecy file into `C:\Users\<username>\AppData\Local\Temp`, it is finally good to run the test again.
```powershell
  
  # Executing it remotely now
  PS> Invoke-AtomicTest T1003 -Session $sess -TestNumbers 2

```
It will do it's magic in the background, and let the user know what needs to be done next:
{{< figure src="/img/invoke-atomictest-example4.png" >}}

As recommended, log out and log back in, and voilà! Credentials were dumped:
{{< figure src="/img/invoke-atomictest-example5.png" >}}

Once the tests are done, it is time to clean it up. There is also an argument to do so:
```powershell

  PS> Invoke-AtomicTest T1003 -Session $sess -TestNumbers 2 -Cleanp

```
Once the clean-up command runs, it will delete the file with credentials at `C:\NPPSpy.txt` and the dll which was copied to `C:\Windows\System32\NPPSpy.dll`:
{{< figure src="/img/invoke-atomictest-example6.png" >}}

# Summary
If it were not for a roundabout way of doing things and just running it on a single VM setup with Internet access allowed, it should have been a bit more smooth sailing.
However, all in all, the easy of use combined with the curated list of dependencies needed to accomplish a test is a huge win.

There are not a lot of technologies involved in setting it up either, just copy and paste the commands in the wiki and it's ready to go.

Next post(s) will go through a few attack scenarios that require running multiple steps of tests based on Threat Intel report(s), run the tests that correponds to them and understand what the logs tell us.

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