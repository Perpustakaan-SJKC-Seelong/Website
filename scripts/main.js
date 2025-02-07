// Common JavaScript for all pages

// Initialize Bootstrap components
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltips = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Sidebar activation
document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // Remove active class from all links
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
        
        // Add active class to current page link
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize page-specific functions
    if (currentPage === 'news.html') {
        initializeNewsPage();
    } else if (currentPage === 'news-detail.html') {
        initializeNewsDetailPage();
    }
});

// News Page Functionality
function initializeNewsPage() {
    // Sample news data (replace with actual data from API/database)
    const newsData = [
        {
            id: 1,
            title: "Rakan Inklusif 2024/2025",
            excerpt: "每一个特教孩子的进步和成长，离不开你们的耐心和关爱。感谢家长们愿意提供机会...",
            date: "2025-01-17",
            image: "images/school_news/rakan_inklusif_tahun_dua.jpg"
        }
    ];

    const newsContainer = document.querySelector('.news-list');
    
    // Generate news items
    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item card mb-3';
        newsItem.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${news.title}</h3>
                <p class="card-text">${news.excerpt}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <a href="news-detail.html?id=${news.id}" class="btn btn-primary">Read More</a>
                    <span class="news-date">${news.date}</span>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsItem);
    });
}

// News Detail Page Functionality
function initializeNewsDetailPage() {
    // Get news ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    // Sample news data (replace with actual data from API/database)
    const newsDatabase = {
        1: {
            title: "Rakan Inklusif 2024/2025",
            date: "2025-01-17",
            content: `
                <p>每一个特教孩子的进步和成长，离不开你们的耐心和关爱。感谢家长们愿意提供机会给予这些孩子们来帮助特教孩子。融合教育为特教孩子们提供了一个平等、包容和鼓励的学习环境，使他们能够充分发挥自己的潜力，克服挑战，收获自信与成就。</p>
                <img src="images/school_news/rakan_inklusif_tahun_dua.jpg" class="news-image" alt="Rakan Inklusif Tahun Dua">
                <img src="images/school_news/rakan_inklusif_tahun_lima.jpg" class="news-image" alt="Rakan Inklusif Tahun Lima">
                <p>以下是rakan Inklusif 的得奖者：</p>
                <p>Rakan Inklusif Tahun Dua:</p>
                <ul>
                    <li>Queck Chen Ler</li>
                    <li>Tey Yu Tong</li>
                    <li>Yong Jing Yee</li>
                    <li>Chiow Jia Hui</li>
                    <li>Taashvin Naidu</li>
                    <li>Queenie Ong Xin Rui</li>
                    <li>Lim Kai Rui</li>
                    <li>Chong Yon Wei</li>
                    <li>Chai Zhi Rou</li>
                </ul>

                <p>Rakan Inklusif Tahun Lima:</p>
                <ul>
                    <li>Queck Ler Tong</li>
                    <li>Tey Rui Hang</li>
                    <li>Kenzo Low</li>
                    <li>Wong Eugene</li>
                    <li>Wong Euroye</li>
                    <li>Carlise Yong</li>
                </ul>
            `,
        }
    };

    // Load news content
    if (newsDatabase[newsId]) {
        document.getElementById('news-title').textContent = newsDatabase[newsId].title;
        document.getElementById('news-date').textContent = newsDatabase[newsId].date;
        document.getElementById('news-content').innerHTML = newsDatabase[newsId].content;
    } else {
        document.querySelector('article').innerHTML = `
            <div class="alert alert-danger">
                News article not found. <a href="news.html">Return to news list</a>
            </div>
        `;
    }
}

// Additional common functions
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});