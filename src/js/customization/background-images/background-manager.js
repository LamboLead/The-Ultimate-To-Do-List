import database from '../../storage/database-object.js';
import * as DatabaseInfoModule from '../../storage/information-management-module.js';
import * as DOMElementHandler from '../../dom-element-handler.js';
import * as RenderingModule from './rendering-module/background-rendering-module.js';

/**
 * Class that creates a BackgroundManager object.<br><br>
 * Imports: {@link module:Storage/database|database (object)}, {@link module:Storage/information-management|information-management (module)}, {@link module:DOMElementHandler|DOMElementHandler (module)}, {@link module:Customization/background-rendering|background-rendering (module)}
 * @class BackgroundManager
 */
class BackgroundManager {
  /** @constructs */
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

  /**
   * Initializes the functionality by retrieving all background images and animation state from the database and renders them
   * @async
   */
  async initialize() {
    let newImages = await DatabaseInfoModule.retrieveInfo(database, "Custom preferences", {query: "backgroundImages"});
    // console.log(newImages);
    this.animations = (await DatabaseInfoModule.retrieveInfo(database, "Custom preferences", {query: "animations"}))[0];
    
    if (this.animations === undefined) {
      this.animations = true;
      DatabaseInfoModule.saveInfo(database, "Custom preferences", {key: "animations", value: this.animations});
    }
    if (newImages.length === 0 || !newImages[0]) {
      console.log("No images whatsoever!");
      return;
    }

    this.setImagesAsBackground(newImages[0]);
    DOMElementHandler.renderSwitch("switch_animation_div", ".inside-switch-div",
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
   * Changes to and renders specified background image
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


  /**
   * Grabs the animation from the current background image and renders it according to the specified animation mode
   * @param {boolean} animationMode New animation mode
   */
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

const backgroundManager = new BackgroundManager();

export default backgroundManager;

