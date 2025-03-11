// Initialize Supabase (No import needed)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const regNumber = urlParams.get("regNumber");

    if (regNumber) {
        const regDisplay = document.getElementById("reg-number-display");
        const messageBox = document.getElementById("reg-message");

        if (regDisplay && messageBox) {
            regDisplay.textContent = `Your Registration Number: ${regNumber}`;
            messageBox.textContent = "Note this number down! You won’t see it again.";
            messageBox.style.color = "red";
            messageBox.style.fontWeight = "bold"; 

            sessionStorage.setItem("userRegNumber", regNumber);
        }
    }
});

// Enable login button only if both fields are filled
document.getElementById("login-form").addEventListener("input", function () {
    const regInput = document.getElementById("reg-number").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const loginButton = document.getElementById("login-button");

    loginButton.disabled = !(regInput && passwordInput);
});

// Handle login
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let regNumber = document.getElementById("reg-number").value.trim();
    let password = document.getElementById("password").value.trim();
    let messageBox = document.getElementById("message");

    messageBox.textContent = "Logging in... Please wait.";
    messageBox.style.color = "blue";

    let { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("reg_number", regNumber)
        .eq("password", password)
        .single();

    if (error || !data) {
        messageBox.textContent = "❌ Invalid Reg Number or Password";
        messageBox.style.color = "red";
    } else {
        messageBox.textContent = "✅ Login successful! Redirecting...";
        messageBox.style.color = "green";
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
    }
});
