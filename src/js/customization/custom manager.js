import database from '../storage/database management.js';
import * as DatabaseInfoModule from '../storage/information management functions.js';

import * as BackgroundRenderingModule from './Background images/Rendering module/render background.js';

import * as ThemeRenderingModule from './Theme/theme functions.js';

class CustomManager {
    constructor() {
        if (!CustomManager.instance) {
            this.backgroundImages = null;
            this.currentImageIndex = 0;
            this.animations = true;
            this.theme = "light";
            CustomManager.instance = this;
        }
        return CustomManager.instance;
    }
    async initialize() {
        // Retrieves information from the database. If information is found, the program sets background, animations and theme

        await this.retrieveInfo();

        if (!this.backgroundImages) return;

        BackgroundRenderingModule.setBackgroundImages(this.backgroundImages, this.currentImageIndex);
        BackgroundRenderingModule.moveAnimationsSwitch(this.animations);
        ThemeRenderingModule.renderTheme(this.theme);
    }
    setImagesAsBackground(imagesArr) {
        // Sets imagesArr as the new background images, renders them, and saves them in the database.

        this.backgroundImages = imagesArr;
        BackgroundRenderingModule.setBackgroundImages(this.backgroundImages);
        DatabaseInfoModule.saveInfo(database, "Preferences", {key: "backgroundImages", value: this.backgroundImages});
    }
    toggleAnimations() {
        // Inverts the existing mode for animations, renders the changes, and saves the new value in local storage

        this.animations = !this.animations;
        BackgroundRenderingModule.moveAnimationsSwitch(this.animations);
        localStorage.setItem("animations", this.animations);
    }
    setTheme() {
        // Inverts the existing theme, renders the changes and saves the new value in local storage
        this.theme = ThemeRenderingModule.moveThemeSwitch(this.theme);
        localStorage.setItem("theme", this.theme);
    }
    async retrieveInfo() {
        // Retrieve background images
        let images = await DatabaseInfoModule.retrieveInfo(database, "Preferences", {query: "backgroundImages"});
        this.backgroundImages = images[0];
        this.currentImageIndex = parseInt(localStorage.getItem("currentImageIndex"));

        // Retrieve animations mode
        this.animations = localStorage.getItem("animations") === "true";

        // Retrieve theme
        this.theme = localStorage.getItem("theme");
    }
}

const customManager = new CustomManager();
export default customManager;