import Web3 from 'web3';
const wa = window as any;

let isInjected = false;
if (window.hasOwnProperty('web3')) {
    wa.web3 = new Web3(wa.web3.currentProvider);
    isInjected = true;
} else {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/PshUq87Q8lsogyEMQv1u");
    wa.web3 = new Web3(provider);
}

export {
    isInjected
};

export default wa.web3;