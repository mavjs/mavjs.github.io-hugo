---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "YAML linting and schema validation"
subtitle: ""
summary: "Author could not use [Sigma](https://github.com/SigmaHQ/sigma) (a generic signature format for SIEM), so they came up with their own format. This post details that YAML linting and schema validation adventure."
authors: []
tags: []
categories: []
date: 2021-09-14T19:50:19+02:00
lastmod: 2021-09-15T18:13:00+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: "Photo by [Viktor Talashuk](https://unsplash.com/@viktortalashuk) on [Unsplash](https://unsplash.com)"
  focal_point: ""
  preview_only: false
  alt_text: File folders on book shelves.

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
## Background
Recently, we considered an approach, where in a single file document analysts are able to share SIEM (idea) queries, and some form of documentation and or notes. We also needed to make them machine parseable and transformable, in order for us to automate the parts of the queries to feed into a SIEM system.
This sort of idea is not new or ground breaking in anyway. In fact, it is pretty popular in the information security industry to share ideas for threat detection & hunting in YAML, TOML or markdown with code blocks.

YAML and TOML file formats are used a lot in threat detection & hunting rule sharing communities, ever since Sigma - generic signature format for SIEM systems[^1], came out, I believe. Threat detection & hunting enthusiasts sharing ideas are also making use of YAML file format[^2].
In fact, vendors like Elastic[^3] share their detection contents on GitHub as TOML files[^4].

This allows some form of uniformity in how the contents should be structured and also defines how the machine or automations should extract the information.

If you have the team, time, development and engineering resources, it might be worth looking into just using Sigma and to get contents for different security systems ingesting them automatically.
However, our approach was that, we wanted something to mix SIEM specific queries and some documentations together, while only spending some time into writing a script that can just strip out the query so that it can then be fed into a SIEM system, so we went with our own YAML format.

The downsides of coming up with your own format is that, you need to first define the structure, what field and values are mandatory, what are optional and then make a decision. This downside, however, can be overcome relatively easy in some cases. This was the case for us.

