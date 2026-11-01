import type { StoryCutscene, StoryChapterId } from '../../../types/story';

export interface StoryChapterMeta {
  id: StoryChapterId;
  order: number;
  titleVi: string;
  titleEn: string;
  kingdomId: string;
  summary: string;
  bossId: string;
  crystalId: string;
}

export const STORY_CHAPTERS_CONFIG: StoryChapterMeta[] = [
  {
    id: 'prologue',
    order: 0,
    titleVi: 'Mở Đầu: Lời Tiên Tri Về Hiệp Sĩ Tri Thức',
    titleEn: 'Prologue: The Awakening of Tony',
    kingdomId: 'g2-k1-arithmia',
    summary: 'Chúa tể bóng tối Lord Zero xuất hiện, đánh cắp 7 viên Ngọc Tri Thức và gieo rắc sự hỗn loạn khắp các vương quốc.',
    bossId: 'none',
    crystalId: 'none',
  },
  {
    id: 'chapter-1-emerald',
    order: 1,
    titleVi: 'Chương 1: Tiếng Gọi Từ Rừng Xanh',
    titleEn: 'Chapter 1: The Whispering Forest',
    kingdomId: 'g2-k1-arithmia',
    summary: 'Tony đặt chân đến Ngôi Làng Khởi Nguyên, giải cứu dân làng và hóa giải sự tha hóa của Forest Guardian.',
    bossId: 'boss-emerald-guardian',
    crystalId: 'crystal-emerald',
  },
  {
    id: 'chapter-2-desert',
    order: 2,
    titleVi: 'Chương 2: Ảo Ảnh Sa Mạc Cát Vàng',
    titleEn: 'Chapter 2: The Golden Dunes',
    kingdomId: 'g2-k2-chronos',
    summary: 'Vượt qua bão cát và các cỗ máy thời gian cổ đại để đánh thức Khổng Lồ Cát Sand Titan.',
    bossId: 'boss-sand-titan',
    crystalId: 'crystal-golden',
  },
  {
    id: 'chapter-3-ocean',
    order: 3,
    titleVi: 'Chương 3: Tiếng Vọng Đại Dương Thẳm',
    titleEn: 'Chapter 3: The Abyssal Deep',
    kingdomId: 'g2-k3-multiplex',
    summary: 'Lặn sâu vào cung điện san hô, khuất phục Abyss Kraken và khôi phục sự cân bằng cho các dòng hải lưu.',
    bossId: 'boss-abyss-kraken',
    crystalId: 'crystal-ocean',
  },
  {
    id: 'chapter-4-frozen',
    order: 4,
    titleVi: 'Chương 4: Trái Tim Băng Giá Vĩnh Hằng',
    titleEn: 'Chapter 4: The Frozen Spire',
    kingdomId: 'g2-k4-divisia',
    summary: 'Leo lên đỉnh băng sơn ngàn trượng, làm tan chảy lớp băng bao quanh trái tim Rồng Băng Ice Dragon.',
    bossId: 'boss-ice-dragon',
    crystalId: 'crystal-frozen',
  },
  {
    id: 'chapter-5-mountain',
    order: 5,
    titleVi: 'Chương 5: Bàn Thạch Thiết Sơn',
    titleEn: 'Chapter 5: The Stone Bastion',
    kingdomId: 'g2-k5-geometria',
    summary: 'Khám phá thành trì đá cổ, giải đố những cấu trúc hình học kiên cố để thuần phục Mountain Golem.',
    bossId: 'boss-mountain-golem',
    crystalId: 'crystal-stone',
  },
  {
    id: 'chapter-6-sweet',
    order: 6,
    titleVi: 'Chương 6: Thung Lũng Kẹo Ngọt Diệu Kỳ',
    titleEn: 'Chapter 6: The Sweet Sanctuary',
    kingdomId: 'g2-k6-fractions',
    summary: 'Cùng Phù Thủy Kẹo Ngọt chia sẻ niềm vui toán học, giải phóng dòng sông chocolate ngọt ngào.',
    bossId: 'boss-candy-witch',
    crystalId: 'crystal-sweet',
  },
  {
    id: 'chapter-7-dark',
    order: 7,
    titleVi: 'Chương 7: Pháo Đài Hắc Ám Của Lord Zero',
    titleEn: 'Chapter 7: Confronting Lord Zero',
    kingdomId: 'g2-k7-apex',
    summary: 'Tiến vào trung tâm vương quốc bóng tối, đối đầu 3 giai đoạn của Lord Zero và thu hồi viên ngọc tối thượng.',
    bossId: 'boss-lord-zero',
    crystalId: 'crystal-dark',
  },
  {
    id: 'epilogue',
    order: 8,
    titleVi: 'Vĩ Thanh: Khải Hoàn Bảy Vương Quốc',
    titleEn: 'Epilogue: The Legend Completed',
    kingdomId: 'g2-k1-arithmia',
    summary: 'Bảy viên ngọc tri thức tỏa sáng rực rỡ, ánh sáng xua tan mọi bóng tối. Tony trở thành Đại Hiệp Sĩ vĩ đại nhất lịch sử.',
    bossId: 'none',
    crystalId: 'none',
  },
];

