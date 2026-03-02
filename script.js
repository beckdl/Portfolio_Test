// Simple JavaScript for the portfolio page

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio page loaded successfully!');
    
    // Add animation to repository links when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
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

// Simple function to update the year in footer dynamically
function updateFooterYear() {
    const footer = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    if (footer && footer.textContent.includes('2026')) {
        footer.textContent = `© ${currentYear} My Portfolio. All rights reserved.`;
    }
}

updateFooterYear();
