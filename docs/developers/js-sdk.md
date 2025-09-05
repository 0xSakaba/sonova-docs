---
sidebar_position: 2
---

# JavaScript Integration

Complete JavaScript integration guide for Sonova marketplace public APIs.

## 🚀 Direct API Integration

Sonova doesn't have an official SDK. Integration uses direct API calls covering all public functionality.

### Basic Setup

```javascript
const SONOVA_API_BASE = 'https://api.sonova.one';
const SONEIUM_CHAIN_ID = 1868;
const POLYGON_CHAIN_ID = 137;

// API helper with session authentication support
class SonovaAPI {
  constructor(sessionToken = null) {
    this.sessionToken = sessionToken;
    this.baseURL = SONOVA_API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add session token if available
    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(`API Error: ${data.code} - ${data.msg}`);
    }

    return data.data;
  }

  // Set session token for authenticated requests
  setSessionToken(token) {
    this.sessionToken = token;
  }
}

// Usage
const api = new SonovaAPI();
// For authenticated requests
api.setSessionToken('your-session-token');
```

## 👤 User Authentication Services

### User Session Management

```javascript
class UserService {
  constructor(api) {
    this.api = api;
  }

  // Login with signature
  async login(signature, message) {
    return await this.api.request('/users/sessions/create', {
      method: 'POST',
      body: JSON.stringify({ signature, message })
    });
  }

  // Logout
  async logout() {
    return await this.api.request('/users/sessions/destroy', {
      method: 'POST'
    });
  }

  // Get current user info
  async getCurrentUser() {
    return await this.api.request('/users/me');
  }
}
```

## 🎨 Collection Services (v1)

### Collection Management

```javascript
class CollectionService {
  constructor(api) {
    this.api = api;
  }

  // Get collection detail
  async getCollectionDetail(networkId, contractOrSlug) {
    return await this.api.request(`/v1/${networkId}/contracts/${contractOrSlug}/detail`);
  }

  // Get collection by ID
  async getCollection(networkId, contractId) {
    return await this.api.request(`/v1/${networkId}/contracts/${contractId}`);
  }

  // Get collection fees
  async getCollectionFees(networkId, contractOrSlug, market) {
    return await this.api.request(`/v1/${networkId}/contracts/${contractOrSlug}/fees?market=${market}`);
  }

  // Search collections
  async searchCollections(networkId, keyword, ercType = null) {
    let url = `/v1/${networkId}/contracts/search?keyword=${encodeURIComponent(keyword)}`;
    if (ercType) url += `&erc_type=${ercType}`;
    return await this.api.request(url);
  }

  // Get collection traits
  async getCollectionTraits(networkId, contractId) {
    return await this.api.request(`/v1/${networkId}/contracts/${contractId}/trait_aggregation`);
  }

  // Like collection (requires authentication)
  async likeCollection(networkId, contractId) {
    return await this.api.request(`/v1/${networkId}/contracts/${contractId}/like`, {
      method: 'POST'
    });
  }

  // Unlike collection (requires authentication)
  async unlikeCollection(networkId, contractId) {
    return await this.api.request(`/v1/${networkId}/contracts/${contractId}/unlike`, {
      method: 'POST'
    });
  }

  // Get liked collections (requires authentication)
  async getLikedCollections(networkId) {
    return await this.api.request(`/v1/${networkId}/contracts/liked`);
  }
}
```

## 📊 Enhanced Analytics Services (v4)

### Collection Ranking & Analytics

```javascript
class AnalyticsService {
  constructor(api) {
    this.api = api;
  }

  // Get enhanced collection ranking with analytics
  async getCollectionRanking(networkId, options = {}) {
    const {
      order = 'volume',
      range = '1d',
      sort = 'desc',
      including1155 = true,
      limit = 100,
      offset = 0
    } = options;

    const params = new URLSearchParams({
      order,
      range,
      sort,
      including_1155: including1155.toString(),
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.api.request(`/${networkId}/collection/v4/ranking/overall?${params}`);
  }

  // Get simplified ranking data for better performance
  async getCollectionRankingSimple(networkId, options = {}) {
    const {
      order = 'volume',
      range = '1d',
      including1155 = true,
      limit = 100,
      offset = 0
    } = options;

    const params = new URLSearchParams({
      order,
      range,
      including_1155: including1155.toString(),
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.api.request(`/collections/${networkId}/ranking/v4/2/overall?${params}`);
  }

  // Get user's liked collections with analytics (requires authentication)
  async getUserLikedCollections(networkId, options = {}) {
    const {
      order = 'volume',
      range = '7d',
      sort = 'desc',
      including1155 = true,
      limit = 100,
      offset = 0
    } = options;

    const params = new URLSearchParams({
      order,
      range,
      sort,
      including_1155: including1155.toString(),
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.api.request(`/${networkId}/collection/v4/likes?${params}`);
  }
}
```

