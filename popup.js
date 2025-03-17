document.getElementById('save-token').addEventListener('click', function () {
    const token = document.getElementById('github-token').value.trim();
    chrome.storage.sync.set({ githubToken: token }, function () {
      console.log('GitHub token saved.');
      document.getElementById('status').textContent = 'Token saved successfully!';
    });
  });