const scrollUpBtn = document.getElementById("scrollUpBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollUpBtn.style.display = "block";
    } else {
        scrollUpBtn.style.display = "none";
    }
});

scrollUpBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});