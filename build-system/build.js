const fs = require("fs");
const mkdirp = require("mkdirp");
const cpy = require("cpy");
const recursive = require("recursive-readdir");
const highlightJs = require("highlight.js");
const marked = require("marked");
const Mustache = require("mustache");
const CleanCSS = require("clean-css");
const Terser = require("terser");

const exampleInfo = require("./example-info");

console.log("Building...");
console.log(" ");

const cssMinifier = new CleanCSS();
const minifyCss = filePath => {
  const fileString = fs.readFileSync(filePath, "utf8");
  return cssMinifier.minify(fileString).styles;
};

const minifyJs = filePath => {
  const fileString = fs.readFileSync(filePath, "utf8");
  const terserResult = Terser.minify(fileString);
  if (terserResult.error) {
    console.log(terserResult.error);
  }
  return terserResult.code;
};

const capitalizeWord = word => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// https://stackoverflow.com/questions/48843806/how-to-use-npm-marked-with-highlightjs
marked.setOptions({
  highlight: (code, lang) => {
    return highlightJs.highlight(lang, code).value;
  }
});

const mustacheData = {
  styles: {
    normalize: minifyCss("node_modules/normalize.css/normalize.css"),
    sakura: minifyCss("node_modules/sakura.css/css/sakura-dark.css"),
    highlightJs: minifyCss("node_modules/highlight.js/styles/gruvbox-dark.css"),
    index: minifyCss("shell/styles/index.css")
  },
  js: {
    index: minifyJs("shell/js/index.js"),
    examplesList: minifyJs("shell/js/examplesList.js"),
    examplesRedirect: minifyJs("shell/js/examplesRedirect.js"),
    sourceRedirect: minifyJs("shell/js/sourceRedirect.js"),
    settings: minifyJs("shell/js/settings.js")
  },
  partials: {
    header: fs.readFileSync("shell/partials/header.html", "utf8"),
    footer: fs.readFileSync("shell/partials/footer.html", "utf8")
  },
  examples: []
};

const getExamplesMarkdownPathsPromise = new Promise(resolve => {
  // Find all HTML Files within the demo directory, that are not specified
  recursive("./examples", ["**/demo/*", "**/.DS_Store"]).then(files => {
    resolve(files);
  });
});

const createExample = async (exampleFileContents, example) => {
  // Create the correct file structure for the example html
  const exampleDistPath = `./dist/${example.parentPath}`;
  const exampleFileName = `${example.exampleName}.${
    example.programmingLanguage
  }.${example.readingLanguage}.html`;
  mkdirp.sync(exampleDistPath);

  // Copy over our appropriate demo
  const exampleDemoDistPath = `${exampleDistPath}/demo/${
    example.programmingLanguage
  }`;
  mkdirp.sync(exampleDemoDistPath);
  await cpy(
    [`${example.parentPath}/demo/${example.programmingLanguage}`],
    exampleDemoDistPath
  );

  // Get the example markdown file, add to our mustache data
  const exampleHtml = marked(fs.readFileSync(example.filePath, "utf8"));
  const exampleMustacheData = {
    ...mustacheData,
    exampleHtml
  };

  fs.writeFileSync(
    `${exampleDistPath}/${exampleFileName}`,
    Mustache.render(exampleFileContents, exampleMustacheData)
  );
};

const buildTask = async () => {
  // Create our build output folder
  mkdirp.sync("./dist");

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
      titleSplit[i] = capitalizeWord(word);
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

  // Categorize our examples
  mustacheData.categories = [];
  exampleInfo.categories.forEach((category, index) => {
    mustacheData.categories[index] = {};
    mustacheData.categories[index].title = category.title;
    mustacheData.categories[index].class = "";

    mustacheData.categories[index].examples = [];

    // Find the examples that match our category
    mustacheData.examples.forEach(example => {
      if (category.examples.includes(example.exampleName)) {
        mustacheData.categories[index].examples.push(example);

        // Next add the appropriate classes if not added already
        if (
          !mustacheData.categories[index].class.includes(
            example.programmingLanguage
          )
        ) {
          mustacheData.categories[index].class += `${
            example.programmingLanguage
          } `;
        }
        if (
          !mustacheData.categories[index].class.includes(
            example.readingLanguage
          )
        ) {
          mustacheData.categories[index].class += `${example.readingLanguage} `;
        }
      }
    });

    // Sort our Examples
    mustacheData.categories[index].examples = mustacheData.categories[
      index
    ].examples.sort((a, b) => {
      const aIndex = category.examples.indexOf(a.exampleName);
      const bIndex = category.examples.indexOf(b.exampleName);

      // Push not found elements to the end
      if (aIndex < 0) {
        return 1;
      } else if (bIndex < 0) {
        return -1;
      }

      if (aIndex < bIndex) {
        return -1;
      }

      if (bIndex < aIndex) {
        return 1;
      }

      return 0;
    });
  });

  // Finally, with the data, render all of our files

  // Render all the normal pages
  const shellStandardPages = [
    "index.html",
    "settings.html",
    "about.html",
    "additional-resources.html",
    "example-redirect.html",
    "source-redirect.html"
  ];
  shellStandardPages.forEach(page => {
    const fileContents = fs.readFileSync(`shell/${page}`, "utf8").toString();
    const renderedPage = Mustache.render(fileContents, mustacheData);
    fs.writeFileSync(`./dist/${page}`, renderedPage);
  });

  // Example Pages
  const exampleFileContents = fs
    .readFileSync("shell/example.html", "utf8")
    .toString();
  const createExamplePromises = [];
  mustacheData.examples.forEach(example => {
    createExamplePromises.push(createExample(exampleFileContents, example));
  });
  await Promise.all(createExamplePromises);

  // Copy over any extra directories
  mkdirp.sync("./dist/demo-util");
  await cpy(["demo-util/"], "dist/demo-util");

  console.log("Done!");
  console.log(" ");
};
buildTask();
