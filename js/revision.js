document.addEventListener("DOMContentLoaded", function () {
    let parts = document.querySelectorAll(".content-part");

    parts.forEach((part) => {
        let partNumber = part.getAttribute("data-part");
        let checkbox = part.querySelector(".read-checkbox");
        let button = part.querySelector(".quiz-btn");

        // Load saved progress
        if (localStorage.getItem("read-part-" + partNumber) === "true") {
            checkbox.checked = true;
            button.disabled = false;
        }

        // Save progress when checked
        checkbox.addEventListener("change", function () {
            let checked = checkbox.checked;
            localStorage.setItem("read-part-" + partNumber, checked);
            button.disabled = !checked;
        });

        // Start quiz when button is clicked
        button.addEventListener("click", function () {
            window.location.href = "quiz" + partNumber + ".html"; // Redirect to corresponding quiz
        });
    });

    // Enable final quiz button only if all parts are completed
    let finalQuizButton = document.getElementById("start-final-quiz");
    function checkAllRead() {
        let allRead = Array.from(parts).every((part) =>
            localStorage.getItem("read-part-" + part.getAttribute("data-part")) === "true"
        );
        finalQuizButton.disabled = !allRead;
    }

    checkAllRead();
});
