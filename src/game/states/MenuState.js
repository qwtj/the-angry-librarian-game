  import { State } from './State.js';
  import { PlayingState } from './PlayingState.js';
  import Settings from '../Settings.js';

  export class MenuState extends State {
    constructor(game) {
      super(game);
      this.menuItems = [
        { text: 'Start Game', action: () => this.startGame() },
        { text: 'Instructions', action: () => this.showInstructions() },
        { text: 'Settings', action: () => this.showSettings() }
      ];
      this.selectedIndex = 0;
      this.showingInstructions = false;
      this.showingSettings = false;
      this.settingsSelectedIndex = 0; // Add this line

      this.loadSettingsFromStorage();

      // Initialize settings here
      this.initializeSettings(); // Add this line

      // Video background
      this.video = null;
      this.videoLoaded = false;
      
      // Background music
      this.bgMusic = null;
      this.musicLoaded = false;
      
      // Menu selection sound
      this.selectSound = null;
    }
    initializeSettings() {
      this.categories = [
        {
          name: 'Gameplay',
          settings: this.buildGameplaySettings()
        },
        {
          name: 'Controls',
          settings: this.buildKeyBindingSettings()
        },
        {
          name: 'Graphics',
          settings: this.buildRenderSettings()
        }
      ];
      
      // Flatten all settings for easy navigation
      this.allSettings = [];
      this.categories.forEach(category => {
        this.allSettings.push({ type: 'category', name: category.name });
        category.settings.forEach(setting => {
          this.allSettings.push({ type: 'setting', ...setting, category: category.name });
        });
      });
      
      // Add back button
      this.allSettings.push({ type: 'button', name: 'Back to Menu', action: 'back' });
      
      this.maxSettingsIndex = this.allSettings.length - 1;
    }

    buildGameplaySettings() {
      // Use this.game.settings instead of static Settings to get current values
      const gameplay = this.game.settings.GAMEPLAY_SETTINGS;
      console.log('Building gameplay settings with:', gameplay);
      
      return [
        {
          key: 'maxChaos',
          name: 'Max Chaos Level',
          settingType: 'slider',
          value: gameplay.maxChaos || 100,
          min: 50,
          max: 200,
          step: 10
        },
        {
          key: 'playerLevel',
          name: 'Starting Level',
          settingType: 'slider',
          value: gameplay.playerLevel || 1,
          min: 1,
          max: 5,
          step: 1
        },
        {
          key: 'targetTime',
          name: 'Game Duration (minutes)',
          settingType: 'slider',
          value: (gameplay.targetTime || 1800) / 60,
          min: 15,
          max: 60,
          step: 5
        }
      ];
    }
    
    buildKeyBindingSettings() {
      const keys = this.game.settings.KEY_BINDINGS;
      return [
        {
          key: 'moveUp',
          name: 'Move Up',
          settingType: 'key',
          value: keys.moveUp ? keys.moveUp.join(' / ') : 'W / ↑'
        },
        {
          key: 'moveDown',
          name: 'Move Down',
          settingType: 'key',
          value: keys.moveDown ? keys.moveDown.join(' / ') : 'S / ↓'
        },
        {
          key: 'moveLeft',
          name: 'Move Left',
          settingType: 'key',
          value: keys.moveLeft ? keys.moveLeft.join(' / ') : 'A / ←'
        },
        {
          key: 'moveRight',
          name: 'Move Right',
          settingType: 'key',
          value: keys.moveRight ? keys.moveRight.join(' / ') : 'D / →'
        }
      ];
    }
    
    buildRenderSettings() {
      const render = this.game.settings.RENDER_SETTINGS;
      return [
        {
          key: 'showFPS',
          name: 'Show FPS',
          settingType: 'toggle',
          value: render.showFPS || false
        },
        {
          key: 'showDebugInfo',
          name: 'Show Debug Info',
          settingType: 'toggle',
          value: render.showDebugInfo || false
        },
        {
          key: 'enableParticles',
          name: 'Enable Particles',
          settingType: 'toggle',
          value: render.enableParticles !== false
        }
      ];
    }

    enter() {
      this.selectedIndex = 0;
      this.showingInstructions = false;
      
      // Create and setup video if not already created
      if (!this.video) {
        this.video = document.createElement('video');
        this.video.src = '/menu_background.mp4';
        this.video.loop = true;
        this.video.muted = true;
        this.video.autoplay = true;
        
        // Handle various video events for better reliability
        this.video.addEventListener('canplay', () => {
          this.videoLoaded = true;
          this.video.play().catch(e => console.log('Video play failed:', e));
        });
        
        // Also try playing on loadedmetadata
        this.video.addEventListener('loadedmetadata', () => {
          this.video.play().catch(e => console.log('Video play on metadata failed:', e));
        });
        
        // Handle errors
        this.video.addEventListener('error', (e) => {
          console.error('Video loading error:', e);
          this.videoLoaded = false;
        });
        
        // Force load the video
        this.video.load();
      } else {
        // Resume playing if returning to menu
        this.videoLoaded = true; // Assume it's loaded if we already created it
        this.video.play().catch(e => console.log('Video play failed:', e));
      }
      
      // Create and setup background music if not already created
      if (!this.bgMusic) {
        this.bgMusic = new Audio('/intro_music.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5; // Set to 50% volume
        
        // Start playing when loaded
        this.bgMusic.addEventListener('loadeddata', () => {
          this.musicLoaded = true;
          this.bgMusic.play().catch(e => console.log('Music play failed:', e));
        });
        
        // Load the music
        this.bgMusic.load();
      } else {
        // Resume playing if returning to menu
        this.bgMusic.play().catch(e => console.log('Music play failed:', e));
      }
      
      // Create menu selection sound if not already created
      if (!this.selectSound) {
        this.selectSound = new Audio('/menu_select.mp3');
        this.selectSound.volume = 0.7; // Slightly louder than music
      }
    }
    
    exit() {
      // Pause video when leaving menu
      if (this.video) {
        this.video.pause();
      }
      
      // Pause music when leaving menu
      if (this.bgMusic) {
        this.bgMusic.pause();
      }
    }
    
    update(deltaTime) {
      const input = this.game.inputManager;
      
      if (this.showingInstructions) {
        if (input.isKeyPressed('Escape') || input.isKeyPressed('Enter')) {
          this.showingInstructions = false;
        }
        return;
      }

      if (this.showingSettings) {
        this.updateSettings(input);
        return;
      }

      // Regular menu navigation
      if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('w')) {
        this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.playSelectSound();
      }
      
      if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('s')) {
        this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
        this.playSelectSound();
      }
      
      if (input.isKeyPressed('Enter') || input.isKeyPressed(' ')) {
        this.menuItems[this.selectedIndex].action();
      }
      
      // Mouse support for menu
      const mousePos = input.getMousePosition();
      if (mousePos && !this.showingInstructions && !this.showingSettings) {
        const { width, height } = this.game;
        const menuStartY = height * 0.7;
        
        for (let i = 0; i < this.menuItems.length; i++) {
          const y = menuStartY + i * 60;
          const itemTop = y - 25;
          const itemBottom = y + 25;
          const itemLeft = width / 2 - 200;
          const itemRight = width / 2 + 200;
          
          if (mousePos.x >= itemLeft && mousePos.x <= itemRight &&
              mousePos.y >= itemTop && mousePos.y <= itemBottom) {
            if (this.selectedIndex !== i) {
              this.selectedIndex = i;
              this.playSelectSound();
            }
            
            if (input.isMouseButtonPressed(0)) {
              this.menuItems[this.selectedIndex].action();
            }
            break;
          }
        }
      }
    }

    updateSettings(input) {
      // Navigate up/down in settings
      if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('w') || input.isKeyPressed('W')) {
        this.settingsSelectedIndex = Math.max(0, this.settingsSelectedIndex - 1);
      }
      
      if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('s') || input.isKeyPressed('S')) {
        this.settingsSelectedIndex = Math.min(this.maxSettingsIndex, this.settingsSelectedIndex + 1);
      }
      
      const currentItem = this.allSettings[this.settingsSelectedIndex];
      
      if (currentItem && currentItem.type === 'setting') {
        if (currentItem.settingType === 'toggle') {
          if (input.isKeyPressed('Enter') || input.isKeyPressed(' ')) {
            console.log(`[SETTINGS] Toggling ${currentItem.key} from ${currentItem.value} to ${!currentItem.value}`);
            currentItem.value = !currentItem.value;
            this.applySettingChange(currentItem);
          }
        } else if (currentItem.settingType === 'slider') {
          if (input.isKeyPressed('ArrowLeft') || input.isKeyPressed('a') || input.isKeyPressed('A')) {
            const oldValue = currentItem.value;
            currentItem.value = Math.max(currentItem.min, currentItem.value - currentItem.step);
            console.log(`[SETTINGS] Decreasing ${currentItem.key} from ${oldValue} to ${currentItem.value}`);
            this.applySettingChange(currentItem);
          }
          if (input.isKeyPressed('ArrowRight') || input.isKeyPressed('d') || input.isKeyPressed('D')) {
            const oldValue = currentItem.value;
            currentItem.value = Math.min(currentItem.max, currentItem.value + currentItem.step);
            console.log(`[SETTINGS] Increasing ${currentItem.key} from ${oldValue} to ${currentItem.value}`);
            this.applySettingChange(currentItem);
          }
        }
      } else if (currentItem && currentItem.type === 'button') {
        if (input.isKeyPressed('Enter') || input.isKeyPressed(' ')) {
          this.handleSettingsButtonAction(currentItem.action);
        }
      }
      
      // ESC to go back
      if (input.isKeyPressed('Escape')) {
        this.showingSettings = false;
        this.settingsSelectedIndex = 0;
      }
    }

    render(renderer, interpolation) {
      const ctx = renderer.ctx;
      const { width, height } = this.game;
      
      // Draw video background if loaded
      if (this.video && this.videoLoaded && !this.video.paused) {
        try {
          const videoAspect = this.video.videoWidth / this.video.videoHeight;
          const canvasAspect = width / height;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          if (videoAspect > canvasAspect) {
            drawHeight = height;
            drawWidth = height * videoAspect;
            drawX = (width - drawWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = width;
            drawHeight = width / videoAspect;
            drawX = 0;
            drawY = (height - drawHeight) / 2;
          }
          
          ctx.drawImage(this.video, drawX, drawY, drawWidth, drawHeight);
        } catch (e) {
          ctx.fillStyle = '#f5e6d3';
          ctx.fillRect(0, 0, width, height);
        }
      } else {
        ctx.fillStyle = '#f5e6d3';
        ctx.fillRect(0, 0, width, height);
      }
      
      if (this.showingInstructions) {
        this.renderInstructions(ctx);
        return;
      }

      if (this.showingSettings) {
        this.renderSettings(ctx);
        return;
      }
      
      ctx.save();
      
      // Regular menu items
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const menuStartY = height * 0.7;
      
      this.menuItems.forEach((item, index) => {
        const y = menuStartY + index * 60;
        
        if (index === this.selectedIndex) {
          ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
          ctx.fillRect(width / 2 - 200, y - 25, 400, 50);
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(item.text, width / 2, y);
        } else {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillText(item.text, width / 2 + 2, y + 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(item.text, width / 2, y);
        }
      });
      
      ctx.restore();
    }

    renderSettings(ctx) {
      const { width, height } = this.game;
      
      ctx.save();
      
      // Draw light brown background box with rounded corners
      const boxWidth = 800;
      const boxHeight = 640;
      const boxX = (width - boxWidth) / 2;
      const boxY = height * 0.08;
      const borderRadius = 20;
      
      // Helper function to draw rounded rectangle
      const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // Box shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      drawRoundedRect(boxX + 5, boxY + 5, boxWidth, boxHeight, borderRadius);
      ctx.fill();
      
      // Main box with transparency
      ctx.fillStyle = 'rgba(245, 230, 211, 0.95)';
      drawRoundedRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
      ctx.fill();
      
      // Box border
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      drawRoundedRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
      ctx.stroke();
      
      // Title
      ctx.fillStyle = '#3d2914';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SETTINGS', width / 2, boxY + 50);
      
      // Settings content
      let y = boxY + 120;
      const leftMargin = boxX + 40;
      const rightMargin = boxX + boxWidth - 40;
      
      ctx.font = '20px Arial';
      ctx.textBaseline = 'middle';
      
      this.allSettings.forEach((item, index) => {
        const isSelected = index === this.settingsSelectedIndex;
        
        if (item.type === 'category') {
          // Category header
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#8B4513';
          ctx.textAlign = 'left';
          ctx.fillText(item.name, leftMargin, y);
          ctx.font = '20px Arial';
          y += 35;
        } else if (item.type === 'setting') {
          // Setting item
          if (isSelected) {
            ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
            ctx.fillRect(leftMargin - 10, y - 17, boxWidth - 60, 34);
          }
          
          // Setting name
          ctx.fillStyle = isSelected ? '#ffffff' : '#3d2914';
          ctx.textAlign = 'left';
          ctx.fillText(item.name, leftMargin + 10, y);
          
          // Setting value
          ctx.textAlign = 'right';
          if (item.settingType === 'toggle') {
            ctx.fillStyle = item.value ? '#228B22' : '#8B0000';
            ctx.fillText(item.value ? 'ON' : 'OFF', rightMargin, y);
          } else if (item.settingType === 'slider') {
            ctx.fillStyle = isSelected ? '#ffffff' : '#3d2914';
            const displayValue = item.key === 'targetTime' ? `${item.value}m` : item.value;
            ctx.fillText(displayValue, rightMargin, y);
            
            // Draw slider bar
            const barWidth = 120;
            const barHeight = 4;
            const barX = rightMargin - barWidth - 80;
            const barY = y - 2;
            
            ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            const fillWidth = ((item.value - item.min) / (item.max - item.min)) * barWidth;
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(barX, barY, fillWidth, barHeight);
          } else if (item.settingType === 'key') {
            ctx.fillStyle = isSelected ? '#ffffff' : '#3d2914';
            ctx.fillText(item.value, rightMargin, y);
          }
          
          y += 35;
        } else if (item.type === 'button') {
          // Button
          if (isSelected) {
            ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
            ctx.fillRect(leftMargin - 10, y - 17, boxWidth - 60, 34);
          }
          
          ctx.font = 'bold 22px Arial';
          ctx.fillStyle = isSelected ? '#ffffff' : '#8B4513';
          ctx.textAlign = 'center';
          ctx.fillText(item.name, width / 2, y);
          ctx.font = '20px Arial';
          y += 40;
        }
      });
      
      // Instructions
      ctx.font = '16px Arial';
      ctx.fillStyle = '#3d2914';
      ctx.textAlign = 'center';
      ctx.fillText('WASD/Arrow Keys - Navigate • Left/Right - Adjust • Enter/Space - Toggle • ESC - Back', width / 2, boxY + boxHeight - 20);
      
      ctx.restore();
    }

    
    renderInstructions(ctx) {
      const { width, height } = this.game;
      
      ctx.save();
      
      // Draw light brown background box with rounded corners
      const boxWidth = 700;
      const boxHeight = 640; // Increased height to fit all text
      const boxX = (width - boxWidth) / 2;
      const boxY = height * 0.08;
      const borderRadius = 20;
      
      // Helper function to draw rounded rectangle
      const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // Box shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      drawRoundedRect(boxX + 5, boxY + 5, boxWidth, boxHeight, borderRadius);
      ctx.fill();
      
      // Main box with transparency
      ctx.fillStyle = 'rgba(245, 230, 211, 0.95)'; // Light brown with 95% opacity
      drawRoundedRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
      ctx.fill();
      
      // Box border
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      drawRoundedRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
      ctx.stroke();
      
      // Title
      ctx.fillStyle = '#3d2914';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HOW TO PLAY', width / 2, boxY + 50);
      
      ctx.font = '20px Arial'; // Reduced from 24px
      const instructions = [
        'Survive 30 minutes of library chaos!',
        '',
        'CONTROLS:',
        'WASD/Arrow Keys - Move',
        'Shift - Sprint (uses stamina)',
        'P/Escape - Pause',
        'h - Hide/Show Minimap',
        'm - Mute/Unmute Music',
        'Space - Fire Gun 🔫',
        '',
        'GAMEPLAY:',
        '• Pick up books automatically when near them',
        '• Return books to matching colored shelves',
        '• Kids will steal books - chase them away!',
        '• Keep Chaos below 100% or you lose',
        '• Level up to choose upgrades',
        '• Shoot obnoxious kids to bring order to chaos',
        '',
        'Press Enter or Escape to return'
      ];
      
      const lineHeight = 28; // Spacing between lines
      const startY = boxY + 100; // Start text below title
      
      instructions.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
      });
      
      ctx.restore();
    }
    
    startGame() {
      console.log('startGame() called');
      console.log('Static Settings.GAMEPLAY_SETTINGS:', Settings.GAMEPLAY_SETTINGS);
      console.log('Instance this.game.settings.GAMEPLAY_SETTINGS:', this.game.settings.GAMEPLAY_SETTINGS);
      
      // Save current settings to ensure they're persisted
      this.saveSettingsToStorage();
      
      // Update game data with current settings before starting
      // Use the instance settings which should have the updated values
      this.game.gameData = {
        // Use instance settings instead of static Settings
        ...this.game.settings.GAMEPLAY_SETTINGS,
        // Reset game-specific stats but keep settings
        elapsedTime: 0,
        xp: 0,
        isPaused: false,
        booksCollected: 0,
        booksShelved: 0,
        kidsRepelled: 0,
        // Force override with current values to be absolutely sure
        maxChaos: this.game.settings.GAMEPLAY_SETTINGS.maxChaos,
        playerLevel: this.game.settings.GAMEPLAY_SETTINGS.playerLevel,
        targetTime: this.game.settings.GAMEPLAY_SETTINGS.targetTime,
        chaosLevel: this.game.settings.GAMEPLAY_SETTINGS.chaosLevel,
      };
      
      console.log('Updated game.gameData:', this.game.gameData);
      console.log('Player level should be:', this.game.gameData.playerLevel);
      
      // Create a fresh PlayingState instance to ensure clean state
      const freshPlayingState = new PlayingState(this.game);
      this.game.stateManager.registerState('playing', freshPlayingState);
      
      this.game.stateManager.changeState('playing');
    }
    
    showInstructions() {
      this.showingInstructions = true;
    }

    showSettings() {
      this.showingSettings = true;
      this.settingsSelectedIndex = 0;
    }
    
    applySettingChange(setting) {
      console.log(`Setting ${setting.key} changed to ${setting.value}`);
      
      // Apply settings changes immediately based on category and key
      switch (setting.category) {
        case 'Gameplay':
          this.applyGameplaySetting(setting);
          break;
        case 'Graphics':
          this.applyRenderSetting(setting);
          break;
        case 'Controls':
          this.applyKeyBindingSetting(setting);
          break;
      }
    }

    applyGameplaySetting(setting) {
      console.log(`Applying gameplay setting: ${setting.key} = ${setting.value}`);
      
      switch (setting.key) {
        case 'maxChaos':
          // Update all three locations in the correct order
          Settings.GAMEPLAY_SETTINGS.maxChaos = setting.value;
          this.game.settings.GAMEPLAY_SETTINGS.maxChaos = setting.value;
          if (this.game.gameData) {
            this.game.gameData.maxChaos = setting.value;
          }
          console.log('Updated maxChaos to:', setting.value);
          break;
          
        case 'playerLevel':
          // Update all three locations
          Settings.GAMEPLAY_SETTINGS.playerLevel = setting.value;
          this.game.settings.GAMEPLAY_SETTINGS.playerLevel = setting.value;
          if (this.game.gameData) {
            this.game.gameData.playerLevel = setting.value;
          }
          console.log('Updated playerLevel to:', setting.value);
          console.log('Settings.GAMEPLAY_SETTINGS.playerLevel:', Settings.GAMEPLAY_SETTINGS.playerLevel);
          console.log('this.game.settings.GAMEPLAY_SETTINGS.playerLevel:', this.game.settings.GAMEPLAY_SETTINGS.playerLevel);
          break;
          
        case 'targetTime':
          const timeInSeconds = setting.value * 60;
          Settings.GAMEPLAY_SETTINGS.targetTime = timeInSeconds;
          this.game.settings.GAMEPLAY_SETTINGS.targetTime = timeInSeconds;
          if (this.game.gameData) {
            this.game.gameData.targetTime = timeInSeconds;
          }
          console.log('Updated targetTime to:', timeInSeconds, 'seconds');
          break;
          
        case 'chaosLevel':
          Settings.GAMEPLAY_SETTINGS.chaosLevel = setting.value;
          this.game.settings.GAMEPLAY_SETTINGS.chaosLevel = setting.value;
          if (this.game.gameData) {
            this.game.gameData.chaosLevel = setting.value;
          }
          console.log('Updated chaosLevel to:', setting.value);
          break;
      }
    }

    applyRenderSetting(setting) {
      switch (setting.key) {
        case 'showFPS':
          // Update Settings class
          Settings.RENDER_SETTINGS.showFPS = setting.value;
          // Update game instance settings
          this.game.settings.RENDER_SETTINGS.showFPS = setting.value;
          // Update debug display immediately
          this.game.debug.showFPS = setting.value;
          break;
          
        case 'showDebugInfo':
          Settings.RENDER_SETTINGS.showDebugInfo = setting.value;
          this.game.settings.RENDER_SETTINGS.showDebugInfo = setting.value;
          this.game.debug.showDebugInfo = setting.value;
          break;
          
        case 'enableParticles':
          Settings.RENDER_SETTINGS.enableParticles = setting.value;
          this.game.settings.RENDER_SETTINGS.enableParticles = setting.value;
          this.game.debug.enableParticles = setting.value;
          
          // Update particles in active playing state if it exists
          const playingState = this.game.stateManager.getState('playing');
          if (playingState) {
            // You might need to add a method to PlayingState to handle particle toggling
            playingState.particlesEnabled = setting.value;
          }
          break;
          
        case 'cameraSmoothness':
          const smoothnessValue = setting.value / 100; // Convert percentage to decimal
          Settings.RENDER_SETTINGS.cameraSmoothness = smoothnessValue;
          this.game.settings.RENDER_SETTINGS.cameraSmoothness = smoothnessValue;
          
          // Update camera smoothness immediately if camera exists
          if (this.game.camera) {
            this.game.camera.smoothness = smoothnessValue;
          }
          break;
          
        case 'showMinimap':
          // This setting might not be in Settings.js yet, but we can handle it
          const playingStateForMinimap = this.game.stateManager.getState('playing');
          if (playingStateForMinimap) {
            playingStateForMinimap.showMinimap = setting.value;
          }
          break;
      }
    }

    applyKeyBindingSetting(setting) {
      // Key binding changes are more complex and might require a key capture UI
      // For now, just log the change
      console.log(`Key binding for ${setting.key} would be updated to: ${setting.value}`);
      
      // You could implement key rebinding here if needed
      switch (setting.key) {
        case 'moveUp':
        case 'moveDown':
        case 'moveLeft':
        case 'moveRight':
        case 'interact':
        case 'pause':
          // Key rebinding would require a more complex UI to capture new keys
          // For now, settings are read-only display
          break;
      }
    }

    handleSettingsButtonAction(action) {
      switch (action) {
        case 'back':
          // Save settings when going back
          this.saveSettingsToStorage();
          this.showingSettings = false;
          this.settingsSelectedIndex = 0;
          break;
      }
    }

    playSelectSound() {
      if (this.selectSound) {
        // Reset the sound to play from beginning
        this.selectSound.currentTime = 0;
        this.selectSound.play().catch(e => console.log('Select sound play failed:', e));
      }
    }

    saveSettingsToStorage() {
      try {
        const settingsData = {
          gameplay: {
            maxChaos: Settings.GAMEPLAY_SETTINGS.maxChaos,
            playerLevel: Settings.GAMEPLAY_SETTINGS.playerLevel,
            targetTime: Settings.GAMEPLAY_SETTINGS.targetTime,
            chaosLevel: Settings.GAMEPLAY_SETTINGS.chaosLevel
          },
          render: {
            showFPS: Settings.RENDER_SETTINGS.showFPS,
            showDebugInfo: Settings.RENDER_SETTINGS.showDebugInfo,
            enableParticles: Settings.RENDER_SETTINGS.enableParticles,
            cameraSmoothness: Settings.RENDER_SETTINGS.cameraSmoothness
          }
        };
        
        localStorage.setItem('librarian-game-settings', JSON.stringify(settingsData));
        console.log('Settings saved to localStorage');
      } catch (e) {
        console.warn('Failed to save settings:', e);
      }
    }

    loadSettingsFromStorage() {
      try {
        const saved = localStorage.getItem('librarian-game-settings');
        if (saved) {
          const settingsData = JSON.parse(saved);
          
          // Apply loaded gameplay settings
          if (settingsData.gameplay) {
            Object.assign(Settings.GAMEPLAY_SETTINGS, settingsData.gameplay);
            Object.assign(this.game.settings.GAMEPLAY_SETTINGS, settingsData.gameplay);
            Object.assign(this.game.gameData, settingsData.gameplay);
          }
          
          // Apply loaded render settings
          if (settingsData.render) {
            Object.assign(Settings.RENDER_SETTINGS, settingsData.render);
            Object.assign(this.game.settings.RENDER_SETTINGS, settingsData.render);
            Object.assign(this.game.debug, settingsData.render);
          }
          
          console.log('Settings loaded from localStorage'); 
          console.log('Loaded gameplay settings:', settingsData.gameplay);
          console.log('Current Settings.GAMEPLAY_SETTINGS after load:', Settings.GAMEPLAY_SETTINGS);
          
          // Don't call initializeSettings() here - it will be called in constructor after this
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    }
  }