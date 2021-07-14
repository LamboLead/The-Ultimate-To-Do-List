// THE ULTIMATE TO-DO LIST: Element & status definitions

// --- | General ---
const root = document.querySelector(":root");
const bodyElem = document.querySelector("body");

// --- | Navbar ---

// --- || My tasks ---

// - || Change background -

// ||| Select custom images
const fakeFileButton = document.getElementById("select_files_fake");
const fileButton = document.getElementById("select_files");

// ||| Select curated galleries

// Gallery screen
const galleryDiv = document.getElementById("background_galleries_div");
const eachGallery = document.querySelectorAll(".sample-image-div");

// Slider loader
const sliderLoaderDiv = document.getElementById("slider_loader_div");

// Slider screen
const sliderDiv = document.getElementById("slider_div");
const sliderTitle = document.querySelector("#slider-div > span");
const sliderContainer = document.getElementById("images_container_div");
const sliderImagesFlex = document.querySelector(".images-div");
let imagesInSlider = document.querySelectorAll(".images-div img");
const previousImageButton = document.querySelector(".previous-image-button");
const nextImageButton = document.querySelector(".next-image-button");
const imageInfo = document.querySelector(".gallery-info-div");
const imageInfoAnchor = document.querySelector(".slider-info-anchor");
const backToGallery = document.getElementById("backToGallery_Button");
const selectGallery = document.getElementById("selectGallery_Button");

// ||| Toggle animations
const animationSwitch = document.querySelector(".switch-animation-div");
const animationSwitchContainer = document.querySelector(".switch-animation-div .inside-switch-div");

// - || Change theme -
const themeChange = document.getElementById("change_theme");
const themeSwitchContainer = document.querySelector(".switch-theme-div .inside-switch-div");

