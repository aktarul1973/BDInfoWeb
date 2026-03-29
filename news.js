const feeds = [
  "https://www.bbc.com",
  "https://www.arthosuchak.com",
  "https://www.amardesh.com",
  "https://www.karatoa.com.bd",
  "https://www.bdnews24.com",
  "https://feeds.bbci.co.uk",
  "https://www.prothomalo.com",
  "https://www.kalerkantho.com",
  "https://www.nytimes.com",
  "https://www.timesofisrael.com"
];

// Helper to get proper Date
function getDate(item) {
  const dateStr = item.pubDate || item.published || item.updated;
  return dateStr ? new Date(dateStr) : new Date(0);
}

async function fetchHeadlines() {
  const container = document.getElementById('news-container');
  const loading = document.getElementById('loading');
  
  if (!container) return;

  let allHeadlines = [];

  // Fetching all feeds at once for speed
  const fetchPromises = feeds.map(async (url) => {
    try {
      // Adding a timestamp to bypass simple browser caching
      const response = await fetch(`https://api.rss2json.com{encodeURIComponent(url)}&_=${Date.now()}`);
      const data = await response.json();
      
      if (data.status === 'ok' && data.items) {
        return data.items.map(item => ({
          ...item,
          sourceTitle: data.feed ? data.feed.title : "অজানা উৎস"
        }));
      }
    } catch (error) {
      console.error("Error fetching feed:", url, error);
    }
    return [];
  });

  const results = await Promise.all(fetchPromises);
  allHeadlines = results.flat();

  // Sort by date (Newest first)
  allHeadlines.sort((a, b) => getDate(b) - getDate(a));

  // Take top 63 news
  const latestNews = allHeadlines.slice(0, 63);

  if (latestNews.length > 0) {
    // Clear loading message and container
    if (loading) loading.style.display = 'none';
    container.innerHTML = '';

    latestNews.forEach(item => {
      const div = document.createElement("div");
      div.className = "headline";
      
      // Formatting date for Bengali UI
      const timeStr = getDate(item).toLocaleString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'long'
      });

      div.innerHTML = `
        <div style="border-bottom: 1px solid #ddd; padding: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">${item.title.trim()}</h3>
          <p class="meta" style="font-size: 0.85em; color: #666;">
            উৎস: <span class="source" style="font-weight: bold; color: #d32f2f;">${item.sourceTitle}</span> | 
            সময়: <span class="time">${timeStr}</span>
          </p>
          <p><a href="${item.link}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 500;">মূল খবর পড়ুন →</a></p>
        </div>
      `;
      container.appendChild(div);
    });
  } else {
    if (loading) loading.innerText = "খবর পাওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।";
  }
}

// Initial Load
fetchHeadlines();

// Auto Refresh every 2 minutes (120,000 ms)
setInterval(fetchHeadlines, 120000);
Use code with caution.

Important Checklist:
HTML Fix: In your index.html, make sure you fixed the <h6> tag from </6> to </h6>.
Local Testing: If you are opening the file from your computer (double-clicking the file), Google Chrome might block the API. Try using L
