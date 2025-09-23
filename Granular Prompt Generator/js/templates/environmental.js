export const EnvironmentalTemplate = {
  name: "Environmental",
  description: "Rich environment descriptions with atmospheric conditions and setting-appropriate styling",
  
  // Element selection probabilities and requirements
  elements: {
    subject: { required: true, weight: 0.8 },
    bodyType: { required: true, weight: 0.7 },
    hairStyle: { required: true, weight: 0.8 },
    hairColor: { required: true, weight: 0.7 },
    skinTone: { required: false, weight: 0.6 },
    clothing: { required: true, weight: 0.9 }, // Setting-appropriate clothing
    accessories: { 
      required: false, 
      probability: 0.3,   // 30% chance - environment is the focus
      maxItems: 2         // Minimal accessories to not distract from setting
    },
    environment: { required: true, weight: 1.0 }, // MAXIMUM focus on environment
    lighting: { required: true, weight: 1.0 },     // Essential for atmosphere
    style: { required: true, weight: 0.8 },
    camera: { required: true, weight: 0.9 }
  },
  
  // Category preferences for environmental template
  preferences: {
    subjects: {
      preferred: ["basic_subjects"],
      avoid: ["personality_hints"] // Subject supports the environment
    },
    bodyTypes: {
      preferred: ["elegant_builds", "graceful_builds", "natural_posture"],
      avoid: ["dramatic_posture"] // Natural, harmonious with setting
    },
    expressions: {
      preferred: ["contemplative_moods", "serene_moods", "peaceful_moods", "wonder_moods"],
      avoid: ["confident_moods"] // Mood matches environment
    },
    hairStyles: {
      preferred: ["natural_styles", "flowing_styles", "setting_appropriate"],
      avoid: ["highly_styled"] // Hair that works with environment
    },
    hairColors: {
      preferred: ["natural_bases", "natural_modifiers", "environment_harmonious"],
      avoid: ["fantasy_bases"] // Colors that blend with setting
    },
    skinTones: {
      preferred: ["light_tones", "medium_tones", "deep_tones"],
      weight: "environment_appropriate" // Matching lighting conditions
    },
    clothing: {
      preferred: ["setting_appropriate", "natural_materials", "environmental_harmony"],
      avoid: ["high_fashion"] // Clothing that fits the environment
    },
    clothingColors: {
      preferred: ["earth_tones", "natural_colors", "environment_complementary"],
      avoid: ["neon_colors", "clashing_tones"] // Colors that harmonize
    },
    accessories: {
      jewelry: 0.4,        // Natural, simple jewelry
      headwear: 0.5,       // Environment-appropriate hats/scarves
      handheld: 0.6,       // Props that enhance the setting story
      eyewear: 0.2         // Minimal unless setting-appropriate
    },
    environments: {
      preferred: ["natural", "historical", "fantasy", "urban"],
      weight: "maximum_detail" // Rich, detailed environment descriptions
    },
    lighting: {
      preferred: ["natural_lighting", "atmospheric_lighting", "mood_lighting"],
      avoid: ["studio_lighting"] // Lighting that enhances environment
    },
    artStyles: {
      preferred: ["environmental_art", "landscape_art", "atmospheric_art"],
      avoid: ["portrait_focused"] // Style that showcases environment
    },
    camera: {
      preferred: ["environmental_shots", "wide_shots", "contextual_framing"],
      focus: ["atmosphere", "mood", "environmental_storytelling"]
    }
  },
  
  // Output structure for environmental prompts
  promptStructure: [
    "subject + natural presence",
    "bodyType + environmental harmony",
    "hairStyle + natural flow", 
    "clothing + setting-appropriate colors + natural materials",
    "minimal accessories (if selected)",
    "DETAILED environment + rich atmosphere + specific details",
    "environmental lighting + atmospheric effects + mood",
    "style + environmental storytelling + composition"
  ],
  
  // Special rules for environmental template
  rules: {
    // Rich environment descriptions
    detailedEnvironments: true,
    
    // Atmospheric conditions
    atmosphericEffects: true,
    
    // Setting-subject harmony
    environmentalHarmony: true,
    
    // Natural lighting emphasis
    naturalLighting: true,
    
    // Storytelling through setting
    environmentalStorytelling: true,
    
    // Seasonal/time appropriateness
    temporalConsistency: true,
    
    // Minimize distracting elements
    focusOnSetting: true,
    
    // Weather and atmospheric details
    weatherEmphasis: true
  },
  
  // Example combinations this template might generate
  examples: [
    "A young woman with graceful and elegant figure in a moment of quiet contemplation, wearing her hair in soft natural waves flowing in the gentle breeze, dressed in a flowing linen dress in earthy sage green that harmonizes with the surroundings, minimal gold jewelry catching the light, standing in a misty ancient forest grove with towering oak trees and moss-covered stones, dappled golden sunlight filtering through the canopy creating ethereal light beams, scattered wildflowers carpeting the forest floor, captured in natural atmospheric style with environmental storytelling and wide composition showcasing the magical woodland setting",
    
    "A serene lady with natural and peaceful bearing expressing wonder and tranquility, styled with long flowing hair in warm chestnut tones moving softly in the ocean breeze, wearing a simple cotton dress in ocean blue with natural fabric flow, carrying a woven basket and wearing a sun hat, positioned on a dramatic rocky coastline with crashing waves and sea spray, late afternoon golden hour lighting casting warm glows on the weathered cliffs, seabirds circling overhead and distant storm clouds on the horizon, rendered in environmental landscape style with atmospheric perspective and cinematic wide-angle composition that captures the raw power and beauty of the coastal setting"
  ]
};