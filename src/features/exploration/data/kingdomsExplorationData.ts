import type { SubZone, NpcData, InteractiveObjectData } from '../../../types/exploration';
import type { BiomeType } from '../../../types/kingdom';
import type { CampaignId } from '../../../types/campaign';
import {
  EMERALD_FOREST_SUBZONES,
  EMERALD_FOREST_NPCS,
  EMERALD_FOREST_OBJECTS,
} from './emeraldForestMapData';

export interface KingdomEnvironmentConfig {
  biomeType: BiomeType;
  groundColor: string;
  secondaryGroundColor: string;
  pathColor: string;
  fogColor: string;
  fogDensity: number;
  lightColor: string;
  lightIntensity: number;
  secondaryLightColor: string;
  particleType: 'spores' | 'dust' | 'bubbles' | 'snow' | 'embers' | 'candy' | 'void';
  hasWaterPlane: boolean;
  waterColor?: string;
  waterPosition?: [number, number, number];
  waterRadius?: number;
  landmarkTitle: string;
  landmarkDesc: string;
}

export interface KingdomExplorationData {
  kingdomId: string;
  biomeType: BiomeType;
  titleVi: string;
  titleEn: string;
  loreVi: string;
  subZones: SubZone[];
  npcs: NpcData[];
  interactiveObjects: InteractiveObjectData[];
  environment: KingdomEnvironmentConfig;
}

// 1. EMERALD FOREST (RỪNG XANH CỔ ĐẠI)
const EMERALD_FOREST_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k1-arithmia',
  biomeType: 'emerald_forest',
  titleVi: 'Rừng Xanh Cổ Đại',
  titleEn: 'Emerald Forest',
  loreVi: 'Vương quốc khởi nguyên với những tán cổ thụ nghìn năm và suối nguồn tri thức.',
  subZones: EMERALD_FOREST_SUBZONES,
  npcs: EMERALD_FOREST_NPCS,
  interactiveObjects: EMERALD_FOREST_OBJECTS,
  environment: {
    biomeType: 'emerald_forest',
    groundColor: '#15803d',
    secondaryGroundColor: '#064e3b',
    pathColor: '#a8a29e',
    fogColor: '#042414',
    fogDensity: 0.014,
    lightColor: '#fef08a',
    lightIntensity: 1.8,
    secondaryLightColor: '#34d399',
    particleType: 'spores',
    hasWaterPlane: true,
    waterColor: '#38bdf8',
    waterPosition: [16, -0.15, 6],
    waterRadius: 11,
    landmarkTitle: 'Lâu Đài Mộc Vương & Hồ Pha Lê',
    landmarkDesc: 'Trụ sở bảo vệ nguồn tri thức khởi nguyên của toàn cõi Arithmia.',
  },
};

