import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBCUmHXH1AOact926P2GNAtDY_sbIvCpY0",
    authDomain: "bananagame-4f75b.firebaseapp.com",
    databaseURL: "https://bananagame-4f75b-default-rtdb.firebaseio.com/",
    projectId: "bananagame-4f75b",
    storageBucket: "bananagame-4f75b.firebasestorage.app",
    messagingSenderId: "641695960260",
    appId: "1:641695960260:web:f1d54dba8d12a65fc44d91",
    measurementId: "G-58HYY7SW1C"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);


const formTitle = document.getElementById("title-form");
const authForm = document.getElementById("auth-form");
const toggleBtn = document.getElementById("btn-toggle");
const submitBtn = document.getElementById("submit-btn");
const usernameField = document.getElementById("username");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const googleLoginBtn = document.getElementById("google-login");

let isSignup = false;


toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSignup = !isSignup;
    formTitle.textContent = isSignup ? "Sign Up" : "Login";
    submitBtn.textContent = isSignup ? "Sign Up" : "Login";
    toggleBtn.textContent = isSignup ? "Already have an account? Login" : "Don't have an account? Sign up";
    usernameField.style.display = isSignup ? "block" : "none";
});


authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try{
        if(isSignup){

            const userCredential = await createUserWithEmailAndPassword( auth, email, password);
            const user = userCredential.user;


            await set(ref(db, 'users/' + user.uid),{
                username: username || "Anonymous",
                email: email,
                password: password
            });

            alert("Sign up Successful! Please log in.");
            console.log("User signed up:", user);

            window.location.href = "login.html";
        }else{

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert("Login Successful!");
            console.log("User logged in:", userCredential.user);

            window.location.href = "startpage.html";
        }  

    }catch (error){
        alert("Error: " + error.message);
        console.error("Authentication Error:", error);
    }
});


googleLoginBtn.addEventListener("click", async () => { 
    try{
        const result = await signInWithPopup(auth, provider);
        const user = result.user;


        await set(ref(db, 'user/' + user.uid),{
            username: user.displayName || "Google User",
            email: user.email
        });

        alert("Google Login Successful!");
        console.log("User logged in with Google:", user);

        window.location.href = "startpage.html";

    }catch (error){
        alert("Google Login Error: " + error.message);
        console.error("Google Login Error:" , error);
    }
});