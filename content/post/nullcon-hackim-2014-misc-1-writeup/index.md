---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "[Nullcon HackIM 2014] Misc 1 Writeup"
subtitle: ""
summary: ""
authors: []
tags: []
categories: []
date: 2014-01-27T20:02:01+08:00
lastmod: 2014-01-27T20:02:01+08:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

***Disclaimer:** This post was orginally posted on apucsfc.org[^0], which was a university security club where the author was a part of the CTF team and wrote this post back in 2014.*

**Points: 100**

**Description: Sam has parked his car in front of a store. Find the name of the store.**

**File: Level 1.pcap**

As the usual, opened up the pcap file with wireshark. Looked around for some packet data that were interesting. Found an HTTP packet that had an image data in it. Exported the data by clicking `File->Export Objects->HTTP`, select the packet and save it as `.png`. And we get this image.

{{< figure src="/img/nullcon-hackim-2014-misc-1-writeup_carved-file.png" >}}

First tried looking at hex and fiddling with the colours. Then, read the description again and thought of GPS, so we looked into the metadata of the image using ImageMagick’s `identify` tool.
```
$ identify -verbose blah2.png
```
Got the stuff below (snipped).

```
Properties:
date:create: 2014-01-27T19:46:46+08:00
date:modify: 2014-01-27T19:46:46+08:00
exif:GPSAltitude: 100000/100
exif:GPSAltitudeRef: 0
exif:GPSInfo: 46
exif:GPSLatitude: 38/1, 51598/1000, 0/1
exif:GPSLatitudeRef: N
exif:GPSLongitude: 77/1, 3371/1000, 0/1
exif:GPSLongitudeRef: W
exif:GPSMapDatum: WGS-84
exif:GPSVersionID: 2, 2, 0, 0
```
Converted the 2 GPS coordinates to proper ones that map applications could use. `38.859967,-77.056183`. Put that into Google Maps and got the following;

{{< figure src="/img/nullcon-hackim-2014-misc-1-writeup_sam-car.png" >}}

[^0]: The domain has ceased to exist for a while, possibly until about 2017. You can find the archive of it here: https://web.archive.org/web/20161026194658/http://www.apucsfc.org/nullcon-hackim-2014-misc-1-writeup/
