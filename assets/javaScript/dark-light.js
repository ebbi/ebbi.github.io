
const rootElement = document.documentElement;
const darkModeElement = document.getElementById("dark-mode");
const lightModeElement = document.getElementById("light-mode");
const savedMode = localStorage.getItem("displayMode");

darkModeElement.addEventListener("click", (event) => {
    setDarkMode(event);
});
lightModeElement.addEventListener("click", (event) => {
    setLightMode(event);
});

if (savedMode == "darkMode") {
    /*
        console.log("displayMode", "darkMode");
    */
    setDarkMode();
};

if (savedMode == "lightMode") {
    /*
        console.log("displayMode", "darkMode");
    */
    setLightMode();
};

function setDarkMode(event) {

    console.log("setDarkMode", event);

    rootElement.setAttribute("class", "dark");
    darkModeElement.setAttribute("class", "display-none");
    lightModeElement.setAttribute("class", "");

    localStorage.setItem("displayMode", "darkMode");

}

function setLightMode(event) {

    console.log("setLightMode", event);

    rootElement.setAttribute("class", "light");
    lightModeElement.setAttribute("class", "display-none");
    darkModeElement.setAttribute("class", "");

    localStorage.setItem("displayMode", "lightMode");

}
