class Weather {
  constructor() {
    this.BASE = {
      api: "https://weather-ydn-yql.media.yahoo.com/forecastrss",
      key: "",
      secret: "",
      appId: ''
    };

    this.weatherIcon = {
      0: 'wi-tornado',
      1: 'wi-storm-showers',
      2: 'wi-tornado',
      3: 'wi-thunderstorm',
      4: 'wi-thunderstorm',
      5: 'wi-snow',
      6: 'wi-rain-mix',
      7: 'wi-rain-mix',
      8: 'wi-sprinkle',
      9: 'wi-sprinkle',
      10: 'wi-hail',
      11: 'wi-showers',
      12: 'wi-showers',
      13: 'wi-snow',
      14: 'wi-storm-showers',
      15: 'wi-snow',
      16: 'wi-snow',
      17: 'wi-hail',
      18: 'wi-hail',
      19: 'wi-cloudy-gusts',
      20: 'wi-fog',
      21: 'wi-fog',
      22: 'wi-fog',
      23: 'wi-cloudy-gusts',
      24: 'wi-cloudy-windy',
      25: 'wi-thermometer',
      26: 'wi-cloudy',
      27: 'wi-night-cloudy',
      28: 'wi-day-cloudy',
      29: 'wi-night-cloudy',
      30: 'wi-day-cloudy',
      31: 'wi-night-clear',
      32: 'wi-day-sunny',
      33: 'wi-night-clear',
      34: 'wi-day-sunny-overcast',
      35: 'wi-hail',
      36: 'wi-day-sunny',
      37: 'wi-thunderstorm',
      38: 'wi-thunderstorm',
      39: 'wi-thunderstorm',
      40: 'wi-storm-showers',
      41: 'wi-snow',
      42: 'wi-snow',
      43: 'wi-snow',
      44: 'wi-cloudy',
      45: 'wi-lightning',
      46: 'wi-snow',
      47: 'wi-thunderstorm',
      3200: 'wi-cloud',
    }

  }

  async getYahooWeather(pos) {
    const url = this.BASE.api
    const method = 'GET'
    const consumer_key = this.BASE.key
    const consumer_secret = this.BASE.secret
    const concat = '&'
    const query = {'format': 'json', 'lat': pos.coords.latitude, 'lon': pos.coords.longitude};
    const oauth = {
        'oauth_consumer_key': consumer_key,
        'oauth_nonce': Math.random().toString(36).substring(2),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
        'oauth_version': '1.0'
    };

    const merged = Object.assign({}, query, oauth)
    // Note the sorting here is required
    const merged_arr = Object.keys(merged).sort().map((k) => {
      return [k + '=' + encodeURIComponent(merged[k])]
    })
    const signature_base_str = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(merged_arr.join(concat))}`

    const composite_key = `${encodeURIComponent(consumer_secret)}&`
    const hash = CryptoJS.HmacSHA1(signature_base_str, composite_key)
    const signature = hash.toString(CryptoJS.enc.Base64)

    oauth['oauth_signature'] = signature
    const auth_header = 'OAuth ' + Object.keys(oauth).map((k) => {
      return [k + '="' + oauth[k] + '"']
    }).join(',')

    const resp = await fetch(`${url}?${new URLSearchParams(query).toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': auth_header,
        'X-Yahoo-App-Id': this.BASE.appId
      }
    })
    return await resp.json();
  }

  async getWeatherDataCache(key) {
    return new Promise(done => {
      chrome.storage.local.get([key], result => {
        if (!result[key]) {
          console.log('no cache available!')
          done('{"status": "empty"}')
        } else {
          console.log('load cached weather.')
          done(result[key]);
        }
      });
    });
  }

  getCurrentWeather() {
    return new Promise((done) => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const weather = await this.getYahooWeather(pos)
        chrome.storage.local.set({'CurrentWeather': JSON.stringify(weather)})
        done(weather)
      });
    });
  }
}
