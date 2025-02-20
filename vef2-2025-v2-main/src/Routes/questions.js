import express from 'express';
import { pool } from 'C:\Users\labto\Desktop\VEF2\vef2-2025-v2-main\src\db\db.js';
import xss from 'xss';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        `SELECT q.id, q.question, a.answer, a.is_correct 
         FROM questions q 
         JOIN answers a ON q.id = a.question_id 
         WHERE q.category_id = $1`, [id]
    );
    res.render('questions', { questions: result.rows });
});

router.post('/', async (req, res) => {
    const { question, category_id, answers } = req.body;
    const sanitizedQuestion = xss(question);

    try {
        const questionResult = await pool.query(
            'INSERT INTO questions (category_id, question) VALUES ($1, $2) RETURNING id',
            [category_id, sanitizedQuestion]
        );
        const questionId = questionResult.rows[0].id;

        for (const answer of answers) {
            await pool.query(
                'INSERT INTO answers (question_id, answer, is_correct) VALUES ($1, $2, $3)',
                [questionId, xss(answer.text), answer.is_correct]
            );
        }

        res.redirect('/categories/' + category_id);
    } catch (err) {
        res.render('error', { error: err });
    }
});

export default router;
