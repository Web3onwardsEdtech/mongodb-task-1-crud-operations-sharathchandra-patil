const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    const database = client.db('movieDB'); 
    const collection = database.collection('movies'); 

    
    const newMovies = [
      {
        title: "The Matrix",
        release_date: "1999-03-31",
        genre: ["Action", "Sci-Fi"],
        vote_average: 8.7,
      },
      {
        title: "Inception",
        release_date: "2010-07-16",
        genre: ["Action", "Sci-Fi"],
        vote_average: 8.8,
      },
      {
        title: "Interstellar",
        release_date: "2014-11-07",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        vote_average: 8.6,
      }
    ];

    await insertMovies(collection, newMovies);
    await deleteMovie(collection, "Army of the Dead");
    await updateMovie(collection, "Eva");

    await getMovies(collection);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

async function insertMovies(collection, movies) {
  const insertResult = await collection.insertMany(movies);
  console.log(`${insertResult.insertedCount} new movie(s) inserted`);
}

async function deleteMovie(collection, movieTitle) {
  const filter = { title: movieTitle }; 
  const result = await collection.deleteOne(filter);
  console.log(`${result.deletedCount} document(s) deleted for the title "${movieTitle}"`);
}

async function updateMovie(collection, movieTitle) {
  const filter = { title: movieTitle }; 
  const updateDoc = { $set: { vote_average: 9.5 } }; 
  const result = await collection.updateOne(filter, updateDoc);
  console.log(`${result.modifiedCount} document(s) updated for the title "${movieTitle}"`);
}

async function getMovies(collection) {
  const movies = await collection.find({}).toArray();
  console.log("Movies in the collection:", movies);
}

run().catch(console.dir);