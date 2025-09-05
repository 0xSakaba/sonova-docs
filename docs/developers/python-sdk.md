---
sidebar_position: 3
---

# Python Integration

Comprehensive Python integration guide for Sonova marketplace public APIs with enhanced v4 analytics support.

## 🚀 Installation & Setup

```bash
pip install requests
# Optional: for async support
pip install aiohttp
```

## 🔧 Basic Client Setup

```python
import requests
import json
from typing import Optional, Dict, List, Any
from urllib.parse import urlencode

class SonovaAPIError(Exception):
    """Custom exception for Sonova API errors"""
    def __init__(self, code: int, message: str, response: Optional[Dict] = None):
        self.code = code
        self.message = message
        self.response = response
        super().__init__(f"API Error {code}: {message}")

class SonovaClient:
    """Main client for Sonova marketplace APIs with v4 analytics support"""
    
    def __init__(self, session_token: Optional[str] = None):
        self.base_url = "https://api.sonova.one"
        self.session_token = session_token
        self.session = requests.Session()
        
        # Set default headers
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Sonova-Python-Client/1.0'
        })
        
        if session_token:
            self.session.headers['Authorization'] = f'Bearer {session_token}'
    
    def set_session_token(self, token: str):
        """Set session token for authenticated requests"""
        self.session_token = token
        self.session.headers['Authorization'] = f'Bearer {token}'
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make API request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            
            data = response.json()
            if not data.get('success', False):
                raise SonovaAPIError(
                    code=data.get('code', 0),
                    message=data.get('msg', 'Unknown error'),
                    response=data
                )
            
            return data.get('data', {})
            
        except requests.exceptions.RequestException as e:
            raise SonovaAPIError(0, f"Network error: {str(e)}")
    
    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """GET request"""
        return self._request('GET', endpoint, params=params)
    
    def post(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """POST request"""
        return self._request('POST', endpoint, json=data)
```

## 👤 User Authentication

```python
class UserService:
    """User authentication and profile management"""
    
    def __init__(self, client: SonovaClient):
        self.client = client
    
    def login(self, signature: str, message: str) -> Dict[str, Any]:
        """Login with wallet signature"""
        return self.client.post('/users/sessions/create', {
            'signature': signature,
            'message': message
        })
    
    def logout(self) -> Dict[str, Any]:
        """Logout current session"""
        return self.client.post('/users/sessions/destroy')
    
    def get_current_user(self) -> Dict[str, Any]:
        """Get current user information"""
        return self.client.get('/users/me')
    
    @staticmethod
    def create_login_message(address: str, nonce: Optional[int] = None) -> str:
        """Create message for wallet signing"""
        from datetime import datetime
        
        if nonce is None:
            import time
            nonce = int(time.time())
        
        domain = 'sonova.one'
        issued_at = datetime.utcnow().isoformat() + 'Z'
        
        return (
            f"{domain} wants you to sign in with your Ethereum account:\n"
            f"{address}\n\n"
            f"Sign in to Sonova marketplace\n\n"
            f"URI: https://{domain}\n"
            f"Version: 1\n"
            f"Chain ID: 1868\n"
            f"Nonce: {nonce}\n"
            f"Issued At: {issued_at}"
        )
```

## 🎨 Collection Services (v1)

```python
class CollectionService:
    """Collection management and information (v1 API)"""
    
    def __init__(self, client: SonovaClient):
        self.client = client
    
    def get_collection_detail(self, network_id: int, contract_or_slug: str) -> Dict[str, Any]:
        """Get detailed collection information"""
        return self.client.get(f'/v1/{network_id}/contracts/{contract_or_slug}/detail')
    
    def get_collection(self, network_id: int, contract_id: int) -> Dict[str, Any]:
        """Get collection by ID"""
        return self.client.get(f'/v1/{network_id}/contracts/{contract_id}')
    
    def get_collection_fees(self, network_id: int, contract_or_slug: str, market: str) -> Dict[str, Any]:
        """Get collection trading fees"""
        return self.client.get(f'/v1/{network_id}/contracts/{contract_or_slug}/fees', 
                              params={'market': market})
    
    def search_collections(self, network_id: int, keyword: str, erc_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search collections by keyword"""
        params = {'keyword': keyword}
        if erc_type:
            params['erc_type'] = erc_type
        
        return self.client.get(f'/v1/{network_id}/contracts/search', params=params)
    
    def get_collection_traits(self, network_id: int, contract_id: int) -> Dict[str, Any]:
        """Get collection trait aggregation"""
        return self.client.get(f'/v1/{network_id}/contracts/{contract_id}/trait_aggregation')
    
    def like_collection(self, network_id: int, contract_id: int) -> Dict[str, Any]:
        """Like a collection (requires authentication)"""
        return self.client.post(f'/v1/{network_id}/contracts/{contract_id}/like')
    
    def unlike_collection(self, network_id: int, contract_id: int) -> Dict[str, Any]:
        """Unlike a collection (requires authentication)"""
        return self.client.post(f'/v1/{network_id}/contracts/{contract_id}/unlike')
    
    def get_liked_collections(self, network_id: int) -> List[Dict[str, Any]]:
        """Get user's liked collections (requires authentication)"""
        return self.client.get(f'/v1/{network_id}/contracts/liked')
```

