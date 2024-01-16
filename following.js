// Helper function to create HTML elements
function createElement(tag, attributes) {
    const element = document.createElement(tag);
    for (const key in attributes) {
      element[key] = attributes[key];
    }
    return element;
  }
  
  // Function to fetch user information
  async function getUserInfo(username) {
    try {
      const response = await fetch(`/getUserInfo?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const userInfo = await response.json();
      displayUserInfo(username, userInfo);
    } catch (error) {
      console.error(`Failed to fetch user info for ${username}: ${error.message}`);
    }
  }
  
  // Function to display user information
  function displayUserInfo(username, userInfo) {
    const infoContainer = document.getElementById(`${username}-info-container`);
    
    // Clear previous content
    while (infoContainer.firstChild) {
      infoContainer.removeChild(infoContainer.firstChild);
    }
  
    // Create and append new elements
    const followersLabel = createElement('p', { textContent: `Followers: ${userInfo.followers}` });
    const followingLabel = createElement('p', { textContent: `Following: ${userInfo.following}` });
  
    infoContainer.appendChild(followersLabel);
    infoContainer.appendChild(followingLabel);
  }