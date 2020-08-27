const fs = require("fs");
const mkdirp = require("mkdirp");
const cpy = require("cpy");
const recursive = require("recursive-readdir");
const recursiveCopy = require("recursive-copy");
const highlightJs = require("highlight.js");
const marked = require("marked");
const getTitleMarkdown = require("get-title-markdown");
const Mustache = require("mustache");
const CleanCSS = require("clean-css");
const Terser = require("terser");
const workboxBuild = require("workbox-build");

const homepage = require("./homepage");
const packageJson = require("../package.json");

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
  version: packageJson.version,
  styles: {
    normalize: minifyCss("node_modules/normalize.css/normalize.css"),
    sakura: minifyCss("node_modules/sakura.css/css/sakura-dark.css"),
    highlightJs: minifyCss("node_modules/highlight.js/styles/gruvbox-dark.css"),
    index: minifyCss("shell/styles/index.css"),
    examplesList: minifyCss("shell/styles/examples-list.css")
  },
  js: {
    index: `const WASM_BY_EXAMPLE_VERSION = "${packageJson.version}";${minifyJs(
      "shell/js/index.js"
    )}`,
    indexRedirect: minifyJs("shell/js/indexRedirect.js"),
    examplesList: minifyJs("shell/js/examplesList.js"),
    examplesRedirect: minifyJs("shell/js/examplesRedirect.js"),
    sourceRedirect: minifyJs("shell/js/sourceRedirect.js"),
    demoRedirect: minifyJs("shell/js/demoRedirect.js")
  },
  partials: {
    head: fs.readFileSync("shell/partials/head.html", "utf8"),
    header: fs.readFileSync("shell/partials/header.html", "utf8"),
    footer: fs.readFileSync("shell/partials/footer.html", "utf8")
  },
  examples: [],
  examplesByLanguage: [],
  categories: [],
  introuductionHtml: {
    inLanguage: homepage.introductionHtml["en-us"]
  },
  examplesTitle: {
    inLanguage: homepage.examplesTitle["en-us"]
  }
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
  // If there is one
  const exampleDemoPath = `${example.parentPath}/demo/${
    example.programmingLanguage
  }`;
  if (fs.existsSync(exampleDemoPath)) {
    const exampleDemoDistPath = `${exampleDistPath}/demo/${
      example.programmingLanguage
    }`;
    mkdirp.sync(exampleDemoDistPath);
    await recursiveCopy(exampleDemoPath, exampleDemoDistPath, {
      overwrite: true,
      dot: true
    });
  }

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
    const fileText = fs.readFileSync(filePath, "utf8");
    let title = getTitleMarkdown(fileText);
    if (!title) {
      const titleSplit = exampleName.split("-");
      for (let i = 0; i < titleSplit.length; i++) {
        const word = titleSplit[i];
        titleSplit[i] = capitalizeWord(word);
      }
      title = titleSplit.join(" ");
    }

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

  // Generate our examples by language
  mustacheData.examplesByLanguage = [];
  mustacheData.examples.forEach(example => {
    // First check if the programming language key exists
    let index = mustacheData.examplesByLanguage.findIndex(exampleByLanguage => {
      if (
        exampleByLanguage.programmingLanguage === example.programmingLanguage
      ) {
        return true;
      }
      return false;
    });

    if (index < 0) {
      // Create the element
      mustacheData.examplesByLanguage.push({
        title: capitalizeWord(example.programmingLanguage),
        programmingLanguage: example.programmingLanguage,
        examples: []
      });
      index = mustacheData.examplesByLanguage.length - 1;
    }

    mustacheData.examplesByLanguage[index].examples.push(example);
  });

  // Sort our examples by language
  mustacheData.examplesByLanguage.forEach((exampleByLanguage, index) => {
    mustacheData.examplesByLanguage[
      index
    ].examples = mustacheData.examplesByLanguage[index].examples.sort(
      (a, b) => {
        const aIndex = homepage.exampleOrder.indexOf(a.exampleName);
        const bIndex = homepage.exampleOrder.indexOf(b.exampleName);

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
      }
    );
  });

  // Categorize our examples
  mustacheData.categories = [];
  homepage.categories.forEach((category, index) => {
    mustacheData.categories[index] = {};
    mustacheData.categories[index].title = category.title;
    mustacheData.categories[index].title.inLanguage = category.title["en-us"];
    mustacheData.categories[index].description = category.description;
    mustacheData.categories[index].description.inLanguage =
      category.description["en-us"];
    mustacheData.categories[index].class = "";

    mustacheData.categories[index].examples = [];

    // Find the examples that match our category
    mustacheData.examples.forEach(example => {
      if (category.examples.includes(example.exampleName)) {
        mustacheData.categories[index].examples.push(example);
        // Next add the appropriate classes if not added already
        if (
          !mustacheData.categories[index].class.includes(
            ` ${example.programmingLanguage} `
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

    // Sort our Categories
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

  // First, Add the example listings to our index.js
  mustacheData.js.index = `const WASM_BY_EXAMPLE_EXAMPLES_BY_LANGUAGE = ${JSON.stringify(
    mustacheData.examplesByLanguage
  )};${mustacheData.js.index}`;

  // Render all the normal pages
  const shellStandardPages = [
    "index.html",
    "about.html",
    "additional-resources.html",
    "example-redirect.html",
    "source-redirect.html",
    "demo-redirect.html",
    "all-examples-list.html"
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

  // Homepages for each reading languages
  homepage.readingLanguages.forEach(readingLanguage => {
    let homepageMustacheData = {
      ...mustacheData
    };

    homepageMustacheData.introductionHtml = {
      inLanguage:
        homepage.introductionHtml[readingLanguage] ||
        homepage.introductionHtml["en-us"]
    };

    homepageMustacheData.examplesTitle = {
      inLanguage:
        homepage.examplesTitle[readingLanguage] ||
        homepage.examplesTitle["en-us"]
    };

    homepageMustacheData.categories = [...mustacheData.categories];
    homepageMustacheData.categories.forEach(category => {
      category.title.inLanguage =
        category.title[readingLanguage] || category.title["en-us"];
      category.description.inLanguage =
        category.description[readingLanguage] || category.description["en-us"];
    });

    const homeContents = fs.readFileSync(`shell/home.html`, "utf8").toString();
    const renderedPage = Mustache.render(homeContents, homepageMustacheData);
    fs.writeFileSync(`./dist/home.${readingLanguage}.html`, renderedPage);
  });

  // Copy over any extra directories
  mkdirp.sync("./dist/demo-util");
  await cpy(["demo-util/"], "dist/demo-util");
  await recursiveCopy("./assets", "./dist", {
    overwrite: true,
    dot: true
  });

  // Copy over our manifest.json (PWA Support)
  await cpy(["shell/manifest.json"], "dist/");

  // Generate our Service Worker
  // TODO: Once bug is fixed, set cache strategy on precache
  // https://github.com/GoogleChrome/workbox/issues/1767
  const getEpoch = () => Date.now();
  const cacheId = `wasm-by-example%%${getEpoch()}%%`;
  const workboxResponse = await workboxBuild.generateSW({
    cacheId: cacheId,
    globDirectory: "dist",
    globPatterns: ["**/*.{html,json,js,css,svg,jpg,png,wasm}"],
    swDest: "dist/service-worker.js",
    ignoreURLParametersMatching: [/.*exampleName.*/, /.*example-name.*/],
    skipWaiting: true
  });
  console.log("Cache Id: ", cacheId);
  console.log("WorkBox Response: \n", workboxResponse, "\n");

  console.log("Done!");
  console.log(" ");
};
buildTask();
