document.getElementById("role-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedRole = document.getElementById("role").value;

    // Save the role selection (In a real app, you would store this in the backend or session)
    // Redirect user to the appropriate dashboard based on role
    if (selectedRole === "teacher") {
        window.location.href = "teacher-dashboard.html";
    } else if (selectedRole === "learner") {
        window.location.href = "learner-dashboard.html";
    }
});
