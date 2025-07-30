import { State } from './State.js';

export class GameOverState extends State {
  constructor(game) {
    super(game);
    this.won = false;
    this.reason = '';
    this.stats = {};
    this.menuItems = [
      { text: 'Play Again', action: () => this.playAgain() },
      { text: 'Main Menu', action: () => this.mainMenu() }
    ];
    this.selectedIndex = 0;
    this.selectSound = null;
  }
  
  enter(data) {
    this.won = data.won || false;
    this.reason = data.reason || '';
    this.selectedIndex = 0;
    
    // Initialize select sound if not already created
    if (!this.selectSound) {
      this.selectSound = new Audio('/menu_select.mp3');
      this.selectSound.volume = 0.7;
    }
    
    // Play "uh oh" sound if player lost
    if (!this.won) {
      const uhOhSound = new Audio('/uh_oh.mp3');
      uhOhSound.volume = 0.6;
      uhOhSound.play().catch(e => console.log('Uh oh sound play failed:', e));
    }
    
    // Collect game stats
    const gameData = this.game.gameData;
    this.stats = {
      timeElapsed: Math.floor(gameData.elapsedTime),
      level: gameData.playerLevel,
      chaosLevel: Math.floor(gameData.chaosLevel),
      booksCollected: 0, // TODO: Track this
      booksShelved: 0, // TODO: Track this
      kidsRepelled: 0, // TODO: Track this
    };
  }
  
  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Menu navigation
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
    
    // Mouse support
    const mousePos = input.getMousePosition();
    if (mousePos) {
      const { width, height } = this.game;
      const boxWidth = 600;
      const boxHeight = 500;
      const boxX = (width - boxWidth) / 2;
      const boxY = (height - boxHeight) / 2;
      
      // Check each menu item
      for (let i = 0; i < this.menuItems.length; i++) {
        const y = boxY + 380 + i * 50;
        const itemTop = y - 20;
        const itemBottom = y + 20;
        const itemLeft = boxX + 150;
        const itemRight = boxX + boxWidth - 150;
        
        if (mousePos.x >= itemLeft && mousePos.x <= itemRight &&
            mousePos.y >= itemTop && mousePos.y <= itemBottom) {
          // Mouse is over this item
          if (this.selectedIndex !== i) {
            this.selectedIndex = i;
            this.playSelectSound();
          }
          
          // Check for click
          if (input.isMouseButtonPressed(0)) { // 0 = left mouse button
            this.menuItems[this.selectedIndex].action();
          }
          break;
        }
      }
    }
  }
  
  render(renderer, interpolation) {
    const ctx = renderer.ctx;
    const { width, height } = this.game;
    
    // Background
    ctx.fillStyle = this.won ? '#4169E1' : '#8B0000';
    ctx.fillRect(0, 0, width, height);
    
    // Result box
    const boxWidth = 600;
    const boxHeight = 500;
    const boxX = (width - boxWidth) / 2;
    const boxY = (height - boxHeight) / 2;
    
    ctx.fillStyle = '#f5e6d3';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.strokeStyle = '#3d2914';
    ctx.lineWidth = 4;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Title
    ctx.fillStyle = this.won ? '#228B22' : '#8B0000';
    ctx.font = 'bold 64px Arial';
    ctx.fillText(this.won ? 'VICTORY!' : 'GAME OVER', width / 2, boxY + 80);
    
    // Subtitle
    ctx.fillStyle = '#3d2914';
    ctx.font = '24px Arial';
    if (this.won) {
      ctx.fillText('You survived 30 minutes of library chaos!', width / 2, boxY + 130);
    } else {
      let message = 'The library descended into chaos...';
      if (this.reason === 'chaos') {
        message = 'The chaos overwhelmed the library!';
      }
      ctx.fillText(message, width / 2, boxY + 130);
    }
    
    // Stats
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    const statX = boxX + 100;
    let statY = boxY + 200;
    
    const minutes = Math.floor(this.stats.timeElapsed / 60);
    const seconds = this.stats.timeElapsed % 60;
    
    const statLines = [
      `Time Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`,
      `Final Level: ${this.stats.level}`,
      `Peak Chaos: ${this.stats.chaosLevel}%`,
      `Books Collected: ${this.stats.booksCollected}`,
      `Books Shelved: ${this.stats.booksShelved}`,
      `Kids Repelled: ${this.stats.kidsRepelled}`
    ];
    
    statLines.forEach(line => {
      ctx.fillText(line, statX, statY);
      statY += 30;
    });
    
    // Menu items
    ctx.textAlign = 'center';
    ctx.font = '32px Arial';
    this.menuItems.forEach((item, index) => {
      const y = boxY + 380 + index * 50;
      
      if (index === this.selectedIndex) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(boxX + 150, y - 20, boxWidth - 300, 40);
        ctx.fillStyle = '#f5e6d3';
      } else {
        ctx.fillStyle = '#3d2914';
      }
      
      ctx.fillText(item.text, width / 2, y);
    });
    
    ctx.restore();
  }
  
  playAgain() {
    this.game.stateManager.changeState('playing');
  }
  
  mainMenu() {
    this.game.stateManager.changeState('menu');
  }
  
  playSelectSound() {
    if (this.selectSound) {
      this.selectSound.currentTime = 0;
      this.selectSound.play().catch(e => console.log('Select sound play failed:', e));
    }
  }
}