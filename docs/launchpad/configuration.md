---
sidebar_position: 4
---

# Launch Configuration

Configure your NFT launch settings to ensure a smooth and successful mint experience. This guide covers all configuration options available on Sonova Launchpad.

## 🛠️ Configuration Overview

The launch configuration process involves:
- **Basic Settings**: Collection details and metadata
- **Mint Stages**: Define phases and pricing
- **Whitelist Setup**: Configure access controls
- **Payment Settings**: Set up royalties and fees
- **Analytics**: Enable tracking and monitoring

## 📋 Basic Collection Settings

### Collection Information
```yaml
Collection Name: "Your Collection Name"
Symbol: "YCN" (3-5 characters)
Description: "Detailed collection description"
Total Supply: 5000
Max Per Wallet: 10
Contract Type: "ERC-721A" (recommended)
```

### Metadata Configuration
- **Base URI**: IPFS hash of your metadata folder
- **Reveal Settings**: Choose immediate or delayed reveal
- **Placeholder Image**: For unrevealed collections
- **Metadata Frozen**: Lock metadata after mint

### Visual Assets
- **Collection Avatar**: 400x400px square image
- **Banner Image**: 1500x500px banner for profile
- **Featured Image**: 600x400px for marketplace display

## 🎯 Mint Stage Configuration

### Stage Types

#### 1. Whitelist Stage
```yaml
Stage Name: "Whitelist Mint"
Start Time: "2024-01-15 12:00 UTC"
End Time: "2024-01-16 12:00 UTC"
Price: 0.08 ETH
Max Supply: 2000
Max Per Wallet: 3
Access: Whitelist Required
```

#### 2. Public Stage
```yaml
Stage Name: "Public Mint"
Start Time: "2024-01-16 12:00 UTC"
End Time: "2024-01-18 12:00 UTC"
Price: 0.1 ETH
Max Supply: 3000
Max Per Wallet: 5
Access: Public
```

#### 3. Dutch Auction
```yaml
Stage Name: "Dutch Auction"
Start Time: "2024-01-15 12:00 UTC"
Duration: 24 hours
Starting Price: 0.5 ETH
Ending Price: 0.05 ETH
Price Decrease: Every 30 minutes
Max Per Wallet: 2
```

### Stage Configuration Options
- **Sequential Stages**: One stage after another
- **Overlapping Stages**: Multiple stages running simultaneously
- **Conditional Stages**: Stages that activate based on conditions
- **Emergency Controls**: Pause/resume functionality

## 🔐 Whitelist Configuration

### Whitelist Types

#### 1. Manual Whitelist
```yaml
Type: "Manual List"
Import Method: "CSV Upload"
Fields: [wallet_address, allocation, tier]
Max Allocation: 5 per wallet
Verification: "Instant"
```

#### 2. Token Gated
```yaml
Type: "Token Gate"
Required Token: "0x1234...5678"
Minimum Balance: 1
Snapshot Date: "2024-01-10 00:00 UTC"
Allocation: 2 per token
```

#### 3. API Integration
```yaml
Type: "External API"
Endpoint: "https://your-api.com/verify"
Method: "POST"
Authentication: "Bearer Token"
Response Format: "JSON"
Cache Duration: 300 seconds
```

### Dynamic Verification
```javascript
// Example verification logic
{
  "requirements": [
    {
      "type": "token_balance",
      "contract": "0x1234...5678",
      "minimum": 1
    },
    {
      "type": "twitter_follow",
      "account": "@YourProject"
    },
    {
      "type": "discord_member",
      "server": "your-discord-id",
      "role": "whitelist"
    }
  ],
  "allocation": {
    "base": 2,
    "bonus": {
      "twitter_retweet": 1,
      "discord_boost": 1
    }
  }
}
```

## 💰 Payment Configuration

### Pricing Settings
```yaml
Primary Currency: "ETH"
Alternative Currencies: ["USDC", "USDT"]
Dynamic Pricing: false
Discount Codes: enabled
Bulk Discounts: 
  - quantity: 5, discount: 5%
  - quantity: 10, discount: 10%
```

### Fee Structure
```yaml
Platform Fee: 2.5%
Creator Royalty: 5.0%
Payment Processing: 0.5%
Gas Optimization: enabled
```

### Royalty Configuration
```yaml
Primary Royalty:
  - address: "0xCreator..."
    percentage: 60%
  - address: "0xTeam..."
    percentage: 30%
  - address: "0xCharity..."
    percentage: 10%

Secondary Royalty: 5%
Royalty Standard: "EIP-2981"
Marketplace Support: ["OpenSea", "Blur", "LooksRare"]
```

## 🔧 Advanced Settings

