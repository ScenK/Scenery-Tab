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
    const celsius = await this.wt.getCelsiusUnit()
    const weatherData = cached ? JSON.parse(await this.wt.getWeatherDataCache('CurrentWeather')) : await this.wt.getCurrentWeather()
    if (!weatherData || weatherData.status === 'empty') {
      return
    }

    if (weatherData) {
      this.set5DaysWeather(weatherData, celsius)
    }
    if (this.debug) {
      console.debug('weatherData', weatherData)
    }

    const curretTemp = Math.floor(this.wt.formatTemp(weatherData.current_observation.condition.temperature, celsius))
    const icon = this.wt.weatherIcon[weatherData.current_observation.condition.code]
    const symbol = celsius ? '&#8451' : '&#8457'
    const currentCondition = weatherData.current_observation.condition.text
    try {
      // set today's info in the detail container
      document.querySelector('.top .date').textContent = new Date().toLocaleDateString('en-US', {weekday: 'long'})
      document.querySelector('.top a').title = currentCondition
      document.querySelector('.top .main-icon .wi').classList.add(icon)
      document.querySelector('.top .detail .current').innerHTML = `${curretTemp}${symbol}`

      // set main
      document.getElementById('temp').innerHTML = curretTemp
      document.getElementById('temp-symbol').innerHTML = symbol
      document.querySelector('#weather-icon .wi').classList.add(icon)
      document.querySelector('#weather-icon a').title = currentCondition
      document.getElementById('location').textContent = weatherData.location.city
    } catch (err) {
      console.error(err)
    }
  }

  async set5DaysWeather(weatherData, celsius = false) {
    const container = document.getElementById('full-weather')

    // clean old elements
    document.querySelectorAll(".day-clone").forEach(e => e.parentNode.removeChild(e));

    const fiveDaysData = weatherData.forecasts.slice(0, 6)

    for (let i = 0; i < fiveDaysData.length; i++) {
      const date = fiveDaysData[i].day
      const icon = this.wt.weatherIcon[fiveDaysData[i].code]
      const high = this.wt.formatTemp(fiveDaysData[i].high, celsius)
      const low = this.wt.formatTemp(fiveDaysData[i].low, celsius)
      const text = fiveDaysData[i].text

      if (i === 0) {
        // set today's additional info in the detail container
        document.querySelector('.top .high').textContent = `Max: ${Math.floor(high)}`
        document.querySelector('.top .low').textContent = `Min: ${Math.floor(low)}`

      } else {
        const dayClone = container.querySelector('.day').cloneNode(true)

        dayClone.title = text
        try {
          dayClone.querySelector('.date').textContent = date
          dayClone.querySelector('.weather .wi').classList = `wi ${icon}`
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
    chrome.tabs.update({ "url": "https://chrome.google.com/webstore/category/extensions", "active": true });
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

  // update the latest weather data
  await st.setWeather(false)
})()
