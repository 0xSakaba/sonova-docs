---
sidebar_position: 4
---

# Integration Examples

Comprehensive code examples and tutorials for integrating with Sonova marketplace public APIs.

## 🚀 Quick Start Examples

### Search Collections
```javascript
// Search for collections by keyword
async function searchCollections(keyword) {
  try {
    const response = await fetch(`https://api.sonova.one/v1/1868/contracts/search?keyword=${encodeURIComponent(keyword)}`);
    const result = await response.json();
    
    if (result.success) {
      console.log(`Found ${result.data.length} collections:`);
      result.data.forEach(item => {
        console.log(`- ${item.name} (${item.symbol})`);
        console.log(`  Floor: ${item.floor_price || 'N/A'}`);
        console.log(`  Supply: ${item.total_supply}`);
      });
      return result.data;
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
  return [];
}

// Usage
await searchCollections('crypto');
```

### Get Collection Statistics
```javascript
// Get comprehensive collection trading statistics
async function getCollectionStats(contractAddress) {
  try {
    const response = await fetch(`https://api.sonova.one/v1/1868/collections/${contractAddress}/floor`);
    const result = await response.json();
    
    if (result.success) {
      const stats = result.data;
      console.log(`Collection Floor for ${contractAddress}`);
      console.log(`Floor Price: ${stats.price || 'N/A'} ${stats.currency || ''}`);
      
      return stats;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
  return null;
}
```

### Collection NFTs with Trading Data
```javascript
// Get NFTs from collection with market orders
async function getCollectionNFTs(contractAddress, filters = {}) {
  try {
    const defaultFilters = {
      limit: 20,
      offset: 0,
      ...filters
    };
    
    const response = await fetch(`https://api.sonova.one/v1/1868/collections/${contractAddress}/nfts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(defaultFilters)
    });
    
    const result = await response.json();
    if (result.success) {
      console.log(`Found ${result.data.length} NFTs:`);
      result.data.forEach((item, index) => {
        console.log(`${index + 1}. Token ID: ${item.nft?.token_id}`);
        console.log(`   Name: ${item.nft?.name || 'Unnamed'}`);
        if (item.order) {
          console.log(`   Price: ${item.order.price} ${item.order.currency}`);
          console.log(`   Marketplace: ${item.order.source === 1 ? 'OpenSea' : 'Sonova'}`);
        }
      });
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching NFTs:', error);
  }
  return [];
}
```

## 📊 Enhanced Analytics Examples (v4)

### Real-time Collection Ranking
```javascript
// Get enhanced collection ranking with analytics
async function getCollectionRanking(options = {}) {
  const {
    networkId = 1868,
    order = 'volume',
    range = '1d',
    limit = 50,
    including1155 = true
  } = options;

  try {
    const params = new URLSearchParams({
      order,
      range,
      including_1155: including1155.toString(),
      limit: limit.toString(),
      offset: '0'
    });

    const response = await fetch(`https://api.sonova.one/${networkId}/collection/v4/ranking/overall?${params}`);
    const result = await response.json();
    
    if (result.success) {
      console.log(`📊 Top ${result.data.count} collections by ${order} (${range}):`);
      
      result.data.data.forEach((item, index) => {
        const collection = item.collection;
        const trends = {
          floor1d: item.floorDiff1d ? `${(item.floorDiff1d * 100).toFixed(1)}%` : 'N/A',
          floor7d: item.floorDiff7d ? `${(item.floorDiff7d * 100).toFixed(1)}%` : 'N/A',
          volumeChange: item.volumeChange ? `${(item.volumeChange * 100).toFixed(1)}%` : 'N/A'
        };
        
        console.log(`\n${index + 1}. ${collection.name} ${item.gold_mark ? '🏆' : ''}`);
        console.log(`   Volume: ${item.volume || 0} ETH (${trends.volumeChange} change)`);
        console.log(`   Sales: ${item.sales || 0} (${trends.volumeChange} change)`);
        console.log(`   Floor: ${item.floor?.price || 'N/A'} (1d: ${trends.floor1d}, 7d: ${trends.floor7d})`);
        console.log(`   Holders: ${item.holders}, Items: ${item.items}`);
      });
      
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching ranking:', error);
  }
  return null;
}

// Usage examples
await getCollectionRanking({ order: 'volume', range: '1h' }); // Hourly volume leaders
await getCollectionRanking({ order: 'sales', range: '7d' });  // Weekly sales leaders
```

### User Liked Collections with Analytics
```javascript
// Get user's liked collections with enhanced analytics
async function getUserLikedAnalytics(sessionToken, options = {}) {
  const {
    networkId = 1868,
    order = 'volume',
    range = '7d',
    limit = 20
  } = options;

  try {
    const params = new URLSearchParams({
      order,
      range,
      limit: limit.toString(),
      offset: '0'
    });

    const response = await fetch(`https://api.sonova.one/${networkId}/collection/v4/likes?${params}`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`💖 Your liked collections performance (${range}):`);
      
      result.data.data.forEach((item, index) => {
        const performance = {
          floorChange: item.floorDiff7d ? `${(item.floorDiff7d * 100).toFixed(1)}%` : 'N/A',
          volumeChange: item.volumeChange ? `${(item.volumeChange * 100).toFixed(1)}%` : 'N/A'
        };
        
        console.log(`\n${index + 1}. ${item.collection.name}`);
        console.log(`   📈 Floor change (7d): ${performance.floorChange}`);
        console.log(`   💹 Volume change: ${performance.volumeChange}`);
        console.log(`   💰 Current floor: ${item.floor?.price || 'N/A'} ETH`);
      });
      
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching liked collections analytics:', error);
  }
  return null;
}
```

### Collection Performance Monitor
```javascript
// Monitor collection performance across different time ranges
class CollectionPerformanceMonitor {
  constructor() {
    this.baseURL = 'https://api.sonova.one';
    this.networkId = 1868;
  }

  // Get collection performance across multiple time ranges
  async getCollectionPerformance(contractAddress, ranges = ['1h', '1d', '7d']) {
    const performanceData = {};
    
    for (const range of ranges) {
      try {
        const params = new URLSearchParams({
          order: 'volume',
          range,
          limit: '100',
          offset: '0'
        });

        const response = await fetch(`${this.baseURL}/${this.networkId}/collection/v4/ranking/overall?${params}`);
        const result = await response.json();
        
        if (result.success) {
          const collection = result.data.data.find(item => 
            item.collectionAddress.toLowerCase() === contractAddress.toLowerCase()
          );
          
          if (collection) {
            performanceData[range] = {
              volume: collection.volume,
              volumeChange: collection.volumeChange,
              sales: collection.sales,
              salesChange: collection.salesChange,
              floor: collection.floor,
              floorDiff1d: collection.floorDiff1d,
              floorDiff7d: collection.floorDiff7d,
              rank: result.data.data.indexOf(collection) + 1
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching ${range} data:`, error);
      }
    }

    return performanceData;
  }

  // Analyze collection trends
  analyzeCollectionTrends(performanceData) {
    const analysis = {
      trending: 'stable',
      recommendation: 'hold',
      signals: []
    };

    // Volume trend analysis
    if (performanceData['1h']?.volumeChange > 0.5) {
      analysis.signals.push('🚀 High hourly volume spike');
      analysis.trending = 'bullish';
    }

    // Floor price trend analysis
    const floorTrend1d = performanceData['1d']?.floorDiff1d || 0;
    const floorTrend7d = performanceData['7d']?.floorDiff7d || 0;

    if (floorTrend1d > 0.1 && floorTrend7d > 0.1) {
      analysis.signals.push('📈 Sustained floor price growth');
      analysis.recommendation = 'bullish';
    } else if (floorTrend1d < -0.1 && floorTrend7d < -0.1) {
      analysis.signals.push('📉 Floor price decline');
      analysis.recommendation = 'bearish';
    }

    // Sales momentum
    const salesChange1d = performanceData['1d']?.salesChange || 0;
    if (salesChange1d > 0.3) {
      analysis.signals.push('🔥 Strong sales momentum');
    }

    return analysis;
  }

  // Complete monitoring report
  async generateMonitoringReport(contractAddress) {
    console.log(`\n📊 Collection Performance Report: ${contractAddress}`);
    console.log('='.repeat(60));

    const performance = await this.getCollectionPerformance(contractAddress);
    const analysis = this.analyzeCollectionTrends(performance);

    // Display performance data
    Object.entries(performance).forEach(([range, data]) => {
      console.log(`\n⏰ ${range.toUpperCase()} Performance:`);
      console.log(`   Rank: #${data.rank}`);
      console.log(`   Volume: ${data.volume?.toFixed(2) || 0} ETH (${((data.volumeChange || 0) * 100).toFixed(1)}%)`);
      console.log(`   Sales: ${data.sales || 0} (${((data.salesChange || 0) * 100).toFixed(1)}%)`);
      console.log(`   Floor: ${data.floor?.price || 'N/A'} ETH`);
    });

    // Display analysis
    console.log(`\n🔍 Analysis:`);
    console.log(`   Trend: ${analysis.trending}`);
    console.log(`   Recommendation: ${analysis.recommendation}`);
    analysis.signals.forEach(signal => console.log(`   ${signal}`));

    return { performance, analysis };
  }
}

// Usage
const monitor = new CollectionPerformanceMonitor();
await monitor.generateMonitoringReport('0x1234567890abcdef...');
```

## 🔐 User Authentication Integration

### Wallet Connection & Authentication
```javascript
// Complete authentication flow
class SonovaAuth {
  constructor() {
    this.apiBase = 'https://api.sonova.one';
    this.sessionToken = null;
  }

  // Create login message
  createLoginMessage(address, nonce = Date.now()) {
    const domain = 'sonova.one';
    const issuedAt = new Date().toISOString();
    
    return `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nSign in to Sonova marketplace\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1868\nNonce: ${nonce}\nIssued At: ${issuedAt}`;
  }

  // Login with wallet signature
  async login(address, signature, message) {
    try {
      const response = await fetch(`${this.apiBase}/users/sessions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signature,
          message
        })
      });

      const result = await response.json();
      if (result.success) {
        this.sessionToken = result.data.session_id;
        console.log('Login successful!');
        return result.data;
      } else {
        throw new Error(result.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    if (!this.sessionToken) return;

    try {
      await fetch(`${this.apiBase}/users/sessions/destroy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });
      
      this.sessionToken = null;
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get authenticated request headers
  getAuthHeaders() {
    return this.sessionToken ? {
      'Authorization': `Bearer ${this.sessionToken}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }
}

// Usage with Web3
async function connectAndLogin() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not found');
  }

  // Request account access
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  
  const address = accounts[0];
  const auth = new SonovaAuth();
  
  // Create message to sign
  const message = auth.createLoginMessage(address);
  
  // Sign message
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, address]
  });
  
  // Login to Sonova
  const loginResult = await auth.login(address, signature, message);
  
  return { auth, address, loginResult };
}
```

## 👛 Wallet Integration

### Portfolio Tracker
```javascript
// Complete wallet portfolio integration
class WalletPortfolio {
  constructor() {
    this.apiBase = 'https://api.sonova.one';
  }

  // Get wallet collections
  async getWalletCollections(walletAddress, networkId = 1868) {
    try {
      const response = await fetch(
        `${this.apiBase}/v1/${networkId}/wallets/${walletAddress}/collections`
      );
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching wallet collections:', error);
      return [];
    }
  }

  // Get wallet tokens with pagination
  async getWalletTokens(walletAddress, options = {}) {
    const {
      networkId = 1868,
      contract = null,
      offset = 0,
      limit = 20,
      ercType = null
    } = options;

    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString()
      });
      
      if (contract) params.append('contract', contract);
      if (ercType) params.append('erc_type', ercType);

      const response = await fetch(
        `${this.apiBase}/v1/${networkId}/wallets/${walletAddress}/tokens?${params}`
      );
      
      const result = await response.json();
      return result.success ? { tokens: result.data, total: result.total } : { tokens: [], total: 0 };
    } catch (error) {
      console.error('Error fetching wallet tokens:', error);
      return { tokens: [], total: 0 };
    }
  }

  // Get wallet portfolio summary
  async getPortfolioSummary(walletAddress, networkId = 1868) {
    try {
      const response = await fetch(
        `${this.apiBase}/v1/${networkId}/wallets/${walletAddress}/portfolio`
      );
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      return null;
    }
  }

  // Get complete wallet analysis
  async getCompletePortfolio(walletAddress, networkId = 1868) {
    console.log(`📊 Loading portfolio for ${walletAddress}...`);
    
    const [collections, tokensResult, portfolio] = await Promise.all([
      this.getWalletCollections(walletAddress, networkId),
      this.getWalletTokens(walletAddress, { networkId, limit: 50 }),
      this.getPortfolioSummary(walletAddress, networkId)
    ]);

    console.log(`Found ${collections.length} collections`);
    console.log(`Found ${tokensResult.tokens.length} tokens (total: ${tokensResult.total})`);
    
    if (portfolio) {
      console.log(`Portfolio value: ${portfolio.total_value || 'N/A'}`);
    }

    return {
      collections,
      tokens: tokensResult.tokens,
      totalTokens: tokensResult.total,
      portfolio
    };
  }
}

// Usage
const portfolio = new WalletPortfolio();
const walletData = await portfolio.getCompletePortfolio('0x1234567890abcdef...');
```

## 🛒 Market Data Integration

### Real-time Market Monitor
```javascript
// Monitor collection market data
class MarketMonitor {
  constructor() {
    this.apiBase = 'https://api.sonova.one';
    this.subscriptions = new Map();
  }

  // Get collection market data
  async getCollectionMarketData(contractAddress, networkId = 1868) {
    try {
      const [floor, offers, events] = await Promise.all([
        this.getFloorPrice(contractAddress, networkId),
        this.getOffers(contractAddress, networkId),
        this.getRecentEvents(contractAddress, networkId)
      ]);

      return {
        contract: contractAddress,
        floor,
        offers: offers.slice(0, 5), // Top 5 offers
        recentSales: events.filter(e => e.type === '1').slice(0, 10), // Recent sales
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  }

  async getFloorPrice(contractAddress, networkId) {
    const response = await fetch(`${this.apiBase}/v1/${networkId}/collections/${contractAddress}/floor`);
    const result = await response.json();
    return result.success ? result.data : null;
  }

  async getOffers(contractAddress, networkId) {
    const response = await fetch(`${this.apiBase}/v1/${networkId}/collections/${contractAddress}/offers`);
    const result = await response.json();
    return result.success ? result.data : [];
  }

  async getRecentEvents(contractAddress, networkId) {
    const response = await fetch(`${this.apiBase}/v1/${networkId}/collections/${contractAddress}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        types: ['0', '1', '2'], // list, sale, cancel
        limit: 20,
        offset: 0
      })
    });
    const result = await response.json();
    return result.success ? result.data : [];
  }

  // Monitor multiple collections
  async startMonitoring(contracts, intervalMs = 30000) {
    for (const contract of contracts) {
      this.subscriptions.set(contract, setInterval(async () => {
        const data = await this.getCollectionMarketData(contract);
        if (data) {
          this.onMarketUpdate(data);
        }
      }, intervalMs));
    }
  }

  // Override this method to handle updates
  onMarketUpdate(data) {
    console.log(`Market update for ${data.contract}:`);
    if (data.floor) {
      console.log(`  Floor: ${data.floor.price} ${data.floor.currency}`);
    }
    console.log(`  Active offers: ${data.offers.length}`);
    console.log(`  Recent sales: ${data.recentSales.length}`);
  }

  stopMonitoring() {
    for (const [contract, intervalId] of this.subscriptions) {
      clearInterval(intervalId);
    }
    this.subscriptions.clear();
  }
}

// Usage
const monitor = new MarketMonitor();
await monitor.startMonitoring([
  '0x1234567890abcdef...',
  '0xabcdef1234567890...'
]);
```

## 🚀 Launchpad Integration

### Launchpad Monitor
```javascript
// Monitor and interact with launchpads
class LaunchpadMonitor {
  constructor(sessionToken = null) {
    this.sessionToken = sessionToken;
    this.apiBase = 'https://api.sonova.one';
  }

  // Get authenticated headers
  getHeaders() {
    return this.sessionToken ? {
      'Authorization': `Bearer ${this.sessionToken}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  // List all active launchpads
  async getActiveLaunchpads(networkId = 1868) {
    try {
      const response = await fetch(
        `${this.apiBase}/events?network_id=${networkId}`,
        { headers: this.getHeaders() }
      );

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching launchpads:', error);
      return [];
    }
  }

  // Get launchpad details
  async getLaunchpadDetails(slug) {
    try {
      const response = await fetch(
        `${this.apiBase}/events/${slug}`,
        { headers: this.getHeaders() }
      );

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching launchpad details:', error);
      return null;
    }
  }

  // Get user's eligibility for launchpad (requires authentication)
  async getUserStages(slug) {
    if (!this.sessionToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${this.apiBase}/events/${slug}/stages`,
        { headers: this.getHeaders() }
      );

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching user stages:', error);
      return null;
    }
  }

  // Sign mint transaction (requires authentication)
  async signMint(slug, mintAmount) {
    if (!this.sessionToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${this.apiBase}/events/${slug}/sign`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ mint_amount: mintAmount })
        }
      );

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error signing mint:', error);
      return null;
    }
  }

  // Monitor all launchpads
  async monitorLaunchpads() {
    const launchpads = await this.getActiveLaunchpads();
    
    console.log(`Found ${launchpads.length} active launchpads:`);
    
    for (const launchpad of launchpads) {
      console.log(`\n📋 ${launchpad.name}`);
      console.log(`   Slug: ${launchpad.slug}`);
      console.log(`   Status: ${launchpad.status}`);
      
      if (launchpad.start_time) {
        const startDate = new Date(launchpad.start_time * 1000);
        console.log(`   Start: ${startDate.toLocaleString()}`);
      }
      
      if (launchpad.end_time) {
        const endDate = new Date(launchpad.end_time * 1000);
        console.log(`   End: ${endDate.toLocaleString()}`);
      }

      // Get detailed info
      const details = await this.getLaunchpadDetails(launchpad.slug);
      if (details) {
        console.log(`   Total Supply: ${details.total_supply || 'Unknown'}`);
        console.log(`   Price: ${details.price || 'TBA'}`);
      }
    }

    return launchpads;
  }
}

// Usage
const monitor = new LaunchpadMonitor('your-session-token');
const launchpads = await monitor.monitorLaunchpads();

// For specific launchpad interaction
const userStages = await monitor.getUserStages('launchpad-slug');
const mintSignature = await monitor.signMint('launchpad-slug', 1);
```

## 🔧 Complete Integration Example

### Full-Featured Sonova App with v4 Analytics
```javascript
// Complete application integrating all Sonova features with v4 analytics
class SonovaApp {
  constructor(config = {}) {
    this.apiBase = 'https://api.sonova.one';
    this.sessionToken = null;
    this.defaultNetwork = config.defaultNetwork || 1868;
  }

  // Authentication
  async login(signature, message) {
    const response = await fetch(`${this.apiBase}/users/sessions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature, message })
    });

    const result = await response.json();
    if (result.success) {
      this.sessionToken = result.data.session_id;
    }
    return result;
  }

  // Get headers with authentication
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    
    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
    }
    
    return headers;
  }

  // Collections (v1)
  async searchCollections(keyword, ercType = null) {
    const params = new URLSearchParams({ keyword });
    if (ercType) params.append('erc_type', ercType);

    const response = await fetch(
      `${this.apiBase}/v1/${this.defaultNetwork}/contracts/search?${params}`,
      { headers: this.getHeaders() }
    );
    
    const result = await response.json();
    return result.success ? result.data : [];
  }

  async getCollectionDetails(contractAddress) {
    const response = await fetch(
      `${this.apiBase}/v1/${this.defaultNetwork}/contracts/${contractAddress}/detail`,
      { headers: this.getHeaders() }
    );
    
    const result = await response.json();
    return result.success ? result.data : null;
  }

  // Enhanced Analytics (v4)
  async getCollectionRanking(options = {}) {
    const {
      order = 'volume',
      range = '1d',
      limit = 50,
      including1155 = true
    } = options;

    const params = new URLSearchParams({
      order,
      range,
      including_1155: including1155.toString(),
      limit: limit.toString(),
      offset: '0'
    });

    const response = await fetch(
      `${this.apiBase}/${this.defaultNetwork}/collection/v4/ranking/overall?${params}`,
      { headers: this.getHeaders() }
    );
    
    const result = await response.json();
    return result.success ? result.data : null;
  }

  // Market data (v1)
  async getCollectionNFTs(contractAddress, filters = {}) {
    const response = await fetch(
      `${this.apiBase}/v1/${this.defaultNetwork}/collections/${contractAddress}/nfts`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ limit: 20, offset: 0, ...filters })
      }
    );
    
    const result = await response.json();
    return result.success ? result.data : [];
  }

  // Wallet functions (v1)
  async getWalletPortfolio(walletAddress) {
    const response = await fetch(
      `${this.apiBase}/v1/${this.defaultNetwork}/wallets/${walletAddress}/portfolio`,
      { headers: this.getHeaders() }
    );
    
    const result = await response.json();
    return result.success ? result.data : null;
  }

  // Enhanced dashboard with v4 analytics
  async getDashboard(walletAddress = null) {
    const dashboard = {
      timestamp: new Date().toISOString(),
      collections: [],
      ranking: null,
      portfolio: null
    };

    try {
      // Get basic collections (v1)
      dashboard.collections = await this.searchCollections('', null);
      dashboard.collections = dashboard.collections.slice(0, 10); // Top 10

      // Get enhanced ranking analytics (v4)
      dashboard.ranking = await this.getCollectionRanking({
        order: 'volume',
        range: '1d',
        limit: 20
      });

      // Get user portfolio if wallet provided (v1)
      if (walletAddress) {
        dashboard.portfolio = await this.getWalletPortfolio(walletAddress);
      }

      console.log('Dashboard loaded successfully');
      return dashboard;
    } catch (error) {
      console.error('Error loading dashboard:', error);
      return dashboard;
    }
  }

  // Compare v1 vs v4 data
  async compareVersions(contractAddress) {
    console.log('\n🔍 Comparing v1 vs v4 API responses:');
    
    // v1: Basic collection details
    const v1Details = await this.getCollectionDetails(contractAddress);
    console.log('\nv1 Collection Details:', {
      name: v1Details?.name,
      symbol: v1Details?.symbol,
      verified: v1Details?.verified
    });

    // v4: Enhanced ranking data
    const v4Ranking = await this.getCollectionRanking({ limit: 100 });
    const v4Collection = v4Ranking?.data?.find(item => 
      item.collectionAddress.toLowerCase() === contractAddress.toLowerCase()
    );
    
    if (v4Collection) {
      console.log('\nv4 Enhanced Analytics:', {
        name: v4Collection.collection.name,
        volume: v4Collection.volume,
        volumeChange: `${((v4Collection.volumeChange || 0) * 100).toFixed(1)}%`,
        floorDiff1d: `${((v4Collection.floorDiff1d || 0) * 100).toFixed(1)}%`,
        floorDiff7d: `${((v4Collection.floorDiff7d || 0) * 100).toFixed(1)}%`,
        goldMark: v4Collection.gold_mark,
        rank: v4Ranking.data.indexOf(v4Collection) + 1
      });
    }

    return { v1: v1Details, v4: v4Collection };
  }
}

