// Change this ID to your exact $TRUST token on CoinGecko
// Common ones:
// TrueUSD                 → "trueusd"
// Trust Wallet Token (TWT) → "trust-wallet-token"
// If your token isn't listed yet, see alternative options below.
const COINGECKO_ID = "neo-tokyo";   // ← CHANGE THIS IF NEEDED

async function fetchPrice() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${COINGECKO_ID}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    const data = await response.json();

    document.getElementById("name").textContent = data.name + " (" + data.symbol.toUpperCase() + ")";
    document.getElementById("price").textContent = data.market_data.current_price.usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
    
    document.getElementById("logo").src = data.image.large;

    const p = data.market_data.price_change_percentage;
    setChange("change1h", p["1h"]);
    setChange("change24h", p["24h"]);
    setChange("change7d", p["7d"]);

    document.getElementById("marketCap").textContent = "$" + abbreviateNumber(data.market_data.market_cap.usd);
    document.getElementById("volume").textContent = "$" + abbreviateNumber(data.market_data.total_volume.usd);
    document.getElementById("supply").textContent = abbreviateNumber(data.market_data.circulating_supply) + " " + data.symbol.toUpperCase();

    document.getElementById("updated").textContent = new Date().toLocaleString();
  } catch (err) {
    console.error(err);
    document.getElementById("price").textContent = "Error loading data";
  }
}

function setChange(id, value) {
  const el = document.getElementById(id);
  if (value === null) {
    el.textContent = "N/A";
    el.className = "";
  } else {
    el.textContent = (value >= 0 ? "+" : "") + value.toFixed(2) + "%";
    el.className = value >= 0 ? "positive" : "negative";
  }
}

// Helper to show big numbers nicely (e.g. 1.2B, 450M)
function abbreviateNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

function refreshPrice() {
  document.getElementById("price").textContent = "Loading...";
  fetchPrice();
}

// Auto-refresh every 30 seconds + initial load
fetchPrice();
setInterval(fetchPrice, 30000);
