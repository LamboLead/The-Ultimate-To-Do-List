import database from '../../storage/database-object.js';
import * as DatabaseInfoModule from '../../storage/information-management-module.js';
import * as EventHandlingModule from '../../event-handling-module.js';
import * as RenderingModule from './rendering-module/background-rendering-module.js';

class BackgroundManager {
  constructor() {
    if (!BackgroundManager.instance) {
      this.backgroundImages = null;
      this.currentImageIndex = 0;
      this.animations = true;
      BackgroundManager.instance = this;
    }
    this.initialize();
    return BackgroundManager.instance;
  }
  async initialize() {
    let newImages = await DatabaseInfoModule.retrieveInfo(database, "Custom preferences", {query: "backgroundImages"});
    this.animations = (await DatabaseInfoModule.retrieveInfo(database, "Custom preferences", {query: "animations"}))[0];
    
    if (newImages.length === 0) {
      console.log("No images whatsoever!");
    }
    if (!this.animations) {
      this.animations = true;
      DatabaseInfoModule.saveInfo(database, "Custom preferences", {key: "animations", value: this.animations});
      return;
    }

    this.setImagesAsBackground(newImages[0]);
    EventHandlingModule.renderSwitch("switch_animation_div", ".inside-switch-div",
      {
        leftValue: false,
        rightValue: true,
      },
      this.animations
    );
  }

  /**
   * Sets the specified images as background and saves them in the database
   * @param {Array<Object>} imagesArr Array of Background Images
   */
  setImagesAsBackground(imagesArr) {
    this.currentImageIndex = 0;
    this.backgroundImages = imagesArr;

    this.changeBackgroundImage();

    DatabaseInfoModule.saveInfo(database, "Custom preferences", {key: "backgroundImages", value: this.backgroundImages});
  }

  /**
   * Changes to and renders specified image
   */
  changeBackgroundImage() {
    if (!this.backgroundImages) return;

    if (this.currentImageIndex === this.backgroundImages.length - 1) {
      this.currentImageIndex = 0;
    } else {
      this.currentImageIndex++;
    }

    // Render images
    let nextImage = this.backgroundImages[this.currentImageIndex];
    RenderingModule.setBackgroundImage(nextImage);
    // console.log(
    //   this.backgroundImages[this.currentImageIndex],
    //   this.currentImageIndex
    //   );
  }

  setAnimations(animationMode) {
    this.animations = animationMode;
    let currentImageAnimation;
    try {
      currentImageAnimation = this.backgroundImages[this.currentImageIndex].animation;
    } catch (e) {
      currentImageAnimation = "large-horizontal";
    }
    RenderingModule.setAnimation(currentImageAnimation); // IMPORTANT: Figure out a way to pass the animation mode as a parameter
    DatabaseInfoModule.saveInfo(database, "Custom preferences", {key: "animations", value: this.animations});
  }
}

// **Learn how to catalog this object as an instance of BackgroundManager**
const backgroundManager = new BackgroundManager();

export default backgroundManager;

