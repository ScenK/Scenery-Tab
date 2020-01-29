class SceneryTab {

  constructor() {
    this.debug = false
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

  async setWeather(cached = false) {
    const weatherData = cached ? await this.wt.getWeatherDataCache('CurrentWeather') : await this.wt.getCurrentWeather()
    if (!weatherData) {
      return
    }

    if (!cached) {
      this.set5DaysWeather()
    }
    if (this.debug) {
      console.debug('weatherData', weatherData)
    }

    try {
      // set today
      document.querySelector('.top a').title = weatherData.weather[0].main
      document.querySelector('.top .main-icon img').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      document.querySelector('.top .detail .current').innerHTML = `${Math.floor(weatherData.main.temp)}&#8457`

      // set main
      document.getElementById('temp').innerHTML = Math.floor(weatherData.main.temp)
      document.querySelector('#weather-icon img').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      document.querySelector('#weather-icon a').title = weatherData.weather[0].main
      document.getElementById('location').textContent = weatherData.name

    } catch (err) {

    }
  }

  async set5DaysWeather() {
    const weatherData = await this.wt.get5DaysWeather()
    const fiveDaysData = []

    for (let i = 0; i < weatherData.list.length; i++) {
      const day = weatherData.list[i].dt_txt.split(' ')[0]
      const icon = weatherData.list[i].weather[0].icon
      const high = weatherData.list[i].main.temp_max
      const low = weatherData.list[i].main.temp_min

      const included = fiveDaysData.filter((i) => i.day === day)
      if (included.length > 0) {
        included[0].high = included[0].high > high ? included[0].high : high
        included[0].low = included[0].low < low ? included[0].low : low
      } else {
        fiveDaysData.push({
          day,
          icon,
          high,
          low
        })
      }
    }

    if (this.debug) {
      console.debug('5DaysWeatherData', fiveDaysData)
    }

    const container = document.getElementById('full-weather')
    for (let i = 0; i < fiveDaysData.length; i++) {
      const date = fiveDaysData[i].day.split('-')
      const formatedDate = `${date[1]}/${date[2]}/${date[0]}`
      const icon = fiveDaysData[i].icon
      const high = fiveDaysData[i].high
      const low = fiveDaysData[i].low

      if (i === 0) {
        // set today
        document.querySelector('.top .date').textContent = new Date(formatedDate).toLocaleString(chrome.i18n.getUILanguage(), {weekday:'long'})
        document.querySelector('.top .main-icon img').src = `https://openweathermap.org/img/wn/${icon}@2x.png`
        document.querySelector('.top .high').textContent = `Max: ${Math.floor(high)}`
        document.querySelector('.top .low').textContent = `Min: ${Math.floor(low)}`
      }

      const dayClone = container.querySelector('.day').cloneNode(true)

      dayClone.querySelector('.date').textContent = new Date(formatedDate).toLocaleString(chrome.i18n.getUILanguage(), {weekday:'short'})
      dayClone.querySelector('.weather img').src = `https://openweathermap.org/img/wn/${icon}@2x.png`
      dayClone.querySelector('.high').textContent = Math.floor(high)
      dayClone.querySelector('.low').textContent = Math.floor(low)
      dayClone.classList.add('day-clone');
      container.querySelector('.bottom').appendChild(dayClone)
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


(async function main() {
  const st = new SceneryTab()
  // use cached weather data
  st.setWallpaper()
  st.setCurrentTime()
  await st.setWeather(true)

  // update the latest weather data
  st.setWeather(false)

  document.getElementById('history').addEventListener('click', () => {
    chrome.tabs.create({ "url": "chrome://history", "active": true });
  })
  document.getElementById('bookmark').addEventListener('click', () => {
    chrome.tabs.create({ "url": "chrome://bookmarks", "active": true });
  })
  document.getElementById('apps').addEventListener('click', () => {
    chrome.tabs.create({ "url": "https://chrome.google.com/webstore/category/extensions", "active": true });
  })
  document.getElementById('weather').addEventListener('mouseover', () => {
    document.getElementById('full-weather').classList.remove('hide')
  })
  document.getElementById('full-weather').addEventListener('mouseout', () => {
    document.getElementById('full-weather').classList.add('hide')
  })
})()
