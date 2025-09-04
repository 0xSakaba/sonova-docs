---
sidebar_position: 2
---

# Metadata Best Practices

Metadata is the backbone of your NFT collection, providing essential information about each token. This guide covers everything you need to know about creating effective NFT metadata.

## 📋 What is NFT Metadata?

Metadata is structured data that describes your NFT's properties, attributes, and characteristics. It includes:

- **Name**: Individual NFT title
- **Description**: Detailed information about the piece
- **Image**: Link to the actual artwork file
- **Attributes**: Traits, rarity, and special properties
- **External Links**: Website, social media, or additional content

## 🔧 JSON Structure

### Basic Metadata Format
```json
{
  "name": "Sonova Warrior #001",
  "description": "A legendary warrior from the Sonova universe, wielding ancient powers and protecting the digital realm.",
  "image": "ipfs://QmYourImageHash/001.png",
  "external_url": "https://yourproject.com/nft/001",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Mystic Forest"
    },
    {
      "trait_type": "Character",
      "value": "Warrior"
    },
    {
      "trait_type": "Weapon",
      "value": "Crystal Sword"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ]
}
```

### Extended Metadata Example
```json
{
  "name": "Sonova Warrior #001",
  "description": "A legendary warrior from the Sonova universe, wielding ancient powers and protecting the digital realm. This warrior has seen countless battles and possesses the rare Crystal Sword, forged in the fires of the digital mountains.",
  "image": "ipfs://QmYourImageHash/001.png",
  "animation_url": "ipfs://QmYourAnimationHash/001.mp4",
  "external_url": "https://yourproject.com/nft/001",
  "background_color": "1a1a2e",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Mystic Forest"
    },
    {
      "trait_type": "Character",
      "value": "Warrior"
    },
    {
      "trait_type": "Weapon",
      "value": "Crystal Sword"
    },
    {
      "trait_type": "Armor",
      "value": "Dragon Scale"
    },
    {
      "trait_type": "Level",
      "value": 95,
      "max_value": 100,
      "display_type": "number"
    },
    {
      "trait_type": "Power",
      "value": 850,
      "display_type": "boost_number"
    },
    {
      "trait_type": "Speed Boost",
      "value": 15,
      "display_type": "boost_percentage"
    },
    {
      "trait_type": "Generation",
      "value": "Gen 1"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ]
}
```

## 📊 Attribute Types & Display

### Standard Attributes
```json
{
  "trait_type": "Background",
  "value": "Ocean Blue"
}
```

### Numeric Attributes
```json
{
  "trait_type": "Level",
  "value": 85,
  "max_value": 100,
  "display_type": "number"
}
```

### Boost Attributes
```json
{
  "trait_type": "Attack Power",
  "value": 150,
  "display_type": "boost_number"
}
```

### Percentage Boosts
```json
{
  "trait_type": "Critical Hit Chance",
  "value": 25,
  "display_type": "boost_percentage"
}
```

### Date Attributes
```json
{
  "trait_type": "Birthday",
  "value": 1640995200,
  "display_type": "date"
}
```

## 🎨 Attribute Planning

### Trait Categories
Plan your attribute structure carefully:

```yaml
Visual Traits:
  - Background: 10 variations
  - Character: 8 base types
  - Clothing: 15 options
  - Accessories: 20 items
  - Colors: 12 palettes

Functional Traits:
  - Rarity: Common, Uncommon, Rare, Epic, Legendary
  - Level: 1-100
  - Power: 100-1000
  - Speed: 10-100
  - Element: Fire, Water, Earth, Air

Special Traits:
  - Generation: Gen 1, Gen 2, etc.
  - Series: Alpha, Beta, Special Edition
  - Creator: Artist signature or studio
```

### Rarity Distribution
```
Common (60-70%):     Easy to obtain, basic traits
Uncommon (20-25%):   Slightly rare combinations
Rare (8-12%):        Notable special traits
Epic (2-4%):         Very rare trait combinations
Legendary (1-2%):    Extremely rare or unique
```

### Trait Combination Rules
```javascript
// Example logic for trait compatibility
{
  "rules": {
    "Character": "Wizard",
    "incompatible_with": ["Heavy Armor", "Battle Axe"],
    "preferred_with": ["Magic Staff", "Robes", "Crystal"]
  },
  "special_combinations": {
    "Dragon Warrior": {
      "requires": ["Dragon", "Warrior", "Fire Element"],
      "bonus_trait": "Dragon Slayer"
    }
  }
}
```

## 🔗 File Hosting & IPFS

### IPFS Best Practices
1. **Pin Your Files**: Use reliable pinning services
2. **Folder Structure**: Organize images and metadata separately
3. **Content Addressing**: Use IPFS hashes for immutability
4. **Redundancy**: Pin with multiple providers

### Recommended IPFS Services
- **Pinata**: User-friendly with good documentation
- **NFT.Storage**: Free service specifically for NFTs
- **Infura**: Enterprise-grade IPFS hosting
- **Fleek**: Integrated hosting and deployment

### File Organization
```
ipfs-folder/
├── images/
│   ├── 001.png
│   ├── 002.png
│   └── ...
├── animations/ (optional)
│   ├── 001.mp4
│   ├── 002.mp4
│   └── ...
└── metadata/
    ├── 001.json
    ├── 002.json
    └── ...
```

### IPFS URL Format
```
Images: ipfs://QmImageFolderHash/001.png
Metadata: ipfs://QmMetadataFolderHash/001.json
```

## 🛠️ Metadata Generation

