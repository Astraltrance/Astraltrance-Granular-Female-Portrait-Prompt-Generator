class PromptGenerator {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
    }

    // Main generation method - UPDATED
    async generatePrompt(preferences = {}) {
        if (!this.dataLoader.isDataLoaded()) {
            await this.dataLoader.loadAllData();
        }

        // Set default settingType if not provided
        preferences.settingType = preferences.settingType || 'natural'; // Default to 'natural'

        // Generate pose based on poseControl preference
        const poseControl = preferences.poseControl || 'medium';
        let pose = '';

        if (poseControl === 'always') {
            pose = this.generatePose();
        } else if (poseControl === 'medium') {
            // 50% chance to include pose
            if (Math.random() < 0.5) {
                pose = this.generatePose();
            }
        }
        // If 'off', pose remains empty string

        // Generate setting to get tree info
        const settingData = this.generateSetting(preferences.settingType) || { description: 'an undefined setting', hasTrees: false };

        const components = {
            subject: this.generateSubject(),
            pose: pose,
            face: this.generateFace(),
            hair: this.generateHairDescription(preferences),
            clothing: this.generateClothing(preferences),
            accessories: this.generateAccessories(preferences),
            camera: '', // Removed camera composition — redundant (this.generateCamera(pose),)
            setting: settingData.description,
            lighting: this.generateLighting(preferences.settingType, settingData.hasTrees),
            artStyle: this.generateArtStyle(preferences.artStyle),
            mood: this.generateMood()
        };

        return this.assemblePrompt(components);
    }

    // Generate subject - ENHANCED
    generateSubject() {
        const ageDescriptor = this.dataLoader.getRandomFrom('subjects.json', 'age_descriptors');
        const subjectType = this.dataLoader.getRandomFrom('subjects.json', 'subject_types');

        return `A ${ageDescriptor} ${subjectType}`;
    }

    generatePose() {
        // Combine all pose categories from poses.json
        const allPoses = [
            ...this.dataLoader.getAllFrom('poses.json', 'standing_poses'),
            ...this.dataLoader.getAllFrom('poses.json', 'sitting_poses'),
            ...this.dataLoader.getAllFrom('poses.json', 'leaning_poses'),
            ...this.dataLoader.getAllFrom('poses.json', 'walking_poses'),
            ...this.dataLoader.getAllFrom('poses.json', 'dynamic_poses')
        ];

        return this.dataLoader.randomChoice(allPoses);
    }

    // NEW: Generate face details
generateFace() {
    const skinTone = this.generateSkinTone();
    const eyeDetails = this.generateEyeDetails();
    
    // Coherent gaze + expression profiles that work together emotionally
    const faceProfiles = [
        // Happy/Joyful profiles
        {
            gaze: 'gazing directly at camera',
            expression: 'with a joyful bright smile'
        },
        {
            gaze: 'glancing over shoulder',
            expression: 'with a subtle knowing smile'
        },
        {
            gaze: 'gazing directly at camera',
            expression: 'with a gentle closed-lip smile'
        },
        
        // Peaceful/Serene profiles
        {
            gaze: 'looking downward demurely',
            expression: 'with a soft peaceful expression'
        },
        {
            gaze: 'gazing into the distance',
            expression: 'with a serene calm expression'
        },
{
    gaze: 'eyes closed peacefully',
    expression: 'with a tranquil expression',
    eyesClosed: true  // NEW FLAG
},
        
        // Confident/Bold profiles
        {
            gaze: 'gazing directly at camera',
            expression: 'with an intense focused expression'
        },
        {
            gaze: 'gazing directly at camera',
            expression: 'with a bold fierce expression'
        },
        {
            gaze: 'gazing directly at camera',
            expression: 'with a slight confident smirk'
        },
        
        // Mysterious/Contemplative profiles
        {
            gaze: 'looking slightly away to the left',
            expression: 'with a mysterious slight smile'
        },
        {
            gaze: 'looking upward thoughtfully',
            expression: 'with a contemplative neutral expression'
        },
        {
            gaze: 'gazing into the distance',
            expression: 'with a pensive expression'
        }
    ];
    
const profile = this.dataLoader.randomChoice(faceProfiles);

// If eyes are closed, don't mention eye color/shape - just say "eyes closed"
if (profile.eyesClosed) {
    return `${skinTone}, ${profile.gaze}, ${profile.expression}`;
} else {
    return `${skinTone}, ${eyeDetails} ${profile.gaze}, ${profile.expression}`;
}
}

    // NEW: Generate skin tone
    generateSkinTone() {
        const toneCategories = ['light_tones', 'medium_tones', 'deep_tones'];
        const category = this.dataLoader.randomChoice(toneCategories);
        const tone = this.dataLoader.getRandomFrom('skin-tones.json', category);
        const quality = this.dataLoader.getRandomFrom('skin-tones.json', 'skin_qualities');

        return `${quality} ${tone} skin`;
    }

    // NEW: Generate eye details
