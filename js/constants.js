// === Constantes de Gameplay ===
// Centraliza magic numbers para facilitar balanceamento e manutencao

// --- Fisica do Jogador ---
export const GRAVITY = 1500;
export const MAX_FALL_SPEED = 800;
export const MOVE_SPEED = 300;
export const JUMP_FORCE = -700;
export const FRICTION = 0.85;
export const WATER_FRICTION = 0.92;
export const SPEED_BOOST_MULT = 1.6;
export const DOUBLE_JUMP_MULT = 0.85;

// --- Modificadores de Agua ---
export const WATER_GRAVITY_MULT = 0.4;
export const WATER_SPEED_MULT = 0.5;
export const WATER_JUMP_MULT = 0.6;
export const WATER_MAX_FALL_MULT = 0.3;

// --- Jogador ---
export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 48;
export const PLAYER_LIVES = 3;
export const INVINCIBLE_DURATION = 1.5;

// --- Soco ---
export const PUNCH_DURATION = 0.25;
export const PUNCH_COOLDOWN = 0.35;
export const PUNCH_RANGE = 28;
export const PUNCH_HEIGHT = 20;

// --- Power-ups ---
export const SPEED_BOOST_DURATION = 8;
export const DOUBLE_JUMP_DURATION = 10;

// --- Inimigos ---
export const ENEMY_SIZE = 30;
export const WALKER_SPEED = 80;
export const FLYER_SPEED = 60;
export const SWIMMER_SPEED = 70;
export const FLYER_FLOAT_FREQ = 3;
export const FLYER_FLOAT_AMP = 20;
export const SWIMMER_FLOAT_FREQ = 2.5;
export const SWIMMER_FLOAT_AMP = 15;

// --- Boss (Octopus) ---
export const BOSS_WIDTH = 80;
export const BOSS_HEIGHT = 70;
export const BOSS_SPEED = 40;
export const BOSS_LIVES = 5;
export const BOSS_HIT_TIMER = 0.8;
export const BOSS_PHASE2_THRESHOLD = 0.7;
export const BOSS_PHASE3_THRESHOLD = 0.4;
export const BOSS_PHASE_SPEED_MULT = 0.5;
export const BOSS_FLOAT_BASE_FREQ = 1.5;
export const BOSS_FLOAT_PHASE_FREQ = 0.5;
export const BOSS_FLOAT_BASE_AMP = 20;
export const BOSS_FLOAT_PHASE_AMP = 5;
export const BOSS_INK_INTERVALS = [3.5, 2.5, 1.5]; // por fase (1, 2, 3)
export const BOSS_INK_BASE_SPEED = 150;
export const BOSS_INK_PHASE_SPEED = 30;
export const BOSS_INK_LIFETIME = 3;
export const BOSS_INK_SIZE = 10;

// --- Itens ---
export const ITEM_SIZE = 20;
export const ITEM_FLOAT_FREQ = 3;
export const ITEM_FLOAT_AMP = 4;

// --- Power-up (objeto) ---
export const POWERUP_SIZE = 24;
export const POWERUP_FLOAT_FREQ = 2;
export const POWERUP_FLOAT_AMP = 5;

// --- Plataformas ---
export const MOVING_PLATFORM_SPEED = 60;
export const BREAKABLE_TIMER = 0.5;
export const BREAKABLE_SHAKE = 2;

// --- Pontuacao ---
export const SCORE_COIN = 10;
export const SCORE_STAR = 50;
export const SCORE_ENEMY_STOMP = 100;
export const SCORE_ENEMY_PUNCH = 150;
export const SCORE_BOSS_HIT = 50;
export const SCORE_BOSS_KILL = 500;

// --- Colisao ---
export const STOMP_THRESHOLD = 20;
export const STOMP_BOUNCE = -300;
export const FALL_DEATH_MARGIN = 100;

// --- Particulas ---
export const PARTICLE_GRAVITY = 300;

// --- Animacao de Vitoria do Boss ---
export const BOSS_VICTORY_FIREWORK_FAST = 0.15;
export const BOSS_VICTORY_FIREWORK_SLOW = 0.3;
export const BOSS_VICTORY_FIREWORK_THRESHOLD = 2;
