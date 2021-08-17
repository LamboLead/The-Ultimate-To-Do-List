/**
 * This is the DOM element handler module.<br>
 * It stores functions related to the handling of user events inside the DOM.
 *  @module EventHandling
 */

import * as StateRenderingModule from './to-do-list/rendering/state-rendering-module.js';

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
        if (!validateInput(inputValue, "required")) {
          StateRenderingModule.showShadowScreen(true);
          inputElement.classList.add("is-element-highlighted");
          return;
        }
        StateRenderingModule.showShadowScreen(false);
        inputElement.classList.remove("is-element-highlighted");
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

/**
 * Checks whether the specified value passes the specified test or not
 * @function validateInput
 * @param {string} value Value inserted by the user
 * @param {string} flag Flag specifying the check type
 * @param {RegExp} [validatorValue] Regular expression to perform the validation
 * @returns {boolean}
 */
export function validateInput(value, flag, validatorValue) {
  if (flag === "required") {
    return value.length > 0;
  }
  if (flag === "regex") {
    return validatorValue.test(value);
  }
}


// Switch handling

/**
 * Sets up the specified switch to do something when the user clicks it
 * @function setUpSwitch
 * @param {string} switchFrameId Id of the switch' frame
 * @param {string} insideSwitchSelector Query selector of the inside of the switch
 * @param {{leftValue: *, rightValue: *, callback: function}} options Parameters to fuck
 */
export function setUpSwitch(switchFrameId, insideSwitchSelector, {leftValue, rightValue, callback}) {
  let switchFrame = document.getElementById(switchFrameId);
  let insideSwitch = switchFrame.querySelector(insideSwitchSelector);

  let correspondingValues = {left: ["-80%", leftValue], right: ["0%", rightValue]};
  let pickedValue;

  switchFrame.addEventListener("click", () => {
    switchFrame.removeEventListener("transitionend", afterTransition);
    let left = getComputedStyle(insideSwitch).left.match(/\d+/)[0];
    if (left === "0") {
      pickedValue = correspondingValues.left;
    } else {
      pickedValue = correspondingValues.right;
    }
    insideSwitch.style.setProperty("left", pickedValue[0]);

    switchFrame.addEventListener("transitionend", afterTransition);
  });
  
  function afterTransition(event) {
    if (event.propertyName === 'left') {
      callback(pickedValue[1]);
    }
  }
}

/**
 * Renders the state of the switch depending on the specified value
 * @param {string} switchFrameId Id of the switch' frame
 * @param {string} insideSwitchSelector Query selector of the inside of the switch
 * @param {{leftValue: *, rightValue: *}} options Parameters to work with
 * @param {*} selectedValue Value in which depends the position of the switch
 */
export function renderSwitch(switchFrameId, insideSwitchSelector, {leftValue, rightValue},  selectedValue) {
  let switchFrame = document.getElementById(switchFrameId);
  let insideSwitch = switchFrame.querySelector(insideSwitchSelector);
  let correspondingValues = {left: "-80%", right: "0%"};
  let pickedValue;

  if (selectedValue === leftValue) {
    pickedValue = correspondingValues.left
  } else if (selectedValue === rightValue) {
    pickedValue = correspondingValues.right;
  }
  insideSwitch.style.setProperty("left", pickedValue);
}