## 📊 Enhanced Analytics Services (v4)

```python
class AnalyticsService:
    """Enhanced analytics and ranking services (v4 API)"""
    
    def __init__(self, client: SonovaClient):
        self.client = client
    
    def get_collection_ranking(self, 
                              network_id: int,
                              order: str = 'volume',
                              range_period: str = '1d',
                              sort: str = 'desc',
                              including_1155: bool = True,
                              limit: int = 100,
                              offset: int = 0) -> Dict[str, Any]:
        """Get enhanced collection ranking with analytics"""
        params = {
            'order': order,
            'range': range_period,
            'sort': sort,
            'including_1155': str(including_1155).lower(),
            'limit': str(limit),
            'offset': str(offset)
        }
        
        return self.client.get(f'/{network_id}/collection/v4/ranking/overall', params=params)
    
    def get_collection_ranking_simple(self,
                                    network_id: int,
                                    order: str = 'volume',
                                    range_period: str = '1d',
                                    including_1155: bool = True,
                                    limit: int = 100,
                                    offset: int = 0) -> Dict[str, Any]:
        """Get simplified collection ranking for better performance"""
        params = {
            'order': order,
            'range': range_period,
            'including_1155': str(including_1155).lower(),
            'limit': str(limit),
            'offset': str(offset)
        }
        
        return self.client.get(f'/collections/{network_id}/ranking/v4/2/overall', params=params)
    
    def get_user_liked_collections(self,
                                  network_id: int,
                                  order: str = 'volume',
                                  range_period: str = '7d',
                                  sort: str = 'desc',
                                  including_1155: bool = True,
                                  limit: int = 100,
                                  offset: int = 0) -> Dict[str, Any]:
        """Get user's liked collections with analytics (requires authentication)"""
        params = {
            'order': order,
            'range': range_period,
            'sort': sort,
            'including_1155': str(including_1155).lower(),
            'limit': str(limit),
            'offset': str(offset)
        }
        
        return self.client.get(f'/{network_id}/collection/v4/likes', params=params)
    
    def get_collection_performance(self, 
                                  network_id: int,
                                  contract_address: str,
                                  time_ranges: List[str] = None) -> Dict[str, Dict[str, Any]]:
        """Get collection performance across multiple time ranges"""
        if time_ranges is None:
            time_ranges = ['1h', '1d', '7d']
        
        performance_data = {}
        
        for time_range in time_ranges:
            try:
                ranking_data = self.get_collection_ranking(
                    network_id=network_id,
                    range_period=time_range,
                    limit=100
                )
                
                # Find specific collection in ranking
                collections = ranking_data.get('data', [])
                collection = next(
                    (item for item in collections 
                     if item.get('collectionAddress', '').lower() == contract_address.lower()),
                    None
                )
                
                if collection:
                    performance_data[time_range] = {
                        **collection,
                        'rank': collections.index(collection) + 1,
                        'total_collections': ranking_data.get('total', 0)
                    }
                    
            except Exception as e:
                print(f"Error fetching {time_range} data: {e}")
                continue
        
        return performance_data
    
    def analyze_collection_trends(self, performance_data: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze collection trends from performance data"""
        analysis = {
            'trending': 'stable',
            'recommendation': 'hold',
            'signals': []
        }
        
        # Volume trend analysis
        hourly_data = performance_data.get('1h', {})
        if hourly_data.get('volumeChange', 0) > 0.5:
            analysis['signals'].append('🚀 High hourly volume spike')
            analysis['trending'] = 'bullish'
        
        # Floor price trend analysis
        daily_data = performance_data.get('1d', {})
        weekly_data = performance_data.get('7d', {})
        
        floor_trend_1d = daily_data.get('floorDiff1d', 0) or 0
        floor_trend_7d = weekly_data.get('floorDiff7d', 0) or 0
        
        if floor_trend_1d > 0.1 and floor_trend_7d > 0.1:
            analysis['signals'].append('📈 Sustained floor price growth')
            analysis['recommendation'] = 'bullish'
        elif floor_trend_1d < -0.1 and floor_trend_7d < -0.1:
            analysis['signals'].append('📉 Floor price decline')
            analysis['recommendation'] = 'bearish'
        
        # Sales momentum
        sales_change_1d = daily_data.get('salesChange', 0) or 0
        if sales_change_1d > 0.3:
            analysis['signals'].append('🔥 Strong sales momentum')
        
        return analysis
    
    def generate_collection_report(self, network_id: int, contract_address: str) -> Dict[str, Any]:
        """Generate comprehensive collection performance report"""
        print(f"\n📊 Generating Collection Performance Report: {contract_address}")
        print("=" * 60)
        
        # Get performance data
        performance = self.get_collection_performance(network_id, contract_address)
        analysis = self.analyze_collection_trends(performance)
        
        # Display performance data
        for time_range, data in performance.items():
            print(f"\n⏰ {time_range.upper()} Performance:")
            print(f"   Rank: #{data.get('rank', 'N/A')}")
            
            volume = data.get('volume', 0) or 0
            volume_change = data.get('volumeChange', 0) or 0
            print(f"   Volume: {volume:.2f} ETH ({volume_change * 100:.1f}% change)")
            
            sales = data.get('sales', 0) or 0
            sales_change = data.get('salesChange', 0) or 0
            print(f"   Sales: {sales} ({sales_change * 100:.1f}% change)")
            
            floor_price = data.get('floor', {}).get('price', 'N/A')
            print(f"   Floor: {floor_price} ETH")
        
        # Display analysis
        print(f"\n🔍 Analysis:")
        print(f"   Trend: {analysis['trending']}")
        print(f"   Recommendation: {analysis['recommendation']}")
        for signal in analysis['signals']:
            print(f"   {signal}")
        
        return {
            'performance': performance,
            'analysis': analysis,
            'contract_address': contract_address,
            'network_id': network_id
        }
```

