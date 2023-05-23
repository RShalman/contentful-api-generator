cjs:
	npx tsc --module commonjs --outDir dist/cjs/
	echo '{"type": "commonjs"}' > dist/cjs/package.json

esm:
	npx tsc --module esnext --outDir dist/esm/
	echo '{"type": "module"}' > dist/esm/package.json

bundle:
	npm run bundle