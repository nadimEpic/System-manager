import express from 'express';
import con from '../utils/db.js'; 
import jwt from 'jsonwebtoken';

const router = express.Router();
const app = express();
app.use(express.json());


const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
            if (err) return res.json({ Status: false, Error: 'Wrong Token' });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: 'Not authenticated' });
    }
};


router.use(verifyUser);

router.get('/', (req, res) => {
    const userId = req.id; 
    const sql = 'SELECT * FROM tasks ';
    con.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ Status: false, Error: 'Query Error' });
        res.json({ Status: true, todos: results });
    });
});

router.post('/add', (req, res) => {
    const userId = req.id; 
    const { title } = req.body;
    const sql = 'INSERT INTO tasks (user_id, title) VALUES (?, ?)';
    con.query(sql, [userId, title], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: 'Query Error' });
        res.json({ id: result.insertId, title, completed: false });
    });
});

export { router as todoRouter };
