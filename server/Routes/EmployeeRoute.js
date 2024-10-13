import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";

const router = express.Router()


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



router.get('/user', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ Status: false, Error: 'Unauthorized' });
  }

  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
      if (err) {
          return res.status(401).json({ Status: false, Error: 'Unauthorized' });
      }

      const sql = 'SELECT id, name, email, image, category_id FROM employee  WHERE id = ?';
      con.query(sql, [decoded.id], (err, result) => {
          if (err) {
              return res.status(500).json({ Status: false, Error: 'Query Error' });
          }

          if (result.length === 0) {
              return res.status(404).json({ Status: false, Error: 'User not found' });
          }

          return res.json({ Status: true, user: result[0] });
      });
  });
});




router.post("/employee_login", (req, res) => {
  const sql = "SELECT * from employee Where email = ? and password = ?";
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
  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  });

  
  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })

  export {router as EmployeeRouter}