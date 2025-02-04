import esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["index.js"],
  bundle: true,
  outfile: 'bundle.js',
  platform: "node",
  minify: true,
  target: 'node16',
  nodePaths: ["node_modules"]
});