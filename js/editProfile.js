import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Replace with your actual Supabase URL and Public Key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    if (!userId) {
        alert("You must be logged in!");
        window.location.href = "/html/test-login2.html";
        return;
    }

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

        // Populate form fields with user data
        document.getElementById("first-name").value = userData.first_name || "";
        document.getElementById("middle-name").value = userData.middle_name || "";
        document.getElementById("last-name").value = userData.last_name || "";
        document.getElementById("school").value = userData.school || "";
        document.getElementById("class").value = userData.class_selected || "";
        document.getElementById("age").value = userData.age || "";
        document.getElementById("district").value = userData.district || "";
        document.getElementById("parent-phone").value = userData.parent_phone || "";

        // Set profile picture if available
        if (userData.profile_picture) {
            document.getElementById("profile-picture").src = userData.profile_picture;
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
});

// Handle Profile Update
document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    const updatedData = {
        first_name: document.getElementById("first-name").value,
        middle_name: document.getElementById("middle-name").value,
        last_name: document.getElementById("last-name").value,
        school: document.getElementById("school").value,
        class_selected: document.getElementById("class").value,
        age: document.getElementById("age").value,
        district: document.getElementById("district").value,
        parent_phone: document.getElementById("parent-phone").value
    };

    let { error } = await supabase
        .from("learners_list")
        .update(updatedData)
        .eq("user_id", userId);

    if (error) {
        console.error("Update Error:", error);
        document.getElementById("message").style.color = "red";
        document.getElementById("message").innerText = "Failed to update profile!";
    } else {
        document.getElementById("message").innerText = "✅ Profile updated successfully!";
        
        // Redirect to profile.html after 2 seconds
        setTimeout(() => {
            window.location.href = "/html/profile.html";
        }, 2000);
    }
});

// Handle Profile Picture Upload
const profilePicture = document.getElementById("profile-picture");
const fileInput = document.getElementById("profile-pic-input");

profilePicture.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener("change", async function (event) {
    const file = event.target.files[0];

    if (file) {
        const fileName = `profile_pictures/${Date.now()}_${file.name}`;

        // Upload the file to the Supabase Storage bucket
        const { data, error } = await supabase.storage
            .from("profile-pictures") // Ensure this matches your Supabase bucket name
            .upload(fileName, file, { contentType: file.type });

        if (error) {
            console.error("Upload error:", error);
            alert("Error uploading profile picture.");
            return;
        }

        // Get the public URL of the uploaded file
        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/profile-pictures/${fileName}`;

        // Update profile picture in the database
        let { error: updateError } = await supabase
            .from("learners_list")
            .update({ profile_picture: imageUrl })
            .eq("user_id", localStorage.getItem("user_id"));

        if (updateError) {
            console.error("Error updating profile picture:", updateError);
            alert("Error updating profile picture.");
            return;
        }

        // Update profile picture preview
        profilePicture.src = imageUrl;
        alert("Profile picture updated successfully!");
    }
});
