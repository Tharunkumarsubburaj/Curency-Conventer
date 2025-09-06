import { useState, useEffect } from 'react';
import './App.css'
import { currency_list, api } from "./components/currencyCode";
function App() {
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      setResult(`Fetch API Error: ${error}`);
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log('Converting:', { amount, fromCurrency, toCurrency });
      
      const data = await fetchData(`https://v6.exchangerate-api.com/v6/${api}/latest/USD`);
      console.log('API Response:', data);
      
      if (!data.conversion_rates) {
        throw new Error('No conversion rates in API response');
      }

      const fromRates = data.conversion_rates[fromCurrency];
      const toRates = data.conversion_rates[toCurrency];
      
      console.log('Rates:', { fromRates, toRates });
      
      if (!fromRates || !toRates) {
        throw new Error(`Unable to get conversion rates for ${fromCurrency} or ${toCurrency}`);
      }

      const perRate = (1 * (toRates / fromRates)).toFixed(2);
      const convertedAmount = (parseFloat(amount) * (toRates / fromRates)).toFixed(2);
      
      console.log('Calculated:', { perRate, convertedAmount });

      setStatus(`1 ${fromCurrency} = ${perRate} ${toCurrency}`);
      setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    } catch (error) {
      console.error(`Error converting currency:`, error);
      setResult(`Error: ${error.message}`);
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
      : 'bg-gradient-to-br from-blue-300/50 via to-blue-300/50 text-gray-900'
    } flex items-center justify-center transition-colors duration-300`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${
          theme === 'dark'
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-blue-100 text-gray-900 hover:bg-blue-200'
        } transition-colors duration-300`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${
        theme === 'dark' 
          ? 'bg-gray-950/90 border border-gray-800' 
          : 'bg-white/30 border border-gray-300'
      } relative`}>
        <div className="mb-8 text-center shadow-2xl">
          <h1 className={`text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-teal-400 via-cyan-400 to-blue-400'
              : 'from-blue-600 via-blue-500 to-teal-500'
          } mb-1`}>Currency Converter</h1>
          {/* <hr className={`mb-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} /> */}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-100 border-gray-700'
                : 'bg-white/50 text-gray-900 border-gray-300'
            }`}
          />
          <div className="flex items-center gap-2">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              required
              className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-100 border-gray-700'
                  : 'bg-white/50 text-gray-900 border-gray-300'
              }`}
            >
              <option value="">From</option>
              {currency_list.map((values) => (
                <option key={values[0]} value={values[0]}>{values[0]}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const temp = fromCurrency;
                setFromCurrency(toCurrency);
                setToCurrency(temp);
              }}
              className={`p-2 rounded-full border transition text-xl ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  : 'bg-blue-50/50 border-gray-300 hover:bg-blue-100'
              }`}
              aria-label="Swap currencies"
            >
              💱
            </button>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              required
              className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-100 border-gray-700'
                  : 'bg-white/50 text-gray-900 border-gray-300'
              }`}
            >
              <option value="">To</option>
              {currency_list.map((e) => (
                <option key={e[0]} value={e[0]}>{e[0]}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-bold shadow hover:scale-105 transition ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-400 hover:to-blue-400'
                : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-500 hover:to-teal-400'
            }`}
          >
            Convert
          </button>
        </form>
        <div className="mt-8 text-center">
          {status && <p className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-teal-400' : 'text-blue-600'
          }`}>{status}</p>}
          {result && <p className={`text-2xl font-bold drop-shadow-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{result}</p>}
        </div>
      </div>
    </div>
  )
}

export default App
