feather.replace();

let currentTab = 'uploads';
let currentPage = 1;
const itemsPerPage = 6;

// Sample data
const uploadedNotes = [
    {
        id: 1,
        title: "Digital Signal Processing - FIR and IIR Filter Design",
        author: "Khunakon",
        uploadDate: "2024-09-04",
        views: 1200,
        pages: 12,
        tags: ["PDF", "Year 3", "Exam Prep"],
        description: "Overview of FIR and IIR filter design, windowed methods, frequency sampling techniques, step-by-step computations, pros/cons, and practical tips for the final exam."
    },
    {
        id: 2,
        title: "Computer Graphics Shader Basics",
        author: "Khunakon", 
        uploadDate: "2024-09-01",
        views: 845,
        pages: 18,
        tags: ["Slides", "Code", "GLSL"],
        description: "Vertex and fragment shader fundamentals, GLSL snippets, pipeline overview, and simple lighting techniques useful for coursework and project demonstrations."
    },
    {
        id: 3,
        title: "Machine Learning Algorithms Implementation",
        author: "Khunakon",
        uploadDate: "2024-08-28",
        views: 1543,
        pages: 30,
        tags: ["Python", "ML", "Year 4"],
        description: "Complete implementation of various ML algorithms including decision trees, neural networks, and clustering with practical examples."
    },
    {
        id: 4,
        title: "Database Design and SQL Optimization",
        author: "Khunakon",
        uploadDate: "2024-08-25",
        views: 967,
        pages: 22,
        tags: ["SQL", "Database", "Year 3"],
        description: "Advanced database design patterns, query optimization techniques, and best practices for efficient data management."
    },
    {
        id: 5,
        title: "Web Development with React",
        author: "Khunakon",
        uploadDate: "2024-08-20",
        views: 2100,
        pages: 45,
        tags: ["React", "JavaScript", "Web"],
        description: "Modern web development using React, including hooks, state management, and component lifecycle with real-world examples."
    },
    {
        id: 6,
        title: "Discrete Mathematics Problem Sets",
        author: "Khunakon",
        uploadDate: "2024-08-15",
        views: 1832,
        pages: 35,
        tags: ["Math", "Problems", "Year 2"],
        description: "Collection of solved discrete mathematics problems covering logic, set theory, graphs, and combinatorics."
    },
    {
        id: 7,
        title: "Discrete Mathematics Problem Sets",
        author: "Khunakon",
        uploadDate: "2024-08-15",
        views: 1832,
        pages: 35,
        tags: ["Math", "Problems", "Year 2"],
        description: "Collection of solved discrete mathematics problems covering logic, set theory, graphs, and combinatorics."
    }
];

const favoriteNotes = [
    {
        id: 7,
        title: "Machine Learning Fundamentals",
        author: "Somchai",
        uploadDate: "2024-08-20",
        views: 2100,
        pages: 25,
        tags: ["PDF", "ML", "Year 4"],
        description: "Introduction to machine learning concepts, supervised and unsupervised learning, neural networks basics, and practical applications in real-world scenarios."
    },
    {
        id: 8,
        title: "Database Design Principles",
        author: "Malee",
        uploadDate: "2024-08-15",
        views: 1560,
        pages: 22,
        tags: ["Database", "SQL", "Year 3"],
        description: "Comprehensive guide to database design, normalization, entity-relationship modeling, and optimization techniques for efficient data management."
    }
];

// Tab switching with animations
function switchTab(tabName) {
    currentTab = tabName;
    currentPage = 1;
    
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all content sections
    document.getElementById('uploadsContent').style.display = 'none';
    document.getElementById('statisticsContent').classList.remove('active');
    
    // Show relevant content with animation
    if (tabName === 'uploads') {
        document.getElementById('uploadsContent').style.display = 'block';
        document.getElementById('currentTabTitle').textContent = 'My Uploads';
        document.querySelector('.Total-cards').textContent = 'Total Number of Uploads: 24';
        renderCards(uploadedNotes);
        // Trigger animations
        animateCards();
    } else if (tabName === 'favorites') {
        document.getElementById('uploadsContent').style.display = 'block';
        document.getElementById('currentTabTitle').textContent = 'My Favorite Notes';
        document.querySelector('.Total-cards').textContent = 'Total Number of Favorites: 8';
        renderCards(favoriteNotes);
        // Trigger animations
        animateCards();
    } else if (tabName === 'statistics') {
        document.getElementById('statisticsContent').classList.add('active');
        // Trigger animations for statistics
        animateStatistics();
    }
    
    updatePagination();
}

// Animate cards on load
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Animate statistics elements
function animateStatistics() {
    const elements = document.querySelectorAll('.overview-card, .activity-section');
    elements.forEach((el, index) => {
        el.classList.remove('scale-in', 'fade-in-up');
        void el.offsetWidth; // Trigger reflow
        el.classList.add(index < 4 ? 'scale-in' : 'fade-in-up');
        el.classList.add(`delay-${index + 1}`);
    });
    
    // Animate numbers counting up
    animateNumbers();
}

