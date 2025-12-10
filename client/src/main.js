import { AppState } from './services/state.js';
import { API } from './services/api.js';
import { UI } from './components/ui.js';
import { Charts } from './components/charts.js';

class ApexProtocol {
  constructor() {
    this.state = new AppState();
    this.api = new API();
    this.ui = new UI(this.state, this.api);
    this.charts = new Charts();
  }

  async init() {
    // Render initial UI
    this.ui.render();
    this.charts.init();
    
    // Load fallback data immediately
    this.loadFallback();
    
    console.log('🚀 Apex Protocol v5.1 initialized');
  }

  async loadFallback() {
    try {
      const data = await this.api.getFallbackIdeas();
      this.state.setIdeas(data.ideas);
      this.charts.updateCharts(data.ideas);
      this.ui.renderCandidateList();
      if (data.ideas.length > 0) {
        this.ui.selectIdea(data.ideas[0].id);
      }
    } catch (error) {
      console.error('Failed to load fallback data:', error);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.apex = new ApexProtocol();
  window.apex.init();
});

// Export for global access
window.ApexProtocol = ApexProtocol;
