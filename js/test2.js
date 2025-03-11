// Make sure the script runs after everything has loaded
window.onload = function () {
  // Supabase URL and Key
  const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
  const SUPABASE_KEY = "your-supabase-key-here";  // Ensure your Supabase Key is correct

  // Initialize the Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Handle form submission
  document.getElementById("signup-form").addEventListener("submit", async function(event) {
      event.preventDefault();

      let name = document.getElementById("name").value;
      let password = document.getElementById("password").value;

      let year = new Date().getFullYear();

      // Count existing users to generate the next Reg Number
      let { count, error: countError } = await supabase
          .from("users")
          .select("id", { count: "exact" });

      if (countError) {
          console.error("Error counting users:", countError);
          return;
      }

      let userNumber = String(count + 1).padStart(3, "0");  // Ensure 3-digit format
      let regNumber = `FL${year}${userNumber}`;

      // Insert user data into the 'users' table
      let { data, error } = await supabase.from("users").insert([
          { reg_number: regNumber, name: name, password: password }
      ]);

      if (error) {
          document.getElementById("message").innerText = "Error: " + error.message;
      } else {
          document.getElementById("message").innerText = `Sign-up successful! Your Reg Number is: ${regNumber}`;
      }
  });
};
