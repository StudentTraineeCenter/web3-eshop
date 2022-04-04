const updateBalance = async (contract, accounts) => {
    balance = await contract.methods.balanceOf(accounts[0]).call();
    $("p").html(`Balance of account <b>${accounts[0]}</b> is <b>${balance / 10 ** 18} MTK</b>`);
};

const buySell = (contract, accounts) => {
    $("#buy").on("click", async (e) => {
        console.log("buy clicked");
        // input = e.target.value;
        e.preventDefault();
        await contract.methods
            .buy(BigInt(1 * 10 ** 18))
            .send({ from: accounts[0]});
        updateBalance(contract, accounts);
    });
    $("#sell").on("click", async (e) => {
        console.log("sell clicked");
        e.preventDefault();
        await contract.methods
            .burn(BigInt(1 * 10 ** 18))
            .send({ from: accounts[0]});
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
