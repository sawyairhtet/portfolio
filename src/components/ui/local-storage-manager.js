// Local Storage Manager Component
export class LocalStorageManager {
  constructor() {
    this.storageKeys = {
      lastSection: 'portfolio-last-section',
      theme: 'portfolio-theme',
      preferences: 'portfolio-preferences',
      visitHistory: 'portfolio-visit-history',
    };
  }

  // Section management
  saveLastSection(section) {
    try {
      localStorage.setItem(this.storageKeys.lastSection, section);
      this.updateVisitHistory(section);
    } catch (error) {
      console.warn('Failed to save last section:', error);
    }
  }

  getLastSection() {
    try {
      return localStorage.getItem(this.storageKeys.lastSection) || 'about';
    } catch (error) {
      console.warn('Failed to get last section:', error);
      return 'about';
    }
  }

  // Theme management
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKeys.theme, theme);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }

  getTheme() {
    try {
      return localStorage.getItem(this.storageKeys.theme) || 'dark';
    } catch (error) {
      console.warn('Failed to get theme:', error);
      return 'dark';
    }
  }

  // User preferences
  savePreferences(preferences) {
    try {
      const existing = this.getPreferences();
      const updated = { ...existing, ...preferences };
      localStorage.setItem(this.storageKeys.preferences, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }

  getPreferences() {
    try {
      const stored = localStorage.getItem(this.storageKeys.preferences);
      return stored ? JSON.parse(stored) : this.getDefaultPreferences();
    } catch (error) {
      console.warn('Failed to get preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  getDefaultPreferences() {
    return {
      reducedMotion: false,
      autoPlay: true,
      soundEnabled: false,
      showTooltips: true,
      keyboardShortcuts: true,
      analyticsOptIn: null, // null = not asked, true/false = user choice
    };
  }

  // Visit history for analytics
  updateVisitHistory(section) {
    try {
      const history = this.getVisitHistory();
      const timestamp = new Date().toISOString();

      history.visits.push({
        section,
        timestamp,
        sessionId: this.getSessionId(),
      });

      // Keep only last 100 visits
      if (history.visits.length > 100) {
        history.visits = history.visits.slice(-100);
      }

      history.lastVisit = timestamp;
      history.totalVisits = history.visits.length;

      localStorage.setItem(this.storageKeys.visitHistory, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to update visit history:', error);
    }
  }

  getVisitHistory() {
    try {
      const stored = localStorage.getItem(this.storageKeys.visitHistory);
      return stored
        ? JSON.parse(stored)
        : {
            visits: [],
            lastVisit: null,
            totalVisits: 0,
            firstVisit: new Date().toISOString(),
          };
    } catch (error) {
      console.warn('Failed to get visit history:', error);
      return {
        visits: [],
        lastVisit: null,
        totalVisits: 0,
        firstVisit: new Date().toISOString(),
      };
    }
  }

  // Session management
  getSessionId() {
    let sessionId = sessionStorage.getItem('portfolio-session-id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('portfolio-session-id', sessionId);
    }
    return sessionId;
  }

  // Clear data methods
  clearLastSection() {
    try {
      localStorage.removeItem(this.storageKeys.lastSection);
    } catch (error) {
      console.warn('Failed to clear last section:', error);
    }
  }

  clearPreferences() {
    try {
      localStorage.removeItem(this.storageKeys.preferences);
    } catch (error) {
      console.warn('Failed to clear preferences:', error);
    }
  }

  clearVisitHistory() {
    try {
      localStorage.removeItem(this.storageKeys.visitHistory);
    } catch (error) {
      console.warn('Failed to clear visit history:', error);
    }
  }

  clearAllData() {
    try {
      Object.values(this.storageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });
      sessionStorage.removeItem('portfolio-session-id');
    } catch (error) {
      console.warn('Failed to clear all data:', error);
    }
  }

  // Check if localStorage is available
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo() {
    if (!this.isAvailable()) {
      return { available: false };
    }

    try {
      const used = new Blob(Object.values(localStorage)).size;
      const quota = 5 * 1024 * 1024; // Typical 5MB quota

      return {
        available: true,
        used: used,
        quota: quota,
        usedPercentage: (used / quota) * 100,
        remainingKB: (quota - used) / 1024,
      };
    } catch (error) {
      return { available: true, error: error.message };
    }
  }
}
