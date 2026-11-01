import { useHeroInventoryStore } from '../features/inventory/useInventoryStore';
import { HeroStatsCalculator } from '../features/character/heroStatsCalculator';
import { MASTER_ITEMS_CATALOG, getItemDef, RARITY_CONFIG } from '../features/inventory/data/itemsCatalog';
import { HERO_SKILLS_CATALOG, getSkillDef } from '../features/skills/data/skillsCatalog';
import { useProgressStore } from '../game/state/useProgressStore';
import { createDefaultProgress } from '../services/persistence/persistenceService';
import type { EquipmentSlot, InventoryItem } from '../types/inventory';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  } else {
    console.log(`  ✓ ${msg}`);
  }
}

async function runPhase6Tests() {
  console.log('===============================================================');
  console.log('🚀 RUNNING PHASE 6: INVENTORY, EQUIPMENT & HERO DEVELOPMENT');
  console.log('===============================================================');

  // Initialize progress store for test
  useProgressStore.setState({
    currentProgress: createDefaultProgress('player_tony_hero', 'grade-2'),
  });

  // TEST 1: Master Items Catalog Integrity & Rarity
  console.log('\n--- TEST 1: Master Items Catalog & Rarity ---');
  const weapons = MASTER_ITEMS_CATALOG.filter((i) => i.category === 'weapons');
  const armors = MASTER_ITEMS_CATALOG.filter((i) => i.category === 'armor');
  const accessories = MASTER_ITEMS_CATALOG.filter((i) => i.category === 'accessories');
  const consumables = MASTER_ITEMS_CATALOG.filter((i) => i.category === 'consumables');
  const questItems = MASTER_ITEMS_CATALOG.filter((i) => i.category === 'quest_items');

  assert(weapons.length >= 5, `Catalog contains at least 5 weapons (found ${weapons.length})`);
  assert(armors.length >= 5, `Catalog contains at least 5 armor/defense items (found ${armors.length})`);
  assert(accessories.length >= 4, `Catalog contains at least 4 accessories (found ${accessories.length})`);
  assert(consumables.length >= 6, `Catalog contains at least 6 consumables (found ${consumables.length})`);
  assert(questItems.length >= 2, `Catalog contains quest items (found ${questItems.length})`);

  // Verify 5 Rarities
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
  for (const r of rarities) {
    assert(!!RARITY_CONFIG[r], `Rarity [${r}] is configured with label: ${RARITY_CONFIG[r].labelVi}`);
  }

  // TEST 2: Inventory Store Operations (Add, Remove, Stack)
  console.log('\n--- TEST 2: Inventory Store Operations ---');
  const invStore = useHeroInventoryStore.getState();
  invStore.setCampaign('grade-2');

  const testPotion: InventoryItem = {
    ...getItemDef('con-potion-hp-small')!,
    id: 'test-stackable-potion',
    quantity: 2,
    stackable: true,
  };

  invStore.addItem(testPotion, 2, 'grade-2');
  let itemsG2 = invStore.getItems('grade-2');
  let found = itemsG2.find((i) => i.id === 'test-stackable-potion');
  assert(!!found && found.quantity === 2, 'Item added to inventory successfully');

  // Test stacking
  invStore.addItem(testPotion, 3, 'grade-2');
  itemsG2 = invStore.getItems('grade-2');
  found = itemsG2.find((i) => i.id === 'test-stackable-potion');
  assert(!!found && found.quantity === 5, 'Stackable item incremented to 5');

  // Test partial remove
  invStore.removeItem('test-stackable-potion', 2, 'grade-2');
  itemsG2 = invStore.getItems('grade-2');
  found = itemsG2.find((i) => i.id === 'test-stackable-potion');
  assert(!!found && found.quantity === 3, 'Item quantity decremented to 3');

  // Test full remove
  invStore.removeItem('test-stackable-potion', 3, 'grade-2');
  itemsG2 = invStore.getItems('grade-2');
  found = itemsG2.find((i) => i.id === 'test-stackable-potion');
  assert(!found, 'Item completely removed when quantity reaches 0');

  // TEST 3: Equipment System & 8 Slots Integrity
  console.log('\n--- TEST 3: 8 Equipment Slots & Restrictions ---');
  const eqG2 = invStore.getEquipment('grade-2');
  const expectedSlots: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'gloves', 'boots', 'shield', 'ring', 'amulet'];
  for (const s of expectedSlots) {
    assert(s in eqG2, `Equipment loadout includes slot: [${s}]`);
  }

  // Level requirement check: try to equip high level item on level 1
  const legendarySword = getItemDef('wp-sword-sunfire-legend')!; // requires level 5
  invStore.addItem(legendarySword, 1, 'grade-2');

  // Temporarily set progress level to 1
  if (useProgressStore.getState().currentProgress) {
    useProgressStore.getState().currentProgress!.heroLevel = 1;
  }

  const rejectEquip = invStore.equipItem(legendarySword.id, 'weapon', 'grade-2');
  assert(rejectEquip.success === false, `Level requirement enforced: ${rejectEquip.message}`);

  // Level up progress to level 5 to allow equip
  if (useProgressStore.getState().currentProgress) {
    useProgressStore.getState().currentProgress!.heroLevel = 5;
  }

  const prevEquippedWeapon = invStore.getEquipment('grade-2').weapon;
  const allowEquip = invStore.equipItem(legendarySword.id, 'weapon', 'grade-2');
  assert(allowEquip.success === true, `Equip succeeded when level requirement is met`);
  assert(invStore.getEquipment('grade-2').weapon?.id === legendarySword.id, 'Weapon slot updated with new sword');

  // Verify previous weapon was placed back into inventory
  if (prevEquippedWeapon) {
    const returned = invStore.getItems('grade-2').find((i) => i.id === prevEquippedWeapon.id);
    assert(!!returned, `Old weapon [${prevEquippedWeapon.name}] returned to inventory`);
  }

  // Unequip weapon
  const unequipRes = invStore.unequipItem('weapon', 'grade-2');
  assert(unequipRes.success === true, `Unequipped weapon successfully`);
  assert(invStore.getEquipment('grade-2').weapon === null, 'Weapon slot is now empty');

  // TEST 4: Character Stat Calculations (Base + Equipment = Final)
  console.log('\n--- TEST 4: Character Stat Calculation Formulas ---');
  const statsLvl1G2 = HeroStatsCalculator.calculate(1, 'grade-2', {});
  assert(statsLvl1G2.base.maxHp === 150, 'Grade 2 Level 1 Base HP is 150');
  assert(statsLvl1G2.base.attack === 25, 'Grade 2 Level 1 Base ATK is 25');
  assert(statsLvl1G2.base.defense === 15, 'Grade 2 Level 1 Base DEF is 15');
  assert(statsLvl1G2.base.magicPower === 20, 'Grade 2 Level 1 Base MAG is 20');

  const statsLvl3G2 = HeroStatsCalculator.calculate(3, 'grade-2', {});
  // Level 3 = Level 1 + 2 * (25 HP, 6 ATK, 4 DEF, 5 MAG)
  assert(statsLvl3G2.base.maxHp === 200, 'Grade 2 Level 3 Base HP is 200 (150 + 2*25)');
  assert(statsLvl3G2.base.attack === 37, 'Grade 2 Level 3 Base ATK is 37 (25 + 2*6)');
  assert(statsLvl3G2.base.defense === 23, 'Grade 2 Level 3 Base DEF is 23 (15 + 2*4)');

  // Test Equipment stat additions
  const mockGear = {
    weapon: getItemDef('wp-sword-verdant')!, // +26 ATK, +5% Crit
    shield: getItemDef('arm-shield-valour')!, // +14 DEF, +35 HP
  };
  const statsWithGear = HeroStatsCalculator.calculate(1, 'grade-2', mockGear);
  assert(statsWithGear.finalStats.attack === 25 + 26, 'Final ATK = Base (25) + Sword (26) = 51');
  assert(statsWithGear.finalStats.defense === 15 + 14, 'Final DEF = Base (15) + Shield (14) = 29');
  assert(statsWithGear.finalStats.maxHp === 150 + 35, 'Final HP = Base (150) + Shield (35) = 185');
  assert(statsWithGear.finalStats.critChancePercent === 10, 'Crit Chance = Base (5%) + Sword (5%) = 10%');

  // TEST 5: Skill System & Progression
  console.log('\n--- TEST 5: Skill System Catalog & Unlocks ---');
  assert(HERO_SKILLS_CATALOG.length === 5, '5 Core RPG Hero Skills defined');
  const swordStrike = getSkillDef('skill-sword-strike')!;
  const powerSlash = getSkillDef('skill-power-slash')!;
  const magicBlast = getSkillDef('skill-magic-blast')!;
  const shieldGuard = getSkillDef('skill-shield-guard')!;
  const healingLight = getSkillDef('skill-healing-light')!;

  assert(swordStrike.levelRequirement === 1 && swordStrike.mpCost === 0, 'Sword Strike: Level 1, 0 MP');
  assert(powerSlash.levelRequirement === 2 && powerSlash.mpCost === 15, 'Power Slash: Level 2, 15 MP');
  assert(magicBlast.levelRequirement === 3 && magicBlast.mpCost === 25, 'Magic Blast: Level 3, 25 MP');
  assert(shieldGuard.levelRequirement === 4 && shieldGuard.mpCost === 15, 'Shield Guard: Level 4, 15 MP');
  assert(healingLight.levelRequirement === 5 && healingLight.mpCost === 30, 'Healing Light: Level 5, 30 MP');

  // Test dynamic unlock check based on hero level
  if (useProgressStore.getState().currentProgress) {
    useProgressStore.getState().currentProgress!.heroLevel = 2;
  }
  const skillsAtLvl2 = invStore.getSkills('grade-2');
  const s1 = skillsAtLvl2.find((s) => s.id === 'skill-sword-strike');
  const s2 = skillsAtLvl2.find((s) => s.id === 'skill-power-slash');
  const s3 = skillsAtLvl2.find((s) => s.id === 'skill-magic-blast');
  assert(s1?.isUnlocked === true, 'Sword Strike unlocked at Level 2');
  assert(s2?.isUnlocked === true, 'Power Slash unlocked at Level 2');
  assert(s3?.isUnlocked === false, 'Magic Blast remains locked at Level 2');

  // TEST 6: Consumables & Safe Consumption Rules
  console.log('\n--- TEST 6: Consumables & Safe Consumption Rules ---');
  const hpPotion = getItemDef('con-potion-hp-small')!;
  invStore.addItem(hpPotion, 2, 'grade-2');

  // Should reject using potion if HP is already full
  const fullHpStats = invStore.getCalculatedStats('grade-2');
  const rejectFullHp = invStore.useConsumable(hpPotion.id, fullHpStats.finalStats.maxHp, fullHpStats.finalStats.maxMp, 'grade-2');
  assert(rejectFullHp.success === false, `Rejected potion when HP is full: ${rejectFullHp.message}`);

  // Allow using potion when injured
  const allowInjured = invStore.useConsumable(hpPotion.id, fullHpStats.finalStats.maxHp - 50, fullHpStats.finalStats.maxMp, 'grade-2');
  assert(allowInjured.success === true && allowInjured.healHp === 45, 'Allowed potion when injured, healed +45 HP');

  // TEST 7: Merchant Shop Transactions (Buy & Sell)
  console.log('\n--- TEST 7: Shop Transactions & Quest Item Protection ---');
  if (useProgressStore.getState().currentProgress) {
    useProgressStore.getState().currentProgress!.goldCoins = 100;
  }

  const buyItemTarget = getItemDef('arm-gloves-steel')!; // buyPrice = 55
  const buyRes = invStore.buyItem(buyItemTarget, 1, 'grade-2');
  assert(buyRes.success === true, `Purchased gloves: ${buyRes.message}`);
  assert(useProgressStore.getState().currentProgress!.goldCoins === 45, 'Gold accurately deducted (100 - 55 = 45)');

  // Try buying expensive item without enough gold
  const expensiveItem = getItemDef('wp-sword-sunfire-legend')!; // buyPrice = 800
  const rejectGold = invStore.buyItem(expensiveItem, 1, 'grade-2');
  assert(rejectGold.success === false, `Rejected purchase when insufficient gold: ${rejectGold.message}`);

  // Sell item
  const sellRes = invStore.sellItem(buyItemTarget.id, 1, 'grade-2');
  assert(sellRes.success === true, `Sold gloves (+${buyItemTarget.sellPrice} Gold)`);
  assert(useProgressStore.getState().currentProgress!.goldCoins === 45 + buyItemTarget.sellPrice, 'Gold accurately credited on sale');

  // Quest Item Sale Protection: Add quest item, try to sell
  const crystal = getItemDef('qst-energy-crystal')!;
  invStore.addItem(crystal, 1, 'grade-2');
  const rejectQuestSale = invStore.sellItem(crystal.id, 1, 'grade-2');
  assert(rejectQuestSale.success === false, `Quest item cannot be sold: ${rejectQuestSale.message}`);

  // TEST 8: Campaign Data Separation (Grade 2 vs Grade 3)
  console.log('\n--- TEST 8: Grade 2 & Grade 3 Campaign Data Isolation ---');
  const g2Items = invStore.getItems('grade-2');
  const g3Items = invStore.getItems('grade-3');

  invStore.addItem(testPotion, 5, 'grade-2');
  const g2CountAfter = invStore.getItems('grade-2').find((i) => i.id === testPotion.id)?.quantity || 0;
  const g3CountAfter = invStore.getItems('grade-3').find((i) => i.id === testPotion.id)?.quantity || 0;

  assert(g2CountAfter === 5, 'Grade 2 has 5 test potions');
  assert(g3CountAfter === 0, 'Grade 3 inventory has 0 test potions (strict campaign isolation verified)');

  console.log('\n===============================================================');
  console.log('✅ ALL PHASE 6 HERO DEVELOPMENT & INVENTORY TESTS PASSED 100%!');
  console.log('===============================================================\n');
}

runPhase6Tests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
