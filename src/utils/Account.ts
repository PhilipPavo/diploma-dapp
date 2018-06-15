import ethUtil from "ethereumjs-util";
import {User} from "../App";
import passportContract from "./contract";
import web3 from './web3';

class Account{
    public static async getContractAddress(){
        return passportContract.deployed().then(instance => {
            return instance.address;
        });
    }

    public static async getList(){
        const instance = await passportContract.deployed();
        const data = await instance.getList.call();
        const res:string[] = [];
        for(const item of data){
            if(res.indexOf(item) === -1){
                res.push(item)
            }
        }

        return res;
    }

    public static async getCurrentAddress(){
        const accounts = await web3.eth.getAccounts();
        return accounts[0];
    }

    public static signMessage(message, from){
        return web3.eth.personal.sign(
            web3.utils.utf8ToHex(message),
            from
        );
    }

    public static verifySignature(signature, message, publicAddress) {
        const msgBuffer = ethUtil.toBuffer(message);
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethUtil.toBuffer(signature);
        const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
        const publicKey = ethUtil.ecrecover(
            msgHash,
            signatureParams.v,
            signatureParams.r,
            signatureParams.s
        );
        const addressBuffer = ethUtil.publicToAddress(publicKey);
        const address = ethUtil.bufferToHex(addressBuffer);

        return address.toLowerCase() === publicAddress.toLowerCase();
    }

    public static signUp(address, firstName, lastName, gender, description){
        return passportContract.deployed().then(instance => {
            return instance.registerPassport(firstName, lastName, gender, description, {
                from: address
            });
        });
    }

    public static exist(address){
        return passportContract.deployed().then(instance => {
            return instance.exists.call(address);
        });
    }

    public static async getPassport(address) {
        const instance = await passportContract.deployed();
        const data = await instance.getUserPassport.call(address);

        return new Promise<User>((resolve, reject) => {
            resolve({
                description: data[3],
                firstName: data[0],
                gender: data[2],
                lastName: data[1],
                publicAddress: address,
                registered: new Date(data[4] * 1000),
            } as User);
        })
    }

}

export default Account;