import { describe, it, expect } from 'vitest';

describe('Historical Records & Chronicle Utilities', () => {
  const sampleRecords = [
    {
      id: "rec-01",
      title: "Alliance with the Goblin Village",
      category: "diplomacy",
      date: "Year 1, Month 1",
      importance: "major",
      participants: ["Rimuru Tempest", "Rigurd", "Goblin Elders"]
    },
    {
      id: "rec-02",
      title: "Subjugation of the Direwolves",
      category: "battle",
      date: "Year 1, Month 2",
      importance: "critical",
      participants: ["Rimuru Tempest", "Ranga", "Direwolf Pack"]
    },
    {
      id: "rec-03",
      title: "Orc Disaster Catastrophe",
      category: "battle",
      date: "Year 1, Month 6",
      importance: "critical",
      participants: ["Rimuru Tempest", "Geld (Orc Lord)", "Benimaru", "Shion", "Lizardmen"]
    },
    {
      id: "rec-04",
      title: "Treaty of Non-Aggression with Dwargon",
      category: "diplomacy",
      date: "Year 1, Month 8",
      importance: "major",
      participants: ["Rimuru Tempest", "King Gazef Dwargo"]
    }
  ];

  it('should filter records by category correctly', () => {
    const battles = sampleRecords.filter(r => r.category === 'battle');
    expect(battles.length).toBe(2);
    expect(battles.map(b => b.id)).toEqual(['rec-02', 'rec-03']);

    const diplomacy = sampleRecords.filter(r => r.category === 'diplomacy');
    expect(diplomacy.length).toBe(2);
  });

  it('should find records involving specific participants', () => {
    const rangaRecords = sampleRecords.filter(r => r.participants.includes('Ranga'));
    expect(rangaRecords.length).toBe(1);
    expect(rangaRecords[0].title).toBe('Subjugation of the Direwolves');

    const rimuruRecords = sampleRecords.filter(r => r.participants.includes('Rimuru Tempest'));
    expect(rimuruRecords.length).toBe(4);
  });

  it('should filter critical importance historical milestones', () => {
    const critical = sampleRecords.filter(r => r.importance === 'critical');
    expect(critical.length).toBe(2);
  });
});
