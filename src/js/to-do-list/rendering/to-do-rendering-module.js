/**
 * This is the to-do-rendering module for To-do list functionality.<br>
 * It exports functions related to the rendering of the to-do application.<br><br>
 * @module To-do/to-do-rendering
 */

/**
 * Removes the specified list from the navbar
 * @function removeListFromNavbar
 * @param {string} removedListId Id of the list to remove
 */
export function removeListFromNavbar(removedListId) {
  let listsDiv = document.getElementById("listing_div");
  let removedList = listsDiv.querySelector(`[data-list-id=${removedListId}]`);
  removedList.remove();
}