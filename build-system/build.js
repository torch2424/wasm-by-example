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

  // Create an object for each file that we found, and assign a filepath and name
  const exampleFiles = await getExamplesMarkdownPathsPromise;
  exampleFiles.forEach(filePath => {
    // Create the Example object
    const example = {};

    // Split by the path, get the fileName
    const pathSplit = filePath.split("/");
    const fileName = pathSplit[pathSplit.length - 1];

    // Split the filname to get the example
    const fileSplit = fileName.split(".");

    // Get the example info
    const exampleName = fileSplit[0];
    const programmingLanguage = fileSplit[1];
    const readingLanguage = fileSplit[2];

    // Get the parent path for the mustache data
    const parentPathSplit = filePath.split("/");
    parentPathSplit.pop();
    const parentPath = parentPathSplit.join("/");

    // Create a nicely formatted title
    const titleSplit = exampleName.split("-");
    for (let i = 0; i < titleSplit.length; i++) {
      const word = titleSplit[i];
      titleSplit[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    const title = titleSplit.join(" ");

    // Add the example
    mustacheData.examples.push({
      title,
      exampleName,
      programmingLanguage,
      readingLanguage,
      parentPath,
      filePath
    });
  });

  console.log(mustacheData);

  // Finally, with the data, render all of our files
  const renderedIndex = Mustache.render(index, mustacheData);
  fs.writeFileSync("./dist/index.html", renderedIndex);

  console.log("Done!");
};
buildTask();
