# Library Survivors - Web Development Plan

## Technology Stack
- **Frontend**: Vanilla JavaScript with Canvas API
- **Build System**: Vite for fast development and optimized builds
- **Hosting**: Static site hosting (GitHub Pages, Netlify, or Vercel)
- **No external game engines** - pure web technologies

## Project Structure
```
library-survivors/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── game/
│   │   ├── Game.js
│   │   ├── states/
│   │   ├── entities/
│   │   ├── systems/
│   │   └── ui/
│   ├── assets/
│   │   ├── sprites/
│   │   ├── audio/
│   │   └── data/
│   └── utils/
├── public/
└── dist/
```

## Phase 1: Core Foundation (Week 1)

### 1. Project Setup
- Initialize npm project with Vite
- Create Canvas-based game loop
- Implement basic state management (Menu, Playing, Paused, GameOver)
- Set up development server with hot reload

### 2. Core Game Engine
- **GameLoop.js**: requestAnimationFrame-based update/render cycle
- **InputManager.js**: Keyboard and mouse/touch handling
- **AssetLoader.js**: Sprite sheet and audio loading
- **Camera.js**: Viewport management for larger game world

### 3. Rendering System
- Canvas 2D context setup
- Sprite rendering with rotation/scale
- Layer-based rendering (background, entities, UI)
- Basic particle system for effects

## Phase 2: Player & Movement (Week 2)

### 4. Player Implementation
- **Player.js**: Position, velocity, collision box
- Movement with WASD/Arrow keys
- Sprint mechanic with stamina bar
- Smooth camera following

### 5. Collision System
- Spatial grid for efficient collision detection
- Circle-based collision for pickup/return radius
- Rectangle collision for walls/shelves
- Debug visualization toggles

## Phase 3: Game World (Week 3)

### 6. Library Environment
- **TileMap.js**: Grid-based library layout
- **Shelf.js**: Book slots with color coding
- Procedural or hand-crafted level data
- Minimap for navigation

### 7. Book System
- **Book.js**: Physics-based movement when dropped
- Color-matching with shelves
- Auto-pickup within radius
- Carry slots UI indicator

## Phase 4: NPCs & AI (Week 4)

### 8. Kid NPCs
- **Kid.js**: State machine implementation
- **AISystem.js**: Pathfinding (A* for shelf navigation)
- Behavior states: Idle, Grab, Carry, Drop, Flee
- Visual indicators for current state

### 9. Repel Mechanic
- Force-based pushing when player is near
- Smooth animation and physics response
- Strategic herding gameplay

## Phase 5: Core Mechanics (Week 5)

### 10. Chaos System
- **ChaosManager.js**: Track books on floor
- Progressive meter with visual feedback
- Screen effects at high chaos (red vignette)
- Game over condition

### 11. XP & Leveling
- **ProgressionSystem.js**: XP tracking and levels
- Upgrade selection UI (modal with 3 choices)
- Stat modifications system
- Save progression in localStorage

## Phase 6: Combat & Skills (Week 6)

### 12. Weapon Skills
- **SkillSystem.js**: Cooldown and activation management
- Shush Wave: Cone particle effect with knockback
- Bookmark Boomerang: Projectile with bezier curve path
- Dust Cloud: Area effect with sprite opacity
- Auto-targeting for skills

### 13. Passive Upgrades
- Stat modifier system
- Visual feedback for active upgrades
- Upgrade tree visualization

## Phase 7: Content & Polish (Week 7)

### 14. Difficulty Scaling
- **WaveManager.js**: Time-based escalation
- Event system for special waves
- Mini-boss behaviors
- Dynamic spawn rates

### 15. Audio System
- **AudioManager.js**: Web Audio API integration
- Dynamic music layers based on chaos
- Positional audio for kids
- UI sound effects

### 16. Visual Effects
- Particle effects for skills
- Screen shake on impacts
- Smooth transitions and animations
- CSS-based UI with animations

## Phase 8: Meta & Deployment (Week 8)

### 17. Meta-Progression
- End screen with statistics
- Currency system for permanent upgrades
- Unlock system for new content
- High score tracking

### 18. Optimization
- Sprite batching for performance
- Object pooling for entities
- Lazy loading for assets
- Mobile touch controls

### 19. Deployment
- Production build with Vite
- PWA manifest for offline play
- GitHub Actions for CI/CD
- Analytics integration

## Key Implementation Details

### Performance Considerations
- Use object pooling for books, particles, projectiles
- Implement viewport culling
- Optimize collision detection with spatial partitioning
- Batch render calls where possible

### Data Management
- JSON files for game balance values
- LocalStorage for save data
- Configuration system for easy tweaking

### Responsive Design
- Scale canvas to fit screen
- Touch controls for mobile
- Flexible UI layout
- Performance modes for lower-end devices

## Development Approach
1. Start with minimal viable game loop
2. Add features incrementally with testing
3. Maintain clean separation of concerns
4. Use modern JavaScript (ES6+) features
5. Comment critical game logic
6. Create debug mode early for testing