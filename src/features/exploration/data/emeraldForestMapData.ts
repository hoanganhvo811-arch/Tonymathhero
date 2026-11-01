import type { SubZone, NpcData, InteractiveObjectData } from '@/types/exploration';

export const EMERALD_FOREST_SUBZONES: SubZone[] = [
  {
    id: 'village',
    nameVi: 'Ngôi Làng Arithmia',
    nameEn: 'Village of Arithmia',
    description: 'Ngôi làng thanh bình nằm ở cửa ngõ khu rừng, nơi sinh sống của các cư dân hiền lành.',
    center: [0, 0, 15],
    radius: 14,
    isUnlocked: true,
    themeColor: '#10b981',
  },
  {
    id: 'green_forest',
    nameVi: 'Khu Rừng Xanh',
    nameEn: 'Green Forest Grove',
    description: 'Tán cây cổ thụ rậm rạp che phủ ánh mặt trời, nơi lưu giữ những dấu vết quái vật bí ẩn.',
    center: [-18, 0, 2],
    radius: 13,
    isUnlocked: true,
    themeColor: '#059669',
  },
  {
    id: 'monster_camp',
    nameVi: 'Trại Quái Vật',
    nameEn: 'Monster Palisade Camp',
    description: 'Doanh trại canh giữ hiểm trở của lũ Quái Thạch, nơi các dân làng bị bắt nhốt vào lồng sắt.',
    center: [-22, 0, -18],
    radius: 12,
    isUnlocked: false,
    requiredQuestId: 'ef-quest-01',
    themeColor: '#ef4444',
  },
  {
    id: 'ancient_ruins',
    nameVi: 'Tàn Tích Cổ Đại',
    nameEn: 'Ancient Runestone Ruins',
    description: 'Khu tàn tích bằng đá cổ phong rêu với những cột đá khắc ký hiệu toán học ngàn năm.',
    center: [18, 0, -14],
    radius: 12,
    isUnlocked: false,
    requiredQuestId: 'ef-quest-02',
    themeColor: '#8b5cf6',
  },
  {
    id: 'crystal_lake',
    nameVi: 'Hồ Pha Lê',
    nameEn: 'Crystal Waters Lake',
    description: 'Mặt hồ trong vắt phản chiếu bầu trời, nơi các Tinh Thể Năng Lượng tỏa ánh sáng thần kỳ.',
    center: [16, -0.2, 6],
    radius: 13,
    isUnlocked: false,
    requiredQuestId: 'ef-quest-02',
    themeColor: '#06b6d4',
  },
  {
    id: 'kingdom_castle',
    nameVi: 'Lâu Đài Vương Quốc',
    nameEn: 'Heartwood Castle Keep',
    description: 'Pháo đài kiên cố của Vương Quốc Rừng Xanh, đang phong tỏa chờ ngày kết giới tan biến.',
    center: [0, 1.2, -26],
    radius: 14,
    isUnlocked: false,
    requiredQuestId: 'ef-quest-03',
    themeColor: '#f59e0b',
  },
];

