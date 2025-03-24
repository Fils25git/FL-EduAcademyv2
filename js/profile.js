// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    console.log("User ID fetched from storage:", userId);

    if (!userId) {
        alert("You must be logged in to view the profile!");
        window.location.href = "/html/test-login2.html";
        return;
    }

    // Fetch user data from Supabase
    try {
        let { data: userData, error } = await supabase
            .from("learners_list")
            .select("*")
            .eq("user_id", userId)
            .single();

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

document.getElementById("upload-btn").addEventListener("click", async () => {
    const fileInput = document.getElementById("profile-pic-input");
    const uploadMessage = document.getElementById("upload-message");

    if (!fileInput.files.length) {
        alert("Please select an image first.");
        return;
    }

    const file = fileInput.files[0];
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
    }

    const filePath = `${userId}/${file.name}`;  // ✅ FIXED FILE PATH

    // Upload image to Supabase Storage
    let { error } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, { upsert: true });

    if (error) {
        console.error("Upload Error:", error);
        alert("Error uploading image. Try again.");
        return;
    }

    // Get public URL of uploaded image
    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    const imageUrl = data.publicUrl;  // ✅ FIXED URL GENERATION

    console.log("Image uploaded:", imageUrl);

    // Update image in Supabase database
    await supabase
        .from("learners_list")
        .update({ profile_picture: imageUrl })
        .eq("user_id", userId);

    // Update UI with new profile picture
    document.getElementById("profile-picture").src = imageUrl;
    uploadMessage.innerText = "✅ Profile picture updated!";
});
