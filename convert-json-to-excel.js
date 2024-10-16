const fs = require('fs');
const { join } = require('path');
const XLSX = require('xlsx');

const create_spread_sheet = (wb, language = "en" | "fr") => {
    const dir = join(__dirname, 'data', language);
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const tests = JSON.parse(fs.readFileSync(join(dir, file), 'utf8'))
        const data = tests.map(test => [
            test.title,
            test.description,
            test.duration,
            test.select_questions,
            test.type
        ]);    
        const ws = XLSX.utils.aoa_to_sheet([
            ["Title", "Description", "Duration", "Question to answer", "Type"],
            ...data
        ]);
        XLSX.utils.book_append_sheet(wb, ws, file.split('.')[0]);
    });
}

const wb = XLSX.utils.book_new();

create_spread_sheet(wb,"en");
create_spread_sheet(wb,"fr");

XLSX.writeFile(wb, join(__dirname, 'data', 'tests.xlsx'));
