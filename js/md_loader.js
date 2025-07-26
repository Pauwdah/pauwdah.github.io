

const page_name = "Pauwdah's Note Conglomeration"

function get_title_names() {
    const document_path = window.location.pathname;
    var category_name = document_path.substring(document_path.indexOf('docs/'), document_path.length);
    category_name = category_name.substring("docs/".length, category_name.length);
    var note_name = category_name.substring(category_name.indexOf('/'),category_name.length);
    category_name = category_name.substring(0,category_name.indexOf('/'));
    note_name = note_name.substring(1,note_name.length );
    note_name = note_name.substring(0, note_name.indexOf('/index.html'));
    note_name = note_name.replace('_', ' ');
    note_name = nominizeString(note_name)
    
    return [category_name, note_name] 
}


//Capitalize the first letter of each individual word
function nominizeString(val) {
    val = String(val).charAt(0).toUpperCase() + String(val).slice(1)    //First Letter
    if (val.includes(' ')){                                             //If there is more then one word
        for (let i = 1; i < val.length; i++) {
            if (val.charAt(i -1) == ' '){
                val = val.substring(0, i) + val.charAt(i).toUpperCase() + val.substring(i + 1) 
            }
        }
    }
    return val;
}


function init() {

    const [category_name, note_name] = get_title_names()
    // Update page title and breadcrumb
    document.getElementById('page-title').textContent = category_name + ' ' + note_name;
    document.getElementById('current-page').textContent = note_name; //swap out with folder name
    
    // Update active navigation
    updateActiveNavigation();
    
    loadMarkdownFile('content.md', 'Content');
    
}

// Update active navigation styling
function updateActiveNavigation() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.file-list a');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
}

// Load and render a markdown file
async function loadMarkdownFile(filename, title) {
    const content = document.getElementById('content');

    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`File not found: ${filename}`);
        }
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        content.innerHTML = `<div class="markdown-content">${html}</div>`;
        
        // Highlight code blocks
        Prism.highlightAllUnder(content);
        
    } catch (error) {
        showError(`Could not load ${filename}`, error.message);
    }
}

// Show error message
function showError(message, details = '') {
    document.getElementById('content').innerHTML = `
        <div class="error">
            <h2>⚠️ Error</h2>
            <p>${message}</p>
            ${details ? `<p><small>Details: ${details}</small></p>` : ''}
        </div>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init)