## 🛒 Market & Trading Services (v1)

```python
class MarketService:
    """Market data and trading operations (v1 API)"""
    
    def __init__(self, client: SonovaClient):
        self.client = client
    
    def get_collection_nfts(self, 
                           network_id: int, 
                           contract_or_slug: str, 
                           **filters) -> List[Dict[str, Any]]:
        """Get collection NFTs with orders and filters"""
        default_filters = {
            'limit': 20,
            'offset': 0
        }
        default_filters.update(filters)
        
        return self.client.post(f'/v1/{network_id}/collections/{contract_or_slug}/nfts', 
                               default_filters)
    
    def get_collection_offers(self, 
                            network_id: int, 
                            contract_or_slug: str, 
                            currency: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get collection offers"""
        params = {}
        if currency:
            params['currency'] = currency
        
        return self.client.get(f'/v1/{network_id}/collections/{contract_or_slug}/offers', 
                              params=params)
    
    def check_collection_offers(self, 
                               network_id: int, 
                               contract_or_slug: str, 
                               amount: str, 
                               currency: str = 'ETH') -> Dict[str, Any]:
        """Check collection offers for specific amount"""
        return self.client.post(f'/v1/{network_id}/collections/{contract_or_slug}/offers', {
            'amount': amount,
            'currency': currency
        })
    
    def get_collection_events(self, 
                             network_id: int, 
                             contract_or_slug: str, 
                             **filters) -> List[Dict[str, Any]]:
        """Get collection events/activities"""
        default_filters = {
            'types': ['0', '1', '2'],  # list, sale, cancel
            'limit': 20,
            'offset': 0
        }
        default_filters.update(filters)
        
        return self.client.post(f'/v1/{network_id}/collections/{contract_or_slug}/events', 
                               default_filters)
    
    def get_collection_chart(self, 
                           network_id: int, 
                           contract_or_slug: str, 
                           chart_type: int = 0, 
                           time_period: str = '4H') -> Dict[str, Any]:
        """Get collection chart data"""
        params = {
            'type': str(chart_type),
            'time': time_period
        }
        
        return self.client.get(f'/v1/{network_id}/collections/{contract_or_slug}/chart', 
                              params=params)
    
    def get_collection_floor(self, network_id: int, contract_or_slug: str) -> Dict[str, Any]:
        """Get collection floor price"""
        return self.client.get(f'/v1/{network_id}/collections/{contract_or_slug}/floor')
    
    def get_collection_sales(self, 
                           network_id: int, 
                           contract_or_slug: str, 
                           **filters) -> List[Dict[str, Any]]:
        """Get collection sales"""
        default_filters = {
            'limit': 20,
            'offset': 0
        }
        default_filters.update(filters)
        
        return self.client.post(f'/v1/{network_id}/collections/{contract_or_slug}/sales', 
                               default_filters)
    
    def get_nfts(self, network_id: int, nft_ids: List[int]) -> List[Dict[str, Any]]:
        """Get NFT information with orders"""
        return self.client.post(f'/v1/{network_id}/nfts', {
            'nft_ids': nft_ids
        })
    
    def get_nft_trait_floors(self, network_id: int, nft_ids: List[int]) -> List[Dict[str, Any]]:
        """Get NFT trait floor prices"""
        return self.client.post(f'/v1/{network_id}/nfts/trait_floor', {
            'nft_ids': nft_ids
        })
```

