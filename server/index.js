import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import { EmployeeRouter } from './Routes/EmployeeRoute.js';
import { todoRouter } from './Routes/TodoRoute.js';
import { ChatRouter, chatServer } from './Routes/ChatRoute.js'; 
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeems'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});


app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'Public/Images')));
app.use(express.static('Public'));

// Verify User Middleware
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


app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);
app.use('/todos', todoRouter); 
app.use('/chat', ChatRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

chatServer.listen(3001, () => {
    console.log('Socket.io server is running on port 3001');
});
