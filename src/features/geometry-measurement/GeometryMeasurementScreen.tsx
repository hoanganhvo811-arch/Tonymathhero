import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Castle,
  Flower2,
  FlaskConical,
  Clock,
  Navigation,
  Swords,
  BarChart3,
  Award,
  Sparkles,
} from 'lucide-react';
import { useGeometryMeasurementStore, type GeometryKingdomZone } from './useGeometryMeasurementStore';
import { SHAPES_CATALOG } from './data/shapesCatalog';
import { MEASUREMENT_TASKS, SPATIAL_MAZE_TASKS } from './data/measurementToolsCatalog';
import { REAL_LIFE_GEOMETRY_QUESTS } from './data/geometryQuestsCatalog';
import { GEOMETRY_PUZZLES_CATALOG } from './data/geometryPuzzlesCatalog';
import { Shape3DViewer } from './components/Shape3DViewer';
import { VirtualRulerLab } from './components/VirtualRulerLab';
import { VirtualScaleLab } from './components/VirtualScaleLab';
import { VirtualBeakerLab } from './components/VirtualBeakerLab';
import { InteractiveClockLab } from './components/InteractiveClockLab';
import { SpatialMazeLab } from './components/SpatialMazeLab';
import { GeometryGardenGames } from './components/GeometryGardenGames';
import { GeometryQuestsView } from './components/GeometryQuestsView';
import { GeometryArenaBattleView } from './components/GeometryArenaBattleView';
import { GeometryAnalyticsView } from './components/GeometryAnalyticsView';
import { SoundButton } from '@/components/common/SoundButton';

