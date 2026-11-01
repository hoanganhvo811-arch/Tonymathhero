import type { Quest } from '@/types';

export const GRADE_3_SAMPLE_QUESTS: Quest[] = [
  {
    id: 'g3-quest-01',
    campaignId: 'grade-3',
    kingdomId: 'g3-k1-valoria',
    title: 'Phá Vỡ Mật Mã Vạn Số',
    chapter: 1,
    questType: 'main_story',
    storyIntro: 'Cánh cổng pháo đài Valoria yêu cầu giải mã dãy số hàng chục nghìn. Tony hãy thể hiện năng lực của một Đại Hiệp Sĩ!',
    objectiveSummary: 'Giải đúng 3 bài toán về số có 5 chữ số và làm tròn số.',
    requiredCorrectQuestions: 3,
    rewardExp: 150,
    rewardGold: 100,
    rewardGemId: 'gem-g3-1',
    status: 'available',
  },
  {
    id: 'g3-quest-02',
    campaignId: 'grade-3',
    kingdomId: 'g3-k2-multiplex-magnus',
    title: 'Bão Lửa Cửu Chương',
    chapter: 2,
    questType: 'main_story',
    storyIntro: 'Viêm Ma thách thức tốc độ tính cửu chương 7, 8, 9 giữa biển lửa sôi sục.',
    objectiveSummary: 'Hoàn thành 4 phép nhân chia nâng cao chính xác dưới 35 giây mỗi câu.',
    requiredCorrectQuestions: 4,
    rewardExp: 220,
    rewardGold: 150,
    rewardGemId: 'gem-g3-2',
    status: 'locked',
  },
];