// Number counting animation
function animateNumbers() {
    const numbers = document.querySelectorAll('.overview-number');
    numbers.forEach(num => {
        const finalValue = num.textContent;
        const isDecimal = finalValue.includes('.');
        const numericValue = parseFloat(finalValue.replace('k', '')) * (finalValue.includes('k') ? 1000 : 1);
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
                num.textContent = finalValue;
            } else {
                if (finalValue.includes('k')) {
                    num.textContent = (current / 1000).toFixed(1) + 'k';
                } else {
                    num.textContent = Math.floor(current);
                }
            }
        }, 30);
    });
}

// Render cards function
function renderCards(notes) {
    const container = document.getElementById('uploadCards');
    
    if (!container) return;
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-feather="file-text"></i>
                <h3>No notes found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        feather.replace();
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotes = notes.slice(startIndex, endIndex);

    container.innerHTML = paginatedNotes.map(note => `
        <div class="card">
            <header>
                <div class="title-wrap">
                    <div class="title"><a href="note.html">${note.title}</a></div>
                    <div class="meta">
                        <span class="author">${note.author}</span>
                        <span>| Updated ${formatDate(note.uploadDate)}</span>
                    </div>
                </div>
                ${currentTab === 'uploads' ? `
                <div class="card-actions">
                    <button class="action-btn edit" onclick="editNote(${note.id})" title="Edit">
                        <i data-feather="edit-2"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteNote(${note.id})" title="Delete">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
                ` : `
                <button class="action-btn favorite-btn" data-note-id="${note.id}" title="Add to Favorites" onclick="addToFavorites(${note.id}, this)">
                    ★
                </button>
                `}
            </header>

            <p class="desc ${note.title.length > 40 ? 'clamp-4' : 'clamp-5'}">
                ${note.description}
            </p>

            <div class="foot">
                <div class="tags">
                    ${note.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
                </div>
                <span class="meta">${formatNumber(note.views)} views | ${note.pages} pages</span>
            </div>
        </div>
    `).join('');
    
    feather.replace();
}

// Pagination functions
function updatePagination() {
    const totalPages = Math.ceil(getCurrentNotes().length / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    
    if (!pagination) return;
    
    pagination.innerHTML = `
        <button id="prevBtn" onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>« Previous</button>
        ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => 
            `<button onclick="goToPage(${page})" ${page === currentPage ? 'class="active"' : ''}>${page}</button>`
        ).join('')}
        <button id="nextBtn" onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}>Next »</button>
    `;
}

function changePage(direction) {
    const totalPages = Math.ceil(getCurrentNotes().length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderCards(getCurrentNotes());
        updatePagination();
        animateCards();
    }
}

function goToPage(page) {
    currentPage = page;
    renderCards(getCurrentNotes());
    updatePagination();
    animateCards();
}

function getCurrentNotes() {
    return currentTab === 'uploads' ? uploadedNotes : (currentTab === 'favorites' ? favoriteNotes : []);
}

// Format functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Profile functions
function uploadAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileAvatar').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function editProfile() {
// Populate form with current data
document.getElementById('editProfileName').value = document.getElementById('profileName').textContent;
document.getElementById('editProfileBio').value = document.getElementById('profileBio').textContent;
document.getElementById('editProfileYear').value = document.getElementById('profileYear').textContent;
document.getElementById('editProfileEmail').value = document.getElementById('profileEmail').textContent;

showModal('editProfileModal');
}

function confirmDelete() {
const noteId = parseInt(document.getElementById('deleteModal').dataset.noteId);
const index = uploadedNotes.findIndex(n => n.id === noteId);

if (index !== -1) {
    uploadedNotes.splice(index, 1);
    renderCards(getCurrentNotes());
    updatePagination();
    closeModal('deleteModal');
    showSuccessMessage('Note deleted successfully!');
}
}

// Modal functions
function showModal(modalId) {
const modal = document.getElementById(modalId);

// รีเซ็ตค่าก่อนแสดง
modal.style.display = 'flex';
modal.style.visibility = 'visible';

// Force reflow
modal.offsetHeight;

// เพิ่ม class show
modal.classList.add('show');

document.body.style.overflow = 'hidden';

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal(modalId);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal(modalId);
    }
});
}

function closeModal(modalId) {
const modal = document.getElementById(modalId);
modal.classList.remove('show');

setTimeout(() => {
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    document.body.style.overflow = '';
    
    // เพิ่มการรีเซ็ต position ของ modal
    const modalContent = modal.querySelector('.modal');
    if (modalContent) {
        modalContent.style.transform = 'scale(0.9)';
    }
}, 200);
}

function saveNoteChanges() {
    const noteId = parseInt(document.getElementById('editNoteModal').dataset.noteId);
    const note = uploadedNotes.find(n => n.id === noteId);
    
    if (!note) return;
    
    note.title = document.getElementById('editNoteTitle').value;
    note.description = document.getElementById('editNoteDescription').value;
    note.tags = getTagsFromInput('edit');
    
    renderCards(getCurrentNotes());
    closeModal('editNoteModal');
    showSuccessMessage('Note updated successfully!');
}

