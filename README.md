# Scenery Tab Chrome Extention

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](#contribution)
- [Privacy Policy](./privacy.md)

## About <a name = "about"></a>

The initial motivation for creating this extension was to replace the dead 'Dream After' extension that I had been using many years.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

If you are new to the chrome extension development, I highly recommend reading the official document first.

```
https://developer.chrome.com/extensions
```

This is the reference for the available API from chrome.
```
https://developer.chrome.com/extensions/api_index
```

### Installing

Download the source code, fill in the api value in the `wallpaper.js` and `weather.js` by registing the free developer program on `PEXELS` and `Open Weather`.

- PEXEL images:
```
PEXELS: {
  // url: 'https://api.pexels.com/v1/curated?',
  url: 'https://api.pexels.com/v1/search?',
  name: 'pexels',
  key: ''
}
```

- Open Weather Api:
```
class Weather {
  constructor() {
    this.BASE = {
      api: "https://api.openweathermap.org/data/2.5/onecall",
      key: "",
    };
```

Install the unpacked extension on the browser:
```
Open the Extension Management page by navigating to chrome://extensions.

Enable Developer Mode by clicking the toggle switch next to Developer mode.

Click the LOAD UNPACKED button and select the extension directory.
```


## Usage <a name = "usage"></a>

The released version can be installed on the Chrome App Store:
  https://chrome.google.com/webstore/detail/scenery-tab/nfbonabaanjojlhechnjjakifgdncbgb

## Contributing <a name = "contribution"></a>

Any ideas or development contributions are wellcome.


