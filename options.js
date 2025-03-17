document.addEventListener("DOMContentLoaded", () => {
    const tokenInput = document.getElementById("github-token");
    const statusEl = document.getElementById("status");
  
    // Load any existing token
    chrome.storage.sync.get("githubToken", (result) => {
      if (result.githubToken) {
        tokenInput.value = result.githubToken;
        statusEl.textContent = "Token is already saved!";
      }
    });
  
    // Save the token and close the tab
    document.getElementById("save-token").addEventListener("click", () => {
      const token = tokenInput.value.trim();
      chrome.storage.sync.set({ githubToken: token }, () => {
        statusEl.textContent = "Token saved successfully!";
        // Attempt to close the tab (if allowed)
        setTimeout(() => {
          window.close();
        }, 1000);
      });
    });
  });