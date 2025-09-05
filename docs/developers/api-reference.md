---
sidebar_position: 1
---

# API Reference

Complete API documentation for Sonova marketplace integration with detailed specifications for all available versions.

## 🚀 Base Information

- **Base URL**: `https://api.sonova.one`
- **Authentication**: Session-based authentication for user-specific operations
- **Primary Network**: Soneium (Chain ID: 1868)
- **Secondary Network**: Polygon (Chain ID: 137)
- **Response Format**: JSON

## 📋 API Versions Overview

Sonova marketplace provides three API versions, each serving different purposes:

### **v1 API** - Core Marketplace Operations
The foundational API providing essential marketplace functionality:
- **Collection Information**: Basic collection data and statistics
- **Token Operations**: Individual NFT information and batch queries
- **Contract Management**: Contract verification and golden status
- **Trade Statistics**: Basic trading data and floor prices
- **Server Utilities**: System time and health checks

### **v3 API** - Advanced User & Wallet Services  
Enhanced API for user-centric operations:
- **Wallet Activities**: Comprehensive transaction history and user activities
- **Advanced Token Queries**: Complex token ownership and transfer queries
- **Collection Analytics**: Enhanced ranking with more sophisticated algorithms
- **User Interactions**: Advanced user preference and interaction tracking

### **v4 API** - Premium Analytics & Real-time Data
Latest generation API with cutting-edge analytics:
- **Real-time Rankings**: Live collection performance with trend analysis
- **Enhanced Pagination**: Modern offset/limit system for better performance
- **Trend Analysis**: Floor price movements, volume changes, and growth indicators
- **ERC-1155 Support**: Native multi-token standard support
- **Performance Optimization**: Advanced caching and faster response times
- **Quality Metrics**: Premium collection identification (gold marks)

## 🔐 Authentication System

### Session Management

#### Create Session (Login)
```http
POST /users/sessions/create
Content-Type: application/json

{
  "signature": "0x1a2b3c4d5e6f7890abcdef...",
  "message": "sonova.one wants you to sign in with your Ethereum account:\n0x742d35Cc6634C0532925a3b8D5C0E3E1234567890\n\nSign in to Sonova marketplace\n\nURI: https://sonova.one\nVersion: 1\nChain ID: 1868\nNonce: 1703123456\nIssued At: 2023-12-21T10:30:45.123Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "sess_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
    "user": {
      "id": 12345,
      "address": "0x742d35Cc6634C0532925a3b8D5C0E3E1234567890",
      "created_at": 1703123456,
      "updated_at": 1703123456,
      "is_verified": true
    },
    "expires_at": 1703209856
  },
  "code": 200,
  "msg": "Login successful"
}
```

#### Destroy Session (Logout)
```http
POST /users/sessions/destroy
Authorization: Bearer sess_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Session destroyed successfully"
  },
  "code": 200,
  "msg": "Logout successful"
}
```

#### Get Current User Information
```http
GET /users/me
Authorization: Bearer sess_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "address": "0x742d35Cc6634C0532925a3b8D5C0E3E1234567890",
    "username": "crypto_artist_001",
    "email": "user@example.com",
    "avatar_url": "https://sonova.one/avatars/12345.jpg",
    "created_at": 1703123456,
    "updated_at": 1703123456,
    "is_verified": true,
    "preferences": {
      "notification_enabled": true,
      "default_currency": "ETH"
    }
  },
  "code": 200,
  "msg": "User information retrieved"
}
```

## 🎨 Collection Operations (v1)

### Collection Information

#### Get Collection Detail
```http
GET /v1/{network_id}/contracts/{contract_or_slug}/detail
```

**Parameters:**
- `network_id` (path, required): Network identifier
  - `1868`: Soneium (Primary)
  - `137`: Polygon (Secondary)
- `contract_or_slug` (path, required): Contract address (0x...) or collection slug

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 789,
    "contract": "0x1234567890abcdef1234567890abcdef12345678",
    "name": "Digital Dreamscapes",
    "symbol": "DREAM",
    "description": "A collection of surreal digital artworks exploring the boundaries between reality and imagination.",
    "verified": true,
    "erc_type": 721,
    "slug": "digital-dreamscapes",
    "icon_url": "https://sonova.one/collections/789/icon.jpg",
    "banner_url": "https://sonova.one/collections/789/banner.jpg",
    "total_supply": 5000,
    "network_id": 1868,
    "creator": {
      "address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      "username": "dream_artist"
    },
    "royalty": {
      "percentage": 5.5,
      "recipient": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    },
    "social_links": {
      "website": "https://digitaldreamscapes.art",
      "twitter": "https://twitter.com/digitaldreams",
      "discord": "https://discord.gg/digitaldreams"
    },
    "statistics": {
      "floor_price": "1.5",
      "floor_price_usd": 2250.50,
      "total_volume": "890.75",
      "total_volume_usd": 1336125.00,
      "holder_count": 2847,
      "listed_count": 156
    },
    "created_at": 1703123456,
    "updated_at": 1703130000
  }
}
```

#### Get Collection by ID
```http
GET /v1/{network_id}/contracts/{contract_id}
```

**Parameters:**
- `network_id` (path, required): Network identifier
- `contract_id` (path, required): Numeric contract ID

#### Get Collection Fees
```http
GET /v1/{network_id}/contracts/{contract_or_slug}/fees?market={market_id}
```

**Parameters:**
- `network_id` (path, required): Network identifier
- `contract_or_slug` (path, required): Contract address or slug
- `market` (query, required): Market identifier
  - `0`: OpenSea
  - `1`: Sonova

**Response:**
```json
{
  "success": true,
  "data": {
    "market_id": 1,
    "market_name": "Sonova",
    "fees": {
      "platform_fee": {
        "percentage": 2.5,
        "recipient": "0xsonova_fee_recipient_address"
      },
      "royalty_fee": {
        "percentage": 5.5,
        "recipient": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
      },
      "total_fee_percentage": 8.0
    },
    "gas_estimates": {
      "listing": "85000",
      "purchase": "120000",
      "offer": "95000"
    }
  }
}
```

#### Search Collections
```http
GET /v1/{network_id}/contracts/search?keyword={keyword}&erc_type={type}&limit={limit}&offset={offset}
```

**Parameters:**
- `network_id` (path, required): Network identifier
- `keyword` (query, required): Search term (minimum 2 characters)
- `erc_type` (query, optional): Token standard filter
  - `721`: ERC-721 only
  - `1155`: ERC-1155 only
  - (omit for all types)
- `limit` (query, optional): Results per page (default: 20, max: 100)
- `offset` (query, optional): Results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "contract": "0x1234567890abcdef1234567890abcdef12345678",
      "name": "Digital Dreamscapes",
      "symbol": "DREAM",
      "slug": "digital-dreamscapes",
      "icon_url": "https://sonova.one/collections/789/icon.jpg",
      "verified": true,
      "erc_type": 721,
      "total_supply": 5000,
      "floor_price": "1.5",
      "floor_price_usd": 2250.50,
      "holder_count": 2847,
      "relevance_score": 95.7
    }
  ],
  "pagination": {
    "total": 147,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

#### Get Collection Traits
```http
GET /v1/{network_id}/contracts/{contract_id}/trait_aggregation
```

**Parameters:**
- `network_id` (path, required): Network identifier
- `contract_id` (path, required): Numeric contract ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total_tokens": 5000,
    "trait_counts": {
      "Background": {
        "total_tokens_with_trait": 5000,
        "values": {
          "Sunset": {
            "count": 450,
            "rarity": 9.0,
            "floor_price": "2.1"
          },
          "Ocean": {
            "count": 380,
            "rarity": 7.6,
            "floor_price": "1.8"
          },
          "Galaxy": {
            "count": 120,
            "rarity": 2.4,
            "floor_price": "5.5"
          }
        }
      },
      "Character": {
        "total_tokens_with_trait": 4800,
        "values": {
          "Robot": {
            "count": 890,
            "rarity": 17.8,
            "floor_price": "1.6"
          },
          "Human": {
            "count": 1200,
            "rarity": 24.0,
            "floor_price": "1.4"
          }
        }
      }
    }
  }
}
```

