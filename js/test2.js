// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// Select the form and other DOM elements
const signupForm = document.getElementById("signup-form");
const messageBox = document.getElementById("message");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordMatchMessage = document.getElementById("passwordMatchMessage");

// Helper function to validate password strength
function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
    return regex.test(password);
}

// Handle password matching
confirmPasswordInput.addEventListener("input", () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordMatchMessage.style.display = "block";
        passwordMatchMessage.innerText = "Passwords do not match.";
    } else {
        passwordMatchMessage.style.display = "none";
    }
});

// Function to send welcome email
async function sendWelcomeEmail(userEmail) {
    console.log(`Welcome email sent to ${userEmail}`);
}

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.clear();
        console.log("Form submitted!");

        // Get form values
        let firstName = document.getElementById("first-name")?.value.trim();
        let middleName = document.getElementById("middle-name")?.value.trim();
        let lastName = document.getElementById("last-name")?.value.trim();
        let school = document.getElementById("school")?.value.trim();
        let classSelected = document.getElementById("class")?.value.trim();
        let age = document.getElementById("age")?.value.trim();
        let district = document.getElementById("district")?.value.trim();
        let parentPhone = document.getElementById("parent-phone")?.value.trim();

        // Validation
        if (!firstName || !lastName || !school || !classSelected || !age || !district || !parentPhone || !passwordInput.value.trim()) {
            messageBox.innerText = "Please fill in all required fields.";
            messageBox.style.color = "red";
            return;
        }

        if (!validatePassword(passwordInput.value)) {
            messageBox.innerText = "Password must be at least 6 characters, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
            messageBox.style.color = "red";
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchMessage.style.display = "block";
            passwordMatchMessage.innerText = "Passwords do not match.";
            return;
        } else {
            passwordMatchMessage.style.display = "none";
        }

        console.log("All validations passed. Proceeding with signup...");

        let year = new Date().getFullYear();
        let { count, error: countError } = await supabase
            .from("learners_list")
            .select("*", { count: "exact", head: true });

        if (countError) {
            console.error("Error counting users:", countError);
            messageBox.innerText = "Error generating registration number.";
            messageBox.style.color = "red";
            return;
        }

        let userNumber = String(count + 1).padStart(3, "0");
        let regNumber = `FL${year}${userNumber}`;

        let { data: authData, error: authError } = await supabase.auth.signUp({
            email: `${regNumber}@fleduacademy.com`,
            password: passwordInput.value
        });

        if (authError) {
            console.error("Signup Error:", authError);
            messageBox.innerText = "Signup failed: " + authError.message;
            messageBox.style.color = "red";
            return;
        }

        console.log("✅ User signed up in authentication:", authData);

        let userId = authData.user?.id;
        if (!userId) {
            messageBox.innerText = "Error creating account. Please try again.";
            messageBox.style.color = "red";
            return;
        }

        let { error: dbError } = await supabase.from("learners_list").insert([{
            user_id: userId,
            reg_number: regNumber,
            first_name: firstName,
            middle_name: middleName || null,
            last_name: lastName,
            school: school,
            class_selected: classSelected,
            age: age,
            district: district,
            parent_phone: parentPhone,
            email: `${regNumber}@fleduacademy.com`
        }]);

        if (dbError) {
            console.error("Database Insert Error:", dbError);
            messageBox.innerText = "Error saving user data: " + dbError.message;
            messageBox.style.color = "red";
            return;
        }

        console.log("✅ User data saved to learners_list table");

        // Send welcome email
        await sendWelcomeEmail(`${regNumber}@fleduacademy.com`);

        // Hide form and show success message
        signupForm.style.display = "none";
        messageBox.innerHTML = `
            <div style="padding: 20px; background: #4CAF50; color: white; border-radius: 10px; text-align: center; font-size: 18px;">
                <h2>🎉 Congratulations and Welcome, Future Genius! <strong>${firstName}</strong>! 🎊</h2>
                <p>Your Registration Number is: <strong>${regNumber}</strong></p>
                <p>🚨 Save this Registration Number! 🚨</p>
                <button id="goToLogin" style="padding: 10px 20px; margin-top: 15px; background: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Go to Login</button>
            </div>
        `;

        document.getElementById("goToLogin").addEventListener("click", () => {
            window.location.href = `/html/test-login2.html?reg=${encodeURIComponent(regNumber)}`;
        });
    });
}
