class UI {
    constructor() {
        this.dataLoader = null;
        this.promptGenerator = null;
        this.isInitialized = false;
        this.currentPrompt = '';
        
        this.initializeElements();
        this.attachEventListeners();
        this.initialize();
    }

    // Get references to DOM elements
    initializeElements() {
        // Controls
        this.clothingStyleSelect = document.getElementById('clothing-style');
        this.settingTypeSelect = document.getElementById('setting-type');
        this.artStyleSelect = document.getElementById('art-style');

        // Buttons
        this.generateBtn = document.getElementById('generate-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.themeButtons = document.querySelectorAll('.theme-btn');

        // Output
        this.promptOutput = document.getElementById('prompt-output');
        this.characterCount = document.getElementById('character-count');
        this.wordCount = document.getElementById('word-count');

        // Status elements
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.statusMessage = document.getElementById('status-message');

    }

    // Attach event listeners
    attachEventListeners() {
        // Generation buttons
        this.generateBtn.addEventListener('click', () => this.handleGenerate());
        this.copyBtn.addEventListener('click', () => this.handleCopy());

        // Theme buttons
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                this.handleThemedGenerate(theme);
            });
        });

        // Prompt output changes
        this.promptOutput.addEventListener('input', () => this.updateCounts());


        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleGenerate();
                } else if (e.key === 'c' && this.currentPrompt) {
                    // Don't prevent default here, let normal copy work
                    // but ensure our copy button is enabled
                }
            }
        });
    }

    // Initialize the application
    async initialize() {
        try {
            this.showStatus('Initializing...', 'info');
            this.showLoading(true);
            this.setButtonsEnabled(false);

            // Initialize data loader and generator
            this.dataLoader = new DataLoader();
            await this.dataLoader.loadAllData();
            
            this.promptGenerator = new PromptGenerator(this.dataLoader);
            this.isInitialized = true;

            this.showStatus('Ready to generate prompts!', 'success');
            this.setButtonsEnabled(true);
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => this.hideStatus(), 3000);

        } catch (error) {
            console.error('Initialization error:', error);
            this.showStatus('Error loading data files. Please refresh the page.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Handle main generate button
    async handleGenerate() {
        if (!this.isInitialized) {
            this.showStatus('Still initializing, please wait...', 'warning');
            return;
        }

        try {
            this.showLoading(true);
            this.setButtonsEnabled(false);

            const preferences = this.getPreferences();
            const prompt = await this.promptGenerator.generatePrompt(preferences);
            
            this.displayPrompt(prompt);
            this.showStatus('Prompt generated successfully!', 'success');
            
            // Auto-hide success message
            setTimeout(() => this.hideStatus(), 2000);

        } catch (error) {
            console.error('Generation error:', error);
            this.showStatus('Error generating prompt. Please try again.', 'error');
        } finally {
            this.showLoading(false);
            this.setButtonsEnabled(true);
        }
    }


    // Handle themed generation
    async handleThemedGenerate(theme) {
        if (!this.isInitialized) {
            this.showStatus('Still initializing, please wait...', 'warning');
            return;
        }

        try {
            this.showLoading(true);
            this.setButtonsEnabled(false);

            const prompt = await this.promptGenerator.generateThemed(theme);
            
            this.displayPrompt(prompt);
            this.showStatus(`${theme.charAt(0).toUpperCase() + theme.slice(1)} prompt generated!`, 'success');
            
            setTimeout(() => this.hideStatus(), 2000);

        } catch (error) {
            console.error('Themed generation error:', error);
            this.showStatus('Error generating prompt. Please try again.', 'error');
        } finally {
            this.showLoading(false);
            this.setButtonsEnabled(true);
        }
    }

    // Handle copy to clipboard
    async handleCopy() {
        if (!this.currentPrompt) {
            this.showStatus('No prompt to copy!', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentPrompt);
            this.showStatus('Prompt copied to clipboard!', 'success');
            
            // Visual feedback on copy button
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'Copied!';
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('copied');
            }, 1500);
            
            setTimeout(() => this.hideStatus(), 2000);

        } catch (error) {
            console.error('Copy error:', error);
            
            // Fallback for older browsers
            try {
                this.promptOutput.select();
                document.execCommand('copy');
                this.showStatus('Prompt copied to clipboard!', 'success');
            } catch (fallbackError) {
                this.showStatus('Could not copy to clipboard. Please select and copy manually.', 'error');
            }
        }
    }

    // Get current preferences from controls
    getPreferences() {
    const preferences = {};

    const clothingStyle = this.clothingStyleSelect.value;
    if (clothingStyle !== 'random') {
        preferences.clothingStyle = clothingStyle;
    }

    const settingType = this.settingTypeSelect.value;
    if (settingType !== 'random') {
        preferences.settingType = settingType;
    }

    const artStyle = this.artStyleSelect.value;
    if (artStyle !== 'random') {
        preferences.artStyle = artStyle;
    }

    // Get radio button values and convert to percentages
    const embellishment = document.querySelector('input[name="embellishment"]:checked').value;
    const hairEffects = document.querySelector('input[name="hair-effects"]:checked').value;
    const colorBoldness = document.querySelector('input[name="color-boldness"]:checked').value;
    const accessories = document.querySelector('input[name="accessories"]:checked').value;
    const pose = document.querySelector('input[name="pose"]:checked').value;
    const outfitCompleteness = document.querySelector('input[name="outfit-completeness"]:checked').value;

    // Convert radio values to percentage values for generator
    preferences.embellishmentChance = this.convertToPercentage(embellishment);
    preferences.hairEffectsChance = this.convertToPercentage(hairEffects);
    preferences.colorBoldnessChance = this.convertToPercentage(colorBoldness);
    preferences.accessoryDensityChance = this.convertToPercentage(accessories);
    preferences.poseControl = pose; // 'off', 'medium', or 'always'
    preferences.outfitCompleteness = outfitCompleteness; // 'complete' or 'single'

    return preferences;
}

// Add this new helper method
convertToPercentage(value) {
    const mapping = {
        'simple': 30,
        'natural': 30,
        'muted': 30,
        'minimal': 30,
        'medium': 65,
        'dramatic': 90,
        'fantasy': 90,
        'vibrant': 90,
        'maximum': 90
    };
    return mapping[value] || 65;
}

    // Display generated prompt
    displayPrompt(prompt) {
        this.currentPrompt = prompt;
        this.promptOutput.value = prompt;
        this.updateCounts();
        this.copyBtn.disabled = false;
        
        // Scroll to output area
        this.promptOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update character and word counts
    updateCounts() {
        const text = this.promptOutput.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

        this.characterCount.textContent = `Characters: ${charCount}`;
        this.wordCount.textContent = `Words: ${wordCount}`;
    }

    // Show/hide loading indicator
    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    // Enable/disable buttons
    setButtonsEnabled(enabled) {
        this.generateBtn.disabled = !enabled;
        
        this.themeButtons.forEach(btn => {
            btn.disabled = !enabled;
        });

        if (!enabled) {
            this.copyBtn.disabled = true;
        }
    }

    // Show status message
    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.classList.remove('hidden');
    }

    // Hide status message
    hideStatus() {
        this.statusMessage.classList.add('hidden');
    }

    // Clear current prompt
    clearPrompt() {
        this.currentPrompt = '';
        this.promptOutput.value = '';
        this.updateCounts();
        this.copyBtn.disabled = true;
    }

    // Reset all controls to default
    resetControls() {
        this.clothingStyleSelect.value = 'random';
        this.settingTypeSelect.value = 'random';
        this.artStyleSelect.value = 'random';
    }
}

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.ui = new UI();
});