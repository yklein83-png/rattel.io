/**
 * RATTEL - Honey Badger Don't Care
 * An action runner where you ATTACK everything!
 */

(function() {
    'use strict';

    // ============================================
    // SOUND ENGINE (Web Audio API)
    // ============================================
    class SoundEngine {
        constructor() {
            this.enabled = true;
            this.ctx = null;
            this.masterGain = null;
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.3;
                this.masterGain.connect(this.ctx.destination);
                this.initialized = true;
            } catch (e) {
                this.enabled = false;
            }
        }

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        // Attack swoosh sound
        playAttack() {
            if (!this.enabled || !this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        }

        // Hit/kill sound - satisfying impact
        playHit() {
            if (!this.enabled || !this.ctx) return;

            // Impact
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
            gain1.gain.setValueAtTime(0.4, this.ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            osc1.connect(gain1);
            gain1.connect(this.masterGain);
            osc1.start();
            osc1.stop(this.ctx.currentTime + 0.1);

            // Pop
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);
            gain2.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
            osc2.connect(gain2);
            gain2.connect(this.masterGain);
            osc2.start();
            osc2.stop(this.ctx.currentTime + 0.08);
        }

        // Combo sound - ascending tone
        playCombo(level) {
            if (!this.enabled || !this.ctx) return;
            const baseFreq = 300 + (level * 100);

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.2);
        }

        // Rage mode activation - power up!
        playRage() {
            if (!this.enabled || !this.ctx) return;

            const notes = [200, 300, 400, 600, 800];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

                gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
                gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + i * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.15);

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(this.ctx.currentTime + i * 0.08);
                osc.stop(this.ctx.currentTime + i * 0.08 + 0.15);
            });
        }

        // Game over sound
        playGameOver() {
            if (!this.enabled || !this.ctx) return;

            const notes = [400, 350, 300, 200];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);

                gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.2);

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(this.ctx.currentTime + i * 0.15);
                osc.stop(this.ctx.currentTime + i * 0.15 + 0.2);
            });
        }

        // Jump/small hop sound
        playJump() {
            if (!this.enabled || !this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(250, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.1);
        }

        toggle() {
            this.enabled = !this.enabled;
            if (this.musicPlaying) {
                if (this.enabled) {
                    this.musicGain.gain.value = 0.15;
                } else {
                    this.musicGain.gain.value = 0;
                }
            }
            return this.enabled;
        }

        // ========== BACKGROUND MUSIC ==========
        startMusic() {
            if (!this.ctx || this.musicPlaying) return;
            this.musicPlaying = true;

            // Music gain node
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = this.enabled ? 0.15 : 0;
            this.musicGain.connect(this.ctx.destination);

            // Start the music loops
            this.playBassLoop();
            this.playArpeggioLoop();
            this.playDrumLoop();
        }

        stopMusic() {
            this.musicPlaying = false;
            if (this.bassInterval) clearInterval(this.bassInterval);
            if (this.arpInterval) clearInterval(this.arpInterval);
            if (this.drumInterval) clearInterval(this.drumInterval);
            this.bassInterval = null;
            this.arpInterval = null;
            this.drumInterval = null;
        }

        playBassLoop() {
            // Bass notes (simple progression in E minor)
            const bassNotes = [82.41, 82.41, 110, 98]; // E2, E2, A2, G2
            let noteIndex = 0;

            const playBassNote = () => {
                if (!this.musicPlaying || !this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.value = bassNotes[noteIndex];

                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.1, this.ctx.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

                osc.connect(gain);
                gain.connect(this.musicGain);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.5);

                noteIndex = (noteIndex + 1) % bassNotes.length;
            };

            playBassNote();
            this.bassInterval = setInterval(() => {
                if (this.musicPlaying) playBassNote();
            }, 500);
        }

        playArpeggioLoop() {
            // Arpeggio notes (E minor pentatonic)
            const arpNotes = [
                329.63, 392.00, 493.88, 587.33, // E4, G4, B4, D5
                659.25, 587.33, 493.88, 392.00, // E5, D5, B4, G4
            ];
            let noteIndex = 0;

            const playArpNote = () => {
                if (!this.musicPlaying || !this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.value = arpNotes[noteIndex];

                // Duty cycle effect via detune
                osc.detune.value = Math.sin(noteIndex) * 10;

                gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

                osc.connect(gain);
                gain.connect(this.musicGain);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.15);

                noteIndex = (noteIndex + 1) % arpNotes.length;
            };

            // Offset start for groove
            setTimeout(() => {
                playArpNote();
                this.arpInterval = setInterval(() => {
                    if (this.musicPlaying) playArpNote();
                }, 125); // 16th notes at 120 BPM
            }, 62);
        }

        playDrumLoop() {
            let beat = 0;

            const playDrum = () => {
                if (!this.musicPlaying || !this.ctx) return;

                // Kick on 1 and 3
                if (beat % 4 === 0) {
                    const kickOsc = this.ctx.createOscillator();
                    const kickGain = this.ctx.createGain();
                    kickOsc.type = 'sine';
                    kickOsc.frequency.setValueAtTime(150, this.ctx.currentTime);
                    kickOsc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.1);
                    kickGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
                    kickGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
                    kickOsc.connect(kickGain);
                    kickGain.connect(this.musicGain);
                    kickOsc.start();
                    kickOsc.stop(this.ctx.currentTime + 0.15);
                }

                // Hi-hat on every beat
                const noise = this.ctx.createBufferSource();
                const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < noiseBuffer.length; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                noise.buffer = noiseBuffer;

                const hihatGain = this.ctx.createGain();
                const hihatFilter = this.ctx.createBiquadFilter();
                hihatFilter.type = 'highpass';
                hihatFilter.frequency.value = 8000;

                hihatGain.gain.setValueAtTime(beat % 2 === 0 ? 0.15 : 0.08, this.ctx.currentTime);
                hihatGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

                noise.connect(hihatFilter);
                hihatFilter.connect(hihatGain);
                hihatGain.connect(this.musicGain);
                noise.start();

                // Snare on 2 and 4
                if (beat % 4 === 2) {
                    const snareOsc = this.ctx.createOscillator();
                    const snareGain = this.ctx.createGain();
                    const snareNoise = this.ctx.createBufferSource();
                    const snareNoiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
                    const snareOutput = snareNoiseBuffer.getChannelData(0);
                    for (let i = 0; i < snareNoiseBuffer.length; i++) {
                        snareOutput[i] = Math.random() * 2 - 1;
                    }
                    snareNoise.buffer = snareNoiseBuffer;

                    snareOsc.type = 'triangle';
                    snareOsc.frequency.setValueAtTime(200, this.ctx.currentTime);
                    snareOsc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

                    snareGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                    snareGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

                    const snareNoiseGain = this.ctx.createGain();
                    snareNoiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                    snareNoiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

                    snareOsc.connect(snareGain);
                    snareGain.connect(this.musicGain);
                    snareNoise.connect(snareNoiseGain);
                    snareNoiseGain.connect(this.musicGain);

                    snareOsc.start();
                    snareOsc.stop(this.ctx.currentTime + 0.1);
                    snareNoise.start();
                }

                beat = (beat + 1) % 8;
            };

            playDrum();
            this.drumInterval = setInterval(() => {
                if (this.musicPlaying) playDrum();
            }, 125); // 8th notes at 120 BPM
        }
    }

    const Sound = new SoundEngine();

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        CANVAS_WIDTH: 600,
        CANVAS_HEIGHT: 250,
        GROUND_Y: 200,

        // Ratel
        RATEL_X: 80,
        RATEL_WIDTH: 64,
        RATEL_HEIGHT: 48,

        // Physics
        GRAVITY: 0.8,
        JUMP_FORCE: -14,

        // Game
        INITIAL_SPEED: 4,
        MAX_SPEED: 12,
        ACCELERATION: 0.002,

        // Combat
        ATTACK_DURATION: 300,
        ATTACK_RANGE: 80,
        RAGE_MAX: 100,
        RAGE_GAIN: 15,
        RAGE_DECAY: 0.1,
        INVINCIBLE_DURATION: 3000,
    };

    // ============================================
    // COLORS - Synthwave Neon Palette
    // ============================================
    const COLORS = {
        bg1: '#0f0f23',
        bg2: '#1a1a3e',
        ground: '#2d1b4e',
        groundLine: '#ff6b35',

        // Ratel colors
        ratelWhite: '#f0e6d3',
        ratelGray: '#a89880',
        ratelBlack: '#1a1714',
        ratelEye: '#ff6b35',
        ratelEyeGlow: '#ffaa00',

        // Neon
        neonOrange: '#ff6b35',
        neonPink: '#ff2a6d',
        neonCyan: '#05d9e8',
        neonPurple: '#d300c5',
        neonYellow: '#fffc00',

        // UI
        white: '#ffffff',
        textShadow: '#ff6b35',
    };

    // ============================================
    // ENEMY TYPES
    // ============================================
    const ENEMIES = {
        BEE: {
            name: 'Abeille',
            width: 32,
            height: 28,
            points: 10,
            color: '#ffcc00',
            accentColor: '#1a1a1a',
            minSpeed: 0,
            yOffset: -40, // Flies above ground
            moves: true,
        },
        SNAKE: {
            name: 'Serpent',
            width: 48,
            height: 20,
            points: 25,
            color: '#44aa44',
            accentColor: '#226622',
            minSpeed: 5,
            yOffset: 0,
            moves: false,
        },
        COBRA: {
            name: 'Cobra',
            width: 40,
            height: 45,
            points: 50,
            color: '#884488',
            accentColor: '#ff4444',
            minSpeed: 7,
            yOffset: 0,
            moves: false,
        },
        LION: {
            name: 'Lion',
            width: 70,
            height: 55,
            points: 100,
            color: '#d4a855',
            accentColor: '#8b5a2b',
            minSpeed: 9,
            yOffset: 0,
            moves: false,
        },
    };

    // ============================================
    // COMBO MESSAGES
    // ============================================
    const COMBO_MESSAGES = [
        { threshold: 3, text: 'NICE!', color: COLORS.neonCyan },
        { threshold: 5, text: 'GREAT!', color: COLORS.neonYellow },
        { threshold: 8, text: 'AWESOME!', color: COLORS.neonOrange },
        { threshold: 12, text: 'SAVAGE!', color: COLORS.neonPink },
        { threshold: 15, text: 'UNSTOPPABLE!', color: COLORS.neonPurple },
        { threshold: 20, text: 'HONEY BADGER!!', color: COLORS.white },
    ];

    // ============================================
    // MAIN GAME CLASS
    // ============================================
    class HoneyBadgerGame {
        constructor(container) {
            this.container = container;
            this.canvas = document.createElement('canvas');
            this.canvas.width = CONFIG.CANVAS_WIDTH;
            this.canvas.height = CONFIG.CANVAS_HEIGHT;
            this.canvas.className = 'game-canvas';
            this.ctx = this.canvas.getContext('2d');

            container.innerHTML = '';
            container.appendChild(this.canvas);

            // Add sound toggle button
            this.soundBtn = document.createElement('button');
            this.soundBtn.className = 'sound-toggle';
            this.soundBtn.innerHTML = '🔊';
            this.soundBtn.title = 'Toggle sound';
            this.soundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const enabled = Sound.toggle();
                this.soundBtn.innerHTML = enabled ? '🔊' : '🔇';
            });
            container.appendChild(this.soundBtn);

            this.init();
            this.setupControls();
            this.gameLoop();
        }

        init() {
            // Game state
            this.playing = false;
            this.gameOver = false;
            this.score = 0;
            this.highScore = parseInt(localStorage.getItem('rattelHighScore')) || 0;
            this.speed = CONFIG.INITIAL_SPEED;
            this.distance = 0;

            // Ratel state
            this.ratel = {
                x: CONFIG.RATEL_X,
                y: CONFIG.GROUND_Y - CONFIG.RATEL_HEIGHT,
                vy: 0,
                width: CONFIG.RATEL_WIDTH,
                height: CONFIG.RATEL_HEIGHT,
                grounded: true,
                attacking: false,
                attackTime: 0,
                rage: 0,
                invincible: false,
                invincibleTime: 0,
                frame: 0,
                frameTime: 0,
            };

            // Combat
            this.combo = 0;
            this.comboTimer = 0;
            this.lastComboMessage = null;

            // Entities
            this.enemies = [];
            this.particles = [];
            this.floatingTexts = [];
            this.stars = this.createStars();

            // Effects
            this.screenShake = 0;
            this.flashAlpha = 0;

            // Timers
            this.enemyTimer = 0;
            this.lastTime = performance.now();
        }

        createStars() {
            const stars = [];
            for (let i = 0; i < 50; i++) {
                stars.push({
                    x: Math.random() * CONFIG.CANVAS_WIDTH,
                    y: Math.random() * (CONFIG.GROUND_Y - 50),
                    size: Math.random() * 2 + 1,
                    speed: Math.random() * 0.5 + 0.2,
                    twinkle: Math.random() * Math.PI * 2,
                });
            }
            return stars;
        }

        setupControls() {
            // Keyboard
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                    e.preventDefault();
                    this.handleInput();
                }
            });

            // Touch/Click
            this.canvas.addEventListener('click', () => this.handleInput());
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleInput();
            }, { passive: false });
        }

        handleInput() {
            // Init sound on first interaction (browser requirement)
            Sound.init();
            Sound.resume();

            if (!this.playing && !this.gameOver) {
                this.start();
            } else if (this.playing) {
                this.attack();
            } else if (this.gameOver) {
                this.restart();
            }
        }

        start() {
            this.playing = true;
            this.gameOver = false;
            Sound.startMusic();
        }

        restart() {
            this.init();
            this.playing = true;
            Sound.startMusic();
        }

        attack() {
            if (!this.ratel.attacking) {
                this.ratel.attacking = true;
                this.ratel.attackTime = CONFIG.ATTACK_DURATION;

                // Sound
                Sound.playAttack();

                // Small jump during attack
                if (this.ratel.grounded) {
                    this.ratel.vy = CONFIG.JUMP_FORCE * 0.5;
                    this.ratel.grounded = false;
                    Sound.playJump();
                }

                // Create attack particles
                this.createAttackParticles();
            }
        }

        activateRage() {
            if (this.ratel.rage >= CONFIG.RAGE_MAX && !this.ratel.invincible) {
                this.ratel.invincible = true;
                this.ratel.invincibleTime = CONFIG.INVINCIBLE_DURATION;
                this.ratel.rage = 0;
                this.flashAlpha = 1;
                this.screenShake = 20;

                // Sound
                Sound.playRage();

                this.addFloatingText('RAGE MODE!', CONFIG.CANVAS_WIDTH / 2, 80, COLORS.neonPink, 40);
            }
        }

        // ============================================
        // UPDATE LOOP
        // ============================================
        update(deltaTime) {
            if (!this.playing) return;

            // Update speed
            if (this.speed < CONFIG.MAX_SPEED) {
                this.speed += CONFIG.ACCELERATION * deltaTime;
            }
            this.distance += this.speed * deltaTime / 1000;

            // Update ratel
            this.updateRatel(deltaTime);

            // Update enemies
            this.updateEnemies(deltaTime);

            // Update particles
            this.updateParticles(deltaTime);

            // Update floating texts
            this.updateFloatingTexts(deltaTime);

            // Update stars
            this.updateStars(deltaTime);

            // Update effects
            this.updateEffects(deltaTime);

            // Spawn enemies
            this.spawnEnemies(deltaTime);

            // Check collisions
            this.checkCollisions();

            // Update combo
            this.updateCombo(deltaTime);

            // Decay rage
            if (!this.ratel.invincible && this.ratel.rage > 0) {
                this.ratel.rage = Math.max(0, this.ratel.rage - CONFIG.RAGE_DECAY * deltaTime / 16);
            }
        }

        updateRatel(deltaTime) {
            const r = this.ratel;

            // Animation
            r.frameTime += deltaTime;
            if (r.frameTime > 100) {
                r.frame = (r.frame + 1) % 4;
                r.frameTime = 0;
            }

            // Physics
            if (!r.grounded) {
                r.vy += CONFIG.GRAVITY;
                r.y += r.vy;

                if (r.y >= CONFIG.GROUND_Y - r.height) {
                    r.y = CONFIG.GROUND_Y - r.height;
                    r.vy = 0;
                    r.grounded = true;
                }
            }

            // Attack timer
            if (r.attacking) {
                r.attackTime -= deltaTime;
                if (r.attackTime <= 0) {
                    r.attacking = false;
                }
            }

            // Invincibility timer
            if (r.invincible) {
                r.invincibleTime -= deltaTime;
                if (r.invincibleTime <= 0) {
                    r.invincible = false;
                }
            }
        }

        updateEnemies(deltaTime) {
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                enemy.x -= this.speed * (deltaTime / 16);

                // Animate flying enemies
                if (enemy.type.moves) {
                    enemy.floatOffset = Math.sin(Date.now() / 200 + enemy.id) * 10;
                }

                // Remove off-screen enemies
                if (enemy.x + enemy.type.width < -50) {
                    this.enemies.splice(i, 1);
                }
            }
        }

        updateParticles(deltaTime) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx * (deltaTime / 16);
                p.y += p.vy * (deltaTime / 16);
                p.vy += 0.3; // gravity
                p.life -= deltaTime;
                p.alpha = Math.max(0, p.life / p.maxLife);

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        updateFloatingTexts(deltaTime) {
            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const t = this.floatingTexts[i];
                t.y -= 1.5 * (deltaTime / 16);
                t.life -= deltaTime;
                t.alpha = Math.max(0, t.life / t.maxLife);
                t.scale = 1 + (1 - t.alpha) * 0.3;

                if (t.life <= 0) {
                    this.floatingTexts.splice(i, 1);
                }
            }
        }

        updateStars(deltaTime) {
            for (const star of this.stars) {
                star.x -= star.speed * this.speed * (deltaTime / 16);
                star.twinkle += 0.05;
                if (star.x < 0) {
                    star.x = CONFIG.CANVAS_WIDTH;
                    star.y = Math.random() * (CONFIG.GROUND_Y - 50);
                }
            }
        }

        updateEffects(deltaTime) {
            if (this.screenShake > 0) {
                this.screenShake *= 0.9;
                if (this.screenShake < 0.5) this.screenShake = 0;
            }

            if (this.flashAlpha > 0) {
                this.flashAlpha -= 0.05;
            }
        }

        updateCombo(deltaTime) {
            if (this.combo > 0) {
                this.comboTimer -= deltaTime;
                if (this.comboTimer <= 0) {
                    this.combo = 0;
                    this.lastComboMessage = null;
                }
            }
        }

        spawnEnemies(deltaTime) {
            this.enemyTimer -= deltaTime;

            if (this.enemyTimer <= 0) {
                this.spawnEnemy();
                // Spawn rate increases with speed
                this.enemyTimer = 1500 - (this.speed - CONFIG.INITIAL_SPEED) * 100;
                this.enemyTimer = Math.max(600, this.enemyTimer);
                this.enemyTimer += Math.random() * 500;
            }
        }

        spawnEnemy() {
            // Choose enemy type based on current speed
            const availableTypes = Object.values(ENEMIES).filter(e => this.speed >= e.minSpeed);
            const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

            this.enemies.push({
                id: Math.random(),
                x: CONFIG.CANVAS_WIDTH + 50,
                y: CONFIG.GROUND_Y - type.height + type.yOffset,
                type: type,
                floatOffset: 0,
                hit: false,
            });
        }

        checkCollisions() {
            const r = this.ratel;
            const attackBox = {
                x: r.x + r.width - 10,
                y: r.y,
                width: CONFIG.ATTACK_RANGE,
                height: r.height,
            };

            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                const enemyBox = {
                    x: enemy.x,
                    y: enemy.y + (enemy.floatOffset || 0),
                    width: enemy.type.width,
                    height: enemy.type.height,
                };

                // Check attack collision
                if (r.attacking && !enemy.hit && this.boxCollide(attackBox, enemyBox)) {
                    this.hitEnemy(enemy, i);
                    continue;
                }

                // Check body collision (damage)
                const ratelBox = {
                    x: r.x + 10,
                    y: r.y + 10,
                    width: r.width - 20,
                    height: r.height - 15,
                };

                if (!r.invincible && !enemy.hit && this.boxCollide(ratelBox, enemyBox)) {
                    this.takeDamage();
                }
            }
        }

        boxCollide(a, b) {
            return a.x < b.x + b.width &&
                   a.x + a.width > b.x &&
                   a.y < b.y + b.height &&
                   a.y + a.height > b.y;
        }

        hitEnemy(enemy, index) {
            enemy.hit = true;

            // Sound
            Sound.playHit();

            // Score
            const points = enemy.type.points * (1 + this.combo * 0.1);
            this.score += Math.floor(points);

            // Combo
            this.combo++;
            this.comboTimer = 2000;

            // Rage
            this.ratel.rage = Math.min(CONFIG.RAGE_MAX, this.ratel.rage + CONFIG.RAGE_GAIN);
            if (this.ratel.rage >= CONFIG.RAGE_MAX) {
                this.activateRage();
            }

            // Effects
            this.screenShake = 8;
            this.createHitParticles(enemy);
            this.addFloatingText('+' + Math.floor(points), enemy.x + enemy.type.width / 2, enemy.y, COLORS.neonYellow, 24);

            // Combo message
            this.checkComboMessage();

            // Remove enemy after short delay (for effect)
            setTimeout(() => {
                const idx = this.enemies.indexOf(enemy);
                if (idx > -1) this.enemies.splice(idx, 1);
            }, 100);
        }

        takeDamage() {
            this.gameOver = true;
            this.playing = false;
            this.screenShake = 30;
            this.flashAlpha = 1;

            // Sound
            Sound.stopMusic();
            Sound.playGameOver();

            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('rattelHighScore', this.highScore);
            }

            // Death particles
            for (let i = 0; i < 30; i++) {
                this.particles.push({
                    x: this.ratel.x + this.ratel.width / 2,
                    y: this.ratel.y + this.ratel.height / 2,
                    vx: (Math.random() - 0.5) * 15,
                    vy: (Math.random() - 0.5) * 15,
                    color: COLORS.neonOrange,
                    size: Math.random() * 8 + 4,
                    life: 1000,
                    maxLife: 1000,
                    alpha: 1,
                });
            }
        }

        checkComboMessage() {
            for (let i = COMBO_MESSAGES.length - 1; i >= 0; i--) {
                const msg = COMBO_MESSAGES[i];
                if (this.combo >= msg.threshold && this.lastComboMessage !== msg.text) {
                    this.lastComboMessage = msg.text;
                    this.addFloatingText(msg.text, CONFIG.CANVAS_WIDTH / 2, 100, msg.color, 36);
                    this.screenShake = 12;
                    // Sound - combo level increases pitch
                    Sound.playCombo(i + 1);
                    break;
                }
            }
        }

        // ============================================
        // PARTICLE EFFECTS
        // ============================================
        createAttackParticles() {
            const r = this.ratel;
            for (let i = 0; i < 8; i++) {
                this.particles.push({
                    x: r.x + r.width,
                    y: r.y + r.height / 2 + (Math.random() - 0.5) * 30,
                    vx: Math.random() * 8 + 5,
                    vy: (Math.random() - 0.5) * 4,
                    color: this.ratel.invincible ? COLORS.neonPink : COLORS.neonOrange,
                    size: Math.random() * 6 + 3,
                    life: 300,
                    maxLife: 300,
                    alpha: 1,
                });
            }
        }

        createHitParticles(enemy) {
            for (let i = 0; i < 15; i++) {
                this.particles.push({
                    x: enemy.x + enemy.type.width / 2,
                    y: enemy.y + enemy.type.height / 2,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.5) * 12 - 3,
                    color: enemy.type.color,
                    size: Math.random() * 8 + 4,
                    life: 500,
                    maxLife: 500,
                    alpha: 1,
                });
            }
        }

        addFloatingText(text, x, y, color, size) {
            this.floatingTexts.push({
                text, x, y, color, size,
                life: 1000,
                maxLife: 1000,
                alpha: 1,
                scale: 1,
            });
        }

        // ============================================
        // RENDER
        // ============================================
        render() {
            const ctx = this.ctx;

            // Apply screen shake
            ctx.save();
            if (this.screenShake > 0) {
                ctx.translate(
                    (Math.random() - 0.5) * this.screenShake,
                    (Math.random() - 0.5) * this.screenShake
                );
            }

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
            gradient.addColorStop(0, COLORS.bg1);
            gradient.addColorStop(1, COLORS.bg2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

            // Stars
            this.renderStars(ctx);

            // Ground
            this.renderGround(ctx);

            // Enemies
            this.renderEnemies(ctx);

            // Particles (behind ratel)
            this.renderParticles(ctx);

            // Ratel
            this.renderRatel(ctx);

            // Floating texts
            this.renderFloatingTexts(ctx);

            // UI
            this.renderUI(ctx);

            // Flash effect
            if (this.flashAlpha > 0) {
                ctx.fillStyle = `rgba(255, 107, 53, ${this.flashAlpha * 0.5})`;
                ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
            }

            // Game over / Start screen
            if (!this.playing) {
                this.renderOverlay(ctx);
            }

            ctx.restore();
        }

        renderStars(ctx) {
            for (const star of this.stars) {
                const twinkle = Math.sin(star.twinkle) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        renderGround(ctx) {
            // Ground fill
            ctx.fillStyle = COLORS.ground;
            ctx.fillRect(0, CONFIG.GROUND_Y, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_Y);

            // Neon line
            ctx.strokeStyle = COLORS.groundLine;
            ctx.lineWidth = 3;
            ctx.shadowColor = COLORS.groundLine;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(0, CONFIG.GROUND_Y);
            ctx.lineTo(CONFIG.CANVAS_WIDTH, CONFIG.GROUND_Y);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Grid lines (perspective effect)
            ctx.strokeStyle = 'rgba(255, 107, 53, 0.2)';
            ctx.lineWidth = 1;
            const gridOffset = (this.distance * 50) % 40;
            for (let i = 0; i < 15; i++) {
                const x = i * 40 - gridOffset;
                ctx.beginPath();
                ctx.moveTo(x, CONFIG.GROUND_Y);
                ctx.lineTo(x - 20, CONFIG.CANVAS_HEIGHT);
                ctx.stroke();
            }
        }

        renderEnemies(ctx) {
            for (const enemy of this.enemies) {
                if (enemy.hit) continue;

                const y = enemy.y + (enemy.floatOffset || 0);
                ctx.save();

                // Glow effect
                ctx.shadowColor = enemy.type.color;
                ctx.shadowBlur = 15;

                this.drawEnemy(ctx, enemy.type, enemy.x, y);

                ctx.restore();
            }
        }

        drawEnemy(ctx, type, x, y) {
            ctx.fillStyle = type.color;

            if (type === ENEMIES.BEE) {
                // Body
                ctx.beginPath();
                ctx.ellipse(x + 16, y + 14, 12, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                // Stripes
                ctx.fillStyle = type.accentColor;
                ctx.fillRect(x + 8, y + 10, 4, 8);
                ctx.fillRect(x + 16, y + 10, 4, 8);
                // Wings
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.ellipse(x + 16, y + 4, 8, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                // Stinger
                ctx.fillStyle = type.accentColor;
                ctx.beginPath();
                ctx.moveTo(x + 28, y + 14);
                ctx.lineTo(x + 34, y + 14);
                ctx.lineTo(x + 28, y + 17);
                ctx.fill();
            } else if (type === ENEMIES.SNAKE) {
                // Body segments
                for (let i = 0; i < 5; i++) {
                    ctx.fillStyle = i % 2 === 0 ? type.color : type.accentColor;
                    ctx.beginPath();
                    ctx.ellipse(x + 8 + i * 9, y + 10, 8, 8, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Head
                ctx.fillStyle = type.color;
                ctx.beginPath();
                ctx.ellipse(x + 44, y + 10, 6, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                // Eyes
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.arc(x + 46, y + 8, 2, 0, Math.PI * 2);
                ctx.fill();
                // Tongue
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 50, y + 10);
                ctx.lineTo(x + 56, y + 8);
                ctx.moveTo(x + 50, y + 10);
                ctx.lineTo(x + 56, y + 12);
                ctx.stroke();
            } else if (type === ENEMIES.COBRA) {
                // Body
                ctx.fillStyle = type.color;
                ctx.fillRect(x + 15, y + 25, 10, 20);
                // Hood
                ctx.beginPath();
                ctx.ellipse(x + 20, y + 18, 18, 15, 0, 0, Math.PI * 2);
                ctx.fill();
                // Face pattern
                ctx.fillStyle = type.accentColor;
                ctx.beginPath();
                ctx.ellipse(x + 20, y + 20, 8, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                // Eyes
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(x + 15, y + 15, 3, 0, Math.PI * 2);
                ctx.arc(x + 25, y + 15, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (type === ENEMIES.LION) {
                // Mane
                ctx.fillStyle = type.accentColor;
                ctx.beginPath();
                ctx.ellipse(x + 25, y + 25, 25, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                // Body
                ctx.fillStyle = type.color;
                ctx.fillRect(x + 30, y + 30, 35, 20);
                // Face
                ctx.beginPath();
                ctx.ellipse(x + 25, y + 28, 15, 13, 0, 0, Math.PI * 2);
                ctx.fill();
                // Legs
                ctx.fillRect(x + 32, y + 45, 8, 10);
                ctx.fillRect(x + 52, y + 45, 8, 10);
                // Eyes
                ctx.fillStyle = '#1a1a1a';
                ctx.beginPath();
                ctx.arc(x + 20, y + 25, 3, 0, Math.PI * 2);
                ctx.arc(x + 30, y + 25, 3, 0, Math.PI * 2);
                ctx.fill();
                // Nose
                ctx.fillStyle = '#8b4513';
                ctx.beginPath();
                ctx.arc(x + 25, y + 32, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        renderRatel(ctx) {
            const r = this.ratel;
            ctx.save();

            // Invincibility flash
            if (r.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.globalAlpha = 0.7;
            }

            // Glow when invincible
            if (r.invincible) {
                ctx.shadowColor = COLORS.neonPink;
                ctx.shadowBlur = 25;
            }

            // Attack effect - stretch and glow
            let scaleX = 1;
            let scaleY = 1;
            if (r.attacking) {
                scaleX = 1.2;
                scaleY = 0.9;
                ctx.shadowColor = COLORS.neonOrange;
                ctx.shadowBlur = 20;
            }

            ctx.translate(r.x + r.width / 2, r.y + r.height / 2);
            ctx.scale(scaleX, scaleY);
            ctx.translate(-r.width / 2, -r.height / 2);

            this.drawRatel(ctx, r.frame, r.attacking);

            ctx.restore();
        }

        drawRatel(ctx, frame, attacking) {
            const legOffset = Math.sin(frame * Math.PI / 2) * 4;

            // === BODY ===
            // Back legs
            ctx.fillStyle = COLORS.ratelBlack;
            ctx.fillRect(40 + legOffset, 38, 8, 12);
            ctx.fillRect(50 - legOffset, 38, 8, 12);

            // Front legs
            ctx.fillRect(8 - legOffset, 38, 8, 12);
            ctx.fillRect(18 + legOffset, 38, 8, 12);

            // Main body (black)
            ctx.fillStyle = COLORS.ratelBlack;
            ctx.beginPath();
            ctx.ellipse(32, 32, 28, 16, 0, 0, Math.PI * 2);
            ctx.fill();

            // White/gray mantle (top)
            ctx.fillStyle = COLORS.ratelWhite;
            ctx.beginPath();
            ctx.ellipse(32, 26, 26, 12, 0, Math.PI, Math.PI * 2);
            ctx.fill();

            // Gray stripe
            ctx.fillStyle = COLORS.ratelGray;
            ctx.beginPath();
            ctx.ellipse(32, 30, 24, 6, 0, 0, Math.PI);
            ctx.fill();

            // === HEAD ===
            // Head base
            ctx.fillStyle = COLORS.ratelBlack;
            ctx.beginPath();
            ctx.ellipse(54, 28, 14, 12, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // White face stripe
            ctx.fillStyle = COLORS.ratelWhite;
            ctx.beginPath();
            ctx.moveTo(48, 18);
            ctx.quadraticCurveTo(58, 16, 64, 22);
            ctx.quadraticCurveTo(62, 28, 54, 28);
            ctx.quadraticCurveTo(48, 26, 48, 18);
            ctx.fill();

            // Ear
            ctx.fillStyle = COLORS.ratelBlack;
            ctx.beginPath();
            ctx.ellipse(48, 16, 4, 5, -0.3, 0, Math.PI * 2);
            ctx.fill();

            // Snout
            ctx.fillStyle = COLORS.ratelGray;
            ctx.beginPath();
            ctx.ellipse(62, 30, 6, 5, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Nose
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath();
            ctx.ellipse(66, 29, 3, 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Eye
            ctx.fillStyle = attacking ? COLORS.neonPink : COLORS.ratelEye;
            ctx.shadowColor = attacking ? COLORS.neonPink : COLORS.ratelEyeGlow;
            ctx.shadowBlur = attacking ? 15 : 8;
            ctx.beginPath();
            ctx.ellipse(56, 24, 3, 4, 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Eye highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(57, 23, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Attack effect - claws
            if (attacking) {
                ctx.strokeStyle = COLORS.neonOrange;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.shadowColor = COLORS.neonOrange;
                ctx.shadowBlur = 10;

                // Claw slashes
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(64 + i * 8, 20);
                    ctx.lineTo(74 + i * 12, 35);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            }
        }

        renderParticles(ctx) {
            for (const p of this.particles) {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        renderFloatingTexts(ctx) {
            for (const t of this.floatingTexts) {
                ctx.save();
                ctx.globalAlpha = t.alpha;
                ctx.fillStyle = t.color;
                ctx.font = `bold ${t.size * t.scale}px Arial`;
                ctx.textAlign = 'center';
                ctx.shadowColor = t.color;
                ctx.shadowBlur = 15;
                ctx.fillText(t.text, t.x, t.y);
                ctx.restore();
            }
        }

        renderUI(ctx) {
            // Score
            ctx.fillStyle = COLORS.white;
            ctx.font = 'bold 20px "Courier New", monospace';
            ctx.textAlign = 'right';
            ctx.shadowColor = COLORS.textShadow;
            ctx.shadowBlur = 10;
            ctx.fillText(`SCORE: ${this.score}`, CONFIG.CANVAS_WIDTH - 15, 30);
            ctx.fillStyle = '#888';
            ctx.font = '14px "Courier New", monospace';
            ctx.fillText(`HI: ${this.highScore}`, CONFIG.CANVAS_WIDTH - 15, 50);
            ctx.shadowBlur = 0;

            // Combo
            if (this.combo > 1) {
                ctx.fillStyle = COLORS.neonYellow;
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'left';
                ctx.shadowColor = COLORS.neonYellow;
                ctx.shadowBlur = 10;
                ctx.fillText(`COMBO x${this.combo}`, 15, 30);
                ctx.shadowBlur = 0;
            }

            // Rage meter
            this.renderRageMeter(ctx);
        }

        renderRageMeter(ctx) {
            const x = 15;
            const y = CONFIG.CANVAS_HEIGHT - 25;
            const width = 100;
            const height = 12;
            const fill = this.ratel.rage / CONFIG.RAGE_MAX;

            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x, y, width, height);

            // Fill
            const gradient = ctx.createLinearGradient(x, y, x + width, y);
            gradient.addColorStop(0, COLORS.neonOrange);
            gradient.addColorStop(1, COLORS.neonPink);
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width * fill, height);

            // Border
            ctx.strokeStyle = fill >= 1 ? COLORS.neonPink : COLORS.neonOrange;
            ctx.lineWidth = 2;
            if (fill >= 1) {
                ctx.shadowColor = COLORS.neonPink;
                ctx.shadowBlur = 10;
            }
            ctx.strokeRect(x, y, width, height);
            ctx.shadowBlur = 0;

            // Label
            ctx.fillStyle = COLORS.white;
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('RAGE', x, y - 4);
        }

        renderOverlay(ctx) {
            // Dark overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

            ctx.textAlign = 'center';
            ctx.shadowColor = COLORS.neonOrange;
            ctx.shadowBlur = 20;

            if (this.gameOver) {
                // Game Over
                ctx.fillStyle = COLORS.neonPink;
                ctx.font = 'bold 42px Arial';
                ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH / 2, 90);

                ctx.fillStyle = COLORS.white;
                ctx.font = '24px Arial';
                ctx.fillText(`Score: ${this.score}`, CONFIG.CANVAS_WIDTH / 2, 130);

                if (this.score >= this.highScore && this.score > 0) {
                    ctx.fillStyle = COLORS.neonYellow;
                    ctx.font = 'bold 18px Arial';
                    ctx.fillText('NEW HIGH SCORE!', CONFIG.CANVAS_WIDTH / 2, 160);
                }

                ctx.fillStyle = COLORS.neonCyan;
                ctx.font = '16px Arial';
                ctx.fillText('Tap to play again', CONFIG.CANVAS_WIDTH / 2, 200);
            } else {
                // Start screen
                ctx.fillStyle = COLORS.neonOrange;
                ctx.font = 'bold 36px Arial';
                ctx.fillText('HONEY BADGER', CONFIG.CANVAS_WIDTH / 2, 80);
                ctx.fillText("DON'T CARE", CONFIG.CANVAS_WIDTH / 2, 120);

                ctx.fillStyle = COLORS.white;
                ctx.font = '16px Arial';
                ctx.shadowBlur = 0;
                ctx.fillText('Tap or press SPACE to ATTACK!', CONFIG.CANVAS_WIDTH / 2, 165);

                ctx.fillStyle = COLORS.neonCyan;
                ctx.font = '14px Arial';
                ctx.fillText('Attack enemies to build RAGE', CONFIG.CANVAS_WIDTH / 2, 195);
                ctx.fillText('Fill the meter for INVINCIBILITY!', CONFIG.CANVAS_WIDTH / 2, 215);
            }

            ctx.shadowBlur = 0;
        }

        // ============================================
        // GAME LOOP
        // ============================================
        gameLoop() {
            const now = performance.now();
            const deltaTime = Math.min(now - this.lastTime, 50);
            this.lastTime = now;

            this.update(deltaTime);
            this.render();

            requestAnimationFrame(() => this.gameLoop());
        }
    }

    // ============================================
    // INIT
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('gameScreen');
        if (container) {
            window.game = new HoneyBadgerGame(container);
        }
    });

})();
