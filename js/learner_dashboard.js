// Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc"; // Use your Supabase key here
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

                    // Import Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase (Use your actual public key)
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "your-public-key"; // Use your Supabase key here
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

// Load Followed Users
async function loadFollowedUsers() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: follows, error } = await supabase
        .from("follows")
        .select("followed_id")
        .eq("follower_id", user.id);

    if (error) throw error;
    return follows.map(follow => follow.followed_id);
}

// Load Posts with Poster Information and Follow Button
async function loadPosts() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const followedUsers = await loadFollowedUsers();
        const followedUserIds = followedUsers.map(follow => follow.followed_id);

        const { data: posts, error } = await supabase
            .from("posts")
            .select(`
                posts.id,
                posts.content,
                posts.created_at,
                learners_list.user_id,
                learners_list.first_name,
                learners_list.middle_name,
                learners_list.last_name,
                learners_list.profile_picture
            `)
            .order("created_at", { ascending: false });

        const postsContainer = document.getElementById("posts-container");

        if (error) throw error;

        // Clear previous content
        postsContainer.innerHTML = "";

        posts.forEach(post => {
            const fullName = [post.middle_name, post.first_name, post.last_name]
                .filter(Boolean)
                .join(" ");
            const relativeTime = timeAgo(post.created_at);

            const postContent = `
                <div class="post">
                    <div class="post-header">
                        <img src="${post.profile_picture || 'default-photo.jpg'}" alt="Profile Picture" class="profile-pic">
                        <span class="poster-name">${fullName}</span>
                        ${followedUserIds.includes(post.user_id) ? "" : `<button class="follow-btn" data-user-id="${post.user_id}" onclick="toggleFollow('${post.user_id}')">Follow</button>`}
                    </div>
                    <div class="post-content">
                        <p>${post.content}</p>
                        <small>Posted ${relativeTime}</small>
                    </div>
                    ${!followedUserIds.includes(post.user_id) ? `<span class="trending-tag">Suggested</span>` : ""}
                </div>
            `;

            // Append to the main feed
            postsContainer.innerHTML += postContent;
        });

        if (!postsContainer.innerHTML) {
            postsContainer.innerHTML = "<p>No posts available.</p>";
        }

    } catch (error) {
        console.error("Error loading posts:", error.message);
        document.getElementById("posts-container").innerHTML = `<p>Error loading posts: ${error.message}</p>`;
    }
}

// Create a Post
async function createPost() {
    const postContent = document.getElementById("postContent").value.trim();
    if (!postContent) {
        alert("Post cannot be empty!");
        return;
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("You must be logged in to post!");
            return;
        }

        const { error } = await supabase.from("posts").insert([
            { content: postContent, user_id: user.id, created_at: new Date() }
        ]);

        if (error) throw error;

        alert("Post created successfully!");
        document.getElementById("postContent").value = "";
        loadPosts();
    } catch (error) {
        console.error("Error creating post:", error.message);
        alert("Failed to post. Try again.");
    }
}

// Toggle Follow (for the follow button)
async function toggleFollow(userId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("You must be logged in to follow!");
            return;
        }

        const { data: followData, error: followError } = await supabase
            .from("follows")
            .select("*")
            .eq("follower_id", user.id)
            .eq("followed_id", userId)
            .single();

        if (followError) throw followError;

        if (followData) {
            const { error } = await supabase
                .from("follows")
                .delete()
                .eq("id", followData.id);
            if (error) throw error;

            alert("Unfollowed successfully.");
        } else {
            const { error } = await supabase
                .from("follows")
                .insert([{ follower_id: user.id, followed_id: userId }]);
            if (error) throw error;

            alert("Followed successfully.");
        }

        loadPosts();
    } catch (error) {
        console.error("Error toggling follow:", error.message);
        alert("Error toggling follow. Try again.");
    }
}

// Event Listeners
document.getElementById("postButton").addEventListener("click", createPost);
document.addEventListener("DOMContentLoaded", () => {
    loadProfilePicture();
    loadPosts();
});
