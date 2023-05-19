const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0gxrq1n.mongodb.net/?retryWrites=true&w=majority`;

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

const toyCollection = client.db('toy').collection('toys');
const categoryCollection = client.db('toy').collection('category');



app.get('/categories',async(req,res)=>{
    const data = categoryCollection.find();
    const result = await data.toArray();
    res.send(result);
})

app.get('/toys',async(req,res)=>{
  const data = toyCollection.find().limit(20);
  const result = await data.toArray();
  res.send(result);
})

app.get('/toys/:category',async(req,res)=>{
  const {category} = req.params;
  const data =toyCollection.find({toy_category: category});
  const result = await data.toArray();
    res.send(result);

  console.log(result);

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



















app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})