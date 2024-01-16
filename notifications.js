// Assuming you have a container element with the id 'notifications-container'
const notificationsContainer = document.getElementById('notifications-container');

// Fetch notifications from the server
fetch('/notifications')
   .then(response => response.json())
   .then(data => {
      // Update the UI with the notifications
      data.notifications.forEach(notification => {
         const notificationElement = document.createElement('div');
         notificationElement.textContent = `New artwork by ${notification.artist}: ${notification.artworkTitle}`;
         notificationsContainer.appendChild(notificationElement);
      });
   })
   .catch(error => console.error(error));
