import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import xss from "xss";

dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const dataFolder = "./data";

// Function to read JSON files
function readJSON(file) {
    try {
        const content = fs.readFileSync(file, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return null;
    }
}

// Insert category if not exists
async function insertCategory(title) {
    const res = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
        [xss(title)]
    );
    return res.rows[0]?.id || (await pool.query("SELECT id FROM categories WHERE name = $1", [title])).rows[0].id;
}

// Insert question
async function insertQuestion(questionText, categoryId) {
    const res = await pool.query(
        "INSERT INTO questions (question, category_id) VALUES ($1, $2) RETURNING id",
        [xss(questionText), categoryId]
    );
    return res.rows[0].id;
}

// Insert answers
async function insertAnswers(questionId, answers) {
    for (const ans of answers) {
        if (typeof ans.answer === "string" && typeof ans.correct === "boolean") {
            await pool.query(
                "INSERT INTO answers (answer, question_id, is_correct) VALUES ($1, $2, $3)",
                [xss(ans.answer), questionId, ans.correct]
            );
        }
    }
}

// Load all valid JSON files
async function loadData() {
    const files = fs.readdirSync(dataFolder).filter(file => file.endsWith(".json"));
    
    for (const file of files) {
        const filePath = path.join(dataFolder, file);
        const jsonData = readJSON(filePath);

        if (!jsonData || !jsonData.title || !jsonData.questions) {
            console.warn(`Skipping invalid file: ${file}`);
            continue;
        }

        console.log(`Processing ${jsonData.title}...`);
        const categoryId = await insertCategory(jsonData.title);

        for (const q of jsonData.questions) {
            if (q.question && Array.isArray(q.answers)) {
                const questionId = await insertQuestion(q.question, categoryId);
                await insertAnswers(questionId, q.answers);
            }
        }
    }

    console.log("Data loaded successfully.");
    await pool.end();
}

loadData().catch(err => console.error("Error loading data:", err));
