export default class BackgroundImage {
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