export const EMERALD_FOREST_NPCS: NpcData[] = [
  {
    id: 'npc-elder-oak',
    name: 'Trưởng Làng Elder Oak',
    role: 'Trưởng Làng Arithmia',
    subZoneId: 'village',
    position: [-4, 0, 14],
    avatarIcon: '👴',
    hasQuestMarker: true,
    relatedQuestId: 'ef-quest-01',
    defaultDialogueId: 'oak-intro',
    dialogueTree: {
      'oak-intro': {
        id: 'oak-intro',
        speakerName: 'Trưởng Làng Elder Oak',
        text: 'Chào mừng Hiệp Sĩ Tony dũng cảm! Ngôi làng Arithmia của chúng ta đang đối mặt với thảm họa lớn. Một thế lực bóng tối xuất hiện làm đảo lộn các phép tính, và quái vật đã bắt đầu tấn công làng!',
        options: [
          {
            label: 'Chuyện gì đã xảy ra với dân làng vậy ạ?',
            action: 'next',
            targetDialogueId: 'oak-details',
          },
        ],
      },
      'oak-details': {
        id: 'oak-details',
        speakerName: 'Trưởng Làng Elder Oak',
        text: 'Lũ quái vật đã bắt cóc một số người dân vào rừng sâu. Cháu hãy đến gặp cô bé Lily ở cạnh giếng nước, cô bé biết rõ những người mất tích. Sau đó hãy vào bìa rừng điều tra!',
        options: [
          {
            label: 'Cháu sẽ giúp đỡ dân làng ngay! (Nhận nhiệm vụ)',
            action: 'accept_quest',
            questId: 'ef-quest-01',
          },
          {
            label: 'Cháu cần chuẩn bị thêm.',
            action: 'close',
          },
        ],
      },
      'oak-progress': {
        id: 'oak-progress',
        speakerName: 'Trưởng Làng Elder Oak',
        text: 'Hãy đến gặp cô bé Lily và vào Khu Rừng Xanh điều tra nhé, Tony. Dân làng trông cậy cả vào cháu!',
        options: [
          {
            label: 'Cháu hiểu rồi ạ!',
            action: 'close',
          },
        ],
      },
    },
  },
  {
    id: 'npc-lily',
    name: 'Cô Bé Lily',
    role: 'Cư Dân Nhỏ Tuổi',
    subZoneId: 'village',
    position: [4, 0, 12],
    avatarIcon: '👧',
    hasQuestMarker: false,
    relatedQuestId: 'ef-quest-02',
    defaultDialogueId: 'lily-intro',
    dialogueTree: {
      'lily-intro': {
        id: 'lily-intro',
        speakerName: 'Cô Bé Lily',
        text: 'Anh Tony ơi! Các bác trong làng bị lũ Quái Thạch bắt nhốt vào một chiếc lồng sắt to đùng ở Trại Quái Vật bên kia bìa rừng rồi. Em sợ lắm...',
        options: [
          {
            label: 'Em đừng sợ, anh sẽ đi cứu mọi người ngay!',
            action: 'accept_quest',
            questId: 'ef-quest-02',
          },
          {
            label: 'Em hãy ở yên trong làng cho an toàn nhé.',
            action: 'close',
          },
        ],
      },
      'lily-waiting': {
        id: 'lily-waiting',
        speakerName: 'Cô Bé Lily',
        text: 'Cổng dẫn đến Trại Quái Vật đã mở rồi! Anh Tony nhớ cẩn thận với tên Lính Canh Quái Thạch nhé!',
        options: [
          {
            label: 'Anh đi ngay đây!',
            action: 'close',
          },
        ],
      },
      'lily-thanks': {
        id: 'lily-thanks',
        speakerName: 'Cô Bé Lily',
        text: 'Tuyệt vời quá anh Tony ơi! Dân làng đã được cứu thoát an toàn rồi. Em cảm ơn anh nhiều lắm!',
        options: [
          {
            label: 'Không có gì đâu em!',
            action: 'close',
          },
        ],
      },
    },
  },
  {
    id: 'npc-forest-guardian',
    name: 'Người Bảo Vệ Rừng Xanh',
    role: 'Thần Hộ Mệnh Rừng Cổ',
    subZoneId: 'ancient_ruins',
    position: [18, 0, -12],
    avatarIcon: '🧝',
    hasQuestMarker: false,
    relatedQuestId: 'ef-quest-03',
    defaultDialogueId: 'guardian-intro',
    dialogueTree: {
      'guardian-intro': {
        id: 'guardian-intro',
        speakerName: 'Người Bảo Vệ Rừng Xanh',
        text: 'Chào chiến binh ánh sáng Tony! Tinh thần nghĩa hiệp của cháu đã giúp dân làng an toàn. Tuy nhiên, Lâu Đài Vương Quốc vẫn đang bị phong tỏa bởi màn sương hắc ám.',
        options: [
          {
            label: 'Làm thế nào để phá vỡ phong ấn hắc ám ạ?',
            action: 'next',
            targetDialogueId: 'guardian-crystals',
          },
        ],
      },
      'guardian-crystals': {
        id: 'guardian-crystals',
        speakerName: 'Người Bảo Vệ Rừng Xanh',
        text: 'Cháu cần thu thập đủ 5 Tinh Thể Năng Lượng xanh lam tỏa sáng quanh bờ Hồ Pha Lê và Tàn Tích Cổ này. Khi mang đủ về đây, kết giới dẫn vào Lâu Đài sẽ được khai thông!',
        options: [
          {
            label: 'Cháu sẽ thu thập 5 tinh thể ngay! (Nhận nhiệm vụ)',
            action: 'accept_quest',
            questId: 'ef-quest-03',
          },
          {
            label: 'Để cháu quan sát xung quanh trước.',
            action: 'close',
          },
        ],
      },
      'guardian-completed': {
        id: 'guardian-completed',
        speakerName: 'Người Bảo Vệ Rừng Xanh',
        text: 'Ánh sáng tri thức đã hội tụ! Đại điện Lâu Đài Vương Quốc và Quái Thạch Khổng Lồ đang chờ đón sự xuất hiện của cháu. Hãy tiến bước, Đại Hiệp Sĩ Tony!',
        options: [
          {
            label: 'Sẵn sàng tiến vào Lâu Đài!',
            action: 'close',
          },
        ],
      },
    },
  },
  {
    id: 'npc-merchant',
    name: 'Thương Nhân Odo',
    role: 'Lái Buôn Thảo Nguyên',
    subZoneId: 'village',
    position: [6, 0, 18],
    avatarIcon: '🧙',
    hasQuestMarker: false,
    defaultDialogueId: 'odo-intro',
    dialogueTree: {
      'odo-intro': {
        id: 'odo-intro',
        speakerName: 'Thương Nhân Odo',
        text: 'Kính chào Hiệp Sĩ Tony! Ta là Odo, chuyên cung cấp các bình dược phẩm hồi phục và trang bị thám hiểm tốt nhất xứ sở. Cậu có muốn xem qua hàng hóa không?',
        options: [
          {
            label: 'Mở cửa hàng vật phẩm',
            action: 'open_shop',
          },
          {
            label: 'Hẹn gặp lại sau!',
            action: 'close',
          },
        ],
      },
    },
  },
];

