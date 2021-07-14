// --- NAVBAR ---

// --- | LOAD PREFERENCES ---
let theme, animationMode;
let preferredTheme = localStorage.getItem("theme");
let preferredAnimationMode = localStorage.getItem("animationMode");

if (preferredTheme) {
    preferredAnimationMode === "true"
        ? preferredAnimationMode = true
        : preferredAnimationMode = false;

    theme = preferredTheme;
    animationMode = preferredAnimationMode;
} else {
    theme = "light";
    animationMode = true;

    localStorage.setItem("theme", theme);
    localStorage.setItem("animationMode", animationMode.toString());
}

// --- | CHANGE BACKGROUND ---

// Status variables
let currentSliderImageIndex = 1;
let backgroundImages = [];
let readyToSetImages = [];
let currentImageIndex = 0;
let currentAnimation = "";
// let animationMode = true;
// let theme = "light";

const animationsAspectRatio = {
    "large-horizontal": [[100, 1.4], [0.5, 0]],
    "general-horizontal": [[1.4, 1.18]],
    "square-ish": [[1.18, 0.85]],
    "general-vertical": [[0.85, 0.5]]
}

// Common-use functions

function setBackgroundImages() {
    /*
        Iterates through backgroundImages and sets the background for the page when each animation has finished.
    */

    currentImageIndex = 0;

    // Set the first image
    if (animationMode) {
        currentAnimation = findCorrectAnimation();
    } else {
        currentAnimation = "animations-disabled";
    }
    changeImage();

    // Set the rest of the images
    bodyElem.addEventListener("animationiteration", () => {
        if (currentImageIndex === backgroundImages.length - 1) {
            currentImageIndex = 0;
        } else {
            currentImageIndex++;
        }

        if (animationMode) {
            currentAnimation = findCorrectAnimation();
        } else {
            currentAnimation = "animations-disabled";
        }
        changeImage()
    });
}
function findCorrectAnimation() {
    /* 
        Takes width and height from the current background image, calculates its aspect ratio, and iterates through the animationsAspectRatio object looking for the range that suits its aspect ratio.
     */
    let width = backgroundImages[currentImageIndex].width;
    let height = backgroundImages[currentImageIndex].height;
    let aspectRatio = width / height;
    for (animation in animationsAspectRatio) {
        let range = animationsAspectRatio[animation];
        for (let i = 0; i < range.length; i++) {
            if (range[i][0] >= aspectRatio && range[i][1] <= aspectRatio) {
                return animation;
            }
        }
    }
}
function changeImage() {
    /*
        Sets the background image of the page and its corresponding animation according to the current background image.
    */
    console.log(currentImageIndex);
    root.style.setProperty('--background', `url(${backgroundImages[currentImageIndex].src})`);
    bodyElem.style.animationName = currentAnimation;
}

// --- || Select custom images ---

// - Events -
fakeFileButton.addEventListener("click", () => fileButton.click());
fileButton.addEventListener("change", selectFile);

// - Functions -
function selectFile() {
    /*
        (void) -> undefined
        Grabs the files from fileButton, it reads them with FileReader, and appends the images to the backgroundImages array. Then, it calls setBackgroundImages() to set the images in the background.
        PENDING: Put filters for incorrect file formats
    */
    backgroundImages = [];
    let selectedFiles = fileButton.files;
    for (let i = 0; i < selectedFiles.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFiles[i]);
        reader.addEventListener("load", () => {
            let img = new Image();
            img.src = reader.result;
            backgroundImages.push(img);
            img.addEventListener("load", () => {
                if (i === selectedFiles.length - 1) {
                    setBackgroundImages();
                }
            });
        });
    }
}

// --- || Select curated galleries ---

// - Events -
eachGallery.forEach((element) => {
    element.addEventListener("click", showSlider);
});

nextImageButton.addEventListener("click", nextImage);
previousImageButton.addEventListener("click", previousImage);
sliderImagesFlex.addEventListener("transitionend", returnToCorrectImage);

