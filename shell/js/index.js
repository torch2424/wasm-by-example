// const WASM_BY_EXAMPLE_VERSION, and const WASM_BY_EXAMPLE_EXAMPLES_BY_LANGUAGE
// added by the build system. So imagine there is a:
// const WASM_BY_EXAMPLE_VERSION = "0.0.0"
// const WASM_BY_EXAMPLE_EXAMPLES_BY_LANGUAGE = [/*Object from build system here*/];

// Define our Globals

// Define Global Programming Languages
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES = {};
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["Rust"] = "rust";
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES[
  "AssemblyScript (TypeScript-like)"
] = "assemblyscript";
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["Emscripten (C/C++)"] = "c";
window.WASM_BY_EXAMPLE_PROGRAMMING_LANGUAGES["TinyGo (Go)"] = "go";

// Define Global Reading Languages
// NOTE: Make sure that a homepage exists for each reading language in build-system/
window.WASM_BY_EXAMPLE_READING_LANGUAGES = {};
window.WASM_BY_EXAMPLE_READING_LANGUAGES["English (US)"] = "en-us";
window.WASM_BY_EXAMPLE_READING_LANGUAGES["Brazilian Portuguese"] = "pt-br";

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
      WASM_BY_EXAMPLE[key] = select.value;
      localStorage.setItem(key, select.value);
    }
  });
};

const submitSettingsForm = () => {
  setLanguagePreferenceFromForm();

  // Check if we should reload, go home, or go to the respective example
  // in the new language
  if (location.pathname.includes("/examples/")) {
    // Check if the example is an "all" programming languages
    if (location.pathname.includes(".all.")) {
      // Go to the example with the name
      location.href = `/example-redirect?exampleName=${
        WASM_BY_EXAMPLE.exampleName
      }&programmingLanguage=all`;
      return;
    }

    // Check if there is an equivalent language in the new target language
    const isExampleInNewLanguage = WASM_BY_EXAMPLE_EXAMPLES_BY_LANGUAGE.some(
      exampleByLanguage => {
        // Check if this examleByLanguage is our target language
        if (
          exampleByLanguage.programmingLanguage ===
            WASM_BY_EXAMPLE.programmingLanguage ||
          exampleByLanguage.programmingLanguage === "all"
        ) {
          // Look through the exampleBylanguage (which is our target)
          // And find the example with our current exampleName
          return exampleByLanguage.examples.some(example => {
            return (
              example.exampleName === WASM_BY_EXAMPLE.exampleName &&
              example.readingLanguage === window.WASM_BY_EXAMPLE.readingLanguage
            );
          });
        }
        return;
      }
    );
    if (isExampleInNewLanguage) {
      // Go to the example through the example-redirect
      // Using .href to not URL Escape the ?.
      location.href = `/example-redirect?exampleName=${
        WASM_BY_EXAMPLE.exampleName
      }`;
    } else {
      // Go Back to home
      location.href = "/";
    }
  } else {
    // Go Back to home (Since we probably switched reading languages)
    location.href = "/";
  }
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
