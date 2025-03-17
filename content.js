// content.js

console.log("Content script loaded.");

// Helper: get GitHub token from Chrome storage
function getToken() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("githubToken", (result) => {
      resolve(result.githubToken);
    });
  });
}

// Recursively calculate folder size
async function calculateFolderSize(apiUrl, headers) {
  console.log("Calculating folder size for:", apiUrl);
  try {
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();
    let totalSize = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.type === "file" && item.size !== undefined) {
          totalSize += item.size;
        } else if (item.type === "dir") {
          totalSize += await calculateFolderSize(item.url, headers);
        }
      }
    }
    return totalSize;
  } catch (error) {
    console.error("Error calculating folder size:", error);
    return 0;
  }
}

// Fetch file/folder size using GitHub API
async function fetchFileSize(apiUrl) {
  const token = await getToken();
  let headers = { "Accept": "application/vnd.github.v3+json" };
  if (token) {
    headers["Authorization"] = "token " + token;
  }

  console.log("Fetching size for:", apiUrl);
  try {
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    if (data && !Array.isArray(data) && data.type === "file" && data.size !== undefined) {
      console.log("File size:", data.size);
      return (data.size / 1024).toFixed(2) + " KB";
    } else if (Array.isArray(data)) {
      const folderSize = await calculateFolderSize(apiUrl, headers);
      console.log("Folder size:", folderSize);
      return folderSize > 0 ? (folderSize / 1024).toFixed(2) + " KB" : "Folder";
    } else {
      console.log("Data not in expected format:", data);
      return "N/A";
    }
  } catch (error) {
    console.error("Error fetching file size:", error);
    return "N/A";
  }
}

async function displayFileSizes() {
  console.log("Running displayFileSizes...");

  // Direct approach: find all <a> tags whose href contains "/blob/" or "/tree/"
  let links = document.querySelectorAll('a[href*="/blob/"], a[href*="/tree/"]');
  console.log("Found potential file/folder links:", links.length);

  for (const link of links) {
    // Build the GitHub API URL
    const urlParts = link.href.split("/");
    const user = urlParts[3];
    const repo = urlParts[4];
    const typeSegment = link.href.includes("/blob/") ? "blob" : "tree";
    const branchIndex = urlParts.indexOf(typeSegment) + 1;
    const branch = urlParts[branchIndex];
    const filePath = urlParts.slice(branchIndex + 1).join("/");
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}?ref=${branch}`;

    const sizeText = await fetchFileSize(apiUrl);
    console.log("Size for", link.href, ":", sizeText);

    // Insert the size text after the link
    const sizeSpan = document.createElement("span");
    sizeSpan.style.marginLeft = "10px";
    sizeSpan.style.fontSize = "smaller";
    sizeSpan.style.color = "#555";
    sizeSpan.textContent = sizeText;

    link.insertAdjacentElement("afterend", sizeSpan);
  }
}

// Delay execution to let GitHub load
window.addEventListener("load", () => {
  setTimeout(displayFileSizes, 2000);
});