backToGallery.addEventListener("click", returnToGallery);
selectGallery.addEventListener("click", setGalleryAsBackground);

// - Functions -

// Fetching-related
async function showSlider(event) {
    /*
        Hides the div containing the galleries and show the slider loader. Calls async showSlider() to fetch Unsplash API, removes the loader, sets the first image into the slider, and displays the slider when all the images have loaded.
    */
    let selectedGallery = event.target.children[1].innerText;

    // Hide what needs to be hidden
    galleryDiv.classList.add("background-option-dissapear");
    sliderLoaderDiv.classList.remove("background-option-dissapear");
    selectGallery.classList.remove("disable-button");

   // Fetch images from Unsplash API
    await fetchUnsplashApi(selectedGallery);

    // Set the first image into the slider
    let sliderWidth= sliderContainer.clientWidth;
    sliderImagesFlex.style.setProperty(
        "transform",
        `translateX(${-1 * sliderWidth * currentSliderImageIndex}px)`
    );
    
    imagesInSlider = document.querySelectorAll(".images-div img");
    let userInfo = imagesInSlider[currentSliderImageIndex].alt.split("|");
    imageInfoAnchor.innerText = userInfo[0];
    imageInfoAnchor.href = userInfo[1];
}
async function fetchUnsplashApi(whichGallery) {
    /*
    Calls async getImages() and waits for an array of images from the Unsplash API. Then, it inserts the images into the slider container. It then shows the div containing the slider.
    PENDING: in catch(), do something when the API can't be fetched.
    */
    let loadedImages = 0;
    let fetchedImages;
    readyToSetImages = [];

    try {
        async function fetchAPI() { 
            /*
            Fetches the Unsplash API by specifying which gallery, and extracts the total number of pages. Then it calculates a random number between 1 and that number, and then it fetches it again to retrieve 10 random images from that random number.
            */
            let requestUrl = `https://api.unsplash.com/search/photos?query=${whichGallery}&client_id=Lx5RhugSwSXlmegWIwokcglAySNjY7pzTgDjxgCHzzY`;
            let pageNumber = fetch(requestUrl)
                .then(response => response.json())
                .then(data => data["total_pages"]);
            let randomPage = Math.floor(Math.random() * (await pageNumber));
            requestUrl = `https://api.unsplash.com/search/photos?query=${whichGallery}&page=${randomPage}&client_id=Lx5RhugSwSXlmegWIwokcglAySNjY7pzTgDjxgCHzzY`;
            let imagesArray = fetch(requestUrl)
                .then(response => response.json())
                .then(data => data.results);
        
            return await imagesArray;
        }

        fetchedImages = await fetchAPI();

        // Set up last fetched image as first in the slider
        let lastFetched = fetchedImages[fetchedImages.length - 1];
        let firstImg = document.createElement("img");
        firstImg.id = "last_image";
        firstImg.src = lastFetched.urls.regular;
        firstImg.alt = lastFetched.user.name + "|" + lastFetched.user.links.html;
        sliderImagesFlex.append(firstImg);

        // Set up rest of the fetched images in the slider
        fetchedImages.forEach((element) => {
            let img = document.createElement("img");
            img.src = element.urls.regular;
            img.alt = element.user.name + "|" + element.user.links.html;
            sliderImagesFlex.append(img);
        });

        // Set up first fetched image as last in the slider
        let firstFetched = fetchedImages[0];
        let lastImg = document.createElement("img");
        lastImg.id = "first_image";
        lastImg.src = firstFetched.urls.regular;
        lastImg.alt = firstFetched.user.name + "|" + firstFetched.user.links.html;
        sliderImagesFlex.append(lastImg);

        fetchedImages.forEach((element) => {
            let imgObject = new Object;
            imgObject["src"] = element.urls.regular;
            imgObject["width"] = element.width;
            imgObject["height"] = element.height;
            imgObject["author"] = new Object;
            imgObject["author"]["name"] = element.user.name;
            imgObject["author"]["profile"] = element.user.links.html;
            readyToSetImages.push(imgObject);
        });
        
        // Remove loader div when all images have loaded
        for (element of sliderImagesFlex.children) {
            element.addEventListener("load", () => {
                loadedImages++;
                if (loadedImages === fetchedImages.length + 2) {
                    sliderTitle.innerText = whichGallery;
                    sliderLoaderDiv.classList.add("background-option-dissapear");
                    sliderDiv.classList.remove("background-option-dissapear");
                }
            });
        }
    }
    catch(e) {
        // Pending...
        console.log("Error!", (e));
    }
}

