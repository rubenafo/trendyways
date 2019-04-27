LOCALE ?= en_US

GENERATED_FILES = \
	trendyways.js \
	trendyways.min.js \
  trendyways_raw.js \
	tests

all:
	rm -Rf ./build
	mkdir build
	cp ./src/*.js ./build
	for js in `find ./build/*`; do cat $$js >> ./build/trendyways_raw.js; done
	echo generating trendyways.js ...
	nodejs ./node_modules/browserify/bin/cmd.js ./build/trendyways_raw.js --standalone tw > trendyways.js
	rm -Rf ./build
	echo generating trendyways.min.js ...
	nodejs ./node_modules/uglify-es/bin/uglifyjs trendyways.js -o trendyways.min.js 

docs: trendyways.js
	rm -Rf ./docs
	jsdoc trendyways.js -d=docs

clean:
	rm -Rf build
	rm -f trendyways.js trendyways.min.js

.PHONY: all docs clean
