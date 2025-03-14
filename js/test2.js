// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Make sure to use the public "anon" key only)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

    if (!firstName || !lastName || !school || !classSelected || !age || !district || !parentPhone || !password) {
        message.innerText = "Please fill in all required fields.";
        message.style.color = "red";
        return;
    }

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
    let { count, error: countError } = await supabase.from("learners_list").select("*", { count: "exact" });

    if (countError) {
        console.error("Error counting users:", countError);
        message.innerText = "Error generating registration number.";
        message.style.color = "red";
        return;
    }

    let userNumber = String(count + 1).padStart(3, "0");
    let regNumber = `FL${year}${userNumber}`;

    // ✅ Sign up user in Supabase Auth
    let email = `${regNumber}@fleduacademy.com`; // Ensure email is set
    let { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Signup Error:", authError);
        message.innerText = "Signup failed: " + authError.message;
        message.style.color = "red";
        return;
    }

    console.log("✅ User signed up in authentication:", authData);

    // ✅ Insert user data into learners_list table
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
            email: email // Don't store password
        }
    ]);

    if (dbError) {
        console.error("Database Insert Error:", dbError);
        message.innerText = "Error saving user data: " + dbError.message;
        message.style.color = "red";
        return;
    }

    console.log("✅ User data saved to learners_list table");
    message.innerText = "Signup successful! Redirecting...";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 3000);
   });
});
