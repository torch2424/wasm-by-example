// Should import index.js before this
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES = {};
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["assemblyScript (TypeScript)"] =
  "assemblyscript";
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["rust"] = "rust";
// TODO:
// window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["emscripten (C/C++)"] =
// "emscripten";

window.WASM_BY_EXAMPLE_READING_LANGUAGES = {};
window.WASM_BY_EXAMPLE_READING_LANGUAGES["English (US)"] = "en-us";

const createOptionElement = (text, value) => {
  const optionElement = document.createElement("option");
  optionElement.textContent = text;
  optionElement.setAttribute("value", value);
  return optionElement;
};

const setLanguagePreferenceFromForm = () => {
  const languageSelectKeys = ["programmingLanguage", "readingLanguage"];

  languageSelectKeys.forEach(key => {
    const select = document.querySelector(`select#${key}`);
    if (select && select.value) {
      localStorage.setItem(key, select.value);
    }
  });
};

const submitSettingsForm = () => {
  setLanguagePreferenceFromForm();

  location.pathname = "/";
};

// Initialization IIFE
(() => {
  // Add the language options
  const programmingLanguageSelect = document.querySelector(
    `select#programmingLanguage`
  );
  if (programmingLanguageSelect) {
    Object.keys(window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES).forEach(key => {
      programmingLanguageSelect.appendChild(
        createOptionElement(
          key,
          window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES[key]
        )
      );
    });
  }

  const readingLanguageSelect = document.querySelector(
    `select#readingLanguage`
  );
  if (readingLanguageSelect) {
    Object.keys(window.WASM_BY_EXAMPLE_READING_LANGUAGES).forEach(key => {
      readingLanguageSelect.appendChild(
        createOptionElement(key, window.WASM_BY_EXAMPLE_READING_LANGUAGES[key])
      );
    });
  }
})();
