class ColorSystem {
  constructor() {
    this.colorData = {};
    this.harmonyRules = {};
    this.initialized = false;
    this.colorMappings = new Map();
    this.seasonalPalettes = {};
  }

  // Initialize color system with loaded data
  initialize(colorData) {
    try {
      this.colorData = {
        hair: colorData.hairColors || {},
        clothing: colorData.clothingColors || {},
        accents: colorData.accentColors || {},
        skin: colorData.skinTones || {}
      };

      this._initializeHarmonyRules();
      this._initializeSeasonalPalettes();
      this._initializeColorMappings();
      
      this.initialized = true;
      console.log('Color System initialized successfully');
      
    } catch (error) {
      console.error('Error initializing Color System:', error);
      throw error;
    }
  }

  // Set up color harmony rules
  _initializeHarmonyRules() {
    this.harmonyRules = {
      // Hair color compatibility with skin tones
      hairSkinHarmony: {
        light_tones: {
          preferred: ['natural_bases', 'cool_colors', 'ash_tones'],
          avoid: ['deep_colors', 'warm_browns']
        },
        medium_tones: {
          preferred: ['natural_bases', 'warm_colors', 'honey_tones'],
          avoid: ['extreme_cool', 'very_light']
        },
        deep_tones: {
          preferred: ['natural_bases', 'rich_colors', 'warm_tones'],
          avoid: ['ash_tones', 'very_light']
        }
      },

      // Clothing color harmony with hair
      clothingHairHarmony: {
        blonde: {
          preferred: ['cool_colors', 'pastels', 'neutrals'],
          avoid: ['warm_yellows', 'oranges']
        },
        brunette: {
          preferred: ['earth_tones', 'jewel_tones', 'neutrals'],
          avoid: ['competing_browns']
        },
        black: {
          preferred: ['vibrant_colors', 'jewel_tones', 'neutrals'],
          avoid: ['muddy_colors']
        },
        red: {
          preferred: ['earth_tones', 'greens', 'neutrals'],
          avoid: ['competing_reds', 'oranges']
        },
        fantasy: {
          preferred: ['complementary', 'harmonious', 'neutrals'],
          avoid: ['clashing_bright']
        }
      },

      // Accent color coordination
      accentHarmony: {
        gold: {
          preferred: ['warm_tones', 'earth_colors', 'jewel_tones'],
          avoid: ['cool_silvers', 'competing_metals']
        },
        silver: {
          preferred: ['cool_tones', 'pastels', 'jewel_tones'],
          avoid: ['warm_golds', 'competing_metals']
        },
        rose_gold: {
          preferred: ['warm_pastels', 'blush_tones', 'neutrals'],
          avoid: ['cool_metals', 'harsh_contrasts']
        }
      }
    };
  }

  // Initialize seasonal color palettes
  _initializeSeasonalPalettes() {
    this.seasonalPalettes = {
      spring: {
        hair: ['warm_blonde', 'honey', 'light_brown', 'strawberry'],
        clothing: ['pastels', 'fresh_colors', 'light_tones'],
        accents: ['gold', 'coral', 'pearl', 'light_metals']
      },
      summer: {
        hair: ['ash_blonde', 'cool_brown', 'platinum', 'cool_tones'],
        clothing: ['cool_colors', 'soft_pastels', 'blues_greens'],
        accents: ['silver', 'pearl', 'cool_metals', 'soft_tones']
      },
      autumn: {
        hair: ['warm_brown', 'auburn', 'rich_red', 'golden'],
        clothing: ['earth_tones', 'warm_colors', 'rich_colors'],
        accents: ['gold', 'bronze', 'copper', 'warm_metals']
      },
      winter: {
        hair: ['black', 'cool_brown', 'platinum', 'dramatic'],
        clothing: ['jewel_tones', 'high_contrast', 'pure_colors'],
        accents: ['silver', 'platinum', 'dramatic_metals', 'crystals']
      }
    };
  }

  // Create color mappings for quick lookup
  _initializeColorMappings() {
    // Map hair color categories to harmony groups
    this.colorMappings.set('hair_harmony', {
      blonde: ['honey', 'platinum', 'ash', 'golden', 'strawberry'],
      brunette: ['brown', 'chestnut', 'chocolate', 'espresso'],
      black: ['black', 'jet', 'raven', 'dark'],
      red: ['auburn', 'copper', 'ginger', 'burgundy', 'red'],
      fantasy: ['blue', 'purple', 'pink', 'green', 'rainbow']
    });

    // Map skin tones to color families
    this.colorMappings.set('skin_harmony', {
      cool_undertones: ['ash', 'cool', 'silver', 'platinum', 'blue'],
      warm_undertones: ['golden', 'honey', 'bronze', 'copper', 'peach'],
      neutral_undertones: ['neutral', 'balanced', 'versatile']
    });
  }

