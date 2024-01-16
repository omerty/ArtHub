//Getting all the Requirements
const express = require('express');
const { MongoClient, ObjectId} = require('mongodb');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { type } = require('express/lib/response');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// MongoDB Connection
const uri = 'mongodb://localhost:27017';
const dbName = 'gallery';
const client = new MongoClient(uri,  { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'pug');
//app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
const database = client.db(dbName);

//Creating a application that will store the user data in the current session 
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

//creating an async Function that will conenct to the DataBase
async function connectDatabase() 
{
    await client.connect();
    console.log('Database initialized successfully!');  
}



// Clearing the database every time it is reinitialized for testing purposes
async function clearUsers() {
    const db = client.db(dbName);
    await db.collection('users').deleteMany({});
    console.log('Database cleared successfully!');
}


//Adding all the JS and Images and CSS Files to the current Path
app.get('/signUp.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'signUp.js'));
});

app.get('/specificImage.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'specificImage.js'));
});

app.get('/signIn.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'signIn.js'));
});

app.get('/currprofile.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'currprofile.js'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/profile.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.jpg'));
});

app.get('/likeImage.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'likeImage.jpg'));
});

app.get('/download.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/download.png'));
});

app.get('/notifications.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'notifications.js'));
});


// Function to insert each artist as a user with a hashed password
async function insertArtistsAsUsers() {
    // Assuming you have a list of artists
    const artists = await database.collection('paintings').distinct('Artist');
    
    try {
      for (const artist of artists) {  
        const originalPassword = 'password';
        const hashedPassword = await bcrypt.hash(originalPassword, 10);  

        // Create user object
        const userData = {
          username: artist,
          password: hashedPassword,
          accType: 'Artist', // You can set the account type accordingly
          followers: [],
          following: [],
          reviews: [],
          likes: [],
          notifications: []
        };  

        // Insert user into the database
        await database.collection('users').insertOne(userData);
        console.log(`User ${userData.username} added with hashed password: ${userData.password}`);
      }
    } catch (error) {
      console.error('Error inserting artists as users:', error);
    }
}

