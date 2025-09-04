---
sidebar_position: 3
---

# Royalty Settings

Learn how to configure royalties for your NFT collection to earn ongoing revenue from secondary sales on Sonova and other marketplaces.

## 💰 What are NFT Royalties?

Royalties are automatic payments made to creators each time their NFTs are resold on secondary markets. This provides creators with ongoing revenue beyond the initial sale.

### How Royalties Work
1. **Initial Sale**: Creator receives full sale price minus platform fees
2. **Secondary Sale**: Previous owner receives sale price minus royalties and fees
3. **Royalty Payment**: Creator automatically receives percentage of sale price
4. **Ongoing Revenue**: Continues for all future resales

### Benefits for Creators
- **Passive Income**: Earn from your art's continued success
- **Fair Compensation**: Share in the value appreciation of your work
- **Long-term Revenue**: Income that grows with collection popularity
- **Automatic Payments**: No manual collection needed

## 🔧 Technical Implementation

### EIP-2981 Standard
Sonova uses the EIP-2981 royalty standard for maximum compatibility:

```solidity
// EIP-2981 implementation example
interface IERC2981 {
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount);
}
```

### Smart Contract Integration
```solidity
contract YourNFTContract is ERC721, ERC2981 {
    constructor() ERC721("YourCollection", "YC") {
        // Set default royalty: 5% to creator
        _setDefaultRoyalty(creatorAddress, 500); // 500 = 5%
    }
    
    function setRoyalty(address receiver, uint96 feeNumerator) 
        external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }
}
```

### Marketplace Compatibility
```yaml
Supported Platforms:
  - Sonova: Full EIP-2981 support
  - OpenSea: Automatic royalty enforcement
  - LooksRare: Creator royalty protection
  - Blur: Optional royalty compliance
  - X2Y2: Configurable royalty settings
```

## 📊 Royalty Configuration

### Percentage Guidelines
```yaml
Common Ranges:
  - Art Collections: 2.5% - 7.5%
  - Utility NFTs: 5% - 10%
  - Gaming Assets: 2.5% - 5%
  - Membership Tokens: 0% - 2.5%

Recommended: 5% (good balance for creators and traders)
```

### Setting Your Royalty Rate
Consider these factors when choosing your percentage:

#### Market Standards
- **Research competitors** in your category
- **Check floor prices** and trading volume
- **Analyze successful** similar collections
- **Consider collection utility** and long-term value

#### Collection Type Impact
```yaml
Profile Picture (PFP): 2.5% - 5%
  - High trading volume expected
  - Lower percentages encourage trading

Art Collections: 5% - 7.5%
  - Focus on artistic value
  - Higher percentages for unique work

Utility Collections: 5% - 10%
  - Provides ongoing value to holders
  - Can support higher royalty rates

Gaming Assets: 2.5% - 5%
  - Frequent trading expected
  - Lower rates for better liquidity
```

## 🎯 Multi-Recipient Royalties

### Revenue Splitting
Distribute royalties among multiple parties:

```solidity
// Example of split royalties
struct RoyaltySplit {
    address recipient;
    uint256 percentage;
}

RoyaltySplit[] public royaltySplits = [
    RoyaltySplit(artistAddress, 60),      // 60% to artist
    RoyaltySplit(teamAddress, 30),        // 30% to team
    RoyaltySplit(charityAddress, 10)      // 10% to charity
];
```

### Common Split Arrangements
```yaml
Solo Artist:
  - Creator: 100%

Artist + Team:
  - Artist: 70-80%
  - Team: 20-30%

Collaborative Project:
  - Lead Artist: 40-50%
  - Collaborators: 30-40%
  - Team/Management: 10-20%

Charity Component:
  - Creator/Team: 85-90%
  - Charity: 10-15%
```

### Implementation Example
```javascript
// Royalty distribution configuration
const royaltyConfig = {
  totalPercentage: 500, // 5% total royalty
  recipients: [
    {
      address: "0x123...abc", // Artist
      share: 60 // 60% of royalties (3% of sale)
    },
    {
      address: "0x456...def", // Team
      share: 30 // 30% of royalties (1.5% of sale)
    },
    {
      address: "0x789...ghi", // Charity
      share: 10 // 10% of royalties (0.5% of sale)
    }
  ]
};
```

## 🛠️ Configuration on Sonova

### Using Sonova Launchpad
1. **Access Creator Portal**: Log in to your launchpad account
2. **Navigate to Royalties**: Find royalty settings section
3. **Set Percentage**: Choose your royalty rate (0-10%)
4. **Add Recipients**: Configure payment splits if needed
5. **Review & Confirm**: Double-check all settings

### Manual Contract Deployment
```solidity
// Deploy with initial royalty settings
constructor(
    string memory name,
    string memory symbol,
    address royaltyReceiver,
    uint96 royaltyPercentage
) ERC721(name, symbol) {
    _setDefaultRoyalty(royaltyReceiver, royaltyPercentage);
}
```

### Post-Deployment Updates
```solidity
// Update royalty settings (owner only)
function updateRoyalty(address newReceiver, uint96 newPercentage) 
    external onlyOwner {
    require(newPercentage <= 1000, "Royalty too high"); // Max 10%
    _setDefaultRoyalty(newReceiver, newPercentage);
    emit RoyaltyUpdated(newReceiver, newPercentage);
}
```

