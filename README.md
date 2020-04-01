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

## install my webapp

### make sure you have nodeJS installed

Navigate to the folder where you wish to clone the app to using your terminal

`cd path/path/path`

Clone this repository to the folder

`git clone https://github.com/ReiniervanLimpt/progressive-web-apps-1920.git`

Run the install, this installs all the required packages included in the package.json file

`npm install`

After the install run the npm start script

`npm start`

listens to localhost:3000

used database: 🌐 https://www.thecocktaildb.com/ (no rate limit!!!)

My webapp allows users to search for cocktails based on ingredient ie. lemon(shows the most results), orange, lime etc in combination with a selection of alcoholic drinks which serve as a filter through a big array of cocktails!

![overview](https://user-images.githubusercontent.com/36195440/77958169-eba03600-72d4-11ea-80e9-d194e32ce760.png)

# My apps audit score before optimalizing the critical render path:

![audit](https://user-images.githubusercontent.com/36195440/78149437-4b622280-7436-11ea-8cc1-45d32863bab4.png)

## and the time it took to render the homepage

![before compression](https://user-images.githubusercontent.com/36195440/78149533-66349700-7436-11ea-83e9-236e23bbff6f.png)

At this point i had allready used to tooling (gulp) to minify my css

*the first step i took to reduce loading speed was compressing with gzip*

which can be done realy easily by adding the code [documented here.](https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression)

## rendering the homepage with compressed files / Gzip

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

By injecting the main css needed for styling on my header and instructions section in the head section i would be able to show those elements much quicker, i excluded the background image because that would take "forever" to load. The result:

![critical CSS](https://user-images.githubusercontent.com/36195440/78168259-e7e4ee80-744f-11ea-96bf-04a0933f5212.png)

not that much changed... i followed [this](https://jonassebastianohlsson.com/criticalpathcssgenerator/) tutorial for the easy way out but i quickly found out its not all that easy according to [this article from Smashing mag](https://www.smashingmagazine.com/2015/08/understanding-critical-css/) and [this one from Voorhoede](https://www.voorhoede.nl/en/blog/why-our-website-is-faster-than-yours/#critical-css)
