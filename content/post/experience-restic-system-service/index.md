---
title: "Experience Restic System Service"
subtitle: ""
summary: "The author's experience setting up offsite and local backup using restic backup program."
authors: []
tags: []
categories: []
date: 2022-07-24T17:24:26+02:00
draft: true
# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: "Photo by [Benjamin Lehman](https://unsplash.com/@benjaminlehman) on [Unsplash](https://unsplash.com)"
  focal_point: ""
  preview_only: false
  alt_text: Magnetic hard disk open with the head and platter showing.

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
Ever since I read the [Automate backups with restic and systemd](https://fedoramagazine.org/automate-backups-with-restic-and-systemd/) on [Fedora Magazine](https://fedoramagazine.org), I have been meaning to practice the `3-2-1` backup strategy.

For a while, that did not come to fruition. Ultimately, that was down to laziness first of all; secondly, figuring out how and where the backups should be was also another struggle.

However, I finally sat down one weekend and figured out the works.

## What is the `3-2-1` backup strategy?
The `3-2-1` strategy boils down to[^1]:
* **3** copies of data
* **2** different media
* **1** copy being off-site

The tutorial in the Fedora Magazine showcased how one can use `restic` and trigger the backup periodically via a systemd service unit file, instead of using cron. This also gave me the opportunity to learn a bit more about creating systemd service and timer units, so I decided to follow this.

However, the tutorial made use of an offsite backup solution provided by [BackBlaze B2 Cloud stoage](https://www.backblaze.com/b2/cloud-storage.html). That solution was not one I was comfortable using just yet.

Mainly due to not wanting to use a service that did not provide Unix/Linux native tools, such as `ssh`, `rsync` and or `sftp` capabilities.

Therefore, I came up with these requirements:
* 1 x local LAN server backup
* 1 x local drive backup
* 1 x Unix/Linux native tool capable offsite backup

### LAN server backup
This one was pretty easy, I already had a desktop computer which I use as a Virtual Machine host, that was connected via [tailscale](https://tailscale.com/) and had a lot of disk space using traditional hard disks.

So all I had to do was initialise a folder on this host via restic using SFTP as described in: https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#sftp

**_Problem #1 solved!_**

### Local drive backup
My laptop is connected to a dock and has a couple of USB-C. I also had a couple of external storage drives, especially the Samsung Portable SSD T7 - 1TB drive.

So all I had to do was make sure that the backup service runs `if and only if` this drive was mounted.

**_Problem #2 solved!_**

In fact, this already in some way, satisfies #1 + #2 of the `3-2-1` strategy.

However, I still needed to make the similar copy backed up offsite. As per my requirements #3, BackBlaze B2 was off the list, sadly. :face_with_head_bandage:

A while back, I read an article titled [Interview with John Kozubkik](https://console.dev/interviews/rsync-john-kozubik/) - John is the CEO of rsync.net which is a cloud storage in the form of a UNIX filesytem available over SSH. Ever since then I have been meaning to use this service somehow.

So for my #3 requirement, I researched using rsync.net and luckily enough, they have a special pricing for restic - https://rsync.net/products/restic.html

Not only that what makes restic interesting is that:
> there is no app or API - it simply gives you an empty UNIX filesystem accessible with any SSH tool. 

P-e-r-f-e-c-t!

So let's piece the things together.

## Systemd service and timer units
Systemd services can be triggered periodically by Systemd timer units. This separates the actual command / script that does the work with the timer configuration. I consider this to be neat!



[^1]: https://www.veeam.com/blog/321-backup-rule.html