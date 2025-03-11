document.getElementById("login2-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let regNumber = document.getElementById("reg-number").value;
    let password = document.getElementById("password").value;

    let { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("reg_number", regNumber)
        .eq("password", password)
        .single();

    if (error || !data) {
        document.getElementById("message").innerText = "Invalid Reg Number or Password";
    } else {
        document.getElementById("message").innerText = "Login successful!";
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    }
});
