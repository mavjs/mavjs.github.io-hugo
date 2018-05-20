+++
title = "Compiling Voxelands on Mac OSX"
date = "2014-09-26T22:25:00"
tags = ["game", "macosx", "voxelands"]
summary="Steps to get Voxelands - the Fun-Focused Free Software Voxel World Game; working on Mac OS X"
+++ 

# What is Voxelands?

[Voxelands](http://voxelands.com) - the Fun-Focused Free Software Voxel World Game. Voxelands is a sandbox construction game based on [Minetest](http://minetest.net), which was inspired by earlier "voxel world" games such as Infiniminer.

We already have the precompiled mac app for the latest stable release that you can install at: http://voxelands.com/downloads/voxelands-1408.00-osx.dmg

**Disclaimer:** The above **voxelands-1408.00-os.dmg** would still need the mentions dependencies installed from brew below, with the exception of git, cmake, Xcode, Xcode Command Line Tools. This post is mostly meant for people that want the latest new features in the development branch. I'm working on a proper mac app that wouldn't need to install dependencies, in the next release.

To start off with getting a voxelands-1408.00:next-os.dmg (which is the branch for the next release, where most fixes that didn't make it to the latest stable release gets committed to), you'd need a few more softwares to help. First off, you need `Homebrew - The missing package manager for OSX http://brew.sh, to install it

```shell-session
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

After installing brew, you need to install these dependencies (that
are in the brew repositories):

-  libpng
-  libvorbis
-  libogg
-  jpeg-turbo
-  gettext
-  irrlicht
-  git
-  cmake

Issue brew install on all of them

```shell-session
    brew install libpng libvorbis libogg jpeg-turbo gettext irrlicht git cmake
```

That will install the most needed dependencies for Voxelands on Mac OSX. But you will also need the [XQuartz](http://xquartz.macosforge.org/landing/) - A version of the X.Org X Window System that runs on Mac OSX, `[Xcode](https://developer.apple.com/xcode/downloads), [Command Line Tools for Xcode](https://developer.apple.com/downloads/index.action) and you can start compiling.

Get the voxelands source from git first (voxelands' former name was minetest-classic)

```shell-session
    git clone https://gitorious.org/minetest-classic/minetest-classic.git
    cd minetest-classic
    git checkout next
```
Let's start off with telling [cmake](http://www.cmake.org) - which is the cross-platform, open-source build system that Voxelands uses, about the extra dependencies that we installed via brew (do make sure you supply the correct paths with the versions).

```shell-session
    cmake -DIRRLICHT_INCLUDE_DIR=/usr/local/Cellar/irrlicht/1.8.1/include/irrlicht/ \
    -DIRRLICHT_LIBRARY=/usr/local/Cellar/irrlicht/1.8.1/lib/libIrrlicht.a \
    -DJPEG_INCLUDE_DIR=/usr/local/Cellar/jpeg-turbo/1.3.1/include \
    -DJPEG_LIBRARY=/usr/local/Cellar/jpeg-turbo/1.3.1/lib/libturbojpeg.a \
    -DBUILD_SERVER=0 -DRUN_IN_PLACE=0 \
    -DCUSTOM_GETTEXT_PATH=/usr/local/Cellar/gettext/0.19.2/ \
    -DCMAKE_OSX_ARCHITECTURES=x86_64 \-G Xcode .
```
It will make a **voxelands.xcodeproj** inside the git cloned project directory. Then we can build using Xcode commandline tools.

```shell-session
    xcodebuild -verbose -project voxelands.xcodeproj -target package
```
It tells xcodebuild command to build the project with target of package, which makes the .dmg file that we will get in the end, if it successfully compiles.

If you need help or just want to hang out, come onto our IRC channel [#voxelands at chat.freenode.net](http://webchat.freenode.net/?channels=%23voxelands&uio=d4)

**UPDATED:** forgot to add jpeg-turbo as one of the dependencies
