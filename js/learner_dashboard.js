// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadProfilePicture() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not logged in");
        return;
    }

    // Fetch user details from Supabase
    let { data, error } = await supabase
        .from("learners_list")
        .select("profile_picture")
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return;
    }

    const profilePicElement = document.getElementById("profile-pic");
    
    if (data && data.profile_picture) {
        profilePicElement.src = data.profile_picture;  // Set user's uploaded image
    } else {
        profilePicElement.src = "images/default-profile.png"; // Default image
    }
}

document.addEventListener("DOMContentLoaded", loadProfilePicture);