  // Select hair color with skin tone coordination
  selectHairColor(skinTone, templatePrefs = {}) {
    if (!this.initialized) {
      throw new Error('Color System not initialized');
    }

    let availableColors = [];
    const hairColors = this.colorData.hair;

    // Apply template preferences first
    if (templatePrefs.preferred && templatePrefs.preferred.length > 0) {
      templatePrefs.preferred.forEach(category => {
        if (hairColors[category]) {
          availableColors = availableColors.concat(hairColors[category]);
        }
      });
    } else {
      // Use all hair colors if no template preference
      availableColors = Object.values(hairColors).flat();
    }

    // Filter by skin tone harmony if skin tone provided
    if (skinTone) {
      const skinCategory = this._categorizeSkinTone(skinTone);
      const harmonyRules = this.harmonyRules.hairSkinHarmony[skinCategory];
      
      if (harmonyRules) {
        // Prefer harmonious colors
        const harmoniousColors = availableColors.filter(color =>
          harmonyRules.preferred.some(pref => 
            color.toLowerCase().includes(pref.toLowerCase())
          )
        );
        
        if (harmoniousColors.length > 0) {
          availableColors = harmoniousColors;
        }

        // Remove conflicting colors
        availableColors = availableColors.filter(color =>
          !harmonyRules.avoid.some(avoid => 
            color.toLowerCase().includes(avoid.toLowerCase())
          )
        );
      }
    }

    // Apply template avoids
    if (templatePrefs.avoid && templatePrefs.avoid.length > 0) {
      templatePrefs.avoid.forEach(category => {
        if (hairColors[category]) {
          availableColors = availableColors.filter(color =>
            !hairColors[category].includes(color)
          );
        }
      });
    }

    return this._selectRandomColor(availableColors);
  }

  // Select clothing colors coordinated with hair and skin
  selectClothingColors(hairColor, skinTone, templatePrefs = {}) {
    if (!this.initialized) {
      throw new Error('Color System not initialized');
    }

    let availableColors = [];
    const clothingColors = this.colorData.clothing;

    // Apply template preferences
    if (templatePrefs.preferred && templatePrefs.preferred.length > 0) {
      templatePrefs.preferred.forEach(category => {
        if (clothingColors[category]) {
          availableColors = availableColors.concat(clothingColors[category]);
        }
      });
    } else {
      // Use neutral and earth tones as default
      availableColors = [
        ...(clothingColors.neutral_bases || []),
        ...(clothingColors.earth_tones || [])
      ];
    }

    // Coordinate with hair color
    if (hairColor) {
      const hairCategory = this._categorizeHairColor(hairColor);
      const harmonyRules = this.harmonyRules.clothingHairHarmony[hairCategory];
      
      if (harmonyRules) {
        // Filter for harmonious combinations
        const harmoniousColors = availableColors.filter(color =>
          harmonyRules.preferred.some(pref =>
            this._colorMatchesCategory(color, pref)
          )
        );
        
        if (harmoniousColors.length > 0) {
          availableColors = harmoniousColors;
        }

        // Remove conflicting colors
        availableColors = availableColors.filter(color =>
          !harmonyRules.avoid.some(avoid =>
            this._colorMatchesCategory(color, avoid)
          )
        );
      }
    }

    // Apply template avoids
    if (templatePrefs.avoid && templatePrefs.avoid.length > 0) {
      templatePrefs.avoid.forEach(category => {
        if (clothingColors[category]) {
          availableColors = availableColors.filter(color =>
            !clothingColors[category].includes(color)
          );
        }
      });
    }

    return this._selectRandomColor(availableColors);
  }

  // Select accent colors (jewelry, accessories)
  selectAccentColors(hairColor, clothingColor, templatePrefs = {}) {
    if (!this.initialized) {
      throw new Error('Color System not initialized');
    }

    let availableColors = [];
    const accentColors = this.colorData.accents;

    // Apply template preferences
    if (templatePrefs.preferred && templatePrefs.preferred.length > 0) {
      templatePrefs.preferred.forEach(category => {
        if (accentColors[category]) {
          availableColors = availableColors.concat(accentColors[category]);
        }
      });
    } else {
      // Default to versatile metals
      availableColors = [
        ...(accentColors.jewelry_metals || []),
        ...(accentColors.neutral_accents || [])
      ];
    }

    // Coordinate with hair color metal tones
    if (hairColor) {
      const preferredMetals = this._getPreferredMetals(hairColor);
      const metalColors = availableColors.filter(color =>
        preferredMetals.some(metal => 
          color.toLowerCase().includes(metal.toLowerCase())
        )
      );
      
      if (metalColors.length > 0) {
        availableColors = metalColors;
      }
    }

    return this._selectRandomColor(availableColors);
  }

