import React, { useState, useEffect } from 'react';

const BubbleSortComponent = () => {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [computing, setComputing] = useState(true);

  useEffect(() => {
    // Generate a random array with up to 5 digits, values not exceeding 100
    const length = Math.floor(Math.random() * 5) + 1; // Random length between 1 and 5
    const randomArray = Array.from(
      { length },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(randomArray);

    // Start the bubble sort after the component has mounted
    setTimeout(() => {
      bubbleSort(randomArray.slice());
    }, 0);
  }, []);

  const bubbleSort = async (arr) => {
    let n = arr.length;
    let stepsArray = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap arr[j] and arr[j+1]
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          // Save a copy of the array after each swap
          stepsArray.push(arr.slice());

          // Simulate a delay to ensure the sorting isn't instant
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }

    setSteps(stepsArray);
    setComputing(false);
  };

  return (
    <div>
      {computing ? (
        <div>Computing...</div>
      ) : (
        <div>
          {steps.map((stepArray, index) => (
            <div key={index}>{stepArray.join(', ')}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BubbleSortComponent;