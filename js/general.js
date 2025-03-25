
    // Get elements
    const profilePicture = document.getElementById("profile-picture");
    const fileInput = document.getElementById("profile-pic-input");

    // When the profile picture is clicked, open file input
    profilePicture.addEventListener("click", function() {
        fileInput.click();
    });

    // When a new file is selected, upload automatically
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicture.src = e.target.result; // Update profile picture preview
            };
            reader.readAsDataURL(file);

            // Simulate automatic upload (Replace with actual upload function)
            uploadProfilePicture(file);
        }
    });

    // Function to handle file upload
    function uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append("profilePicture", file);

        fetch("https://your-server.com/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Upload successful:", data);
            alert("Profile picture updated successfully!");
        })
        .catch(error => {
            console.error("Upload error:", error);
            alert("Error uploading profile picture.");
        });
    }
