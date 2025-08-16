/**
 * LayerZero V2 Endpoint Configurations
 * Official endpoints for different networks
 */

const LZ_ENDPOINTS = {
    // Ethereum Networks
    ETHEREUM_MAINNET: {
        endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
        chainId: 1,
        lzChainId: 30101,
        name: "Ethereum Mainnet"
    },
    ETHEREUM_SEPOLIA: {
        endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f",
        chainId: 11155111,
        lzChainId: 40161,
        name: "Ethereum Sepolia Testnet"
    },
    
    // Layer 2 Networks
    POLYGON_MAINNET: {
        endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
        chainId: 137,
        lzChainId: 30109,
        name: "Polygon Mainnet"
    },
    ARBITRUM_MAINNET: {
        endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
        chainId: 42161,
        lzChainId: 30110,
        name: "Arbitrum Mainnet"
    },
    OPTIMISM_MAINNET: {
        endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
        chainId: 10,
        lzChainId: 30111,
        name: "Optimism Mainnet"
    },
    BASE_MAINNET: {
        endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
        chainId: 8453,
        lzChainId: 30184,
        name: "Base Mainnet"
    },
    
    // Sponsor Networks
    CHILIZ_TESTNET: {
        endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f", // Placeholder - may need actual endpoint
        chainId: 88882,
        lzChainId: 88882,
        name: "Chiliz Spicy Testnet"
    }
};

/**
 * Get endpoint configuration by network name
 */
function getEndpointConfig(networkName) {
    const networkMap = {
        'mainnet': LZ_ENDPOINTS.ETHEREUM_MAINNET,
        'ethereum': LZ_ENDPOINTS.ETHEREUM_MAINNET,
        'sepolia': LZ_ENDPOINTS.ETHEREUM_SEPOLIA,
        'polygon': LZ_ENDPOINTS.POLYGON_MAINNET,
        'arbitrum': LZ_ENDPOINTS.ARBITRUM_MAINNET,
        'optimism': LZ_ENDPOINTS.OPTIMISM_MAINNET,
        'base': LZ_ENDPOINTS.BASE_MAINNET,
        'chiliz': LZ_ENDPOINTS.CHILIZ_TESTNET
    };
    
    return networkMap[networkName.toLowerCase()] || LZ_ENDPOINTS.ETHEREUM_SEPOLIA;
}

/**
 * Get all available networks
 */
function getAllNetworks() {
    return Object.values(LZ_ENDPOINTS);
}

/**
 * Check if a network supports LayerZero
 */
function isNetworkSupported(chainId) {
    return Object.values(LZ_ENDPOINTS).some(config => config.chainId === chainId);
}

module.exports = {
    LZ_ENDPOINTS,
    getEndpointConfig,
    getAllNetworks,
    isNetworkSupported
};