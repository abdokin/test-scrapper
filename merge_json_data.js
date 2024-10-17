const fs = require('fs');
const { join } = require('path');
const dir = join(__dirname, 'tests', 'programming-skills');

// Read the file
const files = fs.readdirSync(dir);

// Merge the data
const data = files.map((file) => {
    return JSON.parse(fs.readFileSync(join(dir, file), 'utf8'));
});

// Save output to a file
fs.writeFileSync(join(__dirname, 'tests', 'programming-skills.json'), JSON.stringify(data, null, 2));
