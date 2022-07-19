+++
title = "[Nullcon HackIM 2014] Forensics 5 Writeup"
date = 2014-01-27T15:24:00
tags = []
+++

I play security competitions called Capture The Flag (CTF) with a
group called [Glider Swirley](http://gliderswirley.org)

**Points: 500**
**Description: The client says that the system was compromise. There was no evidence found for the same. The client claims that some anti-forensics tool was used to remove the evidences. Our investigator agrees to it. Can you find out what was the command that was executed and at what time it was done?**

There was a hint for it by one of the organizers.

{{< tweet user="boonlia" id="427135133129269248" >}}

Since all the forensics challenges were based on 1 VM image, it was already known that the image is Windows 7 SP1 x86, thus the profile to use for volatility - https://code.google.com/p/volatility/ was **Win7SP1x86**. So I acquired the memory dump of the system (MEMORY.DMP)

As this was the first time we (me & [Beard-0](https://twitter.com/Maxthatsme)) had to use volatility, I tried to get familiar with it by looking at the process list. Issued with

```shell-session
    [nullcon-2014] >>> % vol.py -f MEMORY.DMP --profile=Win7SP1x86 pslist
```

Showed a few processes. But clearly by that I knew it wasn't show me anything about a command being executed or a process crashing. Beard-0 looked through a few usage of volatility and found **cmdscan**. So I tried it out.

```shell-session
    [nullcon-2014] >>> % vol.py -f MEMORY.DMP --profile=Win7SP1x86 cmdscan 
    Volatility Foundation Volatility Framework 2.3.1
    **************************************************
    CommandProcess: conhost.exe Pid: 2200
    CommandHistory: 0x292a70 Application: TPAutoConnect.exe Flags: Allocated
    CommandCount: 0 LastAdded: -1 LastDisplayed: -1
    FirstCommand: 0 CommandCountMax: 50
    ProcessHandle: 0x58
    **************************************************
    CommandProcess: conhost.exe Pid: 2996
    CommandHistory: 0x5f04f8 Application: cmd.exe Flags: Allocated, Reset
    CommandCount: 2 LastAdded: 1 LastDisplayed: 1
    FirstCommand: 0 CommandCountMax: 50
    ProcessHandle: 0x58
    Cmd #0 @ 0x5ed400: cd desktop
    Cmd #1 @ 0x5f4730: sdelete -c -z c:
    Cmd #36 @ 0x5c00c4: ^?_?\???\
    Cmd #37 @ 0x5ed108: _?\????
    **************************************************
    CommandProcess: conhost.exe Pid: 2996
    CommandHistory: 0x5f0698 Application: sdelete.exe Flags: Allocated
    CommandCount: 0 LastAdded: -1 LastDisplayed: -1
    FirstCommand: 0 CommandCountMax: 50
    ProcessHandle: 0x50
```

So it seems the process we want is **sdelete -c -z c:**, but the flag format requires, the command and the time. So definitely it seems, we need a screenshot of when the process crashed. Now does volatility have a screenshot feature? Well, since it's so awesome it does.

```shell-session
    [nullcon-2014] >>> % vol.py -f MEMORY.DMP --profile=Win7SP1x86 screenshot --dump-dir shots/
```

It just needs a directory to dump the screenshots and voila, one of
the screenshots shows up:
{{< figure src="/img/nullcon-hackim-2014-forensics-5-writeup_s1600_session_1.WinSta0.Default.png" >}}
