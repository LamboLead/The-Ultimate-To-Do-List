/**
 * This is the rendering module for To-do list functionality.<br>
 * It stores functions that render lists, tasks, and related elements.<br>
 * Imports from {@link module: To-do/event-functions}
 * @module To-do/rendering
 */


// Other



/**
 * Displays the pop-up alert with the specified message
 * @function popAppear
 * @param {string} message Message to show inside the pop-up alert
 */
function popAppear(message) {
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