var t = document.getElementById("custom-cursor");
document.addEventListener("mousemove", function(e) {
    t.style.left = e.clientX + "px",
    t.style.top = e.clientY + "px"
}),
document.querySelectorAll("a, button, .hoverable").forEach(function(e) {
    e.addEventListener("mouseenter", function() {
        t.classList.add("pointer")
    }),
    e.addEventListener("mouseleave", function() {
        t.classList.remove("pointer")
    })
})