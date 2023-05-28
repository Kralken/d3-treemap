import React, { useEffect, useState } from 'react';
import dataset, { tiles } from './Data.js';
import drawChart from './DrawChart.js';
import Footer from './Footer.js';

export default function Chart() {
  let [state, setState] = useState('videoGame');
  let [tile, setTile] = useState('Binary');

  function handleChangeChart(e) {
    setState(e.target.value);
  }

  function handleChangeTiling(e) {
    setTile(e.target.value);
  }

  useEffect(() => drawChart(state, tile), [state, tile]);

  return (
    <div>
      <label>
        Chart Data:{' '}
        <select onChange={handleChangeChart} defaultValue={state}>
          {Object.keys(dataset).map((elem) => {
            return (
              <option value={elem} key={elem}>
                {dataset[elem].title}
              </option>
            );
          })}
        </select>
      </label>
      <label>
        {' '}
        Chart Tiling:{' '}
        <select onChange={handleChangeTiling} defaultValue={tile}>
          {Object.keys(tiles).map((elem) => {
            return (
              <option value={elem} key={elem}>
                {elem}
              </option>
            );
          })}
        </select>
      </label>
      <div id='main'>
        <h1 id='title'>{dataset[state].title}</h1>
        <p id='description'>{dataset[state].description}</p>
        <div id='chart-area'></div>
        <div id='legend-area'></div>
        <Footer />
      </div>
    </div>
  );
}
