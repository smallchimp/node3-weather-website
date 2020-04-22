const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const enableDarkMode = require('./utils/darkmode');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup Handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Jordan Riesel'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Weather App',
        name: 'Jordan Riesel'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
          return res.send({error});
        } 
          forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
              return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
            })
          })
      })
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })

    } else {
        console.log(req.query.search);
        res.send({
        products: ""
        })
    }  
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Jordan Riesel',
        message: 'Visit /weather to view weather information or view /about to view information about the webpage creator.'
    })
})

app.get('/help/*', (reqs, res) => {
    res.render('404', {
        title: '404',
        message: 'Error 404: Help article not found.',
        name: 'Jordan Riesel'
    })
})

app.get('*',(req, res) => {
    res.render('404', {
        title: '404',
        message: 'Error 404: Page not found.',
        name: 'Jordan Riesel'
    })
})

app.listen(port, () => {
    console.log('Currently listening on Port ' + port)
});