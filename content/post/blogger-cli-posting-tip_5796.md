+++
title = "Blogger CLI Posting Tip"
date = "2012-04-21T15:01:00"
+++

What do you do when you're a geek who uses Fedora, needs to write blog posts on blogspot.com and like only command line based clients?

Well, you do a 'yum search', of course. And then there you will find something called 'googlecl'. So you do

```shell-session
    # yum install googlecl
```
Now, you could just write a blog post within a text file and post to the blog by doing;

```shell-session
    % blogger post --tags "GoogleCl, Fedora" --src /path/to/post/file --title "your post title"
```
 
That's it! :)

posted from __googlecl__ on fedora 16 :)
