A collaborative platform for artists and art enthusiasts. Browse and showcase artwork, connect with artists, and explore a vibrant creative community. Features include artwork views, user profiles, and more.

Files in Program: 

-	Public 
o	Views Directory
	Home.pug -: General Home page displaying welcome message
	signIn.pug -: Page where user can enter username and password and try signing in
	signUp.pug -: page where the user can create their account by entering desired username and password
	specifiedImage.pug -: Page where a clicked on image is displayed
	notifications.pug -: Page where all the notifications are displayed
	indivWorkshop.pug -: Page where the individual workshops are displayed
	indivArtist.pug -: Page where the individual artists are displayed
	following.pug -: Page where are the users followers are displayed
	followers.pug -: page where are the users followers are displayed
	currProfile.pug -: Page where the users profiles are displayed
	artwork.pug -: Page where all the artwork is displayed
	addWorkshop.pug -: Page where the user can add a workshop 
	addImage.pug -: Page where the user can add an Image

-	databaseInitializer.js -: Initializes the Database and adds all the current information in the JSON File into the database in a constant schema

-	server.js -: Contains the important information such as setting up the server, populating the database and all the handler for changing and updating the information in the database

-	currProfile.js -: Contains code for when the user wants to change their user type, will use an EventListner to send a Fetch request for the correct handler in the server.js file


-	following.js -: MIGHT NEED TO REMOVE

-	notifications.js -: contains a fetch response to the server and then updated all the notifications onto the screen 

-	signIn.js -: Contains all the user Validation for the user sign in and also makes a POST Request to the server, and if user information is valid then it allows the user to sign in, otherwise it displays an alert. 

-	signUp.js -: Contains all the user Validation for the user sign Up and also makes a POST to the request to the server and if the user information is valid then it posts the information to the users collection in the database 

-	specificImage.js Contains an event Listener for whenever the user likes the photo it will do a fetch request to the server and it will either like the photo or if photo already liked then it will remove the like. 



Database and Server Setup

1.	Install MongoDB 
2.	Start MongoDB 
a.	Run the Following Command -: mongod 

3.	Install Node JS
4.	Install all the dependencies 
a.	Npm install Express
b.	Npm install PUG 

5.	Initialize the Database using the databaseInitializer.js File 
a.	Node databaseInitializer.js

6.	Run The server
a.	Node server.js

7.	In Your local browser search up localhost:3000



Code Quality Analysis 

-	 Readability: I believe The code is clear, with meaningful variable and function names. This helps in keeping the code maintainable.

-	RESTful Design Principles:

o	Endpoints: The endpoints follow a logical structure 	in a RESTful manner.

o	The use of POST and GET methods for corresponding actions is in line with RESTful principles.

o	Proper Status Codes: HTTP status codes, like 200 for success and 404 for not found, are appropriately used.

o	Error Handling:
	Try-Catch Blocks: The try-catch blocks are effectively used for error handling, providing clear error messages.

o	Use of Asynchronous Operations:
	Async/Await: The code uses async/await for asynchronous operations, ensuring efficient handling of database queries without blocking.

-	Data Transfer:
o	Data Validation:** While some validation is present, strengthening validation and sanitization for user inputs would enhance security.

-	Suggestions for Improvement:
o	Input Validation -: Strengthen input validation  by checking for edge cases
o	When switching from Patron to User, reinforce that the user is mandated to make a piece of art work
o	Remove the use of buttons for two different purposes 


Known Errors
-	When the Follow Button is Pressed, the user successfully follows the Artist in the back end but for some reason the user gets stuck on that page. Most likely an issue related to the server-end but was unable to find it. 
![image](https://github.com/omerty/ArtHub/assets/37318437/11d9f46e-e61c-4cea-8692-d184aca1dc7a)
