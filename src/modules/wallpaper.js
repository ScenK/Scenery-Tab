class Wallpaper {
  constructor() {
    this.API = {
      BING: {
        url: 'https://www.bing.com/HPImageArchive.aspx?format=js',
        mkt: [
          "ar-XA", "bg-BG", "cs-CZ", "da-DK", "de-AT", "de-CH", "de-DE", "el-GR", "en-AU", "en-CA", "en-GB", "en-ID", "en-IE", "en-IN",
          "en-MY", "en-NZ", "en-PH", "en-SG", "en-US", "en-XA", "en-ZA", "es-AR", "es-CL", "es-ES", "es-MX", "es-US", "es-XL", "et-EE",
          "fi-FI", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "he-IL", "hr-HR", "hu-HU", "it-IT", "ja-JP", "ko-KR", "lt-LT", "lv-LV", "nb-NO",
          "nl-BE", "nl-NL", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "ru-RU", "sk-SK", "sl-SL", "sv-SE", "th-TH", "tr-TR", "uk-UA", "zh-CN",
          "zh-HK", "zh-TW"
        ],
        name: 'bing'
      },
      NASA: {
        url: 'https://api.nasa.gov/planetary/apod?',
        name: 'nasa',
        key: ''
      },
      PEXELS: {
        // url: 'https://api.pexels.com/v1/curated?',
        url: 'https://api.pexels.com/v1/search?',
        name: 'pexels',
        key: ''
      }
    }
  }

  async getPexelsImage() {
    const randImage = Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 1000
    // const api = `${this.API.PEXELS.url}per_page=1&page=${randImage}`
    const api = `${this.API.PEXELS.url}query=scenery landscape&per_page=1&page=${randImage}`
    const resp = await fetch(api, {
      headers: { Authorization: this.API.PEXELS.key }
    })
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

  async getNewMktIndex() {
    return new Promise((done) => {
      chrome.storage.sync.get(['mktIndex'], (result) => {
        const index = result.mktIndex ? result.mktIndex : 0
        chrome.storage.sync.set({mktIndex: index >= 56 ? 0 : index + 1}, () => {
          done(index)
        })
      });
    })
  }

  async getBingImage() {
    // const randMkt = Math.floor(Math.random() * 56) + 1; // returns a random integer from 1 to 56
    // const randImage = Math.floor(Math.random() * 6) + 1; // returns a random integer from 1 to 56
    const randMkt = await this.getNewMktIndex()
    const randImage = await this.getNewImageIndex()
    const api = `${this.API.BING.url}&idx=${randImage}&n=10&mkt=${this.API.BING.mkt[randMkt]}`
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

  async setPexelsImage() {
    const resp = await this.getPexelsImage()
    const img = resp.photos[0].src.original
    // const img = resp.photos[0].src.large2x
    const desc = resp.photos[0].photographer
    try {
      document.getElementById('main').style.backgroundImage = `url(${img})`
      document.getElementById('image-desc').textContent = desc
    } catch (err) {
      console.error(err)
    }
  }

  async setNasaImage() {
    const resp = await this.getNasaImage()
    const img = resp.hdurl
    const desc = resp.title
    try {
      document.getElementById('main').style.backgroundImage = `url(${img})`
      document.getElementById('image-desc').textContent = desc
    } catch (err) {
      console.error(err)
    }
  }

  async setBingImage() {
    const resp = await this.getBingImage()
    const img = resp.images[0].url
    const desc = resp.images[0].title
    try {
      document.getElementById('main').style.backgroundImage = `url(https://bing.com${img})`
      document.getElementById('image-desc').textContent = desc
    } catch (err) {
      console.error(err)
    }
  }
}
