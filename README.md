# Library Survivors

A top-down 2D game where you play as a librarian trying to maintain order in a chaotic library overrun by rambunctious kids.  The goal is to survive for 30 minutes, keeping the chaos level below 100% by collecting stray books and returning them to their proper shelves.

## Controls

*   **Movement:** WASD or Arrow Keys
*   **Sprint:** Shift (drains stamina)
*   **Pause:** P or Escape
*   **Fire Gun:** Spacebar

## Game Mechanics

*   **Objective:** Survive for 30 minutes while managing the library's chaos.
*   **Chaos:**  Chaos increases as books are left on the floor or stolen by kids. Keep chaos below 100% to avoid a game over.
*   **Books:** Pick up books and return them to the shelves of matching color.
*   **Kids:**  Kids run around stealing books, increasing chaos.  Repel them to reduce chaos.
*   **Stamina:** Sprinting drains stamina. Let it regenerate by walking.
*   **Leveling Up:** Earn XP by collecting and shelving books. Level up to choose upgrades.
*   **Weapons:** Use a weapon to stun or otherwise deal with the kids.

## Upgrades

Upon leveling up, you'll be presented with a choice of upgrades. Here's a list of possible upgrades:

*   **Comfy Shoes:** Increases movement speed.
*   **Long Arms:** Increases book pickup and return radius.
*   **Book Belt:** Increases the number of books you can carry.
*   **Fitness Training:** Increases maximum stamina.
*   **Zen Focus:** Reduces chaos gain.
*   **Reading Glasses:** Increases XP gain.
*   **Shush Wave:** (Future weapon skill, not yet implemented) Creates a cone of silence that stuns kids.

## Code Structure

*   `index.html`: The main HTML file that sets up the canvas and loading screen.
*   `game/Game.js`:  The core game class, responsible for initializing the game, loading assets, managing game states, and running the game loop.
*   `game/GameLoop.js`:  Handles the game loop, updating and rendering the game at a fixed timestep.
*   `game/states/StateManager.js`: Manages different game states (menu, playing, paused, game over).
*   `game/states/State.js`:  Base class for all game states.
*   `game/states/MenuState.js`: Handles the main menu.
*   `game/states/PlayingState.js`: Contains the main game logic and rendering.
*   `game/states/PausedState.js`:  Displays the pause menu.
*   `game/states/GameOverState.js`: Shows the game over screen with stats.
*   `game/states/UpgradeSelectionState.js`:  Handles upgrade selection upon leveling up.
*   `game/systems/InputManager.js`: Handles user input from keyboard, mouse, and touch.
*   `game/systems/AssetLoader.js`: Loads game assets (images, audio, data).
*   `game/systems/Camera.js`:  Handles the game camera, following the player and applying zoom and shake effects.
*   `game/systems/Renderer.js`:  Responsible for rendering the game to the canvas.
*   `game/entities/Entity.js`: Base class for all game entities (player, books, shelves, kids).
*   `game/entities/Player.js`: Represents the player character.
*   `game/entities/Book.js`: Represents the books in the library.
*   `game/entities/Shelf.js`: Represents the bookshelves.
*   `game/entities/Kid.js`: Represents the chaotic kids.
    *   `game/entities/Weapon.js`: Represents the weapon.
*   `data/upgrades.js`: Defines available upgrades and their effects.
*   `style.css`: CSS stylesheet for the game.

## Data Structures
* `UPGRADES` Object: Defines the available upgrades. Each upgrade has an ID, name, description, icon, max level, effect function, and description function.
* `UPGRADES.effect()`:  A function that modifies the player's stats based on the upgrade and level.
* `UPGRADES.getDescription()`: A function that returns a description of the upgrade's effect at a given level.

## Running the Game

1.  Ensure you have a web server running (e.g., using Python's `http.server` or a local development server with Node.js).
2.  Open `index.html` in your web browser.

## Future Development

*   Implement additional weapon skills.
*   Add more variety to the levels.
*   Implement more complex kid behaviors.
*   Improve visual effects and animations.

## Credits

Created by Matt Wolfe @mreflow originaly non violent.  https://github.com/mreflow/the-librarian-game 

