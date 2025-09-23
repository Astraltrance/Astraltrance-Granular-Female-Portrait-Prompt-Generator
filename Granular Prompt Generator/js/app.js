import TemplateEngine from './templateEngine.js';
import ColorSystem from './colorSystem.js';
import UIManager from './ui.js';

class PromptGeneratorApp {
  constructor() {
    this.templateEngine = null;
    this.colorSystem = null;
    this.uiManager = null;
    this.initialized = false;
    this.version = '1.0.0';
    this.config = {
      maxPromptLength: 500,
      maxHistoryItems: 100,
      autoSaveInterval: 30000, // 30 seconds
      debugMode: false
    };
  }

  // Initialize the entire application
  async initialize() {
    try {
      console.log(`🎨 Granular Female Portrait Prompt Generator v${this.version}`);
      console.log('🚀 Initializing application...');
      
      // Initialize core systems
      await this.initializeCoreComponents();
      
      // Set up application-level event handlers
      this.setupGlobalEventHandlers();
      
      // Start background processes
      this.startBackgroundProcesses();
      
      // Mark as initialized
      this.initialized = true;
      
      console.log('✅ Application initialized successfully');
      console.log(`📊 System capabilities:`);
      console.log(`   • ${Object.keys(this.templateEngine.templates).length} templates available`);
      console.log(`   • ${this.getDataStatsSummary()}`);
      console.log(`   • Smart color coordination enabled`);
      console.log(`   • Advanced accessory probability system active`);
      
      // Notify user of successful initialization
      this.showWelcomeMessage();
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  // Initialize core components in proper order
  async initializeCoreComponents() {
    try {
      // Initialize Template Engine (includes DataManager)
      console.log('🔧 Initializing Template Engine...');
      this.templateEngine = new TemplateEngine();
      await this.templateEngine.initialize();
      
      // Initialize Color System with loaded data
      console.log('🎨 Initializing Color System...');
      this.colorSystem = new ColorSystem();
      this.colorSystem.initialize(this.templateEngine.dataManager.data);
      
      // Initialize UI Manager
      console.log('🖥️ Initializing UI Manager...');
      this.uiManager = new UIManager();
      this.uiManager.templateEngine = this.templateEngine; // Inject our template engine
      await this.uiManager.initialize();
      
      // Connect systems together
      this.connectSystems();
      
    } catch (error) {
      console.error('Error initializing core components:', error);
      throw error;
    }
  }

  // Connect all systems together for optimal performance
  connectSystems() {
    // Inject color system into template engine
    this.templateEngine.colorSystem = this.colorSystem;
    
    // Inject app reference into UI manager for advanced features
    this.uiManager.app = this;
    
    // Set up cross-system communication
    this.setupSystemCommunication();
    
    console.log('🔗 Systems connected successfully');
  }

  // Set up communication between systems
  setupSystemCommunication() {
    // Enhanced prompt generation with color coordination
    const originalGenerate = this.templateEngine.generatePrompt.bind(this.templateEngine);
    this.templateEngine.generatePrompt = async (templateName, options = {}) => {
      // Add color system integration
      options.colorSystem = this.colorSystem;
      options.appConfig = this.config;
      
      const result = await originalGenerate(templateName, options);
      
      // Post-process with color validation
      if (this.config.validateColors) {
        result.colorAnalysis = this.validatePromptColors(result);
      }
      
      return result;
    };
  }

  // Set up global event handlers
  setupGlobalEventHandlers() {
    // Handle browser events
    window.addEventListener('beforeunload', (e) => {
      this.handleBeforeUnload(e);
    });
    
    // Handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
    
    // Handle errors globally
    window.addEventListener('error', (e) => {
      this.handleGlobalError(e);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.handleUnhandledRejection(e);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
    
    console.log('⌨️ Global event handlers registered');
  }

  // Start background processes
  startBackgroundProcesses() {
    // Auto-save user settings periodically
    this.autoSaveInterval = setInterval(() => {
      this.autoSaveUserData();
    }, this.config.autoSaveInterval);
    
    // Performance monitoring
    if (this.config.debugMode) {
      this.startPerformanceMonitoring();
    }
    
    console.log('⚡ Background processes started');
  }

  // Generate prompt with enhanced features
  async generatePrompt(templateName, options = {}) {
    if (!this.initialized) {
      throw new Error('Application not initialized');
    }

    try {
      // Add application-level enhancements
      const enhancedOptions = {
        ...options,
        colorSystem: this.colorSystem,
        maxLength: this.config.maxPromptLength,
        timestamp: new Date().toISOString()
      };

      // Generate using template engine
      const result = await this.templateEngine.generatePrompt(templateName, enhancedOptions);
      
      // Add application metadata
      result.appVersion = this.version;
      result.generationId = this.generateUniqueId();
      
      // Validate and enhance result
      const enhancedResult = this.enhancePromptResult(result);
      
      // Trigger application-level events
      this.onPromptGenerated(enhancedResult);
      
      return enhancedResult;
      
    } catch (error) {
      console.error('Error generating prompt:', error);
      this.onPromptGenerationError(error);
      throw error;
    }
  }

  // Enhance prompt result with additional features
  enhancePromptResult(result) {
    // Add quality metrics
    result.qualityMetrics = this.calculateQualityMetrics(result);
    
    // Add style analysis
    result.styleAnalysis = this.analyzePromptStyle(result);
    
    // Add suggestions for improvement
    result.suggestions = this.generateImprovementSuggestions(result);
    
    // Validate prompt length
    if (result.prompt.length > this.config.maxPromptLength) {
      result.warnings = result.warnings || [];
      result.warnings.push('Prompt exceeds recommended length');
    }
    
    return result;
  }

  // Calculate quality metrics for generated prompt
  calculateQualityMetrics(result) {
    const metrics = {
      elementCount: Object.keys(result.elements).length,
      colorHarmony: this.colorSystem.checkCompatibility(
        result.elements.hairColor,
        result.elements.clothing,
        result.elements.accessories
      ),
      creativity: this.calculateCreativityScore(result),
      coherence: this.calculateCoherenceScore(result),
      overall: 0
    };
    
    // Calculate overall score
    metrics.overall = (
      (metrics.elementCount / 10) * 0.2 +
      (metrics.colorHarmony.overall === 'good' ? 1 : 0.5) * 0.3 +
      metrics.creativity * 0.3 +
      metrics.coherence * 0.2
    );
    
    return metrics;
  }

  // Analyze prompt style and characteristics
  analyzePromptStyle(result) {
    const analysis = {
      template: result.template,
      dominantElements: this.findDominantElements(result.elements),
      colorPalette: this.analyzeColorPalette(result.elements),
      moodTone: this.analyzeMoodTone(result.elements),
      complexity: this.analyzeComplexity(result.elements)
    };
    
    return analysis;
  }

  // Generate improvement suggestions
  generateImprovementSuggestions(result) {
    const suggestions = [];
    
    // Check for missing elements
    if (!result.elements.accessories || result.elements.accessories.length === 0) {
      suggestions.push('Consider adding accessories for more visual interest');
    }
    
    // Check color harmony
    if (result.qualityMetrics?.colorHarmony?.overall === 'needs-adjustment') {
      suggestions.push('Color coordination could be improved');
    }
    
    // Check for creativity
    if (result.qualityMetrics?.creativity < 0.7) {
      suggestions.push('Try the Creative Mix template for more unexpected combinations');
    }
    
    return suggestions;
  }

  // Validate colors in generated prompt
  validatePromptColors(result) {
    if (!result.elements.hairColor || !result.elements.clothing) {
      return { status: 'incomplete', message: 'Missing color information' };
    }
    
    return this.colorSystem.checkCompatibility(
      result.elements.hairColor,
      result.elements.clothing,
      result.elements.accessories?.[0]?.item || ''
    );
  }

  // Event handlers
  onPromptGenerated(result) {
    // Log generation event
    if (this.config.debugMode) {
      console.log('📝 Prompt generated:', {
        template: result.template,
        quality: result.qualityMetrics?.overall,
        timestamp: result.timestamp
      });
    }
    
    // Update analytics (if implemented)
    this.updateUsageAnalytics('prompt_generated', {
      template: result.template,
      quality: result.qualityMetrics?.overall
    });
  }

  onPromptGenerationError(error) {
    console.error('❌ Prompt generation error:', error);
    
    // Log error for debugging
    this.logError('prompt_generation', error);
    
    // Show user-friendly error message
    if (this.uiManager) {
      this.uiManager.showError('Failed to generate prompt. Please try again.');
    }
  }

  // Keyboard shortcuts handler
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + G: Generate new prompt
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      if (this.uiManager) {
        this.uiManager.generatePrompt();
      }
    }
    
    // Ctrl/Cmd + C: Copy current prompt (when focused on output)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.closest('.prompt-output')) {
      e.preventDefault();
      if (this.uiManager) {
        this.uiManager.copyPrompt();
      }
    }
    
    // Ctrl/Cmd + H: Toggle history
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      if (this.uiManager) {
        this.uiManager.toggleHistory();
      }
    }
  }

