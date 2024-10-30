const fs = require('fs');
const { join } = require('path');

function flipMap(map) {
    const flipped = {};
    for (const [key, value] of Object.entries(map)) {
        flipped[value] = key;
    }
    return flipped;
}

const categories_map = {
    cognitive_ability: 'Cognitive ability',
    programming_skills: 'Programming skills',
    role_specific_skills: 'Role-specific skills',
    situational_judgment: 'Situational judgment',
    software_skills: 'Software skills'
};

const category = parse_args();

if (category) {
    
    mergeCategoryData(category);
} else {
    
    Object.keys(categories_map).forEach(mergeCategoryData);
}

function mergeCategoryData(category) {
    const dir = join(__dirname, 'tests', category);

    if (!fs.existsSync(dir)) {
        console.error(`Directory not found for category: ${category}`);
        return;
    }

    const files = fs.readdirSync(dir);

    const mergedData = files.map((file) => {
        let fileData = JSON.parse(fs.readFileSync(join(dir, file), 'utf8'));
        fileData['attributes']['category'] = flipMap(categories_map)[fileData['attributes']['category']];
        return fileData;
    });

    const outputFilename = join(__dirname, 'gists', `${categories_map[category] || category}.json`);

    
    fs.writeFileSync(outputFilename, JSON.stringify(mergedData));
    console.log(`Merged data saved to: ${outputFilename}`);
}
function parse_args() {
    const args = process.argv.slice(2);
    if (args.length > 1) {
        console.error('Usage: node merge_json_data.js [category]');
        process.exit(1);
    }
    return args[0] || null; 
}