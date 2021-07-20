import customManager from '../../custom manager.js';

export function setBackgroundImages(imagesArr, currentImageIndex = {}) {
    console.log("Images being set as background", imagesArr);
    let body = document.querySelector("body");

    // Validations
    if (!currentImageIndex) {
        customManager.currentImageIndex = 0;
    }

    body.style.setProperty("background-image", `url(${imagesArr[customManager.currentImageIndex].src})`);
    toggleAnimations(customManager.animations, imagesArr, customManager.currentImageIndex);

    body.addEventListener("animationiteration", iterateOverImages);

    function iterateOverImages() {
        if (customManager.currentImageIndex === imagesArr.length - 1) {
            customManager.currentImageIndex = 0;
        } else {
            customManager.currentImageIndex++;
        }
        console.log(customManager.currentImageIndex);

        body.style.setProperty("background-image", `url(${imagesArr[customManager.currentImageIndex].src})`);
        toggleAnimations(
            customManager.animations,
            customManager.backgroundImages,
            customManager.currentImageIndex
        );

        localStorage.setItem("currentImageIndex", customManager.currentImageIndex);
    }
}

export function toggleAnimations(animationMode, imagesArr, imageIndex) {
    let body = document.querySelector("body");
    let selectedAnimation;
    if (animationMode) {
        try {
            selectedAnimation = imagesArr[imageIndex].animation;
        } catch {
            selectedAnimation = "large-horizontal";
        }
    } else {
        selectedAnimation = "animations-disabled";
    }
    console.log("Animation:", selectedAnimation);
    body.style.setProperty("animation-name", selectedAnimation);
}

export function moveAnimationsSwitch(animationMode) {
    let switchElement = document.getElementById("switch_animation_div").querySelector(".inside-switch-div");
    if (animationMode) {
        switchElement.style.setProperty("left", "0%");
    } else {
        switchElement.style.setProperty("left", "-80%");
    }
    switchElement.addEventListener("transitionend", () => {
        toggleAnimations(customManager.animations, customManager.backgroundImages, customManager.currentImageIndex);
    });
}