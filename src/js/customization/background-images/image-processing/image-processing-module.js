/**
 * This is the image-processing module for Customization functionality.<br>
 * It exports functions that process and normalize external images to use in the application.<br><br>
 * Imports: {@link BackgroundImage|BackgroundImage (class)}
 * @module Customization/image-processing
 */

import BackgroundImage from "./background-image.js";

/**
 * Process the files provided by the user and returns an array of BackgroundImages
 * @function processUserImages
 * @param {Array<Blob>} files Array of files provided by the user
 * @returns {Promise<Array<BackgroundImage>>}
 */
export async function processUserImages(files) {
  files = Array.from(files);
  let backgroundImages = [];

  files.forEach((file) => {
    // Add file filter

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
  return await Promise.all(backgroundImages);
}

/**
 * Calls for the Unsplash API to retrieve processed images from the specified gallery
 * @function processApiImages
 * @param {string} whichGallery Name of the gallery to search for
 * @returns {Promise<Array<BackgroundImage>>}
 */
export async function processApiImages(whichGallery) {
  let apiUrl = "https://api.unsplash.com/search/photos"
  let clientId = "Lx5RhugSwSXlmegWIwokcglAySNjY7pzTgDjxgCHzzY";
  
  // await getFetch(apiUrl, {
  //   query: whichGallery,
  //   client_id: clientId
  // }).then((data) => console.log(data));

  let pageNumber = await getFetch(apiUrl, {
    query: whichGallery,
    client_id: clientId
  }).then((data) => data["total_pages"]);
  let randomPage = Math.floor(Math.random() * pageNumber);
  // console.log(randomPage);

  let fetchedImages = await getFetch(apiUrl, {
    query: whichGallery,
    page: randomPage,
    client_id: clientId
  }).then((data) => data["results"]);

  // console.log(fetchedImages);

  let newImages = fetchedImages.map(async (image) => {
    let imageUrl = await getBase64(image.urls.raw);
    return new BackgroundImage(
      imageUrl,
      {imgWidth: image.width, imgHeight: image.height},
      {userName: image.user.userName, userProfile: image.user.links.html}
    );
  });
  return await Promise.all(newImages);
}

/**
 * Creates a url and uses the fetch() API to return an external resource in JSON format
 * @function getFetch
 * @param {string} url Url of the page to connect to
 * @param {Object} parameters Parameters of the query to search for
 * @returns {Promise<JSON>} JSON object with the results of the query
 */
async function getFetch(url, parameters = {}) {
  let queryString = Object.entries(parameters).map((eachParam) => {
    return `${eachParam[0]}=${eachParam[1]}`;
  }).join('&');
  return await fetch(`${url}?${queryString}`).then((response) => response.json());
}

/**
 * Fetches the specified image, downsizes it and converts it in a base64 url
 * @async
 * @function getBase64
 * @param {string} imgUrl Web URL of the image
 * @returns {Promise<string>} Base64 URL of the rescaled image
 */
async function getBase64(imgUrl) {
  let imageBlob = await fetch(imgUrl).then((response) => response.blob());
  let image = document.createElement("img");
  image.src = window.URL.createObjectURL(imageBlob);
  return new Promise((resolve) => {
    image.onload = () => {
      resolve(drawScaledImage(image).toDataURL("image/jpeg", 0.6));
    }
  });
}

/**
 * Draws and rescales the given image in a canvas and returns it
 * @function drawScaledImage
 * @param {HTMLImageElement} img Image element to rescale
 * @returns {HTMLCanvasElement} Canvas containing the rescaled image
 */
function drawScaledImage(img) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  [canvas.width, canvas.height] = [1920, 1080];
  let hRatio = canvas.width/img.width;
  let vRatio = canvas.height/img.height;
  let ratio = Math.max(hRatio, vRatio);
  let centerShift_x = (canvas.width - img.width * ratio) / 2;
  let centerShift_y = (canvas.height - img.height * ratio) / 2;
  context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  return canvas;
}