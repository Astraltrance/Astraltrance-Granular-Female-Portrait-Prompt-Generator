import DataManager from "./dataManager.js";

class TemplateEngine {
  constructor() {
    this.dataManager = new DataManager();
    this.templates = {};
    this.loadedTemplates = false;
  }

  // Initialize the template engine
  async initialize() {
    try {
      console.log("Initializing Template Engine...");

      // Load all data first
      await this.dataManager.loadAllData();

      // Load all templates
      await this.loadTemplates();

      console.log("Template Engine initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize Template Engine:", error);
      throw error;
    }
  }

  // Load all template configurations
  async loadTemplates() {
    try {
      const templateFiles = [
        "photorealistic",
        "anime-manga",
        "pixar-3d",
        "artistic-painting",
        "fashion-portrait",
        "environmental",
        "cinematic",
        "creative-mix",
      ];

      const loadPromises = templateFiles.map(async (templateName) => {
        try {
          const module = await import(`./templates/${templateName}.js`);
          // Get the template configuration (could be named differently in each file)
          const templateConfig =
            module.PhotorealisticTemplate ||
            module.AnimeMangaTemplate ||
            module.Pixar3DTemplate ||
            module.ArtisticPaintingTemplate ||
            module.FashionPortraitTemplate ||
            module.EnvironmentalTemplate ||
            module.CinematicTemplate ||
            module.CreativeMixTemplate ||
            module.default;

          return [templateName, templateConfig];
        } catch (error) {
          console.error(`Error loading template ${templateName}:`, error);
          return [templateName, null];
        }
      });

      const results = await Promise.all(loadPromises);

      results.forEach(([templateName, config]) => {
        if (config) {
          this.templates[templateName] = config;
        }
      });

      this.loadedTemplates = true;
      console.log(`Loaded ${Object.keys(this.templates).length} templates`);
    } catch (error) {
      console.error("Error loading templates:", error);
      throw error;
    }
  }

