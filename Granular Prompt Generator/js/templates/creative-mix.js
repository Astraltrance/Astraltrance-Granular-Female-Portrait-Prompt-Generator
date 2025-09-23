export const CreativeMixTemplate = {
  name: "Creative Mix",
  description: "Unexpected combinations encouraging maximum creativity and cross-cultural mixing",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 1.0 },
    bodyType: { required: true, weight: 0.8 },
    hairStyle: { required: true, weight: 1.0 },
    hairColor: { required: true, weight: 1.0 },
    skinTone: { required: true, weight: 0.7 },
    clothing: { required: true, weight: 1.0 },
    accessories: { 
      required: false, 
      probability: 0.55,  // 55% chance - creative accessories encouraged
      maxItems: 3         // Up to 3 for maximum creative combinations
    },
    environment: { required: true, weight: 0.9 },
    lighting: { required: true, weight: 0.8 },
    style: { required: true, weight: 1.0 },
    camera: { required: true, weight: 0.7 }
  },
  
  // Category preferences for creative mix template
  preferences: {
    subjects: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [], // No restrictions - maximum creativity
      mixing: "encouraged"
    },
    bodyTypes: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      mixing: "unlimited"
    },
    expressions: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      contrasts: "welcomed" // Unexpected mood combinations
    },
    hairStyles: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      crossCultural: "encouraged", // Mix cultural styles freely
      anachronistic: "welcomed"    // Mix time periods
    },
    hairColors: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      fantasyRealism: "mixed", // Fantasy colors with realistic styles
      unexpected: "bonus"
    },
    skinTones: {
      preferred: ["ALL_CATEGORIES"],
      weight: "creative_freedom" // Any tone with any style
    },
    clothing: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      culturalFusion: "maximum",     // Mix cultures freely
      periodMixing: "encouraged",    // Mix historical periods
      styleClashing: "creative"      // Intentional style contrasts
    },
    clothingColors: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      unexpectedCombos: "bonus",     // Reward unusual combinations
      ruleBreaking: "encouraged"
    },
    accessories: {
      jewelry: 0.6,        // Creative jewelry mixing
      headwear: 0.7,       // Cultural headwear mixing encouraged
      handheld: 0.5,       // Anachronistic props welcomed
      eyewear: 0.4,        // Unexpected eyewear combinations
      crossCultural: "maximum"
    },
    environments: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      anachronistic: "welcomed",     // Modern person in historical setting
      culturalMixing: "encouraged",  // Asian architecture + Western clothing
      fantasyRealism: "blended"      // Fantasy + realistic elements
    },
    lighting: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      mixedSources: "creative",      // Mix different lighting types
      unexpected: "bonus"
    },
    artStyles: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      styleFusion: "maximum",        // Mix anime + photorealistic
      crossGenre: "encouraged"
    },
    camera: {
      preferred: ["ALL_CATEGORIES"],
      avoid: [],
      experimentalAngles: "welcomed"
    }
  },
  
  // Output structure for creative mix prompts
  promptStructure: [
    "subject + unexpected personality",
    "bodyType + creative expression",
    "hairStyle + surprising color combinations", 
    "clothing + cross-cultural fusion + period mixing",
    "creative accessories ensemble (if selected)",
    "environment + anachronistic elements",
    "lighting + artistic interpretation",
    "style fusion + experimental techniques"
  ],
  
  // Special rules for creative mix template
  rules: {
    // Encourage unexpected combinations
    unexpectedCombinations: true,
    
    // No cultural restrictions
    culturalFreedom: "maximum",
    
    // Time period mixing encouraged
    anachronisticFreedom: true,
    
    // Style fusion welcomed
    styleFusion: true,
    
    // Creative color clashing
    creativeClashing: true,
    
    // Fantasy + reality blending
    fantasyRealismBlend: true,
    
    // Intentional contrasts
    intentionalContrasts: true,
    
    // Maximum creative freedom
    creativeBonus: true,
    
    // Rule-breaking encouraged
    ruleBreaking: "creative",
    
    // "Asian girl + cowboy hat" philosophy
    culturalMixingBonus: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A spirited young Asian woman with petite and graceful build expressing confident mystery, wearing her hair in traditional Japanese geisha-inspired updo with vibrant electric purple color and golden highlights, radiant olive skin with natural glow, dressed in a modern leather motorcycle jacket over a flowing silk kimono in neon pink with geometric patterns, accessorized with a vintage cowboy hat, steampunk goggles, and traditional pearl jewelry, standing in a futuristic cyberpunk street with ancient Japanese temple architecture and holographic cherry blossoms, illuminated by neon lighting mixed with soft candlelight, captured in anime-photorealistic fusion style with dynamic low-angle shot and experimental composition",
    
    "A mysterious lady with athletic and powerful bearing showing playful elegance, styled with elaborate Victorian ringlets in iridescent rainbow colors with metallic streaks, smooth deep mahogany skin with luminous highlights, wearing a medieval corset over modern ripped jeans with a flowing African kente cloth cape, carrying a vintage camera and wearing futuristic AR glasses with traditional gold bangles, positioned in a Renaissance palace courtyard filled with floating holographic butterflies and LED strip lighting, shot during magical blue hour with dramatic chiaroscuro mixed with neon glow, rendered in oil painting style with digital glitch effects and creative rule-breaking composition that celebrates maximum cultural fusion and temporal mixing"
  ],
  
  // Creative combination encouragements
  creativeBonuses: [
    "Asian + Western elements",
    "Historical + Futuristic",
    "Traditional + Modern",
    "Fantasy + Realistic", 
    "Elegant + Edgy",
    "Cultural + Contemporary",
    "Period + Anachronistic",
    "Natural + Synthetic",
    "Classical + Digital",
    "Organic + Technological"
  ]
};