## 🛒 Market & Trading Services (v1)

### Market Operations

```javascript
class MarketService {
  constructor(api) {
    this.api = api;
  }

  // Get collection NFTs with orders
  async getCollectionNFTs(networkId, contractOrSlug, filters = {}) {
    const defaultFilters = {
      limit: 20,
      offset: 0
    };
    
    return await this.api.request(`/v1/${networkId}/collections/${contractOrSlug}/nfts`, {
      method: 'POST',
      body: JSON.stringify({ ...defaultFilters, ...filters })
    });
  }

  // Get collection offers
  async getCollectionOffers(networkId, contractOrSlug, currency = null) {
    let url = `/v1/${networkId}/collections/${contractOrSlug}/offers`;
    if (currency) url += `?currency=${currency}`;
    return await this.api.request(url);
  }

  // Check collection offers
  async checkCollectionOffers(networkId, contractOrSlug, amount, currency = 'ETH') {
    return await this.api.request(`/v1/${networkId}/collections/${contractOrSlug}/offers`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    });
  }

  // Get collection events/activities
  async getCollectionEvents(networkId, contractOrSlug, filters = {}) {
    const defaultFilters = {
      types: ['0', '1', '2'], // list, sale, cancel
      limit: 20,
      offset: 0
    };
    
    return await this.api.request(`/v1/${networkId}/collections/${contractOrSlug}/events`, {
      method: 'POST',
      body: JSON.stringify({ ...defaultFilters, ...filters })
    });
  }

  // Get collection chart data
  async getCollectionChart(networkId, contractOrSlug, type = 0, time = '4H') {
    return await this.api.request(`/v1/${networkId}/collections/${contractOrSlug}/chart?type=${type}&time=${time}`);
  }

  // Get collection floor price
  async getCollectionFloor(networkId, contractOrSlug) {
    return await this.api.request(`/v1/${networkId}/collections/${contractOrSlug}/floor`);
  }

  // Get collection sales
  async getCollectionSales(networkId, contractOrSlug, filters = {}) {
    const defaultFilters = {
      limit: 20,
      offset: 0
    };
    
    return await this.api.request(`/v1/${networkId}/collections/${contractOrSlug}/sales`, {
      method: 'POST',
      body: JSON.stringify({ ...defaultFilters, ...filters })
    });
  }

  // Get NFT information with orders
  async getNFTs(networkId, nftIds) {
    return await this.api.request(`/v1/${networkId}/nfts`, {
      method: 'POST',
      body: JSON.stringify({ nft_ids: nftIds })
    });
  }

  // Get NFT trait floor prices
  async getNFTTraitFloors(networkId, nftIds) {
    return await this.api.request(`/v1/${networkId}/nfts/trait_floor`, {
      method: 'POST',
      body: JSON.stringify({ nft_ids: nftIds })
    });
  }
}
```

## 👛 Wallet Services (v1)

### Wallet Management

```javascript
class WalletService {
  constructor(api) {
    this.api = api;
  }

  // Get wallet collections
  async getWalletCollections(networkId, walletAddress, filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.api.request(`/v1/${networkId}/wallets/${walletAddress}/collections?${queryString}`);
  }

  // Get wallet tokens
  async getWalletTokens(networkId, walletAddress, filters = {}) {
    const defaultFilters = {
      offset: 0,
      limit: 20
    };
    const queryString = new URLSearchParams({ ...defaultFilters, ...filters }).toString();
    return await this.api.request(`/v1/${networkId}/wallets/${walletAddress}/tokens?${queryString}`);
  }

  // Get wallet listed tokens
  async getWalletListedTokens(networkId, walletAddress, filters = {}) {
    const defaultFilters = {
      offset: 0,
      limit: 20
    };
    const queryString = new URLSearchParams({ ...defaultFilters, ...filters }).toString();
    return await this.api.request(`/v1/${networkId}/wallets/${walletAddress}/listed?${queryString}`);
  }

  // Get wallet offers
  async getWalletOffers(networkId, walletAddress, filters = {}) {
    const defaultFilters = {
      offset: 0,
      limit: 20
    };
    const queryString = new URLSearchParams({ ...defaultFilters, ...filters }).toString();
    return await this.api.request(`/v1/${networkId}/wallets/${walletAddress}/offers?${queryString}`);
  }

  // Get wallet offer collections
  async getWalletOfferCollections(networkId, walletAddress, currency = null) {
    let url = `/v1/${networkId}/wallets/${walletAddress}/offer_collections`;
    if (currency) url += `?currency=${currency}`;
    return await this.api.request(url);
  }

  // Get wallet portfolio
  async getWalletPortfolio(networkId, walletAddress) {
    return await this.api.request(`/v1/${networkId}/wallets/${walletAddress}/portfolio`);
  }
}
```

