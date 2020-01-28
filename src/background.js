
class SceneryTab {

  constructor() {
    this.wp = new Wallpaper()
    this.wt = new Weather()
    this.ti = new Time()
  }

  async setWallpaper() {
    // await this.sc.setNasaImage()
    const randNum = Math.floor(Math.random() * 2) + 1
    if (randNum === 2) {
      await this.wp.setBingImage()
    } else {
      await this.wp.setPexelsImage()
    }
  }

  async setWeather() {
    const weatherData = await this.wt.getWeather()
    try {
      document.getElementById('temp').innerHTML = Math.floor(weatherData.main.temp)
      document.getElementById('location').textContent = weatherData.name
    } catch (err) {

    }
  }

  setCurrentTime() {
    const now = this.ti.getCurrentTime()
    try {
      document.getElementById('time').textContent = now
    } catch (err) {

    }
  }
}


(function main() {
  const st = new SceneryTab()
  st.setWeather()
  st.setWallpaper()
  st.setCurrentTime()
  document.getElementById('history').addEventListener('click', () => {
    chrome.tabs.create({ "url": "chrome://history", "active": true });
  })
  document.getElementById('bookmark').addEventListener('click', () => {
    chrome.tabs.create({ "url": "chrome://bookmarks", "active": true });
  })
  document.getElementById('apps').addEventListener('click', () => {
    chrome.tabs.create({ "url": "https://chrome.google.com/webstore/category/extensions", "active": true });
  })
})()
