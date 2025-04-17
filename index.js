require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjpks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
       
        const db = client.db("job_portal_server");
        const JobsCollection = db.collection("jobs");
        const ApplicationsCollection = db.collection("applications");

        app.get("/jobs", async (req, res) => {
            const result = await JobsCollection.find().toArray();
            res.send(result);
        });

        app.get("/jobs/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await JobsCollection.findOne(query);
            res.send(result);
        });

        app.post("/jobs", async (req, res) => {
            const data = req.body;
            const result = await JobsCollection.insertOne(data);
            res.send(result);
        });

        app.post("/applications", async (req, res) => {
            const application = req.body;
            const result = await ApplicationsCollection.insertOne(application);
            res.send(result);
        });

        // Get all job applications
        app.get("/applications", async (req, res) => {
            const result = await ApplicationsCollection.find().toArray();
            res.send(result);
        });

        // Delete  application 
        app.delete("/applications/:id", async (req, res) => {
            const id = req.params.id;
            const result = await ApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
