// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Load Profile Picture
async function loadProfilePicture() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.warn("User not logged in.");
            return;
        }

        const { data, error } = await supabase
            .from("learners_list")
            .select("profile_picture")
            .eq("user_id", user.id)
            .single();

        if (error) throw error;

        document.getElementById("profile-pic").src = data?.profile_picture || "default-photo.jpg";
    } catch (error) {
        console.error("Error loading profile picture:", error.message);
    }
}

// Load Posts
async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        const postsContainer = document.getElementById("posts-container");

        if (error) throw error;

        postsContainer.innerHTML = posts.length
            ? posts.map(post => `
                <div class="post">
                    <div class="post-content">
                        <p>${post.content}</p>
                        <small>Posted on ${new Date(post.created_at).toLocaleString()}</small>
                    </div>
                </div>
            `).join("")
            : "<p>No posts yet. Be the first to post!</p>";

    } catch (error) {
        console.error("Error loading posts:", error.message);
        document.getElementById("posts-container").innerHTML = `<p>Error loading posts: ${error.message}</p>`;
    }
}

// Create a Post (Without class_id from learners_list)
async function createPost() {
    const postContent = document.getElementById("postContent").value.trim();
    if (!postContent) {
        alert("Post cannot be empty!");
        return;
    }

    try {
        // Get the logged-in user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            alert("You must be logged in to post!");
            return;
        }

        // Insert post without fetching class_id from learners_list
        const { error } = await supabase.from("posts").insert([
            {
                user_id: user.id,
                content: postContent,
                created_at: new Date(),
                updated_at: new Date(),
            }
        ]);

        if (error) throw error;

        alert("Post created successfully!");
        document.getElementById("postContent").value = "";
        loadPosts();
    } catch (error) {
        console.error("Error creating post:", error.message);
        alert(`Failed to post. Error: ${error.message}`);
    }
}

// Event Listeners
document.getElementById("postButton").addEventListener("click", createPost);
document.addEventListener("DOMContentLoaded", () => {
    loadProfilePicture();
    loadPosts();
});
