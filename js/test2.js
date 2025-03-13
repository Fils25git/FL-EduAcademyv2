// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Ensure DOM is loaded before running script
document.addEventListener("DOMContentLoaded", function() {
    let signupForm = document.getElementById("signup-form");

    if (!signupForm) {
        console.error("Error: #signup-form not found!");
        return;
    }

    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        console.log("Form submitted!"); // Debugging

        let firstName = document.getElementById("first-name").value;
        let middleName = document.getElementById("middle-name").value;  
        let lastName = document.getElementById("last-name").value;
        let school = document.getElementById("school").value;
        let classSelected = document.getElementById("class").value;
        let age = document.getElementById("age").value;
        let district = document.getElementById("district").value;
        let parentPhone = document.getElementById("parent-phone").value;
        
        let passwordInput = document.getElementById("password");
        let confirmPasswordInput = document.getElementById("confirmPassword"); // Fixed ID
        let passwordError = document.getElementById("passwordError");
        let message = document.getElementById("message");

        // Password Validation
        if (passwordInput.value.length < 6) {
            message.innerText = "Password must be at least 6 characters long.";
            message.style.color = "red";
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
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
        let email = `${regNumber}@fleduacademy.com`; // Auto-generate email

        // ✅ 1. Register user in Supabase Authentication
        let { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: passwordInput.value
        });

        if (authError) {
            console.error("Signup Error:", authError);
            message.innerText = "Authentication Error: " + authError.message;
            message.style.color = "red";
            return;
        }

        console.log("✅ User signed up in authentication:", authData);

        // ✅ 2. Insert user data into `learners_list` table
        let { error: dbError } = await supabase.from("learners_list").insert([
            {
                reg_number: regNumber,
                first_name: firstName,
                middle_name: middleName || null,
                last_name: lastName,
                school: school,
                class_selected: classSelected,
                age: age,
                district: district,
                parent_phone: parentPhone,
                email: email // Store the generated email
            }
        ]);

        if (dbError) {
            console.error("Database Insert Error:", dbError);
            message.innerText = "Database Error: " + dbError.message;
            message.style.color = "red";
        } else {
            message.innerText = `✅ Sign-up successful! Your Reg Number is: ${regNumber}`;
            message.style.color = "green";

            setTimeout(function() {
                window.location.href = "test-login2.html?regNumber=" + regNumber;
            }, 3000);
        }
    });
});
