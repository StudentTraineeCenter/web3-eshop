const updateBalance = async (contract, accounts) => {
    balance = await contract.methods.balanceOf(accounts[0]).call();
	products = await contract.methods.products(accounts[0]).call();
    $("#balance").html(`Balance of account <b>${accounts[0]}</b> is <b>${balance / 10 ** 18} MTK</b>`);
	$("#tokens").attr("max", balance / 10 ** 18);
	$("#products").html(`Number of bought products: <b>${products}</b>`);
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
                  to: '0x395dbdfa3cdafe6b6c04a1a5ffcab6fa2159af75',
                  from: accounts[0],
                  value: (10**16).toString(16),
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
            
			alert("Your transaction is being processed, please wait few second.");

            fetch('/buy', options)
				.then((res) => {
					console.log(res.statusText)
					alert("You got a token!")
            		updateBalance(contract, accounts);
            	});
        } catch (error) {
        	console.error(error);
        }
    });
    $("#sell").on("click", async (e) => {
        console.log("sell clicked");
        e.preventDefault();
		tokens = $("#tokens").val();
		$("#tokens").attr("value", 1);

		if (tokens > await contract.methods.balanceOf(accounts[0]).call()) {
			alert("Not enough tokens!");
		}

		else {
			try {
				const transactionHash = await ethereum.request({
				method: 'eth_sendTransaction',
				params: [
					{
					to: '0x395dbdfa3cdafe6b6c04a1a5ffcab6fa2159af75',
					from: accounts[0],
					value: (BigInt(10**16 - (10**16 * (tokens * 0.1)))).toString(16),
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
				
				alert("Your transaction is being processed, please wait few second.");

				fetch('/sell', options)
					.then((res) => {
						console.log(res.statusText)
						alert("You used yout tokens!")
						updateBalance(contract, accounts);
					});
			} catch (error) {
				console.error(error);
			}
		}
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
