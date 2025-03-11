// Import createClient from Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase URL and Key
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";  // Ensure your Supabase Key is correct

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle form submission
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();

  // Get new form field values
let firstName = document.getElementById("first-name").value;
let middleName = document.getElementById("middle-name").value;  // Optional
let lastName = document.getElementById("last-name").value;
let school = document.getElementById("school").value;  // User will write the school name
let classSelected = document.getElementById("class").value;  // User will write the class name
let age = document.getElementById("age").value;  // User will write the age
let district = document.getElementById("district").value;  // User will write the district (city)
let parentPhone = document.getElementById("parent-phone").value;  // Parent's phone number

    let password = document.getElementById("password").value;
    // Password validation: Ensure the password is at least 6 characters long
if (password.length < 6) {
    document.getElementById("message").innerText = "Password must be at least 6 characters long.";
    document.getElementById("message").style.color = "red"; // Optional: Change message color to red for errors
    return; // Stop further processing if password is too short
    // Get password and confirm password values
let password = document.getElementById("password").value;
let confirmPassword = document.getElementById("confirm-password").value;

// Check if the passwords match
if (password !== confirmPassword) {
    alert("Passwords do not match! Please ensure both passwords are the same.");
    return false; // Prevent the form from being submitted
}

}

    let year = new Date().getFullYear();

    // Count existing users to generate the next Reg Number
    let { count, error: countError } = await supabase
        .from("users")
        .select("id", { count: "exact" });

    if (countError) {
        console.error("Error counting users:", countError);
        return;
    }

    let userNumber = String(count + 1).padStart(3, "0");  // Ensure 3-digit format
    let regNumber = `FL${year}${userNumber}`;

    // Insert user data into the 'users' table
    let { data, error } = await supabase.from("users").insert([
        { reg_number: regNumber, name: name, password: password }
    ]);

    if (error) {
        document.getElementById("message").innerText = "Error: " + error.message;
    } else {
        document.getElementById("message").innerText = `Sign-up successful! Your Reg Number is: ${regNumber}`;
    }
});

