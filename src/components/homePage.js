import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'


let buttonStyle = {
    color:'white',
    backgroundColor:'transparent',
    border:'0px'
}

function Home() {
    return (
      <Container fluid style={{background:'rgb(190,0,77)', background:'linear-gradient(347deg, rgba(190,0,77,1) 0%, rgba(251,81,8,0.6359223300970873) 55%)', height:'100vh'}}>
      <Navbar  expand="sm" style={{backgroundColor:'transparent'}}>
       <Container style={{textAlign:'center'}}>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link>
              <Link to="/about">
              <button style={buttonStyle}> About </button>
              </Link>
            </Nav.Link>
            <Nav.Link>
               <Link to="/explore">
               <button style={buttonStyle}> Explore </button>
               </Link>
            </Nav.Link>
            <Nav.Link>
               <Link to="/fractionalize">
               <button style={buttonStyle}> Fractionalize </button>
               </Link>
            </Nav.Link>
          </Navbar.Collapse>
      </Container>
      </Navbar>
  
      <Container style={{
        marginTop:'35vh'
      }}>
        <Row style={{
          backgroundColor:'transparent', 
          textAlign:'center',
        }}>
          <h2 style={{fontSize:'35px', color:'white'}}> Fractionalize NFTs  </h2>
          <p  style={{ color:'white'}}> on Klaytn </p>
        </Row>
      </Container>
      </Container>
    );
  }
  
  export default Home;
  
