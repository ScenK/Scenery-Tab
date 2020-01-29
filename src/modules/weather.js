class Weather {

  constructor() {
    this.BASE = {
      api: 'https://api.openweathermap.org/data/2.5/',
      units: 'imperial',
      key: '71e8c71c98e8595d6727bb840067ad93'
    }
  }

  async getWeatherDataCache(key) {
    return new Promise((done) => {
      chrome.storage.local.get([key], (result) => {
        done(result[key])
      });
    })
  }

  get5DaysWeather() {
    return new Promise((done) => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const api = `${this.BASE.api}forecast?units=${this.BASE.units}&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${this.BASE.key}`
        const resp = await fetch(api)
        const weather = await resp.json()
        chrome.storage.local.set({'5DaysWeather': JSON.stringify(weather)})
        done(weather)
      })
    })
  }

  getCurrentWeather() {
    return new Promise((done) => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const api = `${this.BASE.api}weather?&units=${this.BASE.units}&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&APPID=${this.BASE.key}`
        const resp = await fetch(api)
        const weather = await resp.json()
        chrome.storage.local.set({'CurrentWeather': JSON.stringify(weather)})
        done(weather)
      })
    })
  }

}
