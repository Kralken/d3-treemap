import * as d3 from 'd3';

const dataset = {
  videoGame: {
    title: 'Video Game Sales',
    description: 'Top 100 Video Game Sales grouped by Platform',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
  },
  movies: {
    title: 'Movie Sales',
    description: 'Top 100 Movie Sales grouped by Genre',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
  },
  kickstarter: {
    title: 'Kickstarter Pledges',
    description: 'Top 100 Kickstarter pledges grouped by Category',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
  },
};

export const tiles = {
  Binary: d3.treemapBinary,
  Dice: d3.treemapDice,
  Slice: d3.treemapSlice,
  SliceDice: d3.treemapSliceDice,
  Squarify: d3.treemapSquarify,
  Resquarify: d3.treemapResquarify,
};

export default dataset;
