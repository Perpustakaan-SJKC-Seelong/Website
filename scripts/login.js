const firebaseConfig = {
    apiKey: "AIzaSyBUSRk2UpuAYCryCv86auFk4QtVww059UI",
    authDomain: "pusat-sumber-sjkc-seelong.firebaseapp.com",
    databaseURL: "https://pusat-sumber-sjkc-seelong-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pusat-sumber-sjkc-seelong",
    storageBucket: "pusat-sumber-sjkc-seelong.firebasestorage.app",
    messagingSenderId: "688683704120",
    appId: "1:688683704120:web:ff11c857a1909d888febcd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth()

// Initialize Firebase Authentication
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // User is NOT logged in, show login offcanvas
        let offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasLogin'));
        offcanvas.show();
    }
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        document.getElementById("admin-login-btn").style.display = "none"; // Hide login button
        document.getElementById("logout-btn").style.display = "block"; // Show logout button
    } else {
        document.getElementById("admin-login-btn").style.display = "block"; // Show login button
        document.getElementById("logout-btn").style.display = "none"; // Hide logout button
    }
}


// Login function
function login() {
    let email = document.getElementById("member-login-number").value;
    let password = document.getElementById("member-login-password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Successfully logged in
        document.getElementById("login-status").innerText = "Login successful!";
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        checkLoginStatus(); // Update UI
        let offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasLogin'));
        offcanvas.hide(); // Close login offcanvas
    })
    .catch((error) => {
        // document.getElementById("login-status").innerText = "Login failed: " + error.message;
        document.getElementById("login-status").innerText = "Login failed. Please try again or contact Miss Ong.";
     });
}

// Logout function
function logout() {
    firebase.auth().signOut().then(() => {
        alert("Logged out successfully!");
        localStorage.removeItem("isLoggedIn"); // Remove login status
        checkLoginStatus(); // Update UI
        location.reload(); // Refresh the page after logout
    }).catch((error) => {
        console.log("Logout error: " + error.message);
    });

}

// Modify upload function to check authentication
function uploadNews() {
    let user = firebase.auth().currentUser;
    if (!user) {
        alert("You must be logged in to upload news.");
        let offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasExample'));
        offcanvas.show();
        return;
    }

    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let imageInput = document.getElementById("cover_img").value;
    let content = document.getElementById("content").value;

    if (!title || !date || !category || !imageInput || !content) {
        alert("Please fill all fields.");
        return;
    }

    let newNewsRef = db.ref("news").push();
    newNewsRef.set({
        id: newNewsRef.key,
        title: title,
        date: date,
        image: "images/school_news/" + imageInput,
        category: category,
        content: content
    })
    .then(() => {
        document.getElementById("status").innerText = "News uploaded successfully!";
        document.getElementById("title").value = "";
        document.getElementById("date").value = "";
        document.getElementById("category").value = "";
        document.getElementById("cover_img").value = "";
        document.getElementById("content").value = "";
    })
    .catch(error => {
        document.getElementById("status").innerText = "Error uploading news: " + error.message;
    });
}


document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});
