// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_KEY = "your-supabase-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("test-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get user input
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    // Get the current year
    let year = new Date().getFullYear();

    // Count existing users to generate next Reg Number
    let { count, error: countError } = await supabase
        .from("users")
        .select("id", { count: "exact" });

    if (countError) {
        console.error("Error counting users:", countError);
        return;
    }

    // Generate Reg Number (ensure 3-digit format)
    let userNumber = String(count + 1).padStart(3, "0");
    let regNumber = `FL${year}${userNumber}`;

    // Insert user into the database
    let { data, error } = await supabase.from("users").insert([
        { reg_number: regNumber, name: name, password: password }
    ]);

    if (error) {
        document.getElementById("message").innerText = "Error: " + error.message;
    } else {
        document.getElementById("message").innerText = `Sign-up successful! Your Reg Number is: ${regNumber}`;
    }
});
