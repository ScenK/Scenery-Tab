class SceneryTab {

  constructor() {
    this.debug = true
    this.wp = new Wallpaper()
    this.wt = new Weather()
    this.ti = new Time()

    this.isChromeStore = false;
    this.storeUrl = this.isChromeStore ? 'https://chrome.google.com/webstore/category/extensions'
      : 'https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home'
  }

  async setWallpaper() {
    const randNum = Math.floor(Math.random() * 2) + 1
    if (randNum === 2) {
      await this.wp.setBingImage()
    } else {
      await this.wp.setPexelsImage()
    }
  }

  async setWeather(cached = false) {
    const celsius = await this.wt.getCelsiusUnit()
    const weatherData = cached ? JSON.parse(await this.wt.getWeatherDataCache('CurrentWeather')) : await this.wt.getCurrentWeather()
    if (!weatherData || !weatherData.current || weatherData.status === 'empty') {
      return
    }

    if (weatherData) {
      this.set5DaysWeather(weatherData, celsius)
    }
    if (this.debug) {
      console.debug('weatherData', weatherData)
    }

    const curretTemp = Math.floor(this.wt.formatTemp(weatherData.current.temp, celsius))
    const icon = `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
    const symbol = celsius ? '&#8451' : '&#8457'
    const currentCondition = weatherData.current.weather[0].description
    try {
      // set today's info in the detail container
      document.querySelector('.top .date').textContent = new Date().toLocaleDateString('en-US', {weekday: 'long'})
      document.querySelector('.top a').title = currentCondition
      document.querySelector('.top .main-icon .wi').style.backgroundImage = `url(${icon})`
      document.querySelector('.top .detail .current').innerHTML = `${curretTemp}${symbol}`

      // set main
      document.getElementById('temp').innerHTML = curretTemp
      document.getElementById('temp-symbol').innerHTML = symbol
      document.querySelector('#weather-icon .wi').style.backgroundImage = `url(${icon})`
      document.querySelector('#weather-icon a').title = currentCondition
      document.getElementById('location').textContent = 'Current Location'
    } catch (err) {
      console.error(err)
    }
  }

  async set5DaysWeather(weatherData, celsius = false) {
    const container = document.getElementById('full-weather')

    // clean old elements
    document.querySelectorAll(".day-clone").forEach(e => e.parentNode.removeChild(e));

    const fiveDaysData = weatherData.daily.slice(0, 6)

    for (let i = 0; i < fiveDaysData.length; i++) {
      const currentWeather = fiveDaysData[i]
      const date = new Date(+currentWeather.dt * 1000).toDateString().split(' ')[0]
      const icon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`
      const high = this.wt.formatTemp(currentWeather.temp.max, celsius)
      const low = this.wt.formatTemp(currentWeather.temp.min, celsius)
      const text = currentWeather.weather[0].description

      if (i === 0) {
        // set today's additional info in the detail container
        document.querySelector('.top .high').textContent = `Max: ${Math.floor(high)}`
        document.querySelector('.top .low').textContent = `Min: ${Math.floor(low)}`

      } else {
        const dayClone = container.querySelector('.day').cloneNode(true)

        dayClone.title = text
        try {
          dayClone.querySelector('.date').textContent = date
          dayClone.querySelector('.weather .wi').style.backgroundImage = `url(${icon})`
          dayClone.querySelector('.high').textContent = Math.floor(high)
          dayClone.querySelector('.low').textContent = Math.floor(low)
          dayClone.classList.add('day-clone');
          container.querySelector('.bottom').appendChild(dayClone)
        } catch (err) {
          console.error(err)
        }
      }

    }
  }

  async setOppositeUnit() {
    const celsius = await this.wt.getCelsiusUnit()

    chrome.storage.local.set({'celsius': !celsius})
  }

  setCurrentTime() {
    const now = this.ti.getCurrentTime()
    try {
      document.getElementById('time').textContent = now
    } catch (err) {
      console.error(err)
    }
  }
}


(async function main() {
  const st = new SceneryTab()
  // use cached weather data
  st.setWallpaper()
  st.setCurrentTime()
  await st.setWeather(true)

  document.getElementById('history').addEventListener('click', () => {
    chrome.tabs.update({ "url": "chrome://history", "active": true });
  })
  document.getElementById('bookmark').addEventListener('click', () => {
    chrome.tabs.update({ "url": "chrome://bookmarks", "active": true });
  })
  document.getElementById('apps').addEventListener('click', () => {
    chrome.tabs.update({ "url": st.storeUrl, "active": true });
  })
  document.getElementById('weather').addEventListener('mouseover', () => {
    document.getElementById('full-weather').classList.remove('hide')
    document.getElementById('full-weather').classList.add('is-visible')
  })
  document.getElementById('weather').addEventListener('dblclick', async () => {
    await st.setOppositeUnit()
    await st.setWeather(true)
  })
  document.getElementById('full-weather').addEventListener('mouseout', () => {
    document.getElementById('full-weather').classList.remove('is-visible')
    document.getElementById('full-weather').classList.add('hide')
  })

  chrome.storage.local.get('WeatherUpdatedAt', async result => {
    if (!result['WeatherUpdatedAt'] || result['WeatherUpdatedAt'] - new Date().getHours() > 1) {
      // update the latest weather no sooner than one hour
      console.log('Update to the latest weather.')
      await st.setWeather(false)
    }
  });
})()
