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
