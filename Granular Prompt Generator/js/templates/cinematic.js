export const CinematicTemplate = {
  name: "Cinematic",
  description: "Dramatic movie-like compositions with professional cinematography and visual storytelling",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 1.0 },
    bodyType: { required: true, weight: 0.9 },
    hairStyle: { required: true, weight: 0.9 },
    hairColor: { required: true, weight: 0.8 },
    skinTone: { required: true, weight: 0.8 },
    clothing: { required: true, weight: 1.0 },
    accessories: { 
      required: false, 
      probability: 0.4,   // 40% chance - cinematic props
      maxItems: 2         // Dramatic accessories that enhance story
    },
    environment: { required: true, weight: 1.0 },
    lighting: { required: true, weight: 1.0 }, // Critical for cinematic mood
    style: { required: true, weight: 1.0 },
    camera: { required: true, weight: 1.0 }    // Essential for cinematic composition
  },
  
  // Category preferences for cinematic template
  preferences: {
    subjects: {
      preferred: ["basic_subjects", "personality_hints"],
      avoid: [] // All subjects work for cinematic storytelling
    },
    bodyTypes: {
      preferred: ["elegant_builds", "confident_posture", "dramatic_presence"],
      avoid: ["casual_demeanor"] // Cinematic requires presence
    },
    expressions: {
      preferred: ["dramatic_moods", "mysterious_moods", "intense_moods", "confident_moods"],
      avoid: ["casual_moods"] // Cinematic drama
    },
    hairStyles: {
      preferred: ["dramatic_styles", "flowing_styles", "cinematic_styling"],
      avoid: ["casual_styles"] // Hair that enhances drama
    },
    hairColors: {
      preferred: ["dramatic_colors", "natural_bases", "striking_contrasts"],
      avoid: ["pastel_colors"] // Colors with visual impact
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones", "deep_tones"],
      weight: "dramatic_lighting" // Skin that works with dramatic lighting
    },
    clothing: {
      preferred: ["dramatic_clothing", "period_appropriate", "story_enhancing"],
      avoid: ["casual_everyday"] // Clothing that supports narrative
    },
    clothingColors: {
      preferred: ["dramatic_colors", "rich_tones", "high_contrast"],
      avoid: ["muted_pastels"] // Colors with cinematic impact
    },
    accessories: {
      jewelry: 0.6,        // Statement pieces for drama
      headwear: 0.4,       // Dramatic hats, veils
      handheld: 0.7,       // Cinematic props and objects
      eyewear: 0.3         // Sunglasses, dramatic eyewear
    },
    environments: {
      preferred: ["dramatic_settings", "atmospheric_locations", "story_appropriate"],
      weight: "cinematic_impact" // Settings that enhance narrative
    },
    lighting: {
      preferred: ["dramatic_lighting", "cinematic_lighting", "high_contrast"],
      avoid: ["flat_lighting"] // Lighting that creates mood and drama
    },
    artStyles: {
      preferred: ["cinematic_style", "film_inspired", "dramatic_realism"],
      avoid: ["casual_photography"] // Cinematic visual language
    },
    camera: {
      preferred: ["cinematic_shots", "dramatic_angles", "professional_cinematography"],
      focus: ["visual_storytelling", "dramatic_composition", "film_techniques"]
    }
  },
  
  // Output structure for cinematic prompts
  promptStructure: [
    "subject + dramatic presence",
    "bodyType + commanding bearing",
    "hairStyle + cinematic styling", 
    "clothing + story-appropriate colors + dramatic fit",
    "atmospheric accessories (if selected)",
    "dramatic environment + cinematic atmosphere",
    "professional lighting + mood enhancement + shadows",
    "cinematic style + camera techniques + visual storytelling"
  ],
  
  // Special rules for cinematic template
  rules: {
    // Dramatic visual impact
    dramaticImpact: true,
    
    // Professional cinematography
    cinematicTechniques: true,
    
    // Visual storytelling
    visualNarrative: true,
    
    // High contrast lighting
    dramaticLighting: true,
    
    // Atmospheric mood
    atmosphericMood: true,
    
    // Professional film quality
    filmQuality: true,
    
    // Dynamic composition
    dynamicComposition: true,
    
    // Emotional resonance
    emotionalImpact: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A mysterious young woman with commanding and dramatic presence, wearing her hair in flowing dark waves that catch the wind dramatically, luminous pale skin with striking contrast against deep shadows, dressed in a flowing black coat with dramatic silhouette and rich fabric texture, wearing statement silver jewelry and carrying an antique pocket watch, standing on a fog-covered bridge at twilight with atmospheric mist swirling around ancient stone arches, illuminated by dramatic chiaroscuro lighting with golden streetlamps creating pools of warm light against deep blue shadows, captured in cinematic style with low-angle shot and professional film techniques emphasizing visual storytelling and emotional atmosphere",
    
    "A confident lady with elegant and powerful bearing expressing intense determination, styled with sleek pulled-back hair in rich mahogany with dramatic styling, radiant olive skin with cinematic lighting enhancing her features, wearing a tailored burgundy dress with structured silhouette and luxury fabric details, accessorized with bold gold jewelry and designer sunglasses, positioned in a dramatic urban setting with towering glass buildings and reflected city lights, shot during golden hour with high-contrast lighting creating dramatic shadows and warm highlights, rendered in cinematic realism style with dynamic camera angle and professional cinematography techniques that emphasize dramatic composition and visual impact"
  ]
};