## 👛 Wallet Services (v1)

```python
class WalletService:
    """Wallet portfolio and token management (v1 API)"""
    
    def __init__(self, client: SonovaClient):
        self.client = client
    
    def get_wallet_collections(self, 
                              network_id: int, 
                              wallet_address: str, 
                              **filters) -> List[Dict[str, Any]]:
        """Get wallet collections"""
        return self.client.get(f'/v1/{network_id}/wallets/{wallet_address}/collections', 
                              params=filters)
    
    def get_wallet_tokens(self, 
                         network_id: int, 
                         wallet_address: str, 
                         offset: int = 0, 
                         limit: int = 20, 
                         **filters) -> Dict[str, Any]:
        """Get wallet tokens with pagination"""
        params = {
            'offset': str(offset),
            'limit': str(limit),
            **filters
        }
        
        result = self.client.get(f'/v1/{network_id}/wallets/{wallet_address}/tokens', 
                                params=params)
        
        return {
            'tokens': result,
            'total': len(result)  # Note: API doesn't return total count directly
        }
    
    def get_wallet_listed_tokens(self, 
                                network_id: int, 
                                wallet_address: str, 
                                offset: int = 0, 
                                limit: int = 20, 
                                **filters) -> List[Dict[str, Any]]:
        """Get wallet listed tokens"""
        params = {
            'offset': str(offset),
            'limit': str(limit),
            **filters
        }
        
        return self.client.get(f'/v1/{network_id}/wallets/{wallet_address}/listed', 
                              params=params)
    
    def get_wallet_offers(self, 
                         network_id: int, 
                         wallet_address: str, 
                         offset: int = 0, 
                         limit: int = 20, 
                         **filters) -> List[Dict[str, Any]]:
        """Get wallet offers"""
        params = {
            'offset': str(offset),
            'limit': str(limit),
            **filters
        }
        
        return self.client.get(f'/v1/{network_id}/wallets/{wallet_address}/offers', 
                              params=params)
    
    def get_wallet_offer_collections(self, 
                                   network_id: int, 
                                   wallet_address: str, 
                                   currency: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get wallet offer collections"""
        params = {}
        if currency:
            params['currency'] = currency
        
        return self.client.get(f'/v1/{network_id}/wallets/{wallet_address}/offer_collections', 
                              params=params)
    
    def get_wallet_portfolio(self, network_id: int, wallet_address: str) -> Dict[str, Any]:
        """Get wallet portfolio summary"""
        return self.client.get(f'/v1/{network_id}/wallets/{wallet_address}/portfolio')
    
    def get_complete_portfolio(self, network_id: int, wallet_address: str) -> Dict[str, Any]:
        """Get complete wallet analysis"""
        print(f"📊 Loading portfolio for {wallet_address}...")
        
        try:
            # Fetch all data in parallel
            import concurrent.futures
            
            with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
                futures = {
                    'collections': executor.submit(self.get_wallet_collections, network_id, wallet_address),
                    'tokens': executor.submit(self.get_wallet_tokens, network_id, wallet_address, limit=50),
                    'portfolio': executor.submit(self.get_wallet_portfolio, network_id, wallet_address)
                }
                
                results = {}
                for key, future in futures.items():
                    try:
                        results[key] = future.result(timeout=10)
                    except Exception as e:
                        print(f"Error fetching {key}: {e}")
                        results[key] = [] if key != 'portfolio' else None
            
            collections = results['collections']
            tokens_result = results['tokens']
            portfolio = results['portfolio']
            
            print(f"Found {len(collections)} collections")
            print(f"Found {len(tokens_result.get('tokens', []))} tokens")
            
            if portfolio:
                print(f"Portfolio value: {portfolio.get('total_value', 'N/A')}")
            
            return {
                'collections': collections,
                'tokens': tokens_result.get('tokens', []),
                'total_tokens': tokens_result.get('total', 0),
                'portfolio': portfolio,
                'wallet_address': wallet_address
            }
            
        except Exception as e:
            print(f"Error loading portfolio: {e}")
            return {
                'collections': [],
                'tokens': [],
                'total_tokens': 0,
                'portfolio': None,
                'wallet_address': wallet_address
            }
```

