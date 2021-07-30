/**
 * This is the DOM element handler module.<br>
 * It stores functions related to the handling of user events inside the DOM.
 *  @module EventHandling
 */

/**
 * Handles the user input from the specified input element. Supports 'Enter' and 'Escape' keys
 * @function handleUserInput
 * @param {string} inputElementSelector CSS selector of the input element
 * @param {function} onEnterFunction Function to execute on 'Enter'
 * @param {*} [otherParams] Other parameters to tie to the onEnterFunction
 * @param {boolean} [clearAfterEnter] Indicator to clear input after pressing 'Enter'
 */
export function handleUserInput(inputElementSelector, onEnterFunction, otherParams = {}, clearAfterEnter = false) {
  let inputElement = document.querySelector(inputElementSelector);
  inputElement.addEventListener("keyup", (event) => {
    let inputValue = getUserInput(inputElementSelector);
    switch (event.code) {
      case "Enter":
        onEnterFunction(inputValue, otherParams);
        if (clearAfterEnter) {
          clearInput(inputElementSelector);
          return;
        }
        inputElement.blur();
        break;
      case "Escape":
        clearInput(inputElementSelector);
        break;
    }
  });

  inputElement.addEventListener("change", () => {
    inputElement.setAttribute("value", inputElement.value);
  });
}

/**
 * Returns the value inside the specified input element
 * @function getUserInput
 * @param {string} inputElementSelector CSS selector of the input element
 * @returns {string} Value inside the input element
 */
export function getUserInput(inputElementSelector) {
  return document.querySelector(inputElementSelector).value;
}

/**
 * Clears the content of the specified input
 * @param {string} inputElementSelector CSS selector of the input element
 */
export function clearInput(inputElementSelector) {
  let inputElement = document.querySelector(inputElementSelector);
  inputElement.value = "";
}

export function validateInput(value, {flag, validatorValue} = {flag}) {
  if (flag === "required") {
    return value.length > 0;
  }
  if (flag === "min-length") {
    return value.length > validatorValue;
  }
  if (flag === "regex") {
    return validatorValue.test(value);
  }
}