// 2. GOLDEN DESERT (SA MẠC VÀNG & KIM TỰ THÁP)
const GOLDEN_DESERT_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k2-pyramidia',
  biomeType: 'golden_desert',
  titleVi: 'Sa Mạc Vàng & Kim Tự Tháp',
  titleEn: 'Golden Desert & Sun Pyramids',
  loreVi: 'Vùng đất của những đụn cát rực rỡ dưới ánh thái dương và bí ẩn hình học ngàn năm.',
  subZones: [
    {
      id: 'desert_oasis',
      nameVi: 'Ốc Đảo Sa Mạc',
      nameEn: 'Sunfire Oasis',
      description: 'Hồ nước xanh biếc hiếm hoi giữa lòng sa mạc, nơi các thương nhân lữ hành dừng chân.',
      center: [0, 0, 15],
      radius: 14,
      isUnlocked: true,
      themeColor: '#f59e0b',
    },
    {
      id: 'dune_sea',
      nameVi: 'Biển Cát Vàng',
      nameEn: 'Rolling Sand Dunes',
      description: 'Những con sóng cát vàng vô tận uốn lượn dưới ngọn gió sa mạc khô rát.',
      center: [-18, 0, 2],
      radius: 13,
      isUnlocked: true,
      themeColor: '#d97706',
    },
    {
      id: 'sphinx_sanctuary',
      nameVi: 'Đền Thờ Nhân Sư',
      nameEn: 'Sphinx Riddle Sanctuary',
      description: 'Bức tượng Nhân Sư canh giữ câu đố bảng nhân và các phép tính chu vi diện tích.',
      center: [18, 0, -14],
      radius: 12,
      isUnlocked: true,
      themeColor: '#b45309',
    },
    {
      id: 'sun_pyramid',
      nameVi: 'Đại Kim Tự Tháp Thái Dương',
      nameEn: 'Great Sun Pyramid',
      description: 'Công trình kiến trúc vĩ đại của Titan Cát, nơi giấu Ngọc Hoàng Kim.',
      center: [-2, 0, -22],
      radius: 15,
      isUnlocked: true,
      themeColor: '#facc15',
    },
  ],
  npcs: [
    {
      id: 'npc-desert-scout',
      name: 'Tariq – Nhà Thám Hiểm Sa Mạc',
      role: 'Hướng dẫn viên ốc đảo',
      subZoneId: 'desert_oasis',
      position: [3, 0, 16],
      avatarIcon: 'scout',
      hasQuestMarker: true,
      relatedQuestId: 'gd-quest-01',
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Tariq',
          text: 'Chào mừng Hiệp sĩ Tony đến với Sa Mạc Vàng! Bão cát dữ dội của Titan Cát đang chôn vùi lối vào Kim Tự Tháp cổ.',
          options: [
            { label: 'Tôi sẽ tìm cách mở lối vào!', action: 'accept_quest', questId: 'gd-quest-01' },
            { label: 'Cho tôi xem hàng hóa sa mạc', action: 'open_shop' },
            { label: 'Tạm biệt Tariq', action: 'close' },
          ],
        },
      },
    },
    {
      id: 'npc-sphinx-priest',
      name: 'Amun – Tư Tế Nhân Sư',
      role: 'Người gác đền thần',
      subZoneId: 'sphinx_sanctuary',
      position: [18, 0, -12],
      avatarIcon: 'elder',
      hasQuestMarker: false,
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Tư tế Amun',
          text: 'Kẻ mang trái tim dũng cảm và trí tuệ toán học mới có thể giải được phong ấn của Thần Mặt Trời.',
          options: [{ label: 'Con hiểu rồi, thưa tư tế!', action: 'close' }],
        },
      },
    },
  ],
  interactiveObjects: [
    {
      id: 'obj-desert-chest-1',
      type: 'treasure_chest',
      name: 'Rương Cát Cổ Đại',
      subZoneId: 'desert_oasis',
      position: [-5, 0, 14],
      interactionRadius: 2.5,
      promptText: 'Mở Rương Cát Cổ Đại',
      rewardGold: 120,
      rewardExp: 60,
      rewardItemName: 'Khăn Choàng Sa Mạc',
    },
    {
      id: 'obj-desert-crystal',
      type: 'energy_crystal',
      name: 'Trụ Đá Thái Dương',
      subZoneId: 'sphinx_sanctuary',
      position: [16, 0, -16],
      interactionRadius: 3.0,
      promptText: 'Kích hoạt Trụ Đá Thái Dương',
      rewardExp: 80,
    },
    {
      id: 'obj-desert-portal',
      type: 'teleport_portal',
      name: 'Cổng Dịch Chuyển Sa Mạc',
      subZoneId: 'desert_oasis',
      position: [0, 0, 22],
      interactionRadius: 3.0,
      promptText: 'Trở về Bản Đồ Thế Giới',
    },
  ],
  environment: {
    biomeType: 'golden_desert',
    groundColor: '#d97706',
    secondaryGroundColor: '#92400e',
    pathColor: '#fef08a',
    fogColor: '#451a03',
    fogDensity: 0.012,
    lightColor: '#fef08a',
    lightIntensity: 2.0,
    secondaryLightColor: '#fbbf24',
    particleType: 'dust',
    hasWaterPlane: true,
    waterColor: '#06b6d4',
    waterPosition: [0, -0.15, 15],
    waterRadius: 6,
    landmarkTitle: 'Đại Kim Tự Tháp Thái Dương',
    landmarkDesc: 'Công trình cổ đại hùng vĩ lưu giữ bí mật chu vi và bảng nhân.',
  },
};

