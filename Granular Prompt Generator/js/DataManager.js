class DataManager {
  constructor() {
    this.data = {};
    this.colors = {};
    this.loaded = false;
    this.cache = new Map();
    this.loadPromise = null;
  }

  // Load all JSON data files
  async loadAllData() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._performLoad();
    return this.loadPromise;
  }

  async _performLoad() {
    try {
      console.log('Loading atomic data files...');
      
      // Define all data files to load
      const dataFiles = {
        // Core files
        subjects: 'data/core/subjects.json',
        bodyTypes: 'data/core/body-types.json', 
        expressions: 'data/core/expressions.json',
        
        // Appearance files
        hairStyles: 'data/appearance/hair-styles.json',
        skinTones: 'data/appearance/skin-tones.json',
        
        // Color files
        hairColors: 'data/colors/hair-colors.json',
        clothingColors: 'data/colors/clothing-colors.json',
        accentColors: 'data/colors/accent-colors.json',
        
        // Clothing files
        tops: 'data/clothing/tops.json',
        bottoms: 'data/clothing/bottoms.json',
        dresses: 'data/clothing/dresses.json',
        outerwear: 'data/clothing/outerwear.json',
        culturalWear: 'data/clothing/cultural-wear.json',
        
        // Accessory files
        jewelry: 'data/accessories/jewelry.json',
        headwear: 'data/accessories/headwear.json',
        handheld: 'data/accessories/handheld.json',
        eyewear: 'data/accessories/eyewear.json',
        
        // Environment files
        natural: 'data/environments/natural.json',
        urban: 'data/environments/urban.json',
        fantasy: 'data/environments/fantasy.json',
        historical: 'data/environments/historical.json',
        
        // Style files
        artStyles: 'data/styles/art-styles.json',
        lighting: 'data/styles/lighting.json',
        camera: 'data/styles/camera.json'
      };

      // Load all files in parallel
      const loadPromises = Object.entries(dataFiles).map(async ([key, path]) => {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status}`);
          }
          const data = await response.json();
          return [key, data];
        } catch (error) {
          console.error(`Error loading ${path}:`, error);
          return [key, {}]; // Return empty object as fallback
        }
      });

      const results = await Promise.all(loadPromises);
      
      // Store loaded data
      results.forEach(([key, data]) => {
        this.data[key] = data;
      });

      // Initialize color system
      this._initializeColorSystem();
      
      this.loaded = true;
      console.log('All data files loaded successfully');
      
      return this.data;
    } catch (error) {
      console.error('Error loading data files:', error);
      throw error;
    }
  }

  // Initialize smart color coordination system
  _initializeColorSystem() {
    this.colors = {
      hairColors: this.data.hairColors || {},
      clothingColors: this.data.clothingColors || {},
      accentColors: this.data.accentColors || {},
      skinTones: this.data.skinTones || {}
    };
  }

  // Get random item from category with preference weighting
  getRandomFromCategory(category, subcategory = null, preferences = []) {
    const cacheKey = `${category}-${subcategory}-${preferences.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      return this._selectRandom(cached);
    }

    if (!this.loaded) {
      throw new Error('Data not loaded. Call loadAllData() first.');
    }

    let items = [];

    // Get data from category
    if (this.data[category]) {
      if (subcategory && this.data[category][subcategory]) {
        items = this.data[category][subcategory];
      } else if (Array.isArray(this.data[category])) {
        items = this.data[category];
      } else {
        // If no subcategory specified, get all items from all subcategories
        items = Object.values(this.data[category]).flat();
      }
    }

    if (items.length === 0) {
      console.warn(`No items found for category: ${category}, subcategory: ${subcategory}`);
      return '';
    }

    // Apply preferences if specified
    if (preferences.length > 0) {
      const preferredItems = items.filter(item => 
        preferences.some(pref => item.toLowerCase().includes(pref.toLowerCase()))
      );
      if (preferredItems.length > 0) {
        items = preferredItems;
      }
    }

    // Cache the processed items
    this.cache.set(cacheKey, items);
    
    return this._selectRandom(items);
  }

  // Select random item from array
  _selectRandom(items) {
    if (!items || items.length === 0) return '';
    return items[Math.floor(Math.random() * items.length)];
  }

  // Get compatible colors based on template preferences
  getCompatibleColors(elementType, baseColors = [], templatePrefs = {}) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call loadAllData() first.');
    }

    const colorData = this.colors[elementType];
    if (!colorData) {
      console.warn(`No color data found for: ${elementType}`);
      return '';
    }

    // Apply template preferences
    let availableColors = [];
    
    if (templatePrefs.preferred && templatePrefs.preferred.length > 0) {
      templatePrefs.preferred.forEach(prefCategory => {
        if (colorData[prefCategory]) {
          availableColors = availableColors.concat(colorData[prefCategory]);
        }
      });
    } else {
      // Use all colors if no preferences
      availableColors = Object.values(colorData).flat();
    }

    // Avoid certain categories if specified
    if (templatePrefs.avoid && templatePrefs.avoid.length > 0) {
      templatePrefs.avoid.forEach(avoidCategory => {
        if (colorData[avoidCategory]) {
          availableColors = availableColors.filter(color => 
            !colorData[avoidCategory].includes(color)
          );
        }
      });
    }

    return this._selectRandom(availableColors);
  }

  // Get multiple items for combination (like accessories)
  getMultipleItems(category, maxItems = 2, probability = 0.5, categoryPrefs = {}) {
    if (Math.random() > probability) {
      return []; // No items selected
    }

    const items = [];
    const numItems = Math.floor(Math.random() * maxItems) + 1;

    // Get available subcategories
    const categoryData = this.data[category];
    if (!categoryData) return [];

    const subcategories = Object.keys(categoryData);
    
    for (let i = 0; i < numItems; i++) {
      // Select subcategory based on preferences
      let selectedSubcategory;
      
      if (categoryPrefs && Object.keys(categoryPrefs).length > 0) {
        // Weight selection based on preferences
        const weightedCategories = [];
        subcategories.forEach(subcat => {
          const weight = categoryPrefs[subcat] || 0.1;
          const count = Math.floor(weight * 10);
          for (let j = 0; j < count; j++) {
            weightedCategories.push(subcat);
          }
        });
        selectedSubcategory = this._selectRandom(weightedCategories);
      } else {
        selectedSubcategory = this._selectRandom(subcategories);
      }

      if (selectedSubcategory) {
        const item = this.getRandomFromCategory(category, selectedSubcategory);
        if (item) {
          items.push({
            category: selectedSubcategory,
            item: item
          });
        }
      }
    }

    return items;
  }

  // Check if data is loaded
  isLoaded() {
    return this.loaded;
  }

  // Get all available categories
  getAvailableCategories() {
    return Object.keys(this.data);
  }

  // Get subcategories for a category
  getSubcategories(category) {
    if (!this.data[category]) return [];
    
    if (Array.isArray(this.data[category])) {
      return [category]; // Single array category
    }
    
    return Object.keys(this.data[category]);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get data statistics
  getDataStats() {
    if (!this.loaded) return null;

    const stats = {};
    Object.entries(this.data).forEach(([category, data]) => {
      if (Array.isArray(data)) {
        stats[category] = data.length;
      } else {
        stats[category] = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
      }
    });

    return stats;
  }
}

// Export for module use
export default DataManager;