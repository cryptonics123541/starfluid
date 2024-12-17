const BIRDEYE_API_KEY = 'YOUR_BIRDEYE_API_KEY';
const TOKEN_ADDRESS = 'YOUR_TOKEN_CONTRACT_ADDRESS'; // Replace with your token's CA

async function updateMarketCap() {
    try {
        const response = await fetch(`https://public-api.birdeye.so/public/token_price?address=${TOKEN_ADDRESS}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': BIRDEYE_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data && data.success && data.data) {
            const marketCap = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(data.data.marketCap);

            document.getElementById('marketCap').textContent = marketCap;
        } else {
            throw new Error('Invalid data received');
        }
    } catch (error) {
        console.error('Error fetching market cap:', error);
        document.getElementById('marketCap').textContent = 'Error loading data';
    }
}

// Update every 30 seconds
setInterval(updateMarketCap, 30000);

// Initial update
updateMarketCap(); 