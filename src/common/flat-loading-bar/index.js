export default class {
    constructor(element, transitionDelay = 1000) {
        this.element = element;
        this.queueDelay = 0;
        this.transitionDelay = transitionDelay;
        this.element.style.setProperty("transition", `width ${this.transitionDelay}ms ease-in-out, 
            opacity ${this.transitionDelay}ms ease-in-out`);
        setInterval(() => { if (this.queueDelay > 50) this.queueDelay -= 50; }, 50);
    }

    setPercentage(percentage, customDelay = this.transitionDelay) {
        this.postToQueue(() => this.element.style.setProperty("width", `${percentage}%`), customDelay);
    }

    increasePercentage(percentage, customDelay = this.transitionDelay) {
        const current = Number(this.element.style.getPropertyValue("width").replace("%", ""), customDelay);
        const newPercentage = current + percentage;
        this.setPercentage(newPercentage);
    }

    disappear(customDelay = this.transitionDelay) {
        this.postToQueue(() => {
            this.element.style.setProperty("transition", `width ${this.transitionDelay}ms ease-in-out, 
                opacity ${this.transitionDelay}ms ease-in-out`);
            this.element.style.setProperty("opacity", "0");
        }, customDelay);
        this.postToQueue(() => this.element.style.setProperty("transition", 
            `${this.transitionDelay}ms ease-in-out`), customDelay);
    }

    reset(customDelay = this.transitionDelay) {
        this.postToQueue(() => this.element.style.setProperty("transition", "none"), customDelay);
        this.postToQueue(() => {
            this.element.style.setProperty("width", "0px");
            this.element.style.setProperty("opacity", "100");
        }), customDelay;
        this.postToQueue(() => this.element.style.setProperty("transition", `width ${this.transitionDelay}ms ease-in-out, 
            opacity ${this.transitionDelay}ms ease-in-out`), customDelay);
    }

    restore(customDelay = this.transitionDelay) {
        this.postToQueue(() => this.element.style.setProperty("opacity", "100"), customDelay);
    }

    finish(customDelay = this.transitionDelay) {
        this.setPercentage(100, customDelay);
        this.disappear(customDelay);
        this.reset();
    }

    postToQueue(callback, transitionDelay=this.transitionDelay) {
        setTimeout(() => callback(), this.queueDelay);
        this.queueDelay += transitionDelay;
    }

    static getOnly(document, transitionDelay = 1000) {
        const element = Array.from(document.getElementsByClassName("flat-loading-bar"))[0];
        return new this(element, transitionDelay);
    }

}