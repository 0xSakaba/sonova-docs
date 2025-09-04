---
sidebar_position: 3
---

# Python SDK

Official Python SDK for Sonova integration.

## 📦 Installation

```bash
pip install sonova-sdk
```

## 🚀 Quick Start

```python
from sonova import SonovaClient

client = SonovaClient(api_key='your-api-key')

# Get collection data
collection = client.collections.get('collection-id')
print(collection.name)
```

## 🔧 Features

- **Type Hints**: Full type annotation support
- **Async Support**: Both sync and async clients
- **Pagination**: Easy result pagination
- **Error Handling**: Custom exception types

Coming soon - detailed SDK documentation will be added. 