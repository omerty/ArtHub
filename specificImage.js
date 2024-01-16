document.addEventListener('DOMContentLoaded', async function () {
    // Add event listener to the form
    const likeAndReviewLink = document.getElementById('likeAndReview');

    // Get the image title from the data attribute
    const imgTitleElement = document.getElementById('imageTitle');
    const imgTitle = imgTitleElement.getAttribute('data-title');
    const artist = document.getElementById('Artist');
    const artistName = artist.getAttribute('data-title');
    // Add a click event listener
    likeAndReviewLink.addEventListener('click', async function (event) {
        // Prevent the default behavior of the anchor tag (navigating to a new page)
        event.preventDefault();

        // Use the Fetch API to make a POST request
        try {
            const response = await fetch('/likePhoto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Send the image title in the request body as JSON
                body: JSON.stringify({ title: imgTitle, artist: artistName})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const responseData = await response.json();
            alert(responseData.message);
        } catch (error) {
            // Handle error
            throw new Error(`Failed to make likePhoto request: ${error.message}`);
        }
    });
});
