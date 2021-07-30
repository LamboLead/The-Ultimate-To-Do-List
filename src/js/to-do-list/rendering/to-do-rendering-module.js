/**
 * Renders the start page if needed
 * @function showStartPage
 * @param {boolean} indicator Indicator for the start page to be rendered
 */
export function showStartPage(indicator) {
  let mainContent = document.getElementById("main_content_div");
  if (indicator) {
      mainContent.classList.add("on-start-page");
  } else {
      mainContent.classList.remove("on-start-page");
  }
}