## 🚀 Launchpad Services

```python
class LaunchpadService:
    """Launchpad management and interaction"""
    
    def __init__(self, client: SonovaClient):
        self.client = client
    
    def list_launchpads(self, network_id: int) -> List[Dict[str, Any]]:
        """List all active launchpads"""
        return self.client.get('/events', params={'network_id': str(network_id)})
    
    def get_launchpad_details(self, slug: str) -> Dict[str, Any]:
        """Get detailed launchpad information"""
        return self.client.get(f'/events/{slug}')
    
    def sign_event(self, slug: str, mint_amount: int) -> Dict[str, Any]:
        """Sign launchpad event (requires authentication)"""
        return self.client.post(f'/events/{slug}/sign', {
            'mint_amount': mint_amount
        })
    
    def get_event_stages(self, slug: str) -> Dict[str, Any]:
        """Get user's event stages info (requires authentication)"""
        return self.client.get(f'/events/{slug}/stages')
    
    def monitor_launchpads(self, network_id: int = 1868) -> List[Dict[str, Any]]:
        """Monitor all active launchpads"""
        from datetime import datetime
        
        launchpads = self.list_launchpads(network_id)
        
        print(f"Found {len(launchpads)} active launchpads:")
        
        for launchpad in launchpads:
            print(f"\n📋 {launchpad.get('name', 'Unknown')}")
            print(f"   Slug: {launchpad.get('slug', 'N/A')}")
            print(f"   Status: {launchpad.get('status', 'Unknown')}")
            
            if launchpad.get('start_time'):
                start_date = datetime.fromtimestamp(launchpad['start_time'])
                print(f"   Start: {start_date.strftime('%Y-%m-%d %H:%M:%S')}")
            
            if launchpad.get('end_time'):
                end_date = datetime.fromtimestamp(launchpad['end_time'])
                print(f"   End: {end_date.strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Get detailed info
            try:
                details = self.get_launchpad_details(launchpad['slug'])
                print(f"   Total Supply: {details.get('total_supply', 'Unknown')}")
                print(f"   Price: {details.get('price', 'TBA')}")
            except Exception as e:
                print(f"   Details: Error fetching ({e})")
        
        return launchpads
```

## 🔧 Complete SDK Integration

