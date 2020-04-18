let request = require('request');

let forecast = (latitude, longitude, callback) => {
    let url = 'http://api.weatherstack.com/current?access_key=cbf38cb76e2f6c4a62d37faa4cf57b09&query=' + latitude + ',' + longitude + '&units=f'

    request({url, json:true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather services.', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degrees out. It feels like " + body.current.feelslike + " degrees out.")
        }
    })
}

module.exports = forecast