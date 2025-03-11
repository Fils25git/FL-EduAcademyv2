// Ensure that the script runs after everything has loaded
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://lrwqsjxvbyxfaxncxisg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3Fzanh2Ynl4ZmF4bmN4aXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODI3NzQsImV4cCI6MjA1NzA1ODc3NH0.gpFO3mW2hKRYleTRn3UEU0IgdNsIDgLdttQBnflu2qc";

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