// 3. OCEAN KINGDOM (ĐẠI DƯƠNG THẦN BÍ)
const OCEAN_KINGDOM_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k3-aquaria',
  biomeType: 'ocean_kingdom',
  titleVi: 'Vương Quốc Đại Dương',
  titleEn: 'Mystic Ocean Kingdom',
  loreVi: 'Thế giới huyền ảo dưới làn nước xanh thẳm, nơi san hô phát sáng và cá heo ca hát.',
  subZones: [
    {
      id: 'coral_harbor',
      nameVi: 'Bến Cảng San Hô',
      nameEn: 'Coral Harbor Pier',
      description: 'Bến cảng ven biển lấp lánh cát trắng và vỏ sò ngũ sắc.',
      center: [0, 0, 15],
      radius: 14,
      isUnlocked: true,
      themeColor: '#0284c7',
    },
    {
      id: 'abyssal_trench',
      nameVi: 'Vực Thẳm Hải Quái',
      nameEn: 'Abyssal Kraken Trench',
      description: 'Khu vực biển sâu nơi Kraken Thần Biển ẩn nấp với những đợt sóng cuồn cuộn.',
      center: [-18, 0, -10],
      radius: 14,
      isUnlocked: true,
      themeColor: '#0f172a',
    },
    {
      id: 'pearl_palace',
      nameVi: 'Cung Điện Ngọc Trai',
      nameEn: 'Royal Pearl Palace',
      description: 'Lâu đài nguy nga dưới lòng đại dương xây bằng ngọc trai và xà cừ.',
      center: [16, 0, -12],
      radius: 14,
      isUnlocked: true,
      themeColor: '#38bdf8',
    },
  ],
  npcs: [
    {
      id: 'npc-mermaid-princess',
      name: 'Nerida – Nàng Tiên Cá San Hô',
      role: 'Công chúa biển cả',
      subZoneId: 'coral_harbor',
      position: [4, 0, 14],
      avatarIcon: 'fairy',
      hasQuestMarker: true,
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Công chúa Nerida',
          text: 'Hiệp sĩ Tony! Thủy quái Kraken đang phong tỏa dòng hải lưu bằng những phép chia có dư hắc ám!',
          options: [
            { label: 'Tôi sẽ giải cứu đại dương!', action: 'accept_quest' },
            { label: 'Mua vật phẩm thở dưới nước', action: 'open_shop' },
            { label: 'Tạm biệt Nerida', action: 'close' },
          ],
        },
      },
    },
  ],
  interactiveObjects: [
    {
      id: 'obj-ocean-chest',
      type: 'treasure_chest',
      name: 'Rương Báu Đáy Biển',
      subZoneId: 'coral_harbor',
      position: [-6, 0, 12],
      interactionRadius: 2.5,
      promptText: 'Mở Rương Báu Đáy Biển',
      rewardGold: 140,
      rewardExp: 75,
      rewardItemName: 'Dây Chuyền Thủy Tinh',
    },
    {
      id: 'obj-ocean-shell',
      type: 'energy_crystal',
      name: 'Vỏ Trai Khổng Lồ',
      subZoneId: 'pearl_palace',
      position: [14, 0, -10],
      interactionRadius: 3.0,
      promptText: 'Thu nhận Ngọc Trai Ánh Sáng',
      rewardExp: 90,
    },
  ],
  environment: {
    biomeType: 'ocean_kingdom',
    groundColor: '#0369a1',
    secondaryGroundColor: '#0c4a6e',
    pathColor: '#38bdf8',
    fogColor: '#082f49',
    fogDensity: 0.015,
    lightColor: '#7dd3fc',
    lightIntensity: 1.7,
    secondaryLightColor: '#0284c7',
    particleType: 'bubbles',
    hasWaterPlane: true,
    waterColor: '#0284c7',
    waterPosition: [0, -0.1, 0],
    waterRadius: 40,
    landmarkTitle: 'Cung Điện Hải Vương & Vực Thẳm',
    landmarkDesc: 'Thế giới đại dương lộng lẫy nơi ngự trị Viên Ngọc Lam.',
  },
};

