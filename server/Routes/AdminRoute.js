import express from "express";
import con from "../utils/db.js";  // bd connect
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";

const router = express.Router();




















































router.get('/user', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: false, Error: 'Unauthorized' });
    }

    jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Status: false, Error: 'Unauthorized' });
        }

        const sql = 'SELECT id, username, email FROM admin WHERE id = ?';
        con.query(sql, [decoded.id], (err, result) => {
            if (err) {
                return res.status(500).json({ Status: false, Error: 'Query Errorr' });
            }

            if (result.length === 0) {
                return res.status(404).json({ Status: false, Error: 'User not found' });
            }

            return res.json({ Status: true, user: result[0] });
        });
    });
});


const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: false, Error: 'Unauthorized' });
    }

    jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Status: false, Error: 'Unauthorized' });
        }

        req.user = decoded; 
        next();
    });
};


router.get('/employee/timesheets', isAuthenticated, (req, res) => {
    const employeeId = req.user.id; 
    const query = `
           SELECT ts.id, ts.date, ts.hours, ts.description, ts.category_id, ts.etat_id
        FROM timesheets ts
        JOIN employee e ON ts.category_id = e.category_id
        WHERE e.id = ?
    `;

    con.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching timesheets:', err);
            return res.status(500).json({ Status: false, Error: 'Query Error' });
        }
        res.json(results);
    });
});

router.put('/timesheets/:id', (req, res) => {
    const timesheetId = req.params.id;
    const newState = req.body.etat; 


    const updateQuery = `
        UPDATE timesheets
        SET etat_id = ?
        WHERE id = ?
    `;

    con.query(updateQuery, [newState, timesheetId], (err, results) => {
        if (err) {
            console.error('Error updating timesheet state:', err);
            return res.status(500).json({ error: "Update Error" });
        }
        res.json({ status: true, message: 'Timesheet state updated successfully' });
    });
});

router.post('/timesheets/start', isAuthenticated, (req, res) => {
    const timesheetId = req.body.timesheetId;
    const updateQuery = `
        UPDATE timesheets
        SET etat_id = 2 -- 'en cour' state
        WHERE id = ?
    `;

    con.query(updateQuery, [timesheetId], (err, results) => {
        if (err) {
            console.error('Error updating timesheet state:', err);
            return res.status(500).json({ Status: false, Error: 'Update Error' });
        }
        res.json({ Status: true, Message: 'Timesheet state updated to "start".' });
    });
});

router.post('/timesheets/complete', isAuthenticated, (req, res) => {
    const timesheetId = req.body.timesheetId; 
    const updateQuery = `
        UPDATE timesheets
        SET etat_id = 3 -- 'complete' state
        WHERE id = ?
    `;

    con.query(updateQuery, [timesheetId], (err, results) => {
        if (err) {
            console.error('Error updating timesheet state:', err);
            return res.status(500).json({ Status: false, Error: 'Update Error' });
        }
        res.json({ Status: true, Message: 'Timesheet state updated to "complete".' });
    });
});

