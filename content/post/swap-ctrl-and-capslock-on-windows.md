+++
title = "Swap Control and Caps Lock on Windows"
date = 2018-08-11T19:12:00
tags = []
+++
Whenever I finish installing a fresh operating system, be it Windows or a Linux distribution, I always remap ctrl and caps lock on my keyboard.
As I use the `Control` key a lot more than `Caps Lock`, I like having the former on the same line as my home row keys. So, this is what I normally do on Windows.

**Disclaimer:** I have only tested this on Windows 10.

### Manually editing the registry key 

* Open up the Windows `Run` prompt via pressing the `Windows` and `r` on the keyboard.
* Type `regedit` to bring up the **Registry Editor**.
* Navigate to `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout`
* Either edit `Scancode Map` or create it by pressing `Edit->New->Binary Value`
* Enter these values in `Scancode Map`:

```
00 00 00 00
00 00 00 00
03 00 00 00
1d 00 3a 00
3a 00 1d 00
00 00 00 00
```

#### Explanation for the values
1. The header version, which is always 0.
2. The header flag, which is always 0.
3. The sum of number of key entries to change and the extra NULL terminator line. In this case 2 key entries changed, therefore, 3.
4. Sends **LEFT CTRL** key code (`0x001d`) when pressing **CAPS LOCK** (`0x003a`)
5. Reverse of step 4, as we are swapping them around and not entirely disabling the use of caps lock.
6. NULL terminator line

This can also be put into a powershell script instead of manually editing the registry key as above. See the code below:
```
$hexified = "00,00,00,00,00,00,00,00,03,00,00,00,1d,00,3a,00,3a,00,1d,00,00,00,00,00".Spli(",") | % { "0x$_"};

$kbLayout = 'HKLM:\SYSTEM\CurrentControlSet\Control\Keyboard Layout';

New-ItemProperty -Path $kbLayout -Name "Scancode Map" -PropertyType Binary - Value ([byte[]]$hexified)
```

### References
Kudos to these answers on Stackoverflow.

* https://superuser.com/a/1264295
* https://superuser.com/a/997448
