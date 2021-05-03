start:
	npx babel-node -- src/bin/loader.js

test:
	npm test

lint:
	npx eslint .

build:
	npm build