// Slider interaction-related
function nextImage() {
    /* 
        Moves the sliderImages div to the left, depending of the current image the slider is in.
    */
    if (currentSliderImageIndex >= sliderImagesFlex.children.length - 1) {return false;}

    currentSliderImageIndex++;
    let sliderWidth = sliderContainer.clientWidth;
    sliderImagesFlex.style.transition = "transform 300ms ease";
    sliderImagesFlex.style.setProperty(
        "transform",
        `translateX(${-1 * sliderWidth * currentSliderImageIndex}px)`
    );

    imagesInSlider = document.querySelectorAll(".images-div img");
    let userInfo = imagesInSlider[currentSliderImageIndex].alt.split("|");
    imageInfoAnchor.innerText = userInfo[0];
    imageInfoAnchor.href = userInfo[1];
}
function previousImage() {
    /* 
        Moves the sliderImages div to the right, depending of the current image the slider is in.
    */
    if (currentSliderImageIndex <= 0) {return false;}

    currentSliderImageIndex--;
    let sliderWidth = sliderContainer.clientWidth;
    sliderImagesFlex.style.transition = "transform 300ms ease";
    sliderImagesFlex.style.setProperty(
        "transform",
        `translateX(${-1 * sliderWidth * currentSliderImageIndex}px)`
    );

    imagesInSlider = document.querySelectorAll(".images-div img");
    let userInfo = imagesInSlider[currentSliderImageIndex].alt.split("|");
    imageInfoAnchor.innerText = userInfo[0];
    imageInfoAnchor.href = userInfo[1];
}
function returnToCorrectImage() {
    /*
        Each time the transition in the slider finishes, it figures out if the current image in the slider is the first or last images. If they are, it jumps back to the correct image by moving the sliderImages div.
    */
    let imageList = sliderImagesFlex.children;
    let sliderWidth = sliderContainer.clientWidth;
    if (imageList[currentSliderImageIndex].id === "last_image") {
        sliderImagesFlex.style.transition = "none";
        currentSliderImageIndex = imageList.length - 2;
        sliderImagesFlex.style.setProperty(
            "transform",
            `translateX(${-1 * sliderWidth * currentSliderImageIndex}px)`
        );
    }
    if (imageList[currentSliderImageIndex].id === "first_image") {
        sliderImagesFlex.style.transition = "none";
        currentSliderImageIndex = 1;
        sliderImagesFlex.style.setProperty(
            "transform",
            `translateX(${-1 * sliderWidth * currentSliderImageIndex}px)`
        );
    }
}

// Set images or go back-related
function returnToGallery() {
    /*
        Hides the slider div and shows the galleries div.
    */
    galleryDiv.classList.remove("background-option-dissapear");
    sliderDiv.classList.add("background-option-dissapear");
    sliderImagesFlex.querySelectorAll("*").forEach((element) => {
        element.remove();
    });
}
function setGalleryAsBackground() {
    /*
        Creates a copy of the images in the slider into backgroundImages. Then, it eliminates both the first and last element (which were repeated), and then calls setBackgroundImages() to set the background.
        PENDING: Do not allow to set background images if backgroundImages is equal to readyToSetImages.
    */
    backgroundImages = [...readyToSetImages];
    setBackgroundImages();
    selectGallery.classList.add("disable-button");
}

