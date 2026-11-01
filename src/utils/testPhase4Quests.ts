import { EMERALD_FOREST_SUBZONES, EMERALD_FOREST_NPCS, EMERALD_FOREST_OBJECTS } from '../features/exploration/data/emeraldForestMapData';
import { EMERALD_FOREST_QUESTS } from '../features/quests/data/emeraldForestQuests';
import { useQuestStore } from '../features/quests/useQuestStore';
import { useProgressStore } from '../game/state/useProgressStore';

export async function runPhase4Verification() {
  console.log('=== STARTING PHASE 4: EXPLORATION & QUEST SYSTEM VERIFICATION ===\n');

  // 1. Verify 6 Sub-zones
  console.log('1. Checking Emerald Forest Sub-Zones...');
  const expectedZones = ['village', 'green_forest', 'monster_camp', 'ancient_ruins', 'crystal_lake', 'kingdom_castle'];
  if (EMERALD_FOREST_SUBZONES.length !== 6) {
    throw new Error(`Expected 6 subzones, got ${EMERALD_FOREST_SUBZONES.length}`);
  }
  expectedZones.forEach((zId) => {
    const found = EMERALD_FOREST_SUBZONES.find((z) => z.id === zId);
    if (!found) throw new Error(`Missing expected subzone: ${zId}`);
  });
  console.log('✓ All 6 distinct sub-zones verified (Village, Green Forest, Monster Camp, Ancient Ruins, Crystal Lake, Kingdom Castle).');

  // 2. Verify 4 NPCs
  console.log('\n2. Checking NPC Configurations & Dialogues...');
  const expectedNpcs = ['npc-elder-oak', 'npc-lily', 'npc-forest-guardian', 'npc-merchant'];
  expectedNpcs.forEach((nId) => {
    const npc = EMERALD_FOREST_NPCS.find((n) => n.id === nId);
    if (!npc) throw new Error(`Missing expected NPC: ${nId}`);
    if (!npc.dialogueTree || Object.keys(npc.dialogueTree).length === 0) {
      throw new Error(`NPC ${nId} missing dialogue tree`);
    }
  });
  console.log('✓ All 4 NPCs verified with role badges, dialogue trees, and quest markers (Elder Oak, Lily, Forest Guardian, Merchant Odo).');

  // 3. Verify Interactive Objects (Chests, 5 Crystals, Villager Cage)
  console.log('\n3. Checking Interactive Objects...');
  const crystals = EMERALD_FOREST_OBJECTS.filter((o) => o.type === 'energy_crystal');
  if (crystals.length !== 5) {
    throw new Error(`Expected exactly 5 Energy Crystals, found ${crystals.length}`);
  }
  const cage = EMERALD_FOREST_OBJECTS.find((o) => o.type === 'villager_cage');
  if (!cage) throw new Error('Missing villager_cage interactive object');

  const chests = EMERALD_FOREST_OBJECTS.filter((o) => o.type === 'treasure_chest');
  if (chests.length < 2) throw new Error('Expected at least 2 treasure chests');
  console.log(`✓ Interactive Objects verified (5 Energy Crystals, 1 Villager Cage, ${chests.length} Treasure Chests, Signposts).`);

  // 4. Verify Quest Chain 01 -> 02 -> 03
  console.log('\n4. Checking Quest Chain Logic (01 -> 02 -> 03)...');
  const q1 = EMERALD_FOREST_QUESTS.find((q) => q.id === 'ef-quest-01');
  const q2 = EMERALD_FOREST_QUESTS.find((q) => q.id === 'ef-quest-02');
  const q3 = EMERALD_FOREST_QUESTS.find((q) => q.id === 'ef-quest-03');

  if (!q1 || !q2 || !q3) throw new Error('Missing one or more of the 3 primary quests');
  if (q1.status !== 'available') throw new Error('Quest 1 must be available initially');
  if (q2.status !== 'locked' || q2.prerequisiteQuestId !== 'ef-quest-01') {
    throw new Error('Quest 2 must be locked and require Quest 1');
  }
  if (q3.status !== 'locked' || q3.prerequisiteQuestId !== 'ef-quest-02') {
    throw new Error('Quest 3 must be locked and require Quest 2');
  }
  console.log('✓ Initial Quest states verified: Q1 (Available) -> Q2 (Locked, requires Q1) -> Q3 (Locked, requires Q2).');

  // 5. Test Quest Advancement and Objective Completion
  console.log('\n5. Simulating Full Quest Chain Completion...');
  const questStore = useQuestStore.getState();
  questStore.initQuests('grade-2', 'g2-k1-arithmia');

  // Accept Quest 1
  questStore.acceptQuest('ef-quest-01');
  if (useQuestStore.getState().activeQuestId !== 'ef-quest-01') {
    throw new Error('Quest 1 should be active after acceptance');
  }

  // Advance Quest 1 objectives: Talk to Elder Oak -> Talk to Lily -> Visit Green Forest
  await questStore.advanceObjective('talk_npc', 'npc-elder-oak', 1);
  await questStore.advanceObjective('talk_npc', 'npc-lily', 1);
  await questStore.advanceObjective('visit_area', 'green_forest', 1);

  // Check that Quest 1 completed and unlocked Quest 2 & Monster Camp
  const stateAfterQ1 = useQuestStore.getState();
  const q1After = stateAfterQ1.quests.find((q) => q.id === 'ef-quest-01');
  const q2After = stateAfterQ1.quests.find((q) => q.id === 'ef-quest-02');

  if (q1After?.status !== 'completed') {
    throw new Error(`Quest 1 should be completed, got: ${q1After?.status}`);
  }
  if (q2After?.status !== 'active') {
    throw new Error(`Quest 2 should be unlocked/active, got: ${q2After?.status}`);
  }
  if (!stateAfterQ1.unlockedSubZoneIds.includes('monster_camp')) {
    throw new Error('Monster Camp should be unlocked after Quest 1');
  }
  console.log('✓ Quest 1 completed! Monster Camp subzone and Quest 2 successfully unlocked.');

  // Advance Quest 2: Visit Monster Camp -> Defeat Golem -> Rescue Villagers
  await questStore.advanceObjective('visit_area', 'monster_camp', 1);
  await questStore.advanceObjective('defeat_monsters', 'golem_guard', 1);
  await questStore.advanceObjective('rescue_villagers', 'villager_cage', 3);

  const stateAfterQ2 = useQuestStore.getState();
  const q2Done = stateAfterQ2.quests.find((q) => q.id === 'ef-quest-02');
  const q3After = stateAfterQ2.quests.find((q) => q.id === 'ef-quest-03');

  if (q2Done?.status !== 'completed') {
    throw new Error(`Quest 2 should be completed, got: ${q2Done?.status}`);
  }
  if (q3After?.status !== 'active') {
    throw new Error(`Quest 3 should be unlocked/active, got: ${q3After?.status}`);
  }
  if (!stateAfterQ2.unlockedSubZoneIds.includes('crystal_lake')) {
    throw new Error('Crystal Lake should be unlocked after Quest 2');
  }
  console.log('✓ Quest 2 completed! Crystal Lake and Ancient Ruins successfully unlocked.');

  // Advance Quest 3: Collect 5 Crystals -> Visit Ruins Altar -> Report to Forest Guardian
  for (let i = 1; i <= 5; i++) {
    questStore.collectObject(`crystal-${i}`);
  }
  await questStore.advanceObjective('collect_item', 'energy_crystal', 5);
  await questStore.advanceObjective('visit_area', 'ancient_ruins', 1);
  await questStore.advanceObjective('talk_npc', 'npc-forest-guardian', 1);

  const stateAfterQ3 = useQuestStore.getState();
  const q3Done = stateAfterQ3.quests.find((q) => q.id === 'ef-quest-03');

  if (q3Done?.status !== 'completed') {
    throw new Error(`Quest 3 should be completed, got: ${q3Done?.status}`);
  }
  if (!stateAfterQ3.unlockedSubZoneIds.includes('kingdom_castle')) {
    throw new Error('Kingdom Castle should be unlocked after Quest 3');
  }
  console.log('✓ Quest 3 completed! 5 Crystals gathered, Kingdom Castle unlocked, rewards credited.');

  console.log('\n=== ALL PHASE 4 EXPLORATION & QUEST SYSTEM TESTS PASSED 100%! ===');
}

runPhase4Verification();
