const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0gxrq1n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toyCollection = client.db("toy").collection("toys");
        const categoryCollection = client.db("toy").collection("category");

        app.get("/categories", async (req, res) => {
            const data = categoryCollection.find();
            const result = await data.toArray();
            res.send(result);
        });

        app.get("/toys", async (req, res) => {
            const data = toyCollection.find().limit(20);
            const result = await data.toArray();
            res.send(result);
        });

       

        app.get("/my-toy/update-toy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const data = await toyCollection.findOne(query);
            const result = data;
            res.send(result);
        });

        app.post("/add-toy", async (req, res) => {
            const newToy = req.body;
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        });

        app.get("/my-toy", async (req, res) => {
            let query = {};
            if (req.query?.seller_email) {
                query = { seller_email: req.query.seller_email };
            }
            const data = toyCollection.find(query);
            const result = await data.toArray();
            res.send(result);
        });

        app.put("/my-toy/update/:id", async (req, res) => {
            const id = req.params.id;
            const getToy = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedData = {
                $set: {
                    seller_name: getToy.seller_name,
                    seller_email: getToy.seller_email,
                    toy_name: getToy.toy_name,
                    toy_img: getToy.toy_img,
                    toy_category: getToy.toy_category,
                    toy_price: getToy.toy_price,
                    toy_rating: getToy.toy_rating,
                    toy_quantity: getToy.toy_quantity,
                    toy_description: getToy.toy_description,
                },
            };
            const options = { upsert: true };
            const result = await toyCollection.updateOne(
                filter,
                updatedData,
                options
            );
            res.send(result);
        });

        app.delete("/delete-toy/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
