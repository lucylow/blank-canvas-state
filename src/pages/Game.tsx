import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Zap, Leaf, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <Button variant="outline" size="sm" onClick={() => setShowTechTree(true)}>Tech Tree</Button>
            <Button variant="outline" size="sm" onClick={() => setShowCommanders(true)}>Commanders</Button>
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
                  {selectedUnit && (
                    <div className="pt-2 border-t border-quaternion-primary/20">
                      <span className="text-quaternion-secondary">Selected: {selectedUnit}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-quaternion-darker/80 backdrop-blur-sm border border-quaternion-primary/30 rounded-lg p-4">
                <h3 className="text-quaternion-primary font-bold mb-3">Controls</h3>
                <div className="space-y-1 text-xs">
                  <p>• Left Click: Select</p>
                  <p>• Right Click: Move</p>
                  <p>• Arrows: Camera</p>
                  <p>• T: Tech Tree</p>
                  <p>• C: Commanders</p>
                  <p>• S: Stop Units</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTechTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowTechTree(false)}>
          <div className="bg-quaternion-darker border-2 border-quaternion-primary rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-quaternion-primary mb-4">QUATERNION TECH TREE</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Matter Core', 'Energy Reactor', 'Bio Labs', 'Data Center'].map((tech, i) => (
                <div key={i} className="bg-quaternion-dark border border-quaternion-primary/30 rounded p-3">
                  <h3 className="font-bold text-sm mb-1">{tech}</h3>
                  <p className="text-xs text-quaternion-light/60">Cost: {100 + i * 50} Ore</p>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowTechTree(false)} className="mt-4 w-full">Close</Button>
          </div>
        </div>
      )}

      {showCommanders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCommanders(false)}>
          <div className="bg-quaternion-darker border-2 border-quaternion-primary rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-quaternion-primary mb-4">AI COMMANDERS</h2>
            <div className="space-y-3">
              {[
                { name: 'AUREN', role: 'Architect of Matter', color: 'quaternion-primary' },
                { name: 'VIREL', role: 'Keeper of Energy', color: 'quaternion-secondary' },
                { name: 'LIRA', role: 'Voice of Life', color: 'green-500' },
                { name: 'KOR', role: 'Seer of Knowledge', color: 'yellow-500' }
              ].map((cmd, i) => (
                <div key={i} className={`bg-quaternion-dark border-l-4 border-${cmd.color} rounded p-3`}>
                  <h3 className="font-bold">{cmd.name}</h3>
                  <p className="text-sm text-quaternion-light/60">{cmd.role}</p>
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
