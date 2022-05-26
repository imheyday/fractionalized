import {useState, useEffect} from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import CloseButton from 'react-bootstrap/CloseButton'
import Button from 'react-bootstrap/Button'
import factoryBinary from './contracts-abi/factoryBinary.js'
import fractionVaultBinary from './contracts-abi/fractionVaultBinary'
import { Link } from "react-router-dom";

const Caver = require('caver-js');
const caver = new Caver(window.klaytn);

const factoryABI = require('./contracts-abi/factoryABI.json');
const fractionVaultABI = require('./contracts-abi/fractionVaultABI.json');
const factoryContract = '0x77efcC424477E830d7310B278Dd5bD1B40C29b5c'

function Fractionalize(){
 
    const [screenState, setScreenState] = useState('')
    const [account, setAccount] = useState('')
    const [newVault, newVaultReceipt] = useState('')
    const [newNFT, newNFTReceipt] = useState('')
    const [newBurn, newBurnReceipt] = useState('')
    const [newNFTWithdraw, newWithdrawReceipt] = useState('')

    const [newTransaction, setReceipt] = useState('')

    useEffect(()=>{
        try{
            if(window.klaytn.selectedAddress.length !== 0){
                setAccount(window.klaytn.selectedAddress)
            }
        } catch(e){
            console.log('kaikas not active, login with extension')
        }
    },[])

    // Kaikas extension must be installed and unlocked before calling
    async function login(){
        try {
                let address = await window.klaytn.enable()
                setAccount(address[0])
                console.log('logged in as:', account)
            } catch(e){
            alert('ERROR: Login Failed')
        }
    }

    // creates a fractionalization vault for the connected kaikas account
    async function createVault() {
        let vName = prompt('Enter a public name for the vault')
        let vInfo = prompt('Enter a short description for the vault')
        const factory = new caver.klay.Contract(factoryABI,factoryContract)
        try{
            let vault = await factory.methods.createFractionVault(vName, vInfo).send({from: account, gas: 15000000});
            setReceipt(vault)

        }catch(e){
            console.log(e)
        }
    }

     // mints a native KIP-37 NFT to be fractionalized using connected kaikas account 
     async function mintAndFractionalize(arg) {
        let uri = prompt('Enter URI or IPFS Link')
        let supply = prompt('Enter total supply of fractions to mint from NFT')
        let price = prompt('Enter a price per fraction (in KLAY)')
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{
            // Minting NFT with 100 fractions at 5 KLAY each 
            let result = await myVault.methods.fractionalizeNative(uri, parseInt(supply), parseInt(price)).send({from: account, gas: 15000000});
            setReceipt(result)
        } catch(e){
            console.log(e)
        }
    }

    async function importAndFractionalize(arg){
        let addr = prompt('Enter address of NFT sent to Vault')
        let supply = prompt('Enter total supply of fractions to mint from NFT')
        let price = prompt('Enter a price per fraction (in KLAY')
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{
            // Minting NFT with 100 fractions at 5 KLAY each 
            let result = await myVault.methods.fractionalizeImport(addr, parseInt(supply), parseInt(price)).send({from: account, gas: 15000000});
            setReceipt(result)
        } catch(e){
            console.log(e)
        }
    }

    // burn unsold fractions - if all are burned this unlocks the NFT
    async function burnSomeFractions(arg){
        let burnAmount = prompt('Enter amount of tokens to burn')
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{        
            let result = await myVault.methods.burnFractions(parseInt(burnAmount)).send({from: account, gas: 15000000})
            setReceipt(result)

        }catch(e){
            console.log(e)
        }
    }

    async function changePrice(arg){
        let price = prompt('Enter new price per token in KLAY')
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{        
            let result = await myVault.methods.changeFractionPrice(parseInt(price)).send({from: account, gas: 15000000})
            setReceipt(result)

        }catch(e){
            console.log(e)
        }
    }

    // collect all KLAY made from fractions sales
    async function collectRevenue(arg){
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{        
            let result = await myVault.methods.collectFunds().send({from: account, gas: 15000000})
            setReceipt(result)

        }catch(e){
            console.log(e)
        }
    }
    async function changeName(arg){
        let newName = prompt('Enter a new public name for your vault')
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{        
            let result = await myVault.methods.changeVaultName(newName).send({from: account, gas: 15000000})
            setReceipt(result)

        }catch(e){
            console.log(e)
        }
    }
     async function changeDescription(arg){
        let newDescription = prompt('Enter a new public description for your vault')
        const myVault = new caver.klay.Contract(fractionVaultABI,arg)
        try{        
            let result = await myVault.methods.changeVaultInfo(newDescription).send({from: account, gas: 15000000})
            setReceipt(result)

        }catch(e){
            console.log(e)
        }
    }

    async function withdrawNFT(arg){
        try{        
            let nftType = prompt('Enter `native` for NFT minted inside vault or `import` for KIP-17 NFT deposited to vault')
            const myVault = new caver.klay.Contract(fractionVaultABI,arg)
            if(nftType === 'native'){
                let result = await myVault.methods.withdrawNative(window.klaytn.selectedAddress, 0, 1).send({from: window.klaytn.selectedAddress, gas: 15000000})
                setReceipt(result)
            } else if(nftType == 'import') {
                let addr = prompt('Enter NFT address to withdraw')
                let id = prompt('Enter id of NFT ')
                let result = await myVault.methods.withdrawImported(addr,window.klaytn.selectedAddress,id).send({from: window.klaytn.selectedAddress, gas: 15000000})
                setReceipt(result)
            } else{
                throw(new Error('invalid input'))
            }
        }catch(e){
            console.log(e)
        }
    }

    // used for the following two Display/Interact components
    const [curVault, setCurVault] = useState('')

    // displays all user deployed vaults 
    function DisplayMyVaults() {

        const [myVaults, setMyVaults] = useState([]);

        useEffect(()=>{
            async function getVaults() {
                try{
                    const factory = new caver.klay.Contract(factoryABI,factoryContract)
                    let myVaults = await factory.methods.getAllUserVaults(account).call()
                    setMyVaults(myVaults)
                } catch(e){
                    console.log('trouble fetching vaults')
                }
            }
            getVaults()
        },[newVault])


       function setAssetState(arg, arg2){
            setScreenState(arg)
            setCurVault(arg2)
        }
        
        return(
            myVaults.length === 0 ?

            <div style={{marginTop:'20vh'}}>
                <p> No Vaults Created Yet </p>
            </div>

            :

           [...myVaults].reverse().map((arg)=>
                <div style={{marginBottom:'20px'}}>
                    <Row>
                        <Col style={{textAlign:'left'}}>
                             <p>{arg}</p>
                        </Col>
                        <Col style={{textAlign:'right'}}>
                            <Button style={{backgroundColor:'gray', border:'0px'}} onClick={()=>setAssetState('View', arg)}>View</Button>
                        </Col>
                     </Row>
                     <hr></hr>
                </div>
           )
        )
    }

    // component with functions for interacting with a selected user vault 
    function VaultInteract(){

        const [vaultSpecs, setVaultSpecs] = useState({
            name:'',
            info:'',
            isActive:'0',
            fractions:'',
            fPrice:'',
            holders:''
        })
       
        useEffect(()=>{
            const checkSpecs = async () => {
                try{
                    const vaultContract = new caver.klay.Contract(fractionVaultABI,curVault)
                    let vName = await vaultContract.methods.vaultName().call()
                    let vInfo = await vaultContract.methods.vaultInfo().call()
                    let nftCheck = await vaultContract.methods.balanceOf(curVault,'0').call()
                    let totalFractions = await vaultContract.methods.fractionSupply().call()
                    let fractionPrice = await vaultContract.methods.fractionPrice().call()
                    let holderCount = await vaultContract.methods.fractionHolders().call()
                    setVaultSpecs({
                        name:vName,
                        info:vInfo,
                        isActive:nftCheck,
                        fractions:totalFractions,
                        fPrice:fractionPrice,
                        holders:holderCount
                    })
                } catch(error) {
                    console.log(error.message);
                }
              };
              checkSpecs()
        },[newTransaction])

        return(
            <Container style={{textAlign:'left' }}>
              <CloseButton  onClick={()=>setScreenState('')}/>
              <Row style={{textAlign:'center' }}>
                 <p style={{fontSize:'25px'}}> Vault Information</p>
                 <p> Name: {vaultSpecs.name}</p>
                 <p> Description: {vaultSpecs.info}</p>
                 <p> Address: {curVault}</p>

              </Row>
              <Row style={{backgroundColor:'white' }}> 
                {
                    vaultSpecs.isActive === '0' ?

                    <div style={{textAlign:'center', marginTop:'5vh'}}>
                        <p> No NFT in Vault </p>
                        <Button style={{backgroundColor:'gray', border:'0px', margin:'5px 5px'}} onClick={()=>mintAndFractionalize(curVault)}> Mint </Button>
                        <Button style={{backgroundColor:'gray', border:'0px', margin:'5px 5px'}} onClick={()=>importAndFractionalize(curVault)}> Import </Button>
                    </div>

                    :
                    
                    <Row style={{textAlign:'center'}}>
                        <p> Total Fractions: {vaultSpecs.fractions} </p>
                        <p> Price per Fraction: {vaultSpecs.fPrice/1e18} KLAY</p>
                        <p> Holders: {vaultSpecs.holders} </p>
                        <div>
                        <Button style={{backgroundColor:'gray', border:'0px', margin:'5px 5px'}} onClick={()=>burnSomeFractions(curVault)}> Burn Fractions </Button>
                        <Button style={{backgroundColor:'gray', border:'0px', margin:'5px 5px'}} onClick={()=>changePrice(curVault)}> Change Fraction Price </Button>
                        <Button style={{backgroundColor:'green', border:'0px', margin:'5px 5px'}} onClick={()=>collectRevenue(curVault)}> Collect Revenue </Button>
                        <Button style={{backgroundColor:'gray', border:'0px', margin:'5px 5px'}} onClick={()=>changeName(curVault)}> Change Vault Name </Button>
                        <Button style={{backgroundColor:'gray', border:'0px', margin:'5px 5px'}} onClick={()=>changeDescription(curVault)}> Change Vault Description </Button>

                        {
                            vaultSpecs.fractions == 0 ?
                            <Button style={{backgroundColor:'red', border:'0px', margin:'5px 5px'}} onClick={()=>withdrawNFT(curVault)}> Withdraw NFT </Button>
                            :
                            null
                        }   
                        </div>
                    </Row>
                }
             </Row>
            </Container>
        )
    }

    function MainScreen(){
        return (
                account === '' ?
                <div style={{textAlign:'center', marginTop:'20vh'}}>
                   <p> Connect Account to get Started</p>
                </div>
                :
                <DisplayMyVaults/>
        )
    }

    // conditionally renderd screen components
    function ScreenViewState(){
        if(screenState === ''){
            return <MainScreen/>
        }
        else if(screenState === 'View'){
            return <VaultInteract/>
        }
    }

    return(
       <Container fluid style={{height:'100vh', background:'rgb(190,0,77)', background:'linear-gradient(347deg, rgba(190,0,77,1) 0%, rgba(251,81,8,0.6359223300970873) 55%)'}}>

            <Navbar expand="sm">
                <Container style={{textAlign:'center'}}>
                    <Navbar.Toggle />
                    <Navbar.Collapse >
                        <Nav.Link>
                            {
                                account === '' ? 
                                <button onClick={login} style={{backgroundColor:'transparent', border:'0px', color:'white'}}> Connect </button>
                                :
                                <button style={{backgroundColor:'transparent', border:'0px', color:'white'}}>  {account.substring(0,6)+'...'+account.substring(38, 42)} </button>
                            }
                        </Nav.Link>
                        <Nav.Link>
                        <Link to="/fractionalized">
                            <button style={{ backgroundColor:'transparent',border:'0px', color:'white'}}> Home </button>
                        </Link>
                        </Nav.Link>
                        <Nav.Link>
                        <Link to="/explore">
                            <button style={{ backgroundColor:'transparent',border:'0px', color:'white'}}> Explore </button>
                        </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <button onClick={createVault} style={{ backgroundColor:'transparent',border:'0px', color:'white'}}> Create Vault </button>
                        </Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Row style={{marginTop:'5vh', marginBottom:'2vh', marginRight:'10vw', color:'white', textAlign:'right'}}>
               
                 <h3> My Vaults</h3>
              
            </Row>

            <Container style={{
                backgroundColor:'white',
                borderRadius:'30px',
                padding:'20px',
                width:'90vw',
                height:'60vh',
                textAlign:'right',
                overflowY:'scroll'
            }}>
                <Row style={{textAlign:'center', marginTop:'20px'}}>
                    <ScreenViewState/>
                </Row>
            </Container>
            
            <Container style={{
                marginTop:'8vh',
                textAlign:'right',
                
            }}>
                <Row style={{textAlign:'left'}}>
                    <p style={{fontSize:'15px', color:'white'}}> Beta Version 1 </p>
                </Row>
            </Container>

       </Container>
    )
}
export default Fractionalize;


 /* deploys a factory contract to create vaults (not used in UI)
    async function createFactory(){

        const myContract = new caver.klay.Contract(factoryABI)

        await caver.klay.sendTransaction({
            type: 'SMART_CONTRACT_DEPLOY',
            data: factoryBinary, //compiled bytecode
            from: window.klaytn.selectedAddress,
            value: caver.utils.toPeb('0', 'KLAY'),
            gas: 15000000, 
          })
          .once('transactionHash', transactionHash => {
            console.log('txHash', transactionHash)
          })
          .once('receipt', receipt => {
            console.log('receipt', receipt)
          })
          .once('error', error => {
            console.log('error', error)
          })
}
*/