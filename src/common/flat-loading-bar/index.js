export default class {
    constructor(element, transitionDelay = 1000) {
        this.element = element;
        this.queueDelay = 0;
        this.transitionDelay = transitionDelay;
        this.element.style.setProperty("transition", `${this.transitionDelay}ms ease-in-out`);
        setInterval(() => { if (this.queueDelay > 50) this.queueDelay -= 50; }, 50);
    }

    setPercentage(percentage) {
        this.postToQueue(() => this.element.style.setProperty("width", `${percentage}%`));
    }

    increasePercentage(percentage) {
        const current = Number(this.element.style.getPropertyValue("width").replace("%", ""));
        const newPercentage = current + percentage;
        this.setPercentage(newPercentage);
    }

    disappear(disappearTransitionDelay = this.transitionDelay) {
        this.postToQueue(() => {
            this.element.style.setProperty("transition", `${disappearTransitionDelay}ms ease-in-out`);
            this.element.style.setProperty("opacity", "0");
        }, disappearTransitionDelay);
        this.postToQueue(() => this.element.style.setProperty("transition", 
            `${this.transitionDelay}ms ease-in-out`), disappearTransitionDelay);
    }

    reset() {
        this.postToQueue(() => this.element.style.setProperty("transition", "none"));
        this.postToQueue(() => {
            this.element.style.setProperty("width", "0px");
            this.element.style.setProperty("opacity", "100");
        });
        this.postToQueue(() => this.element.style.setProperty("transition", `${this.transitionDelay}ms ease-in-out`));
    }

    restore() {
        this.postToQueue(() => this.element.style.setProperty("opacity", "100"));
    }

    finish(disappearTransitionDelay = this.transitionDelay) {
        this.setPercentage(100);
        this.disappear(disappearTransitionDelay);
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