// 4. FROZEN KINGDOM (MIỀN ĐẤT BĂNG GIÁ)
const FROZEN_KINGDOM_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k4-glacia',
  biomeType: 'frozen_kingdom',
  titleVi: 'Miền Đất Băng Giá',
  titleEn: 'Frost Peak Kingdom',
  loreVi: 'Những ngọn núi tuyết phủ quanh năm và lâu đài băng pha lê tuyệt mỹ.',
  subZones: [
    {
      id: 'snowdrift_village',
      nameVi: 'Làng Tuyết Trắng',
      nameEn: 'Snowdrift Village',
      description: 'Ngôi làng ấm cúng với những mái nhà phủ tuyết trắng và bếp lửa bập bùng.',
      center: [0, 0, 15],
      radius: 14,
      isUnlocked: true,
      themeColor: '#bae6fd',
    },
    {
      id: 'blizzard_pass',
      nameVi: 'Đèo Bão Tuyết',
      nameEn: 'Howling Blizzard Pass',
      description: 'Hẻm núi gió rít buốt giá nơi Rồng Băng Tuyết thử thách lòng quả cảm.',
      center: [-16, 0, -10],
      radius: 14,
      isUnlocked: true,
      themeColor: '#93c5fd',
    },
    {
      id: 'ice_citadel',
      nameVi: 'Pháo Đài Băng Giá',
      nameEn: 'Eternal Frost Citadel',
      description: 'Tòa lâu đài pha lê băng trong suốt tỏa ánh sáng lam ngọc.',
      center: [14, 0, -14],
      radius: 14,
      isUnlocked: true,
      themeColor: '#e0f2fe',
    },
  ],
  npcs: [
    {
      id: 'npc-frost-mage',
      name: 'Freya – Pháp Sư Băng Tuyết',
      role: 'Hộ vệ pháo đài',
      subZoneId: 'snowdrift_village',
      position: [4, 0, 14],
      avatarIcon: 'mage',
      hasQuestMarker: true,
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Pháp sư Freya',
          text: 'Gió lạnh phương Bắc không thể dập tắt ngọn lửa nhiệt huyết của Hiệp sĩ Tony. Hãy dùng phép toán phân số để làm tan băng giá!',
          options: [
            { label: 'Tôi sẵn sàng thám hiểm!', action: 'accept_quest' },
            { label: 'Cửa hàng mùa đông', action: 'open_shop' },
            { label: 'Tạm biệt Freya', action: 'close' },
          ],
        },
      },
    },
  ],
  interactiveObjects: [
    {
      id: 'obj-ice-chest',
      type: 'treasure_chest',
      name: 'Rương Băng Cổ Xưa',
      subZoneId: 'snowdrift_village',
      position: [-5, 0, 13],
      interactionRadius: 2.5,
      promptText: 'Làm tan băng mở rương',
      rewardGold: 150,
      rewardExp: 80,
    },
  ],
  environment: {
    biomeType: 'frozen_kingdom',
    groundColor: '#e0f2fe',
    secondaryGroundColor: '#bae6fd',
    pathColor: '#7dd3fc',
    fogColor: '#0f172a',
    fogDensity: 0.013,
    lightColor: '#ffffff',
    lightIntensity: 2.1,
    secondaryLightColor: '#38bdf8',
    particleType: 'snow',
    hasWaterPlane: true,
    waterColor: '#7dd3fc',
    waterPosition: [0, -0.15, 0],
    waterRadius: 15,
    landmarkTitle: 'Pháo Đài Băng Giá Vĩnh Cửu',
    landmarkDesc: 'Ngôi đền pha lê giữ gìn Ngọc Băng Bắc Cực.',
  },
};

