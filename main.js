var mysql = require('mysql');
var express = require('express');
const { timeStamp } = require('console');
require("dotenv").config()

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD
});

var app = express()
app.use(express.json());

var currentBookId = 0

con.connect(function(err) {
  if (err) throw err;
  initilizeDataBase(con)
});

const generateTimeStamp = () => {
    const date = new Date();
    return `${date.getUTCDate()}:${date.getUTCMonth() + 1}:${date.getUTCFullYear()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const initilizeDataBase = (connection) => {
    connection.query("CREATE DATABASE IF NOT EXISTS book_store")
    connection.query("use book_store")
    connection.query("create table IF NOT EXISTS books(book_title varchar(20), book_price numeric(6), book_id numeric(5) primary key, author varchar(20));")
}

//get all books
app.get("/books", (req, res) => {
    con.query("SELECT * FROM books", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).end({
                responseTitle: "Book Not Found",
                statusCode: 500,
                responseValue: result
            });
        }
        res.json({
            responseTitle: "All Books",
            statusCode: 200,
            responseValue: result
        });
    });
});

//get book by id
app.get("/book/:id", (req, res) => {
    var bookId = req.params["id"]
    console.log(bookId)
    con.query(`select * from books where book_id = ${bookId}`, (err, result) => {
        if(err){
            res.status(400)
            return res.json({
                responseTitle: "Bad request",
                timeStamp: generateTimeStamp()
            });
        }
        if (result.length === 0) {
            res.status(404)
            return res.json({
                responseTitle: "Book Not Found",
                timeStamp: generateTimeStamp()
            });
        }
        res.status(200)
        res.json({
            responseTitle: "Book Found",
            timeStamp: generateTimeStamp(),
            responseValue: result
        })
    })

})

app.post("/book", (req, res) => {
    con.query(`INSERT INTO books (book_title, book_price, book_id, author) VALUES('${req.body.bookTitle}', ${req.body.bookPrice}, ${currentBookId}, '${req.body.bookAuthor}');`, (err, result) => {
        if(err){
            res.status(400)
            return res.json({
                responseTitle: "Status Bad Request",
                timeStamp: generateTimeStamp()
            })
        }
        res.status(200)
        res.json({
            responseTitle: "Added new book",
            timeStamp: generateTimeStamp(),
        })
        currentBookId += 1
    })
})

app.put("/book/:id", (req, res) => {
    con.query(`UPDATE books SET book_title = '${req.body.bookTitle}', book_price = '${req.body.bookPrice}', author = '${req.body.bookAuthor}' WHERE book_id = ${req.params["id"]};`, (err, result) => {
        if(err){
            console.log(err)
            res.status(400)
            return res.json({
                responseTitle: "Status Bad Request",
                timeStamp: generateTimeStamp()
            })
        }
        res.status(200)
        res.json({
            responseTitle: "update book",
            timeStamp: generateTimeStamp(),
        })
    })
})

app.delete("/book/:id", (req, res) => {
    var bookId = req.params["id"]
    con.query(`DELETE FROM books WHERE book_id = ${bookId};`, (err, result) => {
        if(err){
            res.status(400)
            return res.json({
                responseTitle: "Status Bad Request",
                timeStamp: generateTimeStamp()
            })
        }
    })
    res.status(200)
    res.json({
        responseTitle: "deleted book",
        timeStamp: generateTimeStamp(),
    })
})


var server = app.listen(process.env.PORT, () => {
    console.log(`sever running at port ${process.env.PORT}`)
})