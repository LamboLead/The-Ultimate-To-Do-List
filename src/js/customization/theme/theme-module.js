import * as EventHandlingModule from '../../event-handling-module.js';
import database from '../../storage/database-object.js';
import * as DatabaseInfoModule from '../../storage/information-management-module.js';

retrieveTheme();

EventHandlingModule.setUpSwitch("change_theme", ".inside-switch-div", {
    leftValue: "dark",
    rightValue: "light",
    callback: renderTheme
});

/**
 * Renders the specified theme on the screen and saves it into the database
 * @function renderTheme
 * @param {string} newTheme Name of the theme to display on the screen
 */
function renderTheme(newTheme) {
	// Change app colors
	let root = document.querySelector(":root");
	let reference = {"light": 0, "dark": 1};
	reference = reference[newTheme];
	let themes = {
			"mainContainerColor": ["rgba(255, 255, 255, 0.4)", "rgba(0, 0, 0, 0.5)"],
			"secondaryColor": ["rgba(255, 255, 255, 0.3)", "rgba(0, 0, 0, 0.5)"],
			"taskColor": ["rgba(255, 255, 255, 0.4)", "rgba(0, 0, 0, 0.5)"],
			"innerTaskColor": ["rgba(255, 255, 255, 0.6)", "rgba(0, 0, 0, 0.7)"],
			"popUpColor": ["rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 1)"],
			"mainBorderColor": ["rgba(50, 50, 50, 1)", "rgba(255, 255, 255, 0.7)"],
			"secondBorderColor": ["rgba(90, 90, 90, 0.6)", "rgba(255, 255, 255, 0.3)"],
			"taskEditBorderColor": ["rgb(180, 180, 0)", "rgb(230, 230, 0)"],
			"taskCompleteBorderColor": ["rgb(100, 150, 0)", "rgb(100, 255, 0)"],
			"taskEditColor": ["rgba(255, 255, 0, 0.5)", "rgba(255, 255, 0, 0.2)"],
			"taskCompleteColor": ["rgba(100, 255, 0, 0.5)", "rgba(100, 255, 0, 0.2)"],
			"fontColor": ["rgb(20, 20, 20)", "rgb(210, 210, 210)"]
	};
	for (let property in themes) {
			root.style.setProperty(`--${property}`, themes[property][reference]);
	}
	saveTheme(newTheme);
}

/**
 * Saves the selected theme into the database
 * @function saveTheme
 * @param {string} theme Theme to save into the database
 */
function saveTheme(theme) {
	DatabaseInfoModule.saveInfo(database, "Custom preferences", {key: "theme", value: theme});
}

/**
 * Retrieves theme from the database and renders it into the page
 * @function retrieveTheme
 */
async function retrieveTheme() {
	let newTheme = (await DatabaseInfoModule.retrieveInfo(database, "Custom preferences", {query: "theme"}))[0];
	if (!newTheme) {
		newTheme = "light";
	}
	renderTheme(newTheme);
	EventHandlingModule.renderSwitch("change_theme", ".inside-switch-div",
		{
			leftValue: "dark",
			rightValue: "light"
		}, newTheme);
}