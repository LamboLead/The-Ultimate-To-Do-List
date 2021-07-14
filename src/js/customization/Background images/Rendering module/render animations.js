export default function moveAnimationSwitch(animationMode) {
    let insideSwitch = document.getElementById("switch_animation_div").querySelector(".inside-switch-div");
    if (animationMode) {
        insideSwitch.style.setProperty("left", "-80%");
    } else {
        insideSwitch.style.setProperty("left", "0%");
    }
}