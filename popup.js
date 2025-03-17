// popup.js

document.addEventListener('DOMContentLoaded', () => {
  // Load any saved token (if available) and display it
  chrome.storage.sync.get("githubToken", (result) => {
    if (result.githubToken) {
      document.getElementById('github-token').value = result.githubToken;
      document.getElementById('status').textContent = 'Token is already saved!';
    }
  });

  // Handle "Save Token" button click
  document.getElementById('save-token').addEventListener('click', () => {
    const tokenInput = document.getElementById('github-token');
    const token = tokenInput.value.trim();

    // If the token field is empty, show an error message and do not save
    if (!token) {
      document.getElementById('status').textContent = 'API token is required!';
      return;
    }

    chrome.storage.sync.set({ githubToken: token }, () => {
      console.log('GitHub token saved:', token);
      document.getElementById('status').textContent = 'Token saved successfully!';
    });
  });
});