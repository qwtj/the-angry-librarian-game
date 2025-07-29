import { MenuState } from './MenuState.js';
import { PlayingState } from './PlayingState.js';
import { PausedState } from './PausedState.js';
import { GameOverState } from './GameOverState.js';
import { UpgradeSelectionState } from './UpgradeSelectionState.js';

export class StateManager {
  constructor(game) {
    this.game = game;
    this.states = new Map();
    this.currentState = null;
    this.previousState = null;
    this.stateStack = [];
  }
  
  async init() {
    // Register all game states
    this.registerState('menu', new MenuState(this.game));
    this.registerState('playing', new PlayingState(this.game));
    this.registerState('paused', new PausedState(this.game));
    this.registerState('gameover', new GameOverState(this.game));
    this.registerState('upgradeSelection', new UpgradeSelectionState(this.game));
    
    // Initialize all states
    for (const state of this.states.values()) {
      if (state.init) {
        await state.init();
      }
    }
  }
  
  registerState(name, state) {
    state.name = name;
    this.states.set(name, state);
  }
  
  changeState(stateName, data = {}) {
    const newState = this.states.get(stateName);
    
    if (!newState) {
      console.error(`State '${stateName}' not found`);
      return;
    }
    
    // Exit current state
    if (this.currentState && this.currentState.exit) {
      this.currentState.exit();
    }
    
    // Store previous state
    this.previousState = this.currentState;
    
    // Enter new state
    this.currentState = newState;
    if (this.currentState.enter) {
      this.currentState.enter(data);
    }
    
    console.log(`State changed to: ${stateName}`);
  }
  
  update(deltaTime) {
    if (this.currentState && this.currentState.update) {
      this.currentState.update(deltaTime);
    }
  }
  
  render(renderer, interpolation) {
    if (this.currentState && this.currentState.render) {
      this.currentState.render(renderer, interpolation);
    }
  }
  
  returnToPreviousState() {
    if (this.previousState) {
      this.changeState(this.previousState.name);
    }
  }
  
  pushState(stateName, data = {}) {
    const newState = this.states.get(stateName);
    
    if (!newState) {
      console.error(`State '${stateName}' not found`);
      return;
    }
    
    // Push current state to stack
    if (this.currentState) {
      this.stateStack.push(this.currentState);
    }
    
    // Enter new state
    this.currentState = newState;
    if (this.currentState.enter) {
      this.currentState.enter(data);
    }
    
    console.log(`State pushed: ${stateName}`);
  }
  
  popState() {
    if (this.stateStack.length === 0) {
      console.error('No state to pop');
      return;
    }
    
    // Exit current state
    if (this.currentState && this.currentState.exit) {
      this.currentState.exit();
    }
    
    // Pop previous state from stack
    this.currentState = this.stateStack.pop();
    
    console.log(`State popped to: ${this.currentState.name}`);
  }
  
  getState(stateName) {
    return this.states.get(stateName);
  }
}