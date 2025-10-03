/**
 * Example terrain presets for the battle-viewer examples
 * These demonstrate how to configure terrain maps using the hex_terrain atlas
 *
 * Users should create their own terrain configurations based on their sprite atlases
 */

/**
 * Creates a lush valley terrain with diverse biomes
 * Full 5x5 grid (axial coordinates: -2 to 2 on both axes)
 * Features: river, forests, highlands, wetlands, farms, and varied terrain
 *
 * @returns {Object} Terrain map object
 */
export function createLushValleyTerrain() {
  return {
    // Row q=-2 (5 tiles: r from 0 to 4)
    "-2,0": {
      type: "forest_pine",
      spriteId: "hexForestPineSnowCovered00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.2 },
    },
    "-2,1": {
      type: "forest_broadleaf",
      spriteId: "hexForestBroadleaf00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.2 },
    },
    "-2,2": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "-2,3": {
      type: "woodlands",
      spriteId: "hexWoodlands00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.1 },
    },
    "-2,4": {
      type: "marsh",
      spriteId: "hexMarsh00.png",
      properties: { passable: true, movementCost: 1.8 },
    },

    // Row q=-1 (5 tiles: r from -1 to 3)
    "-1,-1": {
      type: "mountain",
      spriteId: "hexMountainSnow00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "-1,0": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "-1,1": {
      type: "river",
      spriteId: "hexRiver010010-00.png",
      properties: { passable: false, blocksProjectiles: false },
    },
    "-1,2": {
      type: "plains",
      spriteId: "hexPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-1,3": {
      type: "wetlands",
      spriteId: "hexWetlands00.png",
      properties: { passable: true, movementCost: 2.0 },
    },

    // Row q=0 (5 tiles: r from -2 to 2)
    "0,-2": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "0,-1": {
      type: "forest_forester",
      spriteId: "hexForestBroadleafForester00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.2 },
    },
    "0,0": {
      type: "river",
      spriteId: "hexRiver000001-00.png",
      properties: { passable: false, blocksProjectiles: false },
    },
    "0,1": {
      type: "farm",
      spriteId: "hexPlainsFarm00.png",
      properties: { passable: true, movementCost: 0.9 },
    },
    "0,2": {
      type: "bog",
      spriteId: "hexBog00.png",
      properties: { passable: true, movementCost: 2.0 },
    },

    // Row q=1 (5 tiles: r from -3 to 1)
    "1,-3": {
      type: "snow_field",
      spriteId: "hexSnowField00.png",
      properties: { passable: true, movementCost: 1.4 },
    },
    "1,-2": {
      type: "mountain",
      spriteId: "hexMountain00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "1,-1": {
      type: "river",
      spriteId: "hexRiver010010-00.png",
      properties: { passable: false, blocksProjectiles: false },
    },
    "1,0": {
      type: "scrublands",
      spriteId: "hexScrublands00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "1,1": {
      type: "jungle",
      spriteId: "hexJungle00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.5 },
    },

    // Row q=2 (5 tiles: r from -4 to 0)
    "2,-4": {
      type: "plains_cold",
      spriteId: "plainsColdSnowTransition00.png",
      properties: { passable: true, movementCost: 1.1 },
    },
    "2,-3": {
      type: "woodlands",
      spriteId: "hexWoodlands00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.1 },
    },
    "2,-2": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "2,-1": {
      type: "sand_palms",
      spriteId: "hexSandPalms00.png",
      properties: { passable: true, movementCost: 1.1 },
    },
    "2,0": {
      type: "tropical_plains",
      spriteId: "tropicalPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
  };
}

/**
 * Creates a mystical archipelago with volcanic islands
 * Great for larger arenas (radius 7+)
 *
 * @returns {Object} Terrain map object
 */
export function createMysticalArchipelagoTerrain() {
  return {
    // Ocean surrounding islands
    "0,-3": { type: "ocean", spriteId: "hexOcean00.png", properties: { passable: false } },
    "-1,-2": { type: "ocean", spriteId: "hexOceanCalm00.png", properties: { passable: false } },
    "1,-2": { type: "ocean", spriteId: "hexOcean00.png", properties: { passable: false } },
    "-2,-1": { type: "ocean", spriteId: "hexOceanCalm00.png", properties: { passable: false } },
    "2,-1": { type: "ocean", spriteId: "hexOcean00.png", properties: { passable: false } },
    "-3,1": { type: "ocean", spriteId: "hexOcean00.png", properties: { passable: false } },
    "3,-2": { type: "ocean", spriteId: "hexOceanCalm00.png", properties: { passable: false } },
    "-2,3": { type: "ocean", spriteId: "hexOcean00.png", properties: { passable: false } },
    "2,1": { type: "ocean", spriteId: "hexOceanCalm00.png", properties: { passable: false } },
    "1,2": { type: "ocean", spriteId: "hexOcean00.png", properties: { passable: false } },
    "0,3": { type: "ocean", spriteId: "hexOceanCalm00.png", properties: { passable: false } },

    // Central volcanic island
    "0,0": {
      type: "volcano",
      spriteId: "hexVolcanoActive00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "0,-1": {
      type: "lava_field",
      spriteId: "hexLavaField00.png",
      properties: { passable: false, blocksProjectiles: false },
    },

    // Northern jungle island
    "-1,-1": {
      type: "jungle",
      spriteId: "hexJungle00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.5 },
    },
    "0,-2": {
      type: "jungle",
      spriteId: "hexJungle00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.5 },
    },

    // Eastern tropical island
    "1,-1": {
      type: "sand_palms",
      spriteId: "hexSandPalms00.png",
      properties: { passable: true, movementCost: 1.1 },
    },
    "2,0": {
      type: "sand_palms",
      spriteId: "hexSandPalms00.png",
      properties: { passable: true, movementCost: 1.1 },
    },

    // Western scrubland island
    "-1,0": {
      type: "scrublands",
      spriteId: "hexScrublands00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "-2,1": {
      type: "scrublands",
      spriteId: "hexScrublands00.png",
      properties: { passable: true, movementCost: 1.2 },
    },

    // Southern marsh islands
    "0,1": {
      type: "marsh",
      spriteId: "hexMarsh00.png",
      properties: { passable: true, movementCost: 1.8 },
    },
    "-1,2": {
      type: "marsh",
      spriteId: "hexMarsh00.png",
      properties: { passable: true, movementCost: 1.8 },
    },
    "1,1": {
      type: "marsh",
      spriteId: "hexMarsh00.png",
      properties: { passable: true, movementCost: 1.8 },
    },

    // Connecting bridges for strategy
    "1,0": {
      type: "bridge",
      spriteId: "hexPortCentre00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-1,1": {
      type: "bridge",
      spriteId: "hexPortCentre00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
  };
}

/**
 * Creates a tactical military outpost terrain
 * Full 8x8 grid (axial coordinates: -3 to 4 on q-axis, adjusted r per row)
 * Features: fortifications, varied tactical zones, natural obstacles
 * Perfect for larger tactical battles
 *
 * @returns {Object} Terrain map object
 */
export function createTacticalOutpostTerrain() {
  return {
    // Row q=-3 (8 tiles: r from 0 to 7)
    "-3,0": {
      type: "mountain",
      spriteId: "hexMountainSnow00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "-3,1": {
      type: "snow_field",
      spriteId: "hexSnowField00.png",
      properties: { passable: true, movementCost: 1.4 },
    },
    "-3,2": {
      type: "plains_cold",
      spriteId: "plainsColdSnowTransition00.png",
      properties: { passable: true, movementCost: 1.1 },
    },
    "-3,3": {
      type: "plains",
      spriteId: "hexPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-3,4": {
      type: "farm",
      spriteId: "hexPlainsFarm00.png",
      properties: { passable: true, movementCost: 0.9 },
    },
    "-3,5": {
      type: "woodlands",
      spriteId: "hexWoodlands00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.1 },
    },
    "-3,6": {
      type: "forest",
      spriteId: "hexForestBroadleaf00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.2 },
    },
    "-3,7": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },

    // Row q=-2 (8 tiles: r from -1 to 6)
    "-2,-1": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "-2,0": {
      type: "dirt",
      spriteId: "hexDirt00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-2,1": {
      type: "farm",
      spriteId: "hexPlainsFarm00.png",
      properties: { passable: true, movementCost: 0.9 },
    },
    "-2,2": {
      type: "village",
      spriteId: "hexDirtVillage00.png",
      properties: { passable: true, movementCost: 0.8, cover: true },
    },
    "-2,3": {
      type: "plains",
      spriteId: "hexPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-2,4": {
      type: "scrublands",
      spriteId: "hexScrublands00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "-2,5": {
      type: "woodlands",
      spriteId: "hexWoodlands00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.1 },
    },
    "-2,6": {
      type: "marsh",
      spriteId: "hexMarsh00.png",
      properties: { passable: true, movementCost: 1.8 },
    },

    // Row q=-1 (8 tiles: r from -2 to 5)
    "-1,-2": {
      type: "mountain",
      spriteId: "hexMountain00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "-1,-1": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "-1,0": {
      type: "plains",
      spriteId: "hexPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-1,1": {
      type: "farm",
      spriteId: "plainsFarm00.png",
      properties: { passable: true, movementCost: 0.9 },
    },
    "-1,2": {
      type: "dirt",
      spriteId: "hexDirt00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "-1,3": {
      type: "woodlands",
      spriteId: "hexWoodlands00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.1 },
    },
    "-1,4": {
      type: "forest",
      spriteId: "hexForestBroadleaf00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.2 },
    },
    "-1,5": {
      type: "wetlands",
      spriteId: "hexWetlands00.png",
      properties: { passable: true, movementCost: 2.0 },
    },

    // Row q=0 (8 tiles: r from -3 to 4)
    "0,-3": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "0,-2": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "0,-1": {
      type: "castle",
      spriteId: "hexDirtCastle00.png",
      properties: { passable: true, movementCost: 0.8, cover: true, defensible: true },
    },
    "0,0": {
      type: "base",
      spriteId: "hexBase00.png",
      properties: { passable: true, movementCost: 0.7, spawn: true },
    },
    "0,1": {
      type: "port",
      spriteId: "hexPortCentre00.png",
      properties: { passable: true, movementCost: 0.9 },
    },
    "0,2": {
      type: "scrublands",
      spriteId: "hexScrublands00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "0,3": {
      type: "forest_forester",
      spriteId: "hexForestBroadleafForester00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.2 },
    },
    "0,4": {
      type: "bog",
      spriteId: "hexBog00.png",
      properties: { passable: true, movementCost: 2.0 },
    },

    // Row q=1 (8 tiles: r from -4 to 3)
    "1,-4": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "1,-3": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "1,-2": {
      type: "plains",
      spriteId: "hexPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "1,-1": {
      type: "dirt",
      spriteId: "hexDirt00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "1,0": {
      type: "farm",
      spriteId: "hexPlainsFarm00.png",
      properties: { passable: true, movementCost: 0.9 },
    },
    "1,1": {
      type: "woodlands",
      spriteId: "hexWoodlands00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.1 },
    },
    "1,2": {
      type: "jungle",
      spriteId: "hexJungle00.png",
      properties: { passable: true, blocksVision: true, movementCost: 1.5 },
    },
    "1,3": {
      type: "marsh",
      spriteId: "hexMarsh00.png",
      properties: { passable: true, movementCost: 1.8 },
    },

    // Row q=2 (8 tiles: r from -5 to 2)
    "2,-5": {
      type: "mountain",
      spriteId: "hexMountain00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "2,-4": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "2,-3": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "2,-2": {
      type: "scrublands",
      spriteId: "hexScrublands00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "2,-1": {
      type: "plains",
      spriteId: "hexPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "2,0": {
      type: "sand_palms",
      spriteId: "hexSandPalms00.png",
      properties: { passable: true, movementCost: 1.1 },
    },
    "2,1": {
      type: "tropical_plains",
      spriteId: "tropicalPlains00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "2,2": {
      type: "wetlands",
      spriteId: "hexWetlands00.png",
      properties: { passable: true, movementCost: 2.0 },
    },

    // Row q=3 (8 tiles: r from -6 to 1)
    "3,-6": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "3,-5": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "3,-4": {
      type: "dirt",
      spriteId: "hexDirt00.png",
      properties: { passable: true, movementCost: 1.0 },
    },
    "3,-3": {
      type: "ash_plains",
      spriteId: "hexAshPlains00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "3,-2": {
      type: "desert_red_dirt",
      spriteId: "hexDesertRedDirt00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "3,-1": {
      type: "desert_red_grass",
      spriteId: "hexDesertRedGrass00.png",
      properties: { passable: true, movementCost: 1.1 },
    },
    "3,0": {
      type: "desert_dunes",
      spriteId: "hexDesertDunes00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "3,1": {
      type: "lava_field",
      spriteId: "hexLavaField00.png",
      properties: { passable: false, blocksProjectiles: false },
    },

    // Row q=4 (8 tiles: r from -7 to 0)
    "4,-7": {
      type: "mountain",
      spriteId: "hexMountainSnow00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
    "4,-6": {
      type: "highlands",
      spriteId: "hexHighlands00.png",
      properties: { passable: true, movementCost: 1.5 },
    },
    "4,-5": {
      type: "hills",
      spriteId: "hexHills00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "4,-4": {
      type: "ash_plains",
      spriteId: "hexAshPlains00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "4,-3": {
      type: "desert_red_dirt",
      spriteId: "hexDesertRedDirt00.png",
      properties: { passable: true, movementCost: 1.2 },
    },
    "4,-2": {
      type: "desert_dunes",
      spriteId: "hexDesertDunes00.png",
      properties: { passable: true, movementCost: 1.3 },
    },
    "4,-1": {
      type: "desert_oasis",
      spriteId: "hexDesertDunesOasis00.png",
      properties: { passable: true, movementCost: 0.8 },
    },
    "4,0": {
      type: "volcano",
      spriteId: "hexVolcanoActive00.png",
      properties: { passable: false, blocksProjectiles: true, blocksVision: true },
    },
  };
}

/**
 * Get terrain configuration based on arena radius
 *
 * @param {number} radius - Arena radius
 * @returns {Object} Appropriate terrain map for the radius
 */
export function getTerrainForRadius(radius) {
  if (radius <= 6) {
    return createLushValleyTerrain();
  } else if (radius <= 9) {
    return createTacticalOutpostTerrain();
  } else {
    return createMysticalArchipelagoTerrain();
  }
}

/**
 * Available terrain sprite categories from hex_terrain atlas
 * Useful reference for creating custom terrain configurations
 */
export const AVAILABLE_TERRAIN_SPRITES = {
  plains: ["hexPlains00.png", "hexPlainsFarm00.png"],
  forests: [
    "hexForestBroadleaf00.png",
    "hexForestBroadleafForester00.png",
    "hexForestPineSnowCovered00.png",
  ],
  water: [
    "hexOcean00.png",
    "hexOceanCalm00.png",
    "hexRiver000001-00.png",
    "hexRiver010010-00.png",
    "hexRiverLakeEnd010000-00.png",
  ],
  mountains: ["hexMountain00.png", "hexMountainSnow00.png"],
  deserts: [
    "hexDesertDunes00.png",
    "hexDesertDunesOasis00.png",
    "hexDesertRedDirt00.png",
    "hexDesertRedGrass00.png",
  ],
  hills: ["hexHills00.png", "hexHighlands00.png"],
  wetlands: ["hexWetlands00.png", "hexMarsh00.png", "hexBog00.png"],
  tropical: ["hexJungle00.png", "hexSandPalms00.png"],
  volcanic: ["hexVolcanoActive00.png", "hexLavaField00.png"],
  settlements: ["hexDirtVillage00.png", "hexDirtCastle00.png", "hexPortCentre00.png"],
  special: ["hexWoodlands00.png", "hexScrublands00.png", "hexSnowField00.png"],
};
