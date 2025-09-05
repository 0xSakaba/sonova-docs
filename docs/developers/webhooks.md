---
sidebar_position: 5
---

# Event Notifications & Webhooks

Real-time event notifications and webhook integration for Sonova marketplace.

## 🔔 Webhook Overview

Sonova marketplace provides webhook endpoints to notify your application about important events in real-time, allowing you to stay updated on collection activities, sales, and user interactions.

### Supported Events

- **Collection Updates**: Floor price changes, new listings
- **Trading Activity**: Sales completed, new offers placed
- **User Activity**: Successful transactions, portfolio changes

## 🛠️ Webhook Configuration

### Webhook URL Requirements

Your webhook endpoint must:
- Accept HTTP POST requests
- Respond with HTTP 200 status code
- Process requests within 5 seconds
- Use HTTPS for production environments

### Request Headers

All webhook requests include these headers:
```http
Content-Type: application/json
X-Sonova-Signature: sha256=<signature>
X-Sonova-Event: <event-type>
User-Agent: Sonova-Webhook/1.0
```

## 📡 Event Types

### Collection Activity Events

#### Collection Floor Price Update
```json
{
  "event": "collection.floor_updated",
  "timestamp": "2024-01-15T10:30:00Z",
  "network_id": 1868,
  "data": {
    "contract": "0x1234567890abcdef...",
    "collection_name": "Example Collection",
    "old_floor": "1200000000000000000",
    "new_floor": "1500000000000000000",
    "currency": "ETH",
    "change_percent": 25.0
  }
}
```

#### New Listing Created
```json
{
  "event": "listing.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "network_id": 1868,
  "data": {
    "contract": "0x1234567890abcdef...",
    "token_id": "123",
    "price": "2000000000000000000",
    "currency": "ETH",
    "seller": "0xabcdef...",
    "marketplace": "sonova"
  }
}
```

### Trading Events

#### Sale Completed
```json
{
  "event": "sale.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "network_id": 1868,
  "data": {
    "contract": "0x1234567890abcdef...",
    "token_id": "456",
    "price": "1800000000000000000",
    "currency": "ETH",
    "buyer": "0x123456...",
    "seller": "0x789abc...",
    "transaction_hash": "0xabc123...",
    "marketplace": "sonova"
  }
}
```

#### Offer Placed
```json
{
  "event": "offer.placed",
  "timestamp": "2024-01-15T10:30:00Z",
  "network_id": 1868,
  "data": {
    "contract": "0x1234567890abcdef...",
    "token_id": "789",
    "offer_amount": "1500000000000000000",
    "currency": "ETH",
    "bidder": "0xdef456...",
    "expiry": "2024-01-22T10:30:00Z"
  }
}
```

## 🔐 Webhook Security

### Signature Verification

Verify webhook authenticity using the signature:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}

// Usage
app.post('/webhook', (req, res) => {
  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-sonova-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!verifyWebhookSignature(payload, signature, secret)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Process webhook event
  handleWebhookEvent(req.body);
  res.status(200).send('OK');
});
```

### Python Example

```python
import hmac
import hashlib

def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    received_signature = signature.replace('sha256=', '')
    
    return hmac.compare_digest(expected_signature, received_signature)

# Usage in Flask
@app.route('/webhook', methods=['POST'])
def handle_webhook():
    payload = request.get_data(as_text=True)
    signature = request.headers.get('X-Sonova-Signature')
    secret = os.environ.get('WEBHOOK_SECRET')
    
    if not verify_webhook_signature(payload, signature, secret):
        return 'Unauthorized', 401
    
    event_data = request.get_json()
    process_webhook_event(event_data)
    
    return 'OK', 200
