import * as RenderingModule from '../rendering/task-rendering-module.js';

/**
 * Class to create a Task
 * @class Task
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
	 */
	render() {
		RenderingModule.renderTask(this.id, this.caption, this.completed);
	}
}

export default Task;