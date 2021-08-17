import BackgroundImage from "./background-image.js";

/**
 * Process the files provided by the user and returns an array of defined custom images
 * @function processUserImages
 * @param {Array<Blob>} files Array of files provided by the user
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

  let newImages = fetchedImages.map((image) => {
    return new BackgroundImage(
      image.urls.raw,
      {imgWidth: image.width, imgHeight: image.height},
      {userName: image.user.username, userProfile: image.user.links.html}
    );
  });

  // console.log(newImages);

  return newImages;
}

/**
 * 
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