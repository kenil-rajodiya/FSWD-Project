document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

    // ✅ Check if user is logged in and update UI
    const token = localStorage.getItem("token");
    if (token) {
        console.log("🔹 User is already logged in");
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
});

// ✅ Login User Function
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    console.log("🔹 Sending Login Request:", { email, password });

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("🔍 Server Response:", data);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            alert("Login successful!");
            updateUIForLoggedInUser();
            window.location.href = "../HomePage/index.html";
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        alert("Login failed. Check console for details.");
    }
}

// ✅ Function to Update UI After Login
function updateUIForLoggedInUser() {
    console.log("🔹 Hiding Sign In and Register buttons");

    document.getElementById("signinLink")?.classList.add("hidden");
    document.getElementById("registerLink")?.classList.add("hidden");
    document.getElementById("userProfile")?.classList.remove("hidden");
    document.getElementById("logoutBtn")?.classList.remove("hidden");
}

// ✅ Function to Update UI After Logout
function updateUIForLoggedOutUser() {
    console.log("🔹 Showing Sign In and Register buttons");

    document.getElementById("signinLink")?.classList.remove("hidden");
    document.getElementById("registerLink")?.classList.remove("hidden");
    document.getElementById("userProfile")?.classList.add("hidden");
    document.getElementById("logoutBtn")?.classList.add("hidden");
}

// ✅ Logout Function
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("Logged out successfully!");
    updateUIForLoggedOutUser();
    window.location.href = "../Register_and_Sign_up/signin.html";
}

// ✅ Register User Function
async function registerUser(event) {
    event.preventDefault();

    // ✅ Get input elements safely
    const usernameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // ✅ Check if inputs exist before accessing `.value`
    if (!usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        console.error("❌ One or more input elements are missing.");
        alert("Error: Some fields are missing in the form.");
        return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // ✅ Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            alert("User registered successfully! Please log in.");
            window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In Page
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error registering:", error);
        alert("Registration failed. Check console for details.");
    }
}
// ✅ Handle User Login Status
document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("registerBtn");
    const signinBtn = document.getElementById("signinBtn");
    const userProfile = document.getElementById("userProfile");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");

    if (token) {
        console.log("🔹 User is logged in, updating UI...");
        registerBtn?.classList.add("hidden");
        signinBtn?.classList.add("hidden");
        userProfile?.classList.remove("hidden");
    } else {
        console.log("🔹 No user logged in, showing Sign In/Register");
        userProfile?.classList.add("hidden");
    }

    // ✅ Logout Function
    logoutBtn?.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("Logged out successfully!");
        window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In
    });
});