```python
class SonovaSDK:
    """Complete Sonova SDK with v4 analytics support"""
    
    SONEIUM_CHAIN_ID = 1868
    POLYGON_CHAIN_ID = 137
    
    def __init__(self, session_token: Optional[str] = None):
        self.client = SonovaClient(session_token)
        
        # Initialize all services
        self.users = UserService(self.client)
        self.collections = CollectionService(self.client)
        self.analytics = AnalyticsService(self.client)
        self.market = MarketService(self.client)
        self.wallets = WalletService(self.client)
        self.launchpad = LaunchpadService(self.client)
    
    def set_session_token(self, token: str):
        """Set session token for authenticated requests"""
        self.client.set_session_token(token)
    
    def get_user_profile(self) -> Dict[str, Any]:
        """Get complete user profile with enhanced analytics (requires authentication)"""
        profile = {
            'user_info': None,
            'liked_collections': [],
            'liked_collections_analytics': []
        }
        
        try:
            profile['user_info'] = self.users.get_current_user()
        except Exception as e:
            print(f"Failed to get user info: {e}")
        
        try:
            # Get basic liked collections (v1)
            profile['liked_collections'] = self.collections.get_liked_collections(self.SONEIUM_CHAIN_ID)
            
            # Get enhanced analytics for liked collections (v4)
            profile['liked_collections_analytics'] = self.analytics.get_user_liked_collections(
                self.SONEIUM_CHAIN_ID,
                range_period='7d',
                order='volume'
            )
        except Exception as e:
            print(f"Failed to get liked collections: {e}")
        
        return profile
    
    def get_collection_analytics(self, 
                                network_id: int, 
                                time_range: str = '1d',
                                order: str = 'volume',
                                limit: int = 50,
                                include_erc1155: bool = True) -> Dict[str, Any]:
        """Get enhanced collection analytics with trends"""
        try:
            # Get enhanced ranking data
            ranking = self.analytics.get_collection_ranking(
                network_id=network_id,
                range_period=time_range,
                order=order,
                limit=limit,
                including_1155=include_erc1155
            )
            
            return {
                'collections': ranking.get('data', []),
                'pagination': {
                    'limit': ranking.get('limit'),
                    'offset': ranking.get('offset'),
                    'total': ranking.get('total'),
                    'count': ranking.get('count')
                },
                'metadata': {
                    'time_range': time_range,
                    'order': order,
                    'timestamp': datetime.utcnow().isoformat()
                }
            }
        except Exception as e:
            print(f"Failed to get collection analytics: {e}")
            return {
                'collections': [], 
                'pagination': None, 
                'metadata': None
            }
    
    def get_wallet_portfolio(self, wallet_address: str, network_id: int = None) -> Dict[str, Any]:
        """Get complete wallet portfolio with market data"""
        if network_id is None:
            network_id = self.SONEIUM_CHAIN_ID
        
        return self.wallets.get_complete_portfolio(network_id, wallet_address)
    
    def get_collection_with_market_data(self, 
                                       network_id: int, 
                                       contract_or_slug: str) -> Dict[str, Any]:
        """Get collection with enhanced market data"""
        import concurrent.futures
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = {
                'detail': executor.submit(self.collections.get_collection_detail, network_id, contract_or_slug),
                'floor': executor.submit(self.market.get_collection_floor, network_id, contract_or_slug),
                'offers': executor.submit(self.market.get_collection_offers, network_id, contract_or_slug)
            }
            
            results = {}
            for key, future in futures.items():
                try:
                    results[key] = future.result(timeout=10)
                except Exception as e:
                    print(f"Error fetching {key}: {e}")
                    results[key] = None
        
        # Combine all data
        collection_data = results['detail'] or {}
        collection_data.update({
            'floor': results['floor'],
            'offers': results['offers']
        })
        
        return collection_data
    
    def compare_api_versions(self, network_id: int, contract_address: str) -> Dict[str, Any]:
        """Compare v1 vs v4 API responses"""
        print('\n🔍 Comparing v1 vs v4 API responses:')
        
        # v1: Basic collection details
        try:
            v1_details = self.collections.get_collection_detail(network_id, contract_address)
            print('\nv1 Collection Details:', {
                'name': v1_details.get('name'),
                'symbol': v1_details.get('symbol'),
                'verified': v1_details.get('verified')
            })
        except Exception as e:
            print(f'v1 error: {e}')
            v1_details = None
        
        # v4: Enhanced ranking data
        try:
            v4_ranking = self.analytics.get_collection_ranking(network_id, limit=100)
            v4_collection = None
            
            if v4_ranking and v4_ranking.get('data'):
                v4_collection = next(
                    (item for item in v4_ranking['data'] 
                     if item.get('collectionAddress', '').lower() == contract_address.lower()),
                    None
                )
            
            if v4_collection:
                print('\nv4 Enhanced Analytics:', {
                    'name': v4_collection.get('collection', {}).get('name'),
                    'volume': v4_collection.get('volume'),
                    'volume_change': f"{(v4_collection.get('volumeChange', 0) * 100):.1f}%",
                    'floor_diff_1d': f"{(v4_collection.get('floorDiff1d', 0) * 100):.1f}%",
                    'floor_diff_7d': f"{(v4_collection.get('floorDiff7d', 0) * 100):.1f}%",
                    'gold_mark': v4_collection.get('gold_mark'),
                    'rank': v4_ranking['data'].index(v4_collection) + 1
                })
        except Exception as e:
            print(f'v4 error: {e}')
            v4_collection = None
        
        return {
            'v1': v1_details,
            'v4': v4_collection
        }

# Convenience functions for quick usage
def create_login_message(address: str) -> str:
    """Create login message for wallet signing"""
    return UserService.create_login_message(address)

def quick_search(keyword: str, network_id: int = 1868) -> List[Dict[str, Any]]:
    """Quick collection search"""
    client = SonovaClient()
    collections = CollectionService(client)
    return collections.search_collections(network_id, keyword)

def get_trending_collections(network_id: int = 1868, 
                           time_range: str = '1h',
                           limit: int = 20) -> List[Dict[str, Any]]:
    """Get trending collections with v4 analytics"""
    client = SonovaClient()
    analytics = AnalyticsService(client)
    
    result = analytics.get_collection_ranking(
        network_id=network_id,
        range_period=time_range,
        order='volume',
        limit=limit
    )
    
    return result.get('data', [])
```

