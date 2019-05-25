// Initialization IIFE
(() => {
  // Set our header langauge identifier
  let exampleName = undefined;
  let programmingLanguage = window.WASM_BY_EXAMPLE.programmingLanguage;
  let readingLanguage = window.WASM_BY_EXAMPLE.readingLanguage;

  // Grab any overrides from the query
  let params = new URLSearchParams(window.location.search);
  if (params.get("exampleName")) {
    exampleName = params.get("exampleName");
  }
  if (params.get("programmingLanguage")) {
    programmingLanguage = params.get("programmingLanguage");
  }
  if (params.get("readingLanguage")) {
    readingLanguage = params.get("readingLanguage");
  }

  // Set the path, and clear the search
  if (exampleName) {
    window.location.href = `/examples/${exampleName}/${exampleName}.${programmingLanguage}.${readingLanguage}.html`;
  } else {
    window.location.href = "/";
  }
})();
