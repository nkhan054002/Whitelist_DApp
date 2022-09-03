const {ethers} = require("hardhat")

async function main(){
    const WhitelistContract = await ethers.getContractFactory("Whitelist");
    const deployedWhitelistContract = await WhitelistContract.deploy(10);
    await deployedWhitelistContract.deployed();
    //above line so as to wait for it to actually get deployed

    console.log("Whitelist Contract deployed", deployedWhitelistContract.address)
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.log(error)
    process.exit(1)
})

/*process.exit(0) == means everything is fine, .then is for no error getting caught, or rather, the whole main function 
gets executed 
process.exit(1) == tells os that something went wrong and to exit the main fn 

*/