document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    //Creating an event listner for when the button is pressed
    form.addEventListener('submit', function(event) {
        //Preventing default value
        event.preventDefault();
        //Calling the signIn Function
        signIn();
    });

    async function signIn() {
        //Getting the username and password from user
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            //Creating an UserData Object
            let userData = {    
                username: username,
                password: password,
            };
            
            //Making a fetch request for the signIn in the server by calling the function
            makesignIn('/signIn', userData)
                .then(responseData => {
                    // Handle successful response, if needed
                    window.location.href = responseData.redirectTo;
                })
                .catch(error => {
                    alert("Incorrect Password Or Username");
                });
        } catch (error) {
            console.error("Sign-In Failed:", error);
        }
    }

    //Function for the makeSignIn 
    async function makesignIn(url, data) {
        //Making the POST Request to the server
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Could Not Sign In');
            }

            // Parse the JSON response
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new Error(`Could Not Sign In`);
        }
    }
});
