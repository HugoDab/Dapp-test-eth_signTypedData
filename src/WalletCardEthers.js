import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'
import {Radio} from 'antd';
import './WalletCard.css'

const WalletCardEthers = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [provider, setProvider] = useState(null);
    const [chainId, setChainId] = useState(null);

    const [errorMessageSign, setErrorMessageSign] = useState(null);
    const [messageDisplay, setMessageDisplay] = useState(null);
    const [version, setVersion] = useState("V1");

    async function signTypedDataHandler() {
        if (!provider) {
            console.error('Connect to MetaMask first');
            setErrorMessageSign('Please connect to MetaMask first');
        } else {
            try {
                const msgParams = JSON.parse(window.document.getElementById("msgParamsText").value)
                let method;
                let params;
                if (version === "V1") {
                    method = 'eth_signTypedData'
                    params = [msgParams, defaultAccount]
                } else {
                    method = 'eth_signTypedData_' + version.toLowerCase()
                    params = [defaultAccount, JSON.stringify(msgParams)]
                }
                const sign = await window.ethereum.request({
                    method: method, params: params,
                });
                setMessageDisplay(`Successful: ${sign}`);
            } catch (err) {
                console.error(err);
                setMessageDisplay(`Error: ${err.message}`);
            }
        }
    }


    const connectWalletHandler = () => {
        if (window.ethereum && defaultAccount == null) {
            // set ethers provider
            setProvider(new ethers.providers.Web3Provider(window.ethereum));

            // connect to metamask
            window.ethereum.request({method: 'eth_requestAccounts'})
                .then(result => {
                    setConnButtonText('Wallet Connected');
                    setDefaultAccount(result[0]);
                })
                .catch(error => {
                    setErrorMessage(error.message);
                });

            window.ethereum.request({
                method: 'eth_chainId',
            }).then(result => {
                setChainId(result)
            }).catch(error => {
                setErrorMessage(error.message);
            });

        } else if (!window.ethereum) {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }


    useEffect(() => {
        if (defaultAccount) {
            provider.getBalance(defaultAccount)
                .then(balanceResult => {
                    setUserBalance(ethers.utils.formatEther(balanceResult));
                })
        }

    }, [provider, defaultAccount]);

    return (<div>
            <div className='walletCard'>
                <h4> Making Connection to MetaMask using ethers.js </h4>
                <button onClick={connectWalletHandler}>{connButtonText}</button>
                <div className='accountDisplay'>
                    <h3>Address: {defaultAccount}</h3>
                </div>
                <div className='balanceDisplay'>
                    <h3>Balance: {userBalance}</h3>
                </div>
                {errorMessage}
            </div>
            <div className='walletCard'>
                <h4> Sending eth_signTypedData{version} to MetaMask</h4>
                <div>The chainId is: {chainId}</div>
                <div className="msgParams">
                    <Radio.Group onChange={(e) => setVersion(e.target.value)} defaultValue={version}>
                        <Radio.Button value="V1">V1</Radio.Button>
                        <Radio.Button value="V3">V3</Radio.Button>
                        <Radio.Button value="V4">V4</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{padding: "10px"}}>
                    <textarea id="msgParamsText" cols="40" rows="5"></textarea>
                </div>
                <button onClick={signTypedDataHandler}>Sign using {version}</button>
                <div className='messageDisplay'>
                    <h3>Result: {messageDisplay}</h3>
                </div>
                {errorMessageSign}
            </div>
        </div>);
}

export default WalletCardEthers;
