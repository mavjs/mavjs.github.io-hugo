+++
title = "Spotify on Fedora 21 via wine"
date = 2015-04-06T00:56:00
tags = []
draft = true
+++


Install wine:

```shell-session
    # sudo yum install wine
```

Download Spotify Windows Installer from https://www.spotify.com/us/download/windows/.

Run the installer with wine:

```shell-session
    # cd ~/Downloads/
    # wine SpotifySetup.exe
```

After the installation completes, we need to disable a Windows libraries to make it work:

```shell-session 
    % winecfg ~/.wine/drive_c/users/<your linux username>/Application Data/Spotify/SpotifyLauncher.exe
```

It will launch the **Wine configuration** window. Go to **Libraries** tab, select **dwrite** in the **New override for Library** list. And select it from the **Existing overrides** and press **Edit** to disable it. As shown in pic:

{{< figure src="/img/Wineconfig.png" title="Wine configuration window" >}}
