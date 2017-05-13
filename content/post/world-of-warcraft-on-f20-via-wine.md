+++
title = "World of Warcraft on Fedora 20 via wine"
date = "2014-11-14T14:26:00"
tags = ["game", "Fedora", "wine"]
summary="""
Install steps to get World of Warcraft on Fedora 20 working via wine.
"""
+++

Install wine:

```shell-session
    # sudo yum install wine
```

Download World of Warcraft Setup Installer from https://us.battle.net/account/download/?show=wow.

Run the installer with wine:

```shell-session
    # cd ~/Downloads/
    # wine World-of-Warcraft-Setup-enGB.exe
```

After the installation completes, it will ask you to login to your Battlenet Account. Instead, quit the application. Then tell it to use software rendered OpenGL by executing (it has a bug where the interface is just black canvas on some intel cards):

```shell-session 
    % export LIBGL_ALWAYS_SOFTWARE=1
    % wine ~/.wine/drive_c/Program\ Files\ (x86)/Battle.net/Battle.net\ Launcher.exe
```

Battlenet actually allows you to play even though it hasn't finished downloading if it has reached a certain downloaded size. Either wait to finish or open the game. When you run it the first time it will take a while and FPS is not that great. Quit the game. Modify **SET gxApi "D3D9"** to **SET gxApi "Opengl"** in the following file:

```shell-session
    $ ~/.wine/drive_c/Program\ Files\ (x86)/World\ of\ Warcraft/WTF/Config.wtf
```

After that your game should work in decent FPS.

**Disclaimer**: 

- Have not tried the gameplay yet, since my subscription expired. :-(
- Fedora 20 running on a 13", 2.8Ghz retina macbookpro, 2013 edition.

Sources

- https://appdb.winehq.org/objectManager.php?sClass=version&iId=30545
- http://www.webupd8.org/2014/10/partial-workaround-for-black-distorted.html
