### My Cocktails PWA:

![front page](https://user-images.githubusercontent.com/36195440/77958156-e7741880-72d4-11ea-87ef-2838e10b0098.png)

## To do list

- [x] make data render serverside
- [x] implement tooling
- [x] implement manifest.json file
- [x] implement service-worker
- [x] make it fancy with css!
- [x] deploy website to heroku


## wishlist

- [ ] implement error handling
- [ ] allow users to make a profile and save favorite cocktails
- [ ] critical css implemented as described in [this article from Smashing mag](https://www.smashingmagazine.com/2015/08/understanding-critical-css/)

## install cocktail searcher :star:

Install the app for use purposes only via the browser by clicking on the download button in the navigation bar!

## install cocktail searcher for development purposes

### make sure you have nodeJS installed

Navigate to the folder where you wish to clone the app to using your terminal

`cd path/path/path`

Clone this repository to the folder

`git clone https://github.com/ReiniervanLimpt/progressive-web-apps-1920.git`

Change repository to the master folder

`cd progressive-web-apps-1920`

Run the install, this installs all the required packages included in the package.json file

`npm install`

After the install run the npm start script

`npm start`

listens to localhost:3000

used database: 🌐 https://www.thecocktaildb.com/ (no rate limit!!!)

My webapp allows users to search for cocktails based on ingredient ie. lemon(shows the most results), orange, lime etc in combination with a selection of alcoholic drinks which serve as a filter through a big array of cocktails!

![overview](https://user-images.githubusercontent.com/36195440/77958169-eba03600-72d4-11ea-80e9-d194e32ce760.png)

# Rendering my pwa server side

I used express to setup a server which handles HTTP requests, when a GET http method is requested on /overview the server responds by fetching data. The data would then be injected into my html files which i converted to EJS files to enable ejs templating. My serverside application runs its scripts before the html is loaded and then sends pure HTML to the computer with the dynamic data allready processed into the file.

```javascript
app.get('/overview', (req, res) => {
  const ingredient = req.query.ingredient
  const drink = req.query.drink
  const apiKey = "1"
  fetch(`${url}${apiKey}/filter.php?i=${ingredient}`)
    .then(async response => {
      const cocktailData = await response.json()
      console.log(cocktailData)
      res.render('overview.ejs', {
        cocktailData
      });
    })
})
```
I included this code snippet which shows my serverside Javascript fetching data from the api based on the users input, as you can see at the rendering step it also "returns" the data to the overview.ejs html file which then creates a list item for each cocktail object in the json file the api responds with. <%= cocktailData.strDrink %> contains the name of the cocktail which will be placed within the p tag.

  ```javascript
  <ul class="cocktail-list">
    <% cocktailData.drinks.forEach(cocktailData => { %>
      <li>
        <a href="/cocktails/<%= cocktailData.idDrink %>">
            <img src="<%= cocktailData.strDrinkThumb %>">
            <p><%= cocktailData.strDrink %></p>
        </a>
      </li>
      <% }) %>
  </ul>
  ```


# My apps audit score before optimalizing the critical render path:

I tried optimalizing the critical render path of my application by looking at the network tab and seeing if there are improvements that can be made on the initial load of my PWA. With the help of service workers i can easily store previouw html/fetch requests and serve them on a repeat view but for now i will focus on progressively rendering the first view. 

![audit](https://user-images.githubusercontent.com/36195440/78149437-4b622280-7436-11ea-8cc1-45d32863bab4.png)

## The time it took to render the homepage

![before compression](https://user-images.githubusercontent.com/36195440/78149533-66349700-7436-11ea-83e9-236e23bbff6f.png)

At this point i had allready used to tooling (gulp) to minify my css

*the first step i took to reduce loading speed was compressing with gzip*

which can be done realy easily by adding the code [documented here.](https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression)

## Rendering the homepage with compressed files / Gzip

![after compression](https://user-images.githubusercontent.com/36195440/78150252-51a4ce80-7437-11ea-9516-99d1602039df.png)

As you can see some files have been compressed down to less than half their size, at the size panel you can see the amount of bytes sent over the network and the original file size which has been grayed out.
:exclamation: One thing i looked at is decreasing the resource size of my background png by hand because that takes about the same amount of time to load as parsing my entire css file, i wonder if the file sent over the line is smaller than it is after compressing it with Gzip.

## decreasing image file size by hand to improve loading speed

I took my background file and compressed it with photoshop, i down it down to 291 kb instead of 655, but the filesize sent over the network remained the same

I then reduced the size of the image itself which was `1535 -1024 px`, i took that down to `1200 x 800 px` interestingly enough the filesize sent over the network did not change at all:

![decreased img](https://user-images.githubusercontent.com/36195440/78153374-48b5fc00-743b-11ea-9bba-ab306363a0dd.png)

## performance after compression

![perf after comp](https://user-images.githubusercontent.com/36195440/78154207-456f4000-743c-11ea-96ff-f15f10708c66.png)

## :exclamation: time to first paint

![needs CCCS](https://user-images.githubusercontent.com/36195440/78154424-8b2c0880-743c-11ea-8733-25d417a73509.png)

On a slow 3g connection the first painted pixel only appears 4 seconds after the first network request...

## showing first paint with critical CSS

To increase the perceived performance of my webpage i would have liked to implement critical CSS, which would inject styling for elements that appear "above the fold" meaning the top of my webpage would render allmost instantly before the rest of the CSS will be parsed by the browser resulting in a page which looks like it rendered instantly.
By injecting the main css needed for styling on my header and instructions section in the head section i would be able to show those elements much quicker, i excluded the background image because i imagine that would take "forever" to load. The result:

![critical CSS](https://user-images.githubusercontent.com/36195440/78168259-e7e4ee80-744f-11ea-96bf-04a0933f5212.png)

not that much changed... i followed [this](https://jonassebastianohlsson.com/criticalpathcssgenerator/) tutorial for the easy way out but i quickly found out its not all that easy according to [this article from Smashing mag](https://www.smashingmagazine.com/2015/08/understanding-critical-css/) and [this one from Voorhoede](https://www.voorhoede.nl/en/blog/why-our-website-is-faster-than-yours/#critical-css)

## Service worker

- [x] include service worker
- [x] Serve an offline page
- [x] store core assets and html to serve instantly on repeat views
- [x] rev-manifest, hash revision on CSS file

I included a service worker using Declans example, the service worker server as a proxy between the browser and the server. The service worker stores 2 Core assets in cache storage, my minified CSS and the offline page which is served when the fetch event fails to respond with an html page after a html request (when the user is offline).

```javascript
      caches.open('html-cache')
      .then(cache => cache.match(event.request.url))
      .then(response => response ? response : fetchAndCache(event.request, 'html-cache'))
      .catch(e => {
        return caches.open(CORE_CACHE_VERSION)
          .then(cache => cache.match('/offline'))
      })
```

## Service worker in action

![cache core assets](https://user-images.githubusercontent.com/36195440/78239973-aa7b7200-74de-11ea-8c39-53f9bc93edf4.png)

Here you can see the core assets which are stored in cache storage.

```javascript
const CORE_CACHE_VERSION = '1';
const CORE_ASSETS = [
  '/offline',
  '/styles.css',
];
```

these will be fetched upon repeat views using the following code in the service-worker.js file

```javascript
  if (isCoreGetRequest(event.request)) {
    console.log('Core get request: ', event.request.url);
    event.respondWith(
      caches.open(CORE_CACHE_VERSION)
      .then(cache => cache.match(event.request.url))
    )
```

## caching html requests

![first view](https://user-images.githubusercontent.com/36195440/78240189-f29a9480-74de-11ea-87ad-b1a3476229ed.png)

Upon viewing the page for the first time you can see images are being requested and downloaded, the green bars represent the TTFB which is the time betweer the HTTP request and the first byte being received by the browser.

![repeat view](https://user-images.githubusercontent.com/36195440/78240472-59b84900-74df-11ea-9114-b80de0108749.png)

Upon repeat view you can see the file being served from the cache storage which also completely eliminates the waiting time on the first byte.

![cache html](https://user-images.githubusercontent.com/36195440/78240615-89675100-74df-11ea-94c9-839ba9569023.png)

*The cached html request.*

## hash revisioning

i included hash revisioning with the example of declan from his 24/03 presentation !!!

![last minute hashing](https://user-images.githubusercontent.com/36195440/78244118-46a87780-74e5-11ea-96a0-cc61249f8476.png)
