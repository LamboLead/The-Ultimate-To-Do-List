/**
 * This is the task module for To-do list functionality.<br>
 * It stores and exports a class definition for a Task object as default.
 * @module To-Do/task
 */

import * as RenderingModule from '../presentation/rendering functions.js';

/**
 * Class to create a Task
 * @class
 */
class Task {
    
    /**
     * @constructs
     * @param {string} id The id of the new created task
     * @param {string} caption The caption of the new created task
     * @param {boolean} [completed] In case the task is completed
     * @param {number} [order] The position that the task belongs to in the DOM
     */
    constructor(id, caption, completed = false, order = 1) {
        this.id = id;
        this.caption = caption;
        this.completed = completed;
        this.order = order;
    }

    /**
     * Renders the task in the DOM by calling renderTask from to-do-rendering-module
     * @returns {void}
     */
    render() {
        RenderingModule.renderTask(this.id, this.caption, this.completed);
    }
}

export default Task;