import pg from "pg";
import dotenv from "dotenv";
import xss from "xss";

dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function getCategories() {
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
}

export async function getQuestionsByCategory(categoryId) {
    const result = await pool.query(
        `SELECT q.id, q.question, 
                json_agg(json_build_object('answer', a.answer, 'is_correct', a.is_correct)) AS answers
         FROM questions q 
         LEFT JOIN answers a ON q.id = a.question_id
         WHERE q.category_id = $1
         GROUP BY q.id`,
        [categoryId]
    );
    return result.rows;
}


export async function addQuestion({ question, category_id, answers }) {
    const cleanQuestion = xss(question);
    const { rows } = await pool.query(
        "INSERT INTO questions (question, category_id) VALUES ($1, $2) RETURNING id",
        [cleanQuestion, category_id]
    );
    const questionId = rows[0].id;

    for (const answer of answers) {
        await pool.query(
            "INSERT INTO answers (answer, question_id, is_correct) VALUES ($1, $2, $3)",
            [xss(answer.text), questionId, answer.is_correct]
        );
    }
}
