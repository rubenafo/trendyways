LOCALE ?= en_US

GENERATED_FILES = \
									trendyways.js \
									trendyways.min.js \
									tests

SRC_FILES = \
						src/core/ \
						src/error/ \
						src/averages/ \
						src/indicators/ \
						src/sup_res

all: clean $(GENERATED_FILES)

trendyways.js: 
	$(shell for js in `find $(SRC_FILES) | grep js$$ | grep -v Test.`; do cat $$js >> trendyways.js; done)
	@echo generating trendyways.js ...

trendyways.min.js: trendyways.js
	@echo generating trendyways.min.js ...
	@nodejs node_modules/uglify-js/bin/uglifyjs trendyways.js -o trendyways.min.js 

docs: trendyways.js
	rm -Rf ./docs
	jsdoc trendyways.js -d docs

tests: trendyways.js
	$(shell for js in `find $(SRC_FILES) | grep js$$ | grep Test.`; do cat $$js >> tests.js; done)

clean:
	rm -f trendyways.js trendyways.min.js tests.js

.PHONY: all docs tests clean
