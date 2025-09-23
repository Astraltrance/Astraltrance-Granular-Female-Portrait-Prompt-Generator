export const ArtisticPaintingTemplate = {
  name: "Artistic Painting",
  description: "Fine art painting styles with brush techniques, artistic mediums, and classical composition",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 1.0 },
    bodyType: { required: true, weight: 0.8 },
    hairStyle: { required: true, weight: 1.0 },
    hairColor: { required: true, weight: 0.9 },
    skinTone: { required: true, weight: 0.9 },
    clothing: { required: true, weight: 1.0 },
    accessories: { 
      required: false, 
      probability: 0.4,   // 40% chance - artistic accessories
      maxItems: 2         // Classical painting accessories
    },
    environment: { required: true, weight: 1.0 },
    lighting: { required: true, weight: 1.0 },
    style: { required: true, weight: 1.0 },
    camera: { required: false, weight: 0.5 } // Less camera focus, more composition
  },
  
  // Category preferences for artistic painting style
  preferences: {
    subjects: {
      preferred: ["basic_subjects", "age_variations"],
      avoid: ["personality_hints"] // Classical portraiture approach
    },
    bodyTypes: {
      preferred: ["elegant_builds", "graceful_builds", "poised_bearing"],
      avoid: ["casual_demeanor"] // Formal artistic poses
    },
    expressions: {
      preferred: ["contemplative_moods", "elegant_moods", "serene_moods", "nostalgic_moods"],
      avoid: ["energetic_moods"] // Classical painting moods
    },
    hairStyles: {
      preferred: ["fantasy_elegant", "vintage_retro", "cultural_traditional"],
      avoid: ["edgy_futuristic"] // Timeless, artistic styles
    },
    hairColors: {
      preferred: ["natural_bases", "natural_modifiers", "warm_colors"],
      avoid: ["fantasy_bases"] // Classical painting colors
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones", "deep_tones"],
      weight: "artistic_representation" // Artistic interpretation
    },
    clothing: {
      preferred: ["historical_vintage", "cultural_traditional", "elegant_formal"],
      avoid: ["modern_realistic"] // Timeless, artistic clothing
    },
    clothingColors: {
      preferred: ["earth_tones", "warm_colors", "deep_colors", "neutral_bases"],
      avoid: ["vibrant_colors", "neon_colors"] // Classical palette
    },
    accessories: {
      jewelry: 0.7,        // Classical jewelry common in paintings
      headwear: 0.5,       // Period hats and hair accessories
      handheld: 0.6,       // Books, flowers, artistic props
      eyewear: 0.1         // Rare in classical paintings
    },
    environments: {
      preferred: ["historical", "natural", "fantasy"],
      avoid: ["urban"] // Timeless, artistic settings
    },
    lighting: {
      preferred: ["natural_lighting", "dramatic_lighting", "soft_lighting"],
      avoid: ["colored_lighting", "neon_lighting"] // Classical lighting
    },
    artStyles: {
      preferred: ["painting_styles", "artistic_movements", "classical_techniques"],
      avoid: ["photorealistic_styles", "digital_art_styles"]
    },
    camera: {
      preferred: ["classical_composition", "portrait_framing"],
      focus: ["artistic_technique", "brushwork", "color_harmony"]
    }
  },
  
  // Output structure for artistic painting prompts
  promptStructure: [
    "subject + classical bearing",
    "bodyType + elegant pose",
    "hairStyle + natural color + artistic light", 
    "skinTone + artistic rendering",
    "clothing + classical colors + period details",
    "accessories (if selected)",
    "environment + atmospheric mood",
    "lighting + artistic effect",
    "painting style + technique + composition"
  ],
  
  // Special rules for artistic painting template
  rules: {
    // Classical color harmony
    classicalHarmony: true,
    
    // Artistic brush techniques
    brushTechniques: true,
    
    // Timeless, non-contemporary elements
    timelessElements: true,
    
    // Compositional focus
    artisticComposition: true,
    
    // Rich, painterly textures
    painterlyTextures: true,
    
    // Historical art movement influence
    artMovementStyle: true,
    
    // Avoid modern technology references
    avoidModernTech: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A young woman with elegant and graceful figure captured in a moment of quiet contemplation, wearing her hair in an elaborate updo with rich chestnut brown color catching soft natural light, luminous fair skin with delicate artistic rendering, wearing a flowing renaissance gown in deep burgundy velvet with golden embroidery, delicate pearl necklace and ornate hair comb, in a classical garden setting with dappled sunlight and serene atmosphere, painted in oil painting style with impressionist brushwork and warm color harmony",
    
    "A lady with poised and regal bearing expressing serene elegance, styled with soft cascading waves in warm auburn hair with golden highlights, smooth olive skin with artistic luminosity, wearing a draped classical dress in earth tones with flowing fabric, carrying a bouquet of flowers and wearing simple gold jewelry, in a romantic landscape with natural lighting and peaceful mood, rendered in watercolor style with soft brushstrokes and classical composition"
  ]
};