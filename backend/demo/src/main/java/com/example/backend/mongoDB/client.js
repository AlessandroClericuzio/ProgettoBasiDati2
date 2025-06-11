const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // Cambia se usi un altro URI o MongoDB Atlas
const client = new MongoClient(uri);

async function connect() {
  if (!client.isConnected?.()) {
    await client.connect();
    console.log("✅ Connesso a MongoDB!");
  }
  return client;
}

module.exports = { client, connect };