// Usage with v4 analytics
const app = new SonovaApp({
  defaultNetwork: 1868
});

// Login first (in real app, get these from wallet)
// await app.login(signature, message);

// Load enhanced dashboard with v4 analytics
const dashboard = await app.getDashboard('0x1234567890abcdef...');
console.log('Enhanced Dashboard:', dashboard);

// Compare API versions
await app.compareVersions('0x1234567890abcdef...');

// Search collections (v1)
const collections = await app.searchCollections('crypto');

// Get enhanced ranking (v4)
const topVolume = await app.getCollectionRanking({
  order: 'volume',
  range: '1h',
  limit: 10
});

console.log('Top volume collections (last hour):', topVolume);

// Get NFTs with filters (v1)
const nfts = await app.getCollectionNFTs('0x1234567890abcdef...', {
  price_min: 0.1,
  price_max: 1.0,
  trait_filters: [{ name: 'Background', values: ['Blue'] }]
});
```

## 🚀 API Version Migration Examples

### v1 to v4 Migration Guide

```javascript
// Example: Migrating from basic collection stats to enhanced analytics

// OLD (v1): Basic approach
class BasicCollectionTracker_v1 {
  async getCollectionStats(contractAddress) {
    const response = await fetch(`https://api.sonova.one/v1/1868/collections/${contractAddress}/stats`);
    return response.json();
  }
}

