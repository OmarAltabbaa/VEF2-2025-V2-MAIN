import express from 'express';
import { pool } from 'C:\Users\labto\Desktop\VEF2\vef2-2025-v2-main\src\db\db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM categories');
    res.render('categories', { categories: result.rows });
});

export default router;