generateEyeDetails() {
    const eyeShapes = [
        'almond-shaped', 'round', 'upturned', 'downturned',
        'hooded', 'deep-set', 'wide-set', 'close-set'
    ];
    const eyeColors = [
        'hazel', 'brown', 'dark brown', 'amber', 'green',
        'blue', 'gray', 'blue-gray', 'green-gray'
    ];

    const shape = this.dataLoader.randomChoice(eyeShapes);
    const color = this.dataLoader.randomChoice(eyeColors);

    // Just return eye shape and color - gaze is now handled in generateFace()
    return `${shape} ${color} eyes`;
}


    // UPDATED: Generate hair with more explicit details
    generateHairDescription(preferences = {}) {
        const length = this.dataLoader.getRandomFrom('hair-styles.json', 'hair_lengths');
        const texture = this.dataLoader.getRandomFrom('hair-styles.json', 'hair_textures');
        const style = this.dataLoader.getRandomFrom('hair-styles.json', 'hair_styles');
        const part = this.dataLoader.getRandomFrom('hair-styles.json', 'hair_parts');

        const hairEffectsChance = preferences.hairEffectsChance || 70;

        // Get base color
        let baseColor;
        if (hairEffectsChance > 80) {
            baseColor = this.dataLoader.getRandomFrom('hair-colors.json', 'fantasy_bases');
        } else if (hairEffectsChance > 50) {
            const categories = ['natural_bases', 'fantasy_bases'];
            const selectedCategory = this.dataLoader.randomChoice(categories);
            baseColor = this.dataLoader.getRandomFrom('hair-colors.json', selectedCategory);
        } else {
            baseColor = this.dataLoader.getRandomFrom('hair-colors.json', 'natural_bases');
        }

        // Get color descriptor - now safe since we removed "soft" from the list
        const colorDescriptor = this.dataLoader.getRandomFrom('hair-colors.json', 'color_descriptors');

        // Build highlight phrase
        let highlightPhrase = '';
        if (Math.random() * 100 < hairEffectsChance) {
            const highlightType = this.dataLoader.getRandomFrom('hair-colors.json', 'highlight_types');
            const highlightColor = this.dataLoader.getRandomFrom('hair-colors.json', 'highlight_colors');

            const techniqueInclusive = ['highlights', 'lowlights', 'babylights', 'balayage', 'ombre', 'gradient'];
            const needsTechnique = !techniqueInclusive.includes(highlightType);

            if (needsTechnique) {
                highlightPhrase = ` with ${highlightColor} ${highlightType} highlights`;
            } else {
                highlightPhrase = ` with ${highlightColor} ${highlightType}`;
            }
        }

        return `${length} ${colorDescriptor} ${baseColor} hair${highlightPhrase} in ${texture} texture styled in ${style} with ${part}`;
    }

    // UPDATED: Generate clothing with explicit details
    // UPDATED: Generate clothing with optional complete outfit mode
    generateClothing(preferences = {}) {
        const stylePreference = preferences.clothingStyle;
        const outfitCompleteness = preferences.outfitCompleteness || 'complete'; // Default to complete

        // Cultural wear is always a complete outfit
        if (stylePreference === 'cultural') {
            return this.generateCulturalWear(preferences);
        }

        // Check if user wants complete outfits or single pieces
        if (outfitCompleteness === 'complete') {
            return this.generateCompleteOutfit(preferences);
        } else {
            return this.generateSinglePiece(preferences);
        }
    }

    // NEW: Generate complete outfit (dress OR top+bottom combo)
    generateCompleteOutfit(preferences = {}) {
        const outfitType = Math.random() < 0.5 ? 'dress' : 'separates';

        if (outfitType === 'dress') {
            return this.generateDress(preferences);
        } else {
            const top = this.generateTop(preferences);
            const bottom = this.generateBottom(preferences);

            // Optionally add outerwear (30% chance)
            let outerwear = '';
            if (Math.random() < 0.3) {
                outerwear = ', layered with ' + this.generateOuterwear(preferences);
            }

            return `${top} and ${bottom}${outerwear}`;
        }
    }

    // NEW: Generate single piece (original behavior)
    generateSinglePiece(preferences = {}) {
        const clothingTypes = ['dresses.json', 'tops.json', 'bottoms.json', 'outerwear.json'];
        const clothingType = this.dataLoader.randomChoice(clothingTypes);

        if (clothingType === 'dresses.json') {
            return this.generateDress(preferences);
        } else if (clothingType === 'tops.json') {
            return this.generateTop(preferences);
        } else if (clothingType === 'bottoms.json') {
            return this.generateBottom(preferences);
        } else {
            return this.generateOuterwear(preferences);
        }
    }

    // NEW: Helper method to generate a dress