### Gas Optimization
```yaml
Batch Size: 5 (mints per transaction)
Gas Limit: 300,000 per mint
Priority Fee: "auto"
Merkle Tree: enabled (for whitelist)
ERC-721A: enabled (batch optimization)
```

### Security Features
```yaml
Anti-Bot Protection: enabled
Rate Limiting: 1 transaction per 30 seconds
Wallet Connection: required
Contract Verification: enabled
Pause Mechanism: enabled
```

### Launch Controls
```yaml
Emergency Pause: enabled
Stage Skip: allowed (admin only)
Price Update: allowed (within 10%)
Supply Adjustment: disabled (security)
Metadata Lock: after 90% minted
```

## 📊 Analytics Configuration

### Tracking Settings
```yaml
Google Analytics: "GA-XXXX-XXXX"
Custom Events: enabled
Real-time Dashboard: enabled
Export Data: CSV, JSON
Retention Period: 2 years
```

### Metrics to Track
- **Mint Progress**: Total minted, remaining supply
- **User Activity**: Unique wallets, repeat customers
- **Revenue**: ETH earned, USD equivalent
- **Geographic**: Country-based analytics
- **Traffic Sources**: Referral tracking

### Webhook Configuration
```yaml
Mint Events: "https://your-api.com/webhook/mint"
Stage Changes: "https://your-api.com/webhook/stage"
Errors: "https://your-api.com/webhook/error"
Authentication: "Bearer your-secret-token"
Retry Logic: 3 attempts, exponential backoff
```

## 🧪 Testing Configuration

### Testnet Deployment
1. **Deploy on Testnet**: Test all functionality
2. **Invite Beta Testers**: Limited group testing
3. **Stress Testing**: Simulate high traffic
4. **Bug Fixes**: Address any issues found
5. **Final Review**: Complete testing checklist

### Testing Checklist
- [ ] All mint stages work correctly
- [ ] Whitelist verification functions properly
- [ ] Payment processing completes successfully
- [ ] Error handling works as expected
- [ ] Analytics tracking is accurate
- [ ] Mobile experience is optimized

## 📋 Configuration Templates

### Small Collection (100-500 items)
```yaml
stages:
  - name: "Whitelist"
    duration: 24h
    price: 0.05 ETH
    supply: 60%
    max_per_wallet: 2
  
  - name: "Public"
    duration: 48h
    price: 0.07 ETH
    supply: 40%
    max_per_wallet: 3
```

### Medium Collection (1,000-5,000 items)
```yaml
stages:
  - name: "Whitelist"
    duration: 48h
    price: 0.08 ETH
    supply: 40%
    max_per_wallet: 3
  
  - name: "Public"
    duration: 72h
    price: 0.1 ETH
    supply: 60%
    max_per_wallet: 5
```

### Large Collection (5,000+ items)
```yaml
stages:
  - name: "VIP Whitelist"
    duration: 24h
    price: 0.1 ETH
    supply: 20%
    max_per_wallet: 5
  
  - name: "Whitelist"
    duration: 48h
    price: 0.12 ETH
    supply: 30%
    max_per_wallet: 3
  
  - name: "Public"
    duration: 120h
    price: 0.15 ETH
    supply: 50%
    max_per_wallet: 10
```

## ⚠️ Configuration Best Practices

### Timing Considerations
- **Time Zones**: Use UTC for consistency
- **Market Hours**: Consider global trading times
- **Competition**: Avoid conflicting with major launches
- **Preparation Time**: Allow buffer for last-minute issues

### Pricing Strategy
- **Market Research**: Study comparable projects
- **Community Feedback**: Test pricing with your audience
- **Progressive Pricing**: Increase price through stages
- **Psychological Pricing**: Use .05 or .1 ETH increments

### Risk Management
- **Conservative Supply**: Don't oversupply your market
- **Staged Approach**: Multiple phases reduce pressure
- **Emergency Controls**: Always have pause mechanisms
- **Backup Plans**: Prepare for various scenarios

## 🚀 Final Steps

### Pre-Launch Review
1. **Configuration Audit**: Review all settings
2. **Team Approval**: Get stakeholder sign-off
3. **Community Communication**: Announce final details
4. **Support Preparation**: Brief your team
5. **Launch Day Plan**: Prepare execution timeline

### Go-Live Process
1. **Final Testing**: Last-minute verification
2. **Enable Launch**: Activate configuration
3. **Monitor Systems**: Watch for any issues
4. **Community Updates**: Keep followers informed
5. **Post-Launch**: Monitor and adjust as needed

---

**Ready to configure your launch?** Access the [Launchpad Configuration Panel](https://launchpad.sonova.io/configure) to get started! 