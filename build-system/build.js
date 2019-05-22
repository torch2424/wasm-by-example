const fs = require("fs");
const mkdirp = require("mkdirp");
const recursive = require("recursive-readdir");
const highlightJs = require("highlight.js");
const Mustache = require("mustache");
const CleanCSS = require("clean-css");

console.log("Building...");

const cssMinifier = new CleanCSS();
const minifyCss = filePath => {
  const styleString = fs.readFileSync(filePath, "utf8");
  return cssMinifier.minify(styleString).styles;
};

const mustacheData = {
  styles: {
    normalizeCss: minifyCss("node_modules/normalize.css/normalize.css"),
    sakuraCss: minifyCss("node_modules/sakura.css/css/sakura-dark.css"),
    indexCss: minifyCss("shell/styles/index.css")
  },
  partials: {
    header: fs.readFileSync("shell/partials/header.html", "utf8"),
    footer: fs.readFileSync("shell/partials/footer.html", "utf8")
  },
  examples: []
};

const getRecursiveFilePathPromise = new Promise();

const getExamplesMarkdownPathsPromise = new Promise(resolve => {
  // Find all HTML Files within the demo directory, that are not specified
  recursive("./examples", ["**/demo/*"]).then(files => {
    resolve(files);
  });
});

const buildTask = async () => {
  // Create our build output folder
  mkdirp.sync("./dist");

  // Create our landing page
  const index = fs.readFileSync("shell/index.html", "utf8").toString();
  const renderedIndex = Mustache.render(index, mustacheData);
  fs.writeFileSync("./dist/index.html", renderedIndex);

  // Create an object for each file that we found, and assign a filepath and name
  const exampleFiles = await readExamplesPromise;
  exampleFiles.forEach(filePath => {
    // Create the Example object
    const example = {};

    // Split by the path
    const pathSplit = filePath.split("/");

    // Get the title of our example
  });

  console.log("Done!");
};
buildTask();
