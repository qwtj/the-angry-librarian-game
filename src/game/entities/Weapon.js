export class Weapon {
  constructor(name, damage, fireRate, projectileSpeed) {
    this.name = name;
    this.damage = damage;
    this.fireRate = fireRate; // Time between shots in seconds
    this.projectileSpeed = projectileSpeed;
  }

  fire(x, y, dirX, dirY) {
    // Create and return a projectile
    return new Projectile(x, y, dirX, dirY, this);
  }

  onHit(target) {
    // Call takeDamage on the target
    if (target.takeDamage) {
      target.takeDamage(this.damage);
    }
  }
}

export class Projectile {
  constructor(x, y, dirX, dirY, weapon) {
    this.x = x;
    this.y = y;
    this.vx = dirX * weapon.projectileSpeed;
    this.vy = dirY * weapon.projectileSpeed;
    this.weapon = weapon;
    this.width = 4;
    this.height = 4;
    this.lifetime = 3; // 3 seconds max lifetime
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.lifetime -= deltaTime;
  }

  render(ctx, interpolation) {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}