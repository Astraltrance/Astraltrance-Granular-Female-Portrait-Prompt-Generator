export const AnimeMangaTemplate = {
  name: "Anime/Manga",
  description: "Japanese animation and manga illustration style with vibrant colors and expressive features",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 1.0 },
    bodyType: { required: true, weight: 0.8 },
    hairStyle: { required: true, weight: 1.0 },
    hairColor: { required: true, weight: 1.0 },
    skinTone: { required: false, weight: 0.6 }, // Less emphasis on skin detail
    clothing: { required: true, weight: 1.0 },
    accessories: { 
      required: false, 
      probability: 0.45,  // 45% chance - anime loves accessories
      maxItems: 2         // Up to 2 accessories for anime style
    },
    environment: { required: true, weight: 0.8 },
    lighting: { required: true, weight: 0.9 },
    style: { required: true, weight: 1.0 },
    camera: { required: true, weight: 0.7 }
  },
  
  // Category preferences for anime/manga style
  preferences: {
    subjects: {
      preferred: ["basic_subjects", "personality_hints"],
      avoid: [] // All subject types work for anime
    },
    bodyTypes: {
      preferred: ["elegant_builds", "petite_builds", "casual_demeanor"],
      avoid: ["athletic_builds"] // Less emphasis on muscular builds
    },
    expressions: {
      preferred: ["energetic_moods", "confident_moods", "wonder_moods"],
      avoid: ["contemplative_moods"] // Anime is more expressive
    },
    hairStyles: {
      preferred: ["fantasy_elegant", "edgy_futuristic", "modern_casual"],
      avoid: ["vintage_retro"] // Modern anime styling
    },
    hairColors: {
      preferred: ["fantasy_bases", "natural_bases", "highlight_colors"],
      avoid: [] // All colors welcome in anime
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones"],
      avoid: [] // Anime style works with all tones
    },
    clothing: {
      preferred: ["modern_realistic", "cultural_traditional", "fantasy_carnival"],
      avoid: ["historical_vintage"] // Contemporary or fantastical
    },
    clothingColors: {
      preferred: ["vibrant_colors", "cool_colors", "pastel_tones"],
      avoid: ["earth_tones"] // Bright, vibrant anime colors
    },
    accessories: {
      jewelry: 0.6,        // Stylish anime jewelry
      headwear: 0.5,       // Hair accessories popular
      handheld: 0.3,       // Anime props and items
      eyewear: 0.4         // Stylish glasses/contacts
    },
    environments: {
      preferred: ["urban", "fantasy", "natural"],
      avoid: ["historical"] // Modern or fantastical settings
    },
    lighting: {
      preferred: ["colored_lighting", "soft_lighting", "dramatic_lighting"],
      avoid: ["studio_lighting"] // More artistic lighting
    },
    artStyles: {
      preferred: ["anime_manga_styles", "digital_art_styles"],
      avoid: ["photorealistic_styles", "vintage_styles"]
    },
    camera: {
      preferred: ["portrait_shots", "dynamic_angle", "artistic_effects"],
      focus: ["vibrant_palette", "clean_style", "stylized"]
    }
  },
  
  // Output structure for anime/manga prompts
  promptStructure: [
    "subject + personality",
    "bodyType + demeanor",
    "hairStyle + hairColor + effects", 
    "clothing + vibrant colors",
    "accessories (if selected)",
    "environment + atmosphere",
    "lighting + mood effects",
    "anime style + camera angle"
  ],
  
  // Special rules for anime/manga template
  rules: {
    // Vibrant, saturated colors
    vibrantColors: true,
    
    // Stylized proportions acceptable
    stylizedFeatures: true,
    
    // Fantasy elements encouraged
    fantasyElements: true,
    
    // Expressive poses and angles
    expressivePoses: true,
    
    // Clean, polished anime aesthetic
    cleanStyle: true,
    
    // Creative color combinations
    creativeColors: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A spirited young girl with petite and delicate frame, wearing her hair in long flowing layers with vibrant electric blue color and silver highlights, in a modern school uniform with bright colors and playful details, wearing stylish headband and colorful accessories, in a contemporary urban setting with neon lighting and dramatic shadows, rendered in anime style with dynamic camera angle and cel-shaded finish",
    
    "A confident young woman with graceful and elegant stance, styled with elaborate updo in rose gold hair with rainbow streaks, wearing a flowing kimono-style dress in pastel colors with geometric patterns, delicate jewelry and hair ornaments, in a magical garden setting with soft colored lighting and ethereal atmosphere, illustrated in manga style with clean lines and vibrant palette"
  ]
};