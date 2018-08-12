+++
title = "Running GUI apps from Fedora Docker containers"
date = 2015-05-10T15:50:00
tags = []
+++

After reading [Jessie Frazelle](https://twitter.com/jessfraz)'s [Docker Containers on the Desktop](https://blog.jessfraz.com/post/docker-containers-on-the-desktop) post I was quite interested in making some Fedora image based docker containers for some apps I want to use.<!--more-->

Ones, I wouldn't normally install on my main machines, like Google Chrome with the Google Talk plugins and flash. So, I did make one with chrome and the talk plugin and followed the guide on Jessie's blog to run the GUI app, it worked, *but* there was no sound.

But of course, I forgot Fedora use PulseAudio, so I looked for a solution on the internet as usual and stumbled upon a stackoverflow question: [qt - run apps using audio in a docker container](https://stackoverflow.com/questions/28985714/run-apps-using-audio-in-a-docker-container) and now has a working Fedora docker container which runs Google Chrome with the Google Talk plugin.

Dockerfile:

    FROM fedora:latest
    MAINTAINER "Ye Myat Kaung (Maverick)" <mavjs@mavjs.org>

    RUN yum install https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm -y && \
    yum install https://dl.google.com/linux/direct/google-talkplugin_current_x86_64.rpm -y

    ENTRYPOINT [ "/usr/bin/google-chrome" ]
    CMD [ "--user-data-dir=/data"] 

Docker command to run container:

    sudo docker run -it --rm\
        --net host \
        --cpuset 0 \
        --memory 512mb \
        -v /tmp/.X11-unix:/tmp/.X11-unix \
        -e DISPLAY=unix$DISPLAY \
        -v /dev/snd:/dev/snd --privileged \
        -v /dev/shm:/dev/shm \
        -v /etc/machine-id:/etc/machine-id \
        -v /var/lib/dbus:/var/lib/dbus \
        -v /run/user/`id -u`/pulse/native:/run/user/`id -u`/pulse/native \
        -v ~/.pulse:/home/$dockerUsername/.pulse \
        --name chrome \
        mavjs/chrome

My Fedora Dockerfiles can be found on my github & docker images on docker registery: [fedora-dockerfiles](https://github.com/mavjs/fedora-dockerfiles) & [docker hub](https://hub.docker.com).