  // Generate a complete prompt using specified template
  async generatePrompt(templateName, options = {}) {
    if (!this.loadedTemplates) {
      throw new Error("Templates not loaded. Call initialize() first.");
    }

    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    console.log(`Generating prompt with template: ${template.name}`);

    try {
      // Generate all prompt elements
      const elements = await this._generateElements(template, options);

      // Combine elements into final prompt
      const prompt = this._combineElements(elements, template);

      return {
        prompt: prompt,
        template: template.name,
        elements: elements,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error generating prompt:", error);
      throw error;
    }
  }

  // Generate all prompt elements based on template configuration
  async _generateElements(template, options = {}) {
    const elements = {};

    try {
      // Generate subject
      if (template.elements.subject?.required) {
        elements.subject = this._generateSubject(template);
      }

      // Generate body type
      if (template.elements.bodyType?.required) {
        elements.bodyType = this._generateBodyType(template);
      }

      // Generate expression/mood
      if (template.elements.expression?.required) {
        elements.expression = this._generateExpression(template);
      }

      // Generate hair style and color
      if (template.elements.hairStyle?.required) {
        elements.hairStyle = this._generateHairStyle(template);
      }
      if (template.elements.hairColor?.required) {
        elements.hairColor = this._generateHairColor(
          template,
          elements.hairStyle
        );
      }

      // Generate skin tone
      if (
        template.elements.skinTone?.required ||
        template.elements.skinTone?.weight > 0.5
      ) {
        elements.skinTone = this._generateSkinTone(template);
      }

      // Generate clothing
      if (template.elements.clothing?.required) {
        elements.clothing = this._generateClothing(template);
      }

      // Generate accessories (with probability)
      if (template.elements.accessories) {
        elements.accessories = this._generateAccessories(template, options);
      }

      // Generate environment
      if (template.elements.environment?.required) {
        elements.environment = this._generateEnvironment(template);
      }

      // Generate lighting (only if user enabled it)
   if (template.elements.lighting?.required && options.includeLighting !== false) {
        elements.lighting = this._generateLighting(template);
      }

      // Generate art style
      if (template.elements.style?.required) {
        elements.style = this._generateArtStyle(template);
      }

      // Generate camera settings (only if user enabled it)  
   if (template.elements.camera?.required && options.includeCamera !== false) {
        elements.camera = this._generateCamera(template);
      }

      return elements;
    } catch (error) {
      console.error("Error generating elements:", error);
      throw error;
    }
  }

  // Generate subject description
  // Generate subject description
  _generateSubject(template) {
    const prefs = template.preferences?.subjects || {};

    // Build atomic subject from components
    const baseSubject = this.dataManager.getRandomFromCategory(
      "subjects",
      "base_subjects"
    );
    const subjectType = this.dataManager.getRandomFromCategory(
      "subjects",
      "subject_types"
    );

    // Add age descriptor based on template preferences
    let fullSubject = `${baseSubject} ${subjectType}`;

    // Add age if template prefers it
    if (!prefs.avoid || !prefs.avoid.includes("age_variations")) {
      const ageDescriptor = this.dataManager.getRandomFromCategory(
        "subjects",
        "age_descriptors"
      );
      fullSubject = `${baseSubject} ${ageDescriptor} ${subjectType}`;
    }

    // Add personality if template prefers it
    if (prefs.preferred && prefs.preferred.includes("personality_hints")) {
      const personality = this.dataManager.getRandomFromCategory(
        "subjects",
        "personality_traits"
      );
      fullSubject = `${baseSubject} ${personality} ${subjectType}`;
    }

    return fullSubject;
  }

  // Generate body type description
  _generateBodyType(template) {
    const prefs = template.preferences?.bodyTypes || {};

    // Build atomic body type from components
    const buildType = this.dataManager.getRandomFromCategory(
      "bodyTypes",
      "build_types"
    );
    const buildDescriptor = this.dataManager.getRandomFromCategory(
      "bodyTypes",
      "build_descriptors"
    );
    const silhouetteType = this.dataManager.getRandomFromCategory(
      "bodyTypes",
      "silhouette_types"
    );
    const connector = this.dataManager.getRandomFromCategory(
      "bodyTypes",
      "connector_words"
    );

    // Apply template preferences if specified
    let preferredBuildTypes = buildType;
    if (prefs.preferred && prefs.preferred.length > 0) {
      // Try to get a build type that matches preferences
      const matchingBuilds =
        this.dataManager.data.bodyTypes?.build_types?.filter((build) =>
          prefs.preferred.some((pref) =>
            build.toLowerCase().includes(pref.toLowerCase())
          )
        );
      if (matchingBuilds && matchingBuilds.length > 0) {
        preferredBuildTypes = this.dataManager._selectRandom(matchingBuilds);
      }
    }

    return `${connector} ${preferredBuildTypes} and ${buildDescriptor} ${silhouetteType}`;
  }

  // Generate expression/mood
  _generateExpression(template) {
    const prefs = template.preferences?.expressions || {};
    let categories = ["elegant_moods"];

    if (prefs.preferred && prefs.preferred.length > 0) {
      categories = prefs.preferred.filter((cat) => cat !== "ALL_CATEGORIES");
    }

    const selectedCategory = this.dataManager._selectRandom(categories);
    return this.dataManager.getRandomFromCategory(
      "expressions",
      selectedCategory
    );
  }

// Generate hair style with logical combinations
_generateHairStyle(template) {
  const prefs = template.preferences?.hairStyles || {};

  // Define mutually exclusive style groups using your existing data
  const styleGroups = {
    short_cuts: ['bob', 'pixie cut'],
    long_styles: ['layers', 'waves', 'curls'], 
    braided_styles: ['braids', 'braid'],
    updos: ['updo', 'bun', 'chignon', 'ponytail', 'twist', 'top knot'],
    bangs_styles: ['bangs']
  };

  // Get all available hair styles from your data
  const allHairStyles = this.dataManager.data.hairStyles?.hair_styles || [];
  
  // Step 1: Categorize the randomly selected style
  let selectedStyle = this.dataManager.getRandomFromCategory('hairStyles', 'hair_styles');
  let selectedGroup = null;
  
  // Find which group this style belongs to
  for (const [groupName, styles] of Object.entries(styleGroups)) {
    if (styles.some(style => selectedStyle.toLowerCase().includes(style.toLowerCase()))) {
      selectedGroup = groupName;
      break;
    }
  }

  // Step 2: Get compatible length and texture based on the style group
  let compatibleLengths = [];
  let compatibleTextures = [];
  
  if (selectedGroup === 'short_cuts') {
    compatibleLengths = ['short', 'chin-length'];
    compatibleTextures = ['straight', 'wavy', 'sleek', 'tousled'];
  } else if (selectedGroup === 'braided_styles') {
    compatibleLengths = ['long', 'medium', 'waist-length'];
    compatibleTextures = ['straight', 'textured'];
  } else if (selectedGroup === 'updos') {
    compatibleLengths = ['medium', 'long', 'shoulder-length'];
    compatibleTextures = ['curly', 'wavy', 'straight', 'voluminous', 'sleek'];
  } else {
    // For other styles, use most lengths and textures
    compatibleLengths = ['short', 'medium', 'long', 'shoulder-length'];
    compatibleTextures = ['straight', 'wavy', 'curly', 'sleek', 'voluminous'];
  }

  // Get compatible elements
  const availableLengths = this.dataManager.data.hairStyles?.hair_lengths || [];
  const availableTextures = this.dataManager.data.hairStyles?.hair_textures || [];
  
  const validLengths = availableLengths.filter(length => 
    compatibleLengths.some(compat => length.toLowerCase().includes(compat.toLowerCase()))
  );
  
  const validTextures = availableTextures.filter(texture => 
    compatibleTextures.some(compat => texture.toLowerCase().includes(compat.toLowerCase()))
  );

  // Step 3: Select compatible length and texture
  const hairLength = validLengths.length > 0 ? 
    this.dataManager._selectRandom(validLengths) : 
    this.dataManager.getRandomFromCategory('hairStyles', 'hair_lengths');
    
  const hairTexture = validTextures.length > 0 ? 
    this.dataManager._selectRandom(validTextures) : 
    this.dataManager.getRandomFromCategory('hairStyles', 'hair_textures');

  // Step 4: Get other elements
  const hairDescriptor = this.dataManager.getRandomFromCategory('hairStyles', 'hair_descriptors');
  const connector = this.dataManager.getRandomFromCategory('hairStyles', 'connector_phrases');

  // Step 5: Combine elements logically
  let finalHairStyle = '';
  
  if (selectedGroup === 'short_cuts') {
    // For short cuts: "with [descriptor] [length] [texture] [style]"
    finalHairStyle = `${connector} ${hairDescriptor}, ${hairLength} ${hairTexture} ${selectedStyle}`;
  } else if (selectedGroup === 'braided_styles') {
    // For braids: "with [descriptor] [texture] hair in [style]"
    finalHairStyle = `${connector} ${hairDescriptor} ${hairTexture} hair styled in ${selectedStyle}`;
  } else if (selectedGroup === 'updos') {
    // For updos: "with hair styled in [descriptor] [style]"
    finalHairStyle = `${connector} hair styled in a ${hairDescriptor} ${selectedStyle}`;
  } else {
    // General combination
    finalHairStyle = `${connector} ${hairDescriptor}, ${hairLength} ${hairTexture} ${selectedStyle}`;
  }

  return finalHairStyle;
}

  // Generate hair color with coordination
  _generateHairColor(template, hairStyle) {
    const prefs = template.preferences?.hairColors || {};

    // Build atomic hair color from components
    const colorBase = this.dataManager.getRandomFromCategory(
      "hairColors",
      "natural_bases"
    );
    const colorDescriptor = this.dataManager.getRandomFromCategory(
      "hairColors",
      "color_descriptors"
    );
    const colorModifier = this.dataManager.getRandomFromCategory(
      "hairColors",
      "natural_modifiers"
    );

    // Apply template preferences
    let selectedBase = colorBase;
    if (prefs.preferred && prefs.preferred.includes("fantasy_bases")) {
      const fantasyBase = this.dataManager.getRandomFromCategory(
        "hairColors",
        "fantasy_bases"
      );
      selectedBase = fantasyBase;
    }

    // For anime template, sometimes use fantasy colors
    if (template.name === "Anime/Manga" && Math.random() > 0.6) {
      selectedBase = this.dataManager.getRandomFromCategory(
        "hairColors",
        "fantasy_bases"
      );
    }

    // Add highlights or effects occasionally
    if (Math.random() > 0.7) {
      const highlightType = this.dataManager.getRandomFromCategory(
        "hairColors",
        "highlight_types"
      );
      const highlightColor = this.dataManager.getRandomFromCategory(
        "hairColors",
        "highlight_colors"
      );
      return `${colorDescriptor} ${selectedBase} hair with ${highlightColor} ${highlightType}`;
    }

    return `${colorDescriptor} ${selectedBase} hair`;
  }

  // Generate skin tone
  _generateSkinTone(template) {
    const prefs = template.preferences?.skinTones || {};
    let categories = ["light_tones", "medium_tones", "deep_tones"];

    if (prefs.preferred && prefs.preferred.length > 0) {
      categories = prefs.preferred;
    }

    const selectedCategory = this.dataManager._selectRandom(categories);
    return this.dataManager.getRandomFromCategory(
      "skinTones",
      selectedCategory
    );
  }

  // Generate clothing description
  _generateClothing(template) {
    const prefs = template.preferences?.clothing || {};

    // Randomly choose between tops+bottoms, dress, or outerwear
    const clothingTypes = ["tops_bottoms", "dress", "outerwear"];
    const selectedType = this.dataManager._selectRandom(clothingTypes);

    let clothing = "";

    switch (selectedType) {
      case "tops_bottoms":
        // Build atomic top
        const top = this.dataManager.getRandomFromCategory(
          "tops",
          "basic_tops"
        );
        const topFit = this.dataManager.getRandomFromCategory(
          "tops",
          "fit_styles"
        );
        const topDetail = this.dataManager.getRandomFromCategory(
          "tops",
          "details_features"
        );

        // Build atomic bottom
        const bottom = this.dataManager.getRandomFromCategory(
          "bottoms",
          "pants_types"
        );
        const bottomFit = this.dataManager.getRandomFromCategory(
          "bottoms",
          "fit_styles"
        );

        clothing = `${topFit} ${top} with ${topDetail} and ${bottomFit} ${bottom}`;
        break;

      case "dress":
        const dressType = this.dataManager.getRandomFromCategory(
          "dresses",
          "dress_types"
        );
        const dressLength = this.dataManager.getRandomFromCategory(
          "dresses",
          "dress_lengths"
        );
        const dressSilhouette = this.dataManager.getRandomFromCategory(
          "dresses",
          "silhouettes"
        );
        const dressFeature = this.dataManager.getRandomFromCategory(
          "dresses",
          "special_features"
        );

        clothing = `${dressSilhouette} ${dressLength} ${dressType} with ${dressFeature}`;
        break;

      case "outerwear":
        const outerType = this.dataManager.getRandomFromCategory(
          "outerwear",
          "coat_types"
        );
        const outerFit = this.dataManager.getRandomFromCategory(
          "outerwear",
          "fits"
        );
        const outerFeature = this.dataManager.getRandomFromCategory(
          "outerwear",
          "special_features"
        );

        clothing = `${outerFit} ${outerType} with ${outerFeature}`;
        break;
    }

    // Add clothing colors with better combination
    const colorBase = this.dataManager.getRandomFromCategory(
      "clothingColors",
      "neutral_bases"
    );
    const colorIntensity = this.dataManager.getRandomFromCategory(
      "clothingColors",
      "color_intensities"
    );

    return `wearing a ${clothing} in ${colorIntensity} ${colorBase}`;
  }

  // Helper to select clothing category
  _selectClothingCategory(clothingType, prefs) {
    // This would be expanded based on specific template preferences
    return null; // Use all subcategories
  }

  // Generate accessories with smart probability system + user control
  _generateAccessories(template, options = {}) {
    const accessoryConfig = template.elements.accessories;
    if (!accessoryConfig) return [];

    // Template-specific base probabilities
    let baseProbability = 0.3; // Default 30%
    switch (template.name) {
      case "Photorealistic":
        baseProbability = 0.25;
        break; // 25% - minimal
      case "Anime/Manga":
        baseProbability = 0.45;
        break; // 45% - anime loves accessories
      case "Fashion Portrait":
        baseProbability = 0.65;
        break; // 65% - fashion needs accessories
      case "Artistic Painting":
        baseProbability = 0.4;
        break; // 40% - classical
      case "Creative Mix":
        baseProbability = 0.55;
        break; // 55% - creative combinations
      case "Environmental":
        baseProbability = 0.3;
        break; // 30% - don't distract
      case "Cinematic":
        baseProbability = 0.4;
        break; // 40% - dramatic
      case "Pixar 3D":
        baseProbability = 0.35;
        break; // 35% - appealing but not overwhelming
    }

    // Apply user's accessory frequency preference
    // accessoryFrequency comes from UI slider: 0 = None, 1 = Low, 2 = Medium, 3 = High
    const userAccessoryFreq = options.accessoryFrequency || 2; // Default to Medium

    switch (userAccessoryFreq) {
      case 0: // None
        return []; // No accessories at all
      case 1: // Low
        baseProbability *= 0.4; // Reduce by 60%
        break;
      case 2: // Medium
        // Keep template default (no change)
        break;
      case 3: // High
        baseProbability *= 1.6; // Increase by 60%
        baseProbability = Math.min(baseProbability, 0.9); // Cap at 90%
        break;
    }

    // Check if accessories should appear at all
    if (Math.random() > baseProbability) {
      return []; // No accessories this time
    }

    const accessories = [];
    const maxItems = accessoryConfig.maxItems || 2;

    // Adjust max items based on user preference
    let adjustedMaxItems = maxItems;
    if (userAccessoryFreq === 1) {
      adjustedMaxItems = 1; // Low = max 1 item
    } else if (userAccessoryFreq === 3) {
      adjustedMaxItems = Math.min(maxItems + 1, 3); // High = allow 1 extra, max 3
    }

    // Smart type probabilities (independent chances)
    const typeChances = {
      jewelry: 0.8, // 80% chance if accessories are selected
      headwear: 0.15, // 15% chance
      handheld: 0.1, // 10% chance
      eyewear: 0.08, // 8% chance (very rare)
    };

    // Try each accessory type
    Object.entries(typeChances).forEach(([type, chance]) => {
      if (accessories.length >= adjustedMaxItems) return; // Stop if at max

      if (Math.random() < chance) {
        let accessoryItem = "";

        // Generate detailed atomic accessories
        switch (type) {
          case "jewelry":
            const jewelryType = this.dataManager.getRandomFromCategory(
              "jewelry",
              "necklace_types"
            );
            const metalType = this.dataManager.getRandomFromCategory(
              "jewelry",
              "jewelry_metals"
            );
            const gemstone = this.dataManager.getRandomFromCategory(
              "jewelry",
              "gemstones"
            );
            const jewelryStyle = this.dataManager.getRandomFromCategory(
              "jewelry",
              "jewelry_styles"
            );
            accessoryItem = `${jewelryStyle} ${metalType} ${jewelryType} with ${gemstone}`;
            break;

          case "headwear":
            const headwearType = this.dataManager.getRandomFromCategory(
              "headwear",
              "casual_hats"
            );
            const headwearMaterial = this.dataManager.getRandomFromCategory(
              "headwear",
              "materials"
            );
            const headwearStyle = this.dataManager.getRandomFromCategory(
              "headwear",
              "style_descriptors"
            );
            accessoryItem = `${headwearStyle} ${headwearMaterial} ${headwearType}`;
            break;

          case "handheld":
            const handheldType = this.dataManager.getRandomFromCategory(
              "handheld",
              "bags_purses"
            );
            const handheldMaterial = this.dataManager.getRandomFromCategory(
              "handheld",
              "materials"
            );
            const handheldCondition = this.dataManager.getRandomFromCategory(
              "handheld",
              "conditions"
            );
            accessoryItem = `${handheldCondition} ${handheldMaterial} ${handheldType}`;
            break;

          case "eyewear":
            const eyewearType = this.dataManager.getRandomFromCategory(
              "eyewear",
              "sunglasses"
            );
            const frameShape = this.dataManager.getRandomFromCategory(
              "eyewear",
              "frame_shapes"
            );
            const frameMaterial = this.dataManager.getRandomFromCategory(
              "eyewear",
              "frame_materials"
            );
            accessoryItem = `${frameShape} ${frameMaterial} ${eyewearType}`;
            break;
        }

        if (accessoryItem.trim()) {
          accessories.push({
            type: type,
            item: accessoryItem,
          });
        }
      }
    });

    return accessories;
  }

  // Generate environment description
  _generateEnvironment(template) {
    const prefs = template.preferences?.environments || {};

    // Select environment type based on template preferences
    let envType = "natural";
    if (prefs.preferred && prefs.preferred.length > 0) {
      envType = this.dataManager._selectRandom(
        prefs.preferred.filter((cat) => cat !== "ALL_CATEGORIES")
      );
    }

    let environmentDesc = "";

    switch (envType) {
      case "natural":
        const naturalSetting = this.dataManager.getRandomFromCategory(
          "natural",
          "forest_settings"
        );
        const timeOfDay = this.dataManager.getRandomFromCategory(
          "natural",
          "time_of_day"
        );
        const weather = this.dataManager.getRandomFromCategory(
          "natural",
          "weather_conditions"
        );
        const atmosphere = this.dataManager.getRandomFromCategory(
          "natural",
          "atmospheric_effects"
        );

        environmentDesc = `in a ${weather} ${naturalSetting} at ${timeOfDay} with ${atmosphere}`;
        break;

      case "urban":
        const urbanSetting = this.dataManager.getRandomFromCategory(
          "urban",
          "street_settings"
        );
        const urbanTime = this.dataManager.getRandomFromCategory(
          "urban",
          "time_periods"
        );
        const urbanAtmosphere = this.dataManager.getRandomFromCategory(
          "urban",
          "urban_atmosphere"
        );
        const architecturalDetail = this.dataManager.getRandomFromCategory(
          "urban",
          "architectural_details"
        );

        environmentDesc = `in a ${urbanAtmosphere} ${urbanSetting} during ${urbanTime} with ${architecturalDetail}`;
        break;

      case "fantasy":
        const fantasySetting = this.dataManager.getRandomFromCategory(
          "fantasy",
          "magical_landscapes"
        );
        const magicalElement = this.dataManager.getRandomFromCategory(
          "fantasy",
          "fantastical_elements"
        );
        const magicalAtmosphere = this.dataManager.getRandomFromCategory(
          "fantasy",
          "atmospheric_magic"
        );

        environmentDesc = `in a ${fantasySetting} with ${magicalElement} and ${magicalAtmosphere}`;
        break;

      case "historical":
        const historicalSetting = this.dataManager.getRandomFromCategory(
          "historical",
          "victorian_era"
        );
        const historicalAtmosphere = this.dataManager.getRandomFromCategory(
          "historical",
          "historical_atmosphere"
        );
        const periodLighting = this.dataManager.getRandomFromCategory(
          "historical",
          "historical_lighting"
        );

        environmentDesc = `in a ${historicalAtmosphere} ${historicalSetting} with ${periodLighting}`;
        break;

      default:
        // Fallback to simple selection
        environmentDesc = `in a ${this.dataManager.getRandomFromCategory(
          envType
        )}`;
    }

    return environmentDesc;
  }

  // Generate lighting description
  _generateLighting(template) {
    const prefs = template.preferences?.lighting || {};

    // Build atomic lighting from components
    let lightingType = "natural_lighting";
    if (prefs.preferred && prefs.preferred.length > 0) {
      lightingType = this.dataManager._selectRandom(
        prefs.preferred.filter((cat) => cat !== "ALL_CATEGORIES")
      );
    }

    const lightingSource = this.dataManager.getRandomFromCategory(
      "lighting",
      lightingType
    );
    const lightingQuality = this.dataManager.getRandomFromCategory(
      "lighting",
      "lighting_quality"
    );
    const lightingEffect = this.dataManager.getRandomFromCategory(
      "lighting",
      "lighting_effects"
    );
    const shadowType = this.dataManager.getRandomFromCategory(
      "lighting",
      "shadow_types"
    );
    const moodLighting = this.dataManager.getRandomFromCategory(
      "lighting",
      "mood_lighting"
    );

    // Apply template-specific lighting preferences
    let lightingDesc = "";

    if (template.name === "Photorealistic") {
      lightingDesc = `${lightingSource} with ${lightingQuality} quality and ${shadowType}`;
    } else if (template.name === "Cinematic") {
      lightingDesc = `${lightingSource} creating ${moodLighting} mood with ${lightingEffect} and ${shadowType}`;
    } else if (template.name === "Artistic Painting") {
      lightingDesc = `${lightingSource} with ${moodLighting} atmosphere and ${lightingQuality} rendering`;
    } else {
      // General combination
      lightingDesc = `${lightingSource} with ${lightingQuality} quality creating ${moodLighting} mood`;
    }

    return lightingDesc;
  }

  // Generate art style
  _generateArtStyle(template) {
    const prefs = template.preferences?.artStyles || {};

    // Build atomic art style from components
    let styleCategory = "photorealistic_styles";
    if (prefs.preferred && prefs.preferred.length > 0) {
      styleCategory = this.dataManager._selectRandom(
        prefs.preferred.filter((cat) => cat !== "ALL_CATEGORIES")
      );
    }

    const artStyle = this.dataManager.getRandomFromCategory(
      "artStyles",
      styleCategory
    );
    const technique = this.dataManager.getRandomFromCategory(
      "artStyles",
      "artistic_techniques"
    );
    const renderingQuality = this.dataManager.getRandomFromCategory(
      "artStyles",
      "rendering_quality"
    );
    const styleDescriptor = this.dataManager.getRandomFromCategory(
      "artStyles",
      "style_descriptors"
    );

    // Template-specific style combinations
    let styleDesc = "";

    if (template.name === "Anime/Manga") {
      styleDesc = `${artStyle} with ${technique} and ${styleDescriptor} appeal`;
    } else if (template.name === "Artistic Painting") {
      styleDesc = `${artStyle} with ${technique} and ${renderingQuality} finish`;
    } else if (template.name === "Photorealistic") {
      styleDesc = `${artStyle} with ${renderingQuality} and ${styleDescriptor} composition`;
    } else {
      styleDesc = `${artStyle} with ${technique} and ${styleDescriptor} style`;
    }

    return styleDesc;
  }

  // Generate camera settings
  _generateCamera(template) {
    const prefs = template.preferences?.camera || {};

    // Build atomic camera settings from components
    const shotDistance = this.dataManager.getRandomFromCategory(
      "camera",
      "shot_distances"
    );
    const cameraAngle = this.dataManager.getRandomFromCategory(
      "camera",
      "camera_angles"
    );
    const depthOfField = this.dataManager.getRandomFromCategory(
      "camera",
      "depth_of_field"
    );
    const lensCharacteristic = this.dataManager.getRandomFromCategory(
      "camera",
      "lens_characteristics"
    );
    const technicalSpec = this.dataManager.getRandomFromCategory(
      "camera",
      "technical_specs"
    );

    // Template-specific camera combinations
    let cameraDesc = "";

    if (template.name === "Fashion Portrait") {
      cameraDesc = `${shotDistance} with ${lensCharacteristic} and ${depthOfField}, ${technicalSpec}`;
    } else if (template.name === "Cinematic") {
      cameraDesc = `${shotDistance} from ${cameraAngle} with ${depthOfField} and ${technicalSpec}`;
    } else if (template.name === "Photorealistic") {
      cameraDesc = `${shotDistance} with ${lensCharacteristic}, ${depthOfField}, ${technicalSpec}`;
    } else {
      cameraDesc = `${shotDistance} with ${depthOfField} and ${technicalSpec}`;
    }

    return cameraDesc;
  }

  // Combine all elements into final prompt
  _combineElements(elements, template) {
    const parts = [];

    // Always include core elements in order
    if (elements.subject) {
      let subjectPart = elements.subject;
      if (elements.bodyType) {
        subjectPart += ` ${elements.bodyType}`;
      }
      parts.push(subjectPart);
    }

    if (elements.hairStyle) {
      let hairPart = elements.hairStyle;
      if (elements.hairColor) {
        hairPart += `, ${elements.hairColor}`;
      }
      parts.push(hairPart);
    }

    if (elements.clothing) {
      parts.push(elements.clothing);
    }

    if (elements.accessories && elements.accessories.length > 0) {
      const accessoryText = elements.accessories
        .map((acc) => acc.item || acc)
        .join(", ");
      parts.push(`adorned with ${accessoryText}`);
    }

    if (elements.environment) {
      parts.push(elements.environment);
    }

    if (elements.lighting) {
      parts.push(`with ${elements.lighting}`);
    }

    // Always add style and camera at the end
    if (elements.style) {
      parts.push(`rendered in ${elements.style}`);
    }

    if (elements.camera) {
      parts.push(`captured in ${elements.camera}`);
    }

    // Join all parts with proper grammar
    return this._formatFinalPrompt(parts);
  }

  // Format final prompt with proper grammar
  _formatFinalPrompt(parts) {
    if (parts.length === 0) return "";

    // Clean up and join parts
    const cleanParts = parts
      .filter((part) => part && part.trim().length > 0)
      .map((part) => part.trim())
      .map((part) => (part.endsWith(",") ? part.slice(0, -1) : part));

    if (cleanParts.length === 1) {
      return cleanParts[0];
    }

    // Join with commas and proper final conjunction
    const finalPart = cleanParts.pop();
    return cleanParts.join(", ") + ", " + finalPart;
  }

  // Get list of available templates
  getAvailableTemplates() {
    return Object.keys(this.templates).map((key) => ({
      key: key,
      name: this.templates[key]?.name || key,
      description:
        this.templates[key]?.description || "No description available",
    }));
  }

  // Get template details
  getTemplateDetails(templateName) {
    return this.templates[templateName] || null;
  }

  // Check if engine is ready
  isReady() {
    return this.dataManager.isLoaded() && this.loadedTemplates;
  }
}

export default TemplateEngine;
