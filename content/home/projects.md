+++
# Projects widget.
# Note: this widget will only display if `content/project/` contains projects.
widget = "projects"
active = true
date = 2016-04-20T00:00:00

title = "Projects"
subtitle = ""

# Order that this section will appear in.
weight = 50

folder = "project"

# View.
# Customize how projects are displayed.
# Legend: 0 = list, 1 = cards.
view = 1

filter_default = 0
# Filter toolbar.
# Add or remove as many filters (`[[filter]]` instances) as you like.
# To remove toolbar, delete/comment all instances of `[[filter]]` below.
[[filter]]
  name = "All"
  tag = "*"
  
[[filter]]
  name = "golang"
  tag = "go"

[[filter]]
  name = "Dota2"
  tag = "Dota2"

[[filter]]
  name = "API"
  tag = "API"

[[filter]]
  name = "Security"
  tag = "secdev"

[[filter]]
  name = "Django"
  tag = "Django"

+++
