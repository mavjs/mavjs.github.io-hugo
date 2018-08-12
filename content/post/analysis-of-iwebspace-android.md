+++
date = 2013-09-26T07:41:00
tags = ["Android", "Reverse-Engineering"]
title = "Analysis of iWebSpace Android Application"
+++

If you follow me enough on twitter ([@mavjs](https://twitter.com/@mavjs)), read my home page or follows my Fedora Ambassador wiki page, you'll probably know that I study at the [Asia Pacific University of Technology and Innovation](http://apu.edu.my/), Malaysia. This is my account of the n00b analysis done in my free time on the university's android application.

[iWebSpace android application](https://play.google.com/store/apps/details?id=edu.my.apiit.iWebSpace) is, as quoted from its non-working Google Play page, "The Asia Pacific University APP provides convenient access to important information and to most of our services in your hand" - pretty cool and convenient for most students.

The only thing in my mind was to do an analysis before actually using it and mostly because this is the first time the university's [Center of Technology and Innovation (CTI)](http://www.apu.edu.my/cti) - a R&D department, produced a mobile application. They have both an iPhone version and an android version. Since I don't own a Macbook, I couldn't do any analysis on the former version. And android was easier to read as I'm more familiar with Java. That being said about the app, let's see my n00b findings.

1) I acquired the .apk from a friend. (I think it's verion 1.0 and also I don't own an android)
2) Used [dex2jar](https://code.google.com/p/dex2jar/) to convert .apk to .jar.
3) Used [JD-GUI](http://jd.benow.ca/) to open and read the .jar file.

First thing on my mind after opening the .jar file with JD-GUI was to see how the application was authentication the students. So, I scrolled through the code and found a Login class. Inside that Login class, it has a doLogin() method that logs you into the system, once you've your student ID and password supplied. I took a closer look at it and guess what I found?

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_169.png" >}}

Yup, HTTP. Awesome. No comments there. Let's move along. Assuming, the majority of the students don't care about their student ID and password, this is pretty much fine, I guess. :P

The app has functions to show the students, their pending/paid fees, attendance, timetable and exam timetables. Pretty cool and convenient, definitely. So, I did further look at those functions. Firstly, let's look at Fee function. The Fee class has an onCreate() function, that sets up the view. Further look at it suggests that, it uses a md5 string + student ID to query the Fee status of a particular student. Have a look.

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_170.png" >}}

So, I took a closer look at the md5 string. The developers from CTI loves to keep their variable naming short (i, j, k, m, str1, str2). What does **str1** actually md5-ing?

``` text
int i is getting the YEAR
int j is getting the MONTH
int k is getting the DATE , which is day of the month
int m is getting the HOUR_OF_DAY
```

From the above, if you reconstruct the md5 string with the current datetime on my system (26-09-2013 15:00:00), you get the following:

```python 
    md5(26 + 9 + 'Student ID' + 2013 + 15) = "1640a3e25cc45123c5e234606aefbeb2"
```

This is the same for the attendance function. The timetable and exam schedule functions aren't that interesting, so I'll not write about it here. When reported about the above, the only reply was that they will secure the web services. Does that mean they will keep sending the student ID and password over plain HTTP? I've no idea. :D I looked at the Google Play store page for the app and found that it couldn't be found. What's up?

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_167.png" >}}

But the most interesting part about the whole app is the ActiveWebspace class. It seems to register the device using the application to the server so that they can see what's the count of devices using the app and to send push notifications to them. The server is registered with some unique regId, name and email to a web application residing at the following:

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_171.png" >}}

Once I found that URL, the only logical thing for me to do was to go one directory up, and see if I could find anything. And I did. This is what I found;

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_164.png" >}}

There was no authentication or whatsoever needed to access that, although they've 403'd the service after some hour that I reported about it. The reply they sent me was accordingly;

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_166.png" >}}

Cool story - "illustration purpose". But it seems the message box can be used to send push notification from the look of the JavaScript function they were using:

{{< figure src="/img/analysis-of-iwebspace-android_s1600_Selection_165.png" >}}

Hey, at least this isn't as bad as the iMessage Chat for android where it could possibly [download malicious](http://grahamcluley.com/2013/09/imessage-android-trust/) stuff, right? :P
I think I'll probably only use those services via web. Maybe some other day when I'm free, I'll try looking at the iPhone version and see what kind of stuff they coded in. XD
On another note, this was all done on a [Fedora 19](https://getfedora.org) laptop. Ciao!