generateDress(preferences = {}) {
    const category = this.dataLoader.randomChoice(['dress_types', 'formal_dresses', 'casual_dresses']);
    const clothingItem = this.dataLoader.getRandomFrom('dresses.json', category);
    const neckline = this.dataLoader.getRandomFrom('dresses.json', 'neckline_options');
    const sleeve = this.dataLoader.getRandomFrom('dresses.json', 'sleeve_styles');

    return this.assembleSingleGarment(clothingItem, `with ${neckline} and ${sleeve}`, preferences);
}

    // NEW: Helper method to generate a top
generateTop(preferences = {}) {
    const category = this.dataLoader.randomChoice(['basic_tops', 'dressy_tops', 'casual_tops']);
    const clothingItem = this.dataLoader.getRandomFrom('tops.json', category);
    const neckline = this.dataLoader.getRandomFrom('tops.json', 'neckline_styles');
    const sleeve = this.dataLoader.getRandomFrom('tops.json', 'sleeve_variations');

    return this.assembleSingleGarment(clothingItem, `with ${neckline} and ${sleeve}`, preferences);
}

    // NEW: Helper method to generate bottoms
generateBottom(preferences = {}) {
    const category = this.dataLoader.randomChoice(['skirt_types', 'pants_types', 'jeans_styles']);
    const clothingItem = this.dataLoader.getRandomFrom('bottoms.json', category);

    return this.assembleSingleGarment(clothingItem, '', preferences);
}

    // NEW: Helper method to generate outerwear
    generateOuterwear(preferences = {}) {
        const category = this.dataLoader.randomChoice(['coat_types', 'jacket_styles', 'elegant_wraps']);
        const clothingItem = this.dataLoader.getRandomFrom('outerwear.json', category);

        return this.assembleSingleGarment(clothingItem, '', preferences);
    }

    // NEW: Helper method to generate cultural wear
    generateCulturalWear(preferences = {}) {
        const categories = ['asian_traditional', 'european_traditional', 'african_traditional', 'middle_eastern'];
        const category = this.dataLoader.randomChoice(categories);
        const clothingItem = this.dataLoader.getRandomFrom('cultural-wear.json', category);

        return this.assembleSingleGarment(clothingItem, '', preferences);
    }

    // NEW: Shared method to assemble garment details (consolidates duplicate code)
    assembleSingleGarment(clothingItem, necklineAndSleeves, preferences = {}) {
        const fit = this.dataLoader.getRandomFrom('clothing.json', 'garment_fits');
        const fabric = this.dataLoader.getRandomFrom('clothing.json', 'fabric_types');

        // Get colors with explicit specification
        const colorBoldnessChance = preferences.colorBoldnessChance || 70;
        const primaryColor = this.generateClothingColor(preferences.colorBoldnessChance, fabric);

        // Build color + fabric description
        let colorDescription = `${primaryColor} ${fabric}`;

        // Add accent color if chance permits
        if (Math.random() * 100 < colorBoldnessChance) {
            const accentColor = this.generateClothingColor(preferences.colorBoldnessChance, fabric);
            colorDescription += ` with ${accentColor} accent trim`;
        }

        // Get pattern with explicit color
        const embellishmentChance = preferences.embellishmentChance || 70;
        let pattern;
        let patternColor = '';

        if (embellishmentChance > 80) {
            const dramaticPatterns = [
                'psychedelic print', 'kaleidoscope print', 'optical illusion',
                'hologram print', 'galaxy print', 'fractal print'
            ];
            pattern = this.dataLoader.randomChoice(dramaticPatterns);
        } else if (embellishmentChance > 50) {
            const avoidPatterns = ['solid'];
            const allPatterns = this.dataLoader.getAllFrom('clothing.json', 'patterns');
            const allowedPatterns = allPatterns.filter(p => !avoidPatterns.includes(p));
            pattern = this.dataLoader.randomChoice(allowedPatterns);

            // Add pattern color for specific patterns
            if (pattern === 'striped' || pattern === 'polka dot' || pattern === 'checkered') {
                const patternColorOptions = ['white', 'black', 'gold', 'silver', 'contrasting'];
                patternColor = this.dataLoader.randomChoice(patternColorOptions) + ' ';
            }
        } else {
            pattern = this.dataLoader.getRandomFrom('clothing.json', 'patterns');
        }

        // Get embellishment with explicit materials
        let embellishment = '';
        if (Math.random() * 100 < embellishmentChance) {
            let embellishmentType;
            if (embellishmentChance > 80) {
                const dramatic = [
                    'holographic sequined', 'crystal beaded', 'iridescent sequined',
                    'silver metallic thread embroidered', 'gold metallic thread embroidered'
                ];
                embellishmentType = this.dataLoader.randomChoice(dramatic);
            } else {
                embellishmentType = this.dataLoader.getRandomFrom('clothing.json', 'embellishments');
            }

            const embellishmentPlacement = this.dataLoader.randomChoice([
                'on the bodice', 'along the hem', 'on the sleeves',
                'along the neckline', 'throughout', 'at the waist'
            ]);

            embellishment = ` with ${embellishmentType} ${embellishmentPlacement}`;
        }

        // Determine article
        const pluralItems = ['pants', 'jeans', 'shorts', 'leggings', 'trousers'];
        const isPlural = pluralItems.some(item => clothingItem.toLowerCase().includes(item));
        const article = isPlural ? '' : 'a ';

        // Build the description - FIXED STRUCTURE
        const parts = [
            `wearing ${article}${fit} ${clothingItem}`,
            necklineAndSleeves,
            `in ${colorDescription},`,
            `${patternColor}${pattern} pattern${embellishment}`
        ].filter(part => part);

        return parts.join(' ');
    }

    // Generate clothing color - UNCHANGED
    generateClothingColor(colorBoldnessChance = 50, fabric = '') {
        let colorCategories;
        let intensities;

        // Define incompatible combinations
        const delicateFabrics = ['chiffon', 'organza', 'tulle', 'voile', 'lace', 'silk', 'satin'];
        const structuredFabrics = ['denim', 'canvas', 'tweed', 'oxford cloth', 'corduroy'];
        const neutralColors = ['ivory', 'cream', 'white', 'beige', 'ecru', 'bone'];

        const isDelicateFabric = delicateFabrics.some(f => fabric.toLowerCase().includes(f));
        const isStructuredFabric = structuredFabrics.some(f => fabric.toLowerCase().includes(f));

        if (colorBoldnessChance > 80) {
            colorCategories = ['vibrant_colors', 'metallic_tones'];
            // Avoid "electric" with delicate fabrics or neutral colors
            if (isDelicateFabric) {
                intensities = ['bright', 'bold', 'vivid', 'brilliant'];
            } else {
                intensities = ['bright', 'bold', 'vivid', 'electric', 'brilliant'];
            }
        } else if (colorBoldnessChance > 50) {
            colorCategories = ['warm_colors', 'cool_colors', 'vibrant_colors', 'metallic_tones'];
            intensities = this.dataLoader.getAllFrom('clothing-colors.json', 'color_intensities');
        } else {
            colorCategories = ['neutral_bases', 'warm_colors', 'cool_colors', 'pastel_tones'];
            intensities = this.dataLoader.getAllFrom('clothing-colors.json', 'color_intensities');
        }

        const category = this.dataLoader.randomChoice(colorCategories);
        let color = this.dataLoader.getRandomFrom('clothing-colors.json', category);

        // Prevent problematic color + fabric combinations
        if (isStructuredFabric && neutralColors.some(nc => color.toLowerCase().includes(nc))) {
            // Retry with a different color for structured fabrics
            const nonNeutralCategories = colorCategories.filter(cat => cat !== 'neutral_bases');
            if (nonNeutralCategories.length > 0) {
                const altCategory = this.dataLoader.randomChoice(nonNeutralCategories);
                color = this.dataLoader.getRandomFrom('clothing-colors.json', altCategory);
            }
        }

        let intensity = this.dataLoader.randomChoice(intensities);

        // Filter out problematic intensity + color combinations
        const problematicCombos = {
            'electric': neutralColors,
            'neon': neutralColors,
            'vivid': ['ivory', 'cream']
        };

        if (problematicCombos[intensity]) {
            if (problematicCombos[intensity].some(pc => color.toLowerCase().includes(pc))) {
                // Use a different intensity
                const safeIntensities = intensities.filter(i => !problematicCombos[i]);
                intensity = this.dataLoader.randomChoice(safeIntensities);
            }
        }

        return `${intensity} ${color}`;
    }

    // UPDATED: Generate accessories with explicit colors and materials
    generateAccessories(preferences = {}) {
        const accessories = [];
        const accessoryDensity = preferences.accessoryDensityChance || 60;

        // Jewelry
        if (Math.random() * 100 < accessoryDensity) {
            const jewelryType = this.dataLoader.randomChoice(['necklace_types', 'earring_styles', 'bracelet_types', 'ring_varieties']);
            const jewelry = this.dataLoader.getRandomFrom('jewelry.json', jewelryType);
            const metal = this.dataLoader.getRandomFrom('jewelry.json', 'jewelry_metals');
            const style = this.dataLoader.getRandomFrom('jewelry.json', 'jewelry_styles');
            const gemstone = this.dataLoader.getRandomFrom('jewelry.json', 'gemstones');

            // Add placement for specific jewelry types
            let placement = '';
            if (jewelryType === 'bracelet_types') {
                placement = this.dataLoader.randomChoice([' on left wrist', ' on right wrist', ' on both wrists']);
            } else if (jewelryType === 'ring_varieties') {
                placement = this.dataLoader.randomChoice([' on left hand', ' on right hand', ' on both hands']);
            }

            accessories.push(`${style} ${metal} ${jewelry} with ${gemstone} stones${placement}`);
        }

        // Headwear with explicit color and material
        if (Math.random() * 100 < accessoryDensity * 0.75) {
            const headwearCategories = ['casual_hats', 'formal_hats', 'hair_accessories', 'crowns_tiaras'];
            const category = this.dataLoader.randomChoice(headwearCategories);
            const headwear = this.dataLoader.getRandomFrom('headwear.json', category);
            const material = this.dataLoader.getRandomFrom('headwear.json', 'materials');
            const style = this.dataLoader.getRandomFrom('headwear.json', 'style_descriptors');

            // Get explicit color for headwear
            const headwearColors = [
                'black', 'white', 'navy blue', 'burgundy', 'cream',
                'rose pink', 'emerald green', 'royal blue', 'silver', 'gold'
            ];
            const color = this.dataLoader.randomChoice(headwearColors);

            // Add positioning
            const positions = [
                'positioned centered on head',
                'tilted to the right side',
                'tilted to the left side',
                'pushed back on head',
                'nestled in hair',
                'across forehead'
            ];
            const position = this.dataLoader.randomChoice(positions);

            // Add decorative elements for certain headwear
            let decoration = '';
            if (category === 'formal_hats' || category === 'crowns_tiaras') {
                const decorations = [
                    ' with black netting veil',
                    ' with white feather accent',
                    ' with pearl embellishments',
                    ' with ribbon bow',
                    ' with floral appliqué'
                ];
                decoration = this.dataLoader.randomChoice(decorations);
            }

            accessories.push(`${color} ${material} ${style} ${headwear}${decoration} ${position}`);
        }

        // Eyewear with explicit colors
        // Eyewear with explicit colors
        if (Math.random() * 100 < accessoryDensity * 0.5) {
            const eyewearCategories = ['prescription_glasses', 'sunglasses', 'fashion_eyewear'];
            const category = this.dataLoader.randomChoice(eyewearCategories);
            const eyewear = this.dataLoader.getRandomFrom('eyewear.json', category);
            const frameShape = this.dataLoader.getRandomFrom('eyewear.json', 'frame_shapes');
            const frameMaterial = this.dataLoader.getRandomFrom('eyewear.json', 'frame_materials');

            // Explicit frame color
            const frameColors = [
                'black', 'tortoiseshell', 'clear', 'brown',
                'gold', 'silver', 'rose gold', 'navy blue'
            ];
            const frameColor = this.dataLoader.randomChoice(frameColors);

            // Lens specification
            let lensType = '';
            if (category === 'sunglasses') {
                const lensOptions = [
                    'with dark tinted lenses',
                    'with mirrored lenses',
                    'with gradient lenses',
                    'with polarized dark lenses'
                ];
                lensType = ' ' + this.dataLoader.randomChoice(lensOptions);
            }

            // Positioning - SIMPLIFIED
            const eyewearPositions = [
                'worn normally',
                'pushed up on head',
                'hanging from neckline'
            ];
            const position = this.dataLoader.randomChoice(eyewearPositions);

            // SIMPLIFIED DESCRIPTION - don't specify type when not worn
            if (position === 'worn normally') {
                accessories.push(`${frameShape} ${frameColor} ${frameMaterial} ${eyewear}${lensType} ${position}`);
            } else {
                // Generic "glasses" when not worn
                accessories.push(`${frameShape} ${frameColor} ${frameMaterial} glasses ${position}`);
            }
        }

        if (accessories.length === 0) {
            return '';
        }

        return `adorned with ${accessories.join(', ')}`;
    }

    // NEW: Generate camera details
    generateCamera(pose = '') {
        let shotTypes;

        // Check if pose involves sitting
        const isSitting = pose.toLowerCase().includes('sitting') ||
            pose.toLowerCase().includes('sit on') ||
            pose.toLowerCase().includes('seated');

        // Check if pose involves leaning forward/dynamic movement
        const isLeaningForward = pose.toLowerCase().includes('leaning forward') ||
            pose.toLowerCase().includes('bending forward');

        if (isSitting) {
            shotTypes = [
                'seated portrait from waist up',
                'half body shot from waist up',
                'portrait shot from shoulders up',
                'close-up portrait'
            ];
        } else if (isLeaningForward) {
            // For forward-leaning poses, avoid portrait shots that would look awkward
            shotTypes = [
                'full body shot',
                'three-quarter body shot',
                'half body shot from waist up'
            ];
        } else {
            shotTypes = [
                'full body shot',
                'three-quarter body shot',
                'half body shot from waist up',
                'portrait shot from shoulders up',
                'close-up portrait'
            ];
        }

        const shotType = this.dataLoader.randomChoice(shotTypes);

        const angles = [
            'from eye level',
            'from slightly above',
            'from slightly below',
            'from a low angle'
        ];
        const angle = this.dataLoader.randomChoice(angles);

        const distances = [
            'at 3 feet distance',
            'at 4 feet distance',
            'at 5 feet distance',
            'at 6 feet distance'
        ];
        const distance = this.dataLoader.randomChoice(distances);

        return `${shotType} ${angle} ${distance}`;
    }

    // UPDATED: Generate setting with explicit materials and colors
