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
        const style = this.dataLoader.getRandomFrom('hair-styles.json', 'hair_styles');
        const lengthGroup = this.determineLengthGroupForStyle(style);
        const length = this.dataLoader.randomChoice(this.getLengthOptions(lengthGroup));
        const texture = this.dataLoader.getRandomFrom('hair-styles.json', 'hair_textures');
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
    const featureDescription = this.describeGarmentFeatures({
        file: 'dresses.json',
        necklineKey: 'neckline_options',
        sleeveKey: 'sleeve_styles',
        clothingItem,
        garmentType: 'dress'
    });

    return this.assembleSingleGarment(clothingItem, featureDescription, preferences, 'dress');
}

    // NEW: Helper method to generate a top
    generateTop(preferences = {}) {
    const category = this.dataLoader.randomChoice(['basic_tops', 'dressy_tops', 'casual_tops']);
    const clothingItem = this.dataLoader.getRandomFrom('tops.json', category);
    const featureDescription = this.describeGarmentFeatures({
        file: 'tops.json',
        necklineKey: 'neckline_styles',
        sleeveKey: 'sleeve_variations',
        clothingItem,
        garmentType: 'top'
    });

    return this.assembleSingleGarment(clothingItem, featureDescription, preferences, 'top');
}

    // NEW: Helper method to generate bottoms
