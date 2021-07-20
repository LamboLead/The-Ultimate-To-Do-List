import BackgroundImage from "../background image.js";

export default async function processUserImages(files) {
    files = Array.from(files);
    let backgroundImages = []

    files.forEach(file => {
        // Add file filter...

        let promise = new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                let image = new Image();
                image.src = reader.result;
                image.addEventListener("load", () => {
                    image = new BackgroundImage(
                        image.src,
                        {imgWidth: image.width, imgHeight: image.height},
                        {userName: "You", userProfile: "https://www.youtube.com/watch?v=OzL7u5teZhg"}
                    );
                    resolve(image);
                });
                image.addEventListener("error", () => {
                    reject(Error("Unable to load image"));
                });
            });
        });
        backgroundImages.push(promise);
    });
    let newImages = await Promise.all(backgroundImages);
    return newImages;
}