export const EMERALD_FOREST_OBJECTS: InteractiveObjectData[] = [
  // Village Objects
  {
    id: 'obj-village-sign',
    type: 'signpost',
    name: 'Biển Chỉ Dẫn Ngôi Làng',
    subZoneId: 'village',
    position: [0, 0, 20],
    interactionRadius: 2.5,
    promptText: 'Đọc biển chỉ dẫn',
  },
  {
    id: 'obj-village-chest',
    type: 'treasure_chest',
    name: 'Rương Báu Làng Cổ',
    subZoneId: 'village',
    position: [-8, 0, 18],
    interactionRadius: 2.5,
    promptText: 'Mở rương báu',
    rewardGold: 60,
    rewardExp: 30,
    rewardItemName: 'Bình Máu Nhỏ',
  },

  // Green Forest Objects
  {
    id: 'obj-forest-tracks',
    type: 'signpost',
    name: 'Dấu Vết Quái Thạch',
    subZoneId: 'green_forest',
    position: [-16, 0, 4],
    interactionRadius: 3.0,
    promptText: 'Kiểm tra dấu chân quái vật',
    relatedQuestId: 'ef-quest-01',
  },
  {
    id: 'obj-forest-chest',
    type: 'treasure_chest',
    name: 'Rương Dấu Rễ Cây',
    subZoneId: 'green_forest',
    position: [-24, 0, 1],
    interactionRadius: 2.5,
    promptText: 'Mở rương kho báu',
    rewardGold: 80,
    rewardExp: 40,
    rewardItemName: 'Khiên Gỗ Rừng Xanh',
  },

  // Monster Camp Objects
  {
    id: 'obj-villager-cage',
    type: 'villager_cage',
    name: 'Lồng Giam Dân Làng',
    subZoneId: 'monster_camp',
    position: [-22, 0, -18],
    interactionRadius: 3.5,
    promptText: 'Giải cứu dân làng',
    relatedQuestId: 'ef-quest-02',
  },

  // 5 Energy Crystals for Quest 3
  {
    id: 'crystal-1',
    type: 'energy_crystal',
    name: 'Tinh Thể Năng Lượng 01',
    subZoneId: 'ancient_ruins',
    position: [15, 0.4, -14],
    interactionRadius: 2.5,
    promptText: 'Thu thập Tinh Thể Năng Lượng',
    relatedQuestId: 'ef-quest-03',
  },
  {
    id: 'crystal-2',
    type: 'energy_crystal',
    name: 'Tinh Thể Năng Lượng 02',
    subZoneId: 'ancient_ruins',
    position: [21, 0.4, -16],
    interactionRadius: 2.5,
    promptText: 'Thu thập Tinh Thể Năng Lượng',
    relatedQuestId: 'ef-quest-03',
  },
  {
    id: 'crystal-3',
    type: 'energy_crystal',
    name: 'Tinh Thể Năng Lượng 03',
    subZoneId: 'crystal_lake',
    position: [12, 0.2, 8],
    interactionRadius: 2.5,
    promptText: 'Thu thập Tinh Thể Năng Lượng',
    relatedQuestId: 'ef-quest-03',
  },
  {
    id: 'crystal-4',
    type: 'energy_crystal',
    name: 'Tinh Thể Năng Lượng 04',
    subZoneId: 'crystal_lake',
    position: [20, 0.2, 4],
    interactionRadius: 2.5,
    promptText: 'Thu thập Tinh Thể Năng Lượng',
    relatedQuestId: 'ef-quest-03',
  },
  {
    id: 'crystal-5',
    type: 'energy_crystal',
    name: 'Tinh Thể Năng Lượng 05',
    subZoneId: 'crystal_lake',
    position: [18, 0.2, 10],
    interactionRadius: 2.5,
    promptText: 'Thu thập Tinh Thể Năng Lượng',
    relatedQuestId: 'ef-quest-03',
  },

  // Ancient Ruins Altar
  {
    id: 'obj-ancient-altar',
    type: 'signpost',
    name: 'Tế Đàn Tàn Tích Cổ',
    subZoneId: 'ancient_ruins',
    position: [18, 0, -16],
    interactionRadius: 3.0,
    promptText: 'Khám phá tế đàn',
    relatedQuestId: 'ef-quest-03',
  },
];
