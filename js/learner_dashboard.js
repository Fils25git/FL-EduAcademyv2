// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Load Profile Picture Function (Already existing)
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
        profilePicElement.src = "default-photo.jpg"; // Default image
    }
}

// Function to Load Posts (Same as the previous solution)
async function loadPosts() {
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    const postsContainer = document.getElementById("posts-container");

    // If there's an error fetching posts
    if (error) {
        postsContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
        return;
    }

    // If no posts exist
    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet. Be the first to post!</p>";
        return;
    }

    // Clear loading text
    postsContainer.innerHTML = "";

    // Loop through the posts and display them
    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <div class="post-content">
                <p>${post.content}</p>
                <small>Posted on ${new Date(post.created_at).toLocaleString()}</small>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Function to Create a Post
async function createPost() {
    const postContent = document.getElementById("postContent").value.trim();
    if (!postContent) {
        alert("Post cannot be empty!");
        return;
    }

    const { data: { user } } = await supabase.auth.getUser(); // Get the logged-in user
    if (!user) {
        alert("You must be logged in to post!");
        return;
    }

    const { data, error } = await supabase.from("posts").insert([
        {
            content: postContent,
            user_id: user.id,
            created_at: new Date(),
        },
    ]);

    if (error) {
        console.error("Error creating post:", error.message);
        alert("Failed to post. Try again.");
    } else {
        alert("Post created successfully!");
        document.getElementById("postContent").value = ""; // Clear the textarea
        loadPosts(); // Refresh posts
    }
}

// Event listener for the "Post" Button
document.getElementById("postButton").addEventListener("click", createPost);

// Load posts when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadProfilePicture();
    loadPosts(); // Call the loadPosts function to display existing posts
});
