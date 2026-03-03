const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// API endpoint to get list of files from docs folder
app.get('/api/docs', async (req, res) => {
    try {
        const docsPath = path.join(__dirname, 'docs');
        const files = await fs.readdir(docsPath);
        
        // Get file details (name, size, modified date)
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(docsPath, file);
                const stats = await fs.stat(filePath);
                return {
                    name: file,
                    size: stats.size,
                    modified: stats.mtime,
                    isDirectory: stats.isDirectory()
                };
            })
        );
        
        // Filter out directories if needed, sort by modified date
        const docFiles = fileDetails
            .filter(f => !f.isDirectory)
            .sort((a, b) => new Date(b.modified) - new Date(a.modified));
        
        res.json(docFiles);
    } catch (error) {
        console.error('Error reading docs folder:', error);
        res.status(500).json({ error: 'Failed to read docs folder' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
