/**
 * @module Customization/EventHandler
 */

import * as ImageProcessingModule from './image-processing/image-processing-module.js';
import * as EventHandlingModule from '../../event-handling-module.js';
import BackgroundManager from "./background-manager.js";
import showSlider from "./rendering-module/slider-rendering-module.js";

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

    // Call function to open slider
    let newImages = await ImageProcessingModule.processApiImages(imageCategory);
    showSlider(imageCategory, newImages);
  });
});