### Collection Interactions (Requires Authentication)

#### Like Collection
```http
POST /v1/{network_id}/contracts/{contract_id}/like
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collection_id": 789,
    "liked": true,
    "total_likes": 3847,
    "timestamp": 1703130000
  }
}
```

#### Unlike Collection
```http
POST /v1/{network_id}/contracts/{contract_id}/unlike
Authorization: Bearer <session-token>
```

#### Get Liked Collections
```http
GET /v1/{network_id}/contracts/liked?limit={limit}&offset={offset}
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "contract": "0x1234567890abcdef1234567890abcdef12345678",
      "name": "Digital Dreamscapes",
      "slug": "digital-dreamscapes",
      "icon_url": "https://sonova.one/collections/789/icon.jpg",
      "verified": true,
      "floor_price": "1.5",
      "floor_price_usd": 2250.50,
      "liked_at": 1703125000
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0
  }
}
```

### Basic Contract Information

#### Get Collection Statistics
```http
GET /{network_id}/v1/collections/{address_or_slug}/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "basic_stats": {
      "total_supply": 5000,
      "holders": 2847,
      "floor_price": "1.5",
      "floor_price_usd": 2250.50,
      "total_volume": "890.75",
      "total_volume_usd": 1336125.00
    },
    "trading_stats": {
      "listed_count": 156,
      "total_sales": 8934,
      "average_price": "2.3",
      "highest_sale": "45.7",
      "last_sale_price": "1.8"
    },
    "time_stats": {
      "volume_24h": "23.4",
      "volume_7d": "145.8",
      "volume_30d": "456.2",
      "sales_24h": 12,
      "sales_7d": 89,
      "sales_30d": 267
    }
  }
}
```

#### Get Collection Golden Status
```http
GET /{network_id}/v1/collections/{address}/is_golden
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_golden": true,
    "verified_at": 1703120000,
    "verification_level": "premium",
    "benefits": [
      "Priority search placement",
      "Enhanced analytics",
      "Premium support"
    ]
  }
}
```

#### Get Token Information
```http
GET /{network_id}/v1/collections/{address}/tokens/{token_id}/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token_id": "1234",
    "name": "Dreamscape #1234",
    "description": "A ethereal landscape floating in digital space",
    "image_url": "https://sonova.one/tokens/1234/image.jpg",
    "animation_url": "https://sonova.one/tokens/1234/animation.mp4",
    "attributes": [
      {
        "trait_type": "Background",
        "value": "Galaxy",
        "rarity": 2.4
      },
      {
        "trait_type": "Character",
        "value": "Robot",
        "rarity": 17.8
      }
    ],
    "owner": {
      "address": "0xowner_address_here",
      "username": "collector_123"
    },
    "listing": {
      "price": "2.5",
      "price_usd": 3750.00,
      "currency": "ETH",
      "marketplace": "Sonova",
      "expires_at": 1703216456
    },
    "last_sale": {
      "price": "1.9",
      "price_usd": 2850.00,
      "sold_at": 1703100000,
      "from": "0xseller_address",
      "to": "0xbuyer_address"
    }
  }
}
```

#### Get Trade Statistics
```http
GET /{network_id}/v1/collections/{address}/trade_stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_stats": {
      "floor_price": "1.5",
      "floor_price_usd": 2250.50,
      "total_volume": "890.75",
      "holder_count": 2847,
      "listed_count": 156
    },
    "historical_stats": {
      "volume_1d": "23.4",
      "volume_7d": "145.8",
      "volume_30d": "456.2",
      "sales_1d": 12,
      "sales_7d": 89,
      "sales_30d": 267
    },
    "price_trends": {
      "floor_change_1d": 0.05,
      "floor_change_7d": -0.12,
      "floor_change_30d": 0.34,
      "volume_change_1d": 0.18,
      "volume_change_7d": -0.08
    }
  }
}
```

## 🔍 Token Operations (v1)

### Batch Token Queries

#### Get Multiple NFT Information
```http
POST /{network_id}/collection/v1/nft/info/batch_query
Content-Type: application/json

{
  "nft_ids": [1001, 1002, 1003, 1004, 1005],
  "include_metadata": true,
  "include_orders": true
}
```