function saveProfileChanges() {
    document.getElementById('profileName').textContent = document.getElementById('editProfileName').value;
    document.getElementById('profileBio').textContent = document.getElementById('editProfileBio').value;
    document.getElementById('profileYear').textContent = document.getElementById('editProfileYear').value;
    document.getElementById('profileEmail').textContent = document.getElementById('editProfileEmail').value;
    
    closeModal('editProfileModal');
    showSuccessMessage('Profile updated successfully!');
}

// Tags input functionality
function setupTagsInput(prefix, initialTags = []) {
    const container = document.getElementById(`${prefix}TagsContainer`);
    const input = document.getElementById(`${prefix}TagsInput`);
    
    container.querySelectorAll('.tag-item').forEach(tag => tag.remove());
    
    initialTags.forEach(tag => addTag(container, tag));
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            if (value) {
                addTag(container, value);
                this.value = '';
            }
        }
    });
}

function addTag(container, tagText) {
    const tagElement = document.createElement('div');
    tagElement.className = 'tag-item';
    tagElement.innerHTML = `
        ${tagText}
        <button type="button" class="tag-remove" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    const input = container.querySelector('.tags-input');
    container.insertBefore(tagElement, input);
}

function getTagsFromInput(prefix) {
    const container = document.getElementById(`${prefix}TagsContainer`);
    const tags = [];
    container.querySelectorAll('.tag-item').forEach(tag => {
        tags.push(tag.textContent.replace('×', '').trim());
    });
    return tags;
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'Check out my DME Study Hub profile',
            text: 'View my shared study notes and materials',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Profile link copied to clipboard!');
        });
    }
}

// Note functions
function editNote(noteId) {
    const note = uploadedNotes.find(n => n.id === noteId);
    if (!note) return;

    // Populate form with current data
    document.getElementById('editNoteTitle').value = note.title;
    document.getElementById('editNoteDescription').value = note.description;
    
    // Set subject
    const subjectMap = {
        'PDF': 'dsp', 'Slides': 'graphics', 'Code': 'algorithms', 
        'Python': 'ml', 'SQL': 'database', 'React': 'web'
    };
    const subject = subjectMap[note.tags[0]] || 'dsp';
    document.getElementById('editNoteSubject').value = subject;
    
    // Setup tags
    setupTagsInput('edit', note.tags);
    
    // Store note id for saving
    document.getElementById('editNoteModal').dataset.noteId = noteId;
    
    // Show modal
    showModal('editNoteModal');
}

function deleteNote(noteId) {
    const note = uploadedNotes.find(n => n.id === noteId);
    if (!note) return;
    
    document.getElementById('deleteNoteTitle').textContent = note.title;
    document.getElementById('deleteModal').dataset.noteId = noteId;
    showModal('deleteModal');
}

// Search and filter functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with uploads
    renderCards(uploadedNotes);
    updatePagination();
    
    // Trigger initial animations
    setTimeout(() => {
        animateCards();
    }, 100);
    
    // Search functionality
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const currentNotes = getCurrentNotes();
            const filteredNotes = currentNotes.filter(note => 
                note.title.toLowerCase().includes(searchTerm) ||
                note.description.toLowerCase().includes(searchTerm) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            currentPage = 1;
            renderCards(filteredNotes);
            animateCards();
        });
    }
    
    // Subject filter
    const subjectFilter = document.getElementById('subjectFilter');
    if (subjectFilter) {
        subjectFilter.addEventListener('change', function(e) {
            const filterValue = e.target.value;
            const currentNotes = getCurrentNotes();
            if (filterValue === '') {
                renderCards(currentNotes);
            } else {
                const filteredNotes = currentNotes.filter(note => 
                    note.tags.some(tag => tag.toLowerCase().includes(filterValue))
                );
                renderCards(filteredNotes);
            }
            animateCards();
        });
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function(e) {
            const sortValue = e.target.value;
            let sortedNotes = [...getCurrentNotes()];
            
            switch(sortValue) {
                case 'newest':
                    sortedNotes.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                    break;
                case 'oldest':
                    sortedNotes.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
                    break;
                case 'popular':
                    sortedNotes.sort((a, b) => b.views - a.views);
                    break;
                case 'rating':
                    // Assuming rating based on views for demo
                    sortedNotes.sort((a, b) => b.views - a.views);
                    break;
            }
            
            renderCards(sortedNotes);
            animateCards();
        });
    }
});

// Add to favorites function
function addToFavorites(noteId, buttonElement) {
    const isFavorited = buttonElement.classList.contains('favorited');
    
    if (isFavorited) {
        // Remove from favorites
        buttonElement.classList.remove('favorited');
        buttonElement.title = 'Add to Favorites';
        showSuccessMessage('Removed from favorites successfully!');
    } else {
        // Add to favorites
        buttonElement.classList.add('favorited');
        buttonElement.title = 'Remove from Favorites';
        showSuccessMessage('Added to favorites successfully!');
    }
}