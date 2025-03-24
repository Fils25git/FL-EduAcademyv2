document.addEventListener("DOMContentLoaded", async function () {
    const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let profileForm = document.getElementById("profile-form");
    let profilePicInput = document.getElementById("profile-pic");
    let uploadMessage = document.getElementById("upload-message");
    let profileImage = document.getElementById("profile-image");

    // Get the logged-in user's ID
    let userId = localStorage.getItem("user_id");

    if (!userId) {
        console.error("❌ User not logged in!");
        uploadMessage.innerText = "Error: Please log in first!";
        return;
    }

    // Fetch and display the current profile picture
    async function fetchProfilePic() {
        let { data, error } = await supabase
            .from("learners_list")
            .select("profile_pic")
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("❌ Error fetching profile pic:", error);
            return;
        }

        if (data.profile_pic) {
            profileImage.src = data.profile_pic;  // Display the stored image
        }
    }

    fetchProfilePic(); // Call function to display existing profile picture

    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let file = profilePicInput.files[0];
        if (!file) {
            uploadMessage.innerText = "Please select an image!";
            uploadMessage.style.color = "red";
            return;
        }

        let filePath = `profiles/${userId}/${file.name}`; // Store images in a "profiles" folder

        console.log("Uploading:", filePath);

        // Upload to Supabase Storage
        let { data, error } = await supabase.storage
            .from("avatars")  // Bucket name in Supabase Storage
            .upload(filePath, file, { upsert: true });

        if (error) {
            console.error("❌ Upload error:", error);
            uploadMessage.innerText = "Upload failed!";
            uploadMessage.style.color = "red";
            return;
        }

        // Get the public URL of the uploaded image
        let { data: publicURL } = supabase.storage.from("avatars").getPublicUrl(filePath);

        console.log("✅ File uploaded! URL:", publicURL.publicUrl);

        // Save the URL in the database
        let { error: updateError } = await supabase
            .from("learners_list")
            .update({ profile_pic: publicURL.publicUrl })
            .eq("user_id", userId);

        if (updateError) {
            console.error("❌ Error saving profile picture URL:", updateError);
            uploadMessage.innerText = "Failed to save profile picture!";
            uploadMessage.style.color = "red";
            return;
        }

        // Display the new profile picture
        profileImage.src = publicURL.publicUrl;
        uploadMessage.innerText = "Profile picture updated!";
        uploadMessage.style.color = "green";
    });
});
