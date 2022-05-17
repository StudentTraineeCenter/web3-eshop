const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKey = "";
const projectId = "";

module.exports = {
	networks: {
		kovan: {
			networkCheckTimeout: 10000,
			provider: () => {
				return new HDWalletProvider(
				privateKey,
				`wss://kovan.infura.io/ws/v3/${projectId}`
			)},
			network_id: "42",
		},
	},
};