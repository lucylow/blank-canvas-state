import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Zap, Leaf, Box, Building, Swords, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Minimap } from '@/components/game/Minimap';
import { BuildQueue } from '@/components/game/BuildQueue';
import { TechTreeModal } from '@/components/game/TechTreeModal';
import { BuildMenu } from '@/components/game/BuildMenu';
import { COMMANDERS, AI_SUGGESTIONS, BUILDINGS, TECH_TREE } from '@/data/gameData';
import { toast } from 'sonner';

interface GameResources {
  ore: number;
  energy: number;
  biomass: number;
  data: number;
}

const Game = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [resources, setResources] = useState<GameResources>({
    ore: 500,
    energy: 250,
    biomass: 100,
    data: 50
  });
  const [population, setPopulation] = useState({ current: 8, max: 50 });
  const [gameTime, setGameTime] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [showTechTree, setShowTechTree] = useState(false);
  const [showCommanders, setShowCommanders] = useState(false);
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [buildQueue, setBuildQueue] = useState<any[]>([]);
  const [researchedTechs, setResearchedTechs] = useState<Set<string>>(new Set());
  const [aiMessages, setAiMessages] = useState<Array<{ commander: string; message: string; id: number }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    let playerUnits: Phaser.Physics.Arcade.Sprite[] = [];
    let selectedUnits: Phaser.Physics.Arcade.Sprite[] = [];
    let selectionGraphics: Phaser.GameObjects.Graphics;
    let isSelecting = false;
    let selectionStart = { x: 0, y: 0 };
    let resourceNodes: Phaser.GameObjects.Sprite[] = [];

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 700,
      parent: gameRef.current,
      backgroundColor: '#001122',
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
    };

    function preload(this: Phaser.Scene) {
      this.load.on('progress', (value: number) => {
        setLoadingProgress(value * 100);
      });

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    function create(this: Phaser.Scene) {
      const { width, height } = this.cameras.main;

      // Create grid background with enhanced visuals
      const bgGraphics = this.add.graphics();
      bgGraphics.lineStyle(1, 0x00ffea, 0.08);
      for (let x = 0; x < width * 2; x += 64) {
        bgGraphics.lineBetween(x, 0, x, height * 2);
      }
      for (let y = 0; y < height * 2; y += 64) {
        bgGraphics.lineBetween(0, y, width * 2, y);
      }

      // Create player base
      const playerBase = this.add.circle(200, 200, 50, 0x00ffea, 0.3);
      playerBase.setStrokeStyle(3, 0x00ffea);
      this.add.text(200, 270, 'PLAYER BASE', {
        fontSize: '16px',
        color: '#00ffea',
        fontFamily: 'Orbitron',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Create enemy base
      const enemyBase = this.add.circle(width - 200, height - 200, 50, 0xff0000, 0.3);
      enemyBase.setStrokeStyle(3, 0xff0000);
      this.add.text(width - 200, height - 130, 'ENEMY BASE', {
        fontSize: '16px',
        color: '#ff0000',
        fontFamily: 'Orbitron',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Create resource nodes with labels
      const resourceTypes = [
        { color: 0x00ffea, label: 'ORE', type: 'ore' },
        { color: 0xff00aa, label: 'ENERGY', type: 'energy' },
        { color: 0x00ff00, label: 'BIOMASS', type: 'biomass' }
      ];

      resourceTypes.forEach((resType, idx) => {
        for (let i = 0; i < 3; i++) {
          const x = Phaser.Math.Between(200, width - 200);
          const y = Phaser.Math.Between(200, height - 200);
          const resource = this.add.circle(x, y, 20, resType.color, 0.5);
          resource.setStrokeStyle(2, resType.color);
          resource.setData('type', resType.type);
          resource.setData('amount', 1000);
          resource.setInteractive();
          resourceNodes.push(resource as any);

          const label = this.add.text(x, y, resType.label[0], {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
          }).setOrigin(0.5);
        }
      });

      // Create player units
      for (let i = 0; i < 6; i++) {
        const unit = this.physics.add.sprite(
          250 + (i % 3) * 60,
          250 + Math.floor(i / 3) * 60,
          ''
        );
        unit.displayWidth = 40;
        unit.displayHeight = 40;
        unit.setTint(0x00ffea);
        unit.setInteractive();
        unit.setData('type', i < 3 ? 'worker' : 'infantry');
        unit.setData('health', 100);
        unit.setData('maxHealth', 100);
        unit.setData('selected', false);
        
        // Draw unit shape
        const unitGraphics = this.add.graphics();
        unitGraphics.fillStyle(0x00ffea, 0.8);
        unitGraphics.fillCircle(unit.x, unit.y, 20);
        unitGraphics.lineStyle(2, 0xffffff);
        unitGraphics.strokeCircle(unit.x, unit.y, 20);
        
        unit.setData('graphics', unitGraphics);
        playerUnits.push(unit);

        // Unit click handler
        unit.on('pointerdown', () => {
          if (!unit.getData('selected')) {
            selectedUnits.forEach(u => {
              u.setData('selected', false);
              u.getData('graphics')?.clear();
              const g = u.getData('graphics') as Phaser.GameObjects.Graphics;
              g.fillStyle(0x00ffea, 0.8);
              g.fillCircle(u.x, u.y, 20);
              g.lineStyle(2, 0xffffff);
              g.strokeCircle(u.x, u.y, 20);
            });
            selectedUnits = [unit];
            unit.setData('selected', true);
            const g = unit.getData('graphics') as Phaser.GameObjects.Graphics;
            g.clear();
            g.fillStyle(0x00ffea, 0.8);
            g.fillCircle(unit.x, unit.y, 20);
            g.lineStyle(3, 0xffff00);
            g.strokeCircle(unit.x, unit.y, 20);
            setSelectedUnit(unit.getData('type'));
          }
        });
      }

      // Selection graphics
      selectionGraphics = this.add.graphics();

      // Mouse controls for unit movement
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.rightButtonDown() && selectedUnits.length > 0) {
          selectedUnits.forEach((unit, idx) => {
            const offset = idx * 40;
            this.physics.moveTo(unit, pointer.worldX + offset, pointer.worldY, 200);
            
            // Show movement indicator
            const indicator = this.add.circle(pointer.worldX, pointer.worldY, 5, 0x00ff00, 0.8);
            this.tweens.add({
              targets: indicator,
              alpha: 0,
              scale: 3,
              duration: 500,
              onComplete: () => indicator.destroy()
            });
          });
        } else if (pointer.leftButtonDown()) {
          isSelecting = true;
          selectionStart = { x: pointer.worldX, y: pointer.worldY };
        }
      });

      this.input.on('pointerup', () => {
        if (isSelecting) {
          isSelecting = false;
          selectionGraphics.clear();
        }
      });

      this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        if (isSelecting) {
          selectionGraphics.clear();
          selectionGraphics.lineStyle(2, 0x00ffea, 1);
          selectionGraphics.strokeRect(
            selectionStart.x,
            selectionStart.y,
            pointer.worldX - selectionStart.x,
            pointer.worldY - selectionStart.y
          );
          selectionGraphics.fillStyle(0x00ffea, 0.1);
          selectionGraphics.fillRect(
            selectionStart.x,
            selectionStart.y,
            pointer.worldX - selectionStart.x,
            pointer.worldY - selectionStart.y
          );
        }
      });

      // Camera controls
      const cursors = this.input.keyboard?.createCursorKeys();
      const camera = this.cameras.main;
      camera.setBounds(0, 0, width * 2, height * 2);
      camera.setZoom(1);

      // Keyboard shortcuts
      this.input.keyboard?.on('keydown-T', () => setShowTechTree(true));
      this.input.keyboard?.on('keydown-C', () => setShowCommanders(true));
      this.input.keyboard?.on('keydown-B', () => setShowBuildMenu(true));
      this.input.keyboard?.on('keydown-S', () => {
        selectedUnits.forEach(unit => unit.setVelocity(0, 0));
      });

      this.events.on('update', () => {
        if (!cursors) return;
        const speed = 8;
        if (cursors.left?.isDown) camera.scrollX -= speed;
        if (cursors.right?.isDown) camera.scrollX += speed;
        if (cursors.up?.isDown) camera.scrollY -= speed;
        if (cursors.down?.isDown) camera.scrollY += speed;

        // Update unit graphics positions
        playerUnits.forEach(unit => {
          const g = unit.getData('graphics') as Phaser.GameObjects.Graphics;
          if (g) {
            g.clear();
            const color = unit.getData('selected') ? 0xffff00 : 0x00ffea;
            const lineWidth = unit.getData('selected') ? 3 : 2;
            g.fillStyle(0x00ffea, 0.8);
            g.fillCircle(unit.x, unit.y, 20);
            g.lineStyle(lineWidth, color);
            g.strokeCircle(unit.x, unit.y, 20);
          }
        });
      });

      // Resource generation timer
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          setResources(prev => ({
            ore: prev.ore + 10,
            energy: prev.energy + 5,
            biomass: prev.biomass + 3,
            data: prev.data + 2
          }));
        },
        loop: true
      });

      // Game time
      this.time.addEvent({
        delay: 1000,
        callback: () => setGameTime(prev => prev + 1),
        loop: true
      });

      // AI suggestions
      this.time.addEvent({
        delay: 30000,
        callback: () => {
          const suggestion = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
          const id = Date.now();
          setAiMessages(prev => [...prev, { ...suggestion, id }]);
          toast.info(`${suggestion.commander}: ${suggestion.message}`);
          setTimeout(() => {
            setAiMessages(prev => prev.filter(msg => msg.id !== id));
          }, 10000);
        },
        loop: true
      });
    }

    function update(this: Phaser.Scene) {
      playerUnits.forEach(unit => {
        if (unit.body) {
          const velocity = (unit.body as Phaser.Physics.Arcade.Body).velocity;
          if (Math.abs(velocity.x) < 1 && Math.abs(velocity.y) < 1) {
            unit.setVelocity(0, 0);
          }
        }
      });
    }

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBuild = (buildingId: string) => {
    const building = BUILDINGS[buildingId];
    if (!building) return;

    if (
      (!building.cost.ore || resources.ore >= building.cost.ore) &&
      (!building.cost.energy || resources.energy >= building.cost.energy) &&
      (!building.cost.biomass || resources.biomass >= building.cost.biomass) &&
      (!building.cost.data || resources.data >= building.cost.data)
    ) {
      setResources(prev => ({
        ore: prev.ore - (building.cost.ore || 0),
        energy: prev.energy - (building.cost.energy || 0),
        biomass: prev.biomass - (building.cost.biomass || 0),
        data: prev.data - (building.cost.data || 0)
      }));

      setBuildQueue(prev => [...prev, {
        id: Date.now().toString(),
        name: building.name,
        timeRemaining: building.buildTime,
        totalTime: building.buildTime
      }]);

      toast.success(`${building.name} construction started`);
      setShowBuildMenu(false);
    } else {
      toast.error('Insufficient resources');
    }
  };

  const handleBuildComplete = (id: string) => {
    const item = buildQueue.find(q => q.id === id);
    if (item) {
      const building = Object.values(BUILDINGS).find(b => b.name === item.name);
      if (building?.produces) {
        toast.success(`${item.name} completed! Now producing resources.`);
      } else {
        toast.success(`${item.name} construction complete!`);
      }
    }
  };

  const handleResearch = (techId: string) => {
    const tech = TECH_TREE[techId];
    if (!tech) return;

    if (
      (!tech.cost.ore || resources.ore >= tech.cost.ore) &&
      (!tech.cost.energy || resources.energy >= tech.cost.energy) &&
      (!tech.cost.biomass || resources.biomass >= tech.cost.biomass) &&
      (!tech.cost.data || resources.data >= tech.cost.data)
    ) {
      setResources(prev => ({
        ore: prev.ore - (tech.cost.ore || 0),
        energy: prev.energy - (tech.cost.energy || 0),
        biomass: prev.biomass - (tech.cost.biomass || 0),
        data: prev.data - (tech.cost.data || 0)
      }));

      setTimeout(() => {
        setResearchedTechs(prev => new Set([...prev, techId]));
        toast.success(`Research complete: ${tech.name}! ${tech.effects}`);
      }, tech.researchTime * 1000);

      toast.info(`Researching ${tech.name}... (${tech.researchTime}s)`);
    } else {
      toast.error('Insufficient resources for research');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-quaternion-darker to-quaternion-dark text-quaternion-light overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-quaternion-darker/90 backdrop-blur-md border-b border-quaternion-primary">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-quaternion-primary hover:text-quaternion-secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold text-quaternion-primary">QUATERNION: NEURAL FRONTIER</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowBuildMenu(true)}>
              <Building className="mr-1 h-3 w-3" /> Build
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowTechTree(true)}>
              <Brain className="mr-1 h-3 w-3" /> Tech
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowCommanders(true)}>
              <Swords className="mr-1 h-3 w-3" /> Commanders
            </Button>
          </div>
        </div>
      </header>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-quaternion-darker">
          <h2 className="text-4xl font-bold text-quaternion-primary mb-4">INITIALIZING AI SYSTEMS</h2>
          <p className="text-quaternion-light mb-6">Loading Neural Networks...</p>
          <div className="w-80 h-5 bg-quaternion-dark border border-quaternion-primary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-quaternion-primary to-quaternion-secondary transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
          </div>
        </div>
      )}

      <div className="pt-20 px-4">
        <div className="container mx-auto max-w-[1400px]">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-9">
              <div ref={gameRef} className="relative border-2 border-quaternion-primary rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,234,0.3)]" style={{ height: '700px' }} />
            </div>

            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="bg-quaternion-darker/80 backdrop-blur-sm border border-quaternion-primary/30 rounded-lg p-4">
                <h3 className="text-quaternion-primary font-bold mb-3 flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  Resources
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2"><Box className="w-3 h-3 text-quaternion-primary" /> Ore</span>
                    <span className="font-mono text-quaternion-primary">{resources.ore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2"><Zap className="w-3 h-3 text-quaternion-secondary" /> Energy</span>
                    <span className="font-mono text-quaternion-secondary">{resources.energy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2"><Leaf className="w-3 h-3 text-green-500" /> Biomass</span>
                    <span className="font-mono text-green-500">{resources.biomass}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2"><Brain className="w-3 h-3 text-yellow-500" /> Data</span>
                    <span className="font-mono text-yellow-500">{resources.data}</span>
                  </div>
                </div>
              </div>

              <div className="bg-quaternion-darker/80 backdrop-blur-sm border border-quaternion-primary/30 rounded-lg p-4">
                <h3 className="text-quaternion-primary font-bold mb-3">Game Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-mono">{formatTime(gameTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Population</span>
                    <span className="font-mono">{population.current}/{population.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Techs</span>
                    <span className="font-mono">{researchedTechs.size}/{Object.keys(TECH_TREE).length}</span>
                  </div>
                  {selectedUnit && (
                    <div className="pt-2 border-t border-quaternion-primary/20">
                      <span className="text-quaternion-secondary">Selected: {selectedUnit}</span>
                    </div>
                  )}
                </div>
              </div>

              <BuildQueue queue={buildQueue} onItemComplete={handleBuildComplete} />

              <Minimap 
                gameWidth={1200 * 2}
                gameHeight={700 * 2}
                playerUnits={[]}
                enemyUnits={[]}
                buildings={[]}
              />

              <div className="bg-quaternion-darker/80 backdrop-blur-sm border border-quaternion-primary/30 rounded-lg p-4">
                <h3 className="text-quaternion-primary font-bold mb-3">Controls</h3>
                <div className="space-y-1 text-xs">
                  <p>• Left Click: Select</p>
                  <p>• Right Click: Move</p>
                  <p>• Arrows: Camera</p>
                  <p>• B: Build Menu</p>
                  <p>• T: Tech Tree</p>
                  <p>• C: Commanders</p>
                  <p>• S: Stop Units</p>
                </div>
              </div>

              {aiMessages.length > 0 && (
                <div className="bg-quaternion-darker/80 backdrop-blur-sm border border-quaternion-primary/30 rounded-lg p-4">
                  <h3 className="text-quaternion-primary font-bold mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    AI Suggestion
                  </h3>
                  {aiMessages.map(msg => (
                    <div key={msg.id} className="text-xs mb-2 last:mb-0">
                      <span className="font-bold text-quaternion-secondary">{msg.commander}:</span>
                      <p className="text-quaternion-light/80 mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTechTree && (
        <TechTreeModal
          researchedTechs={researchedTechs}
          resources={resources}
          onResearch={handleResearch}
          onClose={() => setShowTechTree(false)}
        />
      )}

      {showBuildMenu && (
        <BuildMenu
          resources={resources}
          onBuild={handleBuild}
          onClose={() => setShowBuildMenu(false)}
        />
      )}

      {showCommanders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCommanders(false)}>
          <div className="bg-quaternion-darker border-2 border-quaternion-primary rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-quaternion-primary mb-4">AI COMMANDERS</h2>
            <div className="grid grid-cols-2 gap-4">
              {COMMANDERS.map((cmd) => (
                <div key={cmd.id} className="bg-quaternion-dark border-l-4 rounded p-4" style={{ borderColor: cmd.color }}>
                  <h3 className="font-bold text-lg mb-1" style={{ color: cmd.color }}>{cmd.name}</h3>
                  <p className="text-sm text-quaternion-light/60 italic mb-2">{cmd.role}</p>
                  <p className="text-xs text-quaternion-light/80 mb-2">{cmd.focus}</p>
                  <p className="text-xs text-quaternion-light/60 italic border-t border-quaternion-primary/20 pt-2 mt-2">
                    "{cmd.quote}"
                  </p>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowCommanders(false)} className="mt-4 w-full">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