export const STORY_CUTSCENES: Record<string, StoryCutscene> = {
  // 1. Mở đầu trò chơi
  'cutscene-intro-prologue': {
    id: 'cutscene-intro-prologue',
    title: 'Sự Trỗi Dậy Của Bóng Tối',
    chapterId: 'prologue',
    triggerEvent: 'game_start',
    slides: [
      {
        id: 'intro-1',
        speaker: 'Lời Dẫn Cổ Xưa',
        speakerTitle: 'Sử Thi Bảy Vương Quốc',
        dialogue: 'Từ thuở sơ khai, Bảy Vương Quốc được bảo hộ bởi Bảy Viên Ngọc Tri Thức nhiệm màu...',
        mood: 'heroic',
      },
      {
        id: 'intro-2',
        speaker: 'Lord Zero',
        speakerTitle: 'Chúa Tể Không Gian Tối',
        avatarSide: 'right',
        dialogue: 'Hahaha! Những phép tính này sẽ biến mất! Toàn bộ thế giới sẽ trở về con số 0 hư vô!',
        mood: 'dark',
        highlightWord: 'Số 0 hư vô',
      },
      {
        id: 'intro-3',
        speaker: 'Trưởng Lão Elder Oak',
        speakerTitle: 'Người Dẫn Đường Tri Thức',
        avatarSide: 'left',
        dialogue: 'Bóng tối đã che khuất mặt trời... Chỉ có một chiến binh mang trái tim trong sáng và trí tuệ kiên định mới có thể cứu vãn thế giới.',
        mood: 'dramatic',
      },
      {
        id: 'intro-4',
        speaker: 'Hiệp Sĩ Tony',
        speakerTitle: 'Hiệp Sĩ Toán Học',
        avatarSide: 'left',
        dialogue: 'Cháu đã sẵn sàng! Với thanh kiếm công lý và sức mạnh toán học, cháu sẽ mang 7 viên ngọc trở về!',
        mood: 'heroic',
        highlightWord: 'Sức mạnh toán học',
      },
    ],
  },

  // 2. Lần đầu vào Emerald Forest
  'cutscene-enter-emerald': {
    id: 'cutscene-enter-emerald',
    title: 'Rừng Xanh Arithmia Nguy Khốn',
    chapterId: 'chapter-1-emerald',
    kingdomId: 'g2-k1-arithmia',
    triggerEvent: 'enter_kingdom',
    slides: [
      {
        id: 'em-1',
        speaker: 'Trưởng Làng Elder Oak',
        speakerTitle: 'Làng Khởi Nguyên',
        dialogue: 'Tony! Mừng cậu đã đến. Khói đen đang bao phủ bìa rừng, lũ quái thạch đã bắt cóc người dân của chúng ta!',
        mood: 'dramatic',
      },
      {
        id: 'em-2',
        speaker: 'Cô Bé Lily',
        speakerTitle: 'Dân Làng Rừng Xanh',
        dialogue: 'Hiệp sĩ Tony ơi! Chú bảo vệ rừng Forest Guardian đột nhiên phát điên và tấn công mọi người... Xin hãy giúp chúng cháu!',
        mood: 'dramatic',
      },
      {
        id: 'em-3',
        speaker: 'Hiệp Sĩ Tony',
        speakerTitle: 'Hiệp Sĩ Toán Học',
        dialogue: 'Mọi người đừng sợ! Hãy tin tưởng tôi. Tôi sẽ vào sâu trong rừng, giải cứu dân làng và đánh thức Forest Guardian!',
        mood: 'heroic',
      },
    ],
  },

  // 3. Gặp Boss: Forest Guardian Corrupted
  'cutscene-boss-encounter-emerald': {
    id: 'cutscene-boss-encounter-emerald',
    title: 'Đối Mặt Thủ Hộ Rừng Bị Tha Hóa',
    chapterId: 'chapter-1-emerald',
    kingdomId: 'g2-k1-arithmia',
    triggerEvent: 'boss_encounter',
    slides: [
      {
        id: 'boss-em-1',
        speaker: 'Forest Guardian Corrupted',
        speakerTitle: 'Thủ Hộ Rừng Bị Tha Hóa',
        avatarSide: 'right',
        dialogue: 'GÀOOOO! Rễ cây hắc ám đã cắm sâu vào lòng đất! Kẻ nào dám ngăn cản chúa tể bóng tối?!',
        mood: 'dark',
      },
      {
        id: 'boss-em-2',
        speaker: 'Hiệp Sĩ Tony',
        speakerTitle: 'Hiệp Sĩ Toán Học',
        avatarSide: 'left',
        dialogue: 'Bác Thủ Hộ! Hãy tỉnh lại đi! Ánh sáng của các phép tính cộng trừ sẽ thanh tẩy ma thuật đen này!',
        mood: 'heroic',
      },
    ],
  },

  // 4. Boss bị đánh bại & Thu hồi ngọc
  'cutscene-boss-defeat-emerald': {
    id: 'cutscene-boss-defeat-emerald',
    title: 'Hồi Sinh Rừng Xanh & Ngọc Lục Bảo',
    chapterId: 'chapter-1-emerald',
    kingdomId: 'g2-k1-arithmia',
    triggerEvent: 'crystal_recovered',
    slides: [
      {
        id: 'def-em-1',
        speaker: 'Forest Guardian',
        speakerTitle: 'Thủ Hộ Rừng Xanh',
        avatarSide: 'right',
        dialogue: 'Cảm ơn cậu... hiệp sĩ nhỏ bé nhưng dũng cảm. Năng lượng đen đã tan biến hoàn toàn khỏi thân cây cổ thụ.',
        mood: 'celebrate',
      },
      {
        id: 'def-em-2',
        speaker: 'Lời Dẫn Hệ Thống',
        speakerTitle: 'Ngọc Tri Thức Thức Tỉnh',
        dialogue: '✨ Vút! Một viên ngọc xanh lấp lánh bay lên từ tán lá: NGỌC LỤC BẢO RỪNG THIÊNG đã được thu hồi!',
        mood: 'heroic',
        highlightWord: 'Ngọc Lục Bảo Rừng Thiêng',
      },
      {
        id: 'def-em-3',
        speaker: 'Hiệp Sĩ Tony',
        speakerTitle: 'Hiệp Sĩ Toán Học',
        dialogue: 'Một vương quốc đã được giải cứu! Viên ngọc chỉ đường đến Sa Mạc Vàng... Tiếp tục lên đường thôi!',
        mood: 'heroic',
      },
    ],
  },

  // 5. Mở khóa vương quốc tiếp theo
  'cutscene-portal-unlocked': {
    id: 'cutscene-portal-unlocked',
    title: 'Cánh Cổng Dịch Chuyển Đã Mở',
    chapterId: 'chapter-2-desert',
    triggerEvent: 'portal_unlocked',
    slides: [
      {
        id: 'portal-1',
        speaker: 'Cổng Tri Thức Cổ',
        speakerTitle: 'Cổng Dịch Chuyển Không Gian',
        dialogue: 'Năng lượng từ viên ngọc tri thức đã làm tan biến phong ấn của Lord Zero! Cánh cổng đến vương quốc tiếp theo đã được mở rộng!',
        mood: 'celebrate',
      },
    ],
  },

  // 6. Trận chiến quyết định với Lord Zero
  'cutscene-confront-lord-zero': {
    id: 'cutscene-confront-lord-zero',
    title: 'Quyết Đấu Chúa Tể Không Gian Tối',
    chapterId: 'chapter-7-dark',
    kingdomId: 'g2-k7-apex',
    triggerEvent: 'boss_encounter',
    slides: [
      {
        id: 'zero-1',
        speaker: 'Lord Zero',
        speakerTitle: 'Chúa Tể Không Gian Tối',
        avatarSide: 'right',
        dialogue: 'Ngươi đã thu hồi được 6 viên ngọc... Nhưng tại Pháo Đài Hắc Ám này, mọi thứ đều sẽ bị quy về số 0!',
        mood: 'dark',
      },
      {
        id: 'zero-2',
        speaker: 'Hiệp Sĩ Tony',
        speakerTitle: 'Đại Hiệp Sĩ Tri Thức',
        avatarSide: 'left',
        dialogue: 'Toán học không chỉ là những con số, mà còn là ánh sáng của sự thật, tình bạn và ước mơ! Hãy kết thúc chuyện này!',
        mood: 'heroic',
        highlightWord: 'Ánh sáng của sự thật',
      },
    ],
  },

  // 7. Khải hoàn toàn bộ trò chơi
  'cutscene-grand-victory': {
    id: 'cutscene-grand-victory',
    title: 'Khải Hoàn Bảy Vương Quốc',
    chapterId: 'epilogue',
    triggerEvent: 'game_victory',
    slides: [
      {
        id: 'vic-1',
        speaker: 'Lời Dẫn Toàn Cảnh',
        speakerTitle: 'Bảy Vương Quốc Tự Do',
        dialogue: 'Bóng tối của Lord Zero vỡ vụn thành trăm ngàn mảnh sáng. Bảy Viên Ngọc Tri Thức cùng nhau bay lượn và thắp sáng bầu trời lục địa!',
        mood: 'celebrate',
      },
      {
        id: 'vic-2',
        speaker: 'Toàn Thể Dân Làng & Thủ Hộ',
        speakerTitle: 'Khúc Ca Chiến Thắng',
        dialogue: 'HOAN HÔ HIỆP SĨ TONY! Bảy vương quốc đã hòa bình! Người hùng toán học của chúng ta muôn năm!',
        mood: 'celebrate',
      },
      {
        id: 'vic-3',
        speaker: 'Hiệp Sĩ Tony',
        speakerTitle: 'Đại Hiệp Sĩ Cứu Thế',
        dialogue: 'Cảm ơn tất cả mọi người! Hãy luôn ghi nhớ: Sức mạnh của tri thức chính là lòng dũng cảm lớn nhất của một hiệp sĩ!',
        mood: 'heroic',
        highlightWord: 'Sức mạnh của tri thức',
      },
    ],
  },
};

export const getCutsceneById = (cutsceneId: string): StoryCutscene | undefined => {
  return STORY_CUTSCENES[cutsceneId];
};
