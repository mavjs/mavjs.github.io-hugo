all: build
	./deploy.sh

build:
	hugo

# run this for first timer
deps:
	go get -u -v github.com/spf13/hugo

# to update the submodules
update:
	git submodule foreach git fetch
	git submodule update

# for rebuild, ignore this
init:
	git submodule add -b master  https://github.com/gcushen/hugo-academic.git themes/academic
	git submodule add -b master git@github.com:mavjs/mavjs.github.io.git public
