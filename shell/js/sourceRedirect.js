const sourceBaseUrl =
  "https://github.com/torch2424/wasm-by-example/tree/master";

// Initialization IIFE
(() => {
  let path = undefined;

  // Grab any overrides from the query
  let params = new URLSearchParams(window.location.search);
  if (params.get("path")) {
    path = params.get("path");
  }

  // Set the path, and clear the search
  if (path) {
    // Remove leading and trailing slashes
    path = path.replace(/^\/|\/$/g, "");
    window.location.href = `${sourceBaseUrl}/${path}`;
  } else {
    window.location.href = "/";
  }
})();
