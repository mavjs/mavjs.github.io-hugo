---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Contributing to Kali Linux using a toolbox on Fedora"
subtitle: ""
summary: "A Fedora user uses a toolbox container to contribute a patch to Kali Linux package."
authors: []
tags: []
categories: []
date: 2020-11-14T22:24:11+01:00
lastmod: 2020-11-14T22:24:11+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
# <span>Photo by <a href="">Tekton</a> on <a href="">Unsplash</a></span>
image:
  placement: 3
  caption: "[Open Container Toolbox logo.](https://github.com/containers/toolbox/tree/master/data/logo)"
  focal_point: ""
  preview_only: true
  alt_text: Open Container Toolbox logo.

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
## Background
While working on [Penetration Testing with Kali Linux (PWK)](https://www.offensive-security.com/pwk-oscp/) training offered by [Offensive Security](https://www.offensive-security.com/), I came across a tool called [`smtp-user-enum`](http://pentestmonkey.net/tools/user-enumeration/smtp-user-enum). It is a perl script to enumerate OS-level user accounts on Solaris via the SMTP service (sendmail).

In its usage documentation, it mentions an option to pass a list of hostnames running the SMTP service via a file, to use for enumeration. When trying out that option, I noticed that it didn't work. Upon taking a close look at the script, I noticed that although it looks for the option `-T` in the arguments list[^0], it was never part of the `getopts` evaluation[^1], thus erroring out.

As it stands, I do not like having SSH keys tied to GitHub/Gitlab accounts on my Kali Linux virtual machine, so instead, I found a way to use a Debian container via [`toolbox`](https://github.com/containers/toolbox) on my regular workstation using Fedora, to create the necessary patches to conform to Debian packaging standards and submitting a pull request on [Kali Linux's `stmp-user-enum` package repo](https://gitlab.com/kalilinux/packages/smtp-user-enum).

This post recounts of the steps I used, in case someone finds it useful or for my own reference in the future.

**Note:** _I chose to use a Debian image here as I plan to work on other things via the same toolbox. We could have chosen to use [Kali Linux docker image](https://hub.docker.com/r/kalilinux/kali) instead as well._

# The Details
## How `toolbox` works
We can create the first "toolbox" by invoking `toolbox enter` on Fedora. This will use the same Fedora version as our running host. That is, if the running host is `Fedora 33`, it will download the same container image via [https://registry.fedoraproject.org](https://registry.fedoraproject.org).

However, we will see that the registry does not have a Debian image from which we can work from.

## Using Debian Docker image
Toolbox uses `podman`[^2] in the background instead of docker. However, we can still pull a [Debian docker image](https://hub.docker.com/_/debian) from Docker Hub.

First create a Debian "toolbox" named "debtest" as follows:
```bash
toolbox create -c debtest --image docker.io/debian:testing
```

Once it has finished downloading the docker image, we can enter the toolbox as:
```bash
toolbox enter debtest
```

We notice that we have entered our toolbox via the change in shell prompt:
```bash
⬢[user@toolbox ~]$
```

## Creating the patch
Here we will use the Debian [`git-buildpackage` (gbp)](https://packages.debian.org/search?keywords=git-buildpackage) (Found a nice guide on `gbp`[^3] mentioned in another pull request[^4]) to create and apply our changes according to Debian packaging standards.
So install the package:
```bash
sudo apt install git-buildpackage -y
```

Fork the `smtp-user-enum` package on Gitlab.
Clone the forked repository and enter the directory:
```bash
git clone git@gitlab.com:<your-username>/smtp-user-enum.git && cd smtp-user-enum
```

Create our feature branch:
```bash
git checkout -b getopts-Targets-file
```

Apply the previous patches by executing:
```bash
gbp pq import
```

This will move us to a patch queue branch called `patch-queue/getopts-Targets-file`.
We can check this by running:
```bash
git branch
```

Now we can create our changes and commit them.
Afterwards, we regenerate the patches in `debian/patches/` by running:
```bash
gbp pq export
```

This will drop us back into our original branch `getopts-Targets-file`.
Now we add `debian/patches` to git and commit them:
```bash
git add debian/patches
git commit
```

Then push those changes to your repository:
```bash
git push -u origin getopts-Targets-file
```

And then we create a pull request at the original repository, wait for the Gitlab CI jobs to run and turn green, and hope that one of the Kali Linux developers merges it. :smile:
[^0]: https://gitlab.com/kalilinux/packages/smtp-user-enum/-/blob/kali/master/smtp-user-enum.pl#L98
[^1]: https://gitlab.com/kalilinux/packages/smtp-user-enum/-/blob/kali/master/smtp-user-enum.pl#L87
[^2]: https://podman.io/
[^3]: https://honk.sigxcpu.org/projects/git-buildpackage/manual-html/gbp.patches.html
[^4]: https://gitlab.com/kalilinux/packages/smtp-user-enum/-/merge_requests/1
