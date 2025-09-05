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

## 📋 API Versions

Sonova marketplace provides multiple API versions to support different use cases:

### **v1 API** - Core Functionality
Primary API for basic marketplace operations including collections, tokens, and wallets.

### **v4 API** - Enhanced Analytics & Ranking
Advanced API specifically designed for ranking and collection analytics with improved data structures and performance.

**Key improvements in v4:**
- **Modern Pagination**: Uses `offset/limit` instead of `page/pageSize`
- **Enhanced Data**: Includes floor price trends, volume changes, and growth statistics
- **Better Performance**: Optimized caching and faster response times
- **ERC-1155 Support**: Native support for multi-token standards
- **Fine-grained Time Ranges**: Additional intervals (5m, 15m, 1h) for real-time analytics

## 🔐 Authentication

### Session Authentication
User authentication is required for certain operations like liking collections and accessing user-specific data.

#### Create User Session (Login)
```http
POST /users/sessions/create
Content-Type: application/json

{
  "signature": "0x...",
  "message": "..."
}
```

#### Destroy Session (Logout)
```http
POST /users/sessions/destroy
Authorization: Bearer <session-token>
```

#### Get Current User Info
```http
GET /users/me
Authorization: Bearer <session-token>
```

## 🎨 Collection Information (v1)

#### Get Collection Detail
```http
GET /v1/{network_id}/contracts/{contract_or_slug}/detail
```

#### Get Collection by ID
```http
GET /v1/{network_id}/contracts/{contract_id}
```

#### Get Collection Fees
```http
GET /v1/{network_id}/contracts/{contract_or_slug}/fees?market={market_id}
```

#### Search Collections
```http
GET /v1/{network_id}/contracts/search?keyword={keyword}&erc_type={type}
```

#### Get Collection Traits
```http
GET /v1/{network_id}/contracts/{contract_id}/trait_aggregation
```

#### Like/Unlike Collection
```http
POST /v1/{network_id}/contracts/{contract_id}/like
POST /v1/{network_id}/contracts/{contract_id}/unlike
Authorization: Bearer <session-token>
```

#### Get Liked Collections
```http
GET /v1/{network_id}/contracts/liked
Authorization: Bearer <session-token>
```

## 🛒 Market & Trading (v1)

#### Get Collection NFTs with Orders
```http
POST /v1/{network_id}/collections/{contract_or_slug}/nfts
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
GET /v1/{network_id}/collections/{contract_or_slug}/offers?currency={currency}
```

#### Check Collection Offers
```http
POST /v1/{network_id}/collections/{contract_or_slug}/offers
Content-Type: application/json

{
  "amount": "1000000000000000000",
  "currency": "ETH"
}
```

#### Get Collection Events/Activities
```http
POST /v1/{network_id}/collections/{contract_or_slug}/events
Content-Type: application/json

{
  "types": ["0", "1", "2"],
  "limit": 20,
  "offset": 0
}
```

#### Get Collection Chart Data
```http
GET /v1/{network_id}/collections/{contract_or_slug}/chart?type={chart_type}&time={time_period}
```

#### Get Collection Floor Price
```http
GET /v1/{network_id}/collections/{contract_or_slug}/floor
```

#### Get Collection Sales
```http
POST /v1/{network_id}/collections/{contract_or_slug}/sales
Content-Type: application/json

{
  "limit": 20,
  "offset": 0
}
```

#### Get NFT Information with Orders
```http
POST /v1/{network_id}/nfts
Content-Type: application/json

{
  "nft_ids": [1, 2, 3]
}
```

#### Get NFT Trait Floor Prices
```http
POST /v1/{network_id}/nfts/trait_floor
Content-Type: application/json

{
  "nft_ids": [1, 2, 3]
}
```

## 👛 Wallet Services (v1)

#### Get Wallet Collections
```http
GET /v1/{network_id}/wallets/{wallet_address}/collections?contract={contract}&erc_type={type}
```

#### Get Wallet Tokens
```http
GET /v1/{network_id}/wallets/{wallet_address}/tokens?contract={contract}&erc_type={type}&offset={offset}&limit={limit}
```

#### Get Wallet Listed Tokens
```http
GET /v1/{network_id}/wallets/{wallet_address}/listed?contract={contract}&erc_type={type}&source={source}&offset={offset}&limit={limit}
```

#### Get Wallet Offers
```http
GET /v1/{network_id}/wallets/{wallet_address}/offers?contract={contract}&offset={offset}&limit={limit}&currency={currency}
```

#### Get Wallet Offer Collections
```http
GET /v1/{network_id}/wallets/{wallet_address}/offer_collections?currency={currency}
```

#### Get Wallet Portfolio
```http
GET /v1/{network_id}/wallets/{wallet_address}/portfolio
```

## 🚀 Launchpad & Events

#### List Launchpads
```http
GET /events?network_id={network_id}
```

#### Get Launchpad Details
```http
GET /events/{slug}
```

