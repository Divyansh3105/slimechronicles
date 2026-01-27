
class CharacterDataLoader {
  constructor() {
    this.basicCharacters = null
    this.detailedCache = new Map()
    this.loadingPromises = new Map()
    this.batchSize = 10
    this.cacheHits = 0
    this.cacheRequests = 0
  }


  async loadBasicCharacters() {
    if (this.basicCharacters) {
      return this.basicCharacters
    }


    try {
      const response = await fetch('data/characters-basic.json')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Character data is not an array');
      }

      if (data.length === 0) {
        throw new Error('Character data array is empty');
      }


      const validatedData = data.filter(char => {
        if (!char.id || !char.name || !char.race || !char.role) {
          console.warn('Invalid character data:', char);
          return false;
        }
        return true;
      });


      this.basicCharacters = validatedData
      return this.basicCharacters
    } catch (error) {
      console.error('Failed to load basic character data:', error)


      const fallbackData = await this.getFallbackBasicData();
      this.basicCharacters = fallbackData;
      return this.basicCharacters;
    }
  }


  async loadCharacterDetails(characterId) {
    this.cacheRequests++


    if (this.detailedCache.has(characterId)) {
      this.cacheHits++
      return this.detailedCache.get(characterId)
    }


    if (this.loadingPromises.has(characterId)) {
      return this.loadingPromises.get(characterId)
    }


    const loadingPromise = this.fetchCharacterDetails(characterId)
    this.loadingPromises.set(characterId, loadingPromise)

    try {
      const details = await loadingPromise
      this.detailedCache.set(characterId, details)
      this.loadingPromises.delete(characterId)
      return details
    } catch (error) {
      this.loadingPromises.delete(characterId)
      throw error
    }
  }


  async fetchCharacterDetails(characterId) {
    try {
      const response = await fetch(`data/characters/${characterId}.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to load details for character ${characterId}:`, error)

      const basicChar = this.basicCharacters?.find(c => c.id === characterId)
      return basicChar || null
    }
  }


  async loadCharacterBatch(startIndex = 0, batchSize = this.batchSize) {
    const basicChars = await this.loadBasicCharacters()
    if (!basicChars) return []

    const endIndex = Math.min(startIndex + batchSize, basicChars.length)
    return basicChars.slice(startIndex, endIndex)
  }


  async getCharacterCount() {
    const basicChars = await this.loadBasicCharacters()
    return basicChars ? basicChars.length : 0
  }


  async searchCharacters(query) {
    const basicChars = await this.loadBasicCharacters()
    if (!basicChars || !query) return basicChars || []

    const searchTerm = query.toLowerCase()
    return basicChars.filter(char =>
      char.name.toLowerCase().includes(searchTerm) ||
      char.role.toLowerCase().includes(searchTerm) ||
      char.race.toLowerCase().includes(searchTerm)
    )
  }


  async preloadCharacterDetails(characterIds) {
    const promises = characterIds.map(id => this.loadCharacterDetails(id))
    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Some character details failed to preload:', error)
    }
  }


  clearCache() {
    this.detailedCache.clear()
    this.loadingPromises.clear()
  }


  async getFallbackBasicData() {
    try {
      const response = await fetch('data/characters-basic.json');
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('Could not load from JSON file in fallback mode:', error);
    }

    return [
      {
        id: "rimuru",
        name: "Rimuru Tempest",
        race: "True Dragon (Ultimate Slime)",
        role: "Demon Lord & Founder",
        power: "Catastrophe",
        portrait: "🌀",
        image: "assets/characters/Rimuru.png",
        colorScheme: {
          primary: "#00c8ff",
          secondary: "#40d0ff",
          glow: "rgba(0, 200, 255, 0.6)"
        }
      },
      {
        id: "diablo",
        name: "Diablo",
        race: "Daemon (Primordial Black)",
        role: "Second Secretary",
        power: "Catastrophe",
        portrait: "😈",
        image: "assets/characters/Diablo.png",
        colorScheme: {
          primary: "#aa55ff",
          secondary: "#d488ff",
          glow: "rgba(170, 85, 255, 0.8)"
        }
      }
    ]
  }


  getPerformanceMetrics() {
    return {
      basicDataLoaded: !!this.basicCharacters,
      cachedCharacters: this.detailedCache.size,
      activeLoading: this.loadingPromises.size,
      cacheHitRate: this.cacheHits / Math.max(this.cacheRequests, 1),
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  estimateMemoryUsage() {
    let size = 0
    if (this.basicCharacters) {
      size += JSON.stringify(this.basicCharacters).length
    }
    for (const [key, value] of this.detailedCache) {
      size += JSON.stringify(value).length
    }
    return `${(size / 1024).toFixed(2)} KB`
  }
}
window.CharacterLoader = new CharacterDataLoader()