  // Handle before page unload
  handleBeforeUnload(e) {
    // Save current state
    this.autoSaveUserData();
    
    // Warn if there's unsaved data
    if (this.hasUnsavedData()) {
      e.preventDefault();
      e.returnValue = 'You have unsaved prompts. Are you sure you want to leave?';
    }
  }

  // Handle tab visibility changes
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause non-essential processes
      this.pauseBackgroundProcesses();
    } else {
      // Page is visible - resume processes
      this.resumeBackgroundProcesses();
    }
  }

  // Global error handler
  handleGlobalError(e) {
    console.error('🚨 Global error:', e.error);
    this.logError('global', e.error);
    
    // Show user notification for critical errors
    if (this.isCriticalError(e.error)) {
      if (this.uiManager) {
        this.uiManager.showError('A critical error occurred. Please refresh the page.');
      }
    }
  }

  // Handle unhandled promise rejections
  handleUnhandledRejection(e) {
    console.error('🚨 Unhandled promise rejection:', e.reason);
    this.logError('promise_rejection', e.reason);
    e.preventDefault(); // Prevent console logging
  }

  // Auto-save user data
  autoSaveUserData() {
    try {
      if (this.uiManager) {
        this.uiManager.saveHistoryToStorage();
        
        // Save settings
        const settings = {
          currentTemplate: this.uiManager.currentTemplate,
          settings: this.uiManager.settings,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('promptGeneratorSettings', JSON.stringify(settings));
      }
    } catch (error) {
      console.warn('Could not auto-save user data:', error);
    }
  }

  // Show welcome message
  showWelcomeMessage() {
    if (this.uiManager) {
      this.uiManager.showMessage('Welcome to Granular Portrait Prompt Generator! 🎨', 'success');
    }
  }

  // Handle initialization error
  handleInitializationError(error) {
    // Show critical error message
    const errorDiv = document.getElementById('criticalError') || document.body;
    errorDiv.innerHTML = `
      <div class="critical-error">
        <h2>🚨 Initialization Failed</h2>
        <p>The application failed to start properly.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `;
  }

  // Utility methods
  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getDataStatsSummary() {
    if (!this.templateEngine?.dataManager) return 'Data loading...';
    
    const stats = this.templateEngine.dataManager.getDataStats();
    const totalItems = Object.values(stats || {}).reduce((sum, count) => sum + count, 0);
    return `${totalItems} data elements loaded`;
  }

  calculateCreativityScore(result) {
    // Placeholder creativity calculation
    let score = 0.5;
    
    if (result.template === 'creative-mix') score += 0.3;
    if (result.elements.accessories?.length > 1) score += 0.1;
    if (result.elements.hairColor?.includes('fantasy')) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  calculateCoherenceScore(result) {
    // Placeholder coherence calculation
    return 0.8; // Most generated prompts should be coherent
  }

  findDominantElements(elements) {
    return Object.keys(elements).filter(key => elements[key]);
  }

  analyzeColorPalette(elements) {
    const colors = [];
    if (elements.hairColor) colors.push(elements.hairColor);
    if (elements.clothing) colors.push(elements.clothing);
    return colors;
  }

  analyzeMoodTone(elements) {
    return elements.expression || elements.mood || 'neutral';
  }

  analyzeComplexity(elements) {
    const elementCount = Object.keys(elements).length;
    if (elementCount > 8) return 'high';
    if (elementCount > 5) return 'medium';
    return 'low';
  }

  updateUsageAnalytics(event, data) {
    // Placeholder for analytics
    if (this.config.debugMode) {
      console.log('📊 Analytics:', event, data);
    }
  }

  logError(type, error) {
    // Enhanced error logging
    const errorLog = {
      type,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    if (this.config.debugMode) {
      console.log('🐛 Error logged:', errorLog);
    }
  }

  isCriticalError(error) {
    return error.message.includes('failed to fetch') || 
           error.message.includes('network') ||
           error.message.includes('initialization');
  }

  hasUnsavedData() {
    return this.uiManager?.currentPrompt && !this.uiManager?.currentPrompt.saved;
  }

  pauseBackgroundProcesses() {
    // Pause non-essential processes when tab is hidden
  }

  resumeBackgroundProcesses() {
    // Resume processes when tab is visible
  }

startPerformanceMonitoring() {
    // Monitor performance in debug mode
    setInterval(() => {
      const memory = performance.memory;
      if (memory) {
        console.log('🔍 Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB'
        });
      }
    }, 60000); // Every minute
  }

  // Public API methods
  getVersion() {
    return this.version;
  }

  isInitialized() {
    return this.initialized;
  }

  getAvailableTemplates() {
    return this.templateEngine?.getAvailableTemplates() || [];
  }

  getCurrentState() {
    return {
      initialized: this.initialized,
      version: this.version,
      currentTemplate: this.uiManager?.currentTemplate,
      promptHistory: this.uiManager?.promptHistory?.length || 0
    };
  }

  // Cleanup method
  destroy() {
    // Clear intervals
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    // Remove event listeners
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Final save
    this.autoSaveUserData();
    
    console.log('🧹 Application cleaned up');
  }
}

// Create and initialize the application
const app = new PromptGeneratorApp();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
  app.initialize();
}

// Make app globally available
window.promptGeneratorApp = app;

// Export for module use
export default PromptGeneratorApp;