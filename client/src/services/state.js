export class AppState {
  constructor() {
    this.ideas = [];
    this.activeId = null;
    this.selectedAgent = 'ALL';
    this.chatHistory = [];
  }

  setIdeas(ideas) {
    this.ideas = ideas;
    this.saveToLocalStorage();
  }

  getIdeas() {
    return this.ideas;
  }

  setActiveId(id) {
    this.activeId = id;
  }

  getActiveIdea() {
    return this.ideas.find(idea => idea.id === this.activeId);
  }

  setSelectedAgent(agentId) {
    this.selectedAgent = agentId;
  }

  addChatMessage(message, role, agent = null) {
    this.chatHistory.push({
      message,
      role,
      agent,
      timestamp: new Date().toISOString()
    });
  }

  clearChat() {
    this.chatHistory = [];
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('apex_session', JSON.stringify({
        ideas: this.ideas,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('apex_session');
      if (data) {
        const parsed = JSON.parse(data);
        this.ideas = parsed.ideas || [];
        return true;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return false;
  }
}
