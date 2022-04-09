const updateBalance = async (contract, accounts) => {
    balance = await contract.methods.balanceOf(accounts[0]).call();
    $("#balance").html(`Balance of account <b>${accounts[0]}</b> is <b>${balance / 10 ** 18} MTK</b>`);
	$("#tokens").attr("max", balance / 10 ** 18);
};

const buySell = (contract, accounts) => {
    $("#buy").on("click", async (e) => {
		e.preventDefault();
        console.log("buy clicked");

        try {
            const transactionHash = await ethereum.request({
              method: 'eth_sendTransaction',
              params: [
                {
                  to: '0x4222EFD2a4bC0F60D6eABEd33a7bEB3cc8c1a096',
                  from: accounts[0],
                  value: (10000000000000000n).toString(16),
                },
              ],
            });
            // Handle the result
            console.log(transactionHash);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({hash: transactionHash}),
            }
            
            fetch('http://localhost:8000/api', options)
				.then((res) => {
            		updateBalance(contract, accounts);
					console.log(res.statusText)
            	});
        } catch (error) {
        	console.error(error);
        }
    });
    $("#sell").on("click", async (e) => {
        console.log("sell clicked");
        e.preventDefault();
		tokens = $("#tokens").val();

		// const tx = contract.methods.burn(BigInt(tokens * 10 ** 18));
		// const data = tx.encodeABI();

		// try {
        //     const transactionHash = await ethereum.request({
        //       method: 'eth_sendTransaction',
        //       params: [
        //         {
        //           to: '0x35fC5E48339C7fE7ebA306DE11dE50824B4C7F9f',
        //           from: accounts[0],
        //           value: (BigInt(10000000000000000 - (tokens * 0.1))).toString(16),
		// 		  data: data
        //         },
        //       ],
        //     });
        //     // Handle the result
        //     console.log(transactionHash);
        // } catch (error) {
        // 	console.error(error);
        // }

        await contract.methods
            .burn(BigInt(tokens * 10 ** 18))
            .send({ from: accounts[0] });
        updateBalance(contract, accounts);
    });
};

async function w3eshopApp() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const contract = await getContract(web3);

    updateBalance(contract, accounts);
    buySell(contract, accounts);
}

w3eshopApp();
