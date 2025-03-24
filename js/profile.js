// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    console.log("User ID fetched from storage:", userId); // Debugging line

    if (!userId) {
        alert("Please you have to be logged in to view the profile!");
        window.location.href = "/html/test-login2.html";
        return;
    }

    try {
        let { data: userData, error } = await supabase.from("learners_list").select("*").eq("user_id", userId).single();

        if (error || !userData) {
            console.error("Error fetching user data:", error);
            alert("Error loading profile.");
            return;
        }

        // Populate profile fields
        document.getElementById("profile-picture").src = userData.profile_picture || "https://i.imgur.com/TV9o8j1.png";
        document.getElementById("full-name").innerText = `${userData.first_name} ${userData.middle_name || ""} ${userData.last_name}`;
        document.getElementById("reg-number").innerText = userData.reg_number;
        document.getElementById("email").innerText = userData.email;
        document.getElementById("school").innerText = userData.school;
        document.getElementById("class-selected").innerText = userData.class_selected;
        document.getElementById("age").innerText = userData.age;
        document.getElementById("district").innerText = userData.district;

    } catch (err) {
        console.error("Unexpected error:", err);
    }
});
