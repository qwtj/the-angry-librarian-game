export default class Settings {
    constructor() {
        /* Game Settings */
        this.GAMEPLAY_SETTINGS = {
            chaosLevel: 0,
            maxChaos: 100,
            playerLevel: 1,
            xpToNext: 100,
            targetTime: 30 * 60, // 30 minutes in seconds
        }

        /* Input Settings */
        this.KEY_BINDINGS = {
            moveUp: ['w', 'W', 'ArrowUp'],
            moveDown: ['s', 'S', 'ArrowDown'],
            moveLeft: ['a', 'A', 'ArrowLeft'],
            moveRight: ['d', 'D', 'ArrowRight'],
            fire: [' ', 'Space'],
            pause: ['p', 'P', 'Escape'],
            mute: ['m', 'M'],
            debugToggle: ['f', 'F']
        };

        /* Rendering Settings */
        this.RENDER_SETTINGS = {
            showFPS: false,
            showCollisionBoxes: false,
            showGrid: false,
            showDebugInfo: false,
            enableParticles: true,
            cameraSmoothness: 0.1
        };

        /* Asset Settings */
        this.ASSET_PATHS = {
            PLAYER_SPRITE: 'assets/sprites/player.png',
            BOOK_SPRITE: 'assets/sprites/book.png',
            KID_SPRITE: 'assets/sprites/kid.png',
            BACKGROUND_MUSIC: 'assets/audio/background.mp3'
        };
    }

    // Make settings static for easier access
    static get GAMEPLAY_SETTINGS() {
        return {
            chaosLevel: 0,
            maxChaos: 100,
            playerLevel: 1,
            xpToNext: 100,
            targetTime: 30 * 60,
        };
    }

    static get KEY_BINDINGS() {
        return {
            moveUp: ['w', 'W', 'ArrowUp'],
            moveDown: ['s', 'S', 'ArrowDown'],
            moveLeft: ['a', 'A', 'ArrowLeft'],
            moveRight: ['d', 'D', 'ArrowRight'],
            fire: [' ', 'Space'],
            pause: ['p', 'P', 'Escape'],
            mute: ['m', 'M'],
            debugToggle: ['f', 'F']
        };
    }

    static get RENDER_SETTINGS() {
        return {
            showFPS: false,
            showCollisionBoxes: false,
            showGrid: false,
            showDebugInfo: false,
            enableParticles: true,
            cameraSmoothness: 0.1
        };
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