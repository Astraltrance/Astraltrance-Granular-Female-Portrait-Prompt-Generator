import TemplateEngine from './templateEngine.js';

class UIManager {
  constructor() {
    this.templateEngine = new TemplateEngine();
    this.currentPrompt = null;
    this.promptHistory = [];
    this.isInitialized = false;
    this.currentTemplate = 'photorealistic';
    this.settings = {
      accessoryFrequency: 0.5,
      colorCreativity: 0.5,
      includeCamera: true,
      includeLighting: true
    };
  }

  // Initialize the UI and template engine
  async initialize() {
    try {
      console.log('Initializing UI Manager...');
      
      // Show loading indicator
      this.showLoading('Loading data and templates...');
      
      // Initialize template engine
      await this.templateEngine.initialize();
      
      // Set up UI event listeners
      this.setupEventListeners();
      
      // Populate template selector
      this.populateTemplateSelector();
      
      // Hide loading indicator
      this.hideLoading();
      
      // Enable generate button
      this.enableGenerateButton();
      
      this.isInitialized = true;
      console.log('UI Manager initialized successfully');
      
    } catch (error) {
      console.error('Error initializing UI Manager:', error);
      this.showError('Failed to initialize. Please refresh the page.');
    }
  }

  // Set up all event listeners
  setupEventListeners() {
    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePrompt());
    }

    // Template selector
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
      templateSelector.addEventListener('change', (e) => {
        this.currentTemplate = e.target.value;
        this.updateTemplateDescription();
      });
    }

    // Settings controls
    this.setupSettingsControls();

    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyPrompt());
    }

    // History controls
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => this.toggleHistory());
    }

    // Clear history button
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    // Regenerate button
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => this.regeneratePrompt());
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportHistory());
    }
  }

  // Set up settings controls
  setupSettingsControls() {
    // Accessory frequency slider
    const accessorySlider = document.getElementById('accessoryFrequency');
    if (accessorySlider) {
      accessorySlider.addEventListener('input', (e) => {
        this.settings.accessoryFrequency = parseFloat(e.target.value);
        this.updateSliderLabel('accessoryLabel', `${Math.round(e.target.value * 100)}%`);
      });
    }

    // Color creativity slider
    const colorSlider = document.getElementById('colorCreativity');
    if (colorSlider) {
      colorSlider.addEventListener('input', (e) => {
        this.settings.colorCreativity = parseFloat(e.target.value);
        this.updateSliderLabel('colorLabel', `${Math.round(e.target.value * 100)}%`);
      });
    }

    // Include checkboxes
    const includeCamera = document.getElementById('includeCamera');
    if (includeCamera) {
      includeCamera.addEventListener('change', (e) => {
        this.settings.includeCamera = e.target.checked;
      });
    }

    const includeLighting = document.getElementById('includeLighting');
    if (includeLighting) {
      includeLighting.addEventListener('change', (e) => {
        this.settings.includeLighting = e.target.checked;
      });
    }
  }

  // Populate template selector dropdown
  populateTemplateSelector() {
    const selector = document.getElementById('templateSelector');
    if (!selector) return;

    const templates = this.templateEngine.getAvailableTemplates();
    
    selector.innerHTML = '';
    templates.forEach(template => {
      const option = document.createElement('option');
      option.value = template.key;
      option.textContent = template.name;
      selector.appendChild(option);
    });

    // Set default selection
    selector.value = this.currentTemplate;
    this.updateTemplateDescription();
  }

  // Update template description
  updateTemplateDescription() {
    const descriptionEl = document.getElementById('templateDescription');
    if (!descriptionEl) return;

    const template = this.templateEngine.getTemplateDetails(this.currentTemplate);
    if (template) {
      descriptionEl.textContent = template.description;
    }
  }

  // Generate new prompt
  async generatePrompt() {
    if (!this.isInitialized) {
      this.showError('System not initialized. Please wait...');
      return;
    }

    try {
      // Show loading
      this.showLoading('Generating prompt...');
      
      // Disable generate button temporarily
      this.disableGenerateButton();

      // Apply current settings to template options
      const options = {
        accessoryFrequency: this.settings.accessoryFrequency,
        colorCreativity: this.settings.colorCreativity,
        includeCamera: this.settings.includeCamera,
        includeLighting: this.settings.includeLighting
      };

      // Generate prompt using template engine
      const result = await this.templateEngine.generatePrompt(this.currentTemplate, options);
      
      // Store current prompt
      this.currentPrompt = result;
      
      // Add to history
      this.addToHistory(result);
      
      // Display prompt
      this.displayPrompt(result);
      
      // Update UI state
      this.enableCopyButton();
      this.enableRegenerateButton();
      
      // Hide loading
      this.hideLoading();
      
      console.log('Prompt generated successfully');
      
    } catch (error) {
      console.error('Error generating prompt:', error);
      this.showError('Failed to generate prompt. Please try again.');
    } finally {
      // Re-enable generate button
      this.enableGenerateButton();
    }
  }

  // Regenerate current prompt with same template
  async regeneratePrompt() {
    await this.generatePrompt();
  }

  // Display generated prompt
  displayPrompt(result) {
    const promptOutput = document.getElementById('promptOutput');
    if (!promptOutput) return;

    // Clear previous content
    promptOutput.innerHTML = '';

    // Create prompt text element
    const promptText = document.createElement('div');
    promptText.className = 'prompt-text';
    promptText.textContent = result.prompt;
    promptOutput.appendChild(promptText);

    // Create metadata element
    const metadata = document.createElement('div');
    metadata.className = 'prompt-metadata';
    metadata.innerHTML = `
      <div class="metadata-item">
        <strong>Template:</strong> ${result.template}
      </div>
      <div class="metadata-item">
        <strong>Generated:</strong> ${new Date(result.timestamp).toLocaleString()}
      </div>
      <div class="metadata-item">
        <strong>Elements:</strong> ${Object.keys(result.elements).length} components
      </div>
    `;
    promptOutput.appendChild(metadata);

    // Show element breakdown if needed
    if (this.settings.showDetails) {
      this.displayElementBreakdown(result.elements);
    }

    // Scroll to output
    promptOutput.scrollIntoView({ behavior: 'smooth' });
  }

  // Display element breakdown
  displayElementBreakdown(elements) {
    const breakdown = document.getElementById('elementBreakdown');
    if (!breakdown) return;

    breakdown.innerHTML = '<h4>Element Breakdown:</h4>';
    
    Object.entries(elements).forEach(([key, value]) => {
      if (value) {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        
        let displayValue = '';
        if (Array.isArray(value)) {
          displayValue = value.map(v => v.item || v).join(', ');
        } else {
          displayValue = value;
        }
        
        item.innerHTML = `<strong>${key}:</strong> ${displayValue}`;
        breakdown.appendChild(item);
      }
    });
  }

  // Copy prompt to clipboard
  async copyPrompt() {
    if (!this.currentPrompt) {
      this.showError('No prompt to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(this.currentPrompt.prompt);
      this.showSuccess('Prompt copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      
      // Fallback: select text
      const promptText = document.querySelector('.prompt-text');
      if (promptText) {
        window.getSelection().selectAllChildren(promptText);
        this.showMessage('Prompt text selected. Use Ctrl+C to copy.');
      }
    }
  }

  // Add prompt to history
  addToHistory(prompt) {
    this.promptHistory.unshift(prompt);
    
    // Limit history size
    if (this.promptHistory.length > 50) {
      this.promptHistory = this.promptHistory.slice(0, 50);
    }
    
    this.updateHistoryDisplay();
    this.saveHistoryToStorage();
  }

  // Update history display
  updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    historyList.innerHTML = '';
    
    this.promptHistory.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      historyItem.innerHTML = `
        <div class="history-header">
          <span class="history-template">${item.template}</span>
          <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
        </div>
        <div class="history-prompt">${item.prompt.substring(0, 100)}...</div>
        <div class="history-actions">
          <button onclick="uiManager.loadFromHistory(${index})" class="btn-small">Load</button>
          <button onclick="uiManager.removeFromHistory(${index})" class="btn-small btn-danger">Remove</button>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });

    // Update history count
    const historyCount = document.getElementById('historyCount');
    if (historyCount) {
      historyCount.textContent = this.promptHistory.length;
    }
  }

  // Load prompt from history
  loadFromHistory(index) {
    if (index >= 0 && index < this.promptHistory.length) {
      const historyItem = this.promptHistory[index];
      this.currentPrompt = historyItem;
      this.currentTemplate = historyItem.template;
      
      // Update template selector
      const selector = document.getElementById('templateSelector');
      if (selector) {
        selector.value = this.currentTemplate;
        this.updateTemplateDescription();
      }
      
      this.displayPrompt(historyItem);
      this.enableCopyButton();
      this.enableRegenerateButton();
    }
  }

  // Remove prompt from history
  removeFromHistory(index) {
    if (index >= 0 && index < this.promptHistory.length) {
      this.promptHistory.splice(index, 1);
      this.updateHistoryDisplay();
      this.saveHistoryToStorage();
    }
  }

  // Toggle history panel
toggleHistory() {
  console.log('toggleHistory called!'); // Debug line
  const historyPanel = document.getElementById('historyPanel');
  if (historyPanel) {
    console.log('Panel found, current classes:', historyPanel.className); // Debug line
    historyPanel.classList.toggle('visible');
    console.log('Panel classes after toggle:', historyPanel.className); // Debug line
    
    // Update button text based on state
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
      const isVisible = historyPanel.classList.contains('visible');
      historyBtn.innerHTML = isVisible ? 
        '📚 Close History <span id="historyCount" class="badge">' + this.promptHistory.length + '</span>' :
        '📚 History <span id="historyCount" class="badge">' + this.promptHistory.length + '</span>';
    }
  } else {
    console.log('Panel not found!'); // Debug line
  }
}

  // Clear all history
  clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
      this.promptHistory = [];
      this.updateHistoryDisplay();
      this.saveHistoryToStorage();
    }
  }

  // Export history as JSON
  exportHistory() {
    if (this.promptHistory.length === 0) {
      this.showMessage('No history to export');
      return;
    }

    const dataStr = JSON.stringify(this.promptHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showSuccess('History exported successfully!');
  }

  // Save history to localStorage
  saveHistoryToStorage() {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(this.promptHistory));
    } catch (error) {
      console.warn('Could not save history to localStorage:', error);
    }
  }

  // Load history from localStorage
  loadHistoryFromStorage() {
    try {
      const saved = localStorage.getItem('promptHistory');
      if (saved) {
        this.promptHistory = JSON.parse(saved);
        this.updateHistoryDisplay();
      }
    } catch (error) {
      console.warn('Could not load history from localStorage:', error);
    }
  }

  // UI Helper methods
  showLoading(message = 'Loading...') {
    const loader = document.getElementById('loadingIndicator');
    const loaderText = document.getElementById('loadingText');
    if (loader) {
      loader.classList.add('show');
      if (loaderText) loaderText.textContent = message;
    }
  }

  hideLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
      loader.classList.remove('show');
    }
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type = 'info') {
    const messageEl = document.getElementById('messageArea');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `message ${type}`;
      messageEl.classList.add('show');
      
      setTimeout(() => {
        messageEl.classList.remove('show');
      }, 3000);
    }
  }

  enableGenerateButton() {
    const btn = document.getElementById('generateBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Generate Prompt';
    }
  }

  disableGenerateButton() {
    const btn = document.getElementById('generateBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Generating...';
    }
  }

  enableCopyButton() {
    const btn = document.getElementById('copyBtn');
    if (btn) btn.disabled = false;
  }

  enableRegenerateButton() {
    const btn = document.getElementById('regenerateBtn');
    if (btn) btn.disabled = false;
  }

  updateSliderLabel(labelId, value) {
    const label = document.getElementById(labelId);
    if (label) label.textContent = value;
  }

  // Initialize when page loads
  async init() {
    // Load history from storage first
    this.loadHistoryFromStorage();
    
    // Initialize the system
    await this.initialize();
  }
}

// Create global instance
const uiManager = new UIManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => uiManager.init());
} else {
  uiManager.init();
}

// Export for global access and ensure toggleHistory is available
window.uiManager = uiManager;
window.toggleHistory = () => uiManager.toggleHistory();
export default UIManager;