// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IPancakeRouter02.sol";

contract DonationContract {
    address public owner;
    IERC20 public usdtToken;
    IERC20 public wethToken;
    IPancakeRouter02 public pancakeRouter;
    uint256 public totalDonations;

    struct DonationInfo {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => uint256) public donations;
    mapping(address => DonationInfo[]) public donationHistory;

    event Donation(address indexed donor, uint256 amount);

    constructor(
        address _usdtTokenAddress,
        address _wethTokenAddress,
        address _pancakeRouterAddress
    ) {
        owner = msg.sender;
        usdtToken = IERC20(_usdtTokenAddress);
        wethToken = IERC20(_wethTokenAddress);
        pancakeRouter = IPancakeRouter02(_pancakeRouterAddress);
    }

    function donateBNB() external payable {
        require(msg.value > 0, "BNB amount must be greater than 0");

        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = address(usdtToken);

        uint256 previousBalance = usdtToken.balanceOf(address(this));

        pancakeRouter.swapExactETHForTokens{value: msg.value}(
            0, // accept any amount of USDT
            path,
            address(this),
            block.timestamp + 300 // deadline
        );

        uint256 usdtAmount = usdtToken.balanceOf(address(this)) - previousBalance;
        donations[msg.sender] += usdtAmount;
        totalDonations += usdtAmount;
        donationHistory[msg.sender].push(DonationInfo(usdtAmount, block.timestamp));
        emit Donation(msg.sender, usdtAmount);
    }

    function donateBNBS() external payable {
        require(msg.value > 0, "BNB amount must be greater than 0");

        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = address(usdtToken);

        uint256 previousBalance = usdtToken.balanceOf(address(this));

        pancakeRouter.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(
            0, // accept any amount of USDT
            path,
            address(this),
            block.timestamp + 300 // deadline
        );

        uint256 usdtAmount = usdtToken.balanceOf(address(this)) - previousBalance;
        donations[msg.sender] += usdtAmount;
        totalDonations += usdtAmount;
        donationHistory[msg.sender].push(DonationInfo(usdtAmount, block.timestamp));
        emit Donation(msg.sender, usdtAmount);
    }

    function donateWETH(uint256 _wethAmount) external {
        require(_wethAmount > 0, "WETH amount must be greater than 0");

        address[] memory path = new address[](2);
        path[0] = address(wethToken);
        path[1] = address(usdtToken);

        wethToken.transferFrom(msg.sender, address(this), _wethAmount);

        // Approve the router to spend WETH on behalf of the sender
        wethToken.approve(address(pancakeRouter), _wethAmount);

        uint256 previousBalance = usdtToken.balanceOf(address(this));

        pancakeRouter.swapExactTokensForTokens(
            _wethAmount,
            0, // accept any amount of USDT
            path,
            address(this),
            block.timestamp + 300 // deadline
        );

        uint256 usdtAmount = usdtToken.balanceOf(address(this)) - previousBalance;
        donations[msg.sender] += usdtAmount;
        totalDonations += usdtAmount;
        donationHistory[msg.sender].push(DonationInfo(usdtAmount, block.timestamp));
        emit Donation(msg.sender, usdtAmount);
    }

    function donateWETHS(uint256 _wethAmount) external {
        require(_wethAmount > 0, "WETH amount must be greater than 0");

        address[] memory path = new address[](2);
        path[0] = address(wethToken);
        path[1] = address(usdtToken);

        wethToken.transferFrom(msg.sender, address(this), _wethAmount);

        // Approve the router to spend WETH on behalf of the sender
        wethToken.approve(address(pancakeRouter), _wethAmount);

        uint256 previousBalance = usdtToken.balanceOf(address(this));

        pancakeRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _wethAmount,
            0, // accept any amount of USDT
            path,
            address(this),
            block.timestamp + 300 // deadline
        );

        uint256 usdtAmount = usdtToken.balanceOf(address(this)) - previousBalance;
        donations[msg.sender] += usdtAmount;
        totalDonations += usdtAmount;
        donationHistory[msg.sender].push(DonationInfo(usdtAmount, block.timestamp));
        emit Donation(msg.sender, usdtAmount);
    }

    function withdrawUSDT(uint256 _amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(usdtToken.balanceOf(address(this)) >= _amount, "Not enough USDT balance");
        usdtToken.transfer(owner, _amount);
    }

    function withdrawWETH(uint256 _amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(wethToken.balanceOf(address(this)) >= _amount, "Not enough WETH balance");
        wethToken.transfer(owner, _amount);
    }

    function donationOf(address _donor) external view returns (uint256) {
        return donations[_donor];
    }

    function getContractBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }

    function getDonationHistory(address _donor) external view returns (DonationInfo[] memory) {
        return donationHistory[_donor];
    }
}