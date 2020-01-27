class Scenery {
  constructor() {
    this.API = {
      BING: {
        url: 'https://www.bing.com/HPImageArchive.aspx?format=js',
        name: 'bing'
      },
      NASA: {
        url: 'https://api.nasa.gov/planetary/apod?',
        name: 'nasa',
        key: 'LVNeWXbmsardIBvstFHdPPfT8LGlbApoMprJMUhq'
      }
    }
  }

  async getBingImage() {
    const randImage = Math.floor(Math.random() * 7) + 1; // returns a random integer from 1 to 7
    const api = `${this.API.BING.url}&idx=${randImage}&n=100&mkt=en-US`
    console.log(api)
    const resp = await fetch(api)
    return await resp.json()
  }

  async getNasaImage() {
    const randomDate = new Date(
      new Date(2015, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2015, 0, 1).getTime()));
    const formatedDate = `${randomDate.getFullYear()}-${randomDate.getMonth()}-${randomDate.getDay()}`

    const api = `${this.API.NASA.url}date=${formatedDate}&hd=true&api_key=${this.API.NASA.key}`
    const resp = await fetch(api)
    return await resp.json()
  }

  async setNasaImage() {
    const resp = await this.getNasaImage()
    const img = resp.hdurl
    const desc = resp.title
    try {
      document.getElementById('main').style.backgroundImage = `url(${img})`
      document.getElementById('image-desc').textContent = desc
    } catch (err) {

    }
    console.log(resp)
  }

  async setBingImage() {
    const resp = await this.getBingImage()
    const img = resp.images[0].url
    const desc = resp.images[0].title
    try {
      document.getElementById('main').style.backgroundImage = `url(https://bing.com${img})`
      document.getElementById('image-desc').textContent = desc
    } catch (err) {

    }
    console.log(resp)
  }
}

class SceneryTab {

  constructor() {
    this.sc = new Scenery()
    this.BASE = {
      api: 'http://api.openweathermap.org/data/2.5/weather?&',
      units: 'imperial',
      key: '71e8c71c98e8595d6727bb840067ad93'
    }
  }

  getWeather() {
    return new Promise((done) => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const api = `${this.BASE.api}units=${this.BASE.units}&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&APPID=${this.BASE.key}`
        const resp = await fetch(api)
        const weather = await resp.json()
        done(weather)
      })
    })
  }

  async setWeather() {
    const weatherData = await this.getWeather()
    try {
      document.getElementById('temp').innerHTML = `${Math.floor(weatherData.main.temp)}&#8457`
      document.getElementById('location').textContent = weatherData.name
    } catch (err) {

    }
    console.log(weatherData)
  }

  async setBingImage() {
    await this.sc.setNasaImage()
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString(chrome.i18n.getUILanguage(), { hour12: true, hour: "numeric", minute: "numeric"});
  }

  setCurrentTime() {
    const now = this.getCurrentTime()
    try {
      document.getElementById('time').textContent = now
    } catch (err) {

    }
  }
}


async function main() {
  const st = new SceneryTab()
  // st.setWeather()
  st.setBingImage()
  st.setCurrentTime()
}

main()
