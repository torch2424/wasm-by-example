const fs = require("fs");
const path = require("path");

// Supported homepage reading languages
const readingLanguages = ["en-us", "pt-br", "zh-cn"];

// Our introduction text
const introductionHtml = {};
const introDir = path.resolve(__dirname, "./introduction");
for (const name of fs.readdirSync(introDir)) {
  const filename = path.resolve(introDir, name);
  const locate = name.split(".")[0];
  const content = fs.readFileSync(filename, "utf-8");
  introductionHtml[locate] = content;
}

const examplesTitle = {
  "en-us": "Examples"
};

// Our overall example order
const exampleOrder = [
  "introduction",
  "hello-world",
  "exports",
  "webassembly-linear-memory",
  "importing-javascript-functions-into-webassembly",
  "reading-and-writing-graphics",
  "reading-and-writing-audio",
  "passing-high-level-data-types-with-wasm-bindgen",
  "passing-high-level-data-types-with-as-bind",
  "strings",
  "classes",
  "wasi-introduction",
  "wasi-hello-world"
];

// Catgeories
const concepts = {
  title: {
    "en-us": "Concepts"
  },
  description: {
    "en-us":
      "Examples that express some of the major underlying concepts in WebAssembly. Some of these examples are not the most convenient or productive way for building projects with WebAssembly. However, these minimal examples are great for learning, or developing straightforward / lower-level parts of an application."
  },
  examples: [
    "introduction",
    "hello-world",
    "exports",
    "webassembly-linear-memory",
    "importing-javascript-functions-into-webassembly"
  ]
};

const applyingTheConcepts = {
  title: {
    "en-us": "Applying the Concepts"
  },
  description: {
    "en-us":
      "Examples that expand on the conceptual examples to show how these minimal examples could be used to build common features in larger applications."
  },
  examples: ["reading-and-writing-graphics", "reading-and-writing-audio"]
};

const ecosystemAndLanguage = {
  title: {
    "en-us": "Ecosystem tools and Language features"
  },
  description: {
    "en-us":
      "Examples that highlight tools, libraries, and features of your selected programming language. These ecosystem components can drastically help in building powerful applications. For example, tools can be used to help pass data between your host runtime and WebAssembly module, and/or languages features can abstract away some of the lower-level parts of WebAssembly such as memory management."
  },
  examples: [
    "passing-high-level-data-types-with-wasm-bindgen",
    "passing-high-level-data-types-with-as-bind",
    "strings",
    "classes"
  ]
};

const webassemblyOutsideTheBrowser = {
  title: {
    "en-us": "WebAssembly Outside of the Browser"
  },
  description: {
    "en-us":
      "Examples that highlight the WebAssembly System Interface (WASI), standalone WebAssembly runtimes, tools for applications that use WASI, and use cases for tasks like cloud computing and internet-of-things devices. WebAssembly has a lot of key features that make it great for the browser web, and these same features make it a popular choice for uses outside of the browser as well."
  },
  examples: ["wasi-introduction", "wasi-hello-world"]
};

module.exports = {
  readingLanguages,
  introductionHtml,
  examplesTitle,
  exampleOrder,
  categories: [
    concepts,
    applyingTheConcepts,
    ecosystemAndLanguage,
    webassemblyOutsideTheBrowser
  ]
};
