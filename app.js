const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express());
app.use(cors());
app.listen(3300, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("server connected");
    }
});
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'mydb' 
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
// app.get('/', (req, res) => {
//     console.log("working");
//     res.json("Working api");
// });
app.post('/api/register', (req, res) => {
    const { name, email, mobile, password } = req.body;


    const query = 'INSERT INTO users (name, email,mobile,password) VALUES (?,?,?,?)';
    con.query(query, [name, email, mobile, password], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ error: 'Error inserting data into the database' });
            return;
        }
        res.status(201).json({ id: result.insertId, name, email, mobile, password, status: true });
    });
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'select * from users where email=? && password=?';
    con.query(query, [email, password], (err, result) => {
        if (err) {
            console.log('error while login');
            res.status(200).json({ message: 'login failed' });
        }
        if (result.length == 1) {
            res.status(201).json({ email, password, message: 'Login Successful', status: true });
        }
        else {
            res.status(201).json({ message: 'Login Failure' });
        }
    })
});
app.post('/api/addProduct', (req, res) => {
    const { productName, productImage, price, model } = req.body;


    const query = 'INSERT INTO products (productName, productImage,price,model) VALUES (?,?,?,?)';
    con.query(query, [productName, productImage, price, model], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ error: 'Error inserting data into the database' });
            return;
        }
        res.status(201).json({ productId: result.insertId, productName, productImage, price, model, status: true });
    });
});
app.get('/api/getProducts', (req, res) => {
    const query = 'SELECT * FROM products';
    con.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ error: 'Error inserting data into the database' });
            return;
        }
        res.status(201).json({ result, status: true });
    })
});
app.post('/api/deleteProduct', (req, res) => {
    const { productId } = req.body;
    const query = 'delete  from products where productId=?';
    con.query(query, [productId], (err, result) => {
        if (err) {
            console.error('Error inserting delete data from  the database:', err);
            res.status(500).json({ error: 'Error inserting delete data from  the database' });
            return;
        }
        res.status(201).json({ message: 'Product Delted Successfully!', status: true })
    })
});
app.post('/api/updateProduct', (req, res) => {
    // const productId = req.params.body;
    const { productName, productImage, price, model, productId } = req.body;
    const query = 'UPDATE products SET productName = ?, productImage = ?,price=?,model=? WHERE productId = ?';
    con.query(query, [productName, productImage, price, model, productId], (err, result) => {
        if (err) {
            console.error('Error inserting delete data from  the database:', err);
            res.status(500).json({ error: 'Error inserting delete data from  the database' });
            return;
        }
        if (result.changedRows == 1) {
            res.status(201).json({ message: 'Product Updated Successfuly', status: true });
        }
        else{
            res.status(201).json({message:'Invalid Id',status:false})
        }
    })
})
app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html');
})
app.get('/api/searchAllProducts/:key', (req, res)=>{
    var queryD = req.params.key;
    console.log(queryD);
    if(req.params){
        const query = `Select * from products where productName LIKE '%${queryD}%' OR  price LIKE '%${queryD}%' OR  model LIKE '%${queryD}%' `;
        con.query(query, (err, result)=>{
            if(err){
                res.send("Error got");
            }else{
                res.json(result);
            }
        })
    }
})