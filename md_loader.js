function getPageMetadata() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    
    // Default to home if at root
    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'index.html')) {
        return {
            type: 'home',
            title: "Pauwdah's Note Conglomeration",
            breadcrumb: 'Home'
        };
    }
    
    // Find docs segment
    const docsIndex = parts.indexOf('docs');
    if (docsIndex === -1 || docsIndex >= parts.length - 3) {
        return {
            type: 'error',
            title: 'Invalid Page Path',
            breadcrumb: 'Error'
        };
    }
    
    const category = parts[docsIndex + 1];
    const topic = parts[docsIndex + 2];
    
    // Format names: "execution_order" -> "Execution Order"
    const formatName = (str) => {
        return str.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    
    const categoryName = formatName(category);
    const topicName = formatName(topic);
    
    return {
        type: 'markdown',
        title: `${categoryName}: ${topicName}`,
        markdownFile: 'content.md', // Always in same directory
        category: categoryName,
        breadcrumb: `${categoryName} > ${topicName}`
    };
}

async function loadMarkdownContent() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    
    const config = getPageMetadata();
    
    // Update page title and breadcrumb
    document.title = config.title;
    
    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) pageTitleEl.textContent = config.title;
    
    const currentPageEl = document.getElementById('current-page');
    if (currentPageEl) currentPageEl.textContent = config.breadcrumb;
    
    if (config.type === 'home') return;
    
    if (config.type === 'error') {
        showError('Invalid page path', `Path: ${window.location.pathname}`);
        return;
    }
    
    try {
        const response = await fetch(config.markdownFile);
        if (!response.ok) throw new Error('Markdown file not found');
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        contentDiv.innerHTML = `<div class="markdown-content">${html}</div>`;
        
        // Highlight code blocks
        if (window.Prism) {
            Prism.highlightAllUnder(contentDiv);
        }
    } catch (error) {
        showError(`Could not load content.md`, error.message);
    }
}

function showError(message, details = '') {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = `
        <div class="error">
            <h2>⚠️ Error</h2>
            <p>${message}</p>
            ${details ? `<p><small>Details: ${details}</small></p>` : ''}
        </div>
    `;
}

// Initialize topic page
document.addEventListener('DOMContentLoaded', loadMarkdownContent);