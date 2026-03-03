// Simple JavaScript for the portfolio page

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio page loaded successfully!');
    
    // Load documents from docs folder
    loadDocuments();
    
    // Add animation to repository links when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all repository links
    const repoLinks = document.querySelectorAll('.repo-link');
    repoLinks.forEach(link => {
        observer.observe(link);
    });

    // Add click event logging for repository links
    repoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const repoName = this.querySelector('h3').textContent;
            console.log(`Navigating to repository: ${repoName}`);
        });
    });
});

// Function to load and display documents from docs folder
async function loadDocuments() {
    try {
        const response = await fetch('/api/docs');
        
        if (!response.ok) {
            throw new Error('Failed to fetch documents');
        }
        
        const documents = await response.json();
        displayDocuments(documents);
    } catch (error) {
        console.error('Error loading documents:', error);
        const docsList = document.getElementById('docsList');
        if (docsList) {
            docsList.innerHTML = '<p class="error">Unable to load documents. Make sure the server is running.</p>';
        }
    }
}

// Function to display documents in the HTML
function displayDocuments(documents) {
    const docsList = document.getElementById('docsList');
    
    if (!docsList) return;
    
    if (documents.length === 0) {
        docsList.innerHTML = '<p class="no-docs">No documents found in the docs folder.</p>';
        return;
    }
    
    const docsHTML = documents.map(doc => {
        const fileSize = formatFileSize(doc.size);
        const modifiedDate = new Date(doc.modified).toLocaleDateString();
        
        return `
            <div class="doc-item">
                <a href="docs/${encodeURIComponent(doc.name)}" class="doc-link">
                    <span class="doc-icon">📄</span>
                    <div class="doc-info">
                        <h3>${doc.name}</h3>
                        <p class="doc-meta">${fileSize} • Modified: ${modifiedDate}</p>
                    </div>
                </a>
            </div>
        `;
    }).join('');
    
    docsList.innerHTML = docsHTML;
    
    // Observe doc items for animation
    const docItems = document.querySelectorAll('.doc-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    docItems.forEach(item => {
        observer.observe(item);
    });
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Simple function to update the year in footer dynamically
function updateFooterYear() {
    const footer = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    if (footer) {
        footer.textContent = `© ${currentYear} My Portfolio. All rights reserved.`;
    }
}

updateFooterYear();

