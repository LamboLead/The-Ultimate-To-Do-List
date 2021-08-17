import customManager from "./background-images/custom manager.js";
import processUserImages from './background-images/image-processing/user-images.js';
import previewFetchedImages from './background-images/image-processing/unsplash-api-images.js.js';
import * as RenderSliderModule from './background-images/rendering-module/slider-rendering-module.js';

// Set everything up
customManager.initialize();

// Set user-selected images as background

const fakeFileButton = document.getElementById("select_files_fake");
const fileButton = document.getElementById("select_files");

fakeFileButton.addEventListener("click", () => fileButton.click());
fileButton.addEventListener("change", async () => {
    let files = fileButton.files;
    let images = await processUserImages(files);
    customManager.setImagesAsBackground(images);
});

// Set api-fetched images as background

const groupOfGalleries = document.querySelectorAll(".sample-image-div");
groupOfGalleries.forEach(gallery => {
    gallery.addEventListener("click", async (event) => {
        let imageCategory = gallery.querySelector(".sample-image-span").innerHTML;
        previewFetchedImages(imageCategory);
    });
});

// Slider functions

const sliderImagesContainer = document.getElementById("images_container_div");
const nextImageButton = document.getElementById("next_image_button");
const previousImageButton = document.getElementById("previous_image_button");

nextImageButton.addEventListener("click", () => {
  RenderSliderModule.nextSliderImage();
});
previousImageButton.addEventListener("click", () => {
	
});
sliderImagesContainer.addEventListener("click", () => {

});