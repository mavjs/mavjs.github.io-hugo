---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Process Injection"
subtitle: "The inner workings of a simple process injection"
summary: "The author's take on a simple and well known process injection technique; what it is, how it works from both offensive and defensive spectrums."
authors: []
tags: []
categories: []
date: 2022-12-29T00:28:38+01:00
lastmod: 2022-12-29T00:28:38+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: "Photo by [Kind and Curious](https://unsplash.com/it/@kindandcurious) on [Unsplash](https://unsplash.com/)"
  focal_point: ""
  preview_only: false
  alt_text: A road sign showing detour with the arrow pointing to the right.

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
Process Injection is a technique of running custom code within the address space of another process. There are multiple different variations of process injection[^0] and these are documented as part of the MITRE ATT&CK framework[^1]. There are about 12 different documented process injection (sub-)techniques as of 2022.

This article will talk about the classic well known process injection technique known as portable executable (PE) process injection; how does it work? how can it be used? how can it be detected? All from different perspective of an offensive and a defensive view.

## How does it work?
**PE injection** is performed by copying a piece of code (possibly without it storing a file on disk) into the virtual address space of the target process, and then invoking that piece of code via a new thread.

## Why is this useful?
This allows the piece of code access to the process's memory, resources and privileges as well as evade detection by way of hiding its intention behind a legitimate process.

[^0]: https://attack.mitre.org/techniques/T1055/
[^1]: MITRE ATT&CK framework is a knowledge base of adversary tactics and techniques. It is used as a foundation for development of threat models and methodologies, etc.