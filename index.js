require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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

        const JobsCollections = client.db("job_portal_server").collection("jobs");

        app.get("/jobs", async (req, res) => {
            const result = await JobsCollections.find().toArray()
            res.send(result)
        })

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
run();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})