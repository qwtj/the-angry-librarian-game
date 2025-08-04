export default class Settings {
    constructor() {
        /* Game Settings */
        this.GAME_PLAY = {
            chaosLevel: 0,
            maxChaos: 100,
            playerLevel: 1,
            xpToNext: 100,
            targetTime: 30 * 60, // 30 minutes in seconds
        }

        /* Input Settings */
        this.KEY_BINDINGS = {
            MOVE_UP: 'ArrowUp',
            MOVE_DOWN: 'ArrowDown',
            MOVE_LEFT: 'ArrowLeft',
            MOVE_RIGHT: 'ArrowRight',
            FIRE: 'Space',
            PAUSE: 'Escape',
            MUTE: 'KeyM',
            DEBUG_TOGGLE: 'KeyD'
        };

        /* Rendering Settings */
        this.RENDER_SETTINGS = {
            showFPS: false, // Disabled FPS counter
            showCollisionBoxes: false,
            showGrid: false
        };

        /* Asset Settings */
        this.ASSET_PATHS = {
            PLAYER_SPRITE: 'assets/sprites/player.png',
            BOOK_SPRITE: 'assets/sprites/book.png',
            KID_SPRITE: 'assets/sprites/kid.png',
            BACKGROUND_MUSIC: 'assets/audio/background.mp3'
        };

        /* Other Settings */
        this.MAX_WEAPONS = 3; // Maximum number of weapons the player can carry
    }

    setSetting(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
        } else {
            console.warn(`Setting ${key} does not exist.`);
        }
    }

    getSetting(key) {
        if (this.hasOwnProperty(key)) {
            return this[key];
        } else {
            console.warn(`Setting ${key} does not exist.`);
            return null;
        }
    }
}