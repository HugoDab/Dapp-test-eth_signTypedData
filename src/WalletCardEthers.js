import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'
import {Checkbox, Input, Radio, Space} from 'antd';
import './WalletCard.css'
import TextArea from "antd/es/input/TextArea";

const WalletCardEthers = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [provider, setProvider] = useState(null);

    const [errorMessageSign, setErrorMessageSign] = useState(null);
    const [messageDisplay, setMessageDisplay] = useState(null);
    const [version, setVersion] = useState("V1");

    async function signTypedDataHandler() {
        if (!provider) {
            console.warn('Connect to MetaMask first');
            setErrorMessageSign('Please connect to MetaMask first');
        } else {
            try {
                const msgParams = getMsgParams()
                const sign = await window.ethereum.request({
                    method: 'eth_signTypedData', params: [msgParams, defaultAccount],
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

        } else if (!window.ethereum) {
            console.warn('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    function getMsgParams() {
        const parent = window.document.getElementById("parent" + version)

        let msgParams = {}

        for (const child of parent.childNodes) {
            console.log("We are in " + child.textContent + " and the value is:")
            console.warn(child.childNodes)
            if (child.checked) {
                let params = {}
                for (const checkBoxChild of child.childNodes) {
                    console.log("We are in " + checkBoxChild.textContent + " and the value is:" + checkBoxChild.value)
                    if (checkBoxChild.checked) {
                        let childParams = {}
                        if (checkBoxChild.hasChildNodes()) {
                            for (const checkBoxChildLast of checkBoxChild.childNodes) {
                                console.log("We are in " + checkBoxChildLast.textContent + " and the value is:" + checkBoxChildLast.value)
                                childParams[checkBoxChildLast.value] = ""
                            }
                                }
                        params[checkBoxChild.value] = childParams
                    }
                }
                msgParams[child.value] = params
            }
        }

        return JSON.parse("")
    }


    useEffect(() => {
        if (defaultAccount) {
            provider.getBalance(defaultAccount)
                .then(balanceResult => {
                    setUserBalance(ethers.utils.formatEther(balanceResult));
                })
        }

    }, [defaultAccount, provider]);

    useEffect(() => {
        switch (version) {
            case "V1":
                window.document.getElementById("parentV1").style.display = "block";
                window.document.getElementById("parentV3").style.display = "none";
                window.document.getElementById("parentV4").style.display = "none";
                break;
            case "V3":
                window.document.getElementById("parentV1").style.display = "none";
                window.document.getElementById("parentV3").style.display = "block";
                window.document.getElementById("parentV4").style.display = "none";
                break;
            case "V4":
                window.document.getElementById("parentV1").style.display = "none";
                window.document.getElementById("parentV3").style.display = "none";
                window.document.getElementById("parentV4").style.display = "block";
                break;
            default:
                break;
        }
    }, [version]);

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
                <div className="msgParams">
                    <Radio.Group onChange={(e) => setVersion(e.target.value)} defaultValue={version}>
                        <Radio.Button value="V1">V1</Radio.Button>
                        <Radio.Button value="V3">V3</Radio.Button>
                        <Radio.Button value="V4">V4</Radio.Button>
                    </Radio.Group>
                </div>
                <Space id="parentV3" style={{display: "none"}} direction="vertical" className={"spaces"}>
                    <Checkbox defaultChecked><div>types:</div><Space direction="vertical" className={"spaces"}>
                        <Checkbox defaultChecked>EIP712Domain<TextArea defaultValue="[
      {
        'name': 'name',
        'type': 'string'
      },
      {
        'name': 'version',
        'type': 'string'
      },
      {
        'name': 'chainId',
        'type': 'uint256'
      },
      {
        'name': 'verifyingContract',
        'type': 'address'
      }
    ]" autoSize/></Checkbox>
                        <Checkbox defaultChecked>Mail<TextArea defaultValue="[
      {
        'name': 'from',
        'type': 'Person'
      },
      {
        'name': 'to',
        'type': 'Person[]'
      },
      {
        'name': 'contents',
        'type': 'string'
      }
    ]" autoSize/></Checkbox>
                        <Checkbox defaultChecked>Person<TextArea defaultValue="[
      {
        'name': 'name',
        'type': 'string'
      },
      {
        'name': 'wallets',
        'type': 'address[]'
      }
    ]" autoSize/></Checkbox>
                    </Space></Checkbox>
                    <Checkbox defaultChecked><Input addonBefore="primaryType:" defaultValue="Mail"/></Checkbox>
                    <Checkbox defaultChecked>domain:<Space direction="vertical" className={"spaces"}>
                        <Checkbox defaultChecked><Input addonBefore="chainId:" defaultValue="1"/></Checkbox>
                        <Checkbox defaultChecked><Input addonBefore="name:" defaultValue="Ether Mail"/></Checkbox>
                        <Checkbox defaultChecked><Input addonBefore="verifyingContract:"
                                                        defaultValue="0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"/></Checkbox>
                        <Checkbox defaultChecked><Input addonBefore="version:" defaultValue="1"/></Checkbox>
                    </Space></Checkbox>
                    <Checkbox defaultChecked>message:<Space direction="vertical" className={"spaces"}>
                        <Checkbox defaultChecked>from:<Space direction="vertical" className={"spaces"}>
                            <Checkbox defaultChecked><Input addonBefore="name:" defaultValue="Cow"/></Checkbox>
                            <Checkbox defaultChecked>wallets<TextArea
                                defaultValue="0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
                                autoSize/></Checkbox>
                        </Space></Checkbox>

                        <Checkbox defaultChecked>to:<Space direction="vertical" className={"spaces"}>
                            <Checkbox defaultChecked><Input addonBefore="name:" defaultValue="Bob"/></Checkbox>
                            <Checkbox defaultChecked>wallets<TextArea
                                defaultValue="0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                                autoSize/></Checkbox>
                        </Space></Checkbox>

                        <Checkbox defaultChecked><Input addonBefore="contents:" defaultValue="Hello, Bob!"/></Checkbox>
                    </Space></Checkbox>


                </Space>
                <Space id="parentV4" style={{display: "none"}} direction="vertical" className={"spaces"}>
                    <Checkbox defaultChecked>domain: <Space direction="vertical" className={"spaces"}>
                        <Checkbox defaultChecked><Input addonBefore="chainId:" defaultValue="1"/></Checkbox>
                        <Checkbox defaultChecked><Input addonBefore="name:" defaultValue="Ether Mail"/></Checkbox>
                        <Checkbox defaultChecked><Input addonBefore="verifyingContract:"
                                                        defaultValue="0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"/></Checkbox>
                        <Checkbox defaultChecked><Input addonBefore="version:" defaultValue="1"/></Checkbox>
                    </Space></Checkbox>
                    <Checkbox defaultChecked>message:<Space direction="vertical" className={"spaces"}>
                        <Checkbox defaultChecked><Input addonBefore="contents:" defaultValue="Hello, Bob!"/></Checkbox>
                        <Checkbox defaultChecked>from:<Space direction="vertical" className={"spaces"}>
                            <Checkbox defaultChecked><Input addonBefore="name:" defaultValue="Cow"/></Checkbox>
                            <Checkbox defaultChecked>wallets<TextArea
                                defaultValue="['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF']"
                                autoSize/></Checkbox>
                        </Space></Checkbox>
                        <Checkbox defaultChecked>to:<Space direction="vertical" className={"spaces"}>
                            <Checkbox defaultChecked><Input addonBefore="name:" defaultValue="Bob"/></Checkbox>
                            <Checkbox defaultChecked>wallets<TextArea
                                defaultValue="['0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB', '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57', '0xB0B0b0b0b0b0B000000000000000000000000000']"
                                autoSize/></Checkbox>
                        </Space></Checkbox>
                    </Space></Checkbox>
                    <Checkbox defaultChecked><Input addonBefore="primaryType:" defaultValue="Mail"/></Checkbox>
                    <Checkbox defaultChecked>types:<Space direction="vertical" className={"spaces"}>
                        <Checkbox defaultChecked>EIP712Domain<TextArea defaultValue="[
      {
        'name': 'name',
        'type': 'string'
      },
      {
        'name': 'version',
        'type': 'string'
      },
      {
        'name': 'chainId',
        'type': 'uint256'
      },
      {
        'name': 'verifyingContract',
        'type': 'address'
      }
    ]" autoSize/></Checkbox>
                        <Checkbox defaultChecked>Group<TextArea defaultValue="[
      {
        'name': 'name',
        'type': 'string'
      },
      {
        'name': 'members',
        'type': 'Person[]'
      }
    ]" autoSize/></Checkbox>
                        <Checkbox defaultChecked>Mail<TextArea defaultValue="[
      {
        'name': 'from',
        'type': 'Person'
      },
      {
        'name': 'to',
        'type': 'Person[]'
      },
      {
        'name': 'contents',
        'type': 'string'
      }
    ]" autoSize/></Checkbox>
                        <Checkbox defaultChecked>Person<TextArea defaultValue="[
      {
        'name': 'name',
        'type': 'string'
      },
      {
        'name': 'wallets',
        'type': 'address[]'
      }
    ]" autoSize/></Checkbox>
                    </Space></Checkbox>

                </Space>
                <div style={{padding: "10px"}}>
                    <TextArea id="parentV1" placeholder={"Put here the message params"} autoSize/>
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
