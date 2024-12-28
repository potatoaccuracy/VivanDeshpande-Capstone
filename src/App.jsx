import { useState, createContext, useContext, useCallback, useEffect} from 'react'
import './App.css'


const test = true;
const testURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo";
const apiURL = "https://www.alphavantage.co/query";
const apiKey = "2DXDPJK5STZUH6ZK";

const ytdDate = "2024-12-12";

const stockContext = createContext();

function DashboardHeader() {
  return (
    <>
      <h1>Finance Dashboard</h1>
    </>
  )
}


function StockForm() {

  const [stockSymbol, setStockSymbol] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockPurchasePrice, setStockPurchasePrice] = useState('');
  const {stocks, setStocks} = useContext(stockContext);

  const stockPull = useCallback(async (stock) => {

    // API Call  
    const queryParams = {
      function: "TIME_SERIES_DAILY",
      symbol: stock.symbol,
      apikey: apiKey,
    };
    const url = test ? testURL : `${apiURL}?${new URLSearchParams(queryParams).toString()}`;

    return fetch(url).then((res) => {
      if(res.ok){
        return res.json();
      } else{
        throw new Error(res.status);
      }
    }).then((data) => {
      // New stock added
      if("Error Message" in data){
        throw new Error("This stock doesn't exist :/");
      }

      let currentPrice = test ? parseFloat(data["Global Quote"]["05. price"]).toFixed(2) : parseFloat(data["Time Series (Daily)"][ytdDate]['4. close']).toFixed(2);
      let profitLoss = ((currentPrice - stock.purchasePrice) * stock.qty).toFixed(2);

      return {...stock, currentPrice: currentPrice, profitLoss: profitLoss};
    }).catch(err => {
      alert(err);
      return false;
    });
  }, []);


  const PullCurrentPrice = async () => {
    const findPromises = stocks.map(stockPull);
    const updatedResult = await Promise.all(findPromises);
    setStocks(updatedResult);
    console.log("Updated prices.")
  }

  useEffect(() => {
    PullCurrentPrice();
  }, [stocks.length]);

  
  const addStock = async () => {
    // Form Checking
    if (!stockSymbol || !stockQuantity || !stockPurchasePrice){
      alert("Sike. You thought.");
      return; 
    }

    // API call
    let stock = {
      id: Object.keys(stocks).length + 1,
      symbol: stockSymbol,
      qty: parseInt(stockQuantity),
      purchasePrice: stockPurchasePrice,
      currentPrice: 0,
      profitLoss: 0
    };
    stock = await stockPull(stock);
    if(!stock){
      return; // because encountered error with API call
    }

    // Adding stock to the StockList
    setStocks([...stocks, stock]);

    // Clearing form inputs
    setStockSymbol("");
    setStockQuantity("");
    setStockPurchasePrice("");
  };

  return (
    <>  
      <input type="text" placeholder="Stock Symbol" value={stockSymbol} onChange={event=> setStockSymbol(event.target.value)}></input>
      <input type="number" placeholder="Quantity" value={stockQuantity} onChange={event=> setStockQuantity(event.target.value)}></input>
      <input type="number" placeholder="Price" value={stockPurchasePrice}  onChange={event=> setStockPurchasePrice(event.target.value)}></input>
      <button type="submit" onClick={addStock} variant="contained">Add Stock</button>
    </>
  )
}

function StockList() {
  const {stocks, setStocks} = useContext(stockContext);

  return (
      <section id="stockListSelect">
        <h2>Stock List</h2>
        {stocks.length == 0 ? (
          <p id="placeholder">No stocks added yet.</p>
        ) : (
          <ul id="stockList">
            {stocks.map(stock => (
              <li key={stock.id}>
                <p><strong>Symbol: {stock.symbol}</strong></p>
                <p>Quantity: {stock.qty}</p>
                <p>Purchase Price: {`$${Number(stock.purchasePrice)}`}</p>
                <p>Current Price: {`$${Number(stock.currentPrice)}`}</p>
                {
                  stock.profitLoss >= 0 ?
                  <p className="positive">Profit/Loss: <strong>+${Number(stock.profitLoss).toLocaleString("en-GB")}</strong></p> :
                  <p className="negative">Profit/Loss: <strong>-${Number(-stock.profitLoss).toLocaleString("en-GB")}</strong></p>
                }
              </li>
            ))}
          </ul>
        )}
        
      </section>
  )
}


function App() {
  const [stocks, setStocks] = useState([]);

  return (
  <stockContext.Provider value={{stocks, setStocks}}>
    <DashboardHeader />
    <StockForm />
    <StockList />
  </stockContext.Provider>
  )
}

export default App