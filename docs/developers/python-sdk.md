---
sidebar_position: 3
---

# Python Integration

Python integration guide for Sonova marketplace.

## 🚀 Direct API Integration

Currently, Sonova doesn't have an official Python SDK. Integration is done through direct REST API calls using the `requests` library.

### Installation

```bash
pip install requests
```

### Basic Setup

```python
import requests
from typing import Dict, List, Optional, Union
import json

SONOVA_API_BASE = "https://api.sonova.one"
SONOVA_OPENAPI_BASE = "https://api.sonova.one/open"
SONEIUM_CHAIN_ID = 1868
POLYGON_CHAIN_ID = 137

class SonovaAPIError(Exception):
    def __init__(self, code: int, message: str):
        self.code = code
        super().__init__(message)

def sonova_api(endpoint: str, method: str = "GET", data: Optional[Dict] = None, 
            headers: Optional[Dict] = None, use_openapi: bool = False) -> Dict:
    """Helper function for API calls"""
    base_url = SONOVA_OPENAPI_BASE if use_openapi else SONOVA_API_BASE
    url = f"{base_url}{endpoint}"
    
    default_headers = {"Content-Type": "application/json"}
    if headers:
        default_headers.update(headers)
    
    kwargs = {
        "headers": default_headers,
        "timeout": 30
    }
    
    if data and method in ["POST", "PUT", "PATCH"]:
        kwargs["json"] = data
    
    response = requests.request(method, url, **kwargs)
    response.raise_for_status()
    
    result = response.json()
    if not result.get("success", False):
        raise SonovaAPIError(result.get("code", 0), f"API Error: {result.get('code', 'Unknown')}")
    
    return result.get("data", {})
```

## 📚 Public API Operations

### User Authentication

```python
def login_user(signature: str, message: str) -> Dict:
    """Login user with signature"""
    try:
        endpoint = "/api/users/sessions/create"
        return sonova_api(endpoint, method="POST", data={"signature": signature, "message": message})
    except Exception as e:
        print(f"Login failed: {e}")
        return {}

def logout_user(headers: Dict) -> Dict:
    """Logout current user"""
    try:
        endpoint = "/api/users/sessions/destroy"
        return sonova_api(endpoint, method="POST", headers=headers)
    except Exception as e:
        print(f"Logout failed: {e}")
        return {}
```

### Collection Management

```python
def get_collection_detail(network_id: int, contract_or_slug: str) -> Dict:
    """Get collection details"""
    try:
        endpoint = f"/api/v1/{network_id}/contracts/{contract_or_slug}/detail"
        return sonova_api(endpoint)
    except Exception as e:
        print(f"Failed to fetch collection: {e}")
        return {}

def search_collections(network_id: int, keyword: str, erc_type: Optional[str] = None) -> List[Dict]:
    """Search collections by keyword"""
    try:
        endpoint = f"/api/v1/{network_id}/contracts/search"
        params = {"keyword": keyword}
        if erc_type:
            params["erc_type"] = erc_type
        response = requests.get(f"{SONOVA_API_BASE}{endpoint}", params=params)
        response.raise_for_status()
        result = response.json()
        return result.get("data", [])
    except Exception as e:
        print(f"Failed to search collections: {e}")
        return []

def get_collection_traits(network_id: int, contract_id: int) -> Dict:
    """Get collection trait aggregation"""
    try:
        endpoint = f"/api/v1/{network_id}/contracts/{contract_id}/trait_aggregation"
        return sonova_api(endpoint)
    except Exception as e:
        print(f"Failed to fetch collection traits: {e}")
        return {}

def like_collection(network_id: int, contract_id: int, headers: Dict) -> bool:
    """Like a collection (requires auth)"""
    try:
        endpoint = f"/api/v1/{network_id}/contracts/{contract_id}/like"
        sonova_api(endpoint, method="POST", headers=headers)
        return True
    except Exception as e:
        print(f"Failed to like collection: {e}")
        return False

# Usage
collection = get_collection_detail(1868, "my-collection-slug")
print(f"Collection: {collection.get('name', 'Unknown')}")
print(f"Contract: {collection.get('contract', 'Unknown')}")
```

