export type ParamEvent = {
    type: string;
    callback: (event: Event) => void;
};

export default interface Parameters {
    tag: string;
    cssClasses?: string[];
    attributes?: { [key: string]: string };
    content?: string;
    event?: ParamEvent;
}
