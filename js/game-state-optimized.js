// Optimized game state class - Manages character data and application state
class OptimizedGameState {
  constructor() {
    // Local storage key for persisting game state
    this.STATE_KEY = "juraTempestState"

    // Default state structure with initial values
    this.defaultState = {
      population: 1000,
      military: 20,
      economy: 15,
      magic: 10,
      achievements: [],
      customCharacterNames: {},
      lastUpdated: Date.now()
    }
  }

  // Get character loader instance - Access to character data loading functionality
  getCharacterLoader() {
    if (!window.CharacterLoader) {
      console.error('CharacterLoader not available');
      return null;
    }
    return window.CharacterLoader;
  }

  // Load game state from localStorage - Retrieve saved state with fallback to defaults
  load() {
    try {
      const saved = localStorage.getItem(this.STATE_KEY)
      if (saved) {
        const state = JSON.parse(saved)
        return { ...this.defaultState, ...state }
      }
    } catch (error) {
      console.warn('Failed to load game state:', error)
    }
    return { ...this.defaultState }
  }

  // Save game state to localStorage - Persist current state with timestamp
  save(state) {
    try {
      const stateToSave = {
        ...state,
        lastUpdated: Date.now()
      }
      localStorage.setItem(this.STATE_KEY, JSON.stringify(stateToSave))
      return stateToSave
    } catch (error) {
      console.error('Failed to save game state:', error)
      return state
    }
  }

  // Update game state with new values - Merge updates with current state and save
  update(updates) {
    const currentState = this.load()
    const newState = { ...currentState, ...updates }
    return this.save(newState)
  }

  // Get current game state - Alias for load method for convenience
  get() {
    return this.load()
  }

  // Load all characters from data source - Returns complete character list
  async getAllCharacters() {
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getAllCharacters');
      return []
    }
    const result = await loader.loadBasicCharacters()
    return result
  }

  // Load detailed character data by ID - Returns full character information
  async getCharacter(characterId) {
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getCharacter');
      return null
    }
    const result = await loader.loadCharacterDetails(characterId)
    return result
  }

  // Load basic character data by ID - Returns lightweight character information
  async getBasicCharacter(characterId) {
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getBasicCharacter');
      return null
    }
    const basicChars = await loader.loadBasicCharacters()
    const result = basicChars?.find(c => c.id === characterId) || null
    return result
  }

  // Search characters by query string - Returns filtered character results
  async searchCharacters(query) {
    const loader = this.getCharacterLoader()
    if (!loader) return []
    return await loader.searchCharacters(query)
  }

  // Load characters in batches for pagination - Returns subset of characters
  async getCharacterBatch(startIndex = 0, batchSize = 10) {
    const loader = this.getCharacterLoader()
    if (!loader) return []
    return await loader.loadCharacterBatch(startIndex, batchSize)
  }

  // Get total number of available characters - Returns character count
  async getCharacterCount() {
    const loader = this.getCharacterLoader()
    if (!loader) return 0
    return await loader.getCharacterCount()
  }

  // Preload character details for performance optimization - Cache multiple characters
  async preloadCharacters(characterIds) {
    const loader = this.getCharacterLoader()
    if (!loader) return
    return await loader.preloadCharacterDetails(characterIds)
  }

  // Set custom name for a character - Store user-defined character names
  setCharacterCustomName(characterId, customName) {
    const state = this.load()
    const customNames = state.customCharacterNames || {}
    customNames[characterId] = customName

    const newState = {
      ...state,
      customCharacterNames: customNames
    }
    this.save(newState)
    return newState
  }

  // Get custom name for a character - Retrieve user-defined character name
  getCharacterCustomName(characterId) {
    const state = this.load()
    return state.customCharacterNames?.[characterId] || null
  }

  // Check and update achievements based on current state - Award achievements when conditions are met
  checkAchievements(state) {
    const achievements = [...(state.achievements || [])]
    let updated = false

    // Define achievement conditions and their requirements
    const checks = [
      { id: "military_power", condition: state.military >= 70 },
      { id: "economic_boom", condition: state.economy >= 80 },
      { id: "magic_mastery", condition: state.magic >= 70 },
      { id: "population_growth", condition: state.population >= 5000 },
    ]

    // Check each achievement condition and award if not already earned
    checks.forEach((check) => {
      if (check.condition && !achievements.includes(check.id)) {
        achievements.push(check.id)
        updated = true
      }
    })

    // Save updated achievements if any were earned
    if (updated) {
      this.update({ achievements })
    }

    return updated
  }

  // Clear character data cache - Force reload of character data on next request
  clearCharacterCache() {
    const loader = this.getCharacterLoader()
    if (loader) {
      loader.clearCache()
    }
  }

  // Get performance statistics for debugging - Returns cache and loading metrics
  getPerformanceStats() {
    const loader = this.getCharacterLoader()
    if (!loader) {
      return {
        cacheSize: 0,
        loadingPromises: 0,
        basicDataLoaded: false
      }
    }
    return {
      cacheSize: loader.detailedCache.size,
      loadingPromises: loader.loadingPromises.size,
      basicDataLoaded: !!loader.basicCharacters
    }
  }
}

// Initialize global game state instances - Make OptimizedGameState available globally
window.OptimizedGameState = new OptimizedGameState()
window.GameState = window.OptimizedGameState