### List Collection NFTs

```python
def get_collection_nfts(contract_or_slug: str, filters: Optional[Dict] = None, network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Get NFTs from a collection with optional filters"""
    body = {
        "limit": 20,
        "offset": 0,
        **(filters or {})
    }
    
    try:
        endpoint = f"/api/v1/{network_id}/collections/{contract_or_slug}/nfts"
        return sonova_api(endpoint, method="POST", data=body)
    except Exception as e:
        print(f"Failed to fetch NFTs: {e}")
        return []

# Usage with filters
nfts = get_collection_nfts("my-collection", {
    "price_min": 0.1,
    "price_max": 10,
    "trait_filters": [
        {
            "name": "Background",
            "values": ["Blue", "Red"]
        }
    ]
})
```

### Search Collections

```python
def search_collections(keyword: str, network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Search for collections by keyword"""
    try:
        endpoint = f"/api/v1/{network_id}/contracts/search"
        response = requests.get(f"{SONOVA_API_BASE}{endpoint}", 
                              params={"keyword": keyword})
        response.raise_for_status()
        result = response.json()
        return result.get("data", [])
    except Exception as e:
        print(f"Failed to search collections: {e}")
        return []
```

## 🔐 Authenticated Operations

### Setup Authentication

```python
class SonovaClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = SONOVA_API_BASE
        self.chain_id = SONEIUM_CHAIN_ID
        
    def _authenticated_request(self, endpoint: str, method: str = "GET", 
                             data: Optional[Dict] = None) -> Dict:
        """Make authenticated API request"""
        headers = {
            "Content-Type": "application/json",
            "X-API-KEY": self.api_key
        }
        
        return sonova_api(endpoint, method=method, data=data, headers=headers)
    
    def get_user_session(self, signature: str, message: str) -> Dict:
        """Create user session"""
        try:
            endpoint = "/api/users/sessions/create"
            data = {"signature": signature, "message": message}
            return self._authenticated_request(endpoint, method="POST", data=data)
        except Exception as e:
            print(f"Failed to create session: {e}")
            return {}

# Usage
client = SonovaClient("your_api_key_here")
```

## 🏗️ Wallet Integration

### Get Wallet Data

```python
def get_wallet_collections(wallet_address: str, network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Get collections owned by a wallet"""
    try:
        endpoint = f"/api/v1/{network_id}/wallets/{wallet_address}/collections"
        return sonova_api(endpoint)
    except Exception as e:
        print(f"Failed to fetch wallet collections: {e}")
        return []

def get_wallet_portfolio(wallet_address: str, network_id: int = SONEIUM_CHAIN_ID) -> Dict:
    """Get wallet portfolio summary"""
    try:
        endpoint = f"/api/v1/{network_id}/wallets/{wallet_address}/portfolio"
        return sonova_api(endpoint)
    except Exception as e:
        print(f"Failed to fetch wallet portfolio: {e}")
        return {}

def get_wallet_tokens(wallet_address: str, contract: Optional[str] = None, network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Get tokens owned by wallet"""
    try:
        endpoint = f"/api/v1/{network_id}/wallets/{wallet_address}/tokens"
        params = {"contract": contract} if contract else {}
        response = requests.get(f"{SONOVA_API_BASE}{endpoint}", params=params)
        response.raise_for_status()
        result = response.json()
        return result.get("data", [])
    except Exception as e:
        print(f"Failed to fetch wallet tokens: {e}")
        return []
```

## 📊 Analytics Integration

### Collection Statistics

