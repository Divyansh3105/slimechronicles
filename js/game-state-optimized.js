class OptimizedGameState {
  constructor() {
    this.STATE_KEY = "juraTempestState"

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
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getAllCharacters');
      return []
    }
    const result = await loader.loadBasicCharacters()
    return result
  }

  async getCharacter(characterId) {
    const loader = this.getCharacterLoader()
    if (!loader) {
      console.error('CharacterLoader not available in getCharacter');
      return null
    }
    const result = await loader.loadCharacterDetails(characterId)
    return result
  }

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
window.OptimizedGameState = new OptimizedGameState()
window.GameState = window.OptimizedGameState
