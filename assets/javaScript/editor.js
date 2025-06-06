const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        this.elements.main.classList.add("keyboard", "keyboard-hidden");
        this.elements.keysContainer.classList.add("keyboard-keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(
            ".keyboard-key"
        );

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".keyboard-input").forEach((element) => {
            element.addEventListener("focus", () => {
                this.open(element.value, (currentValue) => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "่",
            "̀",
            "́",
            "̂",
            "̌",
            "ε",
            "ɔ",
            "ə",
            "ŋ",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "0",
            "backspace",
            "q",
            "w",
            "e",
            "r",
            "t",
            "y",
            "u",
            "i",
            "o",
            "p",
            "caps",
            "a",
            "s",
            "d",
            "f",
            "g",
            "h",
            "j",
            "k",
            "l",
            "enter",
            "done",
            "z",
            "x",
            "c",
            "v",
            "b",
            "n",
            "m",
            ",",
            ".",
            "?",
            "space"
        ];

        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach((key) => {
            const keyElement = document.createElement("button");
            const insertLineBreak =
                ["ŋ", "backspace", "p", "enter", "?"].indexOf(key) !== -1;

            keyElement.classList.add("keyboard-key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard-wide");
                    //                    keyElement.innerHTML = createIconHTML("backspace");
                    keyElement.innerHTML = createIconHTML("back");
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(
                            0,
                            this.properties.value.length - 1
                        );
                        this._triggerEvent("oninput");
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard-wide", "keyboard-active");
                    //                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.innerHTML = createIconHTML("caps lock");
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle(
                            "keyboard-check",
                            this.properties.capsLock
                        );
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard-wide");
                    //                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.innerHTML = createIconHTML("enter");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard-extrawide");
                    //                    keyElement.innerHTML = createIconHTML("space_bar");
                    keyElement.innerHTML = createIconHTML("space bar");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });
                    break;

                case "^":
                    //                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.innerHTML = createIconHTML("^");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\u0301";
                        this._triggerEvent("oninput");
                    });
                    break;

                case "done":
                    keyElement.classList.add("keyboard-wide", "keyboard-dark");
                    //                   keyElement.innerHTML = createIconHTML("check_circle");
                    keyElement.innerHTML = createIconHTML("exit");
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock
                            ? key.toUpperCase()
                            : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(name) {
        if (typeof this.eventHandlers[name] === "function") {
            this.eventHandlers[name](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock
                    ? key.textContent.toUpperCase()
                    : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard-hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard-hidden");
    }
};

Keyboard.init();