### Manual Creation
For small collections (under 100 items):
```javascript
// Simple metadata generator
const metadata = {
  name: `Collection Name #${tokenId.toString().padStart(3, '0')}`,
  description: "Your collection description",
  image: `ipfs://QmYourHash/${tokenId.toString().padStart(3, '0')}.png`,
  attributes: generateAttributes(tokenId)
};
```

### Automated Generation
For large collections:
```python
import json
import random

def generate_metadata(token_id, traits):
    metadata = {
        "name": f"Collection Name #{token_id:03d}",
        "description": "Generated NFT description",
        "image": f"ipfs://QmHash/{token_id:03d}.png",
        "attributes": []
    }
    
    for trait_type, options in traits.items():
        if random.random() < options['probability']:
            value = random.choice(options['values'])
            metadata["attributes"].append({
                "trait_type": trait_type,
                "value": value
            })
    
    return metadata
```

### Tools for Generation
- **HashLips Art Engine**: Popular generative tool
- **Bueno**: No-code NFT generation platform
- **Treat Toolbox**: NFT creation and management
- **Custom Scripts**: Python, JavaScript, or other languages

## ✅ Validation & Testing

### Metadata Validation
```javascript
function validateMetadata(metadata) {
  const required = ['name', 'description', 'image'];
  const errors = [];
  
  // Check required fields
  required.forEach(field => {
    if (!metadata[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate IPFS URLs
  if (metadata.image && !metadata.image.startsWith('ipfs://')) {
    errors.push('Image URL should use IPFS protocol');
  }
  
  // Validate attributes
  if (metadata.attributes) {
    metadata.attributes.forEach((attr, index) => {
      if (!attr.trait_type || attr.value === undefined) {
        errors.push(`Invalid attribute at index ${index}`);
      }
    });
  }
  
  return errors;
}
```

### Testing Checklist
- [ ] All JSON files are valid format
- [ ] Required fields are present
- [ ] IPFS URLs are accessible
- [ ] Image files load correctly
- [ ] Attribute values are consistent
- [ ] Special characters are properly escaped

## 📈 Marketplace Compatibility

### OpenSea Standards
OpenSea recognizes these fields and display types:
```json
{
  "background_color": "hexcolor",
  "animation_url": "video_url",
  "youtube_url": "youtube_link",
  "attributes": [
    {
      "display_type": "boost_number",
      "trait_type": "Stamina",
      "value": 42
    }
  ]
}
```

### LooksRare Compatibility
LooksRare follows OpenSea standards with additional features:
- Collection-level metadata
- Enhanced attribute filtering
- Custom trait displays

### Cross-Platform Considerations
- **Standard Fields**: Stick to common metadata fields
- **Attribute Names**: Use consistent trait_type names
- **Display Types**: Use recognized display_type values
- **Image Formats**: Support common formats (PNG, JPG, GIF)

## 🔄 Updating Metadata

### Mutable vs Immutable
```yaml
Immutable Metadata:
  - Stored on IPFS with content addressing
  - Cannot be changed after minting
  - Provides authenticity guarantees
  - Preferred for art collections

Mutable Metadata:
  - Can be updated by contract owner
  - Useful for gaming or utility NFTs
  - Requires trust in the creator
  - Should be clearly disclosed
```

### Update Mechanisms
```solidity
// Example smart contract function
function setTokenURI(uint256 tokenId, string memory newURI) 
    public onlyOwner {
    _setTokenURI(tokenId, newURI);
    emit MetadataUpdate(tokenId);
}
```

### Best Practices for Updates
- **Clear Disclosure**: Tell holders if metadata can change
- **Versioning**: Keep track of metadata versions
- **Governance**: Let community vote on changes
- **Immutable Core**: Keep essential attributes unchangeable

## 🎯 Advanced Metadata Features

### Interactive Metadata
```json
{
  "name": "Interactive NFT #001",
  "description": "An NFT that evolves based on holder actions",
  "image": "ipfs://QmBaseImage/001.png",
  "animation_url": "ipfs://QmInteractive/001.html",
  "attributes": [
    {
      "trait_type": "Experience Points",
      "value": 1250,
      "display_type": "number"
    },
    {
      "trait_type": "Last Action",
      "value": 1640995200,
      "display_type": "date"
    }
  ],
  "properties": {
    "category": "Gaming",
    "interactive": true,
    "updatable": ["experience", "last_action"]
  }
}
```

### Utility Metadata
```json
{
  "name": "Access Pass #001",
  "description": "Grants access to exclusive events and content",
  "image": "ipfs://QmPassImage/001.png",
  "attributes": [
    {
      "trait_type": "Access Level",
      "value": "VIP"
    },
    {
      "trait_type": "Valid Until",
      "value": 1672531200,
      "display_type": "date"
    }
  ],
  "utility": {
    "access_rights": ["events", "discord", "content"],
    "transferable": true,
    "renewable": false
  }
}
```

## 📚 Tools & Resources

### Metadata Generators
- **HashLips Art Engine**: Open-source generative tool
- **Bueno**: Professional NFT creation platform
- **NFT Creator**: Simple online metadata generator
- **Treat Toolbox**: Comprehensive NFT toolkit

### Validation Tools
- **JSON Validator**: Online JSON syntax checking
- **IPFS Checker**: Verify IPFS file accessibility
- **Metadata Validator**: NFT-specific validation tools
- **OpenSea Testnet**: Test metadata display

### Documentation
- **OpenSea Metadata Standards**: Official documentation
- **ERC-721 Standard**: Technical specifications
- **IPFS Documentation**: Decentralized storage guide
- **JSON Schema**: Metadata structure validation

---

**Need help with metadata?** Join our [Creator Discord](https://discord.gg/sonova-creators) for support and examples from the community! 