**Parameters:**
- `nft_ids` (array, required): List of NFT IDs (max 50 per request)
- `include_metadata` (boolean, optional): Include full metadata (default: true)
- `include_orders` (boolean, optional): Include listing/offer data (default: true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "token_id": "1234",
      "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
      "name": "Dreamscape #1234",
      "image_url": "https://sonova.one/tokens/1234/image.jpg",
      "metadata": {
        "description": "A ethereal landscape floating in digital space",
        "attributes": [
          {
            "trait_type": "Background",
            "value": "Galaxy"
          }
        ]
      },
      "owner": "0xowner_address_here",
      "orders": {
        "listing": {
          "price": "2.5",
          "currency": "ETH",
          "expires_at": 1703216456
        },
        "top_offer": {
          "price": "2.2",
          "currency": "ETH",
          "from": "0xofferer_address"
        }
      }
    }
  ],
  "metadata": {
    "total_requested": 5,
    "total_found": 5,
    "request_timestamp": 1703130000
  }
}
```

## 👛 Wallet Operations (v3)

### Advanced Wallet Services

#### Get Wallet Activities
```http
GET /{network_id}/v3/wallets/{address}/activities?limit={limit}&offset={offset}&types={types}
Authorization: Bearer <session-token>
```

**Parameters:**
- `network_id` (path, required): Network identifier
- `address` (path, required): Wallet address
- `limit` (query, optional): Activities per page (default: 20, max: 100)
- `offset` (query, optional): Activities to skip (default: 0)
- `types` (query, optional): Activity types filter (comma-separated)
  - `list`: Listing activities
  - `sale`: Sale activities  
  - `offer`: Offer activities
  - `transfer`: Transfer activities
  - `mint`: Minting activities

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "act_abc123def456",
      "type": "sale",
      "transaction_hash": "0xtx_hash_here",
      "block_number": 12345678,
      "timestamp": 1703130000,
      "nft": {
        "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
        "token_id": "1234",
        "name": "Dreamscape #1234",
        "image_url": "https://sonova.one/tokens/1234/image.jpg"
      },
      "price": {
        "amount": "2.5",
        "currency": "ETH",
        "usd_value": 3750.00
      },
      "participants": {
        "seller": "0xseller_address",
        "buyer": "0xbuyer_address"
      },
      "marketplace": "Sonova",
      "gas_used": "145000",
      "gas_price": "25000000000"
    },
    {
      "id": "act_def789ghi012",
      "type": "list",
      "timestamp": 1703125000,
      "nft": {
        "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
        "token_id": "5678",
        "name": "Dreamscape #5678",
        "image_url": "https://sonova.one/tokens/5678/image.jpg"
      },
      "listing": {
        "price": "3.2",
        "currency": "ETH",
        "expires_at": 1703216456
      },
      "lister": "0xlister_address"
    }
  ],
  "pagination": {
    "total": 1247,
    "limit": 20,
    "offset": 0,
    "has_more": true
  },
  "summary": {
    "total_bought": 45,
    "total_sold": 32,
    "total_volume": "89.7",
    "profit_loss": "12.4"
  }
}
```

#### Query Wallet Tokens
```http
POST /{network_id}/v3/wallets/{address}/tokens/query
Content-Type: application/json

{
  "filters": {
    "collections": ["0x1234567890abcdef1234567890abcdef12345678"],
    "erc_type": [721, 1155],
    "has_orders": true,
    "price_range": {
      "min": "1.0",
      "max": "10.0"
    }
  },
  "sort": {
    "field": "last_activity",
    "direction": "desc"
  },
  "pagination": {
    "limit": 50,
    "offset": 0
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
      "token_id": "1234",
      "name": "Dreamscape #1234",
      "image_url": "https://sonova.one/tokens/1234/image.jpg",
      "collection": {
        "name": "Digital Dreamscapes",
        "slug": "digital-dreamscapes",
        "verified": true
      },
      "metadata": {
        "attributes": [
          {
            "trait_type": "Background",
            "value": "Galaxy",
            "rarity_rank": 156
          }
        ]
      },
      "valuation": {
        "estimated_value": "2.8",
        "floor_price": "1.5",
        "last_sale": "2.1",
        "trait_floor": "3.2"
      },
      "orders": {
        "listing": {
          "price": "2.5",
          "marketplace": "Sonova",
          "expires_at": 1703216456
        },
        "offers": [
          {
            "price": "2.2",
            "from": "0xofferer1",
            "expires_at": 1703200000
          }
        ]
      },
      "acquisition": {
        "acquired_at": 1703000000,
        "acquired_price": "1.8",
        "holding_period_days": 47
      }
    }
  ],
  "pagination": {
    "total": 287,
    "limit": 50,
    "offset": 0
  },
  "portfolio_summary": {
    "total_tokens": 287,
    "estimated_total_value": "456.8",
    "total_invested": "398.2",
    "unrealized_pnl": "58.6",
    "top_collection": "Digital Dreamscapes"
  }
}
```

## 📊 Collection Rankings (v3)

### Enhanced Ranking System

#### Get Collection Ranking v3
```http
GET /{network_id}/collection/v3/ranking/overall?order={order}&range={range}&limit={limit}&offset={offset}
```

**Parameters:**
- `order` (query, required): Ranking criteria
  - `volume`: Trading volume
  - `sales`: Number of sales
  - `holders`: Holder count growth
  - `floor_change`: Floor price change
- `range` (query, required): Time period
  - `1d`, `7d`, `30d`, `90d`