// --- || Toggle animations ---

// - Events -
animationSwitch.addEventListener("click", toggleAnimations);

// - Functions -
function toggleAnimations() {
    if (animationMode) {
        animationMode = false;
        animationSwitchContainer.style.setProperty("left", "-80%");
        animationSwitchContainer.addEventListener("transitionend", () => {
            bodyElem.style.animationName = "animations-disabled";
        });
    } else {
        animationMode = true;
        if (backgroundImages.length !== 0) {
            currentAnimation = findCorrectAnimation();
        } else {
            currentAnimation = "large-horizontal";
        }
        animationSwitchContainer.style.setProperty("left", "0%");
        animationSwitchContainer.addEventListener("transitionend", () => {
            bodyElem.style.animationName = currentAnimation;
        });
    }
    localStorage.setItem("animationMode", animationMode.toString());
}

(() => {
    if (animationMode) {
        animationSwitchContainer.style.setProperty("left", "0%");
    } else {
        animationSwitchContainer.style.setProperty("left", "-80%");
        bodyElem.style.animationName = "animations-disabled";
    }
})();

// --- | TOGGLE THEME ---

// - Definition -

const themes = {
    dark : [
        ["mainContainerColor", "rgba(0, 0, 0, 0.5)"],
        ["secondaryColor", "rgba(0, 0, 0, 0.5)"],
        ["taskColor", "rgba(0, 0, 0, 0.5)"],
        ["innerTaskColor", "rgba(0, 0, 0, 0.7)"],
        ["popUpColor", "rgba(0, 0, 0, 1)"],
        ["mainBorderColor", "rgba(255, 255, 255, 0.7)"],
        ["secondBorderColor", "rgba(255, 255, 255, 0.3)"],
        ["taskEditBorderColor", "rgb(230, 230, 0)"],
        ["taskCompleteBorderColor", "rgb(100, 255, 0)"],
        ["taskEditColor", "rgba(255, 255, 0, 0.2)"],
        ["taskCompleteColor", "rgba(100, 255, 0, 0.2)"],
        ["fontColor", "rgb(210, 210, 210)"]
    ],
    light: [
        ["mainContainerColor", "rgba(255, 255, 255, 0.4)"],
        ["secondaryColor", "rgba(255, 255, 255, 0.3)"],
        ["taskColor", "rgba(255, 255, 255, 0.4)"],
        ["innerTaskColor", "rgba(255, 255, 255, 0.6)"],
        ["popUpColor", "rgba(255, 255, 255, 1)"],
        ["mainBorderColor", "rgba(50, 50, 50, 1)"],
        ["secondBorderColor", "rgba(90, 90, 90, 0.6)"],
        ["taskEditBorderColor", "rgb(180, 180, 0)"],
        ["taskCompleteBorderColor", "rgb(100, 150, 0)"],
        ["taskEditColor", "rgba(255, 255, 0, 0.5)"],
        ["taskCompleteColor", "rgba(100, 255, 0, 0.5)"],
        ["fontColor", "rgb(20, 20, 20)"],
    ]
};

themeChange.addEventListener("click", toggleTheme);

// Set preferred theme
(() => {
    if (theme === "light") {
        themeSwitchContainer.style.setProperty("left", "0%");
    } else {
        themeSwitchContainer.style.setProperty("left", "-80%");
    }
    themes[theme].forEach((property) => root.style.setProperty(`--${property[0]}`, property[1]));
})();

function toggleTheme() {
    if (theme === "dark") {
        theme = "light";
        themeSwitchContainer.style.setProperty("left", "0%");
    } else {
        theme = "dark";
        themeSwitchContainer.style.setProperty("left", "-80%");
    }
    themeSwitchContainer.addEventListener("transitionend", () => {
        themes[theme].forEach(property => root.style.setProperty(`--${property[0]}`, property[1]));
    });
    localStorage.setItem("theme", theme);
}
// --- SLIDER ANIMATION ---

