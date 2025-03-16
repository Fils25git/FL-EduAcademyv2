// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Select the form
const signupForm = document.getElementById("signup-form");
const signupContainer = document.getElementById("signup-container");
const messageContainer = document.getElementById("message-container");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form values
        let firstName = document.getElementById("first-name")?.value.trim();
        let lastName = document.getElementById("last-name")?.value.trim();
        let school = document.getElementById("school")?.value.trim();
        let classSelected = document.getElementById("class")?.value.trim();
        let age = document.getElementById("age")?.value.trim();
        let district = document.getElementById("district")?.value.trim();
        let parentPhone = document.getElementById("parent-phone")?.value.trim();

        if (!firstName || !lastName || !school || !classSelected || !age || !district || !parentPhone) {
            alert("Please fill in all required fields.");
            return;
        }

        // Generate Registration Number
        let year = new Date().getFullYear();
        let { count, error: countError } = await supabase.from("learners_list").select("*", { count: "exact" });

        if (countError) {
            alert("Error generating registration number.");
            return;
        }

        let userNumber = String(count + 1).padStart(3, "0");
        let regNumber = `FL${year}${userNumber}`;

        // Insert user data into learners_list table
        let { error: dbError } = await supabase.from("learners_list").insert([
            {
                reg_number: regNumber,
                first_name: firstName,
                last_name: lastName,
                school: school,
                class_selected: classSelected,
                age: age,
                district: district,
                parent_phone: parentPhone
            }
        ]);

        if (dbError) {
            alert("Error saving user data: " + dbError.message);
            return;
        }

        // Store reg number in Local Storage
        localStorage.setItem("regNumber", regNumber);

        // Hide form and show message
        signupContainer.style.display = "none";
        messageContainer.innerHTML = `
            <div style="text-align:center; padding: 20px; border: 2px solid green; border-radius: 10px; background: #f9fff3;">
                <h2>🎉 Welcome, Future Genius! 🎉</h2>
                <p>Your Registration Number is: <strong>${regNumber}</strong></p>
                <p>🚨 This is the last time you'll see it! 🚨<br>It will take a LONG time to reset it in the future! 😂</p>
                <button id="goToLogin" style="padding: 10px 20px; margin-top: 15px; background: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Go to Login</button>
            </div>
        `;

        // Add event listener for the button
        document.getElementById("goToLogin").addEventListener("click", () => {
            window.location.href = "/html/test-login2.html";
        });
    });
}
// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Select the form
const signupForm = document.getElementById("signup-form");

// Password match real-time check
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordMatchMessage = document.getElementById("passwordMatchMessage");

confirmPasswordInput.addEventListener("input", () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordMatchMessage.style.display = "block";
        passwordMatchMessage.innerText = "Passwords do not match.";
    } else {
        passwordMatchMessage.style.display = "none";
    }
});

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
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
        let message = document.getElementById("message");

        // Validate input fields
        if (!firstName || !lastName || !school || !classSelected || !age || !district || !parentPhone || !passwordInput.value.trim()) {
            message.innerText = "Please fill in all required fields.";
            message.style.color = "red";
            return;
        }

        if (passwordInput.value.length < 6) {
            message.innerText = "Password must be at least 6 characters long.";
            message.style.color = "red";
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

        // Generate Registration Number
        let year = new Date().getFullYear();
        let { count, error: countError } = await supabase.from("learners_list").select("*", { count: "exact" });

        if (countError) {
            console.error("Error counting users:", countError);
            message.innerText = "Error generating registration number.";
            message.style.color = "red";
            return;
        }

        let userNumber = String(count + 1).padStart(3, "0");
        let regNumber = `FL${year}${userNumber}`;

        // Sign up user in Supabase Auth
        let email = `${regNumber}@fleduacademy.com`; // Auto-generated email
        let { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: passwordInput.value
        });

        if (authError) {
            console.error("Signup Error:", authError);
            message.innerText = "Signup failed: " + authError.message;
            message.style.color = "red";
            return;
        }

        console.log("✅ User signed up in authentication:", authData);

        // Insert user data into learners_list table
        let userId = authData.user?.id;
        if (!userId) {
            message.innerText = "Error creating account. Please try again.";
            message.style.color = "red";
            return;
        }

        let { error: dbError } = await supabase.from("learners_list").insert([
            {
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
                email: email
            }
        ]);

        if (dbError) {
            console.error("Database Insert Error:", dbError);
            message.innerText = "Error saving user data: " + dbError.message;
            message.style.color = "red";
            return;
        }

        console.log("✅ User data saved to learners_list table");

        // Store reg number in sessionStorage for display on login page
       let loginURL = `/html/test-login2.html?reg=${encodeURIComponent(regNumber)}`;

message.innerHTML = `Signup successful! <br> Your Registration number is <strong>${regNumber}</strong>. <br> Redirecting to login...`;
message.style.color = "green";

setTimeout(() => {
    window.location.href = loginURL;
}, 3000);

    });
}