// 5. STONE MOUNTAIN (NÚI ĐÁ THIẾT SƠN)
const STONE_MOUNTAIN_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k5-solida',
  biomeType: 'stone_mountain',
  titleVi: 'Núi Đá Thiết Sơn',
  titleEn: 'Stone Ironforge Mountain',
  loreVi: 'Vương quốc của những người thợ rèn kiên cường, nơi quặng sắt và đá tảng tôi luyện bản lĩnh.',
  subZones: [
    {
      id: 'forge_outpost',
      nameVi: 'Tiền Đồn Lò Rèn',
      nameEn: 'Ironforge Outpost',
      description: 'Tiếng đe gõ vang rền và khói lửa ấm áp từ các lò rèn vũ khí huyền thoại.',
      center: [0, 0, 15],
      radius: 14,
      isUnlocked: true,
      themeColor: '#78716c',
    },
    {
      id: 'granite_gorge',
      nameVi: 'Hẻm Núi Thạch Cương',
      nameEn: 'Granite Titan Gorge',
      description: 'Những vách đá dựng đứng sừng sững nơi Quái Thạch Núi Lửa tuần tra.',
      center: [-16, 0, -12],
      radius: 14,
      isUnlocked: true,
      themeColor: '#44403c',
    },
  ],
  npcs: [
    {
      id: 'npc-dwarf-blacksmith',
      name: 'Thorbjorn – Trưởng Lò Rèn',
      role: 'Đại sư rèn giáp',
      subZoneId: 'forge_outpost',
      position: [4, 0, 15],
      avatarIcon: 'merchant',
      hasQuestMarker: true,
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Thorbjorn',
          text: 'Chào Tony! Thiết giáp của chú cần được gia cố bằng sức mạnh của bảng tính và số đo khối lượng!',
          options: [
            { label: 'Giúp chú rèn búa thần!', action: 'accept_quest' },
            { label: 'Nâng cấp trang bị', action: 'open_shop' },
            { label: 'Hẹn gặp lại', action: 'close' },
          ],
        },
      },
    },
  ],
  interactiveObjects: [
    {
      id: 'obj-stone-chest',
      type: 'treasure_chest',
      name: 'Rương Quặng Quý',
      subZoneId: 'forge_outpost',
      position: [-4, 0, 14],
      interactionRadius: 2.5,
      promptText: 'Mở Rương Quặng Quý',
      rewardGold: 160,
      rewardExp: 90,
    },
  ],
  environment: {
    biomeType: 'stone_mountain',
    groundColor: '#57534e',
    secondaryGroundColor: '#292524',
    pathColor: '#a8a29e',
    fogColor: '#1c1917',
    fogDensity: 0.014,
    lightColor: '#fed7aa',
    lightIntensity: 1.8,
    secondaryLightColor: '#f97316',
    particleType: 'embers',
    hasWaterPlane: false,
    landmarkTitle: 'Đỉnh Búa Thần Thiết Sơn',
    landmarkDesc: 'Khu lò rèn ngàn năm nơi đúc tạo Ngọc Thạch Anh.',
  },
};

