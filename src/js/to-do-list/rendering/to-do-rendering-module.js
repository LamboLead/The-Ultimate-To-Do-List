export function removeListFromNavbar(removedListId) {
  let listsDiv = document.getElementById("listing_div");
  let removedList = listsDiv.querySelector(`[data-list-id=${removedListId}]`);
  removedList.remove();
}