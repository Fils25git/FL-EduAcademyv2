// Initialize Supabase (example, you can use Firebase or other services)
const supabaseUrl = 'https://lrwqsjxvbyxfaxncxisg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to handle user registration
export async function signUpUser(firstName, lastName, email, password, role) {
  try {
    // Insert user into Supabase
    const { data, error } = await supabase
      .from('users')  // Assuming a table named 'users'
      .insert([
        { first_name: firstName, last_name: lastName, email: email, password: password, role: role }
      ]);

    if (error) {
      throw new Error(error.message);
    }

    return data; // Return the inserted user data (optional)
  } catch (error) {
    throw new Error("Error signing up: " + error.message);
  }
}

// Optionally, you can create additional functions for logging in, fetching users, etc.
