const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const { getEnabledCategories } = require('trace_events');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  console.log('in home')
  res.render('index');
});

app.get('/beers', async (req, res) => {
  try {
    const allBeers = await punkAPI.getBeers()
    
    const selectedBeers = allBeers.splice(0, 24)
    //console.log(selectedBeers); 
    res.render('beers', {selectedBeers})
  } catch (error) {
    console.log(error)
  }
});

app.get('/random', async (req, res) => {
  try {
    const randomBeer = await punkAPI.getRandom()
    console.log(randomBeer)
    const data = {
      beer: randomBeer[0],
      displayInfo: true
  
    }
    res.render('random', data);
  }
  catch(error){
    console.log(error)
  }
});

app.get('/beers/:id', async (req, res) => {
  try {
    const beerID = req.params.id;
    const foundBeer = await punkAPI.getBeer(beerID)

    console.log(foundBeer);
    res.render('beersID', {foundBeer});
  }
  catch(error){
    console.log(error)
  }
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
