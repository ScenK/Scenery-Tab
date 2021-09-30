class Weather {
  constructor() {
    this.BASE = {
      api: "https://api.openweathermap.org/data/2.5/onecall",
      key: "",
    };
  }

  async getOpenWeather(pos) {
    // https://openweathermap.org/api/one-call-api
    const query = {
      'lat': pos.coords.latitude,
      'lon': pos.coords.longitude,
      'appid': this.BASE.key,
      'units': 'imperial'
    };

    const resp = await fetch(`${this.BASE.api}?${new URLSearchParams(query).toString()}`)
    return await resp.json()
  }

  async getCelsiusUnit() {
    return new Promise(done => {
      chrome.storage.local.get('celsius', result => {
        if (!result['celsius']) {
          console.log('no cached unit available!')
          done(false)
        } else {
          console.log('load cached unit.')
          done(result['celsius']);
        }
      });
    });
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
        const weather = await this.getOpenWeather(pos)
        chrome.storage.local.set({'CurrentWeather': JSON.stringify(weather)})
        done(weather)
      });
    });
  }

  formatTemp(temp, celsius=false) {
    return celsius ? (temp - 32)/1.8 : temp
  }
}
