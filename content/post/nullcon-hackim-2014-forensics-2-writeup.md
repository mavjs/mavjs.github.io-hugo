+++
title = "[Nullcon HackIM 2014] Forensics 2 Writeup"
date = 2014-01-31T09:27:00
tags = []
+++

**Points: 200**

**Description: There was a zip file on the desktop. I can't remember the password for it.**

We saw a zip file named: **"null password.zip"** on the desktop. When
opened, there are 2 files which are encrypted. So it was clear that we
needed to crack the zip.

{{< figure src="/img/nullcon-hackim-2014-forensics-2-writeup_s1600_Selection_271.png" >}}

First we looked at some hints from the challenge creator ;)

{{< tweet 426989036436078592 >}}

{{< tweet 426968851012530176 >}}


So, [Beard-0](https://twitter.com/Maxthatsme) looked at a freshly booted VM of the image (since I was lazy + forgot to save the initial snapshot and was already working on another Forensic challenge) and looked at the Temp folder in AppData/Local, there he found a folder name **Rar$DI99.160** inside which had one of the file **"Null final1.pdf"**. From this we looked at known attacks on zip files and found https://en.wikipedia.org/wiki/Known-plaintext_attack

{{< figure src="/img/nullcon-hackim-2014-forensics-2-writeup_s1600_Selection_272.png" >}}

We zipped the **"Null final1.pdf"** into a zip. Installed the evaluation edition of Ultimate Zip Cracker - http://download.cnet.com/Ultimate-ZIP-Cracker/3000-2092_4-10040839.html

{{< figure src="/img/nullcon-hackim-2014-forensics-2-writeup_s1600_Selection_273.png" >}}

 Selected the "Plaintext attack" recovery method.

{{< figure src="/img/nullcon-hackim-2014-forensics-2-writeup_s1600_Selection_274.png" >}}

Chose the "Null final1.pdf" zip file as plaintext file.

{{< figure src="/img/nullcon-hackim-2014-forensics-2-writeup_s1600_Selection_275.png" >}}

And finally we had the unzip'd archive.
