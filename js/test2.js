// Import createClient from Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase URL and Key
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";  // Ensure your Supabase Key is correct

// Initialize the Supabase client// Handle form submission
document.addEventListener("DOMContentLoaded", function() {
    // Your existing code here
    
    document.getElementById("signup-form").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get user input values
        let firstName = document.getElementById("first-name").value;
        let middleName = document.getElementById("middle-name").value;  // Optional
        let lastName = document.getElementById("last-name").value;
        let school = document.getElementById("school").value;
        let classSelected = document.getElementById("class").value;
        let age = document.getElementById("age").value;
        let district = document.getElementById("district").value;
        let parentPhone = document.getElementById("parent-phone").value;

        // Get password fields
        let passwordInput = document.getElementById("password");
        let confirmPasswordInput = document.getElementById("confirm-password");
        let passwordError = document.getElementById("passwordError");
        let message = document.getElementById("message"); // Error message element

        // Function to check password match
        function checkPasswordMatch() {
            let password = passwordInput.value;
            let confirmPassword = confirmPasswordInput.value;

            if (password.length < 6) {
                message.innerText = "Password must be at least 6 characters long.";
                message.style.color = "red";
                passwordError.style.display = "none"; // Hide mismatch error if length is invalid
                return;
            } else {
                message.innerText = ""; // Clear error if valid
            }

            if (password !== confirmPassword) {
                passwordError.style.display = "block";
                passwordError.innerText = "Passwords do not match.";
                passwordError.style.color = "red";
            } else {
                passwordError.style.display = "none";
            }
        }

        // Event listeners for real-time password checking
        passwordInput.addEventListener("input", checkPasswordMatch);
        confirmPasswordInput.addEventListener("input", checkPasswordMatch);

        // Function to generate registration number and insert user data
        async function registerUser() {
            let password = passwordInput.value; // Get password after validation

            // Validate form data
            if (password.length < 6 || password !== confirmPasswordInput.value) {
                message.innerText = "Fix password errors before submitting.";
                message.style.color = "red";
                return;
            }

            let year = new Date().getFullYear();

            // Count existing users to generate the next Reg Number
            let { count, error: countError } = await supabase
                .from("users")
                .select("*", { count: "exact" });

            if (countError) {
                console.error("Error counting users:", countError);
                message.innerText = "Error generating registration number.";
                message.style.color = "red";
                return;
            }

            let userNumber = String(count + 1).padStart(3, "0"); // Ensure 3-digit format
            let regNumber = `FL${year}${userNumber}`;

            // Insert user data into Supabase
            let { data, error } = await supabase.from("users").insert([
                {
                    reg_number: regNumber,
                    first_name: firstName,
                    middle_name: middleName || null, // Optional
                    last_name: lastName,
                    school: school,
                    class_selected: classSelected,
                    age: age,
                    district: district,
                    parent_phone: parentPhone,
                    password: password // You should hash the password before storing
                }
            ]);

            if (error) {
                message.innerText = "Error: " + error.message;
                message.style.color = "red";
            } else {
                message.innerText = `Sign-up successful! Your Reg Number is: ${regNumber}`;
                message.style.color = "green";
            }
        }

        // Call registerUser() when submitting the form
        registerUser(); // <-- Make sure this function is properly called here
    });
});
