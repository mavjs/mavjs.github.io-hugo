+++
title = "Fedora 21 Workstation HiDPI on retina macbook pro"
date = 2015-04-06T02:10:00
tags = []
summary="""
Configuration options to get some third-party apps working nicely with HiDPI on
Fedora 21
"""
+++

I've been happily using F21 since it's release announcement on [Fedora Magazine](https://fedoramagazine.org/announcing-fedora-21),especially with the support for high resolution displays (HiDPI) since I've been converted back to using Fedora full time on my retina macbook pro. Although most of the GNOME apps work on my retina display, browsers and third-party apps are still lacking. Web pages' fonts seems too tiny and I've to zoom in on them to see them better all the time.

But recently I came across a nice resource - https://wiki.archlinux.org/index.php/HiDPI about enabling HiDPI support on various apps. Mostly my main used apps daily are **Firefox**, **Chromium** and I've been trying to use [pycharm](https://www.jetbrains.com/pycharm) (& various JetBrains apps) but with HiDPI everything seems so small, so as suggested in the wiki, I changed my settings as follows:

On Firefox (play around with the value):

    about:config -> layout.css.devPixelsPerPx -> 1.5

Thunderbird (same as Firefox):

    Edit -> Preferences -> Advanced -> Config Editor -> layout.css.devPixelsPerPx -> 1.5

PyCharm and any JetBrains products (the file should be in **bin** sub 
directory in the folder you extracted the app):
    
    <appname|appname64>.vmoptions -> -Dhidpi=true

{{< figure src="/img/CLionBefore.png" title="CLion before HiDPI tweak" >}}

{{< figure src="/img/CLionAfter.png" title="CLion after HiDPI tweak" >}}
