import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import {useState, useEffect} from 'react'
import { Link } from "react-router-dom";


async function covalentAPI_transactions(addr, id){
    let apiCall = await axios.get('https://api.covalenthq.com/v1/8271/tokens/'+addr+'/nft_transactions/'+id+'/?&key=ckey_ead838992642469391721432fe5')
    console.log(apiCall)
}
async function covalentAPI_NFTinfo(addr, id){
    let apiCall = await axios.get('https://api.covalenthq.com/v1/8271/tokens/'+addr+'/nft_metadata/'+id+'/?&key=ckey_ead838992642469391721432fe5')
    console.log(apiCall)
}

function IndexerPage(){

    const [account, setAccount] = useState('')
    const [address, setAddress] = useState('');

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

    const addressHandler = (event) => {
            setAddress(event.target.value);
            console.log(event)
        };

    const submitHandler = async (event) => {
        event.preventDefault();
            console.log(address)
            alert('Coming Soon! Covalent API is not yet supported for Baobab Testnet, full compatability will be on mainnet soon')
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
                        <Link to="/explore">
                                <button style={{ backgroundColor:'transparent',border:'0px', color:'white'}} > Gallery </button>
                         </Link>
                         </Nav.Link>
                         <Nav.Link>
                         <Link to="/fractionalized">
                                <button style={{ backgroundColor:'transparent',border:'0px', color:'white'}} > Home </button>
                         </Link>

                        </Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
             <Row style={{marginBottom:'3vh',textAlign:'center', height:'10vh', color:'white'}}>
                <div style={{marginTop:'3vh'}}>
                    <h1>
                       Vault Indexer 
                    </h1>
                </div>
            </Row>

            <Card style={{ 
               width:'80vw',
               height:'65vh',
               marginLeft:'auto',
               marginRight:'auto',
               color:'black',
               textAlign:'center',
               overflowY:'scroll',
               borderRadius:'20px'
            }}>
                <Card.Body>
                    <Card.Title 
                    style={{ 
                    fontSize:'20px',
                    marginTop:'15vh'
                    
                    }}> 
                    Enter Vault Address 
                </Card.Title>
            
                    <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" >
                    <Form.Control 
                        placeholder="address"
                        value={address}
                        onChange={addressHandler}
                    />
                    </Form.Group>
                    </Form>

                   <Card.Text style={{marginTop:'5vh'}}> Perform a query to find more information about a 
                                vault relating to transactions, events, user interactions, and
                                NFT information </Card.Text>
                </Card.Body>
            </Card>
            <Row style={{textAlign:'center', marginTop:'3vh', fontWeight:'bold', color:'white'}}>
                <p> Queries performed with Covalent API </p>
            </Row>
            </Container>
        )
} 
export default IndexerPage;