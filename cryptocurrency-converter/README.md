# CryptocurrencyConverter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Description

Real-Time Crypto Rate Calculator is a Chrome extension that provides instant cryptocurrency conversions using live market data. Built with Angular 17, this extension offers a seamless way to convert between cryptocurrencies and fiat currencies.

## Features

- **Real-Time Conversions**: Get live conversion rates between cryptocurrencies and fiat currencies
- **Bidirectional Conversion**: Switch easily between crypto-to-fiat and fiat-to-crypto conversions
- **Smart Search**: Quick search functionality for both cryptocurrencies and fiat currencies
- **Live Updates**: Real-time price updates from CoinMarketCap API
- **User-Friendly Interface**: Clean, intuitive design with responsive feedback
- **Precise Calculations**: Support for both large and small amounts with appropriate decimal precision

## Technical Stack

- Angular 18 
- TypeScript
- RxJS
- CoinMarketCap API
- Chrome Extension APIs

## Installation

1. Download the extension from Chrome Web Store (Beta)
2. Click "Add to Chrome"
3. Access the converter by clicking the extension icon in your browser

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your CoinMarketCap API key:
   ```
   API_KEY=your_api_key_here
   ```
4. Run development server:
   ```bash
   ng serve
   ```
5. Build extension:
   ```bash
   ng build
   ```

## Usage

1. Click the extension icon in Chrome
2. Enter the amount you want to convert
3. Select or search for the cryptocurrency
4. Choose your target fiat currency
5. Get instant conversion results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

