+++
title = "Zsh Autocomplete Function to change and auto complete directories' name"
date = 2012-10-27T05:01:00
tags = ["Zsh"]
+++

About some weeks ago, I was trying to find a way to alias my favourite directory (~/Programming/Pythons) in zsh, and it should show me the directories contained inside it. But aliasing doesn't work, except to ```cd``` me to that directory. Or a function can help me get into the directories inside ~/Programming/Pythons but I'd have to type out the directories' name manually. That wasn't an option either. 

So I turned to "Uncle Google" :P for it. Also what I remembered from Zsh is that it's auto completion is really awesome. So I searched for "zsh autocomplete function" and read some stackoverflow examples and stuff. But I had some errors if I was using [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)'s functions.zsh to store/write my zsh auto complete function in it.

What I did was, instead of writing that auto complete function inside oh-my-zsh's functions.zsh, I wrote it directly inside .zshrc, like this:

```sh
    function prog() { 
        cd ~/Programming/Pythons/$1;
        }

    _prog() {
        _files -W ~/Programming/Pythons;
        }

    compdef _prog prog
```
What this code actually does is that when you type ```prog``` after sourcing your .zshrc file, it expands the defined directory, in here; '~/Programming/Pythons/' and the argument $1 is based on whatever directory you selected from the expansion of the directory from the function  ``_prog()``, like this;

{{< figure src="/img/zsh-autocomplete-function-to-change-and_s1600_Selection_021.png" >}}

This exactly did what I needed. If you got awesome auto complete
functions written, do share it at the comments. :)

## Resources

* http://zsh.sourceforge.net/Guide/zshguide06.html
* http://stackoverflow.com/questions/10700012/zsh-autocomplete-function-based-on-2-arguments
* https://wiki.archlinux.org/index.php/Zsh#Command_Completion
