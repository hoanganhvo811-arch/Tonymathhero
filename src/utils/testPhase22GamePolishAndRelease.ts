import { persistenceService } from '../services/persistence/persistenceService';
import { useSettingsStore } from '../game/state/useSettingsStore';
import { FinalAdaptiveEngine } from '../features/final-campaign/services/finalAdaptiveEngine';
import { GRADE_2_KINGDOMS } from '../campaigns/grade-2/data/kingdoms';
import { GRADE_3_KINGDOMS } from '../campaigns/grade-3/data/kingdoms';
import { PATTERN_TASKS_CATALOG } from '../features/logic-thinking/data/patternTasksCatalog';
import { FINAL_MATH_TRIALS } from '../features/final-campaign/data/finalTrialsCatalog';
import { LORD_ZERO_PHASES_CONFIG, LORD_ZERO_SPELLS } from '../features/final-campaign/data/lordZeroBossCatalog';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('🧪 Starting Phase 22 (Game Polish & Release) Comprehensive Audit Suite...\n');

// 1. Test Settings & Audio Clamping
console.log('Test 1: Game Settings, Audio Clamping & Graphics Quality');
const settingsStore = useSettingsStore.getState();
assert(typeof settingsStore.setVolume === 'function', 'setVolume function missing');
assert(typeof settingsStore.toggleMute === 'function', 'toggleMute function missing');
assert(typeof settingsStore.setGraphicsQuality === 'function', 'setGraphicsQuality function missing');

const initialSettings = settingsStore.settings;
assert(initialSettings.masterVolume >= 0 && initialSettings.masterVolume <= 100, 'Master volume out of range');
assert(initialSettings.bgmVolume >= 0 && initialSettings.bgmVolume <= 100, 'BGM volume out of range');
assert(initialSettings.sfxVolume >= 0 && initialSettings.sfxVolume <= 100, 'SFX volume out of range');
assert(['cinematic', 'high', 'medium', 'low'].includes(initialSettings.graphicsQuality), 'Invalid graphics quality');
console.log('✅ Passed Test 1: Game Settings & Audio verified.\n');

// 2. Test Persistence Backup & Restore (Schema 22.0.0)
console.log('Test 2: Persistence Backup, Export & Restore Mechanism');
const backupJson = persistenceService.exportBackupData();
assert(typeof backupJson === 'string', 'Backup data must be string');
const parsed = JSON.parse(backupJson);
assert(parsed.appName === 'TONY_MATH_HERO', 'App name mismatch in backup');
assert(parsed.schemaVersion === '22.0.0', 'Schema version must be 22.0.0');
assert(typeof parsed.data === 'object', 'Backup data must be an object');

// Test import with valid structure
const importRes = persistenceService.importBackupData(backupJson);
assert(importRes.success === true, 'Import of valid backup must succeed');

// Test import with invalid corrupted JSON
const badImportRes = persistenceService.importBackupData('{"invalid": true}');
assert(badImportRes.success === false, 'Import of invalid data must fail gracefully');
console.log('✅ Passed Test 2: Persistence Backup & Restore verified.\n');

// 3. Test Seven Kingdoms Structure for Grade 2 and Grade 3
console.log('Test 3: Seven Kingdoms Structure (Grade 2 vs Grade 3)');
assert(GRADE_2_KINGDOMS.length === 7, `Expected 7 Grade 2 kingdoms, got ${GRADE_2_KINGDOMS.length}`);
assert(GRADE_3_KINGDOMS.length === 7, `Expected 7 Grade 3 kingdoms, got ${GRADE_3_KINGDOMS.length}`);
GRADE_2_KINGDOMS.forEach((k, idx) => {
  assert(k.order === idx + 1, `Grade 2 kingdom ${k.id} order mismatch`);
  assert(k.gem && k.gem.name.length > 0, `Grade 2 kingdom ${k.id} missing gem`);
});
GRADE_3_KINGDOMS.forEach((k, idx) => {
  assert(k.order === idx + 1, `Grade 3 kingdom ${k.id} order mismatch`);
  assert(k.gem && k.gem.name.length > 0, `Grade 3 kingdom ${k.id} missing gem`);
});
console.log('✅ Passed Test 3: Seven Kingdoms integrity verified.\n');

// 4. Test Final Campaign & Lord Zero Configuration
console.log('Test 4: Final Campaign & Lord Zero Configuration');
assert(LORD_ZERO_PHASES_CONFIG.length === 5, 'Expected 5 phases for Lord Zero');
assert(LORD_ZERO_SPELLS.length === 20, 'Expected 20 spells for Lord Zero');
assert(FINAL_MATH_TRIALS.length === 10, 'Expected 10 Dark Kingdom preparatory trials');
FINAL_MATH_TRIALS.forEach((trial) => {
  assert(trial.options.length >= 2, `Trial ${trial.id} options length < 2`);
  assert(trial.correctIndex >= 0 && trial.correctIndex < trial.options.length, `Trial ${trial.id} invalid correctIndex`);
});
console.log('✅ Passed Test 4: Final Campaign & Lord Zero verified.\n');

// 5. Test Logic & Critical Thinking Questions Accuracy
console.log('Test 5: Logic & Critical Thinking Catalog Quality');
assert(PATTERN_TASKS_CATALOG.length === 12, 'Expected 12 pattern tasks');
PATTERN_TASKS_CATALOG.forEach((task) => {
  assert(task.sequenceElements.length > 0, `Task ${task.id} empty sequence`);
  assert(task.explanationVi.length > 10, `Task ${task.id} missing thorough explanation`);
});
console.log('✅ Passed Test 5: Logic & Critical Thinking verified.\n');

// 6. Test Hero Journey Stats & Analytics Engine
console.log('Test 6: Hero Journey Stats & Accurate Formula');
const stats = FinalAdaptiveEngine.aggregateHeroJourneyStats('grade-2');
assert(stats.rescuedKingdomsCount === 7, 'Expected 7 rescued kingdoms');
assert(stats.knowledgeCrystalsCount === 7, 'Expected 7 knowledge crystals');
assert(stats.milestones.length === 6, 'Expected 6 historic milestones');
assert(stats.mathAccuracyPercent >= 0 && stats.mathAccuracyPercent <= 100, 'Accuracy percentage must be 0-100');
console.log('✅ Passed Test 6: Hero Journey Stats verified.\n');

// 7. Test Crystal Shield Mechanic & Fault Tolerance
console.log('Test 7: Knowledge Crystal Shield Fault Tolerance');
assert(FinalAdaptiveEngine.calculateCrystalShields(7) === 7, '7 crystals must grant 7 shields');
assert(FinalAdaptiveEngine.calculateCrystalShields(0) === 1, 'Minimum 1 fallback shield must be granted');
console.log('✅ Passed Test 7: Crystal Shield fault tolerance verified.\n');

console.log('🎉 ALL 7/7 PHASE 22 AUDIT AND POLISH TESTS PASSED FLAWLESSLY! 🎉');
