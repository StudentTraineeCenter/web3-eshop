const express = require("express");
const Web3 = require("web3");
const contractData = require("./contracts/MyToken.json");
const { publicKey, privateKey } = require("./owner.json");

const web3 = new Web3('http://127.0.0.1:7545');
const app = express();
const port = 8000;
app.use(express.json())


// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });
    
    
app.post("/api", (req, res) => {
    web3.eth.getTransaction(req.body.hash)
        .then(async (transaction) => {
            console.log(`to: ${transaction.to} value: ${transaction.value}`);
            if (transaction.to == publicKey && transaction.value == '1000000000000000'){
                const networkId = await web3.eth.net.getId();
                const contract = new web3.eth.Contract(
                    contractData.abi,
                    contractData.networks[networkId].address
                );
                const tx = contract.methods.mint(transaction.from, BigInt(1 * 10 ** 18));
                const gas = await tx.estimateGas({from: publicKey});
                const gasPrice = await web3.eth.getGasPrice();
                const data = tx.encodeABI();
                const nonce = await web3.eth.getTransactionCount(publicKey);

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

                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log(receipt.transactionHash)
        	}
    	});
	res.end();
})

app.listen(port, () => console.log(`Listening on port ${port}`));
