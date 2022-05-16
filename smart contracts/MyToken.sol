// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("MyToken", "MTK") {}

    mapping(address => uint256) public products;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function sell(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }

    function addProduct(address to) public onlyOwner {
        products[to] += 1;
    }
}
