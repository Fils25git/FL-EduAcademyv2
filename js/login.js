document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const errorMessage = document.getElementById("login-error-message");

    errorMessage.classList.add("hidden");

    // Basic validation
    if (!email || !password) {
        errorMessage.textContent = "Both email and password are required!";
        errorMessage.classList.remove("hidden");
        return;
    }

    // Mock authentication (you can integrate this with a real backend later)
    if (email !== "test@example.com" || password !== "password123") {
        errorMessage.textContent = "Incorrect email or password!";
        errorMessage.classList.remove("hidden");
        return;
    }

    // Redirect to the role selection page
    window.location.href = "role-selection.html";
});
