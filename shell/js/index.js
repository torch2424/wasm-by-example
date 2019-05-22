// Set up global variables
window.WASM_BY_EXAMPLE = {
  programmingLanguage: "assemblyscript",
  readingLanguage: "en-us"
};
Object.keys(window.WASM_BY_EXAMPLE).forEach(key => {
  const savedItem = localStorage.getItem(key);
  if (savedItem) {
    window.WASM_BY_EXAMPLE[key] = savedItem;
  }
});

// Initialization IIFE
(() => {
  // Set our header langauge identifier
  const programmingLanguage = window.WASM_BY_EXAMPLE.programmingLanguage;
  const readingLanguage = window.WASM_BY_EXAMPLE.readingLanguage;
  document.getElementById(
    "header-language"
  ).textContent = `${programmingLanguage} / ${readingLanguage}`;
})();
