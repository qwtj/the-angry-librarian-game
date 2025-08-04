import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(game, x, y) {
    super(x, y, 48, 64); // Increased size from 32x48 to 48x64
    this.game = game;
    
    // Stats (from design doc)
    this.stats = {
      moveSpeed: 3, // meters per second (assuming 1 meter = 32 pixels)
      pickupRadius: 1,
      returnRadius: 0.5, // Half a tile - must be touching shelf
      carrySlots: 5,
      stamina: 100,
      maxStamina: 100,
      chaosDampening: 0,
      xpMultiplier: 1.0 // For Reading Glasses upgrade
    };
    
    // Upgrade tracking
    this.upgradeLevels = {};
    
    // Movement
    this.baseSpeed = this.stats.moveSpeed * 32; // Convert to pixels/second
    this.sprintMultiplier = 1.5;
    this.isSprinting = false;
    
    // Books carried
    this.carriedBooks = [];
    
    // Animation
    this.facing = 'down'; // up, down, left, right
    this.lastHorizontalFacing = 'left'; // Track last horizontal direction for sprite flipping
    this.animationTimer = 0;
    this.animationFrame = 0;
    this.isMoving = false;
    
    // Weapon system
    this.weapons = [];
    this.activeWeapon = null;
    this.fireTimer = 0;

    // Collision box (covers most of the player)
    this.collisionBox = {
      offsetX: 8,
      offsetY: 24, // Adjusted for larger sprite
      width: 32,
      height: 36  // Adjusted for larger sprite
    };
    
    // Repel radius for kids
    this.repelRadius = 1.5 * 32; // 1.5 meters in pixels
    
    // Sound effects
    this.outOfBreathSound = null;
    this.isPlayingOutOfBreath = false;
  }
  
  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Get movement input
    const movement = input.getMovementVector();
    
    // Handle sprinting
    this.isSprinting = input.isActionDown('sprint') && this.stats.stamina > 0;
    
    if (this.isSprinting) {
      // Drain stamina while sprinting
      this.stats.stamina -= 20 * deltaTime; // 20 stamina per second
      this.stats.stamina = Math.max(0, this.stats.stamina);
    } else {
      // Regenerate stamina when not sprinting
      this.stats.stamina += 10 * deltaTime; // 10 stamina per second
      this.stats.stamina = Math.min(this.stats.maxStamina, this.stats.stamina);
    }
    
    // Handle out of breath sound
    if (input.isActionDown('sprint') && this.stats.stamina < 1) {
      // Player is holding shift but has very low stamina
      if (!this.isPlayingOutOfBreath) {
        this.playOutOfBreathSound();
        this.isPlayingOutOfBreath = true;
      }
    } else {
      // Stop the sound if they release shift or regain stamina
      if (this.isPlayingOutOfBreath) {
        this.stopOutOfBreathSound();
        this.isPlayingOutOfBreath = false;
      }
    }
    
    // Calculate speed - only apply sprint multiplier if we have stamina
    const currentSpeed = this.baseSpeed * (this.isSprinting && this.stats.stamina > 0 ? this.sprintMultiplier : 1);
    
    // Apply movement
    this.vx = movement.x * currentSpeed;
    this.vy = movement.y * currentSpeed;
    
    // Calculate new position
    const newX = this.x + this.vx * deltaTime;
    const newY = this.y + this.vy * deltaTime;
    
    // Check collisions with shelves
    const state = this.game.stateManager.currentState;
    let canMoveX = true;
    let canMoveY = true;
    
    if (state && state.shelves) {
      for (const shelf of state.shelves) {
        // Check X movement
        if (this.checkCollision(newX, this.y, shelf)) {
          canMoveX = false;
        }
        // Check Y movement
        if (this.checkCollision(this.x, newY, shelf)) {
          canMoveY = false;
        }
        // Check diagonal movement if both X and Y are blocked
        if (!canMoveX && !canMoveY && this.checkCollision(newX, newY, shelf)) {
          break; // Already blocked in both directions
        }
      }
    }
    
    // Apply movement if no collision
    if (canMoveX) {
      this.x = newX;
    }
    if (canMoveY) {
      this.y = newY;
    }
    
    // Keep within world bounds
    if (state && state.worldWidth && state.worldHeight) {
      this.x = Math.max(0, Math.min(state.worldWidth - this.width, this.x));
      this.y = Math.max(0, Math.min(state.worldHeight - this.height, this.y));
    }
    
    // Update facing direction only when moving - prioritize horizontal movement
    if (this.vx !== 0 || this.vy !== 0) {
      // Only update facing when actually moving
      if (this.vx !== 0) {
        // If moving horizontally at all, face left or right
        this.facing = this.vx > 0 ? 'right' : 'left';
        this.lastHorizontalFacing = this.facing; // Remember horizontal direction
      } else {
        // Only face up/down if not moving horizontally
        this.facing = this.vy > 0 ? 'down' : 'up';
      }
    }
    // When not moving, maintain the last facing direction
    
    // Update animation
    this.isMoving = this.vx !== 0 || this.vy !== 0;
    if (this.isMoving) {
      this.animationTimer += deltaTime;
      if (this.animationTimer >= 0.2) {
        this.animationFrame = (this.animationFrame + 1) % 2; // Alternate between 2 frames
        this.animationTimer = 0;
      }
    } else {
      this.animationFrame = 0;
      this.animationTimer = 0;
    }
    
    // Update weapon fire timer
    if (this.fireTimer > 0) {
      this.fireTimer -= deltaTime;
    }

    
    // Check for weapon firing input
    if (input.isActionDown('fire') && this.canFire()) {
      this.fireWeapon();
    }

    // Update camera to follow player
    this.game.camera.follow(this);
  }
  
  render(ctx, interpolation) {
    // Get appropriate sprite based on animation frame
    let sprite;
    if (this.isMoving) {
      sprite = this.animationFrame === 0 
        ? this.game.assetLoader.getImage('librarianWalk1')
        : this.game.assetLoader.getImage('librarianWalk2');
    } else {
      sprite = this.game.assetLoader.getImage('librarianStand'); // Use standing sprite when not moving
    }
    
    // Fallback to placeholder if sprites not loaded
    if (!sprite) {
      sprite = this.game.assetLoader.getImage('librarian');
    }
    
    // Draw speed trail effect if moving fast with upgrades
    const speedLevel = this.upgradeLevels?.speed || 0;
    if (speedLevel > 0 && (this.vx !== 0 || this.vy !== 0)) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      
      // Draw motion blur trails
      for (let i = 1; i <= speedLevel; i++) {
        const trailX = this.x - (this.vx * 0.01 * i);
        const trailY = this.y - (this.vy * 0.01 * i);
        ctx.globalAlpha = 0.3 - (i * 0.05);
        
        if (sprite) {
          this.game.renderer.drawSprite(
            sprite,
            trailX,
            trailY,
            this.width,
            this.height,
            {
              flipX: this.lastHorizontalFacing === 'right' // Use last horizontal direction for flipping
            }
          );
        }
      }
      ctx.restore();
    }
    
    if (!sprite) return;
    
    // Draw sprite with direction flipping
    this.game.renderer.drawSprite(
      sprite,
      this.x,
      this.y,
      this.width,
      this.height,
      {
        flipX: this.lastHorizontalFacing === 'right' // Use last horizontal direction for flipping
      }
    );
    
    // Draw pickup radius indicator when Long Arms upgrade is active
    if (this.upgradeLevels?.pickupRadius > 0) {
      ctx.save();
      
      // Enhanced pulsing effect
      const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      const radius = this.stats.pickupRadius * 32 * pulseScale;
      const centerX = this.getCenterX();
      const centerY = this.getCenterY();
      
      // Outer glow circle
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
      ctx.stroke();
      
      // Main circle with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(100, 200, 255, 0.3)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]); // Dashed line
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner bright circle for emphasis
      ctx.strokeStyle = 'rgba(150, 220, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // Solid line
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    }
    
    // Draw pickup radius (debug)
    if (this.game.debug.showCollisionBoxes) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        this.getCenterX(),
        this.getCenterY(),
        this.stats.pickupRadius * 32,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      // Draw repel radius
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(
        this.getCenterX(),
        this.getCenterY(),
        this.repelRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw carried books indicator with colors
    if (this.carriedBooks.length > 0) {
      ctx.save();
      
      // Draw book count
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${this.carriedBooks.length}/${this.stats.carrySlots}`,
        this.getCenterX(),
        this.y - 5
      );
      
      // Draw colored indicators for each book type
      const bookColors = {};
      this.carriedBooks.forEach(book => {
        bookColors[book.color] = (bookColors[book.color] || 0) + 1;
      });
      
      let offsetX = -20;
      Object.entries(bookColors).forEach(([color, count]) => {
        // Draw colored circle for each book type
        const colorHex = this.getBookColorHex(color);
        ctx.fillStyle = colorHex;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(this.getCenterX() + offsetX, this.y - 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw count if more than 1
        if (count > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px Arial';
          ctx.fillText(count.toString(), this.getCenterX() + offsetX, this.y - 17);
        }
        
        offsetX += 15;
      });
      
      ctx.restore();
    }
  }

  // Weapon methods
  addWeapon(weapon) {
    this.weapons.push(weapon);
    if (!this.activeWeapon) {
      this.activeWeapon = weapon;
    }
  }

  canFire() {
    return this.activeWeapon && this.fireTimer <= 0;
  }

  fireWeapon() {
    if (!this.canFire()) return;

    // Get firing direction (could be based on movement or mouse position)
    const direction = this.getFiringDirection();
    
    // Create projectile
    const projectile = this.activeWeapon.fire(
      this.getCenterX(),
      this.getCenterY(),
      direction.x,
      direction.y
    );

    if (projectile) {
      // Add projectile to game state
      const state = this.game.stateManager.currentState;
      if (state && state.projectiles) {
        state.projectiles.push(projectile);
      }

      // Set fire cooldown
      this.fireTimer = this.activeWeapon.fireRate;
    }
  }

  getFiringDirection() {
    const input = this.game.inputManager;
    
    // Option 1: Fire in movement direction
    const movement = input.getMovementVector();
    if (movement.x !== 0 || movement.y !== 0) {
      return movement;
    }

    // Option 2: Fire in last facing direction
    switch (this.facing) {
      case 'up': return { x: 0, y: -1 };
      case 'down': return { x: 0, y: 1 };
      case 'left': return { x: -1, y: 0 };
      case 'right': return { x: 1, y: 0 };
      default: return { x: 0, y: -1 }; // Default up
    }
  }

  pickupBook(book) {
    if (this.carriedBooks.length >= this.stats.carrySlots) {
      return false;
    }
    
    this.carriedBooks.push(book);
    return true;
  }
  
  shelveBook(shelf) {
    // Find a book that matches this shelf's color
    const bookIndex = this.carriedBooks.findIndex(
      book => book.color === shelf.color
    );
    
    if (bookIndex !== -1) {
      const book = this.carriedBooks.splice(bookIndex, 1)[0];
      return book;
    }
    
    return null;
  }
  
  dropAllBooks() {
    const dropped = [...this.carriedBooks];
    this.carriedBooks = [];
    return dropped;
  }
  
  // Upgrade methods
  upgrade(stat, amount) {
    switch (stat) {
      case 'moveSpeed':
        this.stats.moveSpeed += amount;
        this.baseSpeed = this.stats.moveSpeed * 32;
        break;
      case 'pickupRadius':
        this.stats.pickupRadius += amount;
        break;
      case 'returnRadius':
        this.stats.returnRadius += amount;
        break;
      case 'carrySlots':
        this.stats.carrySlots += amount;
        break;
      case 'stamina':
        this.stats.maxStamina += amount;
        this.stats.stamina += amount;
        break;
      case 'chaosDampening':
        this.stats.chaosDampening += amount;
        break;
      case 'xpMultiplier':
        this.stats.xpMultiplier += amount;
        break;
    }
  }
  
  getXPMultiplier() {
    return this.stats.xpMultiplier;
  }
  
  checkCollision(x, y, entity) {
    // Check if entity has a collision box
    if (!entity.collisionBox) {
      return false;
    }
    
    // Calculate player's collision bounds at new position using collision box
    const playerLeft = x + this.collisionBox.offsetX;
    const playerRight = playerLeft + this.collisionBox.width;
    const playerTop = y + this.collisionBox.offsetY;
    const playerBottom = playerTop + this.collisionBox.height;
    
    // Calculate entity's collision bounds
    const entityLeft = entity.x + entity.collisionBox.offsetX;
    const entityRight = entityLeft + entity.collisionBox.width;
    const entityTop = entity.y + entity.collisionBox.offsetY;
    const entityBottom = entityTop + entity.collisionBox.height;
    
    // Check for overlap
    return !(playerLeft >= entityRight || 
             playerRight <= entityLeft || 
             playerTop >= entityBottom || 
             playerBottom <= entityTop);
  }
  
  getBookColorHex(color) {
    const colors = {
      red: '#ff4444',
      blue: '#4444ff',
      green: '#44ff44',
      yellow: '#ffff44',
      purple: '#ff44ff',
      orange: '#ff8844'
    };
    return colors[color] || '#888888';
  }
  
  playOutOfBreathSound() {
    if (!this.outOfBreathSound) {
      this.outOfBreathSound = new Audio('/out_of_breath.mp3');
      this.outOfBreathSound.volume = 0.6;
      this.outOfBreathSound.loop = true;
    }
    this.outOfBreathSound.play().catch(e => console.log('Out of breath sound play failed:', e));
  }
  
  stopOutOfBreathSound() {
    if (this.outOfBreathSound) {
      this.outOfBreathSound.pause();
      this.outOfBreathSound.currentTime = 0;
    }
  }
  
  cleanup() {
    // Stop all sounds when player is cleaned up
    this.stopOutOfBreathSound();
    this.isPlayingOutOfBreath = false;
  }
}