```

## 📊 Event Processing Examples

### Collection Monitor

```javascript
function handleWebhookEvent(event) {
  switch (event.event) {
    case 'collection.floor_updated':
      handleFloorPriceUpdate(event.data);
      break;
    
    case 'sale.completed':
      handleSaleCompleted(event.data);
      break;
    
    case 'listing.created':
      handleNewListing(event.data);
      break;
    
    default:
      console.log('Unknown event type:', event.event);
  }
}

function handleFloorPriceUpdate(data) {
  console.log(`Floor price for ${data.collection_name} changed from ${data.old_floor} to ${data.new_floor}`);
  
  // Update your application's floor price data
  updateCollectionFloorPrice(data.contract, data.new_floor);
  
  // Notify users if significant change
  if (Math.abs(data.change_percent) > 10) {
    notifyUsersOfPriceChange(data);
  }
}

function handleSaleCompleted(data) {
  console.log(`Sale completed: Token ${data.token_id} sold for ${data.price} ${data.currency}`);
  
  // Update your sales tracking
  recordSale(data);
  
  // Update collection statistics
  updateCollectionStats(data.contract);
}
```

### Portfolio Tracker

```javascript
class PortfolioTracker {
  constructor(webhookSecret) {
    this.secret = webhookSecret;
    this.watchedCollections = new Set();
    this.userWallets = new Set();
  }
  
  addWatchedCollection(contractAddress) {
    this.watchedCollections.add(contractAddress);
  }
  
  addUserWallet(walletAddress) {
    this.userWallets.add(walletAddress);
  }
  
  processWebhook(event) {
    // Only process events for collections we're watching
    if (this.watchedCollections.has(event.data.contract)) {
      this.handleCollectionEvent(event);
    }
    
    // Process user-specific events
    if (this.isUserEvent(event)) {
      this.handleUserEvent(event);
    }
  }
  
  handleCollectionEvent(event) {
    switch (event.event) {
      case 'collection.floor_updated':
        this.updatePortfolioValues(event.data.contract, event.data.new_floor);
        break;
      
      case 'sale.completed':
        this.recordCollectionSale(event.data);
        break;
    }
  }
  
  isUserEvent(event) {
    return this.userWallets.has(event.data.buyer) || 
           this.userWallets.has(event.data.seller) ||
           this.userWallets.has(event.data.bidder);
  }
  
  handleUserEvent(event) {
    // Handle events involving user wallets
    console.log('User activity detected:', event);
  }
}
```

## 🔧 Webhook Management

### Registering Webhooks

Contact the Sonova team to register your webhook endpoints and configure event subscriptions.

### Required Information

When registering webhooks, provide:
- **Webhook URL**: Your HTTPS endpoint
- **Event Types**: Specific events you want to receive
- **Network IDs**: Networks you want to monitor (1868 for Soneium, 137 for Polygon)
- **Collections**: Specific collections to monitor (optional)

### Testing Webhooks

Use tools like ngrok for local development:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the HTTPS URL for webhook registration
```

## ⚠️ Best Practices

### Idempotency
- Process each webhook event only once
- Use event IDs or timestamps to prevent duplicate processing
- Store processed event IDs to handle retries

### Error Handling
- Return HTTP 200 for successful processing
- Return appropriate error codes for failures
- Implement retry logic for failed webhook processing

### Performance
- Process webhooks quickly (< 5 seconds)
- Use background jobs for heavy processing
- Implement proper logging for debugging

### Rate Limiting
- Be prepared for high-frequency events during busy periods
- Implement queuing for event processing
- Monitor webhook endpoint performance

## 📈 Monitoring & Debugging

### Webhook Logs
Monitor your webhook endpoint for:
- Response times
- Error rates
- Event processing success

### Common Issues
1. **Signature Verification Failures**: Check webhook secret
2. **Timeout Errors**: Optimize processing time
3. **Missing Events**: Verify endpoint availability

### Health Checks
Implement a health check endpoint:

```javascript
app.get('/webhook/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
```

---

> **Integration Support**: For webhook registration and integration support, contact the Sonova development team. All webhook events follow the standardized format described above. 