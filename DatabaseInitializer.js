const { MongoClient } = require('mongodb');
const fs = require('fs');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'gallery';

// Function to read JSON data from a file
async function readJSON(fileName) {
  const fileData = fs.readFileSync(fileName);
  return JSON.parse(fileData);
}

// Function to clear the 'paintings' collection in the database
async function clearDatabase() {
  const db = client.db(dbName);
  await db.collection('paintings').deleteMany({});
  console.log('Database cleared successfully!');
}

// Function to initialize the database with data from a JSON file
async function initializeDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Clear the 'paintings' collection in the database
    clearDatabase();

    // Select the 'gallery' database
    const db = client.db(dbName);

    // Read data from the 'gallery.json' file
    const galleryData = await readJSON('gallery.json');

    // Insert data into the 'paintings' collection
    for (const painting of galleryData) {
      let dataVal = {
        Title: painting.Title,
        Artist: painting.Artist,
        Year: painting.Year,
        Category: painting.Category,
        Medium: painting.Medium,
        Description: painting.Description,
        Poster: painting.Poster,
        Reviews: [],
        Likes: [],
      };
      console.log("Inserting Data -: ", dataVal);
      // Insert a document into the 'paintings' collection
      await db.collection('paintings').insertOne(dataVal);
    }

    console.log('Data inserted successfully!');
  } catch (error) {
    console.log(`Error initializing database: ${error.message}`);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

// Call the function to initialize the database
initializeDatabase();
