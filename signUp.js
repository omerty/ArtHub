document.addEventListener('DOMContentLoaded', function () {
    // Select the sign-up form and add a submit event listener
    const signUpForm = document.querySelector('form[action="/signUp"]');
    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Call the validateForm function when the form is submitted
        validateForm();
    });

    // Validate form input values
    async function validateForm() {
        // Get form input values
        const fullName = document.getElementById('fullName').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        // Reset any previous error messages
        resetErrors();

        // Check if the username already exists
        const isUsernameExists = await checkUsernameExists(fullName);
        if (isUsernameExists) {
            displayError('Username already exists. Please choose a different one.');
            return;
        }

        // Check if the full name is valid
        if (!isValidFullName(fullName)) {
            displayError('Invalid UserName');
        }

        // Check if passwords match
        if (password !== passwordConfirm) {
            displayError("Passwords don't Match");
        }

        // Check if the password meets length requirements
        if (!isValidPasswordLength(password)) {
            displayError('Make Password Longer');
        }

        // Check if the password contains at least one lowercase character
        if (!isValidPasswordLowerCase(password)) {
            displayError('Password Must Contain at Least One Lowercase');
        }

        // Call makeSignUp function if the form is valid
        if (isFormValid(fullName, password, passwordConfirm)) {
            const signUpData = {
                username: fullName,
                password: password,
                accType: "Patron",
                followers: [],
                following: [],
                reviews: []
            };

            // Make sign-up request
            makeSignUp('/signUp', signUpData)
                .then(responseData => {
                    // Handle successful response, if needed
                    window.location.href = responseData.redirectTo;
                })
                .catch(error => {
                    // Handle error
                    alert(error.message);
                });
        }
    }

    // Check if the form is valid
    function isFormValid(fullName, password, passwordConfirm) {
        return (
            isValidFullName(fullName) &&
            password === passwordConfirm &&
            isValidPasswordLength(password) &&
            isValidPasswordLowerCase(password)
        );
    }

    // Validate full name
    function isValidFullName(fullName) {
        // Implement your validation logic for full name
        // Example: Check if there are one or more letters followed by a space, followed by at least one more letter
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(fullName);
    }

    // Validate password length
    function isValidPasswordLength(password) {
        // Implement your validation logic for password length
        // Example: Check if the password has 10 to 20 characters
        return password.length >= 10 && password.length <= 20;
    }

    // Validate at least one lowercase character in the password
    function isValidPasswordLowerCase(password) {
        // Implement your validation logic for at least one lowercase character
        // Example: Use a regular expression
        const regex = /[a-z]/;
        return regex.test(password);
    }

    // Reset error messages
    function resetErrors() {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.textContent = '';
    }

    // Display error message
    function displayError(errorMessage) {
        const errorContainer = document.getElementById('errorContainer');
        const errorItem = document.createElement('p');
        errorItem.textContent = errorMessage;
        errorContainer.appendChild(errorItem);
    }

    // Make sign-up request
    async function makeSignUp(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new Error(`Failed to make sign-up request: ${error.message}`);
        }
    }

    // Check if username exists
    async function checkUsernameExists(username) {
        try {
            const response = await fetch(`/checkUsernameExists?username=${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.exists; // Assumes the server responds with a JSON object containing a boolean property 'exists'
        } catch (error) {
            throw new Error(`Failed to check if the username exists: ${error.message}`);
        }
    }
});
