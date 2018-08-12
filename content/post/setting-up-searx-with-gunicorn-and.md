+++
title = "Setting up searx  with gunicorn and supervisor"
date = 2014-09-19T21:09:00
tags = ["gunicorn", "metasearch-engine", "privacy", "python", "supervisord"]
summary="""
Steps to get searx (a privacy-respecting metasearch engine) working with
gunicorn and supervisord
"""
+++

## What is searx?

[searx](https://github.com/asciimoo/searx) is a privacy-respecting, hackable metasearch engine

I have been using my own instance of searx at https://searx.gliderswirley.org/ mostly because I can. :)

For some reason, my instance seems to go down at some random time, and I assumed it was uwsgi. :P And also because I wanted to try [gunicorn](http://gunicorn.org) and [supervisor](http://supervisord.org).

Most of the setup steps are already documented on the wiki at https://github.com/asciimoo/searx/wiki/Installation, but I'll recount the steps here anyways.

Install packages (extra package: supervisor):

```shell-session
    sudo apt-get install git build-essential libxslt-dev python-dev python-virtualenv python-pybabel zlib1g-dev supervisor
```

Install searx:

```shell-session
    cd /usr/localsudo 
    git clone https://github.com/asciimoo/searx.git
    sudo useradd searx -d /usr/local/searx
    sudo chown searx:searx -R /usr/local/searx
```

Install dependencies in a virtualenv (extra package: gunicorn):

```shell-session 
    sudo -u searx -icd /usr/local/searx
    virtualenv searx-ve. 
    ./searx-ve/bin/activate
    pip install -r requirements.txt
    pip install gunicorn
    python setup.py install
```

Configure secretkey:

```shell-session 
    sed -i -e "s/ultrasecretkey/`openssl rand -hex 16`/g" searx/settings.yml
```

Make a configuration file:

```shell-session 
    sudo touch /etc/supervisor/conf.d/searx.conf
```

Edit the above conf to include:

```ini 
    [program:searx]
    command=/usr/local/searx/searx-ve/bin/gunicorn searx.webapp:app
    directory=/usr/local/searx/
    user=searx
    group=searx
    autostart=true
    autorestart=true
    stdout_logfile=/var/log/supervisor/%(program_name)s-access.log
    stderr_logfile=/var/log/supervisor/%(program_name)s-error.log
```

Then start the supervisor service:

```shell-session 
    sudo service supervisor start
```
