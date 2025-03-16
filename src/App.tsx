import React, { useState, useEffect, useCallback } from 'react';  
import { create, all } from 'mathjs';  
import './styles.css';  


const math = create(all);  

const Calculator: React.FC = () => {  
  const [expression, setExpression] = useState<string>('');  
  const [result, setResult] = useState<string>('');  
  const [showInfo, setShowInfo] = useState<boolean>(false);  

 
  const handleButtonClick = useCallback((value: string) => {  
    switch (value) {  
      case 'AC':  
        setExpression('');  
        setResult('');  
        break;  
      case 'DEL':  
        setExpression((prev) => prev.slice(0, -1));  
        break;  
      case '=':  
        if (expression.includes('P')) {  
          handlePermutation();  
        } else if (expression.includes('C')) {  
          handleCombination();  
        } else {  
          try {  
            const calculatedResult = math.evaluate(expression);  
            setResult(calculatedResult.toString());  
          } catch (error) {  
            setResult('Error');  
          }  
        }  
        break;  
      default:  
        setExpression(prev => prev + value);  
    }  
  }, [expression]);  

 
  useEffect(() => {  
    const handleKeyPress = (event: KeyboardEvent) => {  
      const key = event.key;  

      
      const ignoredKeys = [  
        'Alt', 'AltGraph', 'CapsLock', 'Control', 'Fn', 'FnLock',  
        'Hyper', 'Meta', 'NumLock', 'ScrollLock', 'Shift', 'Super',  
        'Symbol', 'SymbolLock'  
      ];  

      if (ignoredKeys.includes(key)) {  
        return;  
      }  

       
      if (key === 'Backspace') {  
        event.preventDefault();  
        handleButtonClick('DEL');  
        return;  
      }  

      
      const keyMap: { [key: string]: string } = {  
        '/': '÷',  
        '*': '×',  
        'Enter': '='  
      };  

      const mappedKey = keyMap[key] || key;  

      
      if (/[0-9+\-*/.=CPcp]/.test(mappedKey)) {  
        event.preventDefault();  
        handleButtonClick(mappedKey);  
      } else {  
        event.preventDefault();  
      }  
    };  

    window.addEventListener('keydown', handleKeyPress);  
    return () => window.removeEventListener('keydown', handleKeyPress);  
  }, [handleButtonClick]);  

  
  const MAX_INPUT_SIZE = 10000; 

const handlePermutation = () => {  
  try {  
    const parts = expression.split('P');  
    if (parts.length === 2) {  
      const n = BigInt(parts[0].trim());  
      const r = BigInt(parts[1].trim());  
      
       
      if (n > BigInt(MAX_INPUT_SIZE) || r > BigInt(MAX_INPUT_SIZE)) {  
        setResult(`Error: Numbers must be ≤ ${MAX_INPUT_SIZE}`);  
        return;  
      }  
      
       
      if (r > n) {  
        setResult('Error: r cannot be larger than n');  
        return;  
      }  
      
      if (n < BigInt(0) || r < BigInt(0)) {  
        setResult('Error: Negative values not allowed');  
        return;  
      }  
      
      let result = BigInt(1);  
      for (let i = BigInt(0); i < r; i++) {  
        result *= (n - i);  
      }  
      
       
      if (result > BigInt(Number.MAX_SAFE_INTEGER)) {  
        setResult('Result too large to display');  
        return;  
      }  
      
      setResult(result.toString());  
    } else {  
      setResult('Error: Invalid permutation format');  
    }  
  } catch (error) {  
    setResult('Error: Calculation failed');  
  }  
};  

const handleCombination = () => {  
  try {  
    const parts = expression.split('C');  
    if (parts.length === 2) {  
      const n = BigInt(parts[0].trim());  
      const r = BigInt(parts[1].trim());  
      
       
      if (n > BigInt(MAX_INPUT_SIZE) || r > BigInt(MAX_INPUT_SIZE)) {  
        setResult(`Error: Numbers must be ≤ ${MAX_INPUT_SIZE}`);  
        return;  
      }  
      
      
      if (r > n) {  
        setResult('Error: r cannot be larger than n');  
        return;  
      }  

      if (n < BigInt(0) || r < BigInt(0)) {  
        setResult('Error: Negative values not allowed');  
        return;  
      }  
      
       
      const k = r > (n - r) ? (n - r) : r;  
      
      let result = BigInt(1);  
      for (let i = BigInt(0); i < k; i++) {  
        result *= (n - i);  
        result /= (i + BigInt(1));  
      }  
      
   
      if (result > BigInt(Number.MAX_SAFE_INTEGER)) {  
        setResult('Result too large to display');  
        return;  
      }  
      
      setResult(result.toString());  
    } else {  
      setResult('Error: Invalid combination format');  
    }  
  } catch (error) {  
    setResult('Error: Calculation failed');  
  }  
};  
  
  const handleTrigButtonClick = (type: string) => {  
    const trigFunc = type === 'sin' ? 'sin' : type === 'cos' ? 'cos' : 'tan';  
    setExpression(`${trigFunc}(${expression})`);  
  };  

   
  const handleLogButtonClick = (type: string) => {  
    if (type === 'log') {  
      setExpression(`log10(${expression})`);  
    }  
  };  

  return (  
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#E8F5FC' }}>  
      
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-2xl text-gray-600 cursor-pointer hover:text-blue-600"
        >
          ℹ️
        </button>
        {showInfo && (
          <div className="absolute right-0 z-10 w-64 p-4 bg-white rounded-lg shadow-lg top-12">
            <h2 className="mb-2 text-lg font-bold">How to Use</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Trigonometric Functions:</strong> Enter a number first, then click <code>sin</code>, <code>cos</code>, or <code>tan</code>.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Logarithm:</strong> Enter a number first, then click <code>log</code>.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Permutations (nPr):</strong> Enter <code>n P r</code> (e.g., <code>5 P 3</code>). <code>r</code> must be ≤ <code>n</code>.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Combinations (nCr):</strong> Enter <code>n C r</code> (e.g., <code>5 C 3</code>). <code>r</code> must be ≤ <code>n</code>.
              </p>
            </div>
          </div>
        )}
      </div>


      
      <div className="w-full max-w-md p-6 calculator-container" style={{ backgroundColor: 'transparent' }}>  
         
        <div className="flex flex-col mb-4">  
          <input  
            type="text"  
            value={expression}  
            className="w-full p-4 text-2xl text-right bg-transparent input focus:outline-none"  
            readOnly  
          />  
          <input  
            type="text"  
            value={result}  
            className="w-full p-4 text-2xl text-right bg-transparent result focus:outline-none"  
            readOnly  
          />  
        </div>  

        
        <div className="grid grid-cols-4 gap-3 mb-3">  
          <button  
            onClick={() => handleButtonClick('AC')}  
            className="col-span-2 p-4 text-lg transition duration-150 rounded-md shadow-lg hover:text-red-500"  
          >  
            AC  
          </button>  
          <button  
            onClick={() => handleButtonClick('DEL')}  
            className="col-span-2 p-4 text-lg transition duration-150 rounded-md shadow-lg hover:text-yellow-500"  
          >  
            DEL  
          </button>  
        </div>  

        
        <div className="grid grid-cols-4 gap-3 mb-4">  
          {[  
            { label: 'x^y', value: '^' },  
            { label: 'nPr', value: 'P' },  
            { label: 'nCr', value: 'C' },  
            { label: 'log', onClick: () => handleLogButtonClick('log') },  
            { label: '!', value: '!' },  
            { label: 'sin', onClick: () => handleTrigButtonClick('sin') },  
            { label: 'cos', onClick: () => handleTrigButtonClick('cos') },  
            { label: 'tan', onClick: () => handleTrigButtonClick('tan') }  
          ].map((btn, index) => (  
            <button  
              key={index}  
              onClick={btn.onClick || (() => handleButtonClick(btn.value!))}  
              className="flex items-center justify-center p-4 text-lg transition duration-150 rounded-md shadow-lg functions"  
            >  
              {btn.label}  
            </button>  
          ))}  
        </div>  

         
        {[  
          ['7', '8', '9', '÷'],  
          ['4', '5', '6', '×'],  
          ['1', '2', '3', '-'],  
          ['0', '.', '=', '+']  
        ].map((row, rowIndex) => (  
          <div key={rowIndex} className="grid grid-cols-4 gap-3 mb-3">  
            {row.map((btn) => (  
              <button  
                key={btn}  
                onClick={() => handleButtonClick(  
                  btn === '÷' ? '/' :   
                  btn === '×' ? '*' :   
                  btn  
                )}  
                className={`p-4 text-lg shadow-lg transition duration-150   
                  ${['÷', '×', '-', '+', '='].includes(btn) ? 'operation-btn' : ''}`}  
              >  
                {btn}  
              </button>  
            ))}  
          </div>  
        ))}  
      </div>  
    </div>  
  );  
};  

export default Calculator;  