## 🚀 Launchpad Services

### Launchpad Management

```javascript
class LaunchpadService {
  constructor(api) {
    this.api = api;
  }

  // List launchpads
  async listLaunchpads(networkId) {
    return await this.api.request(`/events?network_id=${networkId}`);
  }

  // Get launchpad details
  async getLaunchpad(slug) {
    return await this.api.request(`/events/${slug}`);
  }

  // Sign launchpad event (requires authentication)
  async signEvent(slug, mintAmount) {
    return await this.api.request(`/events/${slug}/sign`, {
      method: 'POST',
      body: JSON.stringify({ mint_amount: mintAmount })
    });
  }

  // Get event stages info (requires authentication)
  async getEventStages(slug) {
    return await this.api.request(`/events/${slug}/stages`);
  }
}
```

## 🔧 Complete Integration Example

```javascript
// Complete Sonova SDK wrapper with v4 analytics support
class SonovaSDK {
  constructor(sessionToken = null) {
    this.api = new SonovaAPI(sessionToken);
    
    // Initialize all services
    this.users = new UserService(this.api);
    this.collections = new CollectionService(this.api);
    this.analytics = new AnalyticsService(this.api);
    this.market = new MarketService(this.api);
    this.wallets = new WalletService(this.api);
    this.launchpad = new LaunchpadService(this.api);
  }

  // Set session token for authenticated requests
  setSessionToken(token) {
    this.api.setSessionToken(token);
  }

  // Get complete user profile with enhanced analytics (requires authentication)
  async getUserProfile() {
    const profile = {
      userInfo: null,
      likedCollections: [],
      likedCollectionsAnalytics: []
    };

    try {
      profile.userInfo = await this.users.getCurrentUser();
    } catch (e) {
      console.warn('Failed to get user info:', e.message);
    }

    try {
      // Get basic liked collections (v1)
      profile.likedCollections = await this.collections.getLikedCollections(SONEIUM_CHAIN_ID);
      
      // Get enhanced analytics for liked collections (v4)
      profile.likedCollectionsAnalytics = await this.analytics.getUserLikedCollections(SONEIUM_CHAIN_ID, {
        range: '7d',
        order: 'volume'
      });
    } catch (e) {
      console.warn('Failed to get liked collections:', e.message);
    }

    return profile;
  }

  // Get enhanced collection analytics with trends
  async getCollectionAnalytics(networkId, options = {}) {
    const {
      timeRange = '1d',
      order = 'volume',
      limit = 50,
      includeERC1155 = true
    } = options;

    try {
      // Get enhanced ranking data
      const ranking = await this.analytics.getCollectionRanking(networkId, {
        range: timeRange,
        order,
        limit,
        including1155: includeERC1155
      });

      return {
        collections: ranking.data || [],
        pagination: {
          limit: ranking.limit,
          offset: ranking.offset,
          total: ranking.total,
          count: ranking.count
        },
        metadata: {
          timeRange,
          order,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to get collection analytics:', error);
      return { collections: [], pagination: null, metadata: null };
    }
  }

  // Get wallet portfolio with market data
  async getWalletPortfolio(walletAddress, networkId = SONEIUM_CHAIN_ID) {
    const [collections, tokens, portfolio] = await Promise.all([
      this.wallets.getWalletCollections(networkId, walletAddress),
      this.wallets.getWalletTokens(networkId, walletAddress),
      this.wallets.getWalletPortfolio(networkId, walletAddress)
    ]);

    return {
      collections,
      tokens,
      portfolio,
      address: walletAddress
    };
  }

  // Get collection with enhanced market data
  async getCollectionWithMarketData(networkId, contractOrSlug) {
    const [detail, floor, offers] = await Promise.all([
      this.collections.getCollectionDetail(networkId, contractOrSlug),
      this.market.getCollectionFloor(networkId, contractOrSlug),
      this.market.getCollectionOffers(networkId, contractOrSlug)
    ]);

    return {
      ...detail,
      floor,
      offers
    };
  }
}

// Usage example with v4 analytics
const sonova = new SonovaSDK();

// For authenticated features
sonova.setSessionToken('your-session-token');

// Login user
const loginResult = await sonova.users.login('0x...signature', 'message');

// Get basic collection details (v1)
const collection = await sonova.collections.getCollectionDetail(1868, 'contract-address');

// Get enhanced analytics (v4) - Real-time ranking with trends
const analytics = await sonova.getCollectionAnalytics(1868, {
  timeRange: '1h',
  order: 'volume',
  limit: 100
});

console.log('Top collections by volume (last hour):', analytics.collections);

// Get user's liked collections with analytics (v4)
const userProfile = await sonova.getUserProfile();
console.log('User liked collections with trends:', userProfile.likedCollectionsAnalytics);

// Compare v1 vs v4 approaches
// v1: Basic liked collections
const basicLiked = await sonova.collections.getLikedCollections(1868);

// v4: Enhanced liked collections with analytics
const enhancedLiked = await sonova.analytics.getUserLikedCollections(1868, {
  range: '24h',
  order: 'volume'
});

// Get collection NFTs with filters (v1)
const nfts = await sonova.market.getCollectionNFTs(1868, 'contract-address', {
  price_min: 0.1,
  price_max: 10,
  trait_filters: [{ name: 'Background', values: ['Blue'] }]
});

// Get wallet portfolio
const portfolio = await sonova.getWalletPortfolio('0x1234567890abcdef...');

// Search collections (v1)
const searchResults = await sonova.collections.searchCollections(1868, 'crypto');

// Launchpad operations
const launchpads = await sonova.launchpad.listLaunchpads(1868);
const eventStages = await sonova.launchpad.getEventStages('event-slug');
```

