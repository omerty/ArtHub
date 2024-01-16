# ArtHub - Collaborative Platform for Artists and Art Enthusiasts

Welcome to ArtHub, a vibrant community where artists and art enthusiasts come together to explore, showcase, and connect. This collaborative platform offers a range of features to enhance your artistic journey.

## Features

- **Browse Artwork:** Explore a diverse collection of artwork from talented artists.
- **Showcase Your Art:** Create your profile, upload and showcase your artwork to the community.
- **Connect with Artists:** Follow your favorite artists, receive notifications, and build a network within the creative community.
- **Workshops:** Discover and participate in workshops organized by fellow artists.
- **User Profiles:** Customize your profile and share your artistic journey with others.

## File Structure

- **Public**
  - **Views Directory**
    - `Home.pug`: General home page displaying a welcome message.
    - `signIn.pug`: Page for user login.
    - `signUp.pug`: Page for user registration.
    - `specifiedImage.pug`: Page displaying a clicked-on image.
    - `notifications.pug`: Page for displaying notifications.
    - `indivWorkshop.pug`: Page displaying individual workshops.
    - `indivArtist.pug`: Page displaying individual artists.
    - `following.pug`: Page displaying users being followed.
    - `followers.pug`: Page displaying users' followers.
    - `currProfile.pug`: Page displaying user profiles.
    - `artwork.pug`: Page displaying all artwork.
    - `addWorkshop.pug`: Page for adding a workshop.
    - `addImage.pug`: Page for adding an image.
- `databaseInitializer.js`: Initializes the database and populates it with existing information from a JSON file.
- `server.js`: Sets up the server, handles database interactions, and manages route handlers.
- `currProfile.js`: Manages user profile type changes using event listeners and fetch requests.
- `following.js`: *Possibly redundant or to be removed.*
- `notifications.js`: Fetches notifications from the server and updates the display.
- `signIn.js`: Handles user validation for sign-in and makes POST requests to the server.
- `signUp.js`: Manages user validation for sign-up and makes POST requests to the server.
- `specificImage.js`: Manages liking and unliking images with fetch requests to the server.

## Database and Server Setup

1. **Install MongoDB**
2. **Start MongoDB**
    - Run: `mongod`
3. **Install Node.js**
4. **Install Dependencies**
    - Run:
        - `npm install express`
        - `npm install pug`
5. **Initialize the Database**
    - Run: `node databaseInitializer.js`
6. **Run the Server**
    - Run: `node server.js`
7. **Access the Platform**
    - Open your local browser and go to: `localhost:3000`

## Code Quality Analysis

- **Readability:**
    - Code uses clear, meaningful variable and function names for maintainability.

- **RESTful Design Principles:**
    - Endpoints follow a logical structure in a RESTful manner.
    - Appropriate use of POST and GET methods.
    - Proper use of HTTP status codes and effective error handling.

- **Data Transfer:**
    - While some validation is present, strengthening input validation is recommended for enhanced security.

## Known Errors

- When pressing the Follow button, users might get stuck on the page. Investigate possible server-side issues.

## Suggestions for Improvement

1. Strengthen input validation by checking for edge cases.
2. Clarify the user requirement when switching from Patron to User profile types.
3. Evaluate the dual-purpose use of buttons for improved user experience.

Feel free to contribute to ArtHub and make it an even more vibrant and supportive community for artists worldwide!