_NOTE:_ Just want the [sauce](#full-example-files)?
# The Details
This is how a signature format in YAML looks like:
{{< figure src="/img/sigma-sig-format.png" >}}

It has a `title`, `id`, `description` about the rule, the `author`, `references`, `logsource`, `detection` rules.

Let's say, for your community or organization, you decided a YAML format inspired by Sigma, however, it is not an extension, and that you do not use a single syntax high-level abstraction for your queries. It looks like:

```yaml
---
id: 6068c062-627f-4d7c-9250-5059f5417726 # UUIDv4
title: some title for your detection rule
description: a short sentence about the detection rule
references:
  - reference URL 1
  - reference URL 2
analyst_notes: >
  When you see X, you need to check if occurances of A, B, C, D are also there?
  If not, it might indicate a false-positive or a scenario 1 like in Alpha.
  If you see at most 3 out of 4, it is surely suspicious and therefore you should
  look for to find: K, L, M, N.
query: >
  SELECT * FROM registry WHERE \
  key LIKE 'HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\%%' \
  and name='Debugger';",
mitre:
  - T1112
jira: PJ-1337
```

Now you get to a point where these files are stored in Git for version control and some form of automation is in-place, you will need to make sure that the file is properly formatted as YAML and also compliant to your custom schema.
The former can be achieved by using a linting tool like `yamllint`[^5]. The latter with a library like `Yamale`[^6], which is what we went with.

## YAML Linting
`yamllint` is a command line tool and a library you can use in your own tooling. If we run the tool on the YAML file above:

```bash
$ yamllint detection_rule.yml
detection_rule.yml
  2:42      warning  too few spaces before comment  (comments)
  11:81     error    line too long (81 > 80 characters)  (line-length)
  15:81     error    line too long (102 > 80 characters)  (line-length)
```

However, if you would like to combine such a linting process together with other checks your scripts are doing, you can import the library[^7]. Here is an example:
```python
import yamllint
from yamllint.config import YamlLintConfig

raw_yaml = open('detection_rule.yml', 'r').read()

yaml_config = YamlLintConfig("extends: default")

for p in yamllint.linter.run(raw_yaml, yaml_config):
    print(p.desc, p.line, p.rule)
```

## Yamale - schema validation
`Yamale` is also a command line tool and a library. It comes with a few default validator[^8] functions, and is also very easily extendable. Here we will see how we could extend it for our schema.

First, we need to come up with a schema dictionary that `Yamale` can understand to use to validator your YAML files. Let's consider the following as an initial schema dictionary:
```yaml
id: str()
title: str()
description: str()
references: list(str())
analyst_notes: str()
query: str()
mitre: list(str())
jira: str()
```

Running `yamale` and providing the above schema as follows, yields a validation success.
```bash
$ yamale -s schema.yaml detection_rule.yml
Validating /home/user/project-x/detection_rule.yml...
Validation success! 👍
```

If you kept a close eye, you will have noticed that we initially told `yamale` that `id` is a string, however, that is not entirely true.
The validation will also pass if you wrote in a bogus string that is not a UUID. So we will need to extend `yamale` and write our own validator.

Looking at an example custom validator[^9] in their example, we can try a proof of concept UUID validator and also include the validation routines as well:
```python
import yamale
import uuid
from yamale.validators import DefaultValidators, Validator

class UUID(Validator):
    """ Custom UUID validator """
    tag = 'uuid'

    def _is_valid(self, value):
        try:
            luuid = uuid.UUID(str(value))
        except ValueError:
            return False
        return True

validators = DefaultValidators.copy()  # This is a dictionary
validators[UUID.tag] = UUID
schema = yamale.make_schema('./schema.yaml', validators=validators)

data = yamale.make_data('./detection_rule.yml')

try:
    yamale.validate(schema, data)
    print('Validation success! 👍')
except ValueError as e:
    print('Validation failed!\n%s' % str(e))
    exit(1)
```

Edit the validator for `id` in `schema.yaml` to `uuid()`, run the script above and it should output:
```bash
$ python schema-validate.py
Validation success! 👍
```

Say, for another custom validator, you want to check and make sure that `jira` values do confirm to the documented JIRA project key format[^10], since these are manually entered by analysts. Here we will reuse/sub-class from the built-in `Regex` validator.
```python
import re
from yamale.validators import Regex

class JIRA(Regex):
    """ Custom JIRA Project ID validator. """
    tag = 'jira'

    def __init__(self, *args, **kwargs):
        self._project_key = str(kwargs.pop('project_key', ''))
        super(JIRA, self).__init__(*args, **kwargs)

        if len(self._project_key) > 0:
            self.regexes = [
                re.compile("^%s-\d+$" % (self._project_key))
            ]
        else:
            self.regexes = [
                re.compile("^([A-Z]{2}[0-9]{2})-\d+$"),
                re.compile("^([A-Z][A-Z_0-9]+)-\d+$"),
            ]

```
Adjust `jira` field's value in `schema.yaml` as `jira(project_key='JP')` and on running the script, it should error out:
```bash
Validation failed!
Error validating data './detection_rule.yml' with schema './schema.yaml'
	jira: 'PJ-1337' is not a jira match.
```

## Challenge
Let us try writing a schema validator for the Sigma rule we mentioned at the beginning.

```yaml
---
title: str(min=1, max=256)
id: str()
status: enum('stable', 'testing', 'experimental', required=False)
description: str(required=False)
author: str(required=False)
date: str()
modified: str()
references: list(str(), required=False)
tags: list(str())
logsource: include('logsource')
detection: include('detection')
falsepositives: any(str(), list(), required=False)
level: enum('low', 'medium', 'high', 'critical', required=False)
---
logsource:
  product: str(required=False)
  category: str(required=False)
  service: str(required=False)
  definition: str(required=False)
---
detection:
  selection: any(str(), list(), map(key=str()))
  condition: str()
  timeframe: str(required=False)
```
**Note:** At times if you compare `Yamale` with something like `Rx`[^11], the former seems somewhat limiting for the way Sigma was designed. However, I would start with something like `Yamale` first and then think about `Rx` later on.

## Full Example Files
### `detection_rule.yml`
```yaml
---
id: 6068c062-627f-4d7c-9250-5059f5417726
title: some title for your detection rule
description: a short sentence about the detection rule
references:
  - reference URL 1
  - reference URL 2
analyst_notes: >
  When you see X, you need to check if occurances of A, B, C, D are also there?
  If not, it might indicate a false-positive or a scenario 1 like in Alpha.
  If you see at most 3 out of 4, it is surely suspicious and therefore you should
  look for to find: K, L, M, N.
query:
  SELECT * FROM registry WHERE \
  key LIKE 'HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\%%' \
  and name='Debugger';",
mitre:
  - T1112
jira: PJ-1337

```

### `schema.yaml`
```yaml
id: uuid()
title: str()
description: str()
references: list(str())
analyst_notes: str()
query: str()
mitre: list(str())
jira: jira()
```

### `validator.py`
```python
import yamale
import uuid
import re
from yamale.validators import DefaultValidators, Validator, Regex

class UUID(Validator):
    """ Custom UUID validator """
    tag = 'uuid'

    def __init__(self, *args, **kwargs):
        super(UUID, self).__init__(*args, **kwargs)
        self._version = int(kwargs.pop('version', 4))

    def _is_valid(self, value):
        try:
            luuid = uuid.UUID(str(value), version=self._version)
        except ValueError:
            return False
        return True

class JIRA(Regex):
    """ Custom JIRA Project ID validator. """
    tag = 'jira'

    def __init__(self, *args, **kwargs):
        self._project_key = str(kwargs.pop('project_key', ''))
        super(JIRA, self).__init__(*args, **kwargs)

        if len(self._project_key) > 0:
            self.regexes = [
                re.compile("^%s-\d+$" % (self._project_key))
            ]
        else:
            self.regexes = [
                re.compile("^([A-Z]{2}[0-9]{2})-\d+$"),
                re.compile("^([A-Z][A-Z_0-9]+)-\d+$"),
            ]

validators = DefaultValidators.copy()  # This is a dictionary
validators[UUID.tag] = UUID
validators[JIRA.tag] = JIRA
schema = yamale.make_schema('./schema.yaml', validators=validators)

data = yamale.make_data('./detection_rule.yml')

try:
    yamale.validate(schema, data)
    print('Validation success! 👍')
except ValueError as e:
    print('Validation failed!\n%s' % str(e))
    exit(1)
```

[^1]: https://github.com/SigmaHQ/sigma
[^2]: https://github.com/vadim-hunter/Detection-Ideas-Rules
[^3]: https://www.elastic.co/siem/
[^4]: https://github.com/elastic/detection-rules/tree/main/rules
[^5]: https://yamllint.readthedocs.io/en/stable/
[^6]: https://github.com/23andMe/Yamale
[^7]: https://yamllint.readthedocs.io/en/stable/development.html
[^8]: https://github.com/23andMe/Yamale#validators
[^9]: https://github.com/23andMe/Yamale#custom-validators
[^10]: https://confluence.atlassian.com/adminjiraserver/changing-the-project-key-format-938847081.html
[^11]: https://rx.codesimply.com/
