// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Make sure to use the public "anon" key only)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {
    let signupForm = document.getElementById("signup-form");

    if (!signupForm) {
        console.error("Error: #signup-form not found!");
        return;
    }

    let passwordInput = document.getElementById("password");
    let confirmPasswordInput = document.getElementById("confirmPassword");
    let passwordError = document.getElementById("passwordError");
    let passwordMatchMessage = document.getElementById("passwordMatchMessage");
    let message = document.getElementById("message");

    // Null checks to prevent errors
    if (!passwordInput || !confirmPasswordInput || !message) {
        console.error("Error: Missing form elements!");
        return;
    }

    // Real-time Password Matching
    confirmPasswordInput.addEventListener("input", function () {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchMessage.style.display = "block";
            passwordMatchMessage.innerText = "Passwords do not match.";
            passwordMatchMessage.style.color = "red";
        } else {
            passwordMatchMessage.style.display = "none";
        }
    });

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Form submitted!");

        let firstName = document.getElementById("first-name")?.value.trim();
        let middleName = document.getElementById("middle-name")?.value.trim();
        let lastName = document.getElementById("last-name")?.value.trim();
        let school = document.getElementById("school")?.value.trim();
        let classSelected = document.getElementById("class")?.value.trim();
        let age = document.getElementById("age")?.value.trim();
        let district = document.getElementById("district")?.value.trim();
        let parentPhone = document.getElementById("parent-phone")?.value.trim();
        let password = passwordInput.value.trim();

        // Check required fields
        if (!firstName || !lastName || !school || !classSelected || !age || !district || !parentPhone || !password) {
            message.innerText = "Please fill in all required fields.";
            message.style.color = "red";
            return;
        }

        // Password Validation
        if (password.length < 6) {
            message.innerText = "Password must be at least 6 characters long.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPasswordInput.value) {
            passwordError.style.display = "block";
            passwordError.innerText = "Passwords do not match.";
            passwordError.style.color = "red";
            return;
        } else {
            passwordError.style.display = "none";
        }

        // Generate Registration Number
        let year = new Date().getFullYear();
        let { count, error: countError } = await supabase
            .from("learners_list")
            .select("*", { count: "exact" });

        if (countError) {
            console.error("Error counting users:", countError);
            message.innerText = "Error generating registration number.";
            message.style.color = "red";
            return;
        }

        let userNumber = String(count + 1).padStart(3, "0");
        let regNumber = `FL${year}${userNumber}`;

        // ✅ 1. Register user in Supabase Authentication
        let { data: authData, error: authError } = await supabase.auth.signUp({
            email: `${regNumber}@fleduacademy.com`, // Unique email format
            password: password,
        });

        if (authError) {
            console.error("Signup Error:", authError);
            message.innerText = "Signup failed: " + authError.message;
            message.style.color = "red";
            return;
        }

        console.log("✅ User signed up in authentication:", authData);

        // ✅ 2. Insert user data into `learners_list` table
        let userId = authData.user?.id; // Unique ID from Supabase Auth

        if (!userId) {
            message.innerText = "Error creating account. Please try again.";
            message.style.color = "red";
            return;
        }

        let { error: dbError } = await supabase.from("learners_list").insert([
            {
                user_id: userId, // Store the unique user ID
                reg_number: regNumber,
                first_name: firstName,
                middle_name: middleName || null,
                last_name: lastName,
                school: school,
                class_selected: classSelected,
                age: age,
                district: district,
                parent_phone: parentPhone,
            }
        ]);

        if (dbError) {
            console.error("Database Insert Error:", dbError);
            message.innerText = "Database Error: " + dbError.message;
            message.style.color = "red";
            return;
        }

        // ✅ 3. Success message & redirect
        message.innerText = `✅ Sign-up successful! Your Reg Number is: ${regNumber}`;
        message.style.color = "green";

        setTimeout(function () {
            window.location.href = `test-login2.html?regNumber=${regNumber}`;
        }, 3000);
    });
});
