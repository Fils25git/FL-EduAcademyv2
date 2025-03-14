// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Fully Loaded");

    let loginForm = document.getElementById("login-form");
    let message = document.getElementById("message");

    if (!loginForm) {
        console.error("❌ Error: #login-form not found!");
        return;
    }

    console.log("✅ Login Form Found:", loginForm);

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("🟢 Form Submitted");

        let regNumber = document.getElementById("reg-number").value;
        let passwordInput = document.getElementById("password").value;

        if (!regNumber || !passwordInput) {
            console.log("❌ Empty fields detected");
            message.innerText = "Please enter both Registration Number and Password.";
            message.style.color = "red";
            return;
        }

        console.log("🔍 Checking regNumber:", regNumber);

        let { data, error } = await supabase
            .from("learners_list")
            .select("email")
            .eq("reg_number", regNumber)
            .single();

        if (error) {
            console.error("❌ Error fetching user by regNumber:", error);
            message.innerText = "Error finding user. Please check your registration number.";
            message.style.color = "red";
            return;
        }

        if (!data) {
            console.log("❌ No user found with regNumber:", regNumber);
            message.innerText = "No user found with that Registration Number.";
            message.style.color = "red";
            return;
        }

        console.log("✅ Found Email:", data.email);

        let { session, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: passwordInput
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
        }, 3000);
    });
});
