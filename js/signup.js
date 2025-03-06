document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const errorMessage = document.getElementById("error-message");

    errorMessage.classList.add("hidden");

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errorMessage.textContent = "All fields are required!";
        errorMessage.classList.remove("hidden");
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.classList.remove("hidden");
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters!";
        errorMessage.classList.remove("hidden");
        return;
    }

    // Proceed with the sign-up process (e.g., send data to the backend)
    // For now, redirect to role selection page after successful sign-up
    window.location.href = "role-selection.html";
});
