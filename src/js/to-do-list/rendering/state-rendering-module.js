/**
 * This is the state rendering module for To-do list functionality.<br>
 * It exports different functions that show the user the state of the application.<br><br>
 * @module To-do/state-rendering
 */

/**
 * Renders the start page if needed
 * @function showStartPage
 * @param {boolean} indicator Indicator for the start page to be rendered
 */
export function showStartPage(indicator) {
  let mainContent = document.getElementById("main_content_div");
  let listsTab = document.getElementById("my_tasks_div");
  if (indicator) {
    mainContent.classList.add("on-start-page");
    listsTab.classList.remove("is-functionality-active");
  } else {
    mainContent.classList.remove("on-start-page");
    listsTab.classList.add("is-functionality-active");
  }
}

/**
 * Renders a shadow screen if needed
 * @function showShadowScreen
 * @param {boolean} indicator Indicator for the shadow screen to be rendered
 */
export function showShadowScreen(indicator) {
  let shadow = document.getElementById("shadow_screen");
  if (indicator) {
    shadow.classList.add("is-shadow-active");
  } else {
    shadow.classList.remove("is-shadow-active");
  }
}

/**
 * Highlights the specified element in red indicating a problem with it
 * @function highlightElement
 * @param {string} elementQuerySelector Query selector of the element to highlight
 */
export function highlightElement(elementQuerySelector) {
  showShadowScreen(true);
  let highlightedElement = document.querySelector(elementQuerySelector);
  highlightedElement.classList.add("is-element-highlighted");
}

/**
 * Displays a confirmation box with the specified buttons
 * @param {string} title Title of the confirmation box when appearing
 * @param {string} info Information to display after the title
 * @param {Array<{buttonName: string, color: string, returnValue: *}>} buttonHandlers Buttons to create with their respective return values
 * @returns {Promise<*>} 
 */
export async function showConfirmationDialog(title, info, buttonHandlers) {
  showShadowScreen(true);
  let confirmationBox = document.getElementById("confirmation_box");
  confirmationBox.classList.add("is-confirmation-required");

  let titleSpan = confirmationBox.querySelector("#confirmation_title");
  titleSpan.innerHTML = title;

  let infoSpan = confirmationBox.querySelector("#confirmation_description");
  infoSpan.innerHTML = info;

  let buttonDiv = confirmationBox.querySelector("#confirmation_button_container");
  buttonDiv.querySelectorAll("button").forEach((button) => button.remove());
  
  // return returnValue;
  let promise = new Promise((resolve, reject) => {

    // Append buttons and add their event listeners
    buttonHandlers.forEach((button) => {
      let newButton = document.createElement("button");
      newButton.innerHTML = button.buttonName;
      if (button.color !== "default") {
        newButton.style.setProperty("color", button.color);
        newButton.style.setProperty("border-color", button.color);
      }
      newButton.addEventListener("click", () => {
        resolve(button.returnValue);
        confirmationBox.classList.remove("is-confirmation-required");
        showShadowScreen(false);
      });
      buttonDiv.append(newButton);
    });

    // Set timeout for picking option
    setTimeout(() => {
      resolve(false);
      confirmationBox.classList.remove("is-confirmation-required");
      showShadowScreen(false);
    }, 15000)
  });
  return promise.then();
}

/**
 * Displays a pop-up alert with the specified message
 * @function popAppear
 * @param {string} message Message to show inside the pop-up alert
 */
export function popAppear(message) {
	let alertPop = document.getElementById("pop_up_div");
	alertPop.innerText = `✅ ${message}`;
	setTimeout(() => {
		alertPop.classList.add("is-appearing");
	}, 100);
	setTimeout(() => {
		alertPop.classList.remove("is-appearing");
		alertPop.classList.add("is-dissapearing");
	}, 3000);
	alertPop.addEventListener("transitionend", function() {
		alertPop.classList.remove("is-dissapearing");
	});
}