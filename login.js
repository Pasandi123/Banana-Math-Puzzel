const formTitle = document.getElementById("title-form");
const authForm = document.getElementById("auth-form");
const toggleBtn = document.getElementById("btn-toggle");
const submitBtn = document.getElementById("submit-btn");
const usernameField = document.getElementById("username");

let isSignup = false;

toggleBtn.addEventListener("click", () => {
    isSignup = !isSignup;
    formTitle.textContent = isSignup ? "Sign Up" : "Login";
    submitBtn.textContent = isSignup ? "Sign Up" : "Login";
    toggleBtn.textContent = isSignup ? "Already have an account? Login" : "Don't have an account? Sign up";
    usernameField.style.display = isSignup ? "block" : "none";
});

authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(isSignup ? "Sign up Successful" : "Login Successful");
});