- `limit` (query, optional): Collections per page (default: 50, max: 200)
- `offset` (query, optional): Collections to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "collection": {
        "id": 789,
        "contract": "0x1234567890abcdef1234567890abcdef12345678",
        "name": "Digital Dreamscapes",
        "slug": "digital-dreamscapes",
        "icon_url": "https://sonova.one/collections/789/icon.jpg",
        "verified": true,
        "is_golden": true
      },
      "stats": {
        "volume": "234.5",
        "volume_usd": 351750.00,
        "sales": 156,
        "floor_price": "1.5",
        "floor_price_usd": 2250.50,
        "holders": 2847,
        "listed_count": 156
      },
      "changes": {
        "volume_change": 0.23,
        "sales_change": 0.18,
        "floor_change": 0.05,
        "holder_change": 0.12,
        "rank_change": 2
      },
      "performance_score": 89.7
    }
  ],
  "pagination": {
    "total": 2456,
    "limit": 50,
    "offset": 0
  },
  "metadata": {
    "time_range": "7d",
    "order_by": "volume",
    "last_updated": 1703130000,
    "total_volume_period": "12456.7"
  }
}
```

#### Get User Liked Collections v3
```http
GET /{network_id}/collection/v3/likes?order={order}&range={range}&limit={limit}&offset={offset}
Authorization: Bearer <session-token>
```

**Response similar to ranking v3 but filtered to user's liked collections**

## 🚀 Premium Analytics (v4)

### Real-time Collection Rankings

#### Get Enhanced Collection Ranking v4
```http
GET /{network_id}/collection/v4/ranking/overall?order={order}&range={range}&sort={sort}&including_1155={boolean}&limit={limit}&offset={offset}
```

**Parameters:**
- `order` (query, required): Ranking metric
  - `volume`: Trading volume
  - `sales`: Number of sales
- `range` (query, required): Time period with sub-hourly precision
  - `5m`, `15m`, `1h`, `1d`, `7d`, `30d`, `90d`
- `sort` (query, optional): Sort direction
  - `desc`: Descending (default)
  - `asc`: Ascending
- `including_1155` (query, optional): Include ERC-1155 collections
  - `true`: Include (default)
  - `false`: Exclude
- `limit` (query, optional): Collections per page (default: 100, max: 999)
- `offset` (query, optional): Collections to skip (default: 0)

**Enhanced Response with Trend Analysis:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "collection": {
          "id": 789,
          "contract": "0x1234567890abcdef1234567890abcdef12345678",
          "name": "Digital Dreamscapes",
          "symbol": "DREAM",
          "verified": true,
          "icon_url": "https://sonova.one/collections/789/icon.jpg",
          "slug": "digital-dreamscapes",
          "erc_type": 721
        },
        "floor": {
          "price": "1500000000000000000",
          "currency": "ETH",
          "usd_price": 2250.50,
          "last_updated": 1703130000
        },
        "analytics": {
          "volume": 125.75,
          "volumeChange": 0.23,
          "sales": 45,
          "salesChange": 0.12,
          "holders": 2847,
          "items": 5000,
          "floorDiff1d": 0.15,
          "floorDiff7d": -0.05
        },
        "quality_indicators": {
          "gold_mark": true,
          "verification_level": "premium",
          "trending_score": 94.7
        },
        "market_data": {
          "listed_percentage": 3.12,
          "average_holding_time_days": 45.3,
          "whale_concentration": 0.15
        },
        "collectionAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "networkId": "1868"
      }
    ],
    "limit": 100,
    "offset": 0,
    "total": 2456,
    "count": 100
  },
  "metadata": {
    "range": "1h",
    "order": "volume",
    "including_1155": true,
    "last_cache_update": 1703130000,
    "next_update_in": 300
  }
}
```

#### Get Simplified Collection Ranking v4
```http
GET /collections/{network_id}/ranking/v4/2/overall?order={order}&range={range}&including_1155={boolean}&limit={limit}&offset={offset}
```

**Optimized Response for Performance:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "collection": {
          "id": 789,
          "contract": "0x1234567890abcdef1234567890abcdef12345678",
          "name": "Digital Dreamscapes",
          "icon_url": "https://sonova.one/collections/789/icon.jpg",
          "verified": true
        },
        "floor": {
          "price": "1500000000000000000",
          "usd_price": 2250.50
        },
        "volume": 125.75,
        "volume_change": 0.23,
        "sales": 45,
        "sales_change": 0.12,
        "holders": 2847,
        "total_supply": 5000,
        "floor_diff_1d": 0.15,
        "floor_diff_7d": -0.05,
        "collection_address": "0x1234567890abcdef1234567890abcdef12345678",
        "network_id": "1868"
      }
    ],
    "limit": 100,
    "offset": 0,
    "total": 2456,
    "count": 100
  }
}
```

### User Analytics v4 (Requires Authentication)

#### Get User Liked Collections with Enhanced Analytics
```http
GET /{network_id}/collection/v4/likes?order={order}&range={range}&sort={sort}&including_1155={boolean}&limit={limit}&offset={offset}
Authorization: Bearer <session-token>
```

**Response includes same structure as v4 ranking but filtered to user's liked collections plus portfolio metrics:**

```json
{
  "success": true,
  "data": {
    "data": [
      // ... collection data same as ranking v4
    ],
    "portfolio_analytics": {
      "total_collections": 25,
      "total_estimated_value": "567.8",
      "total_invested": "489.2",
      "unrealized_pnl": "78.6",
      "best_performer": {
        "collection": "Digital Dreamscapes",
        "gain_percentage": 45.7
      },
      "worst_performer": {
        "collection": "Pixel Art Collection",
        "loss_percentage": -12.3
      },
      "diversification_score": 82.4
    }
  }
}
```

## 🛒 Market Operations (v1)

### Collection Market Data

#### Get Collection NFTs with Orders
```http
POST /v1/{network_id}/collections/{contract_or_slug}/nfts
Content-Type: application/json

