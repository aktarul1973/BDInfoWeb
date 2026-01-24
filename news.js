// news.js

const feeds = [
  "https://www.bbc.com/bengali/index.xml",
  "https://www.arthosuchak.com/feed/",
  "https://www.amardesh.com/feed/",
  "https://www.karatoa.com.bd/feed/",
  "https://www.bdnews24.com/rss/bangla",
  "https://feeds.bbci.co.uk/news/rss.xml",
  "https://www.prothomalo.com/feed",
  "https://www.kalerkantho.com/rss.xml"
];

// তারিখ বের করার জন্য helper function
function getDate(item) {
  if (item.pubDate) return new Date(item.pubDate);
  if (item.published) return new Date(item.published);
  if (item.updated) return new Date(item.updated);
  return new Date(0); // যদি কিছু না থাকে, খুব পুরনো ধরে নিন
}

async function fetchHeadlines() {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  let headlines = [];
  for (const url of feeds) {
    try {
      const r = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url));
      const data = await r.json();
      if (data && Array.isArray(data.items)) {
        data.items.forEach(item => {
          item.sourceTitle = data.feed ? data.feed.title : "অজানা উৎস";
        });
        headlines = headlines.concat(data.items);
      }
    } catch (e) {
      console.error('Feed fetch error for', url, e);
    }
  }

  // তারিখ অনুযায়ী sort করা (সর্বশেষ আগে)
  headlines.sort((a, b) => getDate(b) - getDate(a));

  // সর্বশেষ ৬৩টি headline নেওয়া (আপনি slice(0,63) দিয়েছেন)
  const latestNews = headlines.slice(0, 63);

  for (const item of latestNews) {
    const text = (item.title || '').trim();
    const link = item.link || '#';
    const source = item.sourceTitle || "অজানা উৎস";
    const time = getDate(item).toLocaleString('bn-BD');

    const div = document.createElement("div");
    div.className = "headline";
    div.innerHTML = `
      <h3>${text}</h3>
      <p class="meta">
        Source: <span class="source">${source}</span> | 
        Time: <span class="time">${time}</span>
      </p>
      <p><a href="${link}" target="_blank">মূল খবর পড়ুন</a></p>`;
    container.appendChild(div);
  }
}

// প্রথমবার লোড
fetchHeadlines();

// প্রতি 2 মিনিট পর আবার লোড
setInterval(fetchHeadlines, 120000);
