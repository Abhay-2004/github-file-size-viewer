document.addEventListener("DOMContentLoaded", () => {
  const tokenInput = document.getElementById("github-token");
  const toggleBtn = document.getElementById("toggle-visibility");
  const saveBtn = document.getElementById("save-token");
  const statusEl = document.getElementById("status");

  // Load any existing token
  chrome.storage.sync.get("githubToken", (result) => {
    if (result.githubToken) {
      tokenInput.value = result.githubToken;
      statusEl.textContent = "Token is already saved!";
    }
  });

  // Toggle password visibility
  toggleBtn.addEventListener("click", () => {
    if (tokenInput.type === "password") {
      tokenInput.type = "text";
      toggleBtn.textContent = "Hide";
    } else {
      tokenInput.type = "password";
      toggleBtn.textContent = "Show";
    }
  });

  // Save the token
  saveBtn.addEventListener("click", () => {
    const token = tokenInput.value.trim();
    chrome.storage.sync.set({ githubToken: token }, () => {
      statusEl.textContent = "Token saved successfully!";
    });
  });
});