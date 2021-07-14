import * as RenderingModule from '../Presentation/rendering functions.js';

export class Task {
    constructor(id, caption, completed = false, order = 1) {
        this.id = id;
        this.caption = caption;
        this.completed = completed;
        this.order = order;
    }
    render() {
        RenderingModule.renderTask(this.id, this.caption, this.completed);
    }
}