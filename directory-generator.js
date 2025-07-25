const fs = require('fs');
const path = require('path');

function generateDirectoryListing() {
    try {
        const docsPath = path.join(__dirname, 'docs');
        const outputPath = path.join(__dirname, 'directory-listing.json');
        
        // Create directory-listing.json if it doesn't exist
        if (!fs.existsSync(outputPath)) {
            fs.writeFileSync(outputPath, JSON.stringify({}, null, 2));
        }
        
        const structure = {};
        
        // Get all categories
        const categories = fs.readdirSync(docsPath).filter(file => {
            return fs.statSync(path.join(docsPath, file)).isDirectory();
        });
        
        categories.forEach(category => {
            const categoryPath = path.join(docsPath, category);
            structure[category] = [];
            
            // Get all topics in category
            const topics = fs.readdirSync(categoryPath).filter(topic => {
                const topicPath = path.join(categoryPath, topic);
                return fs.statSync(topicPath).isDirectory();
            });
            
            topics.forEach(topic => {
                const topicPath = path.join(categoryPath, topic);
                const indexPath = path.join(topicPath, 'index.html');
                
                if (fs.existsSync(indexPath)) {
                    // Format name: "layer_masks" → "Layer Masks"
                    const displayName = topic
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    structure[category].push({
                        name: displayName,
                        folder: topic
                    });
                }
            });
        });
        
        // Save to file
        fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));
        console.log('✅ Directory listing updated successfully!');
        return 0;
    } catch (error) {
        console.error('❌ Error generating directory listing:', error);
        return 1;
    }
}

// Run the generator and exit with proper status code
process.exit(generateDirectoryListing());