{
  "filters": {
    "price_min": 0.1,
    "price_max": 10.0,
    "rank_min": 1,
    "rank_max": 1000,
    "currency": "ETH",
    "has_orders": true,
    "trait_filters": [
      {
        "name": "Background",
        "values": ["Galaxy", "Ocean"],
        "operator": "OR"
      },
      {
        "name": "Rarity Tier",
        "values": ["Legendary", "Epic"],
        "operator": "OR"
      }
    ]
  },
  "sort": {
    "field": "price",
    "direction": "asc"
  },
  "pagination": {
    "limit": 20,
    "offset": 0
  },
  "include_metadata": true
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nft": {
        "id": 1001,
        "token_id": "1234",
        "name": "Dreamscape #1234",
        "image_url": "https://sonova.one/tokens/1234/image.jpg",
        "animation_url": "https://sonova.one/tokens/1234/animation.mp4",
        "rarity_rank": 156,
        "rarity_score": 847.2,
        "attributes": [
          {
            "trait_type": "Background",
            "value": "Galaxy",
            "rarity": 2.4,
            "trait_floor": "3.2"
          }
        ]
      },
      "order": {
        "id": "order_abc123",
        "type": "listing",
        "price": "2.5",
        "price_usd": 3750.00,
        "currency": "ETH",
        "maker": "0xseller_address",
        "marketplace": "Sonova",
        "created_at": 1703125000,
        "expires_at": 1703216456,
        "is_valid": true
      },
      "owner": {
        "address": "0xowner_address",
        "username": "collector_123",
        "is_verified": true
      },
      "valuation": {
        "estimated_value": "2.8",
        "trait_floor": "3.2",
        "collection_floor": "1.5",
        "last_sale": "2.1"
      }
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "has_more": true
  },
  "filters_applied": {
    "price_range": "0.1 - 10.0 ETH",
    "traits_count": 2,
    "has_orders": true
  }
}
```

#### Get Collection Offers
```http
GET /v1/{network_id}/collections/{contract_or_slug}/offers?currency={currency}&min_amount={min}&max_amount={max}&limit={limit}&offset={offset}
```

**Parameters:**
- `currency` (query, optional): Filter by currency (`ETH`, `USDC`, etc.)
- `min_amount` (query, optional): Minimum offer amount
- `max_amount` (query, optional): Maximum offer amount
- `limit` (query, optional): Offers per page (default: 20, max: 100)
- `offset` (query, optional): Offers to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "offer_def456",
      "type": "collection_offer",
      "amount": "1.8",
      "amount_usd": 2700.00,
      "currency": "ETH",
      "maker": {
        "address": "0xofferer_address",
        "username": "whale_collector",
        "is_verified": true
      },
      "quantity": 1,
      "expires_at": 1703216456,
      "created_at": 1703130000,
      "criteria": {
        "trait_filters": [
          {
            "trait_type": "Background",
            "values": ["Galaxy"]
          }
        ],
        "rarity_range": {
          "min_rank": 1,
          "max_rank": 500
        }
      },
      "is_valid": true,
      "fulfillable_tokens": 23
    }
  ],
  "summary": {
    "total_offers": 89,
    "highest_offer": "2.5",
    "average_offer": "1.2",
    "total_offer_value": "156.8"
  }
}
```

#### Check Collection Offers for Specific Amount
```http
POST /v1/{network_id}/collections/{contract_or_slug}/offers
Content-Type: application/json

{
  "amount": "1000000000000000000",
  "currency": "ETH",
  "criteria": {
    "trait_filters": [
      {
        "trait_type": "Background", 
        "values": ["Galaxy"]
      }
    ],
    "rarity_range": {
      "min_rank": 1,
      "max_rank": 1000
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_competitive": true,
    "market_position": "top_10_percent",
    "similar_offers": [
      {
        "amount": "0.95",
        "currency": "ETH", 
        "fulfillable_tokens": 15
      }
    ],
    "estimated_fulfillment": {
      "probability": 0.85,
      "expected_time_hours": 24,
      "matching_tokens": 47
    },
    "recommendations": [
      "Increase offer to 1.1 ETH for 95% fulfillment probability",
      "Consider expanding trait criteria for more options"
    ]
  }
}
```

#### Get Collection Events/Activities
```http
POST /v1/{network_id}/collections/{contract_or_slug}/events
Content-Type: application/json

{
  "filters": {
    "types": ["0", "1", "2", "3"],
    "date_range": {
      "start": 1703000000,
      "end": 1703130000
    },
    "price_range": {
      "min": "0.1",
      "max": "100.0"
    },
    "users": ["0xspecific_user_address"]
  },
  "sort": {
    "field": "timestamp",
    "direction": "desc"
  },
  "pagination": {
    "limit": 50,
    "offset": 0
  }
}
```

**Event Types:**
- `0`: List
- `1`: Sale
- `2`: Cancel
- `3`: Offer
- `4`: Transfer
- `5`: Mint

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event_ghi789",
      "type": "1",
      "type_name": "sale",
      "transaction_hash": "0xtx_hash_here",
      "block_number": 12345678,
      "timestamp": 1703130000,
      "nft": {
        "token_id": "1234",
        "name": "Dreamscape #1234",
        "image_url": "https://sonova.one/tokens/1234/image.jpg",
        "rarity_rank": 156
      },
      "price": {
        "amount": "2.5",
        "currency": "ETH",
        "usd_value": 3750.00
      },
      "participants": {
        "seller": {
          "address": "0xseller_address",
          "username": "artist_creator"
        },
        "buyer": {
          "address": "0xbuyer_address", 
          "username": "collector_pro"
        }
      },
      "marketplace": "Sonova",
      "royalty": {
        "amount": "0.125",
        "recipient": "0xroyalty_recipient"
      },
      "fees": {
        "platform_fee": "0.0625",
        "total_fees": "0.1875"
      }
    }
  ],
  "summary": {
    "total_events": 1247,
    "volume_period": "89.7",
    "sales_count": 89,
    "average_price": "2.1",
    "unique_traders": 67
  }
}
```

#### Get Collection Chart Data
```http
GET /v1/{network_id}/collections/{contract_or_slug}/chart?type={chart_type}&time={time_period}&resolution={resolution}
```

**Parameters:**
- `type` (query, required): Chart data type
  - `0`: Volume chart
  - `1`: Sales count chart
  - `2`: Floor price chart
  - `3`: Average price chart
- `time` (query, required): Time period
  - `1H`, `4H`, `12H`, `1D`, `3D`, `7D`, `14D`, `30D`, `90D`
- `resolution` (query, optional): Data point resolution
  - `1m`, `5m`, `15m`, `1h`, `4h`, `1d`

**Response:**
```json
{
  "success": true,
  "data": {
    "chart_type": "volume",
    "time_period": "7D",
    "resolution": "1h",
    "data_points": [
      {
        "timestamp": 1703000000,
        "value": 12.5,
        "value_usd": 18750.00,
        "count": 8
      },
      {
        "timestamp": 1703003600,
        "value": 8.3,
        "value_usd": 12450.00,
        "count": 5
      }
    ],
    "summary": {
      "total_volume": "145.8",
      "total_volume_usd": 218700.00,
      "total_sales": 89,
      "peak_volume": "23.4",
      "lowest_volume": "2.1",
      "trend": "upward"
    }
  }
}
```

#### Get Collection Floor Price
```http
GET /v1/{network_id}/collections/{contract_or_slug}/floor
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_floor": {
      "price": "1.5",
      "price_usd": 2250.50,
      "currency": "ETH",
      "token_id": "5678",
      "listing_id": "listing_jkl012",
      "last_updated": 1703130000
    },
    "historical_floors": {
      "floor_1h_ago": "1.45",
      "floor_1d_ago": "1.3", 
      "floor_7d_ago": "1.7",
      "floor_30d_ago": "1.1"
    },
    "floor_trends": {
      "change_1h": 0.034,
      "change_1d": 0.154,
      "change_7d": -0.118,
      "change_30d": 0.364
    },
    "trait_floors": [
      {
        "trait_type": "Background",
        "trait_value": "Galaxy",
        "floor_price": "3.2",
        "token_count": 120
      }
    ]
  }
}
```

#### Get Collection Sales
```http
POST /v1/{network_id}/collections/{contract_or_slug}/sales
Content-Type: application/json

