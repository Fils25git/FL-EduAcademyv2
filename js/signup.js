document.getElementById('signup-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Get the form values
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const role = document.querySelector('input[name="role"]:checked');  // Get the selected role

  // Clear previous messages
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  errorMessage.classList.add('hidden');
  successMessage.classList.add('hidden');

  // Validation checks
  if (!role) {
    errorMessage.textContent = "Please select a role (Teacher or Learner).";
    errorMessage.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    errorMessage.classList.remove('hidden');
    return;
  }

  // Show a loading message to the user
  const submitButton = document.getElementById('submit-btn');
  submitButton.disabled = true;
  submitButton.textContent = "Signing up...";

  try {
    // Step 1: Add user to the Supabase database with role
    const { data, error } = await supabase
      .from('users')  // Assuming you have a 'users' table in your Supabase database
      .insert([
        { first_name: firstName, last_name: lastName, email: email, password: password, role: role.value }
      ]);

    if (error) {
      throw new Error(error.message);  // If there's an error inserting data, throw an error
    }

    // Step 2: Send welcome email via SendGrid (using your serverless function)
    await sendWelcomeEmail(firstName, email);

    // Show success message
    successMessage.textContent = "Sign-up successful! A welcome email has been sent.";
    successMessage.classList.remove('hidden');

    // Redirect user after successful sign-up
    setTimeout(function() {
      window.location.href = 'login.html';  // Redirect to the login page after 2 seconds
    }, 2000);

  } catch (error) {
    // Show error message if anything fails (Supabase or SendGrid)
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
  } finally {
    // Reset the submit button after the process
    submitButton.disabled = false;
    submitButton.textContent = "Sign Up";
  }
});

// SendGrid email sending function (serverless function or an API call)
async function sendWelcomeEmail(firstName, email) {
  try {
    const response = await fetch('/sendgrid-email', {  // Replace with your serverless function endpoint
      method: 'POST',
      body: JSON.stringify({
        to: email,
        subject: 'Welcome to FL EduAcademy',
        text: `Hello ${firstName}, welcome to FL EduAcademy! We're glad to have you on board.`
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error("Failed to send email.");
    }
  } catch (emailError) {
    throw new Error("Error sending email: " + emailError.message);
  }
}