generateSetting(settingPreference = null) {
    let settingFile, category, settingData;

    if (settingPreference === 'historical') {
        settingFile = 'historical.json';
        const categories = ['ancient_periods', 'medieval_settings', 'renaissance_venues', 'outdoor_historical'];
        category = this.dataLoader.randomChoice(categories);
        settingData = this.dataLoader.getRandomFrom(settingFile, category);
    } else if (settingPreference === 'fantasy') {
        settingFile = 'fantasy.json';
        const categories = ['magical_landscapes', 'fantastical_structures', 'elemental_environments', 'mystical_waters'];
        category = this.dataLoader.randomChoice(categories);
        settingData = this.dataLoader.getRandomFrom(settingFile, category);
    } else if (settingPreference === 'urban') {
        settingFile = 'urban.json';
        const categories = ['street_settings', 'indoor_spaces', 'cultural_venues', 'public_spaces'];
        category = this.dataLoader.randomChoice(categories);
        settingData = this.dataLoader.getRandomFrom(settingFile, category);
    } else {
        settingFile = 'natural.json';
        const categories = ['forest_settings', 'water_environments', 'mountain_landscapes', 'field_meadows'];
        category = this.dataLoader.randomChoice(categories);
        settingData = this.dataLoader.getRandomFrom(settingFile, category);
    }

    // Validate settingData
    if (!settingData || !settingData.name || !settingData.preposition || !settingData.article) {
        console.error(`Invalid setting data from ${settingFile}, category: ${category}`);
        return { description: 'an undefined setting', hasTrees: false };
    }

    // Extract name, preposition, and article
    const { name, preposition, article } = settingData;

// Setting describes location only - detailed lighting is handled by generateLighting()
return {
    description: `positioned ${preposition} ${article} ${name}`,
    hasTrees: name.toLowerCase().includes('garden') || name.toLowerCase().includes('grove')
};
}

