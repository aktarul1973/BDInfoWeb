// Updated code in news.js to show headlines as feeds load

function loadFeeds() {
    const feeds = [
        "https://www.bbc.com/bengali/index.xml",
        "https://www.arthosuchak.com/feed/",
        "https://www.amardesh.com/feed/",
        "https://www.karatoa.com.bd/feed/",
        "https://www.bdnews24.com/rss/bangla",
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://www.prothomalo.com/feed",
        "https://www.kalerkantho.com/rss.xml",
        "https://www.timesofisrael.com/feed/"
    ];
    feeds.forEach(feed => {
        fetch(feed.url)
            .then(response => response.json())
            .then(data => {
                displayHeadlines(data.headlines);
            })
            .catch(error => console.error('Error loading feed:', error));
    });
}

function displayHeadlines(headlines) {
    headlines.forEach(headline => {
        const headlineElement = document.createElement('div');
        headlineElement.textContent = headline;
        document.getElementById('headlines').appendChild(headlineElement);
    });
}