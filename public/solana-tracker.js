// solana-tracker.js

const BIRDEYE_API_KEY = "e0a89b79c44147e8ba7aa65dd40a6141";
const TOKEN_ADDRESS = "65CFQVF1tfDMAtXrGDZR61M24D6eWrA8FpCDg44Jpump";

async function updateMarketCap() {
    try {
        const response = await fetch(
            `https://public-api.birdeye.so/defi/v3/token/market-data?address=${TOKEN_ADDRESS}`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'x-api-key': BIRDEYE_API_KEY,
                    'x-chain': 'solana'
                }
            }
        );

        const data = await response.json();
        
        if (data.success && data.data) {
            const marketCap = data.data.marketcap;

            // Format the market cap
            const formattedMarketCap = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(marketCap);

            document.getElementById('marketCap').textContent = formattedMarketCap;
            
            // Check milestones
            checkMilestones(marketCap);
        } else {
            throw new Error('Invalid data received');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('marketCap').textContent = 'Error loading data';
    }
}

function checkMilestones(marketCap) {
    const lockedLinks = document.querySelectorAll('a.locked');
    lockedLinks.forEach(link => {
        const milestone = parseInt(link.dataset.milestone);
        if (marketCap >= milestone) {
            link.classList.remove('locked');
            link.classList.add('unlocked');
            // Optional: Show notification
            showUnlockNotification(link.textContent);
        }
    });
}

function showUnlockNotification(itemName) {
    const message = document.createElement('div');
    message.className = 'message astro-message';
    message.innerHTML = `>ALERT: New schematic unlocked - ${itemName}`;
    document.getElementById('chat').appendChild(message);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}

// Update every 15 seconds
setInterval(updateMarketCap, 15000);

// Initial update
updateMarketCap();