import BackgroundImage from "../background image.js";

// Fetching images functions

async function fetchUnsplashApi(whichGallery) {
    let clientId = "Lx5RhugSwSXlmegWIwokcglAySNjY7pzTgDjxgCHzzY";

    let pageNumber = await getFetch('https://api.unsplash.com/search/photos', {
        query: whichGallery,
        client_id: clientId
    }).then(data => data["total_pages"]);
    let randomPage = Math.floor(Math.random() * pageNumber);

    let fetchedImages = await getFetch('https://api.unsplash.com/search/photos', {
        query: whichGallery,
        page: randomPage,
        client_id: clientId
    }).then(data => data["results"]);

    let newImages = fetchedImages.map(image => {
        return new BackgroundImage(
            image.urls.raw,
            {imgWidth: image.width, imgHeight: image.height},
            {userName: image.user.username, userProfile: image.user.links.html}
        );
    });
    return newImages;
}

function getFetch(url, parameters = {}) {
    let queryString = Object.entries(parameters).map(param => {
        return `${param[0]}=${param[1]}`;
    }).join('&');
    return fetch(`${url}?${queryString}`)
        .then(response => response.json());
}

// Slider functions

export default async function previewFetchedImages(whichGallery) {

    showLoader(whichGallery);

    let fetchedImages = await fetchUnsplashApi(whichGallery);

    setUpSlider(fetchedImages);
}

function setUpSlider(imagesArr) {
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
            if (loadedImages === imagesArr.length + 2) showSlider();
        }
    });
}

function setUpImage(backgroundImage, attributes) {
    let image = document.createElement("img");
    Object.entries(attributes).forEach(attribute => {
        image.setAttribute(attribute[0], attribute[1]);
    });
    return image;
}

function showLoader(whichGallery) {
    // Hides gallery div and displays loader div in the page

    let galleryDiv = document.getElementById("background_galleries_div");
    let loaderDiv = document.getElementById("slider_loader_div");
    
    let sliderText = document.getElementById("slider_div").querySelector("span");
    let selectGalleryButton = document.getElementById("select_gallery_button");

    galleryDiv.classList.add("is-div-hidden");
    loaderDiv.classList.remove("is-div-hidden");
    selectGalleryButton.classList.remove("is-button-disabled");
    sliderText.innerText = whichGallery;
}

function showSlider() {
    // Hides loader div and displays slider div in the page

    let loaderDiv = document.getElementById("slider_loader_div");
    let sliderDiv = document.getElementById("slider_div");

    loaderDiv.classList.add("is-div-hidden");
    sliderDiv.classList.remove("is-div-hidden");
}

function hideSlider() {
    // Hides slider div and displays gallery div in the page

    let galleryDiv = document.getElementById("background_galleries_div");
    let sliderDiv = document.getElementById("slider_div");

    galleryDiv.classList.remove("is-div-hidden");
    sliderDiv.classList.add("is-div-hidden");
}