// ✅ Fully data-driven lighting generator
generateLighting(settingPreference = null, hasTrees = false) {
    let primaryLight = '';
    let secondaryLight = '';
    let effect = '';

    // Determine which primary and secondary lists to use
    let primaryCategory = '';
    let secondaryCategory = '';

    switch (settingPreference) {
        case 'fantasy':
            primaryCategory = 'fantasy_primary';
            secondaryCategory = 'fantasy_secondary';
            break;

        case 'historical':
            primaryCategory = 'historical_primary';
            secondaryCategory = 'historical_secondary';
            break;

        case 'urban':
            primaryCategory = 'urban_primary';
            secondaryCategory = 'urban_secondary';
            break;

        case 'natural':
        default:
            primaryCategory = 'natural_primary';
            secondaryCategory = 'natural_secondary';
            break;
    }

    // Get random primary and secondary lights
    const primaryList = this.dataLoader.getAllFrom('lighting.json', primaryCategory);
    const secondaryList = this.dataLoader.getAllFrom('lighting.json', secondaryCategory);

    primaryLight = this.dataLoader.randomChoice(primaryList);
    secondaryLight = this.dataLoader.randomChoice(secondaryList);

    // Get a random subject lighting effect (optional)
    effect = this.dataLoader.getRandomFrom('lighting.json', 'subject_lighting_effects');

    // 🧩 Fallbacks to prevent "with null" or empty text
    const parts = [];
    if (primaryLight) parts.push(primaryLight);
    if (secondaryLight) parts.push(secondaryLight);
    if (effect) parts.push(effect);

    // Join everything cleanly
    return parts.join(', ');
}


    // UPDATED: Generate art style with explicit technical details
