class Game {
  constructor() {
    this.stage = 0; // Start at stage 0
    this.levels = {}; // Store level instances
    this.currentLevel = null;
    this.initializeLevel(0); // Initialize the starting level
  }

  reset() {
    this.stage = 0;
    this.levels = {}; // Clear existing levels
    this.initializeLevel(0); // Re-initialize the starting level
  }

  getStage() {
    return this.stage;
  }

  // Helper function to create and store a level instance if it doesn't exist
  initializeLevel(stage) {
    if (!this.levels[stage]) {
      switch (stage) {
        case 0:
          this.levels[stage] = new Start();
          break;
        case 1:
          this.levels[stage] = new Level(1);
          break;
        case 2:
          this.levels[stage] = new Level(2);
          break;
        case 3:
          this.levels[stage] = new Level(3);
          break;
        case 4:
          this.levels[stage] = new Level(4);
          break;
        case 5:
          this.levels[stage] = new Level(5);
          break;
        // Assuming level 6 exists based on sketch.js
        case 6: 
          this.levels[stage] = new Level(6); 
          break;
        // Use a distinct stage number for the finish screen
        case 7: 
          this.levels[stage] = new Finish();
          break;
        default:
          console.error("Attempted to initialize unknown stage:", stage);
          // Fallback to stage 0 or handle error appropriately
          this.levels[stage] = new Start(); 
          break;
      }
    }
    this.currentLevel = this.levels[stage];
    this.stage = stage; // Update the current stage number
  }

  setStage(stage) {
    this.initializeLevel(stage);
    // Note: We no longer need the 'this.state = undefined;' line
    // as state management is handled within the level objects themselves.
  }
  
  getCurrentLevel() {
    return this.currentLevel;
  }
}
