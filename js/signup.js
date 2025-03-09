// Initialize Supabase (example, you can use Firebase or other services)
const supabaseUrl = 'https://lrwqsjxvbyxfaxncxisg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);


// Function to handle the sign-up process
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

  // Step 1: Add user to Supabase database with role
  try {
    const { user, error: signupError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signupError) {
      // Show error message if there is a problem with the sign-up process
      throw new Error(signupError.message);
    }

    // Step 2: Insert user data into the database
    const { data, error: dbError } = await supabase
      .from('users')  // Assuming a table named 'users'
      .insert([
        { first_name: firstName, last_name: lastName, email: email, role: role.value }
      ]);

    if (dbError) {
      throw new Error(dbError.message);
    }

    // Step 3: Send welcome email via SendGrid
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

// SendGrid email sending function
async function sendWelcomeEmail(firstName, email) {
  try {
    const response = await fetch('/sendgrid-email', {  // Assumes you have an endpoint to send emails
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
// auth.js

document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Clear previous error messages
  const errorMessage = document.getElementById('error-message');
  errorMessage.classList.add('hidden');

  // Validate inputs
  if (!email || !password) {
    errorMessage.textContent = 'Please enter both email and password.';
    errorMessage.classList.remove('hidden');
    return;
  }

  try {
    // Attempt to log in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // If successful, redirect to dashboard or home page
    window.location.href = 'dashboard.html'; // Change this to the appropriate page

  } catch (error) {
    // Show error message if login fails
    errorMessage.textContent = 'Login failed: ' + error.message;
    errorMessage.classList.remove('hidden');
  }
});

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
