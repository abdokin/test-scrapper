const zod = require('zod');
const fs = require('fs');
const { join } = require('path');
const fileName = parse_args();
const file = fs.readFileSync(join(__dirname, 'tests', fileName));
const data = JSON.parse(file);

const schema = zod.array(
    zod.object({
        title: zod.string(),
        attributes: zod.object({
            overview: zod.string(),
            level: zod.enum(['entry_level', 'intermediate', 'advanced']),
            covered_skills: zod.array(zod.string()),
            relevancy: zod.string(),
            description: zod.string(),
            category: zod.string(),
            language: zod.enum(['french', 'english']),
            duration_seconds: zod.number().int(),
            position: zod.number().int(),
            questions_to_answer: zod.number().int(),
        }),
        questions: zod.array(zod.object({
            question_attributes: zod.object({
                type: zod.enum(['multiple_choice', 'multiple_response']),
                preview: zod.boolean().optional(),
                content: zod.string(),
            }),
            options: zod.array(zod.object({
                content: zod.string(),
                correct: zod.boolean().optional(),
            }))
        }).superRefine((question, ctx) => {                
            // ensure options are unique
            const options = question.options.map(option => option.content);
            if (new Set(options).size !== options.length) {
                ctx.addIssue({
                    message: 'Options must be unique',
                    code: 'invalid_options',
                });
            }
            // ensure multiple choice questions have only one correct answer
            if (question.question_attributes.type === 'multiple_choice') {
                const correct = question.options.filter(option => option.correct);
                if (correct.length !== 1) {
                    ctx.addIssue({
                        message: `Multiple choice questions must have exactly one correct answer for question "${question.question_attributes.content}"`,
                        code: 'invalid_correct_option',
                    });
                }
            }
            // ensure has at least one correct answer for multiple response questions
            if (question.question_attributes.type === 'multiple_response') {
                const correct = question.options.filter(option => option.correct);
                if (correct.length === 0) {
                    ctx.addIssue({
                        message: `Multiple response questions must have at least one correct answer for question "${question.question_attributes.content}"`,
                        code: 'invalid_correct_option',
                    });
                }
            }
        }),
    )
        
    })
)
console.log('Validating schema for', fileName);

try {
    schema.parse(data);
} catch (error) {
    console.error('Schema is invalid:', error.errors);
    process.exit(1);
}
function parse_args() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: node merge_json_data.js <file>');
        process.exit(1);
    }
    return args[0];
}