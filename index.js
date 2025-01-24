const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

//Middleware
app.use(cors())
app.use(express.json())


//MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9e8y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const serviceCollection = client.db("carDoctor").collection("services");
    const bookingCollection = client.db("carDoctor").collection("bookings");


    app.get("/services", async(req, res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })


    app.get("/services/:id", async(req, res)=>{
        const result = await serviceCollection.findOne({_id: new ObjectId(req.params.id)});
        res.send(result)
    })


    //Bookings
    app.post("/bookings", async(req, res)=>{
        const doc = req.body;
        const result = await bookingCollection.insertOne(doc)
        res.send(result)
    })



    app.get("/bookings", async(req, res)=>{
        let query = {}
        if(req.query?.email){
            query = { email : req.query.email}
        }
        const cursor = bookingCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })



    app.delete("/bookings/:id", async(req, res)=>{
        const id = req.params.id;
        let query = { _id : new ObjectId(id)}
        const result = await bookingCollection.deleteOne(query);
        res.send(result)
    })

    app.patch("/bookings/:id", async(req, res)=>{
        const id = req.params.id;
        let filter = { _id : new ObjectId(id)}
        let doc = req.body;

        const updatedDoc = {
            $set:{
                status: doc.status
            }
        }

        const result = await bookingCollection.updateOne(filter, updatedDoc);
        res.send(result)
    })















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res)=>{
    res.send("Car Doctor is Running")
})


app.listen(port, ()=>{
    console.log(`Car Doctor Server is Running on port ${port}`)
})