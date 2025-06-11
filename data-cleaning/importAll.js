const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");

const uri = "mongodb://localhost:27017";
const dbName = "EuropeanSoccerDB";

const collectionsAndFiles = [
  { collection: "matches", file: "matches_clean.json" },
  { collection: "teams", file: "teams_clean.json" },
  { collection: "leagues", file: "leagues_clean.json" },
  { collection: "countries", file: "countries_clean.json" },
];

async function importAll() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connesso a MongoDB");

    const db = client.db(dbName);

    for (const { collection, file } of collectionsAndFiles) {
      const filePath = path.join(__dirname, "result", file);

      // Leggi il file JSON
      const jsonData = await fs.readFile(filePath, "utf8");
      const docs = JSON.parse(jsonData);

      if (!Array.isArray(docs)) {
        console.error(
          `❌ Errore: Il file ${file} non contiene un array di documenti`
        );
        continue;
      }

      const coll = db.collection(collection);

      // (Opzionale) Pulisce la collection prima di inserire nuovi dati
      await coll.deleteMany({});

      // Inserisce i documenti
      const result = await coll.insertMany(docs);
      console.log(
        `✅ Inseriti ${result.insertedCount} documenti nella collection ${collection}`
      );
    }
  } catch (err) {
    console.error("❌ Errore durante l'import:", err);
  } finally {
    await client.close();
    console.log("Connessione chiusa");
  }
}

importAll();
