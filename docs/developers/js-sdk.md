---
sidebar_position: 2
---

# JavaScript SDK

Official JavaScript/TypeScript SDK for Sonova integration.

## 📦 Installation

```bash
npm install @sonova/sdk
# or
yarn add @sonova/sdk
```

## 🚀 Quick Start

```javascript
import { SonovaSDK } from '@sonova/sdk';

const sonova = new SonovaSDK({
  apiKey: 'your-api-key',
  network: 'soneium'
});

// Get collection data
const collection = await sonova.collections.get('collection-id');
```

## 🔧 Features

- **TypeScript Support**: Full type definitions
- **Async/Await**: Modern promise-based API
- **Error Handling**: Comprehensive error types
- **Caching**: Built-in response caching

Coming soon - detailed SDK documentation will be added. 