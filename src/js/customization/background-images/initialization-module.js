import * as ImageProcessingModule from './image-processing/image-processing-module.js';
import * as EventHandlingModule from '../../dom-element-handler.js';
import BackgroundManager from "./background-manager.js";
import * as SliderRenderingModule from "./rendering-module/slider-rendering-module.js";

// Set up animationiteration event listener for image changing
const body = document.querySelector("body");
body.addEventListener("animationiteration", () => {
  BackgroundManager.changeBackgroundImage();
});

// Set up background user images
const fakeFileButton = document.getElementById("select_files_fake");
const fileButton = document.getElementById("select_files");

fakeFileButton.addEventListener("click", () => fileButton.click());
fileButton.addEventListener("change", async () => {
  let files = fileButton.files;
  let images = await ImageProcessingModule.processUserImages(files);
  BackgroundManager.setImagesAsBackground(images);
});

// Set up animation switch
EventHandlingModule.setUpSwitch("switch_animation_div", ".inside-switch-div", {
  leftValue: false,
  rightValue: true,
  callback: (animationMode) => {
    BackgroundManager.setAnimations(animationMode);
  }
});

// Set up background API images
const groupOfGalleries = document.querySelectorAll(".sample-image-div");
groupOfGalleries.forEach((gallery) => {
  gallery.addEventListener("click", async () => {
    let imageCategory = gallery.querySelector(".sample-image-span").innerHTML;
    // console.log(imageCategory);
    SliderRenderingModule.showLoader();
    let newImages = await ImageProcessingModule.processApiImages(imageCategory);
    SliderRenderingModule.setUpSlider(imageCategory, newImages);
  });
});

// Set up slider

import {nextSliderImage, previousSliderImage, setFetchedImagesAsBackground, hideSlider} from './rendering-module/slider-rendering-module.js';

const previousImageButton = document.getElementById("previous_image_button");
previousImageButton.addEventListener("click", previousSliderImage);

const nextImageButton = document.getElementById("next_image_button");
nextImageButton.addEventListener("click", nextSliderImage);

const backToGalleriesButton = document.getElementById("back_to_galleries_button");
backToGalleriesButton.addEventListener("click", hideSlider);

const selectGalleryButton = document.getElementById("select_gallery_button");
selectGalleryButton.addEventListener("click", setFetchedImagesAsBackground);

