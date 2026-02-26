/* ============================================
   PORTFOLIO JAVASCRIPT
   Interactive Features & Animations
   ============================================ */

// ============================================
// CONFIG & CONSTANTS
// ============================================

const CONFIG = {
    preloaderDuration: 2000,
    scrollAnimationDelay: 200,
    typewriterSpeed: 50,
    typewriterPause: 1500,
    toastDuration: 3000,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to optimize scroll and resize events
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for repeated events
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Show notification toast
 */
const showToast = (message, duration = CONFIG.toastDuration) => {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
};

/**
 * Check if element is in viewport
 */
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );
};

// ============================================
// PRELOADER
// ============================================

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.getElementById('progressBar');
    }

    simulate() {
        if (!this.preloader || !this.progressBar) return;
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 95) progress = 95;
            this.progressBar.style.width = progress + '%';
            const percent = document.getElementById('preloaderPercent');
            if (percent) {
                percent.textContent = `${Math.floor(progress)}%`;
            }

            if (progress >= 95) {
                clearInterval(interval);
            }
        }, 200);
    }

    hide() {
        if (!this.preloader || !this.progressBar) return;
        this.progressBar.style.width = '100%';
        const percent = document.getElementById('preloaderPercent');
        if (percent) percent.textContent = '100%';
        setTimeout(() => {
            this.preloader.classList.add('hidden');
        }, 300);
    }
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scrollProgress');
    }

    update() {
        if (!this.progressBar) return;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        this.progressBar.style.width = scrolled + '%';
    }
}

