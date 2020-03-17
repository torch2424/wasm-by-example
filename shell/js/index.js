// const WASM_BY_EXAMPLE added by the build system. So image there is a:
// const WASM_BY_EXAMPLE_VERSION = "0.0.0"

// Define our Globals

// Define Global Programming Languages
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES = {};
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["Rust"] = "rust";
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES[
  "AssemblyScript (TypeScript-like)"
] = "assemblyscript";
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["Emscripten (C/C++)"] = "c";

// Define Global Reading Languages
window.WASM_BY_EXAMPLE_READING_LANGUAGES = {};
window.WASM_BY_EXAMPLE_READING_LANGUAGES["English (US)"] = "en-us";

// Define Default Settings
window.WASM_BY_EXAMPLE = {
  version: WASM_BY_EXAMPLE_VERSION,
  programmingLanguage: "rust",
  readingLanguage: "en-us",
  exampleName: undefined
};

// Define some constants
const languageSelectKeys = ["programmingLanguage", "readingLanguage"];

// Define some utility functions
const createOptionElement = (text, value) => {
  const optionElement = document.createElement("option");
  optionElement.textContent = text;
  optionElement.setAttribute("value", value);
  return optionElement;
};

const setLanguagePreferenceFromForm = () => {
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
  // Handle URL Params if we have them
  let params = new URLSearchParams(window.location.search);
  languageSelectKeys.forEach(key => {
    if (params.has(key)) {
      const paramValue = params.get(key);
      const availableValues =
        key === "programmingLanguage"
          ? Object.values(window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES)
          : Object.values(window.WASM_BY_EXAMPLE_READING_LANGUAGES);
      if (availableValues.includes(paramValue)) {
        localStorage.setItem(key, paramValue);
      }
    }
  });

  // Set our correct global settings
  Object.keys(window.WASM_BY_EXAMPLE).forEach(key => {
    const savedItem = localStorage.getItem(key);
    if (savedItem) {
      window.WASM_BY_EXAMPLE[key] = savedItem;
    }
  });

  // Add the language options and their selected value
  const programmingLanguageSelect = document.querySelector(
    `select#programmingLanguage`
  );
  if (programmingLanguageSelect) {
    // Add options
    Object.keys(window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES).forEach(key => {
      programmingLanguageSelect.appendChild(
        createOptionElement(
          key,
          window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES[key]
        )
      );
    });
    // Set value
    programmingLanguageSelect.value =
      window.WASM_BY_EXAMPLE.programmingLanguage;
  }

  const readingLanguageSelect = document.querySelector(
    `select#readingLanguage`
  );
  if (readingLanguageSelect) {
    // Add options
    Object.keys(window.WASM_BY_EXAMPLE_READING_LANGUAGES).forEach(key => {
      readingLanguageSelect.appendChild(
        createOptionElement(key, window.WASM_BY_EXAMPLE_READING_LANGUAGES[key])
      );
    });
    // Set value
    readingLanguageSelect.value = window.WASM_BY_EXAMPLE.readingLanguage;
  }

  // Check if we are on an examples page
  const isOnExamplePage = location.pathname.includes("/examples/");
  if (isOnExamplePage) {
    // Parse out the example name
    const pathSplit = location.pathname.split("/");
    const filename = pathSplit[pathSplit.length - 1];
    const filenameSplit = filename.split(".");
    const exampleName = filenameSplit[0];
    window.WASM_BY_EXAMPLE.exampleName = exampleName;

    // Set the example name into localStorage
    localStorage.setItem("exampleName", exampleName);
  }
})();
