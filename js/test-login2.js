// Ensure Supabase is correctly initialized before use
document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM Fully Loaded");

    // Initialize Supabase
    const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
    
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let loginForm = document.getElementById("login-form");
    let message = document.getElementById("message");
    let regNumberInput = document.getElementById("reg-number");
    let passwordInput = document.getElementById("password");
    let loginButton = document.getElementById("login-button");

    if (!loginForm) {
        console.error("❌ Error: #login-form not found!");
        return;
    }

    // Enable the login button when inputs are filled
    function checkInputs() {
        if (regNumberInput.value.trim() && passwordInput.value.trim()) {
            loginButton.removeAttribute("disabled");
        } else {
            loginButton.setAttribute("disabled", "true");
        }
    }

    regNumberInput.addEventListener("input", checkInputs);
    passwordInput.addEventListener("input", checkInputs);

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("🟢 Form Submitted");

        let regNumber = regNumberInput.value.trim();
        let password = passwordInput.value.trim();

        if (!regNumber || !password) {
            console.log("❌ Empty fields detected");
            message.innerText = "Please enter both Registration Number and Password.";
            message.style.color = "red";
            return;
        }

        // Fetch email associated with regNumber
        let { data, error } = await supabase
            .from("learners_list")
            .select("email")
            .eq("reg_number", regNumber)
            .single();

        if (error || !data) {
            console.error("❌ Error fetching user by regNumber:", error);
            message.innerText = "User not found. Please check your Registration Number.";
            message.style.color = "red";
            return;
        }

        let userEmail = data.email;
        console.log("✅ Found Email:", userEmail);

        // Authenticate user using email & password
        let { data: session, error: authError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: password
        });

        if (authError) {
            console.error("❌ Login Error:", authError);
            message.innerText = "Authentication Error: " + authError.message;
            message.style.color = "red";
            return;
        }

        console.log("✅ User logged in successfully:", session);
        message.innerText = "Login successful! Redirecting...";
        message.style.color = "green";

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 2000);
    });
});