router.get('/tasks', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM timesheets) AS total,
      (SELECT COUNT(*) FROM timesheets WHERE etat_id = '1') AS start,
      (SELECT COUNT(*) FROM timesheets WHERE etat_id = '2') AS encours,
      (SELECT COUNT(*) FROM timesheets WHERE etat_id = '3') AS finalise
  `;

  con.query(query, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});


router.post("/adminlogin", (req, res) => {
    const sql = "SELECT * from admin Where email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
                { role: "admin", email: email, id: result[0].id },
                "jwt_secret_key",
                { expiresIn: "1d" }
            );
            res.cookie('token', token)
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "wrong email or password" });
        }
    });
});

router.post("/adminregister", (req, res) => {
    const { username, email, password, secretCode } = req.body;
    const validSecretCode = "12363751";

    if (secretCode !== validSecretCode) {
        return res.json({ registerStatus: false, Error: 'Invalid secret code' });
    }

    const checkEmailQuery = "SELECT * FROM admin WHERE email = ?";
    con.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Error checking email existence:', err);
            return res.json({ registerStatus: false, Error: 'Error checking email existence' });
        } else if (results.length > 0) {
            return res.json({ registerStatus: false, Error: 'Email already exists' });
        } else {
            const insertAdminQuery = "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)";
            con.query(insertAdminQuery, [username, email, password], (err, result) => {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.json({ registerStatus: false, Error: 'Error registering user' });
                }
                console.log('User registered successfully');
                return res.json({ registerStatus: true, Message: 'User registered successfully' });
            });
        }
    });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        return res.json({Status: true, Result: result});
    });
});




router.get('/etat', (req, res) => {
    const sql = "SELECT * FROM etat";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        return res.json({Status: true, Result: result});
    });
});

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)";
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        return res.json({Status: true});
    });
});





router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        return res.json({Status: true, Result: result});
    });
});

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        return res.json({Status: true, Result: result});
    });
});




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name, email, password, address, salary, image, category_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        req.body.name,
        req.body.email,
        req.body.password, 
        req.body.address,
        req.body.salary,
        req.file.filename,
        req.body.category_id
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Insert Error: ", err);
            return res.json({ Status: false, Error: err.message });
        }
        return res.json({ Status: true });
    });
});


router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`;
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ];
    con.query(sql, [...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

router.get('/admin_count', (req, res) => {
    const sql = "SELECT COUNT(id) AS admin FROM admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

router.get('/employee_count', (req, res) => {
    const sql = "SELECT COUNT(id) AS employee FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

router.get('/salary_count', (req, res) => {
    const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

router.get('/admin_records', (req, res) => {
    const sql = "SELECT * FROM admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: true});
});

router.get('/timesheets', (req, res) => {
    const query = `
        SELECT 
            ts.id, ts.date, ts.hours, ts.description, ts.category_id, ts.etat_id 
        FROM 
            timesheets ts
        JOIN 
            etat ON ts.etat_id = etat.id
    `;
    
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching timesheets:', err);
            return res.status(500).json({ error: "Query Error" });
        }
        res.json(results);
    });
});

router.post('/timesheets', (req, res) => {
    const { date, hours, description, category_id } = req.body;
    const query = 'INSERT INTO timesheets (admin_id, project_id, date, hours, description, category_id, etat_id) VALUES (1, 1, ?, ?, ?, ?, 1)';
    
    con.query(query, [date, hours, description, category_id], (err, result) => {
        if (err) {
            console.error('Error inserting timesheet:', err);
            return res.status(500).json({ error: "Query Error", details: err });
        }
        res.json({ id: result.insertId, admin_id: 1, project_id: 1, date, hours, description, category_id, etat_id: 1 }); // Include etat_id in response
    });
});

    
    router.get('/timesheets/:adminId', (req, res) => {
        const adminId = req.params.adminId;
        con.query('SELECT * FROM timesheets WHERE admin_id = ?', [adminId], (err, results) => {
            if (err) return res.status(500).json({ error: "Query Error" });
            res.json(results);
        });
    });


    router.delete('/timesheets/:id', isAuthenticated, (req, res) => {
        const timesheetId = req.params.id;
    
     
        const checkQuery = "SELECT etat_id FROM timesheets WHERE id = ?";
        con.query(checkQuery, [timesheetId], (err, results) => {
            if (err) {
                console.error('Error checking timesheet state:', err);
                return res.status(500).json({ Status: false, Error: 'Query Error' });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ Status: false, Error: 'Timesheet not found' });
            }
    
            if (results[0].etat_id !== 3) {
                return res.status(400).json({ Status: false, Error: 'Cannot delete timesheet with current state' });
            }
    
            const deleteQuery = "DELETE FROM timesheets WHERE id = ?";
            con.query(deleteQuery, [timesheetId], (err, result) => {
                if (err) {
                    console.error('Error deleting timesheet:', err);
                    return res.status(500).json({ Status: false, Error: 'Delete Error' });
                }
                res.json({ Status: true, Message: 'Timesheet deleted successfully' });
            });
        });
    });
    
    router.get('/stats/:projectId', (req, res) => {
        const projectId = req.params.projectId;
    
        // Sample query to get total hours worked on a project
        const query = `
            SELECT 
                p.name,
                SUM(t.hours) as totalHours,
                COUNT(t.id) as totalTasks
            FROM projects p
            LEFT JOIN timesheets t ON p.id = t.project_id
            WHERE p.id = ?
            GROUP BY p.id;
        `;
    
        con.query(query, [projectId], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.json(results[0]);
        });
    });



 
router.post('/evenements', (req, res) => {
    const { titre, sous_titre, description } = req.body;
    const sql = 'INSERT INTO evenement (titre, sous_titre, description) VALUES (?, ?, ?)';
    con.query(sql, [titre, sous_titre, description], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


router.get('/evenements', (req, res) => {
    const sql = 'SELECT * FROM evenement';
    con.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
    
    export { router as adminRouter };
    