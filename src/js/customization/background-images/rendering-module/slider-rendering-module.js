import BackgroundManager from '../background-manager.js';

export default async function previewFetchedImages(whichGallery, backgroundImagesArr) {
  showLoader();
  setUpSlider(whichGallery, backgroundImagesArr);
}

// Functions to show/hide slider

/**
 * Displays the loader div, hiding the galleries div
 * @function showLoader
 */
function showLoader() {
  let galleriesDiv = document.getElementById("background_galleries_div");
  let loaderDiv = document.getElementById("slider_loader_div");

  galleriesDiv.classList.add("is-div-hidden");
  loaderDiv.classList.remove("is_div-hidden");
}

/**
 * Displays slider div, hiding the loader div
 * @function showSlider
 */
function showSlider() {
  let galleriesDiv = document.getElementById("background_galleries_div");
  let loaderDiv = document.getElementById("slider_loader_div");
  let sliderDiv = document.getElementById("slider_div");
  let selectGalleryButton = sliderDiv.querySelector("#select_gallery_button");
  
  galleriesDiv.classList.add("is-div-hidden");
  loaderDiv.classList.add("is-div-hidden");
  sliderDiv.classList.remove("is-div-hidden");
  selectGalleryButton.classList.remove("is-button-disabled");
}

/**
 * Displays the galleries div, hiding the slider
 * @function hideSlider
 */
export function hideSlider() {
  let galleriesDiv = document.getElementById("background_galleries_div");
  let sliderDiv = document.getElementById("slider_div");

  galleriesDiv.classList.remove("is-div-hidden");
  sliderDiv.classList.add("is-div-hidden");
}

// Functions to set up the slider and interact with it

const slider = {
  currentImageIndex: 0,
  totalImageNumber: 0,
  frameWidth: 0,
  imageContainer: undefined,
  images: undefined
}

/**
 * Loads all received images into the slider, then shows it when all have been loaded.
 * @param {string} whichGallery Name of the gallery to render as the title of the slider
 * @param {Array<Object>} imagesArr Array of BackgroundImages to render inside the slider
 */
function setUpSlider(whichGallery, imagesArr) {
  // Sets all received images into the slider, then shows the slider

  let sliderFrame = document.getElementById("slider_container_div");
  let sliderImagesContainer = sliderFrame.querySelector("#images_container_div");

  Array.from(sliderImagesContainer.children).forEach((image) => {
    image.remove();
  });

  // -- Render fetched images in the slider --

  // Set up last fetched image as first in the slider
  let lastFetched = imagesArr[imagesArr.length - 1];
  let firstImage = setUpImage(lastFetched, {
    id: "last_image",
    src: lastFetched.src,
    "data-username": lastFetched.user.name,
    "data-userlink": lastFetched.user.link
  });
  sliderImagesContainer.append(firstImage);

  // Set up rest of images in the slider
  imagesArr.forEach(image => {
    let sliderImage = setUpImage(image, {
      src: image.src,
      "data-username": image.user.name,
      "data-userlink": image.user.link
    });
    sliderImagesContainer.append(sliderImage);
  });

  // Set up first fetched image as last in the slider
  let firstFetched = imagesArr[0];
  let lastImage = setUpImage(firstFetched, {
    id: "first_image",
    src: firstFetched.src,
    "data-username": firstFetched.user.name,
    "data-userlink": firstFetched.user.link
  });
  sliderImagesContainer.append(lastImage);

  // -- Set up the exact copy of background images in the slider object
  imagesArr.unshift(imagesArr[imagesArr.length - 1]);
  imagesArr.push(imagesArr[1]);

  // Show slider when all images have loaded
  let loadedImages = 0;
  Array.from(sliderImagesContainer.children).forEach(image => {
    image.onload = () => {
      loadedImages++;
      console.log(loadedImages, "image has loaded!");
      if (loadedImages === imagesArr.length) {
        changeSliderTitle(whichGallery);
        showSlider();
        updateSlider();
        moveToImageInSlider(1);
      };
    }
  });

  /**
   * Creates and returns an image element with its specified attributes
   * @param {Object} backgroundImage Background image to set up
   * @param {Object} attributes Attribute-value pairs to add to the specified image
   * @returns {Object} Image element
   */
  function setUpImage(backgroundImage, attributes) {
    let image = document.createElement("img");
    Object.entries(attributes).forEach(attribute => {
      image.setAttribute(attribute[0], attribute[1]);
    });
    return image;
  }

  /**
   * Renders the name of the selected gallery as the title of the slider
   * @function changeSliderTitle
   * @param {string} whichGallery Name of the selected gallery
   */
  function changeSliderTitle(whichGallery) {
    let sliderDiv = document.getElementById("slider_div");
    let sliderText = sliderDiv.querySelector("span");
    sliderText.innerText = whichGallery
  }

  function updateSlider() {
    slider.currentImageIndex = 1;
    slider.totalImageNumber = loadedImages;
    slider.frameWidth = parseFloat(getComputedStyle(sliderFrame)
      .width
      .match(/[\d\.]*/)[0]
    );
    slider.imageContainer = sliderImagesContainer;
    slider.images = imagesArr;

    slider.imageContainer.addEventListener("transitionend", (event) => {
      if (event.propertyName === "transform") checkForFirstOrLast();
    });
  }

  function checkForFirstOrLast() {
    let sliderImages = slider.imageContainer.querySelectorAll("img");
    if (sliderImages[slider.currentImageIndex].id === "last_image") {
      slider.imageContainer.style.setProperty("transition", "none");
      slider.currentImageIndex = slider.images.length - 2;
      moveToImageInSlider(slider.currentImageIndex);
      return;
    }
    if (sliderImages[slider.currentImageIndex].id === "first_image") {
      slider.imageContainer.style.setProperty("transition", "none");
      slider.currentImageIndex = 1;
      moveToImageInSlider(slider.currentImageIndex);
    }
  }
}

/**
 * Shows the specified image into the slider
 * @param {number} imgIndex Index of the image to show
 */
function moveToImageInSlider(imgIndex) {
  // console.log("Slider moved to", imgIndex);
  updateUserInfo(imgIndex);
  slider.imageContainer.style.setProperty(
    "transform",
    `translateX(${-1 * slider.frameWidth * imgIndex}px)`
  );

  function updateUserInfo(currentImgIndex) {
    let userInfoAnchor = document.querySelector("#gallery_info_div a");
    let currentImage = slider.images[currentImgIndex];
    userInfoAnchor.innerHTML = currentImage.user.name;
    userInfoAnchor.setAttribute("href", currentImage.user.link);
  }
}

export function nextSliderImage() {
  slider.imageContainer.style.setProperty("transition", "transform 300ms ease");
  slider.currentImageIndex++;
  moveToImageInSlider(slider.currentImageIndex);
}

export function previousSliderImage() {
  slider.imageContainer.style.setProperty("transition", "transform 300ms ease");
  slider.currentImageIndex--;
  moveToImageInSlider(slider.currentImageIndex);
}

// Functions to set or discard fetched images as background

export function setFetchedImagesAsBackground() {
  let selectGalleryButton = document.querySelector("#select_gallery_button");
  selectGalleryButton.classList.add("is-button-disabled");

  slider.images.pop();
  slider.images.shift();
  BackgroundManager.setImagesAsBackground(slider.images);
}