## 📚 Error Handling

```javascript
// Comprehensive error handling
class SonovaError extends Error {
  constructor(code, message, response = null) {
    super(message);
    this.code = code;
    this.response = response;
    this.name = 'SonovaError';
  }
}

// Enhanced API class with better error handling
class SonovaAPIEnhanced extends SonovaAPI {
  async request(endpoint, options = {}) {
    try {
      return await super.request(endpoint, options);
    } catch (error) {
      // Parse API error response
      if (error.message.includes('API Error:')) {
        const [, code, message] = error.message.match(/API Error: (\d+) - (.+)/) || [];
        throw new SonovaError(parseInt(code), message);
      }
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new SonovaError(0, 'Network error: Unable to connect to Sonova API');
      }
      
      throw error;
    }
  }
}

// Usage with error handling
try {
  const api = new SonovaAPIEnhanced();
  const result = await api.request('/some/endpoint');
} catch (error) {
  if (error instanceof SonovaError) {
    console.error(`Sonova API Error ${error.code}: ${error.message}`);
    
    // Handle specific error codes
    switch (error.code) {
      case 401:
        console.log('Authentication required');
        break;
      case 404:
        console.log('Resource not found');
        break;
      case 429:
        console.log('Rate limit exceeded');
        break;
      default:
        console.log('Unknown API error');
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🚀 Migration Guide: v1 to v4

### Ranking & Analytics Migration

```javascript
// OLD (v1): Basic collection stats
async function getBasicStats_v1(networkId, contractAddress) {
  return await api.request(`/v1/${networkId}/collections/${contractAddress}/stats`);
}

// NEW (v4): Enhanced collection ranking with trends
async function getEnhancedRanking_v4(networkId, options = {}) {
  const params = new URLSearchParams({
    order: 'volume',
    range: '1d',
    limit: '100',
    offset: '0',
    ...options
  });
  
  return await api.request(`/${networkId}/collection/v4/ranking/overall?${params}`);
}

// Migration example
const oldData = await getBasicStats_v1(1868, '0x123...');
const newData = await getEnhancedRanking_v4(1868, { 
  range: '24h',
  including_1155: true 
});

// v4 provides additional data:
// - floorDiff1d, floorDiff7d (price trends)
// - volumeChange, salesChange (trading trends)  
// - gold_mark (quality indicator)
// - Enhanced pagination with offset/limit
```

---

> **Complete Public Coverage**: This documentation covers all publicly available functionality from the Sonova marketplace APIs, including both v1 core features and v4 enhanced analytics, designed for third-party developers and integrators. 