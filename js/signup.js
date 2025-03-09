// Import the signUpUser function from auth.js
import { signUpUser } from './auth.js';

document.getElementById('signup-form').addEventListener('submit', async function(event) {
  event.preventDefault();

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

  if (!role) {
    // Show error message if no role is selected
    errorMessage.textContent = "Please select a role (Teacher or Learner).";
    errorMessage.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword) {
    // Show error message if passwords don't match
    errorMessage.textContent = "Passwords do not match.";
    errorMessage.classList.remove('hidden');
    return;
  }

  // Step 1: Call the signUpUser function from auth.js to add user to the database
  try {
    const userData = await signUpUser(firstName, lastName, email, password, role.value);

    // Step 2: Send welcome email via SendGrid
    await sendWelcomeEmail(firstName, email);

    // Show success message after successful email sent
    successMessage.textContent = "Sign-up successful! A welcome email has been sent.";
    successMessage.classList.remove('hidden');
    
    // Redirect user after successful sign-up
    setTimeout(function() {
      window.location.href = 'login.html';
    }, 2000);  // Delay redirect to let the user read the success message

  } catch (error) {
    // Show error message if anything fails (Supabase or SendGrid)
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
  }
});

// SendGrid email sending function (same as before)
async function sendWelcomeEmail(firstName, email) {
  try {
    const response = await fetch('/.netlify/functions/send-signup-email', {
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
