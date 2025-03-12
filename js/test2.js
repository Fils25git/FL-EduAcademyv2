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

        // Validate input
        if (!regNumber || !passwordInput) {
            message.innerText = "Please enter both Registration Number and Password.";
            message.style.color = "red";
            return;
        }

        // Step 1: Check if regNumber exists in the learners_list
        let { data, error } = await supabase
            .from("learners_list")
            .select("email")  // We still need the email to log the user in
            .eq("reg_number", regNumber)
            .single();  // single() ensures only one result is returned

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

        // Step 2: Log the user in using the found email
        let { session, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,  // Use the email associated with the regNumber
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

        // Redirect to a page after login (for example, the dashboard)
        setTimeout(function () {
            window.location.href = "dashboard.html"; // Adjust the redirection to your dashboard page
        }, 3000);
    });
});
