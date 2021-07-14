export function moveThemeSwitch(currentTheme) {
    let themeSwitch = document.getElementById("switch_theme_div").querySelector(".inside-switch-div");
    let newTheme;
    if (currentTheme === "light") {
        newTheme = "dark";
        themeSwitch.style.setProperty("left", "-80%");
    } else {
        newTheme = "light";
        themeSwitch.style.setProperty("left", "0%");
    }
    themeSwitch.addEventListener("transitionend", () => {
        renderTheme(newTheme);
    });
    return newTheme;
}

export function renderTheme(newTheme) {
    // Change app colors
    let root = document.querySelector(":root");
    let reference = {"light": 0, "dark": 1};
    reference = reference[newTheme];
    let themes = {
        "mainContainerColor": ["rgba(255, 255, 255, 0.4)", "rgba(0, 0, 0, 0.5)"],
        "secondaryColor": ["rgba(255, 255, 255, 0.3)", "rgba(0, 0, 0, 0.5)"],
        "taskColor": ["rgba(255, 255, 255, 0.4)", "rgba(0, 0, 0, 0.5)"],
        "innerTaskColor": ["rgba(255, 255, 255, 0.6)", "rgba(0, 0, 0, 0.7)"],
        "popUpColor": ["rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 1)"],
        "mainBorderColor": ["rgba(50, 50, 50, 1)", "rgba(255, 255, 255, 0.7)"],
        "secondBorderColor": ["rgba(90, 90, 90, 0.6)", "rgba(255, 255, 255, 0.3)"],
        "taskEditBorderColor": ["rgb(180, 180, 0)", "rgb(230, 230, 0)"],
        "taskCompleteBorderColor": ["rgb(100, 150, 0)", "rgb(100, 255, 0)"],
        "taskEditColor": ["rgba(255, 255, 0, 0.5)", "rgba(255, 255, 0, 0.2)"],
        "taskCompleteColor": ["rgba(100, 255, 0, 0.5)", "rgba(100, 255, 0, 0.2)"],
        "fontColor": ["rgb(20, 20, 20)", "rgb(210, 210, 210)"]
    };
    for (let property in themes) {
        root.style.setProperty(`--${property}`, themes[property][reference]);
    }

    // Move theme switch
    let themeSwitch = document.getElementById("switch_theme_div").querySelector(".inside-switch-div");
    if (newTheme === "light") {
        themeSwitch.style.setProperty("left", "0%");
    } else {
        themeSwitch.style.setProperty("left", "-80%");
    }
}