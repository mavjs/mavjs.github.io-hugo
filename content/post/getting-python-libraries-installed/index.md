+++
title = "Getting Python Libraries Installed The Normal Way on Windows"
date = 2012-05-10T00:38:00
tags = []
+++

I've been using GNU/Linux distributions for almost 2 years and with [Fedora](https://fedoraproject.org) for about ~7-8 months. 

Every single day I do some experiments with [python](http://python.org), and every single time it makes me feel comfortable using Fedora to write scripts. It removes headaches from happening because I don't have to figure out ways to install python libraries you need. I can just go forward with concentrating on coding.

There's a little script I wrote called; *[ucti-timetable](https://github.com/mavjs/ucti-timetable)*. It's used to download timetables from my university and store them locally. But since a large user base from my university are windows users, I had to make it work on windows as well. Well, to be honest it works, but only one thing:

**PAIN!!**

It's so painful to install a python library on windows. It fails most of the time...why is that?, you ask me..

Well, it's because the python executable path is not in your $PATH. dafuq, right? So, yeah, this is how you do it (based on Windows 7):

```Right click -> My Computer -> Properties -> Advanced System Settings -> Advanced tab ->Environment Variables -> System Variables```

after that find ```PATH``` and append this or equivalent (depending on where your python gets installed): ```C:\Python27\```

Only after you do this you could install [BeautifulSoup](http://www.crummy.com/software/BeautifulSoup) the *"normal"* way

``` python setup.py install```

Insane, right?
