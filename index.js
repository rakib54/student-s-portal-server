const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json())
app.use(cors())


const port = process.env.PORT || 4000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const StudentCollection = client.db("StudentInfo").collection("StudentData");
    console.log('database connected');

    app.post('/addStudent', (req, res) => {
        try {
            const StudentData = req.body;
            StudentCollection.insertOne(StudentData)
                .then(result => {
                    res.send(result)
                })
        }
        catch (error) {
            console.log(error);
        }
    })

    app.get('/students', (req, res) => {
        try {
            StudentCollection.find({})
                .toArray((err, studentDetails) => {
                    res.send(studentDetails)
                })
        } catch (error) {
            console.log(error);
        }
    })
});







app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})