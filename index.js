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
      const bookingCollection = database.collection('booking');


    //   GET Tour Destinations API
    app.get('/tour-destinations', async(req, res) =>{
        const cursor = tourDestinationCollection.find({});
        const tourDestinations = await cursor.toArray();
        res.send(tourDestinations);
    });

    //    GET Single Travel Description
    app.get('/tour-destinations/:id', async(req, res) =>{
      const id = req.params.id;
      console.log('Getting the service id: ', id)
      const query = {_id: ObjectId(id)};
      const service = await tourDestinationCollection.findOne(query);
      console.log(service);
      res.json(service);
    })

    app.get('/delete-travel/:id', async(req, res) =>{
      const idD = req.params.id;
      console.log('Getting the service id: ', idD)
      const queryD = {_id: ObjectId(idD)};
      const serviceD = await tourDestinationCollection.findOne(queryD);
      console.log(serviceD);
      res.json(serviceD);
    })

    // GET User Booking
    app.get('/booking/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const data = await bookingCollection.findOne(query);
    res.send(data);
    })
    app.get('/booking', async (req, res) => {
        const cursor=bookingCollection.find({});
        const bookings=await cursor.toArray();
        res.json(bookings)
    })

    // post

    app.post('/booking', async (req, res) => {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.json(result);
        res.send(result);
    })

    app.post('/tour-destinations', async (req, res) => {
      const newTourDestination = req.body;
      const result = await tourDestinationCollection.insertOne(newTourDestination);
      console.log('got new user', req.body);
      console.log('added user', result);
      res.json(result);
  });


    //UPDATE API
    app.put('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const updatedbooking = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              status:updatedbooking.status
          },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc, options)
      console.log(result)
      res.json(result)
    })

    // DELETE API
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      console.log(query);
      const result = await bookingCollection.deleteOne(query);

      console.log('deleting user with id ', result);

      res.json(result);
    })

    app.delete('/managebookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      console.log(query);
      const result = await bookingCollection.deleteOne(query);

      console.log('deleting booking with id ', result);

      res.json(result);
    })

    app.delete('/managebookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      console.log(query);
      const result = await tourDestinationCollection.deleteOne(query);

      console.log('deleting destination with id ', result);

      res.json(result);
    })

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