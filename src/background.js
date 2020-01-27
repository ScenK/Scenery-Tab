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
      },
      FLICKR: {
        url: 'https://api.flickr.com/services/rest?',
        name: 'flickr',
        secret: 'a6fe68710a02e56d',
        key: '9e1ae36ae02fffc9718fd0693ec97eb2'
      }

    }
  }

  async getFlickrImage() {
    const nsid = '91805169@N04'
    // const api = (`${this.API.FLICKR.url}method=flickr.photos.search&text=travel 1080&media=photo&in_gallery=true&extras=original_format&format=json&nojsoncallback=1&api_key=${this.API.FLICKR.key}`)
    const api = (`${this.API.FLICKR.url}method=flickr.people.getPhotos&extras=original_format&format=json&nojsoncallback=1&api_key=${this.API.FLICKR.key}&secret=${this.API.FLICKR.secret}&user_id=${nsid}`)
    const resp = await fetch(api)
    return await resp.json()
  }

  async getNewImageIndex() {
    return new Promise((done) => {
      chrome.storage.sync.get(['imageIndex'], (result) => {
        const index = result.imageIndex ? result.imageIndex : 0
        chrome.storage.sync.set({imageIndex: index >= 7 ? 0 : index + 1}, () => {
          done(index)
        })
      });
    })
  }

  async getBingImage() {
    const randImage = await this.getNewImageIndex()
    const api = `${this.API.BING.url}&idx=${randImage}&n=10&mkt=en-US`
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

  async setFlickrImage() {
    const randImage = Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
    const resp = await this.getFlickrImage()
    const pickedPhoto = resp.photos.photo[randImage]
    const img = `https://farm${pickedPhoto.farm}.staticflickr.com/${pickedPhoto.server}/${pickedPhoto.id}_${pickedPhoto.secret}_b.jpg`
    const desc = resp.title
    try {
      document.getElementById('main').style.backgroundImage = `url(${img})`
      document.getElementById('image-desc').textContent = desc
    } catch (err) {

    }
    console.log(resp)
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
    // await this.sc.setNasaImage()
    // await this.sc.setFlickrImage()
    await this.sc.setBingImage()
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
  st.setWeather()
  st.setBingImage()
  st.setCurrentTime()
}

main()
