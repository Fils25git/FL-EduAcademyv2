// Initialize Supabase  
const { createClient } = supabase;
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle Login Submission  
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    // Authenticate user
    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        document.getElementById("login-message").innerText = "Error: " + error.message;
    } else if (!data.user.email_confirmed_at) {  
        // Check if email is verified  
        document.getElementById("login-message").innerText = "Please verify your email before logging in.";
    } else {
        document.getElementById("login-message").innerText = "Login successful!";
    }
});
