export function cycleThroughImages(imagesArr) {
    let body = document.querySelector("body");
    let imageIndex = 0;

    body.addEventListener("animationiteration", () => {
        if (imageIndex === imagesArr.length - 1) {
            imageIndex = 0;
        } else {
            imageIndex++;
        }

        changeToImage(imagesArr, imageIndex);
    });

    changeToImage(imagesArr, imageIndex);
}


function changeToImage(imagesArr, imageIndex = 0) {
    console.log(imageIndex, imagesArr[imageIndex]);

    // let body = document.querySelector("body");

    // body.style.setProperty("background-image", `url(${imagesArr[imageIndex].src})`);
    // body.style.setProperty("animation-name", imagesArr[imageIndex].animation);
}