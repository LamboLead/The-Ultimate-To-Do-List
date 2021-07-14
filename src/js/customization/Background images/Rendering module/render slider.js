

export function nextSliderImage(sliderContainerId, sliderImagesContainerId, imagesArr, currentSliderImage) {

  let slider = document.getElementById(sliderContainerId);
  let imagesContainer = document.getElementById(sliderImagesContainerId);
  
  let containerWidth = slider.clientWidth;
  imagesContainer.style.transition = "transform 300ms ease";
  imagesContainer.style.setProperty(
    "transform",
    `translateX(${-1 * containerWidth * currentSliderImage}px)`
  );
}

function updateImageInformation() {

}