//Creating a function that will start the server
async function startServer() {

  //Ceonnecting to the database
    try {
        //await clearUsers();

        await connectDatabase();
        // Call the function to insert artists as users
        await insertArtistsAsUsers();

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

//Starting the server
startServer();



// Middleware to parse JSON data from requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory

//Greating a get request for the signIn Page
app.get('/signin', async(req, res) => {
    res.render('signIn.pug');
});


//Doing a handle requst for when the user presses on the follow  button and also creating a 
app.get('/following', async (req, res) => 
{
    if (req.session && req.session.user) {
        // Retrieve user information from the session
        const user = await database.collection('users').findOne({
            username: req.session.user.username,
            following: req.session.user.following,
            followers: req.session.user.followers,
            accType: req.session.user.accType,
        });

        //If the user exists then 
        if (user) {
            let username = user.username;
            let following = user.following;
            let accType = req.session.user.accType;

            //Then render the folling page
            res.render('following.pug', {username: username, following : following, accType:accType} )
        } else {
            //IF the user is not found the the user is not found 
            return res.status(404).json({ alert: 'User not found' });
        }
    } else {
        //If the user if not loggin in then relogging in to the singIn PUG
        res.render('/signIn.pug');
    }
});

//Making the followers handler
app.get('/followers', async (req, res) => 
{
    //Gettingon the information for the current User
    if (req.session && req.session.user) {
        // Retrieve user information from the session
        const user = await database.collection('users').findOne({
            username: req.session.user.username,
            following: req.session.user.following,
            followers: req.session.user.followers,
            accType: req.session.user.accType,
        });

        //Checking if the user exists
        if (user) {
            let username = user.username;
            let followers = user.followers;
            let accType = req.session.user.accType;

            //Redirecting it to the followers page
            res.render('followers.pug', {username: username, followers : followers, accType: accType} )
        } else {
            return res.status(404).json({ alert: 'User not found' });
        }
    } else {
        res.render('/signIn.pug');
    }
});

//Making the get request for the signUp Page
app.get('/signup', async (req, res) => {
    res.render('signUp.pug');
});

//Making the request for the home page
app.get('/', async(req, res) => {
    res.render('home.pug');
});

//Making the request for the addWorkShop Page
app.get('/addWorkshop', async(req, res) => {
    const accType = req.session.user.accType;
    res.render('addWorkshop.pug', { accType });
});

//Making the handler for the individual Artist
app.get('/indivArtist', async(req, res) => {
    //Getting the artist 
    const {Artist} = req.query;
    let accType = req.session.user.accType;
    try {
        //Getting all the Specific Image
        let allImages = await database.collection('paintings').find({ Artist: Artist }).toArray();
        //Rendering the images to the individual Artist PUG File 
        res.render('indivArtist.pug', { allImages, accType});
    } catch (error) {
        //Returning an Error 
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Making a get Handler for the currProfile 
app.get('/currProfile', async (req, res) => {
    try {
        // Check if req.session.user exists
        if (req.session && req.session.user) {
            // Retrieve user information from the session
            const user = await database.collection('users').findOne({
                username: req.session.user.username,
                following: req.session.user.following,
                followers: req.session.user.followers,
                accType: req.session.user.accType,
            });

            //Get the workshops 
            let workshops = await database.collection('workshops').find({Artist : user.username}).toArray();

            //If User exists 
            if (user) {
                let username = user.username;
                let following = user.following.length == 0 ? 0 : user.following.length;
                //user.following;
                let followers = user.followers.length == 0 ? 0 : user.followers.length;
                //user.followers;
                let accountType = user.accType;
            
                //Rendering the Page
                res.render('currProfile.pug', { username, following, followers, accountType, workshops});
            } else {
                 //Returning an Error
                return res.status(404).json({ alert: 'User not found' });
            }
        } else {
             //Returning an Error
            return res.render('signIn.pug');
        }
    } catch (error) {
        //Returning an Error
        return res.status(500).json({ error: ' HI Internal server error' });
    }
});

//Making a handle request for the artwook page
app.get('/artwork', async(req, res) => {
    //Getting the artwork from the database
    let images = await database.collection('paintings').find({}).toArray();
    const accType = req.session.user.accType;
    //Rendering the page
    res.render('artwork.pug', {images, accType});
});

//Creating a handler for the addImage Page
app.get('/AddImage', async(req, res) => {
    const accType = req.session.user.accType;
    //Rednering the add Image Page
    res.render('AddImage.pug',{accType});
});

//Rendering the indivWorkshop page
app.get('/indivWorkshop', async(req, res) =>
{
    //Getting the information from the query
    let{Artist, Name} = req.query;
    const accType = req.session.user.accType;

    //Rendering the PUG File passing the params 
    res.render('indivWorkshop.pug', {Name: Name, Artist: Artist, accType:accType});

})

//Creating a handle to check if the username exists 
app.get('/checkUsernameExists', async (req, res) => {
    //Getting the current Username 
    const usernameToCheck = req.query.username;

    try {
        //Getting the existing User
        const existingUser = await database.collection('users').findOne({ username: usernameToCheck });

        const exists = !!existingUser;

        res.json({ exists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Creating a handler to get user info
app.get('/getUserInfo', async (req, res) => {
    //Getting the user username
    const { username } = req.query;

    try {
        // Retrieve user information from the database based on the username
        const user = await database.collection('users').findOne({ username : username });

        if (!user) {
            return res.status(404).json({ alert: 'User not found' });
        }

        // Respond with the user information (excluding sensitive details)
        const userInfo = {
            username: user.username,
            followers: user.followers,
            following: user.following,
        };

        //Returning the userInfo
        res.json(userInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


//Creating a handler for the signUp Get request
app.post('/signUp', async (req, res) => {
    try {
        //Getting the username password and all information
        let { username, password, accType,followers, following } = req.body;

        //Hashing the password for encryption
        const hashedPassword = await bcrypt.hash(password, 10);

        //setting the password to the hashedpassword
        password = hashedPassword

        //Creating an object which will be inserted
        const insertData = {
            username: username,
            password: password,
            accType: accType,
            followers: followers,
            following: following,
            reviews : [],
            likes: [],
            notifications: []
        };

        //Inserting the data
        let result = await database.collection('users').insertOne(insertData);

        //Checking if the information was inserted
        if (result.insertedId) {
            console.log('Document inserted successfully');
            const documents = await database.collection('users').find({}).toArray();
            console.log(documents);
            res.json({ success: true, redirectTo: '/signIn' });
        } else {
            console.log('Document insertion failed');
            return res.status(500).json({ error: 'Internal server error' });
        }

    } catch (error) {
        //Returning the error
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint for handling user sign-in
app.post('/signIn', async (req, res) => {
    //Getting the user information
    const { username, password} = req.body;
        
    try {
        //Getting the current user information
        const user = await database.collection('users').findOne({username : username});

        console.log("\n\n\n\n\n\n", user);

        //Checking if user existed
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        console.log("\n\n\n\n\n\n", user);

        //Checking if the password matched
        const passwordMatch = await bcrypt.compare(password, user.password);

        //If the passwords dont match then throwing invalid username or password error
        if (!passwordMatch) {
            console.log("HERE");
            return res.status(401).json({ error: 'Invalid username or password' });
        } 
        
        //When the user signs in setting the current user information
        req.session.user = {
                username: user.username,
            followers: user.followers,
            following: user.following,
            accType: user.accType,
        };

        //Sending the user to the currProfile page
        res.json({ success: true, redirectTo: '/currProfile'});
    } catch (error) {
        //Unless throwin error
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Making a handler for specificImage
app.get('/specificImage', async (req, res) => {
    const { title, artist, category } = req.query;
    try {
        // You may retrieve the specific image from the database based on the provided parameters
        // For simplicity, I'm using the provided images array for demonstration
        const specificImage = await database.collection('paintings').findOne({Title : title, Artist : artist, Category : category});

        if (!specificImage) {
            return res.status(404).json({ error: 'Image not found' });
        }

        let workshops = database.collection('users').find({Artist: artist}).toArray();
        let accType =req.session.user.accType

        res.render('specificImage.pug', { image: specificImage, workshops: workshops, accType:accType });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/likeAndReview',async (req, res) => {
    const { title, review, artist } = req.body;

    try {
        if (req.session && req.session.user) {
           
        } else {
            return res.render('signIn.pug');
        }

        if (artist == req.session.user.username) {
            return res.status(404).json({ alert: 'Cannot Leave Review on own Post' });
        }

        // Assuming user is the current user's username
        const user = await database.collection('users').findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.username === artist) {
            return res.status(400).json({ alert: 'User not found' });
        }

        // Update the reviews array with the new review
        user.reviews.push(review);

        // Update the user in the database
        const result = await database.collection('users').updateOne(
            { username: req.session.user.username },
            { $set: { reviews: user.reviews } }
        );



        const painting = await database.collection('paintings').findOne({Title : title});

        if(!painting)
        {
            return res.status(404).json({ error: 'Painting not found' });
        }

        painting.Reviews.push(review);

        const paintingResult = await database.collection('paintings').updateOne(
            { Title: title},
            { $set: { Reviews: painting.Reviews } }
        );

        if (result.matchedCount && result.modifiedCount) {
            console.log(`Review added successfully for user: ${req.session.user.username}`);            
        } else {
            console.log('Review addition failed');
        }

        if (paintingResult.matchedCount && paintingResult.modifiedCount) {
            console.log(`Review added successfully for Painting: ${title}`);            
        } else {
            console.log('Review addition failed');
        }

        // Redirect back to the image details page
        res.redirect(`/artwork`);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/likePhoto',async (req, res) => {
    const { title, artist} = req.body;

    try {   

        if (req.session && req.session.user) {
        } else {
            return res.render('signIn.pug');
        }
        // Assuming user is the current user's username
        const user = await database.collection('users').findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }  

        if (user.username === artist) {
            return res.status(400).json({ alert: 'User not found' });
        }

        if(!user.likes.includes(title))
        {
            user.likes.push(title);

            // Update the user in the database
            const result = await database.collection('users').updateOne(
                { username: req.session.user.username },
                { $set: { likes: user.likes } }
            );
            const painting = await database.collection('paintings').findOne({Title : title});

            if(!painting)
            {
                return res.status(404).json({ message: 'Painting not found' });
            }
            
                painting.Likes.push(user.username);
    
            const paintingResult = await database.collection('paintings').updateOne(
                { Title: title},
                { $set: { Likes: painting.Likes } }
            );
    
            if (result.matchedCount && result.modifiedCount) {
                console.log(`Like added successfully for user: ${req.session.user.username}`);     
                res.status(200).json({ success: true, message: 'Image Liked' });
            } else {
                console.log('Like addition failed');
            }
    
            if (paintingResult.matchedCount && paintingResult.modifiedCount) {
                console.log(`Like added successfully for Painting: ${title}`);            
            } else {
                console.log('Like addition failed');
            }
        }else
        {
            user.likes = user.likes.filter(item => item != title);

            // Update the user in the database
            const result = await database.collection('users').updateOne(
                { username: req.session.user.username },
                { $set: { likes: user.likes } }
            );

            const painting = await database.collection('paintings').findOne({Title : title});

            if(!painting)
            {
                return res.status(404).json({ error: 'Painting not found' });
            }
    
            painting.Likes = painting.Likes.filter(item => item != user.username);
    
            const paintingResult = await database.collection('paintings').updateOne(
                { Title: title},
                { $set: { Likes: painting.Likes } }
            );
    
            if (result.matchedCount && result.modifiedCount) {
                res.status(200).json({ success: true, message: 'Like Removed' });           
            } else {
                console.log('Like Removing failed');
            }
    
            if (paintingResult.matchedCount && paintingResult.modifiedCount) {
                console.log(`Like Removed successfully for Painting: ${title}`);            
            } else {
                console.log('Like Removing failed');
            }
        }
        // Redirect back to the image details page
        //res.redirect(`/artwork`);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/clearFilters', (req, res) => {
    res.redirect('/artWork');
  });

app.post('/searchSpecific',async (req, res) => {
    const searchType = req.body.dropdown;
    const data = req.body.searchInput;
    try {

        if(searchType == "Artist")
        {
            console.log("HERE1");
            const images = await database.collection('paintings').find({Artist : data}).toArray();;
            return res.render('artwork.pug', {images});

        }else if(searchType == "Title")
        {
            const painting = await database.collection('paintings').find({Title : data}).toArray();;
            return res.render('artwork.pug', {painting});
        }else if(searchType == "Category")
        {
            const painting = await database.collection('paintings').find({Category : data}).toArray();;
            return res.render('artwork.pug', {painting});
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/AddImage', async (req, res) =>
{
    const { title, artist, year, category, medium, description, poster } = req.body;

    try {
        if (req.session && req.session.user) {
           
        } else {
            return res.render('signIn.pug');
        }

        // Assuming user is the current user's username
        const user = await database.collection('users').findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let data = {
            Title: title,
            Artist: artist,
            Year: year,
            Category: category,
            Medium:  medium,
            Description: description,
            Poster: poster,
            Reviews: [],
            Likes: [],
        }
        //Add the image to the database 
        let result = await database.collection('paintings').insertOne(data);

        if (result.insertedId) {
            //Adding a notfication for the followers 
            const followers = await database.collection('users').find({ following: artist }).toArray();

            for (const follower of followers) {
                const notification = {
                   type: 'Art Work Added',
                   artist: artist,
                   artworkTitle: title,
                   timestamp: new Date(),
                };
             
                // Update the follower's notifications array
                await database.collection('users').updateOne(
                   { username: follower.username },
                   { $push: { notifications: notification } }
                );
             }


            res.redirect('/currProfile');

        } else {

            console.log('Painting insertion failed');
            return res.status(500).json({ error: 'Internal server error' });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

//Creating a handler for when the users account type needs to be changed
app.post('/changeType', async (req, res) =>
{
    //Getting the new type
    const {type} = req.body;
    try {
        //Checkinf the user exists
        if (req.session && req.session.user) {
           
        } else {
            return res.render('signIn.pug');

        }

        // Assuming user is the current user's username
        const user = await database.collection('users').findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //Setting the prev account type
        const prevType = user.accType;

        //If the prev accoutn type is the same as the current account type do nothing
        if(prevType == type)
        {
            
        
        
        }else if(prevType == 'Patron' && type == 'Artist')//If prev account type is patron and new account type is Atrist change acc type and redirect to add artpage
        {
            let result = await database.collection('users').updateOne(
                { username: user.username },
                { $set: { accType: type } }
            );

            if (result.modifiedCount > 0) {
                req.session.user.accType = type;
                console.log(req.session.user.accType);
                console.log('Type Updated successfully');
                return res.json({ success: true, redirectTo: '/AddImage' });
            } else {
                console.log('Type Change update failed');
                return res.status(500).json({ error: 'Internal server error' });
            }

        }else if(prevType == 'Artist' && type == 'Patron') //If new acc type is Patron then remove all painting and workshops and from followers
        {
            let result = await database.collection('users').updateOne(
                { username: user.username },
                { $set: { accType: type } }
            );

            await database.collection('paintings').deleteMany({ Artist: req.session.user.username });

            // Remove the artist's followers
            const followers = user.followers || [];
            for (const follower of followers) {
                await database.collection('users').updateOne(
                    { username: follower },
                    { $pull: { following: req.session.user.username } }
                );
            }
            //Removing their name from any user who follows them
            await database.collection('users').updateMany(
                { following: req.session.user.username },
                { $pull: { following: req.session.user.username } }
            );

            if (result.modifiedCount > 0) {
                req.session.user.accType = type;
                console.log(req.session.user.accType);
                console.log('Type Updated successfully');
                return res.json({ success: true, redirectTo: '/currProfile' });
            } else {
                console.log('Type Change update failed');
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/addWorkshop', async (req, res) => 
{
    const {Title} = req.body;
    console.log(Title);

    try {
        if (req.session && req.session.user) {
           
        } else {
            return res.render('signIn.pug');
        }

        data = {
            Artist : req.session.user.username,
            Name: Title,
        }

        // Assuming user is the current user's username
        const workshops = await database.collection('workshops').insertOne(data);
        
        //Checking if workshop was inserted
        if (workshops.insertedId) {
            //Getting the followers
            const followers = await database.collection('users').find({ following: req.session.user.username }).toArray();

            //For all the followers of the artist then creating an object and then inserting the notification for those followers
            for (const follower of followers) {
                const notification = {
                   type: 'Art Work Added',
                   artist: req.session.user.username,
                   artworkTitle: Title,
                   timestamp: new Date(),
                };
             
                // Update the follower's notifications array
                await database.collection('users').updateOne(
                   { username: follower.username },
                   { $push: { notifications: notification } }
                );
             }

            //Redirecting it to the workshop
            res.redirect('/addWorkshop');
        } else {
            //Workshop insertion failed
            console.log('Workshop insertion failed');
        }

    } catch (error) {
        //Returning an erro
        return res.status(500).json({ error: 'Internal server error' });
    }
})


//Creating a handler for when we want to remove a workshop
app.post('/removeWorkshop', async(req, res) =>
{
    //Getting the user information
    const {Artist, Name} = req.body;
    try {
        //if there is a current session
        if (req.session && req.session.user) {
           
        } else {
            return res.render('signIn.pug');
        }

        // Assuming user is the current user's username
        const workshops = await database.collection('workshops').deleteMany({Artist: Artist, Name: Name});
        
        //If the workshop was deleted 
        if (workshops.deletedCount > 0) {
            //Redirecting it to the currProfile page
            res.redirect('/currProfile');
        } else {
            //Printing an Error
            console.log('Workshop Removing failed');
        }

    } catch (error) {
        //Printing an Error
        return res.status(500).json({ error: 'Internal server error' });
    }
})

//Creating a handler for the notifications 
app.get('/notifications', async (req, res) => {
    try {
        //Checking if the session existed
       if (req.session && req.session.user) {
        //Getting the user based on the current User session
          const user = await database.collection('users').findOne({ username: req.session.user.username });
 
          //If the user existed
          if (user) {
            //If settings notifications is user.notifications or an empty array
             const notifications = user.notifications || [];
             let accType = req.session.user.accType
             //rendering the user to the notification page
             res.render('notifications.pug', { notifications, accType });
          } else {
            //If user not found returning an error
             return res.status(404).json({ error: 'User not found' });
          }
       } else {
            //Returning an error
            return res.render('signIn.pug');
       }
    } catch (error) {
        //Returning an error
       return res.status(500).json({ error: 'Internal server error' });
    }
 });


 //Creating a handler for the followArtist
 app.post('/FollowArtist', async (req, res) => {
    try {
        //If the session existed 
        if (req.session && req.session.user) {
            //Getting the user information
            const { Artist } = req.body;

            // Assuming user is the current user's username
            const user = await database.collection('users').findOne({ username: req.session.user.username });
            const artist = await database.collection('paintings').findOne({ Artist: Artist });

            //Checking if the user or artist existed
            if (!user || !artist) {
                return res.status(404).json({ error: 'User or artist not found' });
            }

            // Check if the user is trying to follow themselves
            if (req.session.user.username === artist) {
                return res.status(400).json({ error: 'Cannot follow yourself' });
            }

            // Check if the user is already following the artist
            if (!user.following.includes(Artist)) {
                // Update the user's following array
                await database.collection('users').updateOne(
                    { username: req.session.user.username },
                    { $push: { following: Artist } }
                );

                // Update the artist's followers array
                await database.collection('users').updateOne(
                    { username: Artist },
                    { $push: { followers: req.session.user.username } }
                );

                return res.redirect('/currProfile'); 

            } else {
                await database.collection('users').updateOne(
                    { username: req.session.user.username },
                    { $pull: { following: Artist } }
                );
            
                // Remove the user from the artist's followers array
                await database.collection('users').updateOne(
                    { username: Artist },
                    { $pull: { followers: req.session.user.username } }
                );

                console.log("Succesfully Unfollowing");  
            }
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/signOut', (req, res) => {
    // Clear the user's session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to sign out' });
        }
        // Redirect the user to the sign-in page or any other appropriate page
        res.redirect('/signIn');
    });
});
