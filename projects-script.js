/* ============================================
   PROJECTS PAGE JAVASCRIPT
   Search, Filter, Sort, Pagination & Modals
   ============================================ */

class ProjectsManager {
    constructor(projectsData) {
        this.allProjects = projectsData;
        this.filteredProjects = [...projectsData];
        this.itemsPerPage = 9;
        this.currentPage = 1;
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Search input
        const searchInput = document.getElementById('projectSearch');
        const searchClear = document.getElementById('searchClear');
        
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            searchClear.style.display = this.searchQuery ? 'block' : 'none';
            this.currentPage = 1;
            this.filterAndSort();
            this.render();
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            searchClear.style.display = 'none';
            this.currentPage = 1;
            this.filterAndSort();
            this.render();
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndSort();
            this.render();
        });

        // Modal close
        const modal = document.getElementById('projectModal');
        const modalClose = document.getElementById('modalClose');
        
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });
    }

    handleFilter(e) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        this.currentFilter = e.target.getAttribute('data-filter');
        this.currentPage = 1;
        this.filterAndSort();
        this.render();
    }

    filterAndSort() {
        // Start with all projects
        this.filteredProjects = [...this.allProjects];

        // Apply filter
        if (this.currentFilter !== 'all') {
            this.filteredProjects = this.filteredProjects.filter(project =>
                project.category.includes(this.currentFilter)
            );
        }

        // Apply search
        if (this.searchQuery) {
            this.filteredProjects = this.filteredProjects.filter(project =>
                project.title.toLowerCase().includes(this.searchQuery) ||
                project.description.toLowerCase().includes(this.searchQuery) ||
                project.technologies.some(tech =>
                    tech.toLowerCase().includes(this.searchQuery)
                )
            );
        }

        // Apply sort
        this.filteredProjects.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    }

    getPaginatedProjects() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredProjects.slice(startIndex, endIndex);
    }

    getTotalPages() {
        return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    }

    render() {
        this.renderProjects();
        this.renderPagination();
    }

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const noResults = document.getElementById('noResults');
        const projects = this.getPaginatedProjects();

        if (projects.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        noResults.style.display = 'none';

        grid.innerHTML = projects.map(project => `
            <article class="project-card">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <button class="btn-overlay" onclick="projectsManager.openModal(${project.id})" title="View Details">
                            <i class="fas fa-expand"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.slice(0, 3).map(tech =>
                            `<span class="tech-badge">${tech}</span>`
                        ).join('')}
                        ${project.technologies.length > 3 ? `<span class="tech-badge">+${project.technologies.length - 3}</span>` : ''}
                    </div>
                    <div class="project-links">
                        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                            Live Demo <i class="fas fa-external-link-alt"></i>
                        </a>
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">
                            GitHub <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = this.getTotalPages();

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        if (this.currentPage > 1) {
            html += `
                <button class="pagination-btn prev" onclick="projectsManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
            `;
        }

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<button class="pagination-btn" onclick="projectsManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                html += `<span class="pagination-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const active = i === this.currentPage ? 'active' : '';
            html += `<button class="pagination-btn ${active}" onclick="projectsManager.goToPage(${i})">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span class="pagination-dots">...</span>`;
            }
            html += `<button class="pagination-btn" onclick="projectsManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            html += `
                <button class="pagination-btn next" onclick="projectsManager.goToPage(${this.currentPage + 1})">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        pagination.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.render();
        // Smooth scroll to projects grid
        document.getElementById('projectsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    openModal(projectId) {
        const project = this.allProjects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');

        const categoryLabels = {
            'web': 'Web Application',
            'fullstack': 'Full Stack',
            'design': 'UI/UX Design',
            'frontend': 'Frontend',
            'backend': 'Backend'
        };

        const statsHtml = Object.entries(project.stats).map(([key, value]) => `
            <div class="stat-item">
                <span class="stat-label">${this.formatLabel(key)}</span>
                <span class="stat-value">${value}</span>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${project.image}" alt="${project.title}" class="modal-image">
            </div>
            <div class="modal-details">
                <div class="modal-title-section">
                    <h2>${project.title}</h2>
                    <div class="modal-categories">
                        ${project.category.map(cat =>
                            `<span class="category-badge">${categoryLabels[cat] || cat}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="modal-description">
                    <h3>Overview</h3>
                    <p>${project.longDescription}</p>
                </div>

                <div class="modal-technologies">
                    <h3>Technologies Used</h3>
                    <div class="tech-list">
                        ${project.technologies.map(tech =>
                            `<span class="tech-item">${tech}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="modal-stats">
                    <h3>Project Statistics</h3>
                    <div class="stats-grid-modal">
                        ${statsHtml}
                    </div>
                </div>

                <div class="modal-actions">
                    <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        <i class="fas fa-globe"></i> Visit Live Demo
                    </a>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                </div>

                <div class="modal-meta">
                    <p><strong>Project Date:</strong> ${this.formatDate(project.date)}</p>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    formatLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

// Initialize when DOM is ready
let projectsManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        projectsManager = new ProjectsManager(projectsData);
    });
} else {
    projectsManager = new ProjectsManager(projectsData);
}
