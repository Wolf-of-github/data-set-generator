import React, { useState, useEffect } from 'react';

const BubbleSortComponent = () => {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [computing, setComputing] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    // Generate a random array with exactly 5 digits, values not exceeding 100
    const length = 5;
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

  const bubbleSort = (arr) => {
    let n = arr.length;
    let stepsArray = [];

    // Push the initial state with Operation 'start'
    stepsArray.push({
      array: arr.slice(),
      operation: {
        Operation: 'start',
        'Swap-a': null,
        'Swap-b': null,
      },
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false; // Optimization: Track if any swaps occur
      for (let j = 0; j < n - i - 1; j++) {
        // Push a 'compare' step before each comparison
        stepsArray.push({
          array: arr.slice(),
          operation: {
            Operation: 'compare',
            'Swap-a': j,
            'Swap-b': j + 1,
          },
        });

        // Compare adjacent elements
        if (arr[j] > arr[j + 1]) {
          // Swap arr[j] and arr[j+1]
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;

          // Save the state after each swap with Operation 'swap'
          stepsArray.push({
            array: arr.slice(),
            operation: {
              Operation: 'swap',
              'Swap-a': j,
              'Swap-b': j + 1,
            },
          });
        }
      }
      if (!swapped) break; // Break if no swaps occurred in the inner loop
    }

    // Push the final state with Operation 'end'
    stepsArray.push({
      array: arr.slice(),
      operation: {
        Operation: 'end',
        'Swap-a': null,
        'Swap-b': null,
      },
    });

    setSteps(stepsArray);
    setComputing(false);
  };

  useEffect(() => {
    // Start at the first step after sorting is completed
    if (!computing && steps.length > 0) {
      setCurrentStepIndex(0); // Initialize the current step index
    }
  }, [computing, steps]);

  useEffect(() => {
    // Event handler for keydown events
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.keyCode === 32) {
        event.preventDefault(); // Prevent default space bar scrolling

        setCurrentStepIndex((prevIndex) => {
          if (prevIndex < steps.length - 1) {
            return prevIndex + 1;
          } else {
            return prevIndex; // Do nothing if at the last step
          }
        });
      } else if (event.code === 'ArrowLeft' || event.keyCode === 37) {
        event.preventDefault(); // Prevent default behavior

        setCurrentStepIndex((prevIndex) => {
          if (prevIndex > 0) {
            return prevIndex - 1;
          } else {
            return prevIndex; // Do nothing if at the first step
          }
        });
      }
    };

    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [steps]);

  const handleRestart = () => {
    // Regenerate a new random array and reset states
    const length = 5;
    const randomArray = Array.from(
      { length },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(randomArray);
    setSteps([]);
    setComputing(true);
    setCurrentStepIndex(-1);

    // Start sorting again
    setTimeout(() => {
      bubbleSort(randomArray.slice());
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 px-4">
      {computing ? (
        <div className="text-2xl font-semibold">Computing...</div>
      ) : currentStepIndex >= 0 ? (
        <div className="flex flex-col items-center">
          {/* Array Display */}
          <div className="flex space-x-4 mb-4">
            {steps[currentStepIndex].array.map((num, index) => {
              const operation = steps[currentStepIndex].operation;

              // Determine the role of the current index in the operation
              let bgColor = 'bg-white';
              let borderColor = 'border-gray-300';

              if (operation.Operation === 'compare') {
                if (index === operation['Swap-a']) {
                  bgColor = 'bg-yellow-300'; // Color for Compare-a
                  borderColor = 'border-yellow-500';
                } else if (index === operation['Swap-b']) {
                  bgColor = 'bg-yellow-300'; // Color for Compare-b
                  borderColor = 'border-yellow-500';
                }
              } else if (operation.Operation === 'swap') {
                if (index === operation['Swap-a']) {
                  bgColor = 'bg-blue-300'; // Color for Swap-a
                  borderColor = 'border-blue-500';
                } else if (index === operation['Swap-b']) {
                  bgColor = 'bg-red-300'; // Color for Swap-b
                  borderColor = 'border-red-500';
                }
              }

              return (
                <div
                  key={index}
                  className={`w-16 h-16 flex items-center justify-center rounded-md shadow-lg text-xl font-bold transition-colors duration-500 ${bgColor} border ${borderColor}`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          {/* Operation Display */}
          <div className="text-lg font-medium">
      
            {steps[currentStepIndex].operation.Operation === 'start'
              ? 'Start'
              : steps[currentStepIndex].operation.Operation === 'end'
              ? 'End'
              : steps[currentStepIndex].operation.Operation === 'compare'
              ? `Comparing indices ${steps[currentStepIndex].operation['Swap-a']} and ${steps[currentStepIndex].operation['Swap-b']}`
              : `Swapping indices ${steps[currentStepIndex].operation['Swap-a']} and ${steps[currentStepIndex].operation['Swap-b']}`}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-sm text-gray-600">
            Press the <strong>Space Bar</strong> to advance or{' '}
            <strong>Left Arrow</strong> to go back.
          </div>

          {/* Legend */}
          <div className="mt-6 flex space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-300 border border-green-500 rounded-full mr-2"></div>
              <span>Elements being compared</span>
            </div>
            {/* <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-300 border border-yellow-500 rounded-full mr-2"></div>
              <span>Element being compared</span>
            </div> */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-300 border border-blue-500 rounded-full mr-2"></div>
              <span>Smaller element</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-300 border border-red-500 rounded-full mr-2"></div>
              <span>Larger element</span>
            </div>
          </div>

          {/* Restart Button */}
          {/* <button
            onClick={handleRestart}
            className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Restart
          </button> */}
        </div>
      ) : null}
    </div>
  );
};

export default BubbleSortComponent;