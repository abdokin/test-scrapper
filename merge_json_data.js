const fs = require('fs');
const { join } = require('path');
const category = parse_args();
const dir = join(__dirname, 'tests', category);

// Read the file
const files = fs.readdirSync(dir);

// Merge the data
const data = files.map((file) => {
    return JSON.parse(fs.readFileSync(join(dir, file), 'utf8'));
});

// Save output to a file
fs.writeFileSync(join(__dirname, 'tests', `${category}.json`), JSON.stringify(data, null, 2));


function parse_args() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: node merge_json_data.js <category>');
        process.exit(1);
    }
    return args[0];
}