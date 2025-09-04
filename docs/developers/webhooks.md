---
sidebar_position: 5
---

# Webhooks

Real-time event notifications for your applications.

## 🔔 Event Types

- **`nft.minted`** - New NFT minted
- **`nft.sold`** - NFT sale completed
- **`nft.listed`** - NFT listed for sale
- **`collection.created`** - New collection created

## 🛠️ Setup

1. Configure webhook URL in your dashboard
2. Verify webhook endpoint
3. Handle incoming events
4. Implement retry logic for failed deliveries

## 📝 Example Payload

```json
{
  "event": "nft.sold",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "nft_id": "12345",
    "collection_id": "collection-abc",
    "price": "0.5",
    "currency": "ETH",
    "buyer": "0x123...",
    "seller": "0x456..."
  }
}
```

Coming soon - detailed webhook documentation will be added. 