// NEW (v4): Enhanced analytics approach
class EnhancedCollectionTracker_v4 {
  async getCollectionAnalytics(contractAddress, timeRange = '1d') {
    const params = new URLSearchParams({
      order: 'volume',
      range: timeRange,
      limit: '100',
      offset: '0'
    });
    
    const response = await fetch(`https://api.sonova.one/1868/collection/v4/ranking/overall?${params}`);
    const result = await response.json();
    
    // Find specific collection in ranking
    const collection = result.data.data.find(item => 
      item.collectionAddress.toLowerCase() === contractAddress.toLowerCase()
    );
    
    return {
      ...collection,
      rank: result.data.data.indexOf(collection) + 1,
      totalCollections: result.data.total
    };
  }
  
  // Get trending analysis
  async getTrendingAnalysis(contractAddress) {
    const [hourly, daily, weekly] = await Promise.all([
      this.getCollectionAnalytics(contractAddress, '1h'),
      this.getCollectionAnalytics(contractAddress, '1d'),
      this.getCollectionAnalytics(contractAddress, '7d')
    ]);
    
    return {
      collection: contractAddress,
      trending: {
        hourly: hourly?.volumeChange > 0.5 ? 'bullish' : 'stable',
        daily: daily?.floorDiff1d > 0.1 ? 'bullish' : 'stable',
        weekly: weekly?.floorDiff7d > 0.1 ? 'bullish' : 'stable'
      },
      rankings: {
        hourly: hourly?.rank,
        daily: daily?.rank,
        weekly: weekly?.rank
      }
    };
  }
}

// Migration example
const oldTracker = new BasicCollectionTracker_v1();
const newTracker = new EnhancedCollectionTracker_v4();

// Compare results
const contractAddress = '0x1234567890abcdef...';
const [oldData, newData, trending] = await Promise.all([
  oldTracker.getCollectionStats(contractAddress),
  newTracker.getCollectionAnalytics(contractAddress),
  newTracker.getTrendingAnalysis(contractAddress)
]);

console.log('Migration comparison:', {
  old: oldData,
  new: newData,
  trending: trending
});
```

---

> **Note**: All examples use publicly available endpoints and demonstrate best practices for integrating with Sonova marketplace APIs. The v4 examples showcase the enhanced analytics capabilities with trend analysis, performance monitoring, and improved data structures. 