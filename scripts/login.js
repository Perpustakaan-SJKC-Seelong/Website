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


document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'edit_news.html') {
        initializeNewsPage();
    }
});

async function initializeNewsPage() {
    const newsContainer = document.querySelector('.news-list');
    newsContainer.innerHTML = '';

    db.ref("news").once("value", snapshot => {
        const newsData = snapshot.val();
        if (newsData) {
            // Convert object to array and sort by date (descending order)
            const sortedNews = Object.keys(newsData)
                .map(newsId => ({
                    id: newsId, 
                    ...newsData[newsId]
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (latest first)

            // Append sorted news to the container
            sortedNews.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item mb-3';
                newsItem.innerHTML = `
                    <div class="col-lg-12 col-md-6">
                        <div class="item">
                            <div class="row">
                                <div class="col-lg-3">
                                    <div class="image">
                                        <img src="${news.image}" alt="">
                                    </div>
                                </div>
                                <div class="col-lg-9">
                                    <ul>
                                        <li><span class="category">${news.category}</span>
                                            <h4>${news.title}</h4></li>
                                        <li><span>Date:</span>
                                            <h6>${news.date}</h6></li>
                                    </ul>
                                    <a href="add_news.html?id=${news.id}" onclick="return checkAccessEditNewsDetail(event);">
                                        <i class="fa fa-angle-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                newsContainer.appendChild(newsItem);
            });
        }
    });
}

function checkAccessEditNewsDetail(event) {
    event.preventDefault(); // Stop the link from navigating immediately

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            alert("You must be logged in to edit news.");
            let offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasExample'));
            offcanvas.show();
        } else {
            // If user is authenticated, manually navigate to the page
            window.location.href = event.target.closest('a').href;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get("id");

    if (newsId) {
        document.getElementById("form-title").textContent = "Edit News";
        document.getElementById("save-button").textContent = "Save Changes";
        document.getElementById("delete-button").style.display = "block";
        document.getElementById("news_id").value = newsId;

        // Check authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                alert("You must be logged in to access this page.");
                window.location.href = "edit_news.html"; // Redirect to the login page or news list
                return;
            }
            // Load news data after confirming user is authenticated
            loadNewsData(newsId);
        });
    }
});

function loadNewsData(newsId) {
    const db = firebase.database();
    db.ref("news/" + newsId).once("value", (snapshot) => {
        const news = snapshot.val();

        if (news) {
            document.getElementById("title").value = news.title;
            document.getElementById("date").value = news.date;
            document.getElementById("category").value = news.category;
            document.getElementById("cover_img").value = news.image;
            document.getElementById("content").value = news.content;
        } else {
            alert("News not found!");
            window.location.href = "edit_news.html";
        }
    }).catch((error) => {
        console.error("Error loading news:", error);
    });
}


function saveNews() {
    const newsId = document.getElementById("news_id").value;
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("cover_img").value;
    const content = document.getElementById("content").value;

    const newsData = { title, date, category, image, content };

    const db = firebase.database();

    if (newsId) {
        // Update existing news
        db.ref("news/" + newsId).update(newsData)
        .then(() => {
            document.getElementById("status").textContent = "News updated successfully!";
        })
        .catch((error) => {
            console.error("Error updating news:", error);
        });
    } else {
        // Add new news
        const newNewsRef = db.ref("news").push();
        newNewsRef.set(newsData)
        .then(() => {
            document.getElementById("status").textContent = "News uploaded successfully!";

            document.getElementById("news_id").value = "";
            document.getElementById("title").value = "";
            document.getElementById("date").value = "";
            document.getElementById("category").value = "";
            document.getElementById("cover_img").value = "";
            document.getElementById("content").value = "";
        })
        .catch((error) => {
            console.error("Error adding news:", error);
        });
    }
}


function deleteNews() {
    const newsId = document.getElementById("news_id").value;

    if (confirm("Are you sure you want to delete this news? This action cannot be undone!")) {
        const db = firebase.database();
        db.ref("news/" + newsId).remove()
        .then(() => {
            alert("News deleted successfully!");
            window.location.href = "edit_news.html"; // Redirect after deletion
        })
        .catch((error) => {
            console.error("Error deleting news:", error);
        });
    }
}


function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Select all login and logout buttons
    const loginButtons = document.querySelectorAll(".admin-login-btn");
    const logoutButtons = document.querySelectorAll(".logout-btn");

    if (isLoggedIn === "true") {
        loginButtons.forEach(btn => btn.style.display = "none"); // Hide all login buttons
        logoutButtons.forEach(btn => btn.style.display = "block"); // Show all logout buttons
    } else {
        loginButtons.forEach(btn => btn.style.display = "block"); // Show all login buttons
        logoutButtons.forEach(btn => btn.style.display = "none"); // Hide all logout buttons
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
