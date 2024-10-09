import logo from './logo.svg';
import './App.css';

import * as React from 'react';


function Home() {
  /*return (
    <div className="App">
      LaundryApp
    </div>
  );*/

  const [food, setFood] = React.useState('washing');
  const [drink, setDrink] = React.useState('complete');

  const handleFoodChange = (event) => {
    setFood(event.target.value);
    console.log(event.target.value);
    if(event.target.value == 'stop'){
        //if laundry is done, automatically set the other field to complete
        setDrink('complete');
    }
  };

  const handleDrinkChange = (event) => {
    setDrink(event.target.value);
  };

  return (
    /*<div>
      <Dropdown
        label="Stage of Laundry"
        options={[
          { label: 'Washing', value: 'washing' },
          { label: 'Drying', value: 'drying' },
          { label: 'Folding', value: 'folding' },
          { label: 'Stop', value: 'stop' },
        ]}
        value={food}
        onChange={handleFoodChange}
      />

      <Dropdown
        label="Stage Status"
        options={[
          { label: 'Incomplete', value: 'incomplete' },
          { label: 'Complete', value: 'complete' },
        ]}
        value={drink}
        onChange={handleDrinkChange}
      />

      <p>We eat {food}!</p>
      <p>We drink {drink}!</p>
    </div>
  );*/
  <div>
    <div>
        <h1>Set Laundry Status</h1>
        <button value = {"washing"} onClick={handleFoodChange}>Washing</button>
        <button value = {"drying"} onClick={handleFoodChange}>Drying</button>
        <button value = {"folding"} onClick={handleFoodChange}>Folding</button>
        <button value = {"stop"} onClick={handleFoodChange}>Stop</button>
        <h1>{food}</h1>
    </div>
    <div>
        <h1>Set Completion Status</h1>
        <button value = {"incomplete"} onClick={handleDrinkChange}>Incomplete</button>
        <button value = {"complete"} onClick={handleDrinkChange}>Complete</button>
        <h1>{drink}</h1>
    </div>
  </div>
  );
}

//dropdown component
const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  };

export default Home;