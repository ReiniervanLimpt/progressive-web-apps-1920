const express = require('express')
const compression = require('compression')
const app = express()
const port = 3000
const fetch = require('node-fetch')
const url = 'https://www.thecocktaildb.com/api/json/v1/'
const revManifest = require('./static/rev-manifest')
console.log(revManifest)
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(compression())

app.use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=365000000, immutable');
  next();
});

app.use(express.static('static'))

app.get('/offline', (req, res) => {
  res.render('offline.ejs', {
    revManifest
  })
})

app.get('/overview', (req, res) => {
  const ingredient = req.query.ingredient
  const drink = req.query.drink
  const apiKey = "1"
  fetch(`${url}${apiKey}/filter.php?i=${ingredient}`)
    .then(async response => {
      const cocktailData = await response.json()
      console.log(cocktailData)
      res.render('overview.ejs', {
        cocktailData,
        revManifest
      });
    })
})

app.get('/cocktails/:id', (req, res) => {
  const detail = req.params.id
  const apiKey = "1"
  console.log(detail)
  fetch(`${url}${apiKey}/lookup.php?i=${detail}`)
    .then(async response => {
      const cocktailDetail = await response.json()
      console.log(cocktailDetail)
      res.render('detail.ejs', {
        cocktailDetail,
        revManifest
      });
    })
})

app.get('/', open)

function open(req, res) {
  res.render('index.ejs', {
    revManifest
  })
}

app.listen(process.env.PORT || 3000)