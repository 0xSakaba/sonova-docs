---
sidebar_position: 1
---

# API Reference

Complete API documentation for Sonova marketplace integration.

## 🚀 Base Information

- **Base URL**: `https://api.sonova.one`
- **Authentication**: Session-based authentication for user-specific operations
- **Primary Network**: Soneium (Chain ID: 1868)
- **Secondary Network**: Polygon (Chain ID: 137)
- **Response Format**: JSON

## 📋 API Versions Overview

Sonova marketplace provides multiple API versions:

### **v1 API** - Core Marketplace Operations
- Collection management
- Token operations  
- Wallet services
- Market data
- Launchpad operations

### **v4 API** - Enhanced Analytics & Ranking
- Advanced collection ranking with trend analysis
- Enhanced pagination (offset/limit vs page/pageSize)
- Real-time analytics with fine-grained time ranges
- ERC-1155 support
- Performance optimizations

## 🔐 Authentication

### Session Management

#### Create Session (Login)
```http
POST /users/sessions/create
Content-Type: application/json

{
  "signature": "0x...",
  "message": "Login message signed by wallet"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "session-token-here",
    "user": {
      "id": 123,
      "address": "0x...",
      "created_at": 1234567890
    }
  }
}
```

#### Destroy Session (Logout)
```http
POST /users/sessions/destroy
Authorization: Bearer <session-token>
```

#### Get Current User
```http
GET /users/me
Authorization: Bearer <session-token>
```

## 🎨 Collection Operations (v1)

### Collection Information

#### Get Collection Detail
```http
GET /v1/{network_id}/contracts/{contract_or_slug}/detail
```

**Parameters:**
- `network_id`: 1868 (Soneium) or 137 (Polygon)
- `contract_or_slug`: Contract address or collection slug

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "contract": "0x...",
    "name": "Collection Name",
    "symbol": "SYMBOL",
    "verified": true,
    "erc_type": 721,
    "slug": "collection-slug",
    "icon_url": "https://...",
    "total_supply": 10000,
    "description": "Collection description"
  }
}
```

#### Get Collection by ID
```http
GET /v1/{network_id}/contracts/{contract_id}
```

#### Get Collection Fees
```http
GET /v1/{network_id}/contracts/{contract_or_slug}/fees?market={market_id}
```

**Parameters:**
- `market`: Market identifier (0=OpenSea, 1=Sonova)

#### Search Collections
```http
GET /v1/{network_id}/contracts/search?keyword={keyword}&erc_type={type}
```

**Parameters:**
- `keyword`: Search term
- `erc_type`: Optional filter (721, 1155)

#### Get Collection Traits
```http
GET /v1/{network_id}/contracts/{contract_id}/trait_aggregation
```

### Collection Interactions (Requires Authentication)

#### Like Collection
```http
POST /v1/{network_id}/contracts/{contract_id}/like
Authorization: Bearer <session-token>
```

#### Unlike Collection
```http
POST /v1/{network_id}/contracts/{contract_id}/unlike
Authorization: Bearer <session-token>
```

#### Get Liked Collections
```http
GET /v1/{network_id}/contracts/liked
Authorization: Bearer <session-token>
```

## 🛒 Market Operations (v1)

### Collection Market Data

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

#### Get Collection Events
```http
POST /v1/{network_id}/collections/{contract_or_slug}/events
Content-Type: application/json

{
  "types": ["0", "1", "2"],
  "limit": 20,
  "offset": 0
}
```

**Event Types:**
- `0`: List
- `1`: Sale  
- `2`: Cancel

#### Get Collection Chart Data
```http
GET /v1/{network_id}/collections/{contract_or_slug}/chart?type={chart_type}&time={time_period}
```

**Parameters:**
- `type`: Chart type (0=Volume, 1=Sales)
- `time`: Time period (1H, 4H, 1D, 7D, 30D)

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

### NFT Operations

#### Get NFT Information
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

## 👛 Wallet Operations (v1)

### Wallet Information

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

## 🚀 Launchpad Operations

### Launchpad Information

#### List Launchpads
```http
GET /events?network_id={network_id}
```

#### Get Launchpad Details
```http
GET /events/{slug}
```

### Launchpad Interactions (Requires Authentication)

#### Sign Launchpad Event
```http
POST /events/{slug}/sign
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "mint_amount": 1
}
```

#### Get Event Stages
```http
GET /events/{slug}/stages
Authorization: Bearer <session-token>
```

## 📊 Enhanced Analytics (v4)

### Collection Ranking

#### Get Enhanced Collection Ranking
```http
GET /{network_id}/collection/v4/ranking/overall?order={order}&range={range}&sort={sort}&including_1155={boolean}&limit={limit}&offset={offset}
```

**Parameters:**
- `order` (required): `volume` | `sales`
- `range` (required): `5m` | `15m` | `1h` | `1d` | `7d` | `30d` | `90d`
- `sort` (optional): `desc` | `asc` (default: `desc`)
- `including_1155` (optional): Include ERC-1155 collections (default: `true`)
- `limit` (optional): Items per page (default: `100`, max: `999`)
- `offset` (optional): Items to skip (default: `0`)

**Enhanced Response Structure:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "collection": {
          "id": 123,
          "contract": "0x...",
          "name": "Collection Name",
          "symbol": "SYMBOL",
          "verified": true,
          "icon_url": "https://...",
          "slug": "collection-slug"
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
        "collectionAddress": "0x...",
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

#### Get Simplified Collection Ranking
```http
GET /collections/{network_id}/ranking/v4/2/overall?order={order}&range={range}&including_1155={boolean}&limit={limit}&offset={offset}
```

Returns simplified collection data with reduced payload for better performance.

### User Analytics (Requires Authentication)

#### Get User Liked Collections with Analytics
```http
GET /{network_id}/collection/v4/likes?order={order}&range={range}&sort={sort}&including_1155={boolean}&limit={limit}&offset={offset}
Authorization: Bearer <session-token>
```

Uses same parameters and response structure as collection ranking.

## 🔄 Response Formats

### Standard Response
```json
{
  "success": boolean,
  "data": any,
  "code": number,
  "msg": string
}
```

### v4 Pagination (Modern)
```json
{
  "data": [...],
  "limit": 100,
  "offset": 0,
  "total": 500,
  "count": 100
}
```

### v1 Pagination (Legacy)
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

### Error Response
```json
{
  "success": false,
  "code": 400,
  "msg": "Error description"
}
```

## 🆚 Version Comparison

### v1 vs v4 Key Differences

| Feature | v1 | v4 |
|---------|----|----|
| **Scope** | All marketplace operations | Analytics & ranking only |
| **Pagination** | `page`/`pageSize` | `offset`/`limit` |
| **Time Ranges** | Basic (1d, 7d, 30d) | Extended (5m, 15m, 1h, 1d, 7d, 30d, 90d) |
| **Trend Analysis** | ❌ | ✅ Floor/volume change indicators |
| **Quality Metrics** | ❌ | ✅ Gold mark for premium collections |
| **ERC-1155 Support** | Limited | ✅ Native support |
| **Performance** | Standard | ✅ Optimized caching |

### Data Enhancement in v4

**v4 adds these analytics fields:**
- `floorDiff1d`: 1-day floor price change percentage
- `floorDiff7d`: 7-day floor price change percentage  
- `volumeChange`: Volume change percentage
- `salesChange`: Sales count change percentage
- `gold_mark`: Premium collection indicator

## 📋 Network Support

### Supported Networks
- **Soneium**: Chain ID `1868` (Primary)
- **Polygon**: Chain ID `137` (Secondary)

### Network-Specific Routing
Most endpoints use `/{network_id}/` prefix for network-specific operations.

## 🔐 Authentication Requirements

| Operation Type | Authentication |
|----------------|----------------|
| Public collection info | ❌ None |
| Market data | ❌ None |
| Analytics/ranking | ❌ None |
| Like/unlike collections | ✅ Session required |
| User liked collections | ✅ Session required |
| Launchpad interactions | ✅ Session required |
| User profile | ✅ Session required |

## 📊 Rate Limits

- Standard rate limiting applies to all endpoints
- v4 endpoints benefit from enhanced caching
- No specific rate limits documented

## 🚨 Important Notes

1. **No Official SDK**: Currently no official JavaScript or Python SDK available
2. **Direct HTTP Integration**: Use standard HTTP clients (fetch, axios, requests, etc.)
3. **Consistent URL Structure**: Always check endpoint paths - some use `/api/` prefix, others don't
4. **Network ID Required**: Most operations require explicit network ID specification
5. **Error Handling**: Always check `success` field in responses before accessing `data`

---

> **Engineering Note**: This documentation reflects the actual API implementation as found in the `uniapi-go` backend code. All endpoints and parameters have been verified against the source code to ensure accuracy.