// 6. SWEET VALLEY (THUNG LŨNG KẸO NGỌT)
const SWEET_VALLEY_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k6-candia',
  biomeType: 'sweet_valley',
  titleVi: 'Thung Lũng Kẹo Ngọt',
  titleEn: 'Sweet Candyland Valley',
  loreVi: 'Xứ sở thần tiên với dòng sông socola, cây kẹo mút khổng lồ và bánh quy thơm lừng.',
  subZones: [
    {
      id: 'gingerbread_hamlet',
      nameVi: 'Làng Bánh Gừng',
      nameEn: 'Gingerbread Hamlet',
      description: 'Những ngôi nhà bánh ngọt lợp kem dâu và đường bột mịn màng.',
      center: [0, 0, 15],
      radius: 14,
      isUnlocked: true,
      themeColor: '#ec4899',
    },
    {
      id: 'chocolate_river',
      nameVi: 'Dòng Sông Socola',
      nameEn: 'Rich Chocolate River',
      description: 'Dòng sông socola sữa ngọt ngào uốn lượn quanh những ngọn đồi thạch trái cây.',
      center: [-15, 0, -10],
      radius: 14,
      isUnlocked: true,
      themeColor: '#78350f',
    },
  ],
  npcs: [
    {
      id: 'npc-baker-bella',
      name: 'Bella – Nghệ Nhân Bánh Ngọt',
      role: 'Thợ làm bánh hoàng gia',
      subZoneId: 'gingerbread_hamlet',
      position: [4, 0, 15],
      avatarIcon: 'fairy',
      hasQuestMarker: true,
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Bella',
          text: 'Hoan hô Tony! Hãy giúp Bella tính toán thời gian nướng mẻ bánh kem thần kỳ nhé!',
          options: [
            { label: 'Tôi sẽ giúp bạn!', action: 'accept_quest' },
            { label: 'Cửa hàng kẹo ngọt', action: 'open_shop' },
            { label: 'Tạm biệt Bella', action: 'close' },
          ],
        },
      },
    },
  ],
  interactiveObjects: [
    {
      id: 'obj-sweet-chest',
      type: 'treasure_chest',
      name: 'Rương Kẹo Bảy Màu',
      subZoneId: 'gingerbread_hamlet',
      position: [-5, 0, 14],
      interactionRadius: 2.5,
      promptText: 'Mở Rương Kẹo Ngọt',
      rewardGold: 180,
      rewardExp: 95,
    },
  ],
  environment: {
    biomeType: 'sweet_valley',
    groundColor: '#f472b6',
    secondaryGroundColor: '#ec4899',
    pathColor: '#fbcfe8',
    fogColor: '#4c0519',
    fogDensity: 0.012,
    lightColor: '#fdf2f8',
    lightIntensity: 1.9,
    secondaryLightColor: '#f43f5e',
    particleType: 'candy',
    hasWaterPlane: true,
    waterColor: '#78350f', // Chocolate river
    waterPosition: [-15, -0.15, -10],
    waterRadius: 10,
    landmarkTitle: 'Lâu Đài Đường Phèn & Sông Socola',
    landmarkDesc: 'Thế giới bánh ngọt lấp lánh nơi lưu giữ Ngọc Hồng Lựu.',
  },
};

