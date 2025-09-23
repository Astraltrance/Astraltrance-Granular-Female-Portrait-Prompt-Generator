export const Pixar3DTemplate = {
  name: "Pixar 3D",
  description: "3D character design with appealing features, optimistic colors, and polished rendering",
  
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
      probability: 0.35,  // 35% chance - moderate accessories
      maxItems: 2         // Up to 2 accessories for character appeal
    },
    environment: { required: true, weight: 0.9 },
    lighting: { required: true, weight: 1.0 },
    style: { required: true, weight: 1.0 },
    camera: { required: true, weight: 0.8 }
  },
  
  // Category preferences for Pixar 3D style
  preferences: {
    subjects: {
      preferred: ["basic_subjects", "personality_hints"],
      avoid: [] // All subject types work for 3D characters
    },
    bodyTypes: {
      preferred: ["elegant_builds", "petite_builds", "casual_demeanor"],
      avoid: [] // Pixar works with all body types
    },
    expressions: {
      preferred: ["energetic_moods", "confident_moods", "wonder_moods", "elegant_moods"],
      avoid: ["mysterious_moods"] // Pixar is more optimistic
    },
    hairStyles: {
      preferred: ["modern_casual", "fantasy_elegant"],
      avoid: ["edgy_futuristic", "vintage_retro"] // Clean, appealing styles
    },
    hairColors: {
      preferred: ["natural_bases", "natural_modifiers", "warm_colors"],
      avoid: ["vibrant_colors"] // More natural but appealing colors
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones", "deep_tones"],
      weight: "all_equal" // Equal representation in 3D
    },
    clothing: {
      preferred: ["modern_realistic", "casual_styles"],
      avoid: ["carnival_fantasy", "historical_vintage"] // Contemporary appeal
    },
    clothingColors: {
      preferred: ["warm_colors", "cool_colors", "pastel_tones", "neutral_bases"],
      avoid: ["metallic_tones"] // Appealing, friendly colors
    },
    accessories: {
      jewelry: 0.4,        // Simple, appealing jewelry
      headwear: 0.6,       // Hats and hair accessories work well
      handheld: 0.5,       // Props enhance character
      eyewear: 0.3         // Stylish but not overwhelming
    },
    environments: {
      preferred: ["natural", "urban"],
      avoid: ["fantasy"] // Realistic but appealing settings
    },
    lighting: {
      preferred: ["soft_lighting", "natural_lighting", "warm_lighting"],
      avoid: ["dramatic_lighting", "colored_lighting"] // Friendly, appealing lighting
    },
    artStyles: {
      preferred: ["cartoon_styles", "digital_art_styles"],
      avoid: ["photorealistic_styles", "painting_styles"]
    },
    camera: {
      preferred: ["portrait_shots", "three_quarter_shot", "full_body_shot"],
      focus: ["smooth_rendering", "polished_finish", "appealing"]
    }
  },
  
  // Output structure for Pixar 3D prompts
  promptStructure: [
    "subject + personality",
    "bodyType + appealing build",
    "hairStyle + natural color", 
    "skinTone + healthy glow",
    "clothing + friendly colors",
    "accessories (if selected)",
    "environment + optimistic atmosphere",
    "lighting + warm mood",
    "3D style + smooth rendering"
  ],
  
  // Special rules for Pixar 3D template
  rules: {
    // Appealing, friendly character design
    appealingFeatures: true,
    
    // Optimistic color palette
    optimisticColors: true,
    
    // Smooth, polished 3D rendering
    smoothRendering: true,
    
    // Character-focused design
    characterFocus: true,
    
    // Family-friendly aesthetic
    familyFriendly: true,
    
    // Clean, professional 3D quality
    professionalQuality: true,
    
    // Avoid overly complex details
    simplifiedDetails: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A cheerful young woman with graceful and elegant stance, wearing her hair in soft cascading curls with warm chestnut brown color, smooth golden skin with healthy glow, wearing a casual cotton blouse in soft blue with comfortable fit, simple gold jewelry and a stylish hat, in a sunny natural park setting with gentle warm lighting, rendered in Pixar-style 3D animation with smooth rendering and appealing character design",
    
    "A confident girl with petite and delicate frame and playful energy, styled with shoulder-length wavy hair in honey blonde, radiant fair skin with natural texture, wearing a modern cardigan over casual dress in pastel colors, carrying a small handbag and wearing delicate accessories, in a contemporary urban plaza with soft natural lighting and optimistic atmosphere, created in 3D character style with polished finish and family-friendly appeal"
  ]
};