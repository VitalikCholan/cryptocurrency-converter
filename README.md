# Cryptocurrency converter as a Chrome Extension

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

1. Download the extension from Chrome Web Store (Beta) [Chrome Web Store](https://chromewebstore.google.com/detail/real-time-crypto-converte/dnfocjpjaglnigbplikafphehmagblif?authuser=2&hl=en) (Beta)
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
