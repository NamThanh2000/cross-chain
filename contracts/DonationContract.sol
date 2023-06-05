// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IPancakeRouter02.sol";

contract DonationContract {
    address payable private owner;
    IERC20 public usdtToken;
    IERC20 public wethToken;
    IPancakeRouter02 public pancakeRouter;
    uint private totalDonations;
    mapping(address => uint) private donations;
    mapping(uint => Withdrawal[]) private withdrawalHistory;
    mapping(uint => mapping(address => Donation[])) private donationHistory;
    mapping(uint => address[]) private addressDonationHistory;
    mapping(uint => mapping(address => uint)) private projectDonations;
    mapping(uint => mapping(uint => string[])) private withdrawalImages;
    mapping(uint => mapping(address => bool)) private isAllowedOrganizationWallet;
    mapping(uint => address[]) private addressOrganization;
    mapping(address => Organization) private organizations;

    struct Donation {
        uint amount;
        uint timestamp;
        string content;
    }

    struct Organization {
        string name;
        string description;
        string imageUrl;
        address organizationWallet;
    }

    struct Withdrawal {
        uint withdrawalId;
        uint amount;
        uint timestamp;
        string content;
        address transferWallet;
    }

    struct Project {
        string title;
        string objective;
        uint deadline;
        uint amount;
        uint totalWithdrawn;
        uint totalDonations;
        uint projectId;
        string imageUrl;
    }

    Project[] private projects;

    constructor(
        address _usdtTokenAddress,
        address _wethTokenAddress,
        address _pancakeRouterAddress
    ) {
        owner = payable(msg.sender);
        usdtToken = IERC20(_usdtTokenAddress);
        wethToken = IERC20(_wethTokenAddress);
        pancakeRouter = IPancakeRouter02(_pancakeRouterAddress);
    }

    // Owner: 0x63Bb4B859ddbdAE95103F632bee5098c47aE2461

    // Thêm project
    // Chỉ owner(người tạo ra website) mới có thể thêm project
    function addProject(string memory _title, string memory _objective, uint _deadline, uint _amount, string memory _imageUrl) external returns (uint) {
        require(msg.sender == owner, "Only the contract owner can add a project.");
        require(_deadline > block.timestamp, "Deadline must be greater than the current timestamp.");
        projects.push(Project({
            projectId: projects.length,
            title: _title,
            objective: _objective,
            deadline: _deadline,
            amount: _amount,
            totalWithdrawn: 0,
            totalDonations: 0,
            imageUrl: _imageUrl
        }));
        return projects.length;
    }

    // Thêm địa chỉ ví(wallet address) của tổ chức vào project
    // Mỗi project có nhiều tổ chức vậy tương đương với project đó có nhiều ví (giải thích theo logic code)
    // Chỉ owner mới có thể thêm tổ chức vào project để quản lý project đó hỗ trợ cho owner
    function addOrganizationWallet(uint _projectId, address _organizationWallet) external {
        require(msg.sender == owner, "Only the contract owner can add an organization wallet.");
        require(!isAllowedOrganizationWallet[_projectId][_organizationWallet], "This wallet is already an allowed organization.");
        isAllowedOrganizationWallet[_projectId][_organizationWallet] = true;
        bool alreadyAdded = false;
        address[] storage orgList = addressOrganization[_projectId];
        for (uint i = 0; i < orgList.length; i++) {
            if (orgList[i] == _organizationWallet) {
                alreadyAdded = true;
                break;
            }
        }
        if (!alreadyAdded) {
            addressOrganization[_projectId].push(_organizationWallet);
        }
    }

    function addWithdrawImage(uint _projectId, uint _withdrawalId, string memory _imageUrl) external {
        require(msg.sender == owner || isAllowedOrganizationWallet[_projectId][msg.sender], "Only the contract owner or the allowed organization can add an image.");
        withdrawalImages[_projectId][_withdrawalId].push(_imageUrl);
    }

    function getWithdrawImage(uint _projectId, uint _withdrawalId) external view returns (string[] memory) {
        require(msg.sender == owner || projectDonations[_projectId][msg.sender] > 0 || isAllowedOrganizationWallet[_projectId][msg.sender] , "Only the contract owner or donors or the allowed organization can see withdrawal history.");
        return withdrawalImages[_projectId][_withdrawalId];
    }

    // Thêm thông tin tổ chức theo địa chỉ ví
    // Example: Ví 0x4d974A49567844EE4342760c61C77010736dE63b được add vào project_1 bằng function addOrganizationWallet
    //          Ví 0x4d974A49567844EE4342760c61C77010736dE63b được add vào project_2 bằng function addOrganizationWallet
    //          Vì 2 ví trên có cùng địa chỉ nên nó là một tổ chức => vậy function addOrganization add một lần thông tin tổ chức của ví đó
    function addOrganization(string memory _name, string memory _description, string memory _imageUrl, address _organizationWallet) external {
        require(msg.sender == owner || _organizationWallet == msg.sender, "Only the contract owner can add info for organization wallet.");
        Organization memory newOrg = Organization({
            name: _name,
            description: _description,
            imageUrl: _imageUrl,
            organizationWallet: _organizationWallet
        });
        organizations[_organizationWallet] = newOrg;
    }

    // Không sử dụng (internal)
    function donate(uint _projectId, string memory _content, uint256 _usdtAmount) internal {
        projects[_projectId].totalDonations += _usdtAmount;
        totalDonations += _usdtAmount;
        donations[msg.sender] += _usdtAmount;
        projectDonations[_projectId][msg.sender] += _usdtAmount;

        Donation memory newDonation = Donation({
            amount: _usdtAmount,
            timestamp: block.timestamp,
            content: _content
        });
        donationHistory[_projectId][msg.sender].push(newDonation);

        bool checkDonorExist = false;
        for (uint i = 0; i < addressDonationHistory[_projectId].length; i++) {
            if (addressDonationHistory[_projectId][i] == msg.sender) {
                checkDonorExist = true;
                break;
            }
        }
        if (!checkDonorExist) {
            addressDonationHistory[_projectId].push(msg.sender);
        }
    }

    // Donate bằng BNB token
    function donateBNB(uint _projectId, string memory _content) external payable {
        require(msg.value > 0, "Please send a non-zero donation amount.");
        require(block.timestamp < projects[_projectId].deadline, "This project's donation period has expired.");
        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = address(usdtToken);
        uint previousBalance = usdtToken.balanceOf(address(this));
        pancakeRouter.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(
            0,
            path,
            address(this),
            block.timestamp + 300
        );
        uint usdtAmount = usdtToken.balanceOf(address(this)) - previousBalance;
        donate(_projectId, _content, usdtAmount);
    }

    // Donate bằng WETH token
    function donateWETH(uint _projectId, string memory _content, uint256 _wethAmount) external {
        require(_wethAmount > 0, "Please send a non-zero donation amount.");
        require(block.timestamp < projects[_projectId].deadline, "This project's donation period has expired.");
        address[] memory path = new address[](2);
        path[0] = address(wethToken);
        path[1] = address(usdtToken);
        wethToken.transferFrom(msg.sender, address(this), _wethAmount);
        wethToken.approve(address(pancakeRouter), _wethAmount);
        uint previousBalance = usdtToken.balanceOf(address(this));
        pancakeRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _wethAmount,
            0,
            path,
            address(this),
            block.timestamp + 300
        );
        uint usdtAmount = usdtToken.balanceOf(address(this)) - previousBalance;
        donate(_projectId, _content, usdtAmount);
    }

    // Chỉ owner và những tổ chức thuộc project mới có thể withdraw
    function withdraw(uint _projectId, uint _amount, string memory _content) external {
        require(msg.sender == owner || isAllowedOrganizationWallet[_projectId][msg.sender], "Only the contract owner or the allowed organization can withdraw funds to another organization.");
        require(_amount > 0, "Please enter a non-zero withdrawal amount.");
        require(_amount < (projects[_projectId].totalDonations - projects[_projectId].totalWithdrawn), "Insufficient funds for project withdrawal.");
        usdtToken.transfer(msg.sender, _amount);
        Withdrawal memory newWithdrawal = Withdrawal({
            withdrawalId: withdrawalHistory[_projectId].length,
            amount: _amount,
            timestamp: block.timestamp,
            content: _content,
            transferWallet: msg.sender
        });
        projects[_projectId].totalWithdrawn += _amount;
        withdrawalHistory[_projectId].push(newWithdrawal);
    }

    // Lấy danh sách tổ chức theo project ID
    function getOrganizationsForProject(uint _projectId) external view returns (Organization[] memory) {
        address[] memory orgAddresses = addressOrganization[_projectId];
        Organization[] memory orgs = new Organization[](orgAddresses.length);
        for (uint i = 0; i < orgAddresses.length; i++) {
            orgs[i] = organizations[orgAddresses[i]];
        }
        return orgs;
    }

    // Lấy danh sách lịch sử donate của bản thân theo project ID
    // Your Donate
    function getDonationHistory(uint _projectId) external view returns (Donation[] memory) {
        return donationHistory[_projectId][msg.sender];
    }

    // Lấy danh sách lịch sử withdraw của bản thân theo project ID
    // Chỉ owner và tổ chức thuộc project và người đã từng donate mới có thể xem lịch sử donate
    function getWithdrawalHistory(uint _projectId) external view returns (Withdrawal[] memory) {
        require(msg.sender == owner || projectDonations[_projectId][msg.sender] > 0 || isAllowedOrganizationWallet[_projectId][msg.sender] , "Only the contract owner or donors or the allowed organization can see withdrawal history.");
        return withdrawalHistory[_projectId];
    }

    // Lấy danh sách lịch sử của tất cả người donate theo project ID
    function getEntireDonationHistory(uint _projectId) external view returns (Donation[] memory) {
        require(msg.sender == owner || isAllowedOrganizationWallet[_projectId][msg.sender], "Only the contract owner or the allowed organization can see the entire donation history.");
        address[] memory addressEntireDonationHistory = addressDonationHistory[_projectId];
        uint totalDonationsCount = 0;
        for (uint i = 0; i < addressEntireDonationHistory.length; i++) {
            totalDonationsCount += donationHistory[_projectId][addressEntireDonationHistory[i]].length;
        }
        Donation[] memory entireDonationHistory = new Donation[](totalDonationsCount);
        uint currentIndex = 0;
        for (uint i = 0; i < addressEntireDonationHistory.length; i++) {
            Donation[] storage donorDonations = donationHistory[_projectId][addressEntireDonationHistory[i]];
            for (uint j = 0; j < donorDonations.length; j++) {
                entireDonationHistory[currentIndex++] = donorDonations[j];
            }
        }
        return entireDonationHistory;
    }

    // Lấy tổng số token nhận được từ toàn bộ project
    // full project
    function getAllTotalDonation() external view returns (uint) {
        return totalDonations;
    }

    // Lấy tổng số token đã donate cho toàn bộ project
    // Bản thân mình trong toàn bộ
    function getTotalDonation() external view returns (uint) {
        return donations[msg.sender];
    }

    // Lấy thông tin chi tiết project theo project ID
    function getProject(uint _projectId) external view returns (Project memory) {
        return projects[_projectId];
    }

    // Lấy tổng số token đã donate cho mỗi project theo project ID
    function getMyDonationForProject(uint _projectId) external view returns (uint) {
        return projectDonations[_projectId][msg.sender];
    }

    // Lấy tất cả project
    function getProjectsList() external view returns (Project[] memory) {
        return projects;
    }

    // Lấy danh sách project có hiệu lực (Còn thời hạn donate và số lượng token nhận được chưa vượt quá số token cần cho project)
    function getActiveProjects() external view returns (Project[] memory) {
        uint activeProjectsCount = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].deadline > block.timestamp && projects[i].totalDonations < projects[i].amount) {
                activeProjectsCount++;
            }
        }
        Project[] memory activeProjects = new Project[](activeProjectsCount);
        uint currentIndex = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].deadline > block.timestamp && projects[i].totalDonations < projects[i].amount) {
                activeProjects[currentIndex++] = projects[i];
            }
        }
        return activeProjects;
    }

    // Lấy danh sách project mà bản thân đã từng donate
    function getDonatedProjects() external view returns (Project[] memory) {
        uint donatedProjectsCount = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (projectDonations[i][msg.sender] > 0) {
                donatedProjectsCount++;
            }
        }
        Project[] memory donatedProjects = new Project[](donatedProjectsCount);
        uint currentIndex = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (projectDonations[i][msg.sender] > 0) {
                donatedProjects[currentIndex++] = projects[i];
            }
        }
        return donatedProjects;
    }

    // Lấy thông tin các project mà mình là admin của project
    function getOrganizationProjects() external view returns (Project[] memory) {
        uint organizationProjectsCount = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (isAllowedOrganizationWallet[i][msg.sender]) {
                organizationProjectsCount++;
            }
        }
        Project[] memory organizationProjects = new Project[](organizationProjectsCount);
        uint currentIndex = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (isAllowedOrganizationWallet[i][msg.sender]) {
                organizationProjects[currentIndex++] = projects[i];
            }
        }
        return organizationProjects;
    }

    // Lấy số lượng token của contract (chỉ nên hiển thị với owner)
    function getContractBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }
}