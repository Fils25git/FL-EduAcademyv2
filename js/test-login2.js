// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let regNumber = document.getElementById("reg-number").value;
    let password = document.getElementById("password").value;

    let { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("reg_number", regNumber)
        .eq("password", password)
        .single();

    if (error || !data) {
        document.getElementById("message").innerText = "Invalid Reg Number or Password";
    } else {
        document.getElementById("message").innerText = "Login successful!";
        window.location.href = "dashboard.html"; // Redirect to dashboard after login
    }
});
