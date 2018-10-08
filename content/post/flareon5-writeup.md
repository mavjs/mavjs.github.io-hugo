+++
title = "2018 FLARE-On Challenges Writeup"
date = 2018-10-08T19:42:33+02:00
draft = false

# Authors. Comma separated list, e.g. `["Bob Smith", "David Jones"]`.
authors = []

# Tags and categories
# For example, use `tags = []` for no tags, or the form `tags = ["A Tag", "Another Tag"]` for one or more tags.
tags = ["Reverse Engineering"]
categories = []

# Featured image
# Place your image in the `static/img/` folder and reference its filename below, e.g. `image = "example.jpg"`.
# Use `caption` to display an image caption.
#   Markdown linking is allowed, e.g. `caption = "[Image credit](http://example.org)"`.
# Set `preview` to `false` to disable the thumbnail in listings.
[header]
image = "0-flareon.png"
caption = "Hackers Gonna Hack"
preview = true
+++
I decided to participate in this year's edition of [FLARE-On challenge](https://www.fireeye.com/blog/threat-research/2018/08/announcing-the-fifth-annual-flare-on-challenge.html). It is made by the fine folks from FireEye Labs Advanced Reverse Engineering (FLARE) team.

I wanted to see how far I could go. I did not set any goals nor did I took it as seriously as I would have liked.

{{< figure src="/img/1-flareon.png" >}}

The challenge is now over and I only managed to make it to the 2 challenge, as expected (you can see the reason why above :laughing: ). Let's get on with the challenges.

# Minesweeper Championship Registration
Simple challenge. Once you open the zipped file, you'll get a `jar` file.

These days I mostly use [Bytecode Viewer](https://bytecodeviewer.com/) when it comes to `APK` or `jar` files.
Once you open the challenge `jar` file with it and navigate to the only class file in there you'll see the following code:

{{< figure src="/img/2-flareon.png" >}}

Rest is history! :wink:

# Ultimate Minesweeper
Boy, was I in for a challenge with this one. :sweat_smile:

Figured out it was a `.NET` binary and remembered a friend of mine talking about their experience decompiling them a few months back, I took this opportunity to try it out.
There might have been an easier way than what I will be describing below:

* Opened up the binary using *Jetbrains*'s [dotPeek](https://www.jetbrains.com/decompiler/).
* Exported it to a Visual Studio project.

{{< figure src="/img/3-1-flareon.png" >}}

* Opened up the solution/project with Visual Studio.
* Started looking into the main class.
* Found a function `SquareRevealedCallback` that is used as a callback after each click on the minefield tiles.

{{< figure src="/img/3-2-flareon.png" >}}

* Got to another function `BombRevealed` that checks if any minefields were revealed, which returns `true` or `false` to the callback function above.

{{< figure src="/img/3-3-flareon.png" >}}

* Modified the `if` statement in `BombRevealed` as below and rest is some clicking. :laughing:

```C#
if (!this.MinesPresent[index2, index1])
{
    System.Console.WriteLine(index1 + 1);
    System.Console.WriteLine(index2 + 1);
}
```

{{< figure src="/img/3-4-flareon.png" >}}

Definitely going to hone my skills before next year's FLARE-on challenge! :muscle: :sunglasses:

Also check out a more in-depth thorough writeup of the challenges from the authors: https://www.fireeye.com/blog/threat-research/2018/10/2018-flare-on-challenge-solutions.html