generateArtStyle(stylePreference = null) {
    let styleCategory, style;

    if (stylePreference === 'photorealistic') {
        styleCategory = 'photorealistic_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'artistic') {
        styleCategory = 'painting_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'editorial') {
        styleCategory = 'fashion_photography';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'anime') {
        styleCategory = 'anime_manga_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'cartoon') {
        styleCategory = 'cartoon_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'painting') {
        styleCategory = 'painting_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'digital') {
        styleCategory = 'digital_art_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else if (stylePreference === 'vintage') {
        styleCategory = 'vintage_styles';
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    } else {
        const categories = [
            'photorealistic_styles', 
            'painting_styles', 
            'fashion_photography', 
            'editorial_style',
            'photography_types',
            'anime_manga_styles',
            'cartoon_styles',
            'digital_art_styles',
            'vintage_styles'
        ];
        styleCategory = this.dataLoader.randomChoice(categories);
        style = this.dataLoader.getRandomFrom('art-styles.json', styleCategory);
    }

    const technique = this.dataLoader.getRandomFrom('art-styles.json', 'artistic_techniques');
    const quality = this.dataLoader.getRandomFrom('art-styles.json', 'rendering_quality');
    
    const colorGrading = this.dataLoader.randomChoice([
        'rich jewel-tone color grading',
        'muted nostalgic color tones with slight sepia warmth',
        'vibrant saturated colors with slight cool tone',
        'luminous pastel color palette',
        'deep contrast with bold colors',
        'soft ethereal color palette'
    ]);

    // Specific entries that should NOT get "style" added even if in a category that normally adds it
    const noStyleEntries = [
        '2D animation', '3D animation', 'japanese animation', 'manga illustration',
        'stylized illustration', 'character design', 'vector illustration',
        'digital illustration', 'cel-shaded'
    ];

    // Categories where we generally add "style" suffix (with exceptions above)
    const addStyleSuffix = [
        'anime_manga_styles',
        'cartoon_styles',
        'artistic_movements',
        'vintage_styles',
        'editorial_style',
        'photorealistic_styles'
    ];

    // Determine verb and style phrase
    let verb, stylePhrase;
    
    // Photography-related categories
    const photographyCategories = [
        'fashion_photography', 
        'editorial_style', 
        'photography_types'
    ];
    
    // Painting and traditional art categories
    const paintingCategories = [
        'painting_styles',
        'artistic_movements'
    ];
    
    // Digital and illustrated categories
    const digitalCategories = [
        'anime_manga_styles',
        'cartoon_styles',
        'digital_art_styles'
    ];
    
    // Determine if we should add "style" suffix
    if (noStyleEntries.includes(style)) {
        // These specific entries never get "style" added
        stylePhrase = style;
    } else if (addStyleSuffix.includes(styleCategory)) {
        // Category normally adds "style"
        stylePhrase = `${style} style`;
    } else {
        // Don't add "style"
        stylePhrase = style;
    }
    
    // Determine verb
    if (photographyCategories.includes(styleCategory)) {
        verb = 'shot in';
    } else if (styleCategory === 'photorealistic_styles') {
        verb = 'captured in';
    } else if (paintingCategories.includes(styleCategory)) {
        verb = 'rendered in';
    } else if (digitalCategories.includes(styleCategory)) {
        verb = 'illustrated in';
    } else if (styleCategory === 'vintage_styles') {
        verb = 'shot in';
    } else {
        verb = 'created in';
    }

    return `${verb} ${stylePhrase}, featuring ${technique}, ${quality}, and ${colorGrading}`;
}

    // NEW: Generate mood/atmosphere
    generateMood() {
        const moods = [
            'exuding timeless elegance and mystery',
            'conveying magical wonder and tranquility',
            'exuding urban edge and fierce independence',
            'evoking refined grace and timeless sophistication',
            'radiating confidence and power',
            'expressing serene contemplation',
            'conveying joyful energy and vitality',
            'exuding romantic elegance',
            'displaying bold dramatic presence',
            'emanating gentle peaceful energy'
        ];

        return this.dataLoader.randomChoice(moods);
    }

    // UPDATED: Assemble the final prompt in correct order
    assemblePrompt(components) {
        const parts = [
            components.subject,
            components.pose,
            components.face,
            components.hair,
            components.clothing,
            components.accessories,
            components.camera,
            components.setting,
            components.lighting,
            components.artStyle,
            components.mood
        ].filter(part => part && part.trim() !== '');

        return parts.join(', ');
    }

    // UPDATED: Generate with specific theme
async generateThemed(theme) {
    const preferences = {};

    switch (theme) {
        case 'fantasy':
            preferences.settingType = 'fantasy';
            preferences.clothingStyle = 'cultural';
            preferences.embellishmentChance = 90;
            preferences.hairEffectsChance = 90;
            preferences.colorBoldnessChance = 85;
            break;
        case 'modern':
            preferences.settingType = 'urban';
            preferences.artStyle = 'photorealistic';
            preferences.embellishmentChance = 50;
            preferences.hairEffectsChance = 40;
            preferences.colorBoldnessChance = 70;
            break;
        case 'vintage':
            preferences.settingType = 'historical';
            preferences.artStyle = 'artistic';
            preferences.embellishmentChance = 70;
            preferences.hairEffectsChance = 60;
            preferences.colorBoldnessChance = 50;
            break;
        case 'natural':
            preferences.settingType = 'natural';
            preferences.artStyle = 'editorial';
            preferences.embellishmentChance = 60;
            preferences.hairEffectsChance = 50;
            preferences.colorBoldnessChance = 60;
            break;
    }

    return this.generatePrompt(preferences);
}
}

// Export for use in other files
window.PromptGenerator = PromptGenerator;