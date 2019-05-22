const goToExample = (parentPath, exampleName) => {
  // Construct our full path with values from the window
  const programmingLanguage = window.WASM_BY_EXAMPLE.programmingLanguage;
  const readingLanguage = window.WASM_BY_EXAMPLE.readingLanguage;
  location.pathname = `/${parentPath}/${exampleName}.${programmingLanguage}.${readingLanguage}.html`;
};