  // Get seasonal color palette
  getSeasonalPalette(season, elementType) {
    if (this.seasonalPalettes[season] && this.seasonalPalettes[season][elementType]) {
      return this.seasonalPalettes[season][elementType];
    }
    return [];
  }

  // Check color compatibility
  checkCompatibility(hairColor, clothingColor, accentColor) {
    const compatibility = {
      overall: 'good',
      conflicts: [],
      suggestions: []
    };

    // Check for obvious conflicts
    if (this._hasColorConflict(hairColor, clothingColor)) {
      compatibility.conflicts.push('Hair and clothing colors may clash');
      compatibility.overall = 'needs-adjustment';
    }

    if (this._hasMetalConflict(hairColor, accentColor)) {
      compatibility.conflicts.push('Metal tones may not complement hair color');
      compatibility.overall = 'needs-adjustment';
    }

    // Generate suggestions if needed
    if (compatibility.conflicts.length > 0) {
      compatibility.suggestions = this._generateColorSuggestions(hairColor, clothingColor, accentColor);
    }

    return compatibility;
  }

  // Helper: Categorize skin tone
  _categorizeSkinTone(skinTone) {
    const skinLower = skinTone.toLowerCase();
    
    if (skinLower.includes('fair') || skinLower.includes('pale') || skinLower.includes('light')) {
      return 'light_tones';
    } else if (skinLower.includes('dark') || skinLower.includes('deep') || skinLower.includes('rich')) {
      return 'deep_tones';
    } else {
      return 'medium_tones';
    }
  }

  // Helper: Categorize hair color
  _categorizeHairColor(hairColor) {
    const hairLower = hairColor.toLowerCase();
    
    if (hairLower.includes('blonde') || hairLower.includes('platinum') || hairLower.includes('honey')) {
      return 'blonde';
    } else if (hairLower.includes('brown') || hairLower.includes('chestnut') || hairLower.includes('chocolate')) {
      return 'brunette';
    } else if (hairLower.includes('black') || hairLower.includes('dark') || hairLower.includes('jet')) {
      return 'black';
    } else if (hairLower.includes('red') || hairLower.includes('auburn') || hairLower.includes('copper')) {
      return 'red';
    } else {
      return 'fantasy';
    }
  }

  // Helper: Check if color matches category
  _colorMatchesCategory(color, category) {
    return color.toLowerCase().includes(category.toLowerCase());
  }

  // Helper: Get preferred metals for hair color
  _getPreferredMetals(hairColor) {
    const hairCategory = this._categorizeHairColor(hairColor);
    
    const metalPreferences = {
      blonde: ['silver', 'platinum', 'white gold'],
      brunette: ['gold', 'bronze', 'warm metals'],
      black: ['silver', 'platinum', 'bold metals'],
      red: ['gold', 'copper', 'warm metals'],
      fantasy: ['all metals', 'creative combinations']
    };

    return metalPreferences[hairCategory] || ['gold', 'silver'];
  }

  // Helper: Check for color conflicts
  _hasColorConflict(color1, color2) {
    // Simple conflict detection - could be expanded
    const conflicts = [
      ['red', 'pink'],
      ['orange', 'red'],
      ['yellow', 'green']
    ];

    return conflicts.some(([c1, c2]) => 
      (color1.toLowerCase().includes(c1) && color2.toLowerCase().includes(c2)) ||
      (color1.toLowerCase().includes(c2) && color2.toLowerCase().includes(c1))
    );
  }

  // Helper: Check for metal conflicts
  _hasMetalConflict(hairColor, accentColor) {
    // Check if metal tone matches hair undertones
    return false; // Placeholder - could be expanded
  }

  // Helper: Generate color suggestions
  _generateColorSuggestions(hairColor, clothingColor, accentColor) {
    return [
      'Consider using neutral tones for better harmony',
      'Try coordinating metal tones with hair undertones',
      'Use analogous colors for subtle combinations'
    ];
  }

  // Helper: Select random color from array
  _selectRandomColor(colors) {
    if (!colors || colors.length === 0) {
      return 'neutral tone';
    }
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Get color statistics
  getColorStats() {
    if (!this.initialized) return null;

    const stats = {};
    Object.entries(this.colorData).forEach(([category, data]) => {
      stats[category] = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
    });

    return stats;
  }

  // Reset color system
  reset() {
    this.colorData = {};
    this.harmonyRules = {};
    this.initialized = false;
    this.colorMappings.clear();
  }
}

export default ColorSystem;