## 📈 Revenue Tracking

### Analytics Dashboard
Monitor your royalty earnings:

```yaml
Key Metrics:
  - Total Royalties Earned: Lifetime revenue
  - Monthly Revenue: Recent earnings trend
  - Top Sales: Highest royalty payments
  - Trading Volume: Secondary market activity
  - Average Sale Price: Market value trends
```

### Revenue Optimization
```yaml
Strategies to Increase Royalty Revenue:
  - Community Building: Engaged holders trade more
  - Utility Development: Add value for holders
  - Marketing: Increase collection visibility
  - Partnerships: Collaborate with other projects
  - Events: Create trading incentives
```

### Tax Considerations
```yaml
Important Notes:
  - Royalties are taxable income
  - Track all payments received
  - Consult tax professional
  - Consider business entity structure
  - Keep detailed records
```

## 🔒 Royalty Protection

### Enforcement Challenges
```yaml
Current Marketplace Landscape:
  Enforcing Platforms:
    - Sonova: Always enforces royalties
    - OpenSea: Creator fees honored
    - LooksRare: Royalty protection tools

  Optional Royalty Platforms:
    - Blur: Traders can choose to pay
    - X2Y2: Configurable by sellers
    - SudoSwap: AMM pools bypass royalties
```

### Protection Strategies
1. **Choose Supportive Platforms**: List primarily on royalty-enforcing marketplaces
2. **Community Education**: Inform holders about royalty importance
3. **Utility Incentives**: Provide benefits for using royalty-paying platforms
4. **Contract Design**: Technical measures to encourage royalty payments

### Technical Protection
```solidity
// Example: Restricted transfer function
mapping(address => bool) public approvedMarketplaces;

function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
) internal override {
    if (from != address(0) && to != address(0)) {
        require(
            approvedMarketplaces[msg.sender] || 
            from == msg.sender,
            "Use approved marketplace"
        );
    }
    super._beforeTokenTransfer(from, to, tokenId);
}
```

## 💡 Best Practices

### Setting Optimal Rates
```yaml
Consider These Factors:
  - Collection utility and ongoing value
  - Target market and trading frequency
  - Competitor royalty rates
  - Community sentiment
  - Long-term project goals
```

### Communication Strategy
- **Be Transparent**: Clearly state royalty rates
- **Explain Value**: Show how royalties support the project
- **Regular Updates**: Share how royalty funds are used
- **Community Input**: Consider holder feedback on rates

### Revenue Management
```yaml
Smart Revenue Use:
  - Project Development: Fund future features
  - Team Compensation: Support ongoing work
  - Marketing: Promote collection growth
  - Community Rewards: Give back to holders
  - Charity: Support causes aligned with project
```

## 🔄 Updating Royalty Settings

### When to Update
- **Market Conditions Change**: Adjust for trading patterns
- **Project Evolution**: Align with new utility or features
- **Community Feedback**: Respond to holder concerns
- **Competitive Pressure**: Match or differentiate from competitors

### Update Process
1. **Community Discussion**: Propose changes transparently
2. **Feedback Period**: Allow time for community input
3. **Technical Implementation**: Update smart contract
4. **Communication**: Announce changes clearly
5. **Monitor Impact**: Track effects on trading volume

### Governance Considerations
```solidity
// Example: Community-governed royalty updates
uint256 public constant VOTING_PERIOD = 7 days;
mapping(uint256 => Proposal) public proposals;

struct Proposal {
    address newReceiver;
    uint96 newPercentage;
    uint256 votesFor;
    uint256 votesAgainst;
    uint256 endTime;
    bool executed;
}
```

## 📚 Tools & Resources

### Royalty Management Tools
- **Sonova Creator Portal**: Built-in royalty configuration
- **Royalty Registry**: Cross-marketplace royalty settings
- **Payment Splitters**: Automated revenue distribution
- **Analytics Dashboards**: Track royalty performance

### Legal Resources
- **NFT Legal Guide**: Understanding royalty rights
- **Tax Documentation**: Reporting requirements
- **Contract Templates**: Legal-compliant agreements
- **Professional Services**: Legal and tax advice

### Technical Resources
- **EIP-2981 Documentation**: Standard implementation guide
- **Smart Contract Libraries**: Pre-built royalty contracts
- **Testing Tools**: Verify royalty functionality
- **Integration Guides**: Marketplace compatibility

## ⚠️ Common Pitfalls

### Technical Issues
- **Standard Non-Compliance**: Not following EIP-2981
- **Percentage Errors**: Using basis points incorrectly
- **Recipient Mistakes**: Wrong wallet addresses
- **Update Restrictions**: Can't modify royalties post-deployment

### Business Mistakes
- **Rate Too High**: Discourages trading and liquidity
- **Rate Too Low**: Missed revenue opportunities
- **Poor Communication**: Community backlash over changes
- **No Strategy**: Random royalty decisions

### Legal Concerns
- **Tax Compliance**: Unreported royalty income
- **Jurisdiction Issues**: Different laws apply
- **Partnership Disputes**: Unclear revenue splits
- **IP Rights**: Royalty claims on derivative works

---

**Need help configuring royalties?** Contact our [Creator Support](mailto:creators@sonova.io) team for personalized guidance on optimizing your royalty strategy! 