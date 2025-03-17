console.log("Content script loaded.");

// Retrieve GitHub token from Chrome storage
function getToken() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("githubToken", (result) => {
      resolve(result.githubToken);
    });
  });
}

// Format the size in a human-readable way
function formatSize(bytes) {
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

// Recursively calculate the total size of a folder
async function calculateFolderSize(apiUrl, headers) {
  console.log("Calculating folder size for:", apiUrl);
  try {
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      console.error("Folder API error:", response.status, response.statusText);
      return 0;
    }
    const data = await response.json();
    let totalSize = 0;
    if (Array.isArray(data)) {
      const sizePromises = data.map((item) => {
        if (item.type === "file" && typeof item.size === "number") {
          return Promise.resolve(item.size);
        } else if (item.type === "dir") {
          return calculateFolderSize(item.url, headers);
        } else {
          return Promise.resolve(0);
        }
      });
      const sizes = await Promise.all(sizePromises);
      totalSize = sizes.reduce((sum, size) => sum + size, 0);
    }
    return totalSize;
  } catch (error) {
    console.error("Error calculating folder size:", error);
    return 0;
  }
}

// Fetch file/folder size from GitHub API with enhanced error handling
async function fetchFileSize(apiUrl) {
  const token = await getToken();
  let headers = { "Accept": "application/vnd.github.v3+json" };
  if (token) {
    headers["Authorization"] = "token " + token;
  }
  console.log("Fetching size for:", apiUrl);
  try {
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      console.error("GitHub API responded with error:", response.status, response.statusText);
      return "N/A";
    }
    const data = await response.json();
    console.log("Received data:", data);
    if (data && data.message) {
      console.error("GitHub API error message:", data.message);
      return "N/A";
    }
    if (data && !Array.isArray(data) && data.type === "file") {
      if (typeof data.size === "number") {
        return formatSize(data.size);
      } else {
        console.error("File object missing size:", data);
        return "N/A";
      }
    } else if (Array.isArray(data)) {
      const folderSize = await calculateFolderSize(apiUrl, headers);
      return folderSize > 0 ? formatSize(folderSize) : "Folder";
    } else {
      return "N/A";
    }
  } catch (error) {
    console.error("Error fetching file size:", error);
    return "N/A";
  }
}

// Insert the size next to each file/folder link with GitHub-like styling
function insertSizeAfterLink(link, sizeText) {
  const sizeSpan = document.createElement("span");
  sizeSpan.style.marginLeft = "10px";
  sizeSpan.style.fontSize = "smaller";
  sizeSpan.style.color = "#6a737d";
  sizeSpan.textContent = `(${sizeText})`;
  link.insertAdjacentElement("afterend", sizeSpan);
}

// Main function: find all GitHub file/folder links, fetch sizes concurrently, display them
async function displayFileSizes() {
  console.log("Running displayFileSizes...");
  const links = document.querySelectorAll('a[href*="/blob/"], a[href*="/tree/"]');
  console.log("Found potential file/folder links:", links.length);
  const promises = Array.from(links).map(async (link) => {
    const urlParts = link.href.split("/");
    const user = urlParts[3];
    const repo = urlParts[4];
    const typeSegment = link.href.includes("/blob/") ? "blob" : "tree";
    const branchIndex = urlParts.indexOf(typeSegment) + 1;
    const branch = urlParts[branchIndex];
    const filePath = urlParts.slice(branchIndex + 1).join("/");
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}?ref=${branch}`;
    const sizeText = await fetchFileSize(apiUrl);
    insertSizeAfterLink(link, sizeText);
  });
  await Promise.all(promises);
}

window.addEventListener("load", () => {
  setTimeout(displayFileSizes, 2000);
});