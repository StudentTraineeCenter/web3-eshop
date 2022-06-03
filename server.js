const express = require("express");
const Web3 = require("web3");
const fs = require("node:fs");

const contractData = require("./build/contracts/MyToken.json");
const { publicKey, privateKey } = require("./owner.json");


const web3 = new Web3(Web3.givenProvider || 'wss://kovan.infura.io/ws/v3/7329a1475da341f69c8ac530e592a8b9');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static(__dirname));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


async function sendContract(tx, contract, networkId) {
	const gas = await tx.estimateGas({from: publicKey});
	const gasPrice = await web3.eth.getGasPrice();
	const data = tx.encodeABI();
	const nonce = await web3.eth.getTransactionCount(publicKey);

	console.log("signing..");
	const signedTx = await web3.eth.accounts.signTransaction({
			to: contract.options.address, 
			data,
			gas,
			gasPrice,
			nonce, 
			chainId: networkId
		},
		privateKey
	);

	console.log("sending..");
	const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	console.log(receipt.transactionHash)
}


app.post("/buy", (req, res) => {
	try {
		setTimeout(() => web3.eth.getTransaction(req.body.hash)
			.then(async (transaction) => {
				const data = fs.readFileSync('hash_db.json');
				const hash_db = JSON.parse(data);

				if (hash_db.includes(req.body.hash)) {
					res.status(400).send("Sending duplicite tx hash.");
					return;
				};

				hash_db.push(req.body.hash);

				fs.writeFile("hash_db.json", JSON.stringify(hash_db), (err) => console.error(err));

				console.log(`to: ${transaction.to} value: ${transaction.value}`);
				if (transaction.to == publicKey && transaction.value == '10000000000000000'){
					const networkId = await web3.eth.net.getId();
					const contract = new web3.eth.Contract(
						contractData.abi,
						contractData.networks[networkId].address
					);

					console.log("Mint:");
					const tx = contract.methods.mint(transaction.from, BigInt(1 * 10 ** 18));
					await sendContract(tx, contract, networkId);

					console.log("Product:")
					const productTx = contract.methods.addProduct(transaction.from);
					await sendContract(productTx, contract, networkId);

					res.end();
				}
			}), 15000);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server error occured.");
		}
})


app.post("/sell", (req, res) => {
    try {
		setTimeout(() => web3.eth.getTransaction(req.body.hash)
			.then(async (transaction) => {
				const json = fs.readFileSync('hash_db.json');
				const hash_db = JSON.parse(json);

				if (hash_db.includes(req.body.hash)) {
					res.status(400).send("Sending duplicite tx hash.");
					return;
				};

				hash_db.push(req.body.hash);

				fs.writeFile("hash_db.json", JSON.stringify(hash_db), (err) => console.error(err));

				console.log(`to: ${transaction.to} value: ${transaction.value}`);
				const burnValue = (10**16 - transaction.value) / 10**15
				const networkId = await web3.eth.net.getId();
				const contract = new web3.eth.Contract(
					contractData.abi,
					contractData.networks[networkId].address
				);

				console.log("Sell:")
				const tx = contract.methods.sell(transaction.from, BigInt(burnValue * 10 ** 18));
				await sendContract(tx, contract, networkId);

				console.log("Product:");
				const productTx = contract.methods.addProduct(transaction.from);
				await sendContract(productTx, contract, networkId);

				res.end();
			}), 10000);

		} catch (error) {
			console.error(error);
			res.status(500).send("Server error occured.");
		}
	})


app.get('/', (req, res) => {
    console.log('default html loading');
    res.render('index.html');
});


app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`));
