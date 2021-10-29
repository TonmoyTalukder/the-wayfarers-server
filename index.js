const express = require ('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

/* ---------------------------------------------------------- */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@traversymedia.a77qb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

/* ---------------------------------------------------------- */

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* ---------------------------------------------------------- */

async function run() {
    try {
      await client.connect();
      console.log('Connected to Database...');

      const database = client.db("theWayfarers");
      const tourDestinationCollection = database.collection("tourDestinations");

    //   GET Tour Destinations API
    app.get('/tour-destinations', async(req, res) =>{
        const cursor = tourDestinationCollection.find({});
        const tourDestinations = await cursor.toArray();
        res.send(tourDestinations);
    });

    } finally {
    //   await client.close();
    };
  };

  run().catch(console.dir);

/* ---------------------------------------------------------- */

app.get('/', (req, res) =>{
    res.send('Hello Wayfarers!');
})

app.listen(port, () => {
    console.log(`Listening from The Wayfarers Server at http://localhost:${port}...`);
})