export const FashionPortraitTemplate = {
  name: "Fashion Portrait",
  description: "High-fashion photography focused on clothing, styling, and sophisticated aesthetics",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 1.0 },
    bodyType: { required: true, weight: 1.0 },
    hairStyle: { required: true, weight: 1.0 },
    hairColor: { required: true, weight: 0.9 },
    skinTone: { required: true, weight: 0.8 },
    clothing: { required: true, weight: 1.0 }, // MAXIMUM focus on clothing
    accessories: { 
      required: false, 
      probability: 0.65,  // 65% chance - fashion loves accessories
      maxItems: 3         // Up to 3 accessories for complete styling
    },
    environment: { required: true, weight: 0.8 },
    lighting: { required: true, weight: 1.0 },
    style: { required: true, weight: 1.0 },
    camera: { required: true, weight: 0.9 }
  },
  
  // Category preferences for fashion portrait style
  preferences: {
    subjects: {
      preferred: ["basic_subjects", "age_variations"],
      avoid: ["personality_hints"] // Focus on the fashion, not personality
    },
    bodyTypes: {
      preferred: ["elegant_builds", "statuesque_builds", "confident_posture"],
      avoid: ["casual_demeanor"] // Fashion requires poise
    },
    expressions: {
      preferred: ["confident_moods", "elegant_moods", "sophisticated_moods"],
      avoid: ["contemplative_moods", "energetic_moods"] // Fashion-focused mood
    },
    hairStyles: {
      preferred: ["modern_casual", "fantasy_elegant", "professional_styling"],
      avoid: ["cultural_traditional"] // Contemporary fashion styling
    },
    hairColors: {
      preferred: ["natural_bases", "fashion_colors", "highlights"],
      avoid: [] // All colors work in fashion
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones", "deep_tones"],
      weight: "all_equal" // Fashion represents everyone
    },
    clothing: {
      preferred: ["modern_realistic", "high_fashion", "designer_pieces", "formal_wear"],
      avoid: ["casual_wear"] // High-fashion focus
    },
    clothingColors: {
      preferred: ["neutral_bases", "metallic_tones", "monochromatic", "bold_colors"],
      avoid: ["earth_tones"] // Fashion-forward colors
    },
    accessories: {
      jewelry: 0.8,        // Essential for fashion
      headwear: 0.4,       // Stylish hats and accessories
      handheld: 0.5,       // Designer bags, fashion props
      eyewear: 0.6         // Sunglasses, designer frames
    },
    environments: {
      preferred: ["urban", "studio", "architectural"],
      avoid: ["natural", "fantasy"] // Fashion-appropriate settings
    },
    lighting: {
      preferred: ["studio_lighting", "dramatic_lighting", "professional_lighting"],
      avoid: ["natural_lighting"] // Controlled fashion lighting
    },
    artStyles: {
      preferred: ["photography_types", "fashion_photography", "editorial_style"],
      avoid: ["painting_styles", "cartoon_styles"]
    },
    camera: {
      preferred: ["fashion_shots", "editorial_style", "high_fashion"],
      focus: ["sharp_detail", "texture_emphasis", "fabric_detail"]
    }
  },
  
  // Output structure for fashion portrait prompts
  promptStructure: [
    "subject + confident bearing",
    "bodyType + statuesque pose",
    "hairStyle + fashion styling", 
    "skinTone + flawless finish",
    "DETAILED clothing + luxury fabrics + perfect fit",
    "coordinated accessories ensemble",
    "fashion environment + sophisticated atmosphere",
    "professional lighting + dramatic shadows",
    "editorial photography style + technical precision"
  ],
  
  // Special rules for fashion portrait template
  rules: {
    // Detailed clothing descriptions
    detailedClothing: true,
    
    // Luxury fabric emphasis
    luxuryMaterials: true,
    
    // Color coordination essential
    colorCoordination: true,
    
    // Professional styling
    professionalStyling: true,
    
    // Editorial quality
    editorialQuality: true,
    
    // Designer aesthetic
    designerAesthetic: true,
    
    // Technical precision
    technicalPrecision: true,
    
    // Fabric and texture details
    fabricFocus: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A confident young woman with statuesque and commanding presence, wearing her hair in a sleek sophisticated updo with glossy black color and professional styling, flawless golden skin with luminous finish, wearing a tailored designer blazer in charcoal gray wool with structured shoulders over a silk camisole, coordinated with statement gold jewelry, designer sunglasses, and a luxury leather handbag, photographed in a modern urban setting with dramatic professional lighting and architectural backdrop, captured in editorial fashion photography style with sharp detail emphasis on fabric textures and precise styling",
    
    "An elegant lady with refined and poised bearing, styled with voluminous blown-out hair in rich chestnut with golden highlights, radiant fair skin with flawless coverage, wearing a flowing designer gown in midnight blue silk with intricate draping and metallic threading, accessorized with diamond jewelry, delicate evening clutch, and elegant heels, in a sophisticated studio setting with controlled dramatic lighting and high-contrast shadows, shot in high-fashion editorial style with technical precision and luxury aesthetic focus"
  ]
};