```python
def get_collection_chart(contract_or_slug: str, chart_type: int = 0, 
                        time_period: str = "4H", network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Get collection chart data"""
    try:
        endpoint = f"/api/v1/{network_id}/collections/{contract_or_slug}/chart"
        params = {"type": chart_type, "time": time_period}
        response = requests.get(f"{SONOVA_API_BASE}{endpoint}", params=params)
        response.raise_for_status()
        result = response.json()
        return result.get("data", [])
    except Exception as e:
        print(f"Failed to fetch chart data: {e}")
        return []

def get_collection_floor(contract_or_slug: str, network_id: int = SONEIUM_CHAIN_ID) -> Dict:
    """Get collection floor price"""
    try:
        endpoint = f"/api/v1/{network_id}/collections/{contract_or_slug}/floor"
        return sonova_api(endpoint)
    except Exception as e:
        print(f"Failed to fetch floor price: {e}")
        return {}

def get_collection_events(contract_or_slug: str, event_types: List[str] = None, 
                         limit: int = 20, network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Get collection activity events"""
    body = {
        "types": event_types or ["0", "1", "2"],  # list, sale, cancel
        "limit": limit,
        "offset": 0
    }
    
    try:
        endpoint = f"/api/v1/{network_id}/collections/{contract_or_slug}/events"
        return sonova_api(endpoint, method="POST", data=body)
    except Exception as e:
        print(f"Failed to fetch events: {e}")
        return []
```

## 🚀 Launchpad Integration

### Get Launch Information

```python
def get_active_launches(network_id: int = SONEIUM_CHAIN_ID) -> List[Dict]:
    """Get active launchpad events"""
    try:
        endpoint = f"/api/events"
        params = {"network_id": network_id}
        response = requests.get(f"{SONOVA_API_BASE}{endpoint}", params=params)
        response.raise_for_status()
        result = response.json()
        return result.get("data", [])
    except Exception as e:
        print(f"Failed to fetch launches: {e}")
        return []

def get_launch_details(slug: str) -> Dict:
    """Get specific launch details"""
    try:
        endpoint = f"/api/events/{slug}"
        return sonova_api(endpoint)
    except Exception as e:
        print(f"Failed to fetch launch details: {e}")
        return {}

def sign_launch_event(client: SonovaClient, slug: str, mint_amount: int) -> Dict:
    """Sign a launch event for minting"""
    try:
        endpoint = f"/api/events/{slug}/sign"
        data = {"mint_amount": mint_amount}
        return client._authenticated_request(endpoint, method="POST", data=data)
    except Exception as e:
        print(f"Failed to sign event: {e}")
        return {}
```

## 🔧 Type Definitions

For better type safety, you can use dataclasses or Pydantic models:

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Collection:
    id: int
    contract: str
    name: str
    symbol: str
    verified: bool
    erc_type: int
    slug: Optional[str] = None
    icon_url: Optional[str] = None
    floor_price: Optional[str] = None
    total_supply: Optional[int] = None

@dataclass
class NFT:
    id: int
    network_id: int
    contract: str
    token_id: str
    owner: Optional[str] = None
    name: Optional[str] = None
    image_url: Optional[str] = None
    rank: Optional[int] = None

@dataclass
class MarketOrder:
    id: int
    nft_id: int
    price: str
    currency: str
    price_usd: float
    maker: str
    source: int
    status: int
    is_offer: bool
    amount: str
    remain: str
    expired_at: int
    taker: Optional[str] = None
```

## 📋 Complete Example

```python
def main():
    # Get collection info
    collection = get_collection_detail(1868, "my-collection")
    print(f"Collection: {collection.get('name')}")
    
    # Search for collections
    results = search_collections("crypto")
    print(f"Found {len(results)} collections")
    
    # Get NFTs with filters
    nfts = get_collection_nfts("my-collection", {
        "limit": 10,
        "price_min": 0.1
    })
    print(f"Found {len(nfts)} NFTs")
    
    # Get analytics
    floor = get_collection_floor("my-collection")
    print(f"Floor price: {floor.get('price', '0')} wei")
    
    # Get wallet data
    portfolio = get_wallet_portfolio("0x1234...")
    print(f"Portfolio value: ${portfolio.get('total', 0)}")

if __name__ == "__main__":
    main()
```

---

> **Note**: This integration guide uses direct API calls with the `requests` library since there's no official Sonova Python SDK yet. All examples are specific to the Soneium blockchain (Chain ID: 1868). 