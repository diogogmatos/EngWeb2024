const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5"
);

client.connect();
const db = client.db("compositores");
const collection = db.collection("compositores");

app.use(express.json());

app.get("/compositores", async (req, res) => {
  try {
    let r = "";

    switch (Object.keys(req.query)[0]) {
      case "id":
        r = await collection.find({ _id: req.query.id }).toArray();
        break;
      case "_sort":
        r = await collection
          .find()
          .sort({ [req.query._sort]: 1 })
          .toArray();
        break;
      default:
        r = await collection.find().toArray();
        break;
    }

    res.json(r);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/compositores", async (req, res) => {
  try {
    await collection.insertOne(req.body);
    res.json(req.body);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/compositores/:id", async (req, res) => {
  try {
    await collection.deleteOne({ _id: req.params.id });
    res.json({});
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch("/compositores/:id", async (req, res) => {
  try {
    await collection.updateOne({ _id: req.params.id }, { $set: req.body });
    res.json(req.body);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
