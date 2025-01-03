// solana-tracker.js

const BIRDEYE_API_KEY = "e0a89b79c44147e8ba7aa65dd40a6141";
const TOKEN_ADDRESS = "";

// Add this line at the start to set the contract address immediately
document.getElementById('contractAddress').textContent = TOKEN_ADDRESS;

function copyContractAddress() {
    const caText = document.getElementById('contractAddress').textContent;
    navigator.clipboard.writeText(caText).then(() => {
        const copyBtn = document.querySelector('.copy-button');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
}