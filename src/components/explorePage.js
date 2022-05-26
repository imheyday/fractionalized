import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";
import {useState, useEffect} from 'react'

const Caver = require('caver-js');
const caver = new Caver(window.klaytn || 'https://public-node-api.klaytnapi.com/v1/baobab');

const factoryABI = require('./contracts-abi/factoryABI.json');
const fractionVaultABI = require('./contracts-abi/fractionVaultABI.json');
const factoryContract = '0x77efcC424477E830d7310B278Dd5bD1B40C29b5c'

function Explore() {

    const [screenState, setScreenState] = useState('')
    const [account, setAccount] = useState('')


    const [allVaults, setVaults] = useState([{
        name:'',
        description:'',
        number:'',
        address:'',
        owner:'',
        supply:'',
        available:'',
        price:'',
        holders:''
    }])

    useEffect(()=>{
       
        async function fetchAllVaults(){

            const factory = new caver.klay.Contract(factoryABI,factoryContract)
            let deployedVaults = await factory.methods.getAllVaults().call()


            deployedVaults.map((async (arg,index) => {
                const child = new caver.klay.Contract(fractionVaultABI, arg)
                let vName = await child.methods.vaultName().call()
                let vInfo = await child.methods.vaultInfo().call()
                let vaultOwner = await child.methods.owner().call()
                let fSupply = await child.methods.fractionSupply().call()
                let fAvailable = await child.methods.availableSupply().call()
                let fPrice = await child.methods.fractionPrice().call()
                let fHolders = await child.methods.fractionHolders().call()

                if(fSupply !== '0'){
                    
                    setVaults(newItem=>[...newItem,
                        {
                            name: vName,
                            description: vInfo,
                            number: index,
                            address: arg,
                            owner: vaultOwner,
                            supply: fSupply,
                            available: fAvailable,
                            price: fPrice,
                            holders: fHolders
                        }
                    ])
                }
            }))
            console.log(allVaults)

        }

        fetchAllVaults()

    },[])

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
            alert('Error Connecting')
        }
    }

    //burn unsold fractions - if all are burned this unlocks the NFT
    async function purchaseFractions(vaultAddr, price){
        let buyAmount = prompt('Enter amount of fractions to buy')
        let toPay = buyAmount * (price/1e18)
        const fromVault = new caver.klay.Contract(fractionVaultABI,vaultAddr)
        try{        
            await fromVault.methods.buyFractions(parseInt(buyAmount)).send({from: account, gas: 15000000, value: caver.utils.toPeb(parseInt(toPay), 'KLAY')})
            alert('Purchase Successful')
        }catch(e){
            console.log(e)
            alert('Purchase Error')
        }
    }

   function displayVaults(){

    let vaults = allVaults.filter((element, index) => {
        return index % 2 === 0;
      })
          
        return(
            vaults.slice(1).reverse().map((arg => 
                <Carousel.Item>
                <Container style={{ 
                    textAlign:'center', 
                    height:'70vh'
                }}>
                    <Card style={{ 
                        width: '70vw', 
                        height: '35rem', 
                        marginLeft:'auto', 
                        marginRight:'auto'
                    }}>
                        <Card.Body >
                        <Card.Text style={{textAlign:'left'}}> Vault#{arg.number}</Card.Text>
                        <Container style={{
                           
                            height:'50vh',
                            overflowY:'scroll'
                        }}>
                            <Row style={{overflowY:'scroll'}}>
                                <Card.Text style={{marginTop:'3vh',marginBottom:'1vh', fontWeight:'bold', fontSize:'30px'}}>{arg.name} </Card.Text>
                                <Card.Text style={{marginTop:'3vh',marginBottom:'1vh'}}>Description: {arg.description} </Card.Text>
                                <Card.Text style={{marginTop:'3vh',marginBottom:'5vh'}}>Address: {arg.address} </Card.Text>
                                <Col>
                                    <Card.Text>Fraction Supply: {arg.supply} </Card.Text>
                                </Col>
                                <Col>
                                    <Card.Text>Fraction Price: {arg.price/1e18} KLAY </Card.Text>
                                </Col>
                                <Row  style={{marginTop:'5vh'}}>
                                     <Col>
                                     <Card.Text>Available Fractions: {arg.available} </Card.Text>
                                     </Col>
                                    <Col>
                                     <Card.Text>Current Holder Count: {arg.holders} </Card.Text>
                                    </Col>
                                   
                                 </Row>
                            </Row>
                            </Container>
                            <Row >
                                <Button style={{backgroundColor:'gray', border:'0px'}} onClick={()=>purchaseFractions(arg.address, arg.price)}>Buy Fractions</Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
                </Carousel.Item>
            ))
        )
    }

    return(
        <Container fluid style={{background:'rgb(190,0,77)', background:'linear-gradient(347deg, rgba(190,0,77,1) 0%, rgba(251,81,8,0.6359223300970873) 55%)', height:'100vh'}}>
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
                          <Link to="/index">
                                  <button style={{ backgroundColor:'transparent',border:'0px', color:'white'}}> Index </button>
                           </Link>
                           </Nav.Link>
                         <Nav.Link>
                        <Link to="/fractionalize">
                                <button style={{ backgroundColor:'transparent',border:'0px', marginRight:'2vw', color:'white'}}> Fractionalize </button>
                         </Link>
                         </Nav.Link>
                        
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Row style={{textAlign:'center', height:'15vh', color:'white'}}>
                <div style={{marginTop:'5vh'}}>
                    <h1>
                        Explore
                    </h1>
                </div>
            </Row>

            <Row>
                <Carousel style={{height:'70vh'}} >
                    {
                        allVaults.length <= 1 ? 

                        <div style={{textAlign:'center', marginTop:'25vh', fontWeight:'bold', color:'white'}}>
                        <p> loading vaults . . .</p>
                        </div>

                        :

                        displayVaults()

                    }       
                </Carousel>
            </Row>
           
        </Container>
     )

}
export default Explore;