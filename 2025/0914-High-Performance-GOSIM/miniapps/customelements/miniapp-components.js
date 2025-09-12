
class ScrollView extends HTMLElement {
    static observedAttributes = ["scroll-into-view"];

    constructor() {
        self = super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "scroll-into-view":
                // Scroll to the view id
                break;
            default:
                break;
        }
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
    }

    connectedCallback() {
        // configure the component
        if (this.hasAttribute("scroll-y") && this.getAttribute("scroll-y")==="true") {
            console.log('scroll-y is true');
            this.style.overflowY = "scroll";
        } else {
            this.style.overflowY = "clip";
        }
        if (this.hasAttribute("scroll-x") && this.getAttribute("scroll-x")==="true") {
            console.log('scroll-x is true');
            this.style.overflowX = "scroll";
        } else {
            this.style.overflowX = "clip";
        }
        if (this.hasAttribute("scroll-top")) {
            console.log(`scroll-top is set to ${this.getAttribute("scroll-top")}`);
        }

        // Gets all the containers inside it
        const children = Array.from(self.children);
        children.forEach((child) => {
            // Add styles to the view containers inside the scroll-view
        });
        this.updateStyle(this);

        // Scroll to the specific inner container?
        if (this.hasAttribute("scroll-into-view")) {
            const viewId = this.getAttribute("scroll-into-view");
            console.log(`scroll-into-view is set to ${viewId}`);
            const el = self.querySelector(`#${viewId}`);
            if (el) {
                el.scrollIntoView();
            }
        }
    }
  
  updateStyle(elem) {
      elem.style.display = "block";
    }
}

// https://smartprogram.baidu.com/docs/develop/component/base_icon/
class Icon extends HTMLElement {
    static observedAttributes = ["type","size","color"];

    constructor() {
        self = super();
        const shadow = this.attachShadow({ mode: "open" });
        const span = document.createElement("span");
        shadow.appendChild(span);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "type":
                break;
            case "size":
                break;
            case "color":
                break;
            default:
                break;
        }
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
    }

    connectedCallback() {
        // configure the component
        const shadow = this.shadowRoot;
        if (this.hasAttribute("type")) {
            switch (this.getAttribute("type")) {
                case 'info':
                    shadow.querySelector("span").textContent = `i`;
                    break;
                case 'warn':
                    shadow.querySelector("span").textContent = `!`;
                    break;
                case 'waiting':
                    shadow.querySelector("span").textContent = `W`;
                    break;
                default:
                    break;
            }
        }
        if (this.hasAttribute("color")) {
            // Check that value is valid
            shadow.querySelector("span").style.color = this.getAttribute("color");
        }
        if (this.hasAttribute("size")) {
            // Check that value is valid
            shadow.querySelector("span").style.fontSize = `${this.getAttribute("size")}px`;
        }
    }
  
}

customElements.define("scroll-view", ScrollView);
customElements.define("miniapp-icon", Icon);