#### Sign Launchpad Event
```http
POST /events/{slug}/sign
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "mint_amount": 1
}
```

#### Get Event Stages Info
```http
GET /events/{slug}/stages
Authorization: Bearer <session-token>
```

## 📊 Enhanced Analytics & Ranking (v4)

**v4 API provides enhanced analytics with improved performance and richer data structures.**

### Collection Ranking

#### Get Collections Ranking (Enhanced)
```http
GET /{network_id}/collection/v4/ranking/overall?order={order}&range={range}&sort={sort}&including_1155={boolean}&limit={limit}&offset={offset}
```

**Parameters:**
- `order` (required): `volume` | `sales`
- `range` (required): `5m` | `15m` | `1h` | `1d` | `7d` | `30d` | `90d`
- `sort` (optional): `desc` | `asc` (default: `desc`)
- `including_1155` (optional): Include ERC-1155 collections (default: `true`)
- `limit` (optional): Number of items per page (default: `100`, max: `999`)
- `offset` (optional): Number of items to skip (default: `0`)

**Enhanced Response Structure:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "collection": {
          "id": 123,
          "contract": "0x1234567890abcdef...",
          "name": "Example Collection",
          "symbol": "EXC",
          "verified": true,
          "icon_url": "https://...",
          "slug": "example-collection"
        },
        "floor": {
          "price": "1500000000000000000",
          "currency": "ETH",
          "usd_price": 2250.50
        },
        "floorDiff1d": 0.15,
        "floorDiff7d": -0.05,
        "volume": 125.75,
        "volumeChange": 0.23,
        "sales": 45,
        "salesChange": 0.12,
        "holders": 234,
        "items": 1000,
        "gold_mark": true,
        "collectionAddress": "0x1234567890abcdef...",
        "networkId": "1868"
      }
    ],
    "limit": 100,
    "offset": 0,
    "total": 500,
    "count": 100
  }
}
```

**Key Improvements over v1:**
- **Trend Analysis**: `floorDiff1d`, `floorDiff7d`, `volumeChange`, `salesChange`
- **Quality Indicators**: `gold_mark` for verified premium collections
- **Better Pagination**: `offset/limit` instead of `page/pageSize`
- **More Time Ranges**: Sub-hourly intervals for real-time monitoring

#### Get Collections Ranking (Simplified)
```http
GET /collections/{network_id}/ranking/v4/2/overall?order={order}&range={range}&including_1155={boolean}&limit={limit}&offset={offset}
```

Returns simplified collection data with reduced payload size for better performance.

### User Liked Collections

#### Get User Liked Collections (Enhanced)
```http
GET /{network_id}/collection/v4/likes?order={order}&range={range}&sort={sort}&including_1155={boolean}&limit={limit}&offset={offset}
Authorization: Bearer <session-token>
```

**Enhanced Features:**
- Same rich analytics data as ranking API
- Real-time statistics for user's liked collections
- Trend analysis for portfolio tracking
- Performance optimizations for large collections

## 🔄 Response Format

### Standard Response Format
All endpoints follow this consistent structure:

```json
{
  "success": boolean,
  "data": any,
  "code": number,
  "msg": string
}
```

### v4 Pagination Format
```json
{
  "data": [...],
  "limit": 100,
  "offset": 0,
  "total": 500,
  "count": 100
}
```

### v1 Pagination Format (Legacy)
```json
{
  "data": [...],
  "page": 1,
  "pageSize": 10,
  "total": 500,
  "count": 10,
  "next": 2
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

Most endpoints support network-specific routing via `/{network_id}/` prefix.

## 🔐 Authentication Requirements

- **Session Auth**: User-specific operations, collection likes, launchpad interactions
- **Public**: Collection information, market data (no authentication required)

## 📊 Rate Limits

- **General API**: Standard rate limiting applies
- **Public endpoints**: Fair use policy
- **v4 Endpoints**: Enhanced caching for better performance

## 🚀 Migration Guide

### From v1 to v4 (Ranking & Analytics)

**For Collection Ranking:**
```javascript
// v1 approach (basic)
GET /v1/{network_id}/collections/{contract}/stats

// v4 approach (enhanced)
GET /{network_id}/collection/v4/ranking/overall?order=volume&range=1d
```

**For User Liked Collections:**
```javascript
// v1 approach (basic pagination)
GET /v1/{network_id}/contracts/liked?page=1&pageSize=10

// v4 approach (enhanced analytics)
GET /{network_id}/collection/v4/likes?order=volume&range=7d&offset=0&limit=100
```

**Key Benefits of Migration:**
- 🚀 **Better Performance**: Optimized caching and faster response times
- 📈 **Trend Analysis**: Floor price and volume change indicators
- 🔢 **Flexible Pagination**: More intuitive offset/limit approach
- 🎯 **Enhanced Filtering**: ERC-1155 support and fine-grained time ranges
- 💎 **Quality Metrics**: Gold mark indicators for premium collections

