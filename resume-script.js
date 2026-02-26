/* ============================================
   RESUME PAGE JAVASCRIPT
   PDF Download & Resume Interactions
   ============================================ */

class ResumeManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupDownloadButton();
        this.setupPrintFunctionality();
        this.animateSkillBars();
    }

    setupDownloadButton() {
        const downloadBtn = document.getElementById('downloadResume');
        if (!downloadBtn) return;

        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadResume();
        });
    }

    downloadResume() {
        // Create a hidden link element
        const link = document.createElement('a');
        
        // Set the href to a sample PDF URL (in production, this would be your actual PDF)
        link.href = 'data:application/pdf;base64,JVBERi0xLjANCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iag==';
        
        // Set the download filename
        link.download = 'Your-Name-Resume.pdf';
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showToast('✓ Resume downloaded successfully!');
    }

    setupPrintFunctionality() {
        // Handle print to PDF
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
                showToast('Opening print dialog...');
            }
        });
    }

    animateSkillBars() {
        const observerOptions = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.proficiency-fill');
                    fills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.animation = 'none';
                            fill.style.transition = 'width 1.5s ease-out';
                            fill.style.width = width;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skills-breakdown-grid').forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ResumeManager();
    });
} else {
    new ResumeManager();
}