// ============================================
// NAVIGATION
// ============================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('navMenu');
        this.burgerMenu = document.getElementById('burgerMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (!this.navbar || !this.navMenu || !this.burgerMenu) return;
        this.setupScrollDetection();
        this.setupBurgerMenu();
        this.setupNavLinks();
    }

    setupScrollDetection() {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 100));
    }

    setupBurgerMenu() {
        this.burgerMenu.addEventListener('click', () => {
            this.burgerMenu.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
    }

    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.burgerMenu.classList.remove('active');
                this.navMenu.classList.remove('active');

                // Update active link
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', throttle(() => {
            this.updateActiveLink();
        }, 100));
    }

    updateActiveLink() {
        let current = '';
        const sections = document.querySelectorAll('[data-section]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('data-section');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// THEME TOGGLE
// ============================================

class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.html = document.documentElement;
        this.init();
    }

    init() {
        if (!this.themeToggle) return;
        // Load saved theme
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.setTheme(savedTheme);

        // Setup click event
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = this.html.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        if (theme === 'light') {
            this.html.classList.add('light-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            this.html.classList.remove('light-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('portfolio-theme', theme);
    }
}

// ============================================
// THEME CUSTOMIZER PANEL
// ============================================

class ThemeCustomizer {
    constructor() {
        this.root = document.documentElement;
        this.storageKey = 'portfolio-accent-preset';
        this.motionStorageKey = 'portfolio-motion-factor';
        this.intensityStorageKey = 'portfolio-hero-intensity';
        this.defaultMotionFactor = 1;
        this.defaultIntensity = 'dramatic';
        this.presets = [
            {
                id: 'default',
                name: 'Default',
                primary: '#00d4ff',
                secondary: '#8b5cf6',
                tertiary: '#ec4899'
            },
            {
                id: 'royal',
                name: 'Royal',
                primary: '#60a5fa',
                secondary: '#8b5cf6',
                tertiary: '#a78bfa'
            },
            {
                id: 'emerald',
                name: 'Emerald',
                primary: '#34d399',
                secondary: '#10b981',
                tertiary: '#22d3ee'
            },
            {
                id: 'sunset',
                name: 'Sunset',
                primary: '#fb7185',
                secondary: '#f97316',
                tertiary: '#f59e0b'
            }
        ];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.applySavedPreset();
        this.applySavedMotion();
        this.applySavedIntensity();
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-customizer';
        wrapper.innerHTML = `
            <button class="theme-customizer-toggle" id="themeCustomizerToggle" aria-label="Open theme customizer">
                <i class="fas fa-sliders-h"></i>
            </button>
            <div class="theme-customizer-panel" id="themeCustomizerPanel" aria-hidden="true">
                <h4>Theme Colors</h4>
                <div class="theme-preset-grid" id="themePresetGrid">
                    ${this.presets.map(preset => `
                        <button type="button" class="theme-preset" data-preset="${preset.id}" title="${preset.name}">
                            <span style="background:${preset.primary}"></span>
                            <span style="background:${preset.secondary}"></span>
                            <span style="background:${preset.tertiary}"></span>
                        </button>
                    `).join('')}
                </div>
                <div class="motion-control">
                    <label for="motionSpeed" class="motion-label">Animation Speed</label>
                    <input id="motionSpeed" class="motion-slider" type="range" min="0.6" max="1.8" step="0.1" value="1">
                    <p class="motion-value" id="motionValue">1.0x</p>
                </div>
                <div class="intensity-control">
                    <label class="motion-label">Background Intensity</label>
                    <div class="intensity-options">
                        <button type="button" class="intensity-btn" data-intensity="subtle">Subtle</button>
                        <button type="button" class="intensity-btn" data-intensity="dramatic">Dramatic</button>
                    </div>
                </div>
                <button type="button" class="theme-reset" id="themePresetReset">Reset</button>
            </div>
        `;
        document.body.appendChild(wrapper);

        this.toggleButton = document.getElementById('themeCustomizerToggle');
        this.panel = document.getElementById('themeCustomizerPanel');
        this.presetButtons = Array.from(document.querySelectorAll('.theme-preset'));
        this.resetButton = document.getElementById('themePresetReset');
        this.motionSlider = document.getElementById('motionSpeed');
        this.motionValue = document.getElementById('motionValue');
        this.intensityButtons = Array.from(document.querySelectorAll('.intensity-btn'));
    }

    bindEvents() {
        if (!this.toggleButton || !this.panel) return;

        this.toggleButton.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.panel.classList.toggle('active', this.isOpen);
            this.panel.setAttribute('aria-hidden', String(!this.isOpen));
        });

        this.presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const presetId = button.dataset.preset;
                this.applyPreset(presetId);
            });
        });

        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                this.applyPreset('default');
                this.applyMotionFactor(this.defaultMotionFactor);
                this.applyIntensity(this.defaultIntensity);
            });
        }

        if (this.motionSlider) {
            this.motionSlider.addEventListener('input', () => {
                const factor = Number(this.motionSlider.value);
                this.applyMotionFactor(factor);
            });
        }

        this.intensityButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.applyIntensity(button.dataset.intensity || this.defaultIntensity);
            });
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (!target.closest('.theme-customizer')) {
                this.isOpen = false;
                this.panel.classList.remove('active');
                this.panel.setAttribute('aria-hidden', 'true');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.isOpen = false;
                this.panel.classList.remove('active');
                this.panel.setAttribute('aria-hidden', 'true');
            }
        });
    }

    applySavedPreset() {
        const savedPreset = localStorage.getItem(this.storageKey);
        if (!savedPreset) return;
        this.applyPreset(savedPreset);
    }

    applySavedMotion() {
        const savedMotion = Number(localStorage.getItem(this.motionStorageKey));
        if (!savedMotion || Number.isNaN(savedMotion)) {
            this.applyMotionFactor(this.defaultMotionFactor);
            return;
        }
        this.applyMotionFactor(savedMotion);
    }

    applySavedIntensity() {
        const savedIntensity = localStorage.getItem(this.intensityStorageKey) || this.defaultIntensity;
        this.applyIntensity(savedIntensity);
    }

    applyPreset(presetId) {
        const preset = this.presets.find(item => item.id === presetId);
        if (!preset) return;

        this.root.style.setProperty('--accent-primary', preset.primary);
        this.root.style.setProperty('--accent-secondary', preset.secondary);
        this.root.style.setProperty('--accent-tertiary', preset.tertiary);
        localStorage.setItem(this.storageKey, preset.id);

        this.presetButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.preset === preset.id);
        });
    }

    applyMotionFactor(factor) {
        const clamped = Math.min(1.8, Math.max(0.6, Number(factor) || this.defaultMotionFactor));
        const fast = Math.round(150 * clamped);
        const base = Math.round(300 * clamped);
        const slow = Math.round(500 * clamped);

        this.root.style.setProperty('--transition-fast', `${fast}ms ease-out`);
        this.root.style.setProperty('--transition-base', `${base}ms ease-out`);
        this.root.style.setProperty('--transition-slow', `${slow}ms ease-out`);

        if (this.motionSlider) this.motionSlider.value = String(clamped);
        if (this.motionValue) this.motionValue.textContent = `${clamped.toFixed(1)}x`;

        localStorage.setItem(this.motionStorageKey, String(clamped));
    }

    applyIntensity(mode) {
        const intensity = mode === 'subtle' ? 'subtle' : 'dramatic';
        this.intensityButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.intensity === intensity);
        });
        localStorage.setItem(this.intensityStorageKey, intensity);
        window.dispatchEvent(new CustomEvent('hero-intensity-change', { detail: { intensity } }));
    }
}

// ============================================
// TYPEWRITER EFFECT
// ============================================

class Typewriter {
    constructor(element, words, speed = CONFIG.typewriterSpeed, pause = CONFIG.typewriterPause) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.pause = pause;
        this.WordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        const word = this.words[this.WordIndex];
        const currentText = word.substring(0, this.charIndex);
        this.element.textContent = currentText;

