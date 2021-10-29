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
* pfSense acts as the router and the firewall - rules are set to disallow communication with the Internet, unless explicitly allowed.
* Windows Server Domain Controller provides DHCP and DNS for internal domain.
* RHEL 8 server running Splunk 8 - for centralised logging.
* Fedora 34 client as administrator workstation - allowed to connect to the Internet. Main test execution managedment platform.
* Windows 10 client - main test execution host.

**_hic sunt dracones (Here be dragons!)_** :dragon:

[^1]: https://atomicredteam.io/
[^2]: https://www.redcanary.com/
[^3]: https://atomicredteam.io/invokeatomic
[^4]: https://atomicredteam.io/atomictestharnesses
[^5]: https://atomicredteam.io/chainreactor