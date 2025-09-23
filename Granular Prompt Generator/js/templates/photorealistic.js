export const PhotorealisticTemplate = {
  name: "Photorealistic",
  description: "Professional photography with realistic lighting and natural poses",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 1.0 },
    bodyType: { required: true, weight: 0.9 },
    hairStyle: { required: true, weight: 1.0 },
    hairColor: { required: true, weight: 1.0 },
    skinTone: { required: true, weight: 0.8 },
    clothing: { required: true, weight: 1.0 },
    accessories: { 
      required: false, 
      probability: 0.25,  // 25% chance
      maxItems: 1         // Maximum 1 accessory to keep realistic
    },
    environment: { required: true, weight: 0.9 },
    lighting: { required: true, weight: 1.0 },
    style: { required: true, weight: 1.0 },
    camera: { required: true, weight: 1.0 }
  },
  
  // Category preferences for realistic photography
  preferences: {
    subjects: {
      preferred: ["basic_subjects", "age_variations"],
      avoid: ["personality_hints"] // Keep subject descriptions simple
    },
    bodyTypes: {
      preferred: ["elegant_builds", "athletic_builds", "curvy_figures"],
      avoid: ["casual_demeanor"] // Focus on physical descriptions
    },
    expressions: {
      preferred: ["elegant_moods", "contemplative_moods", "confident_moods"],
      avoid: ["mysterious_moods", "nostalgic_moods"]
    },
    hairStyles: {
      preferred: ["modern_casual", "fantasy_elegant"],
      avoid: ["edgy_futuristic"] // Keep hair realistic
    },
    hairColors: {
      preferred: ["natural_bases", "natural_modifiers"],
      avoid: ["fantasy_bases"] // Natural hair colors only
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones", "deep_tones"],
      weight: "all_equal" // Equal representation
    },
    clothing: {
      preferred: ["modern_realistic", "fashion_portrait"],
      avoid: ["carnival_fantasy", "cultural_traditional"]
    },
    clothingColors: {
      preferred: ["neutral_bases", "earth_tones", "cool_colors", "warm_colors"],
      avoid: ["vibrant_colors", "metallic_tones"]
    },
    accessories: {
      jewelry: 0.7,        // Most likely accessory
      headwear: 0.2,       // Minimal headwear
      handheld: 0.1,       // Rare handheld items
      eyewear: 0.3         // Some eyewear for style
    },
    environments: {
      preferred: ["urban", "natural"],
      avoid: ["fantasy"] // Realistic settings only
    },
    lighting: {
      preferred: ["natural_lighting", "studio_lighting", "soft_lighting"],
      avoid: ["colored_lighting", "dramatic_lighting"]
    },
    artStyles: {
      preferred: ["photorealistic_styles", "photography_types"],
      avoid: ["anime_manga_styles", "cartoon_styles"]
    },
    camera: {
      preferred: ["portrait_shots", "shooting_styles"],
      focus: ["shallow_depth_of_field", "professional_quality"]
    }
  },
  
  // Output structure for photorealistic prompts
  promptStructure: [
    "subject + bodyType",
    "hairStyle + hairColor", 
    "skinTone + qualities",
    "clothing + colors + fit",
    "accessories (if selected)",
    "environment + atmosphere",
    "lighting + mood",
    "artStyle + camera + technical"
  ],
  
  // Special rules for photorealistic template
  rules: {
    // Ensure natural color coordination
    colorHarmony: true,
    
    // Prefer natural makeup and styling
    naturalStyling: true,
    
    // Technical photography terms
    includeTechnical: true,
    
    // Realistic proportions and features
    realisticFeatures: true,
    
    // Professional quality descriptors
    professionalQuality: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A young woman with an elegant and graceful figure, wearing her hair in sleek shoulder-length waves with rich chestnut color, smooth golden skin with warm undertones, wearing a fitted silk blouse with tailored trousers, delicate gold jewelry, in a modern urban setting with natural window lighting, captured in photorealistic style with 85mm portrait lens and shallow depth of field",
    
    "A confident lady with athletic and agile build, styled with flowing long layers in deep auburn hair, luminous fair skin with rosy undertones, wearing an elegant wrap dress in navy silk, minimalist silver accessories, photographed in a sophisticated studio setting with soft professional lighting, shot with portrait photography style and high-resolution detail"
  ]
};