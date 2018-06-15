import Web3 from 'web3';
const wa = window as any;
if (window.hasOwnProperty('web3')) {
    wa.web3 = new Web3(wa.web3.currentProvider);
} else {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/PshUq87Q8lsogyEMQv1u");
    wa.web3 = new Web3(provider);
}

export default wa.web3;