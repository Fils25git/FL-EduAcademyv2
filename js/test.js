// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle Form Submission
document.getElementById("test-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get user input
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Save to Supabase
    let { data, error } = await supabase.from("1").insert([
        { name: name, email: email, password: password }
    ]);

    // Show result
    if (error) {
        document.getElementById("message").innerText = "Error: " + error.message;
    } else {
        document.getElementById("message").innerText = "Sign-up successful!";
    }
});
