---
sidebar_position: 3
---

# Launch Preparation

Proper preparation is crucial for a successful NFT launch on Sonova. This guide covers everything you need to prepare before your launch day.

## 🎨 Artwork Preparation

### Image Requirements
- **Resolution**: Minimum 1000x1000px (1:1 aspect ratio recommended)
- **File Formats**: PNG, JPG, GIF, MP4 (for animated NFTs)
- **File Size**: Maximum 10MB per file
- **Color Profile**: sRGB color space
- **Quality**: High-resolution, crisp, and professional

### Artwork Organization
```
collection/
├── images/
│   ├── 001.png
│   ├── 002.png
│   └── ...
├── metadata/
│   ├── 001.json
│   ├── 002.json
│   └── ...
└── preview/
    ├── thumbnail.png
    └── banner.png
```

### Naming Convention
- **Images**: Use consistent numbering (001.png, 002.png, etc.)
- **Metadata**: Match image names (001.json, 002.json, etc.)
- **No Spaces**: Use underscores or hyphens instead of spaces
- **Sequential**: Ensure no gaps in numbering

## 📊 Metadata Preparation

### JSON Structure
```json
{
  "name": "Your NFT Name #001",
  "description": "Detailed description of this specific NFT",
  "image": "ipfs://QmYourImageHash/001.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Laser"
    },
    {
      "trait_type": "Rarity",
      "value": "Epic",
      "display_type": "boost_percentage",
      "boost_value": 10
    }
  ],
  "external_url": "https://yourwebsite.com/nft/001"
}
```

### Metadata Best Practices
- **Consistent Attributes**: Use the same trait types across all items
- **Proper Values**: Ensure attribute values are correctly categorized
- **Rarity Distribution**: Plan your rarity tiers carefully
- **Descriptions**: Write unique, engaging descriptions
- **External URLs**: Link to your website or project page

### Rarity Planning
```
Common: 60-70% of collection
Uncommon: 20-25% of collection
Rare: 8-12% of collection
Epic: 2-4% of collection
Legendary: 1-2% of collection
```

## 🎯 Collection Strategy

### Supply Planning
- **Total Supply**: Choose between 100-10,000 items
- **Rarity Distribution**: Plan trait combinations carefully
- **Special Items**: Reserve unique 1/1 pieces
- **Team Allocation**: Reserve items for team and marketing

### Pricing Strategy
- **Market Research**: Analyze similar collections
- **Floor Price**: Set competitive initial pricing
- **Whitelist Discount**: Offer 10-30% discount for early supporters
- **Dutch Auction**: Consider decreasing price model

### Launch Phases
1. **Whitelist Phase**: 24-48 hours, limited supply
2. **Public Phase**: Open to everyone
3. **Reveal**: If using blind minting
4. **Secondary**: Focus on marketplace activity

## 🔐 Smart Contract Preparation

### Contract Requirements
- **ERC-721 Standard**: Standard NFT contract
- **Batch Minting**: Efficient gas usage
- **Ownership Transfer**: Proper ownership controls
- **Royalty Support**: EIP-2981 royalty standard
- **Security Features**: Audited and tested

### Contract Features
```solidity
// Essential functions your contract should include
- mint(address to, uint256 quantity)
- setBaseURI(string memory baseURI)
- withdraw()
- setRoyaltyInfo(address receiver, uint96 feeNumerator)
- pause/unpause functionality
```

### Royalty Configuration
- **Percentage**: 2.5-10% (5% is common)
- **Recipient**: Your wallet or multi-sig
- **Split**: Consider team/charity splits
- **Standards**: Ensure marketplace compatibility

## 💰 Financial Preparation

### Cost Planning
```
Smart Contract Deployment: 0.1-0.3 ETH
IPFS Hosting: $50-200/month
Marketing Budget: $1,000-10,000
Platform Fees: 2.5% of primary sales
```

### Revenue Projections
```
Collection Size: 5,000 NFTs
Mint Price: 0.05 ETH
Total Revenue: 250 ETH
Platform Fee (2.5%): 6.25 ETH
Net Revenue: 243.75 ETH
```

### Payment Setup
- **Primary Wallet**: Multi-sig recommended for large collections
- **Backup Wallet**: Secondary wallet for emergencies
- **Tax Planning**: Consult with crypto tax professional
- **Record Keeping**: Track all transactions and expenses

## 📱 IPFS and Storage

### IPFS Hosting
- **Pinning Service**: Use reliable services like Pinata or NFT.Storage
- **Redundancy**: Pin with multiple providers
- **Folder Structure**: Organize files properly
- **Testing**: Verify all files are accessible

### Metadata Upload Process
1. **Upload Images**: Pin images to IPFS first
2. **Update Metadata**: Add IPFS hashes to JSON files
3. **Upload Metadata**: Pin metadata folder to IPFS
4. **Get Base URI**: Use the metadata folder hash
5. **Update Contract**: Set base URI in smart contract

## 🌟 Marketing Preparation

### Brand Assets
- **Logo**: High-resolution logo in multiple formats
- **Banner**: Twitter header, Discord server banner
- **Avatar**: Profile picture for social accounts
- **Mockups**: Show NFTs in real-world contexts

### Content Calendar
```
4 Weeks Before: Announce project, build community
3 Weeks Before: Release artwork previews
2 Weeks Before: Whitelist registration opens
1 Week Before: Final previews, launch reminders
Launch Day: Real-time updates and community engagement
Post-Launch: Thank community, roadmap updates
```

### Community Building
- **Discord Server**: Create engaging community space
- **Twitter Strategy**: Regular updates and engagement
- **Partnerships**: Collaborate with other projects
- **Influencers**: Partner with NFT influencers
- **Events**: Host AMAs, giveaways, contests

## ✅ Pre-Launch Checklist

### Technical Checklist
- [ ] All artwork files properly named and sized
- [ ] Metadata JSON files completed and validated
- [ ] IPFS hosting set up and tested
- [ ] Smart contract deployed and verified
- [ ] Test minting completed successfully
- [ ] Royalty settings configured correctly

### Marketing Checklist
- [ ] Social media accounts created and optimized
- [ ] Community guidelines and moderation set up
- [ ] Content calendar planned and scheduled
- [ ] Partnership collaborations confirmed
- [ ] Press kit and media assets prepared
- [ ] Launch announcement ready

### Platform Checklist
- [ ] Launchpad application approved
- [ ] Launch configuration completed
- [ ] Whitelist system tested
- [ ] Payment processing verified
- [ ] Analytics tracking set up
- [ ] Support team briefed

## 🚨 Common Preparation Mistakes

### Artwork Issues
- **Inconsistent Quality**: Varying resolution or style
- **Poor Organization**: Files not properly named
- **Missing Metadata**: Incomplete attribute data
- **Wrong Formats**: Unsupported file types

### Technical Issues
- **IPFS Problems**: Files not properly pinned
- **Contract Bugs**: Untested smart contract code
- **Gas Optimization**: Inefficient contract design
- **Security Flaws**: Missing access controls

### Marketing Issues
- **Late Start**: Not building community early enough
- **Poor Communication**: Unclear messaging or timeline
- **No Strategy**: Random posting without plan
- **Weak Branding**: Inconsistent visual identity

---

**Next Step**: Once your preparation is complete, proceed to [Launch Configuration](./configuration) to set up your launch parameters! 