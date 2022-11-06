---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Blog setup with Hugo, Github and Netlify"
subtitle: ""
summary: "The author's detailed post on their website/blog setup using Hugo, Github and Netlify."
authors: []
tags: [blog]
categories: []
date: 2022-10-31T20:29:34+01:00
lastmod: 2022-10-31T20:29:34+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: "Photo by [Ashley West Edwards](https://unsplash.com/@ashleywedwards) on [Unsplash](https://unsplash.com/)"
  focal_point: ""
  preview_only: false
  alt_text: Pencil on notepad with ring binder and a cup of tea beside it.

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
I have had this website / blog (going forward it shall be, _the_ blog) on this current setup since about 2016, it has not always been a smooth ride. Always tinkering, always messing around with it when I do feel like it. However, I have enjoyed writing them.

The oldest post[^0] was first written back in 2011 on blogspot.com (called: **FLOSS Bytes**) , right around the time I got into Linux[^1] and open source communities. However, I wanted to move away from the clunky user interface of blogspot, which also included, as far as I remember, very difficult in themeing. I was also very sold on the idea of a static site generator and hosting my own website, back then.

Finally, the popularity of Jeklly based Github pages and other static site generator tools like [Hugo](https://gohugo.io/) pushed me to persue that route. The only requirement back then was for the setup to use a static site generator and not a content management system (CMS)[^2].

# Overview of setup
I write my blog posts in [Markdown](https://daringfireball.net/projects/markdown/) using a text editor. This allows me to just concentrate on my writing and not get distracted by the view of the contents being rendered.

{{< figure src="/img/blog-setup-flow.png" >}}

The `Computer & File System` on the far left represents the computer where I write my posts on, be that my laptop or desktop, or even on Github itself. I write the content and make sure any other contents like pictures are then stored in the right folders.

Once I am somewhat satisfied with my work, I push out the contents to my [Git](https://git-scm.com/) repository. This allows me to revert/rollback my changes if I ever need to, create different branches for the contents or theme changes in its own branches in order for the main blog on `mavjs.org` to not be effected. You could call this modern day DevOps style blogging. :smile:

When the contents get into git, pretty much instantly, Netlify app gets notified to build the site, and then makes the resulting built contents available on `mavjs.org` using its content delivery network. Netlify internally uses a Ubuntu Linux container with hugo in the background to create the build.

[^0]: https://mavjs.blogspot.com/2011/12/hello-world_4159.html
[^1]: Of course, that also invovled lots of Linux distribution (or as the cool kids say: distro) hopping from Ubuntu to Arch Linux, back to Ubuntu and then finally landing on Fedora since then. :laughing:
[^2]: https://www.cloudflare.com/en-gb/learning/performance/static-site-generator/
[^3]: https://gohugo.io/about/what-is-hugo/
[^4]: https://en.wikipedia.org/wiki/Git
