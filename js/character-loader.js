
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
      console.log('Returning cached basic characters:', this.basicCharacters.length);
      return this.basicCharacters
    }

    console.log('Loading basic characters from data/characters-basic.json...');

    try {
      const response = await fetch('data/characters-basic.json')
      console.log('Fetch response:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Basic characters loaded successfully:', data.length, 'characters');
      console.log('Sample character:', data[0]);

      
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

      console.log('Validated characters:', validatedData.length, 'out of', data.length);

      this.basicCharacters = validatedData
      return this.basicCharacters
    } catch (error) {
      console.error('Failed to load basic character data:', error)
      console.log('Falling back to embedded data...');

      
      const fallbackData = await this.getFallbackBasicData();
      console.log('Using fallback data:', fallbackData.length, 'characters');
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
    console.log('Using embedded fallback character data');
    
    try {
      const response = await fetch('data/characters-basic.json');
      if (response.ok) {
        const data = await response.json();
        console.log('Fallback successfully loaded from JSON file:', data.length, 'characters');
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
        portrait: "�",
        image: "assets/characters/Rimuru.png",
        colorScheme: {
          primary: "#00c8ff",
          secondary: "#40d0ff",
          glow: "rgba(0, 200, 255, 0.6)"
        }
      },
      {
        id: "benimaru",
        name: "Benimaru",
        race: "Divine Oni (Flame Soul Oni)",
        role: "Commander-in-Chief",
        power: "Catastrophe",
        portrait: "🔥",
        image: "assets/characters/Benimaru.png",
        colorScheme: {
          primary: "#ff3366",
          secondary: "#ff6b8a",
          glow: "rgba(255, 51, 102, 0.6)"
        }
      },
      {
        id: "shion",
        name: "Shion",
        race: "Wicked Oni",
        role: "First Secretary",
        power: "Chaos",
        portrait: "⚔️",
        image: "assets/characters/Shion.png",
        colorScheme: {
          primary: "#aa55ff",
          secondary: "#c788ff",
          glow: "rgba(170, 85, 255, 0.6)"
        }
      },
      {
        id: "shuna",
        name: "Shuna",
        race: "Wicked Oni",
        role: "Minister of Production",
        power: "Special S",
        portrait: "🌸",
        image: "assets/characters/Shuna.png",
        colorScheme: {
          primary: "#ffb3d9",
          secondary: "#ffd6ec",
          glow: "rgba(255, 179, 217, 0.6)"
        }
      },
      {
        id: "hakuro",
        name: "Hakuro",
        race: "Divine Oni",
        role: "Sword Oni & Grand Master",
        power: "Catastrophe",
        portrait: "🗡️",
        image: "assets/characters/Hakuro.png",
        colorScheme: {
          primary: "#b0b0b0",
          secondary: "#d0d0d0",
          glow: "rgba(176, 176, 176, 0.6)"
        }
      },
      {
        id: "souei",
        name: "Souei",
        race: "Divine Oni",
        role: "Minister of Intelligence",
        power: "Special S",
        portrait: "🥷",
        image: "assets/characters/Souei.png",
        colorScheme: {
          primary: "#6c7b7f",
          secondary: "#95a5a6",
          glow: "rgba(149, 165, 166, 0.6)"
        }
      },
      {
        id: "geld",
        name: "Geld",
        race: "High Orc",
        role: "Minister of Infrastructure",
        power: "Special S",
        portrait: "🏗️",
        image: "assets/characters/Geld.png",
        colorScheme: {
          primary: "#654321",
          secondary: "#8b7355",
          glow: "rgba(101, 67, 33, 0.6)"
        }
      },
      {
        id: "diablo",
        name: "Diablo",
        race: "Daemon (Primordial Black)",
        role: "Second Secretary",
        power: "Catastrophe",
        portrait: "�",
        image: "assets/characters/Diablo.png",
        colorScheme: {
          primary: "#aa55ff",
          secondary: "#d488ff",
          glow: "rgba(170, 85, 255, 0.8)"
        }
      },
      {
        id: "veldora",
        name: "Veldora Tempest",
        race: "True Dragon",
        role: "Guardian Deity",
        power: "Catastrophe+",
        portrait: "🐉",
        image: "assets/characters/Veldora.png",
        colorScheme: {
          primary: "#ffd700",
          secondary: "#ffed4e",
          glow: "rgba(255, 215, 0, 0.8)"
        }
      },
      {
        id: "milim",
        name: "Milim Nava",
        race: "Dragonoid (True Dragon)",
        role: "Demon Lord Ally",
        power: "Catastrophe+",
        portrait: "⚡",
        image: "assets/characters/Milim.png",
        colorScheme: {
          primary: "#ff1493",
          secondary: "#ff69b4",
          glow: "rgba(255, 20, 147, 0.8)"
        }
      },
      {
        id: "adalmann",
        name: "Adalmann",
        race: "Undead (Archbishop)",
        role: "Undead Commander",
        power: "Special S",
        portrait: "💀",
        image: "assets/characters/Adalmann.png",
        colorScheme: {
          primary: "#4a4a4a",
          secondary: "#6a6a6a",
          glow: "rgba(74, 74, 74, 0.6)"
        }
      },
      {
        id: "apito",
        name: "Apito",
        race: "Honeybee (Queen Bee)",
        role: "Scout & Messenger",
        power: "A-Rank",
        portrait: "🐝",
        image: "assets/characters/Apito.png",
        colorScheme: {
          primary: "#ffd700",
          secondary: "#ffed4e",
          glow: "rgba(255, 215, 0, 0.6)"
        }
      },
      {
        id: "beretta",
        name: "Beretta",
        race: "Golem (Doll)",
        role: "Ramiris's Protector",
        power: "Special S",
        portrait: "🎎",
        image: "assets/characters/Beretta.png",
        colorScheme: {
          primary: "#c0c0c0",
          secondary: "#e0e0e0",
          glow: "rgba(192, 192, 192, 0.6)"
        }
      },
      {
        id: "carrera",
        name: "Carrera",
        race: "Daemon (Primordial)",
        role: "Primordial Demon",
        power: "Catastrophe",
        portrait: "💥",
        image: "assets/characters/Carrera.png",
        colorScheme: {
          primary: "#ff4500",
          secondary: "#ff6347",
          glow: "rgba(255, 69, 0, 0.8)"
        }
      },
      {
        id: "chloe",
        name: "Chloe Aubert",
        race: "Human (Hero)",
        role: "Hero & Time Manipulator",
        power: "Catastrophe+",
        portrait: "⏰",
        image: "assets/characters/Chloe.png",
        colorScheme: {
          primary: "#9370db",
          secondary: "#ba55d3",
          glow: "rgba(147, 112, 219, 0.8)"
        }
      },
      {
        id: "clayman",
        name: "Clayman",
        race: "Demon Lord",
        role: "Former Demon Lord",
        power: "Catastrophe",
        portrait: "🎭",
        image: "assets/characters/Clayman.png",
        colorScheme: {
          primary: "#8b4513",
          secondary: "#a0522d",
          glow: "rgba(139, 69, 19, 0.6)"
        }
      },
      {
        id: "dagruel",
        name: "Dagruel",
        race: "Giant (Giant King)",
        role: "Demon Lord",
        power: "Catastrophe+",
        portrait: "🗿",
        image: "assets/characters/Dagruel.png",
        colorScheme: {
          primary: "#696969",
          secondary: "#808080",
          glow: "rgba(105, 105, 105, 0.8)"
        }
      },
      {
        id: "gabiru",
        name: "Gabiru",
        race: "Lizardman",
        role: "Lizardman Warrior",
        power: "A-Rank",
        portrait: "🦎",
        image: "assets/characters/Gabiru.png",
        colorScheme: {
          primary: "#228b22",
          secondary: "#32cd32",
          glow: "rgba(34, 139, 34, 0.6)"
        }
      },
      {
        id: "gazef",
        name: "Gazef Stronoff",
        race: "Human",
        role: "Human Warrior",
        power: "Special A",
        portrait: "⚔️",
        image: "assets/characters/Gazef.png",
        colorScheme: {
          primary: "#4169e1",
          secondary: "#6495ed",
          glow: "rgba(65, 105, 225, 0.6)"
        }
      },
      {
        id: "guy",
        name: "Guy Crimson",
        race: "Daemon (Primordial Red)",
        role: "Demon Lord",
        power: "Catastrophe+",
        portrait: "👹",
        image: "assets/characters/Guy.png",
        colorScheme: {
          primary: "#8b0000",
          secondary: "#dc143c",
          glow: "rgba(139, 0, 0, 0.8)"
        }
      },
      {
        id: "hinata",
        name: "Hinata Sakaguchi",
        race: "Human (Hero)",
        role: "Hero & Crusader Leader",
        power: "Catastrophe",
        portrait: "⚔️",
        image: "assets/characters/Hinata Sakaguchi.png",
        colorScheme: {
          primary: "#ff69b4",
          secondary: "#ffb6c1",
          glow: "rgba(255, 105, 180, 0.6)"
        }
      },
      {
        id: "kumara",
        name: "Kumara",
        race: "Nine-Tailed Fox",
        role: "Spirit Beast",
        power: "Special S",
        portrait: "🦊",
        image: "assets/characters/Kumara.png",
        colorScheme: {
          primary: "#ff8c00",
          secondary: "#ffa500",
          glow: "rgba(255, 140, 0, 0.6)"
        }
      },
      {
        id: "leon",
        name: "Leon Cromwell",
        race: "Demon Lord",
        role: "Demon Lord",
        power: "Catastrophe+",
        portrait: "👑",
        image: "assets/characters/Leon.png",
        colorScheme: {
          primary: "#4169e1",
          secondary: "#6495ed",
          glow: "rgba(65, 105, 225, 0.8)"
        }
      },
      {
        id: "luminous",
        name: "Luminous Valentine",
        race: "Vampire (Demon Lord)",
        role: "Demon Lord",
        power: "Catastrophe+",
        portrait: "🧛",
        image: "assets/characters/Luminous.png",
        colorScheme: {
          primary: "#8b008b",
          secondary: "#ba55d3",
          glow: "rgba(139, 0, 139, 0.8)"
        }
      },
      {
        id: "ramiris",
        name: "Ramiris",
        race: "Fairy (Fairy Queen)",
        role: "Fairy Queen & Former Demon Lord",
        power: "Catastrophe",
        portrait: "🧚",
        image: "assets/characters/Ramiris.png",
        colorScheme: {
          primary: "#98fb98",
          secondary: "#90ee90",
          glow: "rgba(152, 251, 152, 0.6)"
        }
      },
      {
        id: "ranga",
        name: "Ranga",
        race: "Tempest Wolf",
        role: "Rimuru's Companion",
        power: "Special S",
        portrait: "🐺",
        image: "assets/characters/Ranga.png",
        colorScheme: {
          primary: "#2f4f4f",
          secondary: "#708090",
          glow: "rgba(47, 79, 79, 0.6)"
        }
      },
      {
        id: "rigurd",
        name: "Rigurd",
        race: "Hobgoblin",
        role: "Village Chief",
        power: "B-Rank",
        portrait: "👨",
        image: "assets/characters/Rigurd.png",
        colorScheme: {
          primary: "#8b7355",
          secondary: "#a0826d",
          glow: "rgba(139, 115, 85, 0.6)"
        }
      },
      {
        id: "testarossa",
        name: "Testarossa",
        race: "Daemon (Primordial)",
        role: "Primordial Demon",
        power: "Catastrophe",
        portrait: "🌹",
        image: "assets/characters/Testarossa.png",
        colorScheme: {
          primary: "#dc143c",
          secondary: "#ff1493",
          glow: "rgba(220, 20, 60, 0.8)"
        }
      },
      {
        id: "ultima",
        name: "Ultima",
        race: "Daemon (Primordial)",
        role: "Primordial Demon",
        power: "Catastrophe",
        portrait: "🕷️",
        image: "assets/characters/Ultima.png",
        colorScheme: {
          primary: "#8b008b",
          secondary: "#9370db",
          glow: "rgba(139, 0, 139, 0.8)"
        }
      },
      {
        id: "velgrynd",
        name: "Velgrynd",
        race: "True Dragon",
        role: "Scorch Dragon",
        power: "Catastrophe+",
        portrait: "🔥",
        image: "assets/characters/Velgrynd.jpg",
        colorScheme: {
          primary: "#ff4500",
          secondary: "#ff6347",
          glow: "rgba(255, 69, 0, 0.8)"
        }
      },
      {
        id: "velzard",
        name: "Velzard",
        race: "True Dragon",
        role: "Frost Dragon",
        power: "Catastrophe+",
        portrait: "❄️",
        image: "assets/characters/Velzard.jpg",
        colorScheme: {
          primary: "#00ced1",
          secondary: "#40e0d0",
          glow: "rgba(0, 206, 209, 0.8)"
        }
      },
      {
        id: "yuuki",
        name: "Yuuki Kagurazaka",
        race: "Human (Otherworlder)",
        role: "Otherworlder & Strategist",
        power: "Catastrophe",
        portrait: "🎭",
        image: "assets/characters/Yuuki Kagurazaka.png",
        colorScheme: {
          primary: "#9370db",
          secondary: "#ba55d3",
          glow: "rgba(147, 112, 219, 0.6)"
        }
      },
      {
        id: "zegion",
        name: "Zegion",
        race: "Insect (Mystic Insect)",
        role: "Insect Commander",
        power: "Catastrophe",
        portrait: "🦋",
        image: "assets/characters/Zegion.png",
        colorScheme: {
          primary: "#4b0082",
          secondary: "#6a5acd",
          glow: "rgba(75, 0, 130, 0.6)"
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
console.log('Creating CharacterDataLoader instance...');
window.CharacterLoader = new CharacterDataLoader()
console.log('CharacterLoader created:', window.CharacterLoader);