        if (!this.isDeleting && this.charIndex < word.length) {
            // Typing
            this.charIndex++;
            setTimeout(() => this.start(), this.speed);
        } else if (this.isDeleting && this.charIndex > 0) {
            // Deleting
            this.charIndex--;
            setTimeout(() => this.start(), this.speed / 2);
        } else {
            // Word complete, pause and switch
            this.isDeleting = !this.isDeleting;
            if (!this.isDeleting) {
                this.WordIndex = (this.WordIndex + 1) % this.words.length;
            }
            setTimeout(() => this.start(), this.pause);
        }
    }
}

// ============================================
// SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// ============================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.skill-item, .project-card, .timeline-item, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// ============================================
// STATISTICS COUNTER ANIMATION
// ============================================

class StatCounter {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-number').forEach(el => {
            observer.observe(el);
        });
    }

    animateCounter(element) {
        const finalNumber = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const frameCount = 60;
        const increment = finalNumber / frameCount;
        let currentNumber = 0;

        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(counter);
            }
            element.textContent = Math.floor(currentNumber);
        }, duration / frameCount);
    }
}

// ============================================
// SKILL BARS ANIMATION
// ============================================

class SkillBars {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBars(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skill-progress').forEach(bar => {
            observer.observe(bar);
        });
    }

    animateBars(bar) {
        const percentage = parseInt(bar.getAttribute('data-percentage'));
        const duration = 1.5;
        bar.style.animation = `none`;
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 0);
    }
}

// ============================================
// PROJECT FILTERING
// ============================================

class ProjectFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterProjects(btn.getAttribute('data-filter'));
            });
        });
    }

    filterProjects(category) {
        this.projectCards.forEach(card => {
            card.style.animation = 'none';
            if (category === 'all' || card.getAttribute('data-category').includes(category)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.8s ease-out';
                }, 0);
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================

class TestimonialCarousel {
    constructor() {
        this.container = document.getElementById('testimonialContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.init();
    }

    init() {
        if (!this.container || !this.prevBtn || !this.nextBtn || !this.dotsContainer || this.cards.length === 0) return;
        this.createDots();
        this.setupEventListeners();
        this.showSlide(0);
        this.startAutoplay();
    }

    createDots() {
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    showSlide(index) {
        this.cards.forEach(card => card.classList.remove('active'));
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach(dot => dot.classList.remove('active'));

        this.cards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.showSlide(this.currentIndex);
        this.resetAutoplay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.showSlide(this.currentIndex);
        this.resetAutoplay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.showSlide(index);
        this.resetAutoplay();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }
}

// ============================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateForm() {
        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message'];

        fields.forEach(field => {
            const input = document.getElementById(`form${field.charAt(0).toUpperCase() + field.slice(1)}`);
            const errorMsg = document.querySelector(`[data-field="${field}"]`);

            if (!input.value.trim()) {
                this.showError(input, errorMsg, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            } else if (field === 'email' && !this.isValidEmail(input.value)) {
                this.showError(input, errorMsg, 'Please enter a valid email');
                isValid = false;
            } else {
                this.clearError(input, errorMsg);
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(input, errorMsg, message) {
        input.style.borderColor = '#ff6b6b';
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
    }

    clearError(input, errorMsg) {
        input.style.borderColor = '';
        errorMsg.textContent = '';
        errorMsg.classList.remove('show');
    }

    submitForm() {
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const subject = document.getElementById('formSubject').value;
        const message = document.getElementById('formMessage').value;

        // Simulate form submission
        const submitBtn = this.form.querySelector('.form-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        setTimeout(() => {
            // Here you would normally send the data to a server
            console.log({ name, email, subject, message });

            // Reset form
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Show success message
            showToast('✓ Message sent successfully! I\'ll get back to you soon.');
        }, 1500);
    }
}

// ============================================
// COPY EMAIL BUTTON
// ============================================

class CopyEmail {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.copy-email').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = btn.getAttribute('data-email');
                this.copyToClipboard(email);
            });
        });
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('✓ Email copied to clipboard!');
            });
            return;
        }

        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✓ Email copied to clipboard!');
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;
        // Show/hide button on scroll
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));

        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// TOAST CLOSE BUTTON
// ============================================

class ToastHandler {
    constructor() {
        this.init();
    }

    init() {
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => {
                const toast = document.getElementById('notificationToast');
                toast.classList.remove('show');
            });
        }
    }
}

// ============================================
// NEWSLETTER FORM
// ============================================

class NewsletterForm {
    constructor() {
        this.init();
    }

    init() {
        const forms = document.querySelectorAll('.newsletter-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input[type="email"]');
                if (this.isValidEmail(input.value)) {
                    showToast('✓ Thank you for subscribing!');
                    input.value = '';
                } else {
                    showToast('× Please enter a valid email');
                }
            });
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ============================================
// 3D TILT EFFECT FOR CARDS (Optional)
// ============================================