export const GeometryMeasurementScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeZone,
    setActiveZone,
    campaignId,
    setCampaignId,
    selectedShape,
    selectShape,
    markShapeExplored,
    speakShapeIntro,
    activeMeasurementTask,
    selectMeasurementTask,
    rulerUserValue,
    rulerOffset,
    setRulerUserValue,
    setRulerOffset,
    scalePlacedWeights,
    addScaleWeight,
    removeScaleWeight,
    resetScale,
    beakerVolumeMl,
    pourBeaker,
    resetBeaker,
    clockHour,
    clockMinute,
    setClockTime,
    submitMeasurementCheck,
    toolFeedback,
    activeMazeIndex,
    mazePlayerPos,
    mazeCommands,
    mazeFeedback,
    moveMaze,
    resetMaze,
    activeQuest,
    questStep,
    solvedQuestIds,
    startQuest,
    answerQuestStep,
    solvedPuzzleIds,
    currentPuzzle,
    nextAdaptivePuzzle,
    submitPuzzleAnswer,
    bossHp,
    bossMaxHp,
    tonyHp,
    tonyMaxHp,
    battleLog,
    isBattleVictory,
    attackBoss,
    resetBattle,
    totalExp,
    totalGold,
    loadProgress,
  } = useGeometryMeasurementStore();

  useEffect(() => {
    loadProgress('student_tony_hero', campaignId);
  }, [campaignId]);

  const zones: { id: GeometryKingdomZone | 'analytics' | 'quests'; label: string; icon: React.ReactNode }[] = [
    { id: 'castle', label: 'Lâu Đài Hình Học', icon: <Castle size={18} /> },
    { id: 'garden', label: 'Vườn Hình & Đố Vui', icon: <Flower2 size={18} /> },
    { id: 'lab', label: 'Phòng Đo Lường', icon: <FlaskConical size={18} /> },
    { id: 'tower', label: 'Tháp Thời Gian', icon: <Clock size={18} /> },
    { id: 'space', label: 'Mê Cung Không Gian', icon: <Navigation size={18} /> },
    { id: 'quests', label: 'Nhiệm Vụ Thực Tế', icon: <Compass size={18} /> },
    { id: 'arena', label: 'Đấu Trường Boss', icon: <Swords size={18} /> },
    { id: 'analytics', label: 'Năng Lực & Huy Hiệu', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #0d1e3d 0%, #071026 50%, #030712 100%)',
        color: '#f8fafc',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
      }}
    >
      {/* Top Navigation & Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '14px 20px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <SoundButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/map')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Bản Đồ Thế Giới
          </SoundButton>

          <div>
            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#38bdf8',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              📐 VƯƠNG QUỐC HÌNH HỌC VÀ ĐO LƯỜNG
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Geometry & Measurement Kingdom – Khám phá 3D, thao tác trực quan & giải cứu thế giới
            </p>
          </div>
        </div>

        {/* Grade Switcher & EXP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.8)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setCampaignId('grade-2')}
              style={{
                background: campaignId === 'grade-2' ? '#10b981' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 14px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Lớp 2 (Hiệp Sĩ Nhí)
            </button>
            <button
              onClick={() => setCampaignId('grade-3')}
              style={{
                background: campaignId === 'grade-3' ? '#0284c7' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 14px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Lớp 3 (Đại Hiệp Sĩ)
            </button>
          </div>

          <div style={{ background: 'rgba(250, 204, 21, 0.15)', border: '1px solid #facc15', borderRadius: '12px', padding: '6px 14px', color: '#facc15', fontWeight: 800, fontSize: '0.85rem' }}>
            ⭐ +{totalExp} EXP &nbsp;|&nbsp; 🪙 +{totalGold} Vàng
          </div>
        </div>
      </div>

      {/* Zone Tabs Selector */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {zones.map((z) => {
          const isActive = activeZone === z.id;
          return (
            <button
              key={z.id}
              onClick={() => setActiveZone(z.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '14px',
                background: isActive
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  : 'rgba(15, 23, 42, 0.7)',
                color: isActive ? '#fff' : '#cbd5e1',
                border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.4)' : 'none',
              }}
            >
              {z.icon}
              <span>{z.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Areas */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {/* ZONE 1: SHAPE CASTLE */}
        {activeZone === 'castle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Shapes Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SHAPES_CATALOG.map((s) => {
                const isSelected = selectedShape.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      selectShape(s.id);
                      markShapeExplored(s.id);
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: isSelected ? s.color : 'rgba(15, 23, 42, 0.8)',
                      color: isSelected ? '#fff' : '#cbd5e1',
                      border: `1.5px solid ${isSelected ? s.color : 'rgba(255,255,255,0.1)'}`,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {s.nameVi} ({s.dimension})
                  </button>
                );
              })}
            </div>

            <Shape3DViewer
              shape={selectedShape}
              onSpeak={speakShapeIntro}
              onExplored={markShapeExplored}
            />
          </div>
        )}

        {/* ZONE 2: GEOMETRY GARDEN */}
        {activeZone === 'garden' && (
          <GeometryGardenGames
            currentPuzzle={currentPuzzle}
            solvedCount={solvedPuzzleIds.length}
            totalPuzzles={GEOMETRY_PUZZLES_CATALOG.length}
            onSubmitAnswer={submitPuzzleAnswer}
            onNextPuzzle={nextAdaptivePuzzle}
          />
        )}

        {/* ZONE 3: MEASUREMENT LAB */}
        {activeZone === 'lab' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Lab Task Selector */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {MEASUREMENT_TASKS.filter((t) => t.type !== 'time').map((t) => {
                const isSel = activeMeasurementTask.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectMeasurementTask(t.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: isSel ? '#0284c7' : 'rgba(30, 41, 59, 0.8)',
                      color: '#fff',
                      border: `1px solid ${isSel ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    {t.targetItemEmoji} {t.title}
                  </button>
                );
              })}
            </div>

            {/* Render appropriate Lab Tool */}
            {activeMeasurementTask.type === 'length' && (
              <VirtualRulerLab
                task={activeMeasurementTask}
                userValue={rulerUserValue}
                rulerOffset={rulerOffset}
                onUserValueChange={setRulerUserValue}
                onRulerOffsetChange={setRulerOffset}
                onSubmit={submitMeasurementCheck}
                feedback={toolFeedback}
              />
            )}

            {activeMeasurementTask.type === 'mass' && (
              <VirtualScaleLab
                task={activeMeasurementTask}
                placedWeights={scalePlacedWeights}
                onAddWeight={addScaleWeight}
                onRemoveWeight={removeScaleWeight}
                onReset={resetScale}
                onSubmit={submitMeasurementCheck}
                feedback={toolFeedback}
              />
            )}

            {activeMeasurementTask.type === 'capacity' && (
              <VirtualBeakerLab
                task={activeMeasurementTask}
                currentVolumeMl={beakerVolumeMl}
                onPour={pourBeaker}
                onReset={resetBeaker}
                onSubmit={submitMeasurementCheck}
                feedback={toolFeedback}
              />
            )}
          </div>
        )}

        {/* ZONE 4: TIME TOWER */}
        {activeZone === 'tower' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {MEASUREMENT_TASKS.filter((t) => t.type === 'time').map((t) => {
                const isSel = activeMeasurementTask.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectMeasurementTask(t.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: isSel ? '#8b5cf6' : 'rgba(30, 41, 59, 0.8)',
                      color: '#fff',
                      border: `1px solid ${isSel ? '#c084fc' : 'rgba(255,255,255,0.1)'}`,
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    {t.targetItemEmoji} {t.title}
                  </button>
                );
              })}
            </div>

            <InteractiveClockLab
              task={activeMeasurementTask}
              currentHour={clockHour}
              currentMinute={clockMinute}
              onTimeChange={setClockTime}
              onSubmit={submitMeasurementCheck}
              feedback={toolFeedback}
            />
          </div>
        )}

        {/* ZONE 5: SPATIAL MAZE */}
        {activeZone === 'space' && (
          <SpatialMazeLab
            task={SPATIAL_MAZE_TASKS[activeMazeIndex]}
            playerPos={mazePlayerPos}
            commands={mazeCommands}
            feedback={mazeFeedback}
            onMove={moveMaze}
            onReset={resetMaze}
          />
        )}

        {/* ZONE 6: REAL-LIFE QUESTS */}
        {activeZone === ('quests' as any) && (
          <GeometryQuestsView
            quests={REAL_LIFE_GEOMETRY_QUESTS}
            activeQuest={activeQuest}
            questStep={questStep}
            solvedQuestIds={solvedQuestIds}
            onStartQuest={startQuest}
            onAnswerStep={answerQuestStep}
          />
        )}

        {/* ZONE 7: ARENA BOSS BATTLE */}
        {activeZone === 'arena' && (
          <GeometryArenaBattleView
            bossHp={bossHp}
            bossMaxHp={bossMaxHp}
            tonyHp={tonyHp}
            tonyMaxHp={tonyMaxHp}
            battleLog={battleLog}
            isBattleVictory={isBattleVictory}
            onAttack={attackBoss}
            onReset={resetBattle}
          />
        )}

        {/* ZONE 8: ANALYTICS & DASHBOARD */}
        {activeZone === ('analytics' as any) && <GeometryAnalyticsView />}
      </div>
    </div>
  );
};
