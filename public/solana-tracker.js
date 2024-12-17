const BIRDEYE_API_KEY = 'e0a89b79c44147e8ba7aa65dd40a6141';
const TOKEN_ADDRESS = '75jjoQxJ6LdgyD4QVdDVAJeehYAn9c1RpNvfjXD27Rj2'; // Your token address

async function updateMarketCap() {
    try {
        const response = await fetch(`https://public-api.birdeye.so/public/token_price/${TOKEN_ADDRESS}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': BIRDEYE_API_KEY,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        const data = await response.json();
        
        if (data && data.success && data.data) {
            const price = data.data.value;
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 8,
                maximumFractionDigits: 8
            }).format(price);

            document.getElementById('marketCap').textContent = formattedPrice;
        } else {
            throw new Error('Invalid data received');
        }
    } catch (error) {
        console.error('Error fetching price:', error);
        document.getElementById('marketCap').textContent = 'Error loading data';
    }
}

// Update every 30 seconds
setInterval(updateMarketCap, 30000);

// Initial update
updateMarketCap(); 