## 📋 Usage Examples

### Basic Usage
```python
from datetime import datetime

# Initialize SDK
sonova = SonovaSDK()

# Quick searches (v1)
collections = quick_search('crypto')
print(f"Found {len(collections)} collections")

# Get trending collections (v4)
trending = get_trending_collections(time_range='1h', limit=10)
print(f"Top trending collections: {[c['collection']['name'] for c in trending]}")

# Get collection details (v1)
collection = sonova.collections.get_collection_detail(1868, 'contract-address')
print(f"Collection: {collection.get('name')}")

# Get enhanced analytics (v4)
analytics = sonova.get_collection_analytics(1868, time_range='1d', limit=50)
print(f"Top collections by volume: {len(analytics['collections'])}")
```

### Authentication & User Profile
```python
# Authentication workflow
sonova = SonovaSDK()

# Create login message
address = "0x1234567890abcdef..."
message = create_login_message(address)
print(f"Please sign this message: {message}")

# After getting signature from wallet
signature = "0x..."  # From wallet
login_result = sonova.users.login(signature, message)
print(f"Login successful: {login_result}")

# Set session token
sonova.set_session_token(login_result['session_id'])

# Get user profile with enhanced analytics
profile = sonova.get_user_profile()
print(f"User liked {len(profile['liked_collections'])} collections")
print(f"Enhanced analytics for {len(profile['liked_collections_analytics'])} collections")
```

### Portfolio Analysis
```python
# Complete wallet analysis
wallet_address = "0x1234567890abcdef..."
portfolio = sonova.get_wallet_portfolio(wallet_address)

print(f"Wallet Portfolio for {wallet_address}:")
print(f"- Collections: {len(portfolio['collections'])}")
print(f"- Tokens: {portfolio['total_tokens']}")
if portfolio['portfolio']:
    print(f"- Portfolio Value: {portfolio['portfolio'].get('total_value', 'N/A')}")
```

### Enhanced Analytics & Performance Monitoring
```python
# Collection performance analysis with v4 APIs
contract_address = "0x1234567890abcdef..."

# Generate comprehensive report
report = sonova.analytics.generate_collection_report(1868, contract_address)

# Compare API versions
comparison = sonova.compare_api_versions(1868, contract_address)

# Get performance across time ranges
performance = sonova.analytics.get_collection_performance(
    1868, 
    contract_address, 
    ['1h', '1d', '7d', '30d']
)

# Analyze trends
trends = sonova.analytics.analyze_collection_trends(performance)
print(f"Collection trending: {trends['trending']}")
print(f"Recommendation: {trends['recommendation']}")
for signal in trends['signals']:
    print(f"- {signal}")
```

### Market Monitoring
```python
# Monitor collection market data
market_data = sonova.get_collection_with_market_data(1868, 'contract-address')

print(f"Collection: {market_data.get('name')}")
if market_data.get('floor'):
    print(f"Floor: {market_data['floor'].get('price')} ETH")
print(f"Active offers: {len(market_data.get('offers', []))}")

# Get collection NFTs with filters
nfts = sonova.market.get_collection_nfts(1868, 'contract-address', 
    price_min=0.1,
    price_max=10.0,
    trait_filters=[{'name': 'Background', 'values': ['Blue']}]
)

print(f"Found {len(nfts)} NFTs matching criteria")
```

### Launchpad Monitoring
```python
# For authenticated features
sonova.set_session_token('your-session-token')

# Monitor launchpads
launchpads = sonova.launchpad.monitor_launchpads(1868)

# Interact with specific launchpad
user_stages = sonova.launchpad.get_event_stages('launchpad-slug')
mint_signature = sonova.launchpad.sign_event('launchpad-slug', 1)
```

## 🚀 Migration Guide: v1 to v4

