const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const { ObjectId } = require('bson');


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

    app.get('/students/:id', (req, res) => {
        try {
            const id = ObjectId(req.params.id)
            StudentCollection.find({ _id: id })
                .toArray((err, studentDetails) => {
                    res.send(studentDetails)
                })
        } catch (error) {
            console.log(error);
        }
    })

    app.get('/students', (req, res) => {
        try {
            const search = req.query.search
            StudentCollection.find({ name: { $regex: search } })
                .toArray((err, studentDetails) => {
                    res.send(studentDetails)
                })
        } catch (error) {
            console.log(error);
        }
    })

    app.delete('/deleteStudent/:id', (req, res) => {
        const id = ObjectId(req.params.id)
        StudentCollection.deleteOne({ _id: id })
            .then(result => {
                res.send(result)
            })
    })

    app.post('/updateStudent/:id', (req, res) => {
        const { name, registration, ID, imageUrl } = req.body;
        const id = ObjectId(req.params.id)
        console.log(id);
        StudentCollection.updateOne({ _id: id }, { $set: { name: name, registration: registration, ID: ID, imageUrl: imageUrl } })
            .then(result => res.send(result.modifiedCount > 0));
    })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})