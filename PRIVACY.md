# Privacy Policy for GitHub File Size Viewer

**Last Updated:** [March 16, 2025]

GitHub File Size Viewer is a Chrome extension designed to enhance the browsing experience on GitHub by displaying file and folder sizes within repositories. This extension **does not** collect, store, or transmit any personal data.

## **What Data Do We Collect?**
This extension does **not** collect, store, or transmit any personally identifiable information (PII). The only local storage used is for the user's GitHub **Personal Access Token (PAT)**, which is stored using Chrome’s built-in `chrome.storage.sync` API.

## **How Is Your Data Used?**
- The **GitHub Personal Access Token** (if provided by the user) is used solely for authenticating API requests to GitHub.
- The token is stored **locally on the user's device** and **never transmitted** to any external servers or third parties.
- The extension **only operates on `https://github.com/*` pages** and does not track user activity outside of GitHub.

## **Do We Share Your Data?**
No. This extension **does not** collect or share any data with third parties.

## **Do We Use Cookies or Track Users?**
No. This extension does not use cookies, analytics, or tracking mechanisms.

## **Permissions Required**
The extension requests the following Chrome permissions:
- `storage` - To store the GitHub Personal Access Token locally.
- `activeTab` - To inject the script on GitHub pages when needed.
- `scripting` - To display file sizes directly on GitHub.
- `https://github.com/*` - To fetch file size data from GitHub API.

## **Security Measures**
- All functionality is contained **within the extension package**.
- No remote code is executed or fetched dynamically.

