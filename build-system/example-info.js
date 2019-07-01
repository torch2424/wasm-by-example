// Our overall example order
const exampleOrder = [
  "introduction",
  "hello-world",
  "exports",
  "webassembly-linear-memory",
  "importing-javascript-functions-into-webassembly",
  "reading-and-writing-graphics",
  "reading-and-writing-audio",
  "strings"
];

// Catgeories
const concepts = {
  title: "Concepts",
  examples: [
    "introduction",
    "hello-world",
    "exports",
    "webassembly-linear-memory",
    "importing-javascript-functions-into-webassembly"
  ]
};

const applyingTheConcepts = {
  title: "Applying the Concepts",
  examples: ["reading-and-writing-graphics", "reading-and-writing-audio"]
};

const highLevelDataStructures = {
  title: "High Level Data Structures",
  examples: ["strings"]
};

module.exports = {
  exampleOrder,
  categories: [concepts, applyingTheConcepts, highLevelDataStructures]
};