generateBottom(preferences = {}) {
    const category = this.dataLoader.randomChoice(['skirt_types', 'pants_types', 'jeans_styles']);
    const clothingItem = this.dataLoader.getRandomFrom('bottoms.json', category);

    return this.assembleSingleGarment(clothingItem, '', preferences, 'bottom');
}

    // NEW: Helper method to generate outerwear
    generateOuterwear(preferences = {}) {
        const category = this.dataLoader.randomChoice(['coat_types', 'jacket_styles', 'elegant_wraps']);
        const clothingItem = this.dataLoader.getRandomFrom('outerwear.json', category);

        return this.assembleSingleGarment(clothingItem, '', preferences, 'outerwear');
    }

    // NEW: Helper method to generate cultural wear
    generateCulturalWear(preferences = {}) {
        const categories = ['asian_traditional', 'european_traditional', 'african_traditional', 'middle_eastern'];
        const category = this.dataLoader.randomChoice(categories);
        const clothingItem = this.dataLoader.getRandomFrom('cultural-wear.json', category);

        const inferredType = this.inferGarmentTypeFromName(clothingItem);
        return this.assembleSingleGarment(clothingItem, '', preferences, inferredType);
    }

    // NEW: Shared method to assemble garment details (consolidates duplicate code)
    assembleSingleGarment(clothingItem, necklineAndSleeves, preferences = {}, garmentType = 'outfit') {
        const descriptor = this.getGarmentDescriptor(garmentType, clothingItem);
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

            const placementOptions = this.getEmbellishmentPlacements(garmentType, clothingItem);
            const filteredPlacements = placementOptions.filter(option => {
                if (/bodice/.test(option) && garmentType !== 'dress' && garmentType !== 'top') {
                    return false;
                }

                if (/neckline/.test(option) && garmentType === 'bottom') {
                    return false;
                }

                return true;
            });

            const placementPool = filteredPlacements.length > 0 ? filteredPlacements : placementOptions;
            const embellishmentPlacement = this.dataLoader.randomChoice(placementPool);

            embellishment = ` with ${embellishmentType} ${embellishmentPlacement}`;
        }

        // Determine article
        const pluralItems = ['pants', 'jeans', 'shorts', 'leggings', 'trousers', 'culottes', 'capris', 'joggers'];
        const lowerItem = (clothingItem || '').toLowerCase();
        const isPlural = pluralItems.some(item => lowerItem.includes(item));
        const garmentLabel = `${descriptor ? descriptor + ' ' : ''}${clothingItem}`.replace(/\s+/g, ' ').trim();
        const leadPhrase = isPlural
            ? `wearing ${garmentLabel}`
            : `wearing ${this.getIndefiniteArticle(garmentLabel)} ${garmentLabel}`;

        // Build the description - FIXED STRUCTURE
        const parts = [
            leadPhrase,
            necklineAndSleeves,
            `in ${colorDescription},`,
            `${patternColor}${pattern} pattern${embellishment}`
        ].filter(part => part && part.trim().length);

        return parts.join(' ');
    }

    getGarmentDescriptor(garmentType, clothingItem) {
        const baseFits = this.dataLoader.getAllFrom('clothing.json', 'garment_fits') || [];
        const baseSet = new Set(baseFits.map(fit => fit.toLowerCase()));
        const lowerItem = (clothingItem || '').toLowerCase();
        const pick = candidates => {
            const filtered = (candidates || []).filter(Boolean);
            if (filtered.length === 0) {
                return '';
            }

            const available = filtered.filter(option => baseSet.has(option.toLowerCase()));
            if (available.length > 0) {
                return this.dataLoader.randomChoice(available);
            }

            return this.dataLoader.randomChoice(filtered);
        };

        if (garmentType === 'top') {
            if (/(tee|t-shirt|tank top|camisole|bodysuit|crop top|jersey top|basic tee|graphic tee)/.test(lowerItem)) {
                return pick(['fitted', 'slim-fit', 'regular fit', 'standard fit', 'classic fit', 'comfortable fit', 'easy fit', 'relaxed', 'boxy', 'cropped']);
            }

            if (/(polo|henley|shirt|button-up|buttondown|button down|blouse|tunic)/.test(lowerItem)) {
                return pick(['tailored', 'structured', 'fitted', 'slim-fit', 'classic fit', 'regular fit', 'standard fit', 'easy fit', 'comfortable fit', 'straight-cut']);
            }

            if (/(sweater|pullover|knit|cardigan|hoodie|sweatshirt)/.test(lowerItem)) {
                return pick(['relaxed', 'oversized', 'longline', 'cropped', 'snug', 'comfortable fit', 'easy fit', 'boxy', 'regular fit']);
            }

            if (/(corset|bustier|bralette)/.test(lowerItem)) {
                return pick(['structured', 'form-fitting', 'body-hugging', 'curve-hugging', 'figure-hugging', 'skin-tight', 'close-fitting']);
            }

            return pick(['fitted', 'tailored', 'slim-fit', 'structured', 'regular fit', 'classic fit', 'standard fit', 'comfortable fit', 'easy fit', 'relaxed', 'flowing', 'draped', 'boxy', 'cropped', 'longline', 'gathered', 'ruched', 'shirred', 'smocked', 'pleated', 'paneled', 'asymmetrical', 'billowing']);
        }

        if (garmentType === 'dress') {
            if (/(bodycon|sheath|slip|column)/.test(lowerItem)) {
                return pick(['bodycon', 'form-fitting', 'body-hugging', 'curve-hugging', 'figure-hugging', 'slim-fit', 'fitted', 'tailored']);
            }

            if (/(ballgown|gown|evening gown|maxi gown|formal gown)/.test(lowerItem)) {
                return pick(['flowing', 'billowing', 'voluminous', 'A-line', 'princess', 'empire', 'trapeze', 'bias-cut']);
            }

            if (/(wrap|sarong)/.test(lowerItem)) {
                return pick(['wrap-style', 'sarong-style', 'bias-cut', 'draped', 'gathered']);
            }

            if (/(shirt dress|tunic dress)/.test(lowerItem)) {
                return pick(['tailored', 'straight-cut', 'regular fit', 'classic fit', 'easy fit', 'comfortable fit']);
            }

            if (/(fit-and-flare|skater|swing|peplum)/.test(lowerItem)) {
                return pick(['A-line', 'fit-and-flare', 'flared', 'swing', 'trapeze', 'gathered', 'pleated', 'ruched']);
            }

            return pick(['fitted', 'tailored', 'form-fitting', 'body-hugging', 'curve-hugging', 'A-line', 'flared', 'swing', 'trapeze', 'empire', 'princess', 'bias-cut', 'wrap-style', 'sarong-style', 'gathered', 'ruched', 'shirred', 'smocked', 'pleated', 'tucked', 'darted', 'seamed', 'paneled', 'asymmetrical', 'high-low', 'dip-hem', 'stepped hem', 'handkerchief hem', 'curved hem', 'scalloped hem', 'flowing', 'billowing', 'voluminous']);
        }

        if (garmentType === 'outerwear') {
            return pick(['tailored', 'structured', 'fitted', 'slim-fit', 'regular fit', 'classic fit', 'comfortable fit', 'easy fit', 'relaxed', 'boxy', 'square-cut', 'straight-cut', 'longline', 'cropped', 'wrap-style', 'double-breasted', 'single-breasted', 'oversized', 'generous fit', 'roomy']);
        }

        if (garmentType === 'bottom') {
            if (/(skirt|skort)/.test(lowerItem)) {
                if (/(pencil|column|straight)/.test(lowerItem)) {
                    return pick(['fitted', 'slim-fit', 'tailored', 'straight-cut', 'curve-hugging', 'figure-hugging']);
                }

                if (/(wrap|sarong)/.test(lowerItem)) {
                    return pick(['wrap-style', 'sarong-style', 'bias-cut', 'draped', 'gathered']);
                }

                if (/(pleated|circle|a-line|flared|tiered|swing)/.test(lowerItem)) {
                    return pick(['A-line', 'flared', 'swing', 'trapeze', 'pleated', 'gathered', 'ruched', 'shirred', 'smocked', 'paneled']);
                }

                return pick(['A-line', 'flared', 'swing', 'trapeze', 'pleated', 'gathered', 'ruched', 'shirred', 'smocked', 'paneled', 'asymmetrical', 'high-low', 'dip-hem', 'stepped hem', 'handkerchief hem', 'curved hem', 'scalloped hem']);
            }

            if (/(legging|yoga|skinny)/.test(lowerItem)) {
                return pick(['compression', 'stretch-fit', 'form-fitting', 'body-hugging', 'curve-hugging', 'figure-hugging', 'skin-tight', 'slim-fit', 'fitted', 'close-fitting']);
            }

            if (/(shorts|bermuda|hot pants|boy shorts)/.test(lowerItem)) {
                return pick(['tailored', 'fitted', 'slim-fit', 'regular fit', 'classic fit', 'easy fit', 'comfortable fit', 'relaxed', 'boxy']);
            }

            if (/(cargo|jogger|sweatpant|track|palazzo|culotte|wide|baggy)/.test(lowerItem)) {
                return pick(['relaxed', 'easy fit', 'comfortable fit', 'baggy', 'roomy', 'generous fit', 'straight-cut', 'flowing']);
            }

            return pick(['tailored', 'fitted', 'slim-fit', 'straight-cut', 'regular fit', 'classic fit', 'comfortable fit', 'easy fit', 'flared', 'bootcut', 'tapered']);
        }

        return pick(baseFits);
    }

    getIndefiniteArticle(phrase = '') {
        const firstWord = (phrase || '').trim().split(/\s+/)[0] || '';
        if (!firstWord) {
            return 'a';
        }

        const lower = firstWord.toLowerCase();
        const specialAn = ['honest', 'hour', 'honor', 'heir', 'heirloom'];
        const specialA = ['university', 'unicorn', 'european', 'one', 'once', 'unit', 'unique', 'useful', 'user', 'uber'];

        if (specialAn.some(prefix => lower.startsWith(prefix))) {
            return 'an';
        }

        if (specialA.some(prefix => lower.startsWith(prefix))) {
            return 'a';
        }

        return /^[aeiou]/.test(lower) ? 'an' : 'a';
    }

    getEmbellishmentPlacements(garmentType, clothingItem) {
        const lowerItem = (clothingItem || '').toLowerCase();

        if (garmentType === 'bottom' || /(skirt|pants|jeans|shorts|culotte|culottes|trouser|trousers|skort)/.test(lowerItem)) {
            if (/(skirt|skort)/.test(lowerItem)) {
                return [
                    'along the hem',
                    'at the waist',
                    'down the sides',
                    'on the pleats',
                    'around the waistband',
                    'throughout'
                ];
            }

            return [
                'along the hem',
                'at the waist',
                'down the sides',
                'on the pockets',
                'around the cuffs',
                'throughout'
            ];
        }

        if (garmentType === 'outerwear' || /(jacket|coat|cape|wrap|poncho|kimono|blazer)/.test(lowerItem)) {
            const placements = [
                'along the lapels',
                'around the collar',
                'on the cuffs',
                'down the front',
                'along the hem',
                'throughout'
            ];

            if (/(hood|parka|anorak|hoodie)/.test(lowerItem)) {
                placements.splice(1, 0, 'around the hood');
            }

            return placements;
        }

        if (garmentType === 'dress' || /(dress|gown)/.test(lowerItem)) {
            return [
                'on the bodice',
                'along the hem',
                'on the sleeves',
                'along the neckline',
                'at the waist',
                'throughout',
                'on the skirt'
            ];
        }

        // Default to top placements
        return [
            'on the bodice',
            'along the hem',
            'on the sleeves',
            'along the neckline',
            'at the waist',
            'throughout'
        ];
    }

    inferGarmentTypeFromName(clothingItem) {
        const lowerItem = (clothingItem || '').toLowerCase();

        if (/(kimono|robe|coat|jacket|cape|poncho|wrap)/.test(lowerItem)) {
            return 'outerwear';
        }

        if (/(skirt|pants|trousers|jeans|shorts|sarong|hakama|dhoti)/.test(lowerItem)) {
            return 'bottom';
        }

        if (/(dress|gown|cheongsam|hanbok|sari|kebaya|dirndl|lehenga|abaya)/.test(lowerItem)) {
            return 'dress';
        }

        return 'top';
    }

    describeGarmentFeatures({ file, necklineKey, sleeveKey, clothingItem, garmentType }) {
        const necklineOptions = this.dataLoader.getAllFrom(file, necklineKey);
        const sleeveOptions = this.dataLoader.getAllFrom(file, sleeveKey);

        let neckline = this.dataLoader.randomChoice(necklineOptions);
        let sleeve = this.dataLoader.randomChoice(sleeveOptions);

        ({ neckline, sleeve } = this.adjustNecklineAndSleeve({
            garmentType,
            clothingItem,
            neckline,
            sleeve,
            necklineOptions,
            sleeveOptions
        }));

        return this.buildFeatureDescription(neckline, sleeve);
    }

    adjustNecklineAndSleeve({ garmentType, clothingItem, neckline, sleeve, necklineOptions, sleeveOptions }) {
        const lowerItem = clothingItem.toLowerCase();
        const straplessNecklines = ['strapless', 'halter neck', 'one-shoulder'];

        if (straplessNecklines.includes(neckline)) {
            sleeve = 'sleeveless';
        }

        if (neckline === 'off-shoulder') {
            const offShoulderSleeves = ['off-shoulder sleeve', 'short sleeve', 'long sleeve', 'three-quarter sleeve', 'flutter sleeve', 'sheer sleeve'];
            sleeve = this.ensureOption(sleeve, offShoulderSleeves, sleeveOptions);
        } else if (sleeve === 'off-shoulder sleeve') {
            const nonOffShoulder = sleeveOptions.filter(option => option !== 'off-shoulder sleeve');
            sleeve = this.ensureOption(sleeve, nonOffShoulder, sleeveOptions);
        }

        if (garmentType === 'top') {
            if (/off-shoulder/.test(lowerItem)) {
                neckline = 'off-shoulder';
                sleeve = 'off-shoulder sleeve';
            }

            if (/camisole|tank top|bodysuit/.test(lowerItem)) {
                sleeve = 'sleeveless';
                const allowedNecklines = ['scoop neck', 'V-neck', 'square neck', 'halter neck', 'high neck'];
                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
            }

            if (/(graphic tee|basic tee|t-shirt|tee)/.test(lowerItem)) {
                const allowedNecklines = ['crew neck', 'scoop neck', 'V-neck', 'boat neck'];
                const allowedSleeves = ['short sleeve', 'long sleeve', 'three-quarter sleeve', 'cap sleeve', 'raglan sleeve', 'dolman sleeve'];

                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
                sleeve = this.ensureOption(sleeve, allowedSleeves, sleeveOptions);
            }

            if (/polo/.test(lowerItem)) {
                const allowedNecklines = ['polo collar', 'crew neck', 'V-neck'];
                const allowedSleeves = ['short sleeve', 'long sleeve', 'three-quarter sleeve'];

                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
                sleeve = this.ensureOption(sleeve, allowedSleeves, sleeveOptions);
            }

            if (/henley/.test(lowerItem)) {
                const allowedNecklines = ['crew neck', 'V-neck'];
                const allowedSleeves = ['long sleeve', 'short sleeve', 'three-quarter sleeve'];

                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
                sleeve = this.ensureOption(sleeve, allowedSleeves, sleeveOptions);
            }

            if (/(sweater|pullover|knit top|jersey top)/.test(lowerItem)) {
                const allowedNecklines = ['crew neck', 'scoop neck', 'V-neck', 'boat neck', 'high neck', 'cowl neck'];
                const allowedSleeves = ['long sleeve', 'three-quarter sleeve', 'raglan sleeve', 'dolman sleeve'];

                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
                sleeve = this.ensureOption(sleeve, allowedSleeves, sleeveOptions);
            }

            if (/(tunic|blouse|shirt|button-up|buttondown|button down)/.test(lowerItem) && !/(t-shirt|tee|polo|henley)/.test(lowerItem)) {
                const allowedNecklines = ['scoop neck', 'V-neck', 'boat neck', 'high neck', 'keyhole neck'];
                const allowedSleeves = ['short sleeve', 'long sleeve', 'three-quarter sleeve', 'bell sleeve', 'bishop sleeve', 'flutter sleeve', 'puffed sleeve'];

                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
                sleeve = this.ensureOption(sleeve, allowedSleeves, sleeveOptions);
            }
        } else if (garmentType === 'dress') {
            if (/t-shirt dress/.test(lowerItem)) {
                const allowedNecklines = ['crew neck', 'scoop neck', 'V-neck'];
                const allowedSleeves = ['short sleeve', 'long sleeve', 'three-quarter sleeve', 'cap sleeve'];

                neckline = this.ensureOption(neckline, allowedNecklines, necklineOptions);
                sleeve = this.ensureOption(sleeve, allowedSleeves, sleeveOptions);
            }
        }

        return { neckline, sleeve };
    }

    ensureOption(current, preferredList, fallbackOptions) {
        const available = preferredList.filter(option => fallbackOptions.includes(option));
        if (available.length === 0) {
            return current;
        }

        if (!available.includes(current)) {
            return this.dataLoader.randomChoice(available);
        }

        return current;
    }

    buildFeatureDescription(neckline, sleeve) {
        const necklinePhrase = this.describeNecklinePhrase(neckline);
        const sleevePhrase = this.describeSleevePhrase(sleeve);

        if (necklinePhrase && sleevePhrase) {
            return `with ${necklinePhrase} and ${sleevePhrase}`;
        } else if (necklinePhrase) {
            return `with ${necklinePhrase}`;
        } else if (sleevePhrase) {
            return `with ${sleevePhrase}`;
        }

        return '';
    }

    describeNecklinePhrase(neckline) {
        if (!neckline) {
            return '';
        }

        const phrases = {
            'V-neck': 'a V-neckline',
            'scoop neck': 'a scoop neckline',
            'crew neck': 'a crew neckline',
            'boat neck': 'a boat neckline',
            'off-shoulder': 'an off-shoulder neckline',
            'one-shoulder': 'a one-shoulder neckline',
            'high neck': 'a high neckline',
            'cowl neck': 'a cowl neckline',
            'halter neck': 'a halter neckline',
            'square neck': 'a square neckline',
            'sweetheart neck': 'a sweetheart neckline',
            'sweetheart': 'a sweetheart neckline',
            'strapless': 'a strapless neckline',
            'backless': 'a backless design',
            'keyhole neck': 'a keyhole neckline',
            'polo collar': 'a polo collar'
        };

        return phrases[neckline] || `a ${neckline}`;
    }

    describeSleevePhrase(sleeve) {
        if (!sleeve || sleeve === 'sleeveless') {
            return sleeve === 'sleeveless' ? 'a sleeveless design' : '';
        }

        const pluralReplacements = {
            'short sleeve': 'short sleeves',
            'long sleeve': 'long sleeves',
            'three-quarter sleeve': 'three-quarter sleeves',
            'cap sleeve': 'cap sleeves',
            'bell sleeve': 'bell sleeves',
            'flutter sleeve': 'flutter sleeves',
            'puffed sleeve': 'puffed sleeves',
            'bishop sleeve': 'bishop sleeves',
            'raglan sleeve': 'raglan sleeves',
            'dolman sleeve': 'dolman sleeves',
            'off-shoulder sleeve': 'off-shoulder sleeves',
            'cold shoulder': 'cold-shoulder cutouts'
        };

        return pluralReplacements[sleeve] || sleeve;
    }

    determineLengthGroupForStyle(style) {
        const lowerStyle = (style || '').toLowerCase();

        const shortKeywords = ['pixie', 'buzz', 'crop', 'boyish', 'short', 'crew', 'fade', 'pompadour', 'quiff', 'mohawk'];
        const longKeywords = ['long', 'braid', 'ponytail', 'bun', 'updo', 'chignon', 'cascade', 'mermaid', 'goddess', 'waist', 'tail'];

        if (shortKeywords.some(keyword => lowerStyle.includes(keyword))) {
            return 'short';
        }

        if (longKeywords.some(keyword => lowerStyle.includes(keyword))) {
            return 'long';
        }

        if (lowerStyle.includes('bob') || lowerStyle.includes('lob') || lowerStyle.includes('shag')) {
            return 'medium';
        }

        return 'medium';
    }

    getLengthOptions(lengthGroup) {
        const lengthOptions = {
            short: [
                'ultra short',
                'very short',
                'short',
                'cropped short',
                'pixie-short',
                'buzz-cut short',
                'closely cropped',
                'ear-length',
                'chin-length',
                'jaw-length',
                'neck-length',
                'nape-length',
                'boyish short'
            ],
            medium: [
                'medium-short',
                'medium',
                'medium-length',
                'shoulder-length',
                'grazing-shoulders',
                'just-past-shoulders',
                'collarbone-length'
            ],
            long: [
                'medium-long',
                'long',
                'very long',
                'extra long',
                'ultra long',
                'mid-back length',
                'lower-back length',
                'waist-length',
                'hip-length',
                'thigh-length',
                'floor-length',
                'tailbone-length',
                'rapunzel-length'
            ]
        };

        return lengthOptions[lengthGroup] || lengthOptions.medium;
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
