# Scenery Tab Browser Extension

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Development](#development)
- [Production](#production)
- [Usage](#usage)
- [Contributing](#contribution)
- [Privacy Policy](./privacy.md)

## About <a name="about"></a>

The initial motivation for creating this extension was to replace the dead 'Dream After' extension that I had been using for many years.

## Getting Started <a name="getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

If you are new to Browser extension development, I highly recommend reading the official documentation first.

```
https://developer.chrome.com/extensions
```

This is the reference for the available API from Chrome.
```
https://developer.chrome.com/extensions/api_index
```

### Installing

1. **Download the Source Code**: Clone the repository to your local machine.

2. **Set Up Environment Variables**: Create a `.env` file in the root directory of the project. Fill in the API keys by registering for the free developer programs on `PEXELS` and `Open Weather`.
  You can refer to the `.env.local.example` file for the structure.

   Example `.env` file:
   ```
   PEXELS_API_KEY=your_pexels_api_key
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   ```

3. **Configure API Endpoints**: The API keys will be automatically picked up from the `.env` file. Ensure that your `wallpaper.js` and `weather.js` files are set up to use these environment variables.

   - PEXELS images:
     ```javascript
     PEXELS: {
       url: 'https://api.pexels.com/v1/search?',
       name: 'pexels',
       key: process.env.PEXELS_API_KEY
     }
     ```

   - Open Weather API:
     ```javascript
     class Weather {
       constructor() {
         this.BASE = {
           api: "https://api.openweathermap.org/data/2.5/onecall",
           key: process.env.OPENWEATHERMAP_API_KEY,
         };
       }
     }
     ```

4. **Install Dependencies**: Run the following command to install the necessary dependencies:
   ```
   npm install
   ```

## Development <a name="development"></a>

To start developing the extension, follow these steps:

1. **Run the Development Server**: Use Webpack's development server to serve the extension locally.
   ```
   npm run start:chrome:dev
   npm run start:edge:dev
   ```

2. **Load the Unpacked Extension**:
   - Open the Extension Management page by navigating to `chrome://extensions`.
   - Enable Developer Mode by clicking the toggle switch next to Developer mode.
   - Click the LOAD UNPACKED button and select the ./dist directory.

3. **Hot Module Replacement**: The development server supports hot module replacement, allowing you to see changes in real-time without reloading the extension.

## Production <a name="production"></a>

To prepare the extension for production, follow these steps:

1. **Build the Extension**: Run the Webpack build scripts to create optimized production builds.
   ```
   npm run build:chrome:prod
   npm run build:edge:prod
   ```

2. **Package the Extension**: Zip the `dist` folder and upload it to the related Web Store.

## Contributing <a name="contribution"></a>

Any ideas or development contributions are welcome.
