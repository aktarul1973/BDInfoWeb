// news.js

// news.js - Copy and Paste the code below

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

function getDate(item) {
  const dateStr = item.pubDate || item.published || item.updated;
  return dateStr ? new Date(dateStr) : new Date(0);
}

async function fetchHeadlines() {
  const container = document.getElementById('news-container');
  if (!container) return;

  const fetchPromises = feeds.map(async (url) => {
    try {
      // Free API link with nocache parameter
      const r = await fetch(`https://api.rss2json.com{encodeURIComponent(url)}&nocache=${Date.now()}`);
      const data = await r.json();
      if (data.status === 'ok') {
        return data.items.map(item => ({
          ...item,
          sourceTitle: data.feed ? data.feed.title : "অজানা উৎস"
        }));
      }
    } catch (e) {
      console.error('Error fetching:', url, e);
    }
    return [];
  });

  const results = await Promise.all(fetchPromises);
  const headlines = results.flat().sort((a, b) => getDate(b) - getDate(a));

  container.innerHTML = '';
  const latestNews = headlines.slice(0, 63);

  latestNews.forEach(item => {
    const div = document.createElement("div");
    div.className = "headline";
    div.innerHTML = `
      <h3>${item.title.trim()}</h3>
      <p class="meta">
        Source: <span class="source">${item.sourceTitle}</span> | 
        Time: <span class="time">${getDate(item).toLocaleString('bn-BD')}</span>
      </p>
      <p><a href="${item.link}" target="_blank">মূল খবর পড়ুন</a></p>`;
    container.appendChild(div);
  });
}

// Initial Load
fetchHeadlines();

// Auto Refresh every 2 minutes
setInterval(fetchHeadlines, 120000);