class CardTilt {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }

    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
}

// ============================================
// PAGE ANIMATION
// ============================================

class PageAnimation {
    constructor() {
        this.animateElements();
    }

    animateElements() {
        document.querySelectorAll('[data-section]').forEach((section, index) => {
            section.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s backwards`;
        });
    }
}

// ============================================
// INTERSECTION OBSERVER FOR LAZY ANIMATIONS
// ============================================

class LazyAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// ============================================
// PROJECTS PAGE MANAGER
// ============================================

const PROJECTS_DATA = [
    {
        id: 1,
        title: 'Campus Navigation System',
        category: ['web', 'fullstack'],
        date: '2024-01-15',
        image: 'assets/navigation.WEBP',
        description: 'A web platform helping students find departments and campus facilities quickly.',
        longDescription: 'Interactive RGUKT campus navigation app with route guidance, location highlights, and responsive UI.',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        liveUrl: '#',
        githubUrl: 'https://github.com/Swathi-hub481'
    },
    {
        id: 2,
        title: 'YBT Digital Commercial Project',
        category: ['design', 'web', 'fullstack'],
        date: '2024-02-20',
        image: 'assets/ybt.jpg',
        description: 'A business-focused commercial website with clean visuals and responsive UX.',
        longDescription: 'Professional digital commercial website focused on service showcasing and conversion-ready page sections.',
        technologies: ['PHP', 'HTML5', 'CSS3', 'JavaScript'],
        liveUrl: '#',
        githubUrl: 'https://github.com/Swathi-hub481'
    },
    {
        id: 3,
        title: 'Fresh Milk Delivery Website',
        category: ['web', 'fullstack'],
        date: '2023-12-10',
        image: 'assets/milk.WEBP',
        description: 'Dairy delivery website with product flow, responsive design, and modern CTA sections.',
        longDescription: 'Business website for fresh milk delivery with smooth product storytelling and device-friendly layout.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
        liveUrl: 'https://nagendrafreshmilk.netlify.app/',
        githubUrl: '#'
    },
    {
        id: 4,
        title: 'Risk Awareness & Phishing Prevention',
        category: ['web', 'design'],
        date: '2023-10-18',
        image: 'https://via.placeholder.com/400x300?text=Cyber+Awareness',
        description: 'Educational web platform focused on phishing and online scam awareness.',
        longDescription: 'Interactive awareness platform with practical examples helping users avoid modern cyber threats.',
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'Cybersecurity'],
        liveUrl: '#',
        githubUrl: 'https://github.com/Swathi-hub481'
    }
];

class ProjectsPageManager {
    constructor() {
        this.grid = document.getElementById('projectsGrid');
        if (!this.grid) return;

        this.search = document.getElementById('projectSearch');
        this.searchClear = document.getElementById('searchClear');
        this.filter = document.getElementById('categoryFilter');
        this.sort = document.getElementById('sortOptions');
        this.pagination = document.getElementById('pagination');
        this.noResults = document.getElementById('noResults');
        this.modal = document.getElementById('projectModal');
        this.modalBody = document.getElementById('modalBody');
        this.autocomplete = document.getElementById('projectAutocomplete');

        this.itemsPerPage = 6;
        this.page = 1;
        this.query = '';
        this.category = '';
        this.sortBy = 'newest';
        this.projects = [...PROJECTS_DATA];
        this.bind();
        this.render();
    }

    bind() {
        if (this.search) {
            this.search.addEventListener('input', () => {
                this.query = this.search.value.trim().toLowerCase();
                this.page = 1;
                if (this.searchClear) this.searchClear.style.display = this.query ? 'inline-flex' : 'none';
                this.renderAutocomplete();
                this.render();
            });
        }

        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => {
                if (this.search) this.search.value = '';
                this.query = '';
                this.searchClear.style.display = 'none';
                if (this.autocomplete) this.autocomplete.innerHTML = '';
                this.render();
            });
        }

        if (this.filter) {
            this.filter.addEventListener('change', () => {
                this.category = this.filter.value;
                this.page = 1;
                this.render();
            });
        }

        if (this.sort) {
            this.sort.addEventListener('change', () => {
                this.sortBy = this.sort.value;
                this.render();
            });
        }

        this.grid.addEventListener('click', (event) => {
            const button = event.target.closest('[data-project-id]');
            if (!button) return;
            const project = PROJECTS_DATA.find(item => item.id === Number(button.dataset.projectId));
            if (project) this.openModal(project);
        });

        if (this.pagination) {
            this.pagination.addEventListener('click', (event) => {
                const target = event.target.closest('[data-page]');
                if (!target) return;
                this.page = Number(target.dataset.page);
                this.render();
            });
        }

        if (this.modal) {
            this.modal.addEventListener('click', (event) => {
                if (event.target.classList.contains('modal') || event.target.classList.contains('modal-close')) {
                    this.modal.classList.remove('active');
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.modal.classList.remove('active');
                }
            });
        }
    }

    filtered() {
        const list = PROJECTS_DATA.filter(project => {
            const categoryMatch = !this.category || project.category.includes(this.category);
            const queryMatch = !this.query || [project.title, project.description, ...project.technologies]
                .join(' ')
                .toLowerCase()
                .includes(this.query);
            return categoryMatch && queryMatch;
        });

        list.sort((a, b) => {
            if (this.sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
            if (this.sortBy === 'name-asc') return a.title.localeCompare(b.title);
            if (this.sortBy === 'name-desc') return b.title.localeCompare(a.title);
            return new Date(b.date) - new Date(a.date);
        });

        return list;
    }

    renderAutocomplete() {
        if (!this.autocomplete || !this.query) {
            if (this.autocomplete) this.autocomplete.innerHTML = '';
            return;
        }

        const matches = PROJECTS_DATA
            .filter(project => project.title.toLowerCase().includes(this.query))
            .slice(0, 5);

        this.autocomplete.innerHTML = matches
            .map(project => `<button type="button" class="autocomplete-item" data-value="${project.title}">${project.title}</button>`)
            .join('');

        this.autocomplete.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                if (this.search) this.search.value = item.dataset.value;
                this.query = item.dataset.value.toLowerCase();
                this.autocomplete.innerHTML = '';
                this.render();
            });
        });
    }

    render() {
        const list = this.filtered();
        const totalPages = Math.max(1, Math.ceil(list.length / this.itemsPerPage));
        this.page = Math.min(this.page, totalPages);
        const start = (this.page - 1) * this.itemsPerPage;
        const current = list.slice(start, start + this.itemsPerPage);

        if (this.noResults) this.noResults.style.display = current.length ? 'none' : 'block';

        this.grid.innerHTML = current.map(project => `
            <article class="project-card" data-category="${project.category.join(' ')}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">Live Demo</a>
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">GitHub</a>
                        <button type="button" class="btn btn-sm btn-secondary" data-project-id="${project.id}">Details</button>
                    </div>
                </div>
            </article>
        `).join('');

        if (!this.pagination) return;
        this.pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return `<button class="pagination-btn ${page === this.page ? 'active' : ''}" data-page="${page}">${page}</button>`;
        }).join('');
    }

    openModal(project) {
        if (!this.modal || !this.modalBody) return;
        this.modalBody.innerHTML = `
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <h2>${project.title}</h2>
            <p>${project.longDescription}</p>
            <div class="project-tech">${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}</div>
        `;
        this.modal.classList.add('active');
    }
}

class ResumePageManager {
    constructor() {
        this.downloadButton = document.getElementById('downloadResume');
        if (!this.downloadButton) return;

        this.downloadButton.addEventListener('click', (event) => {
            event.preventDefault();
            const link = document.createElement('a');
            link.href = 'assets/resumec.jpeg';
            link.download = 'MAMIDI_SWATHI_Resume.jpeg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('✓ Resume download started');
        });
    }
}

class ErrorPageManager {
    constructor() {
        this.digits = document.querySelectorAll('.digit');
        if (!this.digits.length) return;

        this.animateDigits();
        this.setupSearch();
    }

    animateDigits() {
        this.digits.forEach((digit, index) => {
            setTimeout(() => digit.classList.add('bounce'), index * 150);
        });
    }

    setupSearch() {
        const input = document.getElementById('errorSearch');
        const button = document.getElementById('searchBtn404');
        if (!input || !button) return;

        const routes = {
            home: 'index.html',
            about: 'index.html#about',
            skills: 'index.html#skills',
            projects: 'projects.html',
            resume: 'resume.html',
            contact: 'index.html#contact'
        };

        const search = () => {
            const query = input.value.trim().toLowerCase();
            const route = Object.entries(routes).find(([key]) => query.includes(key));
            if (route) {
                window.location.href = route[1];
            } else {
                showToast('No match found. Try: home, projects, resume');
            }
        };

        button.addEventListener('click', search);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') search();
        });
    }
}

// ============================================
// INTERACTIVE HERO SHAPES (CANVAS PHYSICS)
// ============================================

class InteractiveHeroShapes {
    constructor() {
        this.canvas = document.getElementById('heroShapesCanvas');
        this.heroSection = document.getElementById('home');
        if (!this.canvas || !this.heroSection) return;

        this.context = this.canvas.getContext('2d', { alpha: true });
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.pointer = { x: 0, y: 0, active: false };
        this.lastTime = 0;
        this.shapes = [];
        this.mergedPairs = new Set();
        this.maxShapes = window.innerWidth <= 768 ? 20 : 36;
        this.intensityMode = localStorage.getItem('portfolio-hero-intensity') || 'dramatic';
        this.setIntensityProfile(this.intensityMode);

        this.setupCanvas();
        this.createShapes();
        this.bindEvents();
        requestAnimationFrame((time) => this.animate(time));
    }

    setIntensityProfile(mode) {
        const subtle = {
            collisionFactor: 1.45,
            pairCooldown: 900,
            pointerRadius: 110,
            mergeMin: 520,
            mergeMax: 820,
            splitMin: 430,
            splitMax: 650,
            pointerHighlight: 1.2,
            collisionHighlight: 0.75,
            highlightDecay: 0.012,
            mergeEasing: 0.11,
            splitTriggerOffset: 220,
            splitEasing: 0.12,
            mergedScale: 1.24,
            mergingScale: 1.12,
            glowBase: 10,
            glowHighlight: 18,
            glowMergedBonus: 10,
            alphaCap: 0.5,
            alphaHighlight: 0.18
        };

        const dramatic = {
            collisionFactor: 1.75,
            pairCooldown: 1200,
            pointerRadius: 160,
            mergeMin: 700,
            mergeMax: 1100,
            splitMin: 650,
            splitMax: 950,
            pointerHighlight: 1.8,
            collisionHighlight: 1.15,
            highlightDecay: 0.008,
            mergeEasing: 0.145,
            splitTriggerOffset: 300,
            splitEasing: 0.11,
            mergedScale: 1.42,
            mergingScale: 1.22,
            glowBase: 14,
            glowHighlight: 28,
            glowMergedBonus: 16,
            alphaCap: 0.65,
            alphaHighlight: 0.24
        };

        this.intensityMode = mode === 'subtle' ? 'subtle' : 'dramatic';
        this.profile = this.intensityMode === 'subtle' ? subtle : dramatic;
    }

    setupCanvas() {
        const bounds = this.heroSection.getBoundingClientRect();
        this.width = Math.max(320, Math.floor(bounds.width));
        this.height = Math.max(420, Math.floor(bounds.height));

        this.canvas.width = Math.floor(this.width * this.pixelRatio);
        this.canvas.height = Math.floor(this.height * this.pixelRatio);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    }

    createShapes() {
        const types = ['star', 'circle', 'cylinder', 'square'];
        this.shapes = Array.from({ length: this.maxShapes }, (_, index) => {
            const size = this.random(8, 18);
            const shape = {
                id: index,
                type: types[index % types.length],
                x: this.random(20, this.width - 20),
                y: this.random(20, this.height - 20),
                vx: this.random(-0.28, 0.28),
                vy: this.random(-0.24, 0.24),
                size,
                angle: this.random(0, Math.PI * 2),
                rotationSpeed: this.random(-0.015, 0.015),
                phase: this.random(0, Math.PI * 2),
                floatAmplitude: this.random(3, 8),
                opacity: this.random(0.16, 0.3),
                state: 'normal',
                mergeUntil: 0,
                splitUntil: 0,
                mergeWith: null,
                homeX: 0,
                homeY: 0,
                targetX: 0,
                targetY: 0,
                highlight: 0
            };
            shape.homeX = shape.x;
            shape.homeY = shape.y;
            return shape;
        });
    }

    bindEvents() {
        window.addEventListener('resize', debounce(() => {
            this.maxShapes = window.innerWidth <= 768 ? 20 : 36;
            this.setupCanvas();
            this.createShapes();
        }, 200));

        const activatePointer = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = clientX - rect.left;
            this.pointer.y = clientY - rect.top;
            this.pointer.active = true;
            this.triggerPointerMerge();
        };

        this.canvas.addEventListener('mousemove', (event) => {
            activatePointer(event.clientX, event.clientY);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.pointer.active = false;
        });

        this.canvas.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            if (touch) activatePointer(touch.clientX, touch.clientY);
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            if (touch) activatePointer(touch.clientX, touch.clientY);
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            this.pointer.active = false;
        });

        window.addEventListener('hero-intensity-change', (event) => {
            const detail = event.detail || {};
            this.setIntensityProfile(detail.intensity || 'dramatic');
        });
    }

    animate(timestamp) {
        const delta = Math.min(32, timestamp - this.lastTime || 16);
        this.lastTime = timestamp;
        const now = performance.now();

        this.context.clearRect(0, 0, this.width, this.height);
        this.detectCollisionMerges(now);
        this.updateShapes(delta, now);
        this.renderShapes(now);

        requestAnimationFrame((time) => this.animate(time));
    }

    detectCollisionMerges(now) {
        for (let index = 0; index < this.shapes.length; index += 1) {
            const shapeA = this.shapes[index];
            if (shapeA.state !== 'normal') continue;

            for (let inner = index + 1; inner < this.shapes.length; inner += 1) {
                const shapeB = this.shapes[inner];
                if (shapeB.state !== 'normal') continue;

                const pairKey = `${shapeA.id}-${shapeB.id}`;
                if (this.mergedPairs.has(pairKey)) continue;

                const dx = shapeA.x - shapeB.x;
                const dy = shapeA.y - shapeB.y;
                const distance = Math.hypot(dx, dy);
                const threshold = (shapeA.size + shapeB.size) * this.profile.collisionFactor;

                if (distance <= threshold) {
                    this.startMerge(shapeA, shapeB, now, false);
                    this.mergedPairs.add(pairKey);
                    setTimeout(() => this.mergedPairs.delete(pairKey), this.profile.pairCooldown);
                    return;
                }
            }
        }
    }

    triggerPointerMerge() {
        if (!this.pointer.active) return;

        const nearby = this.shapes
            .filter(shape => shape.state === 'normal')
            .map(shape => ({
                shape,
                distance: Math.hypot(shape.x - this.pointer.x, shape.y - this.pointer.y)
            }))
            .filter(item => item.distance < this.profile.pointerRadius)
            .sort((a, b) => a.distance - b.distance);

        if (nearby.length >= 2) {
            this.startMerge(nearby[0].shape, nearby[1].shape, performance.now(), true);
        }
    }

    startMerge(shapeA, shapeB, now, fromPointer) {
        if (shapeA.state !== 'normal' || shapeB.state !== 'normal') return;

        const centerX = (shapeA.x + shapeB.x) / 2;
        const centerY = (shapeA.y + shapeB.y) / 2;

        [shapeA, shapeB].forEach(shape => {
            shape.state = 'merging';
            shape.mergeWith = shape === shapeA ? shapeB.id : shapeA.id;
            shape.homeX = shape.x;
            shape.homeY = shape.y;
            shape.targetX = centerX;
            shape.targetY = centerY;
            shape.mergeUntil = now + this.random(this.profile.mergeMin, this.profile.mergeMax);
            shape.splitUntil = shape.mergeUntil + this.random(this.profile.splitMin, this.profile.splitMax);
            shape.highlight = fromPointer ? this.profile.pointerHighlight : this.profile.collisionHighlight;
        });
    }

    updateShapes(delta, now) {
        const speedScale = delta / 16;

        this.shapes.forEach(shape => {
            shape.angle += shape.rotationSpeed * speedScale;
            shape.phase += 0.012 * speedScale;
            shape.highlight = Math.max(0, shape.highlight - this.profile.highlightDecay * speedScale);

            if (shape.state === 'normal') {
                shape.x += shape.vx * speedScale;
                shape.y += shape.vy * speedScale;

                if (shape.x < 10 || shape.x > this.width - 10) shape.vx *= -1;
                if (shape.y < 10 || shape.y > this.height - 10) shape.vy *= -1;

                shape.x = this.clamp(shape.x, 10, this.width - 10);
                shape.y = this.clamp(shape.y, 10, this.height - 10);
                return;
            }

            if (shape.state === 'merging') {
                const easing = this.profile.mergeEasing * speedScale;
                shape.x += (shape.targetX - shape.x) * easing;
                shape.y += (shape.targetY - shape.y) * easing;

                if (now >= shape.mergeUntil) {
                    shape.state = 'merged';
                }
                return;
            }

            if (shape.state === 'merged') {
                if (now >= shape.splitUntil - this.profile.splitTriggerOffset) {
                    shape.state = 'splitting';
                }
                return;
            }

            if (shape.state === 'splitting') {
                const easing = this.profile.splitEasing * speedScale;
                shape.x += (shape.homeX - shape.x) * easing;
                shape.y += (shape.homeY - shape.y) * easing;

                if (Math.hypot(shape.x - shape.homeX, shape.y - shape.homeY) < 1.2) {
                    shape.state = 'normal';
                    shape.mergeWith = null;
                }
            }
        });
    }

    renderShapes(now) {
        const colors = this.getThemePalette();

        this.shapes.forEach(shape => {
            const hoverPulse = 1 + Math.sin(now * 0.02 + shape.phase) * 0.04;
            const mergeScale = shape.state === 'merged' ? this.profile.mergedScale : shape.state === 'merging' ? this.profile.mergingScale : 1;
            const floatOffset = Math.sin(shape.phase) * shape.floatAmplitude;
            const renderSize = shape.size * hoverPulse * mergeScale;
            const x = shape.x;
            const y = shape.y + floatOffset * 0.25;

            this.context.save();
            this.context.translate(x, y);
            this.context.rotate(shape.angle);

            const color = colors[shape.id % colors.length];
            const glow = this.profile.glowBase + shape.highlight * this.profile.glowHighlight + (shape.state !== 'normal' ? this.profile.glowMergedBonus : 0);
            this.context.globalAlpha = Math.min(this.profile.alphaCap, shape.opacity + shape.highlight * this.profile.alphaHighlight);
            this.context.strokeStyle = color;
            this.context.lineWidth = Math.max(1.2, renderSize * 0.13);
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.shadowColor = color;
            this.context.shadowBlur = glow;

            this.drawShape(shape.type, renderSize);
            this.context.restore();
        });
    }

    drawShape(type, size) {
        switch (type) {
            case 'circle':
                this.context.beginPath();
                this.context.arc(0, 0, size * 0.55, 0, Math.PI * 2);
                this.context.stroke();
                break;
            case 'cylinder':
                this.context.beginPath();
                this.context.roundRect(-size * 1.2, -size * 0.35, size * 2.4, size * 0.7, size * 0.3);
                this.context.stroke();
                break;
            case 'square':
                this.context.beginPath();
                this.context.roundRect(-size * 0.6, -size * 0.6, size * 1.2, size * 1.2, size * 0.2);
                this.context.stroke();
                break;
            case 'star':
            default:
                this.context.beginPath();
                for (let point = 0; point < 10; point += 1) {
                    const angle = (Math.PI / 5) * point;
                    const radius = point % 2 === 0 ? size * 0.72 : size * 0.3;
                    const px = Math.cos(angle - Math.PI / 2) * radius;
                    const py = Math.sin(angle - Math.PI / 2) * radius;
                    if (point === 0) {
                        this.context.moveTo(px, py);
                    } else {
                        this.context.lineTo(px, py);
                    }
                }
                this.context.closePath();
                this.context.stroke();
                break;
        }
    }

    getThemePalette() {
        const rootStyles = getComputedStyle(document.documentElement);
        const accentPrimary = rootStyles.getPropertyValue('--accent-primary').trim() || '#00d4ff';
        const accentSecondary = rootStyles.getPropertyValue('--accent-secondary').trim() || '#8b5cf6';
        const accentTertiary = rootStyles.getPropertyValue('--accent-tertiary').trim() || '#ec4899';
        const lightTheme = document.documentElement.classList.contains('light-theme');

        if (lightTheme) {
            return [
                this.withAlpha(accentPrimary, 0.38),
                this.withAlpha(accentSecondary, 0.34),
                this.withAlpha(accentTertiary, 0.32),
                'rgba(148, 163, 184, 0.3)'
            ];
        }

        return [
            this.withAlpha(accentPrimary, 0.55),
            this.withAlpha(accentSecondary, 0.5),
            this.withAlpha(accentTertiary, 0.46),
            'rgba(56, 189, 248, 0.38)'
        ];
    }

    withAlpha(color, alpha) {
        const hex = color.replace('#', '');
        if (![3, 6].includes(hex.length)) {
            return color;
        }

        const normalized = hex.length === 3
            ? hex.split('').map(char => char + char).join('')
            : hex;

        const red = Number.parseInt(normalized.slice(0, 2), 16);
        const green = Number.parseInt(normalized.slice(2, 4), 16);
        const blue = Number.parseInt(normalized.slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================

class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        // Initialize preloader
        const preloader = new Preloader();
        preloader.simulate();

        // Wait for page load complete
        window.addEventListener('load', () => {
            preloader.hide();
        });

        // Auto-hide preloader after timeout
        setTimeout(() => {
            preloader.hide();
        }, CONFIG.preloaderDuration);

        // Initialize all components
        new ScrollProgress();
        new Navigation();
        new ThemeToggle();
        new ThemeCustomizer();
        new ScrollAnimations();
        new StatCounter();
        new SkillBars();
        new InteractiveHeroShapes();
        new ProjectFilter();
        new TestimonialCarousel();
        new ContactForm();
        new CopyEmail();
        new BackToTop();
        new SmoothScroll();
        new ToastHandler();
        new NewsletterForm();
        new CardTilt();
        new LazyAnimations();
        new ProjectsPageManager();
        new ResumePageManager();
        new ErrorPageManager();

        // Update scroll progress on scroll
        const scrollProgress = new ScrollProgress();
        window.addEventListener('scroll', throttle(() => {
            scrollProgress.update();
        }, 10));
        scrollProgress.update();

        // Initialize typewriter effect
        const typewriterElement = document.getElementById('typewriter');
        if (typewriterElement) {
            new Typewriter(typewriterElement, [
                'Full-Stack Developer',
                'UI/UX Enthusiast',
                'Problem Solver',
                'Code Craftsman'
            ]);
        }

        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                const rect = button.getBoundingClientRect();
                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Log initialization complete
        console.log('✓ Portfolio initialized successfully');
    }
}

// ============================================
// START WHEN DOM IS READY
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Portfolio();
    });
} else {
    new Portfolio();
}

// ============================================
// HANDLE UNLOAD (Cleanup)
// ============================================

window.addEventListener('beforeunload', () => {
    // Clear any intervals or timers if needed
});
