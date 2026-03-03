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
    const docsList = document.getElementById('docsList');

    // Try local server API first (for local dev)
    try {
        const response = await fetch('/api/docs');
        if (response.ok) {
            const documents = await response.json();
            displayDocuments(documents);
            return;
        }
    } catch (e) {
        // ignore and fall back to GitHub
    }

    // Fallback: fetch from GitHub repository contents (works on GitHub Pages for public repos)
    // Auto-detect owner/repo from the current URL when possible
    let owner = 'beckdl';
    let repo = 'Portfolio_Test';
    let branch = 'main';

    try {
        const host = window.location.hostname; // e.g., beckdl.github.io
        const pathParts = window.location.pathname.split('/').filter(Boolean); // ['Portfolio_Test', ...]

        if (host.endsWith('github.io')) {
            owner = host.split('.')[0];
            // If there's a path segment, that's likely the repo name for project pages
            if (pathParts.length > 0) {
                repo = pathParts[0];
            } else {
                // user/organization site (username.github.io)
                repo = `${owner}.github.io`;
            }
        }

        // Try to get the repository default branch from GitHub API
            try {
                const repoApi = `https://api.github.com/repos/${owner}/${repo}`;
                const rResp = await fetch(repoApi);
                if (rResp.ok) {
                    const repoInfo = await rResp.json();
                    if (repoInfo && repoInfo.default_branch) {
                        branch = repoInfo.default_branch;
                    }
                }
            } catch (e) {
                // ignore and leave branch as default
            }

        // Debug: expose detected values in console and on page for quick diagnosis
        console.info('Docs loader detection:', { owner, repo, branch });
        try {
            const docsList = document.getElementById('docsList');
            if (docsList) {
                let debugEl = document.getElementById('docs-debug');
                if (!debugEl) {
                    debugEl = document.createElement('div');
                    debugEl.id = 'docs-debug';
                    debugEl.style.fontSize = '0.9rem';
                    debugEl.style.color = '#666';
                    debugEl.style.marginBottom = '0.5rem';
                    docsList.parentNode.insertBefore(debugEl, docsList);
                }
                debugEl.textContent = `Detected: ${owner}/${repo} @ ${branch}`;
            }
        } catch (e) {
            // ignore DOM debug errors
        }
    } catch (e) {
        // fallback to configured values above
    }

    try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/docs?ref=${branch}`;
        const resp = await fetch(apiUrl);
        if (!resp.ok) throw new Error('GitHub API fetch failed');
        const items = await resp.json();

        // Filter files and collect metadata. We'll fetch last-commit date per file.
        const files = items.filter(i => i.type === 'file');

        const documents = await Promise.all(files.map(async (file) => {
            const doc = {
                name: file.name,
                size: file.size || 0,
                modified: null,
                download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/docs/${encodeURIComponent(file.name)}`
            };

            try {
                const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=docs/${encodeURIComponent(file.name)}&page=1&per_page=1`;
                const cResp = await fetch(commitsUrl);
                if (cResp.ok) {
                    const commits = await cResp.json();
                    if (Array.isArray(commits) && commits.length > 0) {
                        doc.modified = commits[0].commit.committer.date;
                    }
                }
            } catch (e) {
                // ignore per-file commit errors
            }

            return doc;
        }));

        displayDocuments(documents.map(d => ({ name: d.name, size: d.size, modified: d.modified, download_url: d.download_url })));
        return;
    } catch (err) {
        console.error('Error loading documents from GitHub:', err);
        if (docsList) {
            docsList.innerHTML = '<p class="error">Unable to load documents from server or GitHub. If your repo is private, a token is required.</p>';
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
        const modifiedDate = doc.modified ? new Date(doc.modified).toLocaleDateString() : 'Unknown';
        const href = doc.download_url ? doc.download_url : `docs/${encodeURIComponent(doc.name)}`;

        return `
            <div class="doc-item">
                <a href="${href}" class="doc-link" target="_blank" rel="noopener noreferrer">
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

