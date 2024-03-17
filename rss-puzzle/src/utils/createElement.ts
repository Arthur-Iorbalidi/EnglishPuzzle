import Parameters, { ParamEvent } from '../interfaces/parameters';
class CreateElement {
    private element: HTMLElement;
    constructor(parameters: Parameters) {
        this.element = document.createElement(parameters.tag);
        if (parameters.hasOwnProperty('cssClasses')) {
            this.setClasses(parameters.cssClasses as string[]);
        }
        if (parameters.hasOwnProperty('attributes')) {
            this.setAttribute(parameters.attributes as { [key: string]: string });
        }
        if (parameters.hasOwnProperty('content')) {
            this.setContent(parameters.content as string);
        }
        if (parameters.hasOwnProperty('event')) {
            this.setEvent(parameters.event as ParamEvent);
        }
    }
    public setClasses(cssClasses: string[]): void {
        cssClasses.forEach((cssClass) => {
            this.element.classList.add(cssClass);
        });
    }
    public setAttribute(attributes: { [key: string]: string }): void {
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                this.element.setAttribute(key, attributes[key]);
            }
        }
    }
    public setContent(content: string) {
        this.element.textContent = content;
    }
    public setEvent(addedEvent: ParamEvent) {
        this.element.addEventListener(addedEvent.type, (event) => addedEvent.callback(event));
    }
    public getElement() {
        return this.element;
    }
}

export default CreateElement;
