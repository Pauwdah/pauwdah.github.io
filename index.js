async function generateSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    try {
        const response = await fetch('/directory-listing.json');
        if (!response.ok) throw new Error('Directory listing not found');
        
        const structure = await response.json();
        sidebar.innerHTML = ''; // Clear existing content
        
        for (const [category, topics] of Object.entries(structure)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            
            const header = document.createElement('h3');
            header.textContent = category;
            categoryDiv.appendChild(header);
            
            const ul = document.createElement('ul');
            ul.className = 'file-list';
            
            topics.forEach(topic => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                a.textContent = topic.name;
                a.href = `docs/${category}/${topic.folder}/index.html`;
                
                li.appendChild(a);
                ul.appendChild(li);
            });
            
            categoryDiv.appendChild(ul);
            sidebar.appendChild(categoryDiv);
        }
    } catch (error) {
        console.error('Error loading sidebar:', error);
        sidebar.innerHTML = '<p>⚠️ Could not load navigation</p>';
    }
}

// Initialize main page
document.addEventListener('DOMContentLoaded', generateSidebar);