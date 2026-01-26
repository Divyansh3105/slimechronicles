
class OptimizedGameState {
  constructor() {
    this.STATE_KEY = "juraTempestState"
    console.log('OptimizedGameState constructor - will access CharacterLoader lazily');
    
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

  
  getCharacterLoader() {
    if (!window.CharacterLoader) {
      console.error('CharacterLoader not available');
      return null;
    }
    return window.CharacterLoader;
  }

  
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

  
  update(updates) {
    const currentState = this.load()
    const newState = { ...currentState, ...updates }
    return this.save(newState)
  }

  
  get() {
    return this.load()
  }

  
  async getAllCharacters() {
    console.log('getAllCharacters called');
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getAllCharacters');
      return []
    }
    const result = await loader.loadBasicCharacters()
    console.log('getAllCharacters result:', result?.length || 0, 'characters');
    return result
  }

  
  async getCharacter(characterId) {
    console.log('getCharacter called with ID:', characterId);
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getCharacter');
      return null
    }
    const result = await loader.loadCharacterDetails(characterId)
    console.log('getCharacter result:', !!result);
    return result
  }

  
  async getBasicCharacter(characterId) {
    console.log('getBasicCharacter called with ID:', characterId);
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getBasicCharacter');
      return null
    }
    const basicChars = await loader.loadBasicCharacters()
    console.log('Basic characters loaded:', basicChars?.length || 0);
    const result = basicChars?.find(c => c.id === characterId) || null
    console.log('getBasicCharacter result:', !!result, result?.name);
    return result
  }

  
  async searchCharacters(query) {
    const loader = this.getCharacterLoader()
    if (!loader) return []
    return await loader.searchCharacters(query)
  }

  
  async getCharacterBatch(startIndex = 0, batchSize = 10) {
    const loader = this.getCharacterLoader()
    if (!loader) return []
    return await loader.loadCharacterBatch(startIndex, batchSize)
  }

  
  async getCharacterCount() {
    const loader = this.getCharacterLoader()
    if (!loader) return 0
    return await loader.getCharacterCount()
  }

  
  async preloadCharacters(characterIds) {
    const loader = this.getCharacterLoader()
    if (!loader) return
    return await loader.preloadCharacterDetails(characterIds)
  }

  
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

  
  getCharacterCustomName(characterId) {
    const state = this.load()
    return state.customCharacterNames?.[characterId] || null
  }

  
  checkAchievements(state) {
    const achievements = [...(state.achievements || [])]
    let updated = false

    
    const checks = [
      { id: "military_power", condition: state.military >= 70 },
      { id: "economic_boom", condition: state.economy >= 80 },
      { id: "magic_mastery", condition: state.magic >= 70 },
      { id: "population_growth", condition: state.population >= 5000 },
    ]

    checks.forEach((check) => {
      if (check.condition && !achievements.includes(check.id)) {
        achievements.push(check.id)
        updated = true
      }
    })

    if (updated) {
      this.update({ achievements })
    }

    return updated
  }

  
  clearCharacterCache() {
    const loader = this.getCharacterLoader()
    if (loader) {
      loader.clearCache()
    }
  }

  
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
console.log('Creating OptimizedGameState instance...');
window.OptimizedGameState = new OptimizedGameState()
console.log('OptimizedGameState created:', window.OptimizedGameState);
window.GameState = window.OptimizedGameState
console.log('GameState set up:', window.GameState);
