// Updated code in news.js to show headlines as feeds load

function loadFeeds() {
    const feeds = [/* array of feeds */];
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