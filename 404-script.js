/* ============================================
   404 PAGE JAVASCRIPT
   Animations & Interactive Elements
   ============================================ */

class Error404Page {
    constructor() {
        this.init();
    }

    init() {
        this.animate404Numbers();
        this.setupSearchFunctionality();
        this.setupNavCardAnimations();
    }

    // Animate the 404 error numbers
    animate404Numbers() {
        const digits = document.querySelectorAll('.digit');
        let delay = 0;

        digits.forEach(digit => {
            setTimeout(() => {
                digit.classList.add('bounce');
            }, delay);
            delay += 200;
        });

        // Repeat animation every 3 seconds
        setInterval(() => {
            digits.forEach((digit, index) => {
                setTimeout(() => {
                    digit.classList.remove('bounce');
                    setTimeout(() => {
                        digit.classList.add('bounce');
                    }, 10);
                }, index * 200);
            });
        }, 4000);
    }

    // Setup search functionality
    setupSearchFunctionality() {
        const searchInput = document.getElementById('errorSearch');
        const searchBtn = document.getElementById('searchBtn404');

        if (!searchInput || !searchBtn) return;

        const pageKeywords = {
            'home': 'index.html',
            'about': 'index.html#about',
            'skills': 'index.html#skills',
            'projects': 'projects.html',
            'project': 'projects.html',
            'portfolio': 'projects.html',
            'work': 'projects.html',
            'resume': 'resume.html',
            'cv': 'resume.html',
            'experience': 'resume.html',
            'education': 'resume.html',
            'contact': 'index.html#contact',
            'reach': 'index.html#contact',
            'email': 'index.html#contact',
            'connect': 'index.html#contact'
        };

        const handleSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            
            if (!query) {
                showToast('Please enter a search term');
                return;
            }

            // Find matching page
            let matchedPage = null;
            for (const [keyword, page] of Object.entries(pageKeywords)) {
                if (query.includes(keyword) || keyword.includes(query)) {
                    matchedPage = page;
                    break;
                }
            }

            if (matchedPage) {
                showToast(`✓ Found! Redirecting to ${matchedPage}...`);
                setTimeout(() => {
                    window.location.href = matchedPage;
                }, 800);
            } else {
                showToast(`× No match found for "${query}". Try: home, about, projects, resume, contact`);
            }

            searchInput.value = '';
        };

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Animate navigation cards on hover
    setupNavCardAnimations() {
        const navCards = document.querySelectorAll('.nav-card');
        
        navCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'cardBounce 0.6s ease-out';
                }, 10);
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Error404Page();
    });
} else {
    new Error404Page();
}
