// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById("login-form");
    let message = document.getElementById("message");

    if (!loginForm) {
        console.error("Error: #login-form not found!");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let regNumber = document.getElementById("reg-number").value;
        let passwordInput = document.getElementById("password").value;

        // Check if regNumber is entered
        if (!regNumber || !passwordInput) {
            message.innerText = "Please enter both Registration Number and Password.";
            message.style.color = "red";
            return;
        }

        // Step 1: Find user email by regNumber
        let { data, error } = await supabase
            .from("learners_list")
            .select("email")
            .eq("reg_number", regNumber)
            .single(); // single() ensures we get only one result

        if (error) {
            console.error("Error fetching user by regNumber:", error);
            message.innerText = "Error finding user. Please check your registration number.";
            message.style.color = "red";
            return;
        }

        if (!data) {
            message.innerText = "No user found with that Registration Number.";
            message.style.color = "red";
            return;
        }

        // Step 2: Login using the found email and provided password
        let { session, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: passwordInput
        });

        if (authError) {
            console.error("Login Error:", authError);
            message.innerText = "Authentication Error: " + authError.message;
            message.style.color = "red";
            return;
        }

        // Success - Redirect to dashboard or homepage
        console.log("✅ User logged in successfully:", session);
        message.innerText = "Login successful! Redirecting...";
        message.style.color = "green";

        // Redirect to a page after login, for example, the dashboard.
        setTimeout(function () {
            window.location.href = "dashboard.html"; // Change to your desired page
        }, 3000);
    });
});
