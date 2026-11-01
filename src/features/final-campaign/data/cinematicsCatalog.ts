import { CutsceneSlide } from '../../../types';

export interface FinalCinematicScenario {
  id: string;
  titleVi: string;
  theme: 'dark_omen' | 'rally_kingdoms' | 'victory_glory';
  slides: CutsceneSlide[];
}

export const FINAL_INTRO_CINEMATIC: FinalCinematicScenario = {
  id: 'final-intro-cinematic',
  titleVi: 'Sự Trỗi Dậy Của Hiệp Sĩ Toán Học – Khởi Đầu Trận Chiến Cuối Cùng',
  theme: 'dark_omen',
  slides: [
    {
      id: 'slide-1',
      speaker: 'Lord Zero',
      speakerTitle: 'Chúa Tể Không Gian Hắc Ám',
      avatarSide: 'right',
      mood: 'dark',
      highlightWord: 'Quy về con số 0',
      dialogue:
        'Hahaha! Ngươi đã đi khắp Bảy Vương Quốc, nhóc dũng sĩ Tony! Nhưng mọi phép tính, mọi định lý và mọi ước mơ của ngươi đều sẽ bị ta nuốt chửng và quy về con số 0 vĩnh cửu!',
    },
    {
      id: 'slide-2',
      speaker: 'Lời Dẫn Sử Thi',
      speakerTitle: 'Nguy Cơ Diệt Vong',
      avatarSide: 'center',
      mood: 'dramatic',
      highlightWord: 'Bảy Viên Ngọc Tri Thức',
      dialogue:
        'Bầu trời lục địa bị phủ kín bởi màn đêm hắc ám. Năng lượng từ Bảy Viên Ngọc Tri Thức đang bị hút cạn dần về phía Pháo Đài Hắc Ám của Lord Zero!',
    },
    {
      id: 'slide-3',
      speaker: 'Đại Sư Phụ Pytha & Elder Oak',
      speakerTitle: 'Hội Đồng Trưởng Lão Tri Thức',
      avatarSide: 'left',
      mood: 'heroic',
      highlightWord: 'Ánh sáng của Bảy Vương Quốc',
      dialogue:
        'Tony! Con không hề đơn độc! Toàn bộ người dân, hiệp sĩ và thủ hộ của Bảy Vương Quốc đang cùng nhau hợp lực, truyền sức mạnh niềm tin tới con!',
    },
    {
      id: 'slide-4',
      speaker: 'Công Chúa Sophia & Chronos',
      speakerTitle: 'Sứ Giả Thời Gian & Phép Tính',
      avatarSide: 'left',
      mood: 'celebrate',
      highlightWord: 'Khiên Bảo Vệ Tri Thức',
      dialogue:
        'Chúng ta đã ban phước lành cho con: Bảy Viên Ngọc Tri Thức sẽ hóa thành chiếc Khiên Bảo Hộ, giúp con kiên cường trước mọi ma pháp đen tối!',
    },
    {
      id: 'slide-5',
      speaker: 'Thần Long Thái Cổ Aethelgard',
      speakerTitle: 'Thần Thú Bảo Hộ Cực Thiên',
      avatarSide: 'right',
      mood: 'heroic',
      highlightWord: 'Cánh Cổng Hắc Ám đã mở',
      dialogue:
        'Tiếng gầm xé toang không gian! Cánh Cổng Pháo Đài Hắc Ám đã mở ra! Hãy tiến lên, Tony – Hãy viết nên huyền thoại của Hiệp Sĩ Toán Học!',
    },
    {
      id: 'slide-6',
      speaker: 'Hiệp Sĩ Tony',
      speakerTitle: 'Người Hùng Của Bảy Vương Quốc',
      avatarSide: 'left',
      mood: 'heroic',
      highlightWord: 'Trận chiến cuối cùng',
      dialogue:
        'Cháu đã sẵn sàng! Vì Bảy Vương Quốc, vì ánh sáng của tri thức và chân lý – Trận chiến cuối cùng bắt đầu!',
    },
  ],
};

export const FINAL_OUTRO_CINEMATIC: FinalCinematicScenario = {
  id: 'final-outro-cinematic',
  titleVi: 'Đại Khải Hoàn – Vinh Quang Hiệp Sĩ Toán Học Huyền Thoại',
  theme: 'victory_glory',
  slides: [
    {
      id: 'outro-1',
      speaker: 'Lord Zero',
      speakerTitle: 'Tàn Dư Hắc Ám',
      avatarSide: 'right',
      mood: 'dark',
      highlightWord: 'Ánh sáng tri thức bất diệt',
      dialogue:
        'Không thể nào... Làm sao sức mạnh của những con số, hình học và logic lại có thể đánh bại bóng tối tuyệt đối của ta... Ta tan biến rồi...!',
    },
    {
      id: 'outro-2',
      speaker: 'Lời Dẫn Sử Thi',
      speakerTitle: 'Bình Minh Bảy Vương Quốc',
      avatarSide: 'center',
      mood: 'celebrate',
      highlightWord: 'Cầu Vồng Thất Sắc Rực Rỡ',
      dialogue:
        'Lâu đài bóng tối sụp đổ trong muôn ngàn tia sáng. Bảy Viên Ngọc Tri Thức bay vút lên bầu trời, tạo thành dải cầu vồng năng lượng thanh tẩy khắp lục địa!',
    },
    {
      id: 'outro-3',
      speaker: 'Toàn Thể Dân Làng & Thủ Hộ',
      speakerTitle: 'Khúc Hoan Ca Khải Hoàn',
      avatarSide: 'center',
      mood: 'celebrate',
      highlightWord: 'Vạn Tuế Hiệp Sĩ Tony!',
      dialogue:
        'VẠN TUẾ TONY! Vương Quốc Phép Cộng, Phép Nhân, Phép Chia, Vương Quốc Thời Gian, Hình Học, Tiền Tệ và Trí Tuệ đã hoàn toàn giải phóng!',
    },
    {
      id: 'outro-4',
      speaker: 'Đại Sư Phụ Pytha',
      speakerTitle: 'Trao Vương Quyền Math Hero',
      avatarSide: 'left',
      mood: 'heroic',
      highlightWord: 'MATH HERO – HUYỀN THOẠI BẢY VƯƠNG QUỐC',
      dialogue:
        'Nhân danh Hội Đồng Tri Thức, ta chính thức trao cho con Danh Hiệu Tối Thượng: MATH HERO – HUYỀN THOẠI BẢY VƯƠNG QUỐC! Tên của con sẽ được ghi vào trang sử thi vĩ đại nhất!',
    },
    {
      id: 'outro-5',
      speaker: 'Hiệp Sĩ Tony',
      speakerTitle: 'Math Hero Huyền Thoại',
      avatarSide: 'left',
      mood: 'celebrate',
      highlightWord: 'Tri thức là sức mạnh tuyệt vời nhất!',
      dialogue:
        'Chiến thắng này thuộc về tất cả chúng ta! Hãy luôn yêu thích học tập, khám phá những điều kỳ diệu của Toán học và bảo vệ thế giới tươi đẹp này nhé!',
    },
  ],
};