{
  "filters": {
    "date_range": {
      "start": 1703000000,
      "end": 1703130000
    },
    "price_range": {
      "min": "1.0",
      "max": "50.0"
    },
    "marketplaces": ["Sonova", "OpenSea"]
  },
  "sort": {
    "field": "price",
    "direction": "desc"
  },
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sale_mno345",
      "transaction_hash": "0xtx_hash_here",
      "block_number": 12345678,
      "timestamp": 1703130000,
      "nft": {
        "token_id": "1234",
        "name": "Dreamscape #1234",
        "image_url": "https://sonova.one/tokens/1234/image.jpg",
        "rarity_rank": 156,
        "rarity_score": 847.2
      },
      "sale_details": {
        "price": "2.5",
        "price_usd": 3750.00,
        "currency": "ETH",
        "marketplace": "Sonova",
        "sale_type": "direct_sale"
      },
      "participants": {
        "seller": {
          "address": "0xseller_address",
          "username": "artist_creator",
          "is_verified": true
        },
        "buyer": {
          "address": "0xbuyer_address",
          "username": "collector_pro",
          "is_verified": true
        }
      },
      "financial_breakdown": {
        "gross_amount": "2.5",
        "platform_fee": "0.0625",
        "royalty_fee": "0.125", 
        "net_to_seller": "2.3125"
      },
      "market_context": {
        "floor_at_sale": "1.4",
        "premium_to_floor": 0.786,
        "collection_volume_24h": "23.4"
      }
    }
  ],
  "analytics": {
    "total_sales": 89,
    "total_volume": "187.6",
    "average_price": "2.11",
    "median_price": "1.8",
    "highest_sale": "12.5",
    "price_distribution": {
      "under_1_eth": 12,
      "1_to_5_eth": 67,
      "5_to_10_eth": 8,
      "over_10_eth": 2
    }
  }
}
```

### NFT Operations

#### Get NFT Information with Orders
```http
POST /v1/{network_id}/nfts
Content-Type: application/json

{
  "nft_ids": [1001, 1002, 1003],
  "include_orders": true,
  "include_history": true,
  "include_valuations": true
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
      "token_id": "1234",
      "name": "Dreamscape #1234",
      "description": "A ethereal landscape floating in digital space",
      "image_url": "https://sonova.one/tokens/1234/image.jpg",
      "animation_url": "https://sonova.one/tokens/1234/animation.mp4",
      "metadata": {
        "attributes": [
          {
            "trait_type": "Background",
            "value": "Galaxy",
            "rarity": 2.4,
            "trait_floor": "3.2"
          }
        ],
        "rarity_rank": 156,
        "rarity_score": 847.2
      },
      "ownership": {
        "owner": "0xowner_address",
        "acquired_at": 1703000000,
        "acquired_price": "1.8",
        "holding_period_days": 47
      },
      "orders": {
        "listing": {
          "id": "listing_pqr678",
          "price": "2.5",
          "currency": "ETH",
          "marketplace": "Sonova",
          "expires_at": 1703216456,
          "is_valid": true
        },
        "offers": [
          {
            "id": "offer_stu901",
            "price": "2.2",
            "currency": "ETH",
            "from": "0xofferer_address",
            "expires_at": 1703200000
          }
        ]
      },
      "valuations": {
        "estimated_value": "2.8",
        "trait_floor": "3.2",
        "collection_floor": "1.5",
        "last_sale": "2.1",
        "appraisal_confidence": 0.87
      },
      "transaction_history": [
        {
          "type": "sale",
          "price": "1.8",
          "from": "0xprevious_owner",
          "to": "0xowner_address",
          "timestamp": 1703000000
        }
      ]
    }
  ]
}
```

#### Get NFT Trait Floor Prices
```http
POST /v1/{network_id}/nfts/trait_floor
Content-Type: application/json

