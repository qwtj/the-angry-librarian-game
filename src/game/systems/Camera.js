export class Camera {
  constructor(viewportWidth, viewportHeight) {
    // Viewport dimensions
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    
    // Camera position (center of viewport)
    this.x = 0;
    this.y = 0;
    
    // Target position for smooth following
    this.targetX = 0;
    this.targetY = 0;
    
    // Camera settings
    this.smoothing = 0.1; // Lerp factor for smooth movement
    this.bounds = null; // World bounds { x, y, width, height }
    this.zoom = 1;
    this.targetZoom = 1;
    this.zoomSmoothing = 0.1;
    
    // Screen shake
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    
    // Deadzone for following
    this.deadzone = {
      x: viewportWidth * 0.1,
      y: viewportHeight * 0.1
    };
  }
  
  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }
  
  follow(entity) {
    if (entity && entity.x !== undefined && entity.y !== undefined) {
      this.setTarget(entity.x, entity.y);
    }
  }
  
  setBounds(x, y, width, height) {
    this.bounds = { x, y, width, height };
  }
  
  setZoom(zoom) {
    this.targetZoom = Math.max(0.5, Math.min(2, zoom));
  }
  
  shake(intensity, duration) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }
  
  update(deltaTime) {
    // Smooth camera movement
    if (this.smoothing > 0) {
      this.x += (this.targetX - this.x) * this.smoothing;
      this.y += (this.targetY - this.y) * this.smoothing;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }
    
    // Smooth zoom
    if (this.zoomSmoothing > 0) {
      this.zoom += (this.targetZoom - this.zoom) * this.zoomSmoothing;
    } else {
      this.zoom = this.targetZoom;
    }
    
    // Apply bounds if set
    if (this.bounds) {
      const halfViewportWidth = (this.viewportWidth / this.zoom) / 2;
      const halfViewportHeight = (this.viewportHeight / this.zoom) / 2;
      
      // Clamp camera position to bounds
      this.x = Math.max(
        this.bounds.x + halfViewportWidth,
        Math.min(this.bounds.x + this.bounds.width - halfViewportWidth, this.x)
      );
      
      this.y = Math.max(
        this.bounds.y + halfViewportHeight,
        Math.min(this.bounds.y + this.bounds.height - halfViewportHeight, this.y)
      );
    }
    
    // Update screen shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      
      if (this.shakeDuration > 0) {
        const angle = Math.random() * Math.PI * 2;
        const magnitude = this.shakeIntensity * (this.shakeDuration / this.shakeDuration);
        
        this.shakeOffsetX = Math.cos(angle) * magnitude;
        this.shakeOffsetY = Math.sin(angle) * magnitude;
      } else {
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
        this.shakeIntensity = 0;
      }
    }
  }
  
  // Get the top-left corner of the viewport in world coordinates
  getViewportX() {
    return this.x - (this.viewportWidth / this.zoom) / 2 + this.shakeOffsetX;
  }
  
  getViewportY() {
    return this.y - (this.viewportHeight / this.zoom) / 2 + this.shakeOffsetY;
  }
  
  // Convert world coordinates to screen coordinates
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.getViewportX()) * this.zoom,
      y: (worldY - this.getViewportY()) * this.zoom
    };
  }
  
  // Convert screen coordinates to world coordinates
  screenToWorld(screenX, screenY) {
    return {
      x: screenX / this.zoom + this.getViewportX(),
      y: screenY / this.zoom + this.getViewportY()
    };
  }
  
  // Check if a rectangle is visible in the viewport
  isVisible(x, y, width, height) {
    const viewportX = this.getViewportX();
    const viewportY = this.getViewportY();
    const viewportWidth = this.viewportWidth / this.zoom;
    const viewportHeight = this.viewportHeight / this.zoom;
    
    return !(
      x + width < viewportX ||
      x > viewportX + viewportWidth ||
      y + height < viewportY ||
      y > viewportY + viewportHeight
    );
  }
  
  // Apply camera transform to canvas context
  applyTransform(ctx) {
    ctx.save();
    
    // Apply zoom
    ctx.scale(this.zoom, this.zoom);
    
    // Translate to camera position
    ctx.translate(
      -this.getViewportX(),
      -this.getViewportY()
    );
  }
  
  // Reset camera transform
  resetTransform(ctx) {
    ctx.restore();
  }
}