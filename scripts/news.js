// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBUSRk2UpuAYCryCv86auFk4QtVww059UI",
    authDomain: "pusat-sumber-sjkc-seelong.firebaseapp.com",
    databaseURL: "https://pusat-sumber-sjkc-seelong-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pusat-sumber-sjkc-seelong",
    storageBucket: "pusat-sumber-sjkc-seelong.firebasestorage.app",
    messagingSenderId: "688683704120",
    appId: "1:688683704120:web:ff11c857a1909d888febcd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Initialize Bootstrap components
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltips = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'news.html') {
        initializeNewsPage();
    } else if (currentPage === 'news-detail.html') {
        initializeNewsDetailPage();
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
                                    <a href="news-detail.html?id=${news.id}"><i class="fa fa-angle-right"></i></a>
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


// 🔹 Fetch a single news item based on ID
async function initializeNewsDetailPage() {
    const newsContainer = document.querySelector('.news-detail');
    newsContainer.innerHTML = '';

    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    //console.log("News ID:", newsId);

    db.ref("news/" + newsId).once("value", snapshot => {
        const news = snapshot.val();

        const newsItem = document.createElement('div');
        newsItem.className = 'news-details-content';
        newsItem.innerHTML = `
                <h1>${news.title}</h1>
                <p class="news-meta">Published on <span>${news.date}</span></p>
                <div>
                    <p>${news.content}</p>
                </div> 
                `;
        newsContainer.appendChild(newsItem);
    });
}
