document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorMessage = document.getElementById('login-error-message');

    // Clear previous error message
    errorMessage.classList.add('hidden');
    
    if (!email || !password) {
        errorMessage.textContent = "Both fields are required.";
        errorMessage.classList.remove('hidden');
        return;
    }

    // Simulating user authentication (use actual authentication method here)
    const loginSuccess = await authenticateUser(email, password);
    
    if (loginSuccess) {
        // Redirect to the dashboard or another page after successful login
        window.location.href = 'dashboard.html';  // Adjust URL accordingly
    } else {
        // Display error message for invalid credentials
        errorMessage.textContent = "Invalid email or password. Please try again.";
        errorMessage.classList.remove('hidden');
    }
});

async function authenticateUser(email, password) {
    try {
        // Here you would call your authentication backend (e.g., Supabase, Firebase, or your custom API)
        // For the sake of this example, we are simulating the authentication.
        
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();

        if (result.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
            }
