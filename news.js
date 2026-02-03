async function fetchHeadlines() {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  let headlines = [];
  for (const url of feeds) {
    try {
      // cache busting parameter যোগ করা হলো
      const bust = Date.now(); 
      const r = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=' + 
        encodeURIComponent(url) + 
        '&nocache=' + bust
      );
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

  headlines.sort((a, b) => getDate(b) - getDate(a));
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
