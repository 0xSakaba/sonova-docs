---
sidebar_position: 1
---

# API Reference

Complete public API documentation for Sonova marketplace integration.

## 🚀 Getting Started

- **Base URL**: `https://api.sonova.one/`
- **Authentication**: Session-based authentication for user-specific operations
- **Network**: Primary support for Soneium (Chain ID: 1868)
- **Response Format**: JSON

> **Note**: This documentation covers all publicly available endpoints for third-party developers.

## 🔐 Authentication

### Session Authentication
User authentication is required for certain operations like liking collections and accessing user-specific data.

#### Create User Session (Login)
```http
POST /api/users/sessions/create
Content-Type: application/json

{
  "signature": "0x...",
  "message": "..."
}
```

#### Destroy Session (Logout)
```http
POST /api/users/sessions/destroy
Authorization: Bearer <session-token>
```

#### Get Current User Info
```http
GET /api/users/me
Authorization: Bearer <session-token>
```

## 🎨 Collection Information

#### Get Collection Detail
```http
GET /api/v1/{network_id}/contracts/{contract_or_slug}/detail
```

#### Get Collection by ID
```http
GET /api/v1/{network_id}/contracts/{contract_id}
```

#### Get Collection Fees
```http
GET /api/v1/{network_id}/contracts/{contract_or_slug}/fees?market={market_id}
```

#### Search Collections
```http
GET /api/v1/{network_id}/contracts/search?keyword={keyword}&erc_type={type}
```

#### Get Collection Traits
```http
GET /api/v1/{network_id}/contracts/{contract_id}/trait_aggregation
```

#### Like/Unlike Collection
```http
POST /api/v1/{network_id}/contracts/{contract_id}/like
POST /api/v1/{network_id}/contracts/{contract_id}/unlike
Authorization: Bearer <session-token>
```

#### Get Liked Collections
```http
GET /api/v1/{network_id}/contracts/liked
Authorization: Bearer <session-token>
```

## 🛒 Market & Trading

#### Get Collection NFTs with Orders
```http
POST /api/v1/{network_id}/collections/{contract_or_slug}/nfts
Content-Type: application/json

{
  "limit": 20,
  "offset": 0,
  "price_min": 0.1,
  "price_max": 10,
  "rank_min": 1,
  "rank_max": 1000,
  "currency": "ETH",
  "trait_filters": [
    {
      "name": "Background",
      "values": ["Blue", "Red"]
    }
  ],
  "query": "search_term"
}
```

#### Get Collection Offers
```http
GET /api/v1/{network_id}/collections/{contract_or_slug}/offers?currency={currency}
```

#### Check Collection Offers
```http
POST /api/v1/{network_id}/collections/{contract_or_slug}/offers
Content-Type: application/json

{
  "amount": "1000000000000000000",
  "currency": "ETH"
}
```

#### Get Collection Events/Activities
```http
POST /api/v1/{network_id}/collections/{contract_or_slug}/events
Content-Type: application/json

{
  "types": ["0", "1", "2"],
  "limit": 20,
  "offset": 0
}
```

#### Get Collection Chart Data
```http
GET /api/v1/{network_id}/collections/{contract_or_slug}/chart?type={chart_type}&time={time_period}
```

#### Get Collection Floor Price
```http
GET /api/v1/{network_id}/collections/{contract_or_slug}/floor
```

#### Get Collection Sales
```http
POST /api/v1/{network_id}/collections/{contract_or_slug}/sales
Content-Type: application/json

{
  "limit": 20,
  "offset": 0
}
```

#### Get NFT Information with Orders
```http
POST /api/v1/{network_id}/nfts
Content-Type: application/json

{
  "nft_ids": [1, 2, 3]
}
```

#### Get NFT Trait Floor Prices
```http
POST /api/v1/{network_id}/nfts/trait_floor
Content-Type: application/json

{
  "nft_ids": [1, 2, 3]
}
```

## 👛 Wallet Services

#### Get Wallet Collections
```http
GET /api/v1/{network_id}/wallets/{wallet_address}/collections?contract={contract}&erc_type={type}
```

#### Get Wallet Tokens
```http
GET /api/v1/{network_id}/wallets/{wallet_address}/tokens?contract={contract}&erc_type={type}&offset={offset}&limit={limit}
```

#### Get Wallet Listed Tokens
```http
GET /api/v1/{network_id}/wallets/{wallet_address}/listed?contract={contract}&erc_type={type}&source={source}&offset={offset}&limit={limit}
```

#### Get Wallet Offers
```http
GET /api/v1/{network_id}/wallets/{wallet_address}/offers?contract={contract}&offset={offset}&limit={limit}&currency={currency}
```

#### Get Wallet Offer Collections
```http
GET /api/v1/{network_id}/wallets/{wallet_address}/offer_collections?currency={currency}
```

#### Get Wallet Portfolio
```http
GET /api/v1/{network_id}/wallets/{wallet_address}/portfolio
```

## 🚀 Launchpad & Events

#### List Launchpads
```http
GET /api/events?network_id={network_id}
```

#### Get Launchpad Details
```http
GET /api/events/{slug}
```

#### Sign Launchpad Event
```http
POST /api/events/{slug}/sign
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "mint_amount": 1
}
```

#### Get Event Stages Info
```http
GET /api/events/{slug}/stages
Authorization: Bearer <session-token>
```

## 🔄 Response Format

Standard response format for all endpoints:

```json
{
  "success": boolean,
  "data": any,
  "code": number,
  "msg": string
}
```

### Error Responses
```json
{
  "success": false,
  "code": 400,
  "msg": "Error description"
}
```

## 📋 Network Support

- **Primary Network**: Soneium (Chain ID: 1868)
- **Additional Support**: Polygon (Chain ID: 137)

Most endpoints support network-specific routing via `/:network_id/` prefix.

## 🔐 Authentication Requirements

- **Session Auth**: User-specific operations, collection likes, launchpad interactions
- **Public**: Collection information, market data (no authentication required)

## 📊 Rate Limits

- **General API**: Standard rate limiting applies
- **Public endpoints**: Fair use policy

