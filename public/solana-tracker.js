const BIRDEYE_API_KEY = 'e0a89b79c44147e8ba7aa65dd40a6141';
const TOKEN_ADDRESS = '75jjoQxJ6LdgyD4QVdDVAJeehYAn9c1RpNvfjXD27Rj2'; // BONK token address

async function updateMarketCap() {
    try {
        const response = await fetch(`https://public-api.birdeye.so/public/token?address=${TOKEN_ADDRESS}`, {
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