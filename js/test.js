// Import Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle Form Submission
document.getElementById("test-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log("Form submitted"); // Debugging

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log("User input:", email, password); // Debugging

    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    console.log("Supabase response:", data, error); // Debugging

    if (error) {
        document.getElementById("message").innerText = "Error: " + error.message;
        console.error("Error signing up:", error);
    } else {
        document.getElementById("message").innerText = "Sign-up successful! Check your email to verify.";
    }
});
