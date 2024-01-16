document.addEventListener('DOMContentLoaded', async function () {
    // Get a reference to the dropdown element
    const myDropDown = document.getElementById('dropdown');

    // Add an event listener for the 'change' event on the dropdown
    myDropDown.addEventListener('change', async function () {
        // Get the selected value from the dropdown
        const selectedValue = myDropDown.value;

        // Ask for confirmation before proceeding
        if (confirm('Are you sure you want to save this thing into the database?')) {
            try {
                // Use the Fetch API to make a POST request
                const response = await fetch('/changeType', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Send the selected value in the request body as JSON
                    body: JSON.stringify({ type: selectedValue })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse the JSON response
                const responseData = await response.json();

                // Check if the operation was successful
                if (responseData.success) {
                    // Redirect to the specified page
                    window.location.href = responseData.redirectTo;
                }
            } catch (error) {
                // Handle error
                throw new Error(`Failed to make changeType request: ${error.message}`);
            }
        } else {
            // Do Nothing if the user cancels the confirmation
        }
    });
});
