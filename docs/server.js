const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch')

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.static('static'))

app.get('/overview', (req, res) => {
  const url = "https://www.thecocktaildb.com/api/json/v1/";
  const ingredient = req.query.ingredient;
  const drink = req.query.drink;
  const apiKey = "1";
  fetch(`${url}${apiKey}/filter.php?i=${ingredient}`)
    .then(async response => {
      const cocktailData = await response.json()
      console.log(cocktailData)
      res.render('overview.ejs', {
        cocktailData
      });
    })
})

app.get('/:id', (req, res) => {
  const url = "https://www.thecocktaildb.com/api/json/v1/";
  const detail = req.params.id;
  const apiKey = "1";

  fetch(`${url}${apiKey}/lookup.php?i=${detail}`)
    .then(async response => {
      const cocktailDetail = await response.json()
      console.log(cocktailDetail)
      res.render('detail.ejs', {
        cocktailDetail
      });
    })
})

app.get('/', open)

function open(req, res) {
  res.render('index.ejs')
}