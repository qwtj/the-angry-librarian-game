import { State } from './State.js';

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
  }
  
  enter() {
    this.selectedIndex = 0;
    this.showingInstructions = false;
  }
  
  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Debug logging
    if (input.isKeyPressed('ArrowUp')) console.log('ArrowUp pressed!');
    if (input.isKeyPressed('ArrowDown')) console.log('ArrowDown pressed!');
    if (input.isKeyPressed('Enter')) console.log('Enter pressed!');
    
    if (this.showingInstructions) {
      if (input.isKeyPressed('Escape') || input.isKeyPressed('Enter')) {
        this.showingInstructions = false;
      }
      return;
    }
    
    // Menu navigation
    if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('w')) {
      console.log('Moving selection up');
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
    }
    
    if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('s')) {
      console.log('Moving selection down');
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
    }
    
    if (input.isKeyPressed('Enter') || input.isKeyPressed(' ')) {
      console.log('Selecting menu item:', this.selectedIndex);
      this.menuItems[this.selectedIndex].action();
    }
  }
  
  render(renderer, interpolation) {
    const ctx = renderer.ctx;
    const { width, height } = this.game;
    
    // Background
    ctx.fillStyle = '#f5e6d3';
    ctx.fillRect(0, 0, width, height);
    
    if (this.showingInstructions) {
      this.renderInstructions(ctx);
      return;
    }
    
    // Title
    ctx.save();
    ctx.fillStyle = '#3d2914';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LIBRARY SURVIVORS', width / 2, height * 0.25);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillText('A librarian-sim meets bullet heaven', width / 2, height * 0.35);
    
    // Menu items
    ctx.font = '36px Arial';
    this.menuItems.forEach((item, index) => {
      const y = height * 0.5 + index * 60;
      
      if (index === this.selectedIndex) {
        // Highlight selected item
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(width / 2 - 200, y - 25, 400, 50);
        ctx.fillStyle = '#f5e6d3';
      } else {
        ctx.fillStyle = '#3d2914';
      }
      
      ctx.fillText(item.text, width / 2, y);
    });
    
    // Instructions hint
    ctx.font = '18px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Use Arrow Keys or W/S to navigate, Enter to select', width / 2, height * 0.9);
    
    ctx.restore();
  }
  
  renderInstructions(ctx) {
    const { width, height } = this.game;
    
    ctx.save();
    ctx.fillStyle = '#3d2914';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HOW TO PLAY', width / 2, height * 0.15);
    
    ctx.font = '24px Arial';
    const instructions = [
      'Survive 30 minutes of library chaos!',
      '',
      'CONTROLS:',
      'WASD/Arrow Keys - Move',
      'Shift - Sprint (uses stamina)',
      'P/Escape - Pause',
      '',
      'GAMEPLAY:',
      '• Pick up books automatically when near them',
      '• Return books to matching colored shelves',
      '• Kids will steal books - chase them away!',
      '• Keep Chaos below 100% or you lose',
      '• Level up to choose upgrades',
      '',
      'Press Enter or Escape to return'
    ];
    
    instructions.forEach((line, index) => {
      ctx.fillText(line, width / 2, height * 0.3 + index * 30);
    });
    
    ctx.restore();
  }
  
  startGame() {
    this.game.stateManager.changeState('playing');
  }
  
  showInstructions() {
    this.showingInstructions = true;
  }
  
  showSettings() {
    // TODO: Implement settings menu
    console.log('Settings not implemented yet');
  }
}