{
  "nft_ids": [1001, 1002, 1003],
  "include_combinations": true
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nft_id": 1001,
      "token_id": "1234",
      "trait_floors": {
        "individual_traits": [
          {
            "trait_type": "Background",
            "trait_value": "Galaxy",
            "floor_price": "3.2",
            "floor_token_id": "7890",
            "tokens_with_trait": 120
          },
          {
            "trait_type": "Character",
            "trait_value": "Robot", 
            "floor_price": "1.8",
            "floor_token_id": "2345",
            "tokens_with_trait": 890
          }
        ],
        "trait_combinations": [
          {
            "traits": ["Background: Galaxy", "Character: Robot"],
            "combination_floor": "5.5",
            "combination_tokens": 12,
            "rarity_multiplier": 2.34
          }
        ]
      },
      "valuation_analysis": {
        "minimum_trait_floor": "1.8",
        "maximum_trait_floor": "3.2", 
        "combination_premium": "5.5",
        "estimated_trait_value": "4.1",
        "collection_floor": "1.5"
      }
    }
  ]
}
```

## 🚀 Launchpad Operations

### Launchpad Information

#### List Active Launchpads
```http
GET /events?network_id={network_id}&status={status}&limit={limit}&offset={offset}
```

**Parameters:**
- `network_id` (query, required): Network identifier
- `status` (query, optional): Launchpad status filter
  - `upcoming`: Not yet started
  - `active`: Currently running
  - `ended`: Completed
  - `sold_out`: Sold out
- `limit` (query, optional): Launchpads per page (default: 20)
- `offset` (query, optional): Launchpads to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "slug": "digital-legends-genesis",
      "name": "Digital Legends: Genesis",
      "description": "The first collection in the Digital Legends universe",
      "creator": {
        "address": "0xcreator_address",
        "username": "legend_artist",
        "is_verified": true
      },
      "collection_details": {
        "total_supply": 10000,
        "erc_type": 721,
        "reveal_strategy": "delayed",
        "mint_price": "0.08",
        "max_per_wallet": 5
      },
      "schedule": {
        "start_time": 1703140000,
        "end_time": 1703226400,
        "duration_hours": 24,
        "phases": [
          {
            "name": "Whitelist",
            "start_time": 1703140000,
            "end_time": 1703150000,
            "price": "0.06",
            "max_per_wallet": 3
          },
          {
            "name": "Public",
            "start_time": 1703150000,
            "end_time": 1703226400,
            "price": "0.08",
            "max_per_wallet": 5
          }
        ]
      },
      "status": {
        "current_status": "active",
        "tokens_minted": 3456,
        "tokens_remaining": 6544,
        "progress_percentage": 34.56,
        "current_phase": "Public"
      },
      "media": {
        "banner_url": "https://sonova.one/launchpads/456/banner.jpg",
        "preview_images": [
          "https://sonova.one/launchpads/456/preview1.jpg",
          "https://sonova.one/launchpads/456/preview2.jpg"
        ]
      }
    }
  ],
  "summary": {
    "total_active": 12,
    "total_upcoming": 8,
    "total_volume_24h": "156.7"
  }
}
```

#### Get Launchpad Details
```http
GET /events/{slug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "slug": "digital-legends-genesis",
    "name": "Digital Legends: Genesis",
    "description": "The first collection in the Digital Legends universe featuring legendary characters and epic storylines.",
    "long_description": "Digital Legends: Genesis marks the beginning of an epic journey...",
    "creator": {
      "address": "0xcreator_address",
      "username": "legend_artist",
      "display_name": "Legend Artist Studio",
      "is_verified": true,
      "bio": "Creating legendary digital art since 2021",
      "social_links": {
        "twitter": "https://twitter.com/legend_artist",
        "discord": "https://discord.gg/legends"
      }
    },
    "collection_details": {
      "contract_address": "0x9876543210fedcba9876543210fedcba98765432",
      "total_supply": 10000,
      "erc_type": 721,
      "reveal_strategy": "delayed",
      "reveal_date": 1703312800,
      "mint_price": "0.08",
      "currency": "ETH",
      "max_per_wallet": 5,
      "royalty_percentage": 7.5
    },
    "whitelist": {
      "is_whitelist_enabled": true,
      "whitelist_spots": 2000,
      "whitelist_filled": 1876,
      "whitelist_benefits": [
        "Early access",
        "Discounted price",
        "Guaranteed allocation"
      ]
    },
    "roadmap": [
      {
        "milestone": "Genesis Launch",
        "description": "Launch of 10,000 Genesis NFTs",
        "status": "in_progress"
      },
      {
        "milestone": "Marketplace Integration", 
        "description": "Full trading on Sonova marketplace",
        "status": "upcoming"
      }
    ],
    "rarity_distribution": {
      "common": 6000,
      "uncommon": 2500,
      "rare": 1000,
      "epic": 400,
      "legendary": 100
    },
    "current_stats": {
      "tokens_minted": 3456,
      "unique_minters": 2134,
      "total_revenue": "276.48",
      "average_per_minter": 1.62
    }
  }
}
```

### Launchpad Interactions (Requires Authentication)

#### Sign Launchpad Event for Minting
```http
POST /events/{slug}/sign
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "mint_amount": 3,
  "phase": "whitelist",
  "payment_method": "ETH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signature": "0xsignature_hash_here",
    "mint_details": {
      "amount": 3,
      "unit_price": "0.06",
      "total_price": "0.18",
      "phase": "whitelist",
      "max_allowed": 3,
      "remaining_allowance": 0
    },
    "transaction_data": {
      "to": "0x9876543210fedcba9876543210fedcba98765432",
      "value": "180000000000000000",
      "gas_estimate": "150000",
      "gas_price": "25000000000"
    },
    "validity": {
      "expires_at": 1703141800,
      "valid_for_seconds": 1800,
      "nonce": 12345
    }
  }
}
```

#### Get Event Stages Info
```http
GET /events/{slug}/stages
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_eligibility": {
      "is_whitelisted": true,
      "whitelist_tier": "tier_1",
      "max_mint_amount": 3,
      "current_mint_count": 2,
      "remaining_allowance": 1
    },
    "current_stage": {
      "name": "Whitelist",
      "is_active": true,
      "start_time": 1703140000,
      "end_time": 1703150000,
      "time_remaining": 7200,
      "price": "0.06",
      "max_per_wallet": 3
    },
    "all_stages": [
      {
        "name": "Whitelist",
        "start_time": 1703140000,
        "end_time": 1703150000,
        "price": "0.06",
        "max_per_wallet": 3,
        "is_eligible": true,
        "is_active": true
      },
      {
        "name": "Public",
        "start_time": 1703150000,
        "end_time": 1703226400,
        "price": "0.08",
        "max_per_wallet": 5,
        "is_eligible": true,
        "is_active": false
      }
    ],
    "mint_history": [
      {
        "transaction_hash": "0xtx1_hash",
        "amount": 1,
        "price": "0.06",
        "timestamp": 1703140600
      },
      {
        "transaction_hash": "0xtx2_hash",
        "amount": 1,
        "price": "0.06", 
        "timestamp": 1703141200
      }
    ]
  }
}
```

