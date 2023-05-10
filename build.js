import { readFileSync } from "fs";
import { build } from "esbuild"; // const { dependencies, main, module, peerDependencies }

const { dependencies, main, module } = JSON.parse(
  readFileSync(process.cwd() + "/package.json", { encoding: "utf8" })
);

const sharedConfig = {
  entryPoints: ["src/generators/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  external: Object.keys(dependencies),
};

// CJS
build({ ...sharedConfig, outfile: main });

// ESM
build({ ...sharedConfig, outfile: module, format: "esm" });
