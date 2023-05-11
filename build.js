import { readFileSync } from "fs";
import { build } from "esbuild"; // const { dependencies, main, module, peerDependencies }

const dir = process.cwd() + "/";

const { dependencies, main, module } = JSON.parse(
  readFileSync(dir + "package.json", { encoding: "utf8" })
);

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  mainFields: ["main", "module"],
  // external: Object.keys(dependencies),
};

// CJS
build({ ...sharedConfig, outfile: dir + main }).catch(() => process.exit(1));

// ESM
build({ ...sharedConfig, outfile: dir + module, format: "esm" }).catch(() =>
  process.exit(1)
);
