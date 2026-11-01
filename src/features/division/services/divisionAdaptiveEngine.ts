import type {
  DivisionFact,
  DivisionFactProgress,
  DivisionMasteryLevel,
  DivisionKingdomProgress,
} from '../../../types/division';
import { DIVISION_FACTS } from '../data/divisionCatalog';

export class DivisionAdaptiveEngine {
  /**
   * Determine mastery level based on rigorous pedagogical criteria
   */
  public static calculateMastery(progress: DivisionFactProgress): DivisionMasteryLevel {
    if (progress.attempts === 0) {
      return 'NOT_STARTED';
    }

    const accuracy = progress.attempts > 0 ? progress.correct / progress.attempts : 0;

    // Mastered: at least 3 attempts, >= 85% accuracy, at least 2 consecutive correct
    if (progress.attempts >= 3 && accuracy >= 0.85 && progress.consecutiveCorrect >= 2) {
      return 'MASTERED';
    }

    // Developing: at least 3 attempts, >= 70% accuracy
    if (progress.attempts >= 3 && accuracy >= 0.7) {
      return 'DEVELOPING';
    }

    return 'LEARNING';
  }

  /**
   * Update progress for a division fact after an attempt
   */
  public static recordAttempt(
    currentProgress: DivisionFactProgress | undefined,
    factId: string,
    isCorrect: boolean,
    isFirstAttempt: boolean,
    responseTimeMs: number,
    usedHint: boolean
  ): DivisionFactProgress {
    const existing: DivisionFactProgress = currentProgress || {
      factId,
      attempts: 0,
      correct: 0,
      firstAttemptCorrect: 0,
      lastPracticed: new Date().toISOString(),
      masteryLevel: 'NOT_STARTED',
      consecutiveCorrect: 0,
      avgResponseTimeMs: 0,
      hintCount: 0,
      linkedMultiplicationMistakes: 0,
    };

    const newAttempts = existing.attempts + 1;
    const newCorrect = existing.correct + (isCorrect ? 1 : 0);
    const newFirstAttemptCorrect = existing.firstAttemptCorrect + (isFirstAttempt && isCorrect ? 1 : 0);
    const newConsecutiveCorrect = isCorrect ? existing.consecutiveCorrect + 1 : 0;
    const newHintCount = existing.hintCount + (usedHint ? 1 : 0);

    const newAvgTime =
      existing.attempts === 0
        ? responseTimeMs
        : Math.round((existing.avgResponseTimeMs * existing.attempts + responseTimeMs) / newAttempts);

    const updated: DivisionFactProgress = {
      ...existing,
      attempts: newAttempts,
      correct: newCorrect,
      firstAttemptCorrect: newFirstAttemptCorrect,
      lastPracticed: new Date().toISOString(),
      consecutiveCorrect: newConsecutiveCorrect,
      avgResponseTimeMs: newAvgTime,
      hintCount: newHintCount,
      masteryLevel: 'LEARNING',
    };

    updated.masteryLevel = this.calculateMastery(updated);
    return updated;
  }

  /**
   * Identify weak division facts (accuracy < 75% or recent consecutive mistake)
   */
  public static getWeakFacts(
    allFacts: DivisionFact[],
    progressMap: Record<string, DivisionFactProgress>
  ): DivisionFact[] {
    return allFacts.filter((fact) => {
      const p = progressMap[fact.id];
      if (!p || p.attempts === 0) return false;
      const acc = p.correct / p.attempts;
      return acc < 0.75 || p.consecutiveCorrect === 0 || p.linkedMultiplicationMistakes > 0;
    });
  }

  /**
   * Smart selector that prioritizes weak facts (50%), developing/unpracticed (30%), review (20%)
   */
  public static selectSmartFacts(
    allFacts: DivisionFact[],
    progressMap: Record<string, DivisionFactProgress>,
    count: number,
    linkedMultiplicationWeakFactIds?: string[]
  ): DivisionFact[] {
    const weakFacts: DivisionFact[] = [];
    const learningOrNewFacts: DivisionFact[] = [];
    const masteredFacts: DivisionFact[] = [];

    // Check if fact is linked to a weak multiplication fact
    const linkedSet = new Set(linkedMultiplicationWeakFactIds || []);

    for (const fact of allFacts) {
      const p = progressMap[fact.id];
      const isLinkedWeak = linkedSet.has(fact.multiplicationFactId);

      if (isLinkedWeak) {
        weakFacts.push(fact);
        continue;
      }

      if (!p || p.attempts === 0) {
        learningOrNewFacts.push(fact);
      } else {
        const acc = p.correct / p.attempts;
        if (acc < 0.75 || p.masteryLevel === 'LEARNING') {
          weakFacts.push(fact);
        } else if (p.masteryLevel === 'DEVELOPING') {
          learningOrNewFacts.push(fact);
        } else {
          masteredFacts.push(fact);
        }
      }
    }

    const selected: DivisionFact[] = [];
    const targetWeak = Math.round(count * 0.5);
    const targetNew = Math.round(count * 0.3);
    const targetMastered = count - targetWeak - targetNew;

    // 1. Pick weak facts
    const shuffledWeak = [...weakFacts].sort(() => Math.random() - 0.5);
    selected.push(...shuffledWeak.slice(0, targetWeak));

    // 2. Pick new or developing facts
    const shuffledNew = [...learningOrNewFacts].sort(() => Math.random() - 0.5);
    selected.push(...shuffledNew.slice(0, targetNew));

    // 3. Pick mastered facts
    const shuffledMastered = [...masteredFacts].sort(() => Math.random() - 0.5);
    selected.push(...shuffledMastered.slice(0, targetMastered));

    // Fill remaining if needed
    if (selected.length < count) {
      const remaining = allFacts.filter((f) => !selected.includes(f));
      const shuffledRem = remaining.sort(() => Math.random() - 0.5);
      selected.push(...shuffledRem.slice(0, count - selected.length));
    }

    return selected.slice(0, count);
  }

  /**
   * Calculate overall division mastery summary for dashboard
   */
  public static getMasterySummary(
    allFacts: DivisionFact[],
    progressMap: Record<string, DivisionFactProgress>
  ) {
    let notStarted = 0;
    let learning = 0;
    let developing = 0;
    let mastered = 0;
    let totalAttempts = 0;
    let totalCorrect = 0;

    for (const fact of allFacts) {
      const p = progressMap[fact.id];
      if (!p || p.attempts === 0) {
        notStarted++;
      } else {
        totalAttempts += p.attempts;
        totalCorrect += p.correct;
        if (p.masteryLevel === 'MASTERED') mastered++;
        else if (p.masteryLevel === 'DEVELOPING') developing++;
        else learning++;
      }
    }

    const accuracyPercent = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const masteryPercent = allFacts.length > 0 ? Math.round((mastered / allFacts.length) * 100) : 0;

    return {
      totalFacts: allFacts.length,
      notStarted,
      learning,
      developing,
      mastered,
      totalAttempts,
      totalCorrect,
      accuracyPercent,
      masteryPercent,
    };
  }
}
