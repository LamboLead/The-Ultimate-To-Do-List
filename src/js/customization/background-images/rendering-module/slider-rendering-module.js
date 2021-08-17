export default async function previewFetchedImages(whichGallery, backgroundImagesArr) {
  showLoader();
  setUpSlider(whichGallery, backgroundImagesArr);
}

// 'Displaying' functions

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
  
  loaderDiv.classList.add("is-div-hidden");
  sliderDiv.classList.remove("is-div-hidden");
  selectGalleryButton.classList.remove("is-button-disabled");
  
  
  // galleriesDiv.classList.remove("is-div-hidden");
  // sliderDiv.classList.add("is-div-hidden");
}

/**
 * Displays the galleries div, hiding the slider
 * @function hideSlider
 */
function hideSlider() {
  let galleriesDiv = document.getElementById("background_galleries_div");
  let sliderDiv = document.getElementById("slider_div");

  galleriesDiv.classList.remove("is-div-hidden");
  sliderDiv.classList.add("is-div-hidden");
}

// 'Setting up stuff' functions

/**
 * Loads all received images into the slider, then shows it when all have been loaded.
 * @param {string} whichGallery Name of the gallery to render as the title of the slider
 * @param {Array<Object>} imagesArr Array of BackgroundImages to render inside the slider
 */
function setUpSlider(whichGallery, imagesArr) {
  // Sets all received images into the slider, then shows the slider

  let sliderImagesContainer = document.getElementById("images_container_div");

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

  // Show slider when all images have loaded
  let loadedImages = 0;
  Array.from(sliderImagesContainer.children).forEach(image => {
    image.onload = () => {
      loadedImages++;
      console.log(loadedImages, "image has loaded!");
      if (loadedImages === imagesArr.length + 2) {
        changeSliderTitle(whichGallery);
        showSlider();
      };
    }
  });
}

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