```python
# Example: Migrating from basic stats to enhanced analytics

# OLD (v1): Basic approach
class BasicCollectionTracker:
    def __init__(self):
        self.client = SonovaClient()
        self.collections = CollectionService(self.client)
    
    def get_collection_stats(self, contract_address: str) -> Dict[str, Any]:
        return self.collections.get_collection_detail(1868, contract_address)

# NEW (v4): Enhanced analytics approach  
class EnhancedCollectionTracker:
    def __init__(self):
        self.client = SonovaClient()
        self.analytics = AnalyticsService(self.client)
    
    def get_collection_analytics(self, contract_address: str, time_range: str = '1d') -> Dict[str, Any]:
        ranking_data = self.analytics.get_collection_ranking(
            network_id=1868,
            range_period=time_range,
            limit=100
        )
        
        # Find specific collection in ranking
        collection = next(
            (item for item in ranking_data.get('data', [])
             if item.get('collectionAddress', '').lower() == contract_address.lower()),
            None
        )
        
        if collection:
            collection['rank'] = ranking_data['data'].index(collection) + 1
            collection['total_collections'] = ranking_data.get('total', 0)
        
        return collection
    
    def get_trending_analysis(self, contract_address: str) -> Dict[str, Any]:
        time_ranges = ['1h', '1d', '7d']
        analytics_data = {}
        
        for time_range in time_ranges:
            analytics_data[time_range] = self.get_collection_analytics(contract_address, time_range)
        
        return {
            'contract': contract_address,
            'trending': {
                'hourly': 'bullish' if analytics_data.get('1h', {}).get('volumeChange', 0) > 0.5 else 'stable',
                'daily': 'bullish' if analytics_data.get('1d', {}).get('floorDiff1d', 0) > 0.1 else 'stable',
                'weekly': 'bullish' if analytics_data.get('7d', {}).get('floorDiff7d', 0) > 0.1 else 'stable'
            },
            'rankings': {
                'hourly': analytics_data.get('1h', {}).get('rank'),
                'daily': analytics_data.get('1d', {}).get('rank'),
                'weekly': analytics_data.get('7d', {}).get('rank')
            },
            'analytics_data': analytics_data
        }

# Migration example
old_tracker = BasicCollectionTracker()
new_tracker = EnhancedCollectionTracker()

contract_address = '0x1234567890abcdef...'

# Compare results
old_data = old_tracker.get_collection_stats(contract_address)
new_data = new_tracker.get_collection_analytics(contract_address)
trending = new_tracker.get_trending_analysis(contract_address)

print("Migration comparison:")
print(f"Old (v1): {old_data.get('name', 'N/A')}")
print(f"New (v4): {new_data.get('collection', {}).get('name', 'N/A')} - Rank #{new_data.get('rank', 'N/A')}")
print(f"Trending: {trending['trending']}")
```

## 🔧 Error Handling & Best Practices

```python
import time
from typing import Callable, Any

def retry_with_backoff(func: Callable, max_retries: int = 3, backoff_factor: float = 2.0) -> Any:
    """Retry function with exponential backoff"""
    for attempt in range(max_retries):
        try:
            return func()
        except SonovaAPIError as e:
            if e.code == 429:  # Rate limit
                if attempt < max_retries - 1:
                    wait_time = backoff_factor ** attempt
                    print(f"Rate limited, waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                    continue
            elif e.code >= 500:  # Server error
                if attempt < max_retries - 1:
                    wait_time = backoff_factor ** attempt
                    print(f"Server error, retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
            raise
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = backoff_factor ** attempt
                print(f"Unexpected error, retrying in {wait_time}s: {e}")
                time.sleep(wait_time)
                continue
            raise

# Usage with error handling
try:
    sonova = SonovaSDK()
    
    # Robust collection search with retry
    collections = retry_with_backoff(
        lambda: sonova.collections.search_collections(1868, 'crypto')
    )
    
    # Enhanced analytics with error handling
    analytics = retry_with_backoff(
        lambda: sonova.get_collection_analytics(1868, time_range='1h', limit=100)
    )
    
except SonovaAPIError as e:
    print(f"Sonova API Error {e.code}: {e.message}")
    if e.code == 401:
        print("Authentication required - please login first")
    elif e.code == 404:
        print("Resource not found")
    elif e.code == 429:
        print("Rate limit exceeded - please wait before retrying")

except Exception as e:
    print(f"Unexpected error: {e}")
```

---

> **Complete Coverage**: This Python integration covers all publicly available Sonova marketplace APIs, including v1 core functionality and v4 enhanced analytics. The SDK provides robust error handling, retry mechanisms, and comprehensive examples for building production-ready applications. 