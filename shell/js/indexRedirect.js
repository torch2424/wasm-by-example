// Initialization IIFE
(() => {
  let readingLanguage = window.WASM_BY_EXAMPLE.readingLanguage;
  if (!readingLanguage) {
    readingLanguage = "en-us";
  }

  let redirectUrl = `/home.${readingLanguage}.html${window.location.search}`;
  // console.log('Redirecting to homepage for reading language:', redirectUrl);

  window.location.href = redirectUrl;
})();
