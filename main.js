window.addEventListener("load", () => {
    fetch('./tags.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(gifs => {
            const root = document.querySelector('#root');

            root.innerHTML = `
                <div id="searchbar-box">
                    <input type="text" id="searchbar" autofocus placeholder="Search in tags">
                </div>
                <div id="gifbox">
                </div>
            `;

            renderGifs(gifs);

            const searchbar = document.querySelector('#searchbar');
            searchbar.addEventListener('input', debounce((event) => {
                const searches = event.target.value.split(' ').filter(search => search);
                const gifsToShow = filterGifs(gifs, searches);
                console.log(gifsToShow);
                renderGifs(gifsToShow);
            }, 300));

            searchbar.addEventListener('input', (event) => {
                searchbar.value = event.target.value.replace(/[^a-zA-Z-\s]/g, '');
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            console.log("applying", this, args)
            func.apply(this, args);
        }, delay);
    };
}

const filterGifs = (gifs, searches) => {
    let filtered = gifs;

    for (const search of searches) {
        filtered = filtered.filter((gif) => gif.tags.some((tag) => new RegExp(search).test(tag)));
    }
    
    return filtered;
}

const renderGifs = (gifs) => {
    const root = document.querySelector('#gifbox');

    root.innerHTML = gifs.reduce((acc, cur) => {
        const ratio = cur.height / cur.width;
        const colSpan = Math.min(2, Math.max(1, Math.round(1/ratio)));
        const width = (window.screen.width < 400 ? Math.floor(window.screen.width / 2) : 200) * colSpan;
        const height = Math.round(width * ratio);
        // <div class="imgbox" style="width: ${width}px; height: ${height}px;">
        // </div>
        return acc + `
        <img loading="lazy" width="${width}px" height="${height}px" style="grid-row: span ${Math.max(1, Math.round(ratio))}; grid-column: span ${colSpan};" src="./gifs_media/${cur.file}.gif" alt="Tags: ${cur.tags.join(', ')}" id="${cur.file}" title="Tags: ${cur.tags.join(', ')}" >
        
        `;
    }, '');
}