
/**
 * @typedef {Object} BackgroundImg
 * @property {string} src Source of the image
 * @property {{imgWidth: number, imgHeight: number}} dimensions Dimensions of the image
 * @property {{userName: string, userProfile: string}} userInfo Information of the user who took the photo
 */

/**
 * Class to create a new BackgroundImage object.
 * @class BackgroundImage
 */
class BackgroundImage {
	/**
	 * @constructs
	 * @param {string} imgSrc Source of the image
	 * @param {{imgWidth: number, imgHeight: number}} dimensions Dimensions of the new image
	 * @param {{userName: string, userProfile: string}} userInfo Information of the user who took the photo
	 */
	constructor(imgSrc, {imgWidth, imgHeight} = {}, {userName, userProfile} = {}) {
		this.src = imgSrc;
		this.dimensions = {
			width: imgWidth,
			height: imgHeight
		};
		this.user = {
			name: userName,
			link: userProfile
		}
		this.animation = null;
		this.findAnimation(this.dimensions.width, this.dimensions.height);
	}

	/**
	 * Finds the correct animation according to the width and height of the image
	 * @param {number} width Width of the image
	 * @param {number} height Height of the image
	 */
	findAnimation(width, height) {
		let animationsAspectRatio = {
			"large-horizontal": [100, 1.4],
			"general-horizontal": [1.4, 1.1],
			"square": [1.1, 0.9],
			"general-vertical": [0.9, 0.5],
			"large-vertical": [0.5, 0]
		}
		let aspectRatio = width/height;
		let entries = Object.entries(animationsAspectRatio);
		entries.forEach(pair => {
			let animation = pair[0];
			let range = pair[1];
			if (range[0] >= aspectRatio && range[1] <= aspectRatio) {
				this.animation = animation;
				return;
			}
		});
	}
}

export default BackgroundImage;