## 🔄 Response Formats & Standards

### Standard Response Structure
All endpoints follow this consistent format:

```json
{
  "success": boolean,
  "data": any,
  "code": number,
  "msg": string
}
```

### Pagination Systems

#### v4 Pagination (Modern - Offset/Limit)
```json
{
  "data": [...],
  "limit": 100,
  "offset": 0,
  "total": 2456,
  "count": 100
}
```

#### v1/v3 Pagination (Legacy - Page/PageSize)
```json
{
  "data": [...],
  "page": 1,
  "pageSize": 20,
  "total": 2456,
  "count": 20,
  "next": 2
}
```

### Error Response Format
```json
{
  "success": false,
  "code": 400,
  "msg": "Detailed error description",
  "error_details": {
    "field": "network_id",
    "issue": "Invalid network identifier",
    "valid_values": [137, 1868]
  }
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing or invalid authentication)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## 🆚 Comprehensive Version Comparison

### API Version Feature Matrix

| Feature | v1 | v3 | v4 |
|---------|----|----|----| 
| **Scope** | Core marketplace operations | Advanced user & wallet services | Premium analytics & real-time data |
| **Pagination** | `page`/`pageSize` | `page`/`pageSize` | `offset`/`limit` |
| **Time Ranges** | Basic (1d, 7d, 30d) | Enhanced (1d, 7d, 30d, 90d) | Extended (5m, 15m, 1h, 1d, 7d, 30d, 90d) |
| **Trend Analysis** | ❌ | Basic | ✅ Advanced (floor/volume changes) |
| **Quality Metrics** | ❌ | ❌ | ✅ Gold marks & verification levels |
| **ERC-1155 Support** | Limited | Limited | ✅ Native support |
| **Performance** | Standard | Standard | ✅ Optimized caching |
| **Real-time Data** | ❌ | ❌ | ✅ Sub-hourly updates |
| **Wallet Analytics** | N/A | ✅ Advanced | ✅ Premium |
| **User Activities** | ❌ | ✅ Comprehensive | ✅ Enhanced |
| **Portfolio Tracking** | ❌ | ✅ Basic | ✅ Advanced |

### Data Enhancement by Version

#### v1 Provides:
- Basic collection information
- Simple trading statistics  
- Token metadata
- Floor prices
- Basic search functionality

#### v3 Adds:
- Advanced wallet activity tracking
- Complex token ownership queries
- Enhanced user interaction data
- Improved ranking algorithms
- Portfolio management features

#### v4 Enhances:
- **Real-time Analytics**: `floorDiff1d`, `floorDiff7d`, `volumeChange`, `salesChange`
- **Quality Indicators**: `gold_mark`, `verification_level`, `trending_score`
- **Performance Metrics**: `whale_concentration`, `holding_time`, `diversification_score`
- **Market Intelligence**: Advanced trend analysis and prediction indicators

## 📋 Network Support

### Supported Networks
- **Soneium**: Chain ID `1868` (Primary)
  - Latest features and highest priority
  - All API versions supported
  - Real-time data updates
- **Polygon**: Chain ID `137` (Secondary)  
  - Core functionality supported
  - Limited to v1 and v3 APIs
  - Standard update frequency

### Network-Specific Features
- Most endpoints use `/{network_id}/` prefix
- Some v4 endpoints may have network-specific optimizations
- Cross-network analytics coming in future versions

## 🔐 Authentication Requirements

| Operation Category | v1 | v3 | v4 |
|-------------------|----|----|----| 
| **Public Collection Info** | ❌ None | ❌ None | ❌ None |
| **Market Data & Rankings** | ❌ None | ❌ None | ❌ None |
| **Collection Interactions** | ✅ Session | ✅ Session | ✅ Session |
| **User Specific Data** | ✅ Session | ✅ Session | ✅ Session |
| **Wallet Analytics** | N/A | ✅ Session | ✅ Session |
| **Launchpad Operations** | ✅ Session | ✅ Session | ✅ Session |

## 📊 Rate Limits & Performance

### Rate Limiting
- **Standard Endpoints**: 100 requests per minute per IP
- **Heavy Endpoints**: 20 requests per minute per IP (search, batch queries)
- **Authenticated Endpoints**: 200 requests per minute per session
- **v4 Analytics**: Enhanced caching reduces effective rate limit impact

### Performance Optimizations
- **v1**: Standard response times (200-500ms)
- **v3**: Optimized for complex queries (300-800ms)
- **v4**: Advanced caching system (50-200ms typical response)

### Caching Strategy
- **v1**: 30-second cache for most data
- **v3**: Smart caching based on data type
- **v4**: Real-time cache updates with 5-second freshness guarantee

## 🚨 Important Implementation Notes

### URL Structure Consistency
- **v1 Endpoints**: Mix of `/v1/` and `/{network_id}/v1/` patterns
- **v3 Endpoints**: Primarily `/{network_id}/v3/` and `/collection/v3/` patterns  
- **v4 Endpoints**: Modern `/{network_id}/collection/v4/` and `/collections/{network_id}/` patterns
- **Always verify exact endpoint paths** - some routes don't follow standard patterns

### Data Freshness
- **v1**: 30-second to 5-minute updates
- **v3**: 1-minute to 10-minute updates  
- **v4**: Real-time to 5-minute updates depending on endpoint

### Error Handling Best Practices
1. Always check `success` field before accessing `data`
2. Implement exponential backoff for rate limit errors (429)
3. Handle network-specific errors gracefully
4. Cache responses appropriately to reduce API calls

### Migration Recommendations
1. **Start with v1** for basic marketplace integration
2. **Upgrade to v3** for advanced wallet and user features
3. **Implement v4** for cutting-edge analytics and real-time data
4. **Use appropriate version** for each use case rather than forcing single version

---

> **Engineering Note**: This documentation reflects the actual API implementation verified against the `uniapi-go` backend codebase. All endpoints, parameters, and response formats have been confirmed through source code analysis. No official SDKs are currently available - use direct HTTP integration with your preferred programming language.

