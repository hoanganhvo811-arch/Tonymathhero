import { createHashRouter, Navigate } from 'react-router-dom';
import { HomeScreen } from '@/features/home/HomeScreen';
import { CampaignSelectionScreen } from '@/features/campaign-selection/CampaignSelectionScreen';
import { WorldMapScreen } from '@/features/world-map/WorldMapScreen';
import { ExplorationScreen } from '@/features/exploration/ExplorationScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { BattleScreen } from '@/features/battle/BattleScreen';
import { LearningDashboardScreen } from '@/features/learning/LearningDashboardScreen';
import { DivisionKingdomScreen } from '@/features/division/DivisionKingdomScreen';
import { WordProblemAdventureScreen } from '@/features/word-problems/WordProblemAdventureScreen';
import { GeometryMeasurementScreen } from '@/features/geometry-measurement/GeometryMeasurementScreen';
import { NumberKingdomScreen } from '@/features/number-sense/NumberKingdomScreen';
import { FractionKingdomScreen } from '@/features/fractions/FractionKingdomScreen';
import { TimeCalendarKingdomScreen } from '@/features/time-calendar/TimeCalendarKingdomScreen';
import { MoneyKingdomScreen } from '@/features/money-shopping/MoneyKingdomScreen';
import { AdvancedArenaScreen } from '@/features/advanced-arena/AdvancedArenaScreen';
import { LogicKingdomScreen } from '@/features/logic-thinking/components/LogicKingdomScreen';
import { FinalCampaignScreen } from '@/features/final-campaign/components/FinalCampaignScreen';
import { GameLayout } from '@/components/layout/GameLayout';

export const router = createHashRouter([
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/campaigns',
    element: <CampaignSelectionScreen />,
  },
  {
    path: '/division-kingdom',
    element: <DivisionKingdomScreen />,
  },
  {
    path: '/word-problem-adventure',
    element: <WordProblemAdventureScreen />,
  },
  {
    path: '/geometry-measurement',
    element: <GeometryMeasurementScreen />,
  },
  {
    path: '/number-kingdom',
    element: <NumberKingdomScreen />,
  },
  {
    path: '/fractions-kingdom',
    element: <FractionKingdomScreen />,
  },
  {
    path: '/time-kingdom',
    element: <TimeCalendarKingdomScreen />,
  },
  {
    path: '/money-kingdom',
    element: <MoneyKingdomScreen />,
  },
  {
    path: '/advanced-arena',
    element: <AdvancedArenaScreen />,
  },
  {
    path: '/logic-kingdom',
    element: <LogicKingdomScreen />,
  },
  {
    path: '/final-campaign',
    element: <FinalCampaignScreen />,
  },
  {
    path: '/battle',
    element: <BattleScreen />,
  },
  {
    path: '/learning',
    element: <LearningDashboardScreen />,
  },
  {
    path: '/learning-dashboard',
    element: <LearningDashboardScreen />,
  },
  {
    element: <GameLayout />,
    children: [
      {
        path: '/map',
        element: <WorldMapScreen />,
      },
      {
        path: '/explore',
        element: <ExplorationScreen />,
      },
      {
        path: '/explore/:kingdomId',
        element: <ExplorationScreen />,
      },
      {
        path: '/profile',
        element: <ProfileScreen />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