// 7. DARK KINGDOM (VƯƠNG QUỐC BÓNG TỐI)
const DARK_KINGDOM_DATA: KingdomExplorationData = {
  kingdomId: 'g2-k7-umbra',
  biomeType: 'dark_kingdom',
  titleVi: 'Vương Quốc Bóng Tối',
  titleEn: 'Umbra Dark Kingdom',
  loreVi: 'Sào huyệt của Lord Zero, nơi bóng tối bao trùm và thử thách toán học tối thượng chờ đón.',
  subZones: [
    {
      id: 'light_bastion',
      nameVi: 'Tiền Đồn Ánh Sáng Cuối Cùng',
      nameEn: 'Last Bastion of Light',
      description: 'Vùng ánh sáng thiêng liêng cuối cùng do các hiệp sĩ dũng cảm dựng nên.',
      center: [0, 0, 15],
      radius: 14,
      isUnlocked: true,
      themeColor: '#38bdf8',
    },
    {
      id: 'void_rift',
      nameVi: 'Vực Thẳm Lord Zero',
      nameEn: 'Lord Zero Void Caldera',
      description: 'Lõi không gian tối nơi Chúa Tể Lord Zero ngự trị và phong ấn tri thức.',
      center: [0, 0, -18],
      radius: 18,
      isUnlocked: true,
      themeColor: '#7c3aed',
    },
  ],
  npcs: [
    {
      id: 'npc-dawn-paladin',
      name: 'Aurelius – Kỵ Sĩ Ánh Ban Mai',
      role: 'Đội trưởng kháng chiến',
      subZoneId: 'light_bastion',
      position: [4, 0, 14],
      avatarIcon: 'knight',
      hasQuestMarker: true,
      defaultDialogueId: 'greet',
      dialogueTree: {
        greet: {
          id: 'greet',
          speakerName: 'Kỵ sĩ Aurelius',
          text: 'Hiệp sĩ Tony! Giờ phút giải cứu Bảy Vương Quốc đã đến! Toàn bộ tri thức Lớp 2 và Lớp 3 sẽ là vũ khí mạnh nhất của bạn!',
          options: [
            { label: 'Tiến lên đánh bại Lord Zero!', action: 'accept_quest' },
            { label: 'Chuẩn bị trang bị tối thượng', action: 'open_shop' },
            { label: 'Tôi đã sẵn sàng!', action: 'close' },
          ],
        },
      },
    },
  ],
  interactiveObjects: [
    {
      id: 'obj-dark-chest',
      type: 'treasure_chest',
      name: 'Rương Ánh Sáng Thần Thánh',
      subZoneId: 'light_bastion',
      position: [-5, 0, 14],
      interactionRadius: 2.5,
      promptText: 'Mở Rương Ánh Sáng',
      rewardGold: 250,
      rewardExp: 150,
      rewardItemName: 'Kiếm Ánh Sáng Vô Cực',
    },
  ],
  environment: {
    biomeType: 'dark_kingdom',
    groundColor: '#18181b',
    secondaryGroundColor: '#09090b',
    pathColor: '#581c87',
    fogColor: '#09090b',
    fogDensity: 0.016,
    lightColor: '#c084fc',
    lightIntensity: 1.5,
    secondaryLightColor: '#ef4444',
    particleType: 'void',
    hasWaterPlane: true,
    waterColor: '#7f1d1d', // Magma caldera
    waterPosition: [0, -0.15, -18],
    waterRadius: 12,
    landmarkTitle: 'Vực Thẳm Vô Cực Lord Zero',
    landmarkDesc: 'Chiến trường quyết định vận mệnh của toàn bộ Lục Địa Toán Học.',
  },
};

const KINGDOMS_DATA_REGISTRY: Record<string, KingdomExplorationData> = {
  // Grade 2
  'g2-k1-arithmia': EMERALD_FOREST_DATA,
  'g2-k2-pyramidia': GOLDEN_DESERT_DATA,
  'g2-k3-aquaria': OCEAN_KINGDOM_DATA,
  'g2-k4-glacia': FROZEN_KINGDOM_DATA,
  'g2-k5-solida': STONE_MOUNTAIN_DATA,
  'g2-k6-candia': SWEET_VALLEY_DATA,
  'g2-k7-umbra': DARK_KINGDOM_DATA,

  // Grade 3
  'g3-k1-numeria': EMERALD_FOREST_DATA,
  'g3-k2-geom': GOLDEN_DESERT_DATA,
  'g3-k3-algeb': OCEAN_KINGDOM_DATA,
  'g3-k4-fract': FROZEN_KINGDOM_DATA,
  'g3-k5-meas': STONE_MOUNTAIN_DATA,
  'g3-k6-chron': SWEET_VALLEY_DATA,
  'g3-k7-infinit': DARK_KINGDOM_DATA,

  // Biome aliases
  emerald_forest: EMERALD_FOREST_DATA,
  golden_desert: GOLDEN_DESERT_DATA,
  ocean_kingdom: OCEAN_KINGDOM_DATA,
  frozen_kingdom: FROZEN_KINGDOM_DATA,
  stone_mountain: STONE_MOUNTAIN_DATA,
  sweet_valley: SWEET_VALLEY_DATA,
  dark_kingdom: DARK_KINGDOM_DATA,
};

export function getKingdomExplorationData(
  campaignId: CampaignId,
  kingdomId?: string
): KingdomExplorationData {
  if (kingdomId && KINGDOMS_DATA_REGISTRY[kingdomId]) {
    return KINGDOMS_DATA_REGISTRY[kingdomId];
  }

  // Fallback to default kingdom for campaign
  const defaultId = campaignId === 'grade-3' ? 'g3-k1-numeria' : 'g2-k1-arithmia';
  return KINGDOMS_DATA_REGISTRY[defaultId] || EMERALD_FOREST_DATA;
}
