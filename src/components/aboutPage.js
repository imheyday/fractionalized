import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

function About(){
    return(
        <Container fluid style={{height:'100vh',color:'white', overflowY:'scroll', background:'rgb(190,0,77)', background:'linear-gradient(347deg, rgba(190,0,77,1) 0%, rgba(251,81,8,0.6359223300970873) 55%)'}}>
            <Container>
            <Row style={{textAlign:'center', marginBottom:'5vh', height:'20vh'}}>
                <div style={{marginTop:'10vh'}}>
                    <h1> About </h1>
                </div>
            </Row>
            <Row style={{marginBottom:'5vh'}}>
                <p> Fractionalizing an NFT involves locking it inside of a vault where an arbitrary number of tokens 
                    are minted as a pegged 'fraction' representing it. This project will provide a palce for anyone 
                    to fractionalize their NFTs, to showcase and sell, while the underlying contracts will be 
                    open-source for developers or creators to use in their own projects. The opportunities that come 
                    with fractionalizing involve new ways of interacting with an NFT in a manner which can prove to 
                    be more fun, engaging, and profitable for everyone involved. </p>
            </Row>
            <Row style={{marginBottom:'5vh'}}>
                <h2> How do I get started? </h2>
                <p> 
                    To interact with the project you will need to be using Chrome web browser with the Kaikas extension installed. 
                </p>
                <a href="https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi?hl=en"> 
                Link to Kaikas extension here
                </a>
            </Row>
            <Row style={{marginBottom:'30vh'}}>
                <h2> How does an NFT vault work? </h2>
                <p style={{fontWeight:'bold'}}> Minting Fractions </p>
                <p> To begin creating fractions, a single NFT must be present inside of a vault. Deploying a vault is simple and only requires 
                    a minimal gas fee in KLAY. Then you will have the option of either importing an existing NFT (KIP-47 or KIP-17), which would 
                    involve sending it to the newly created vault address, or a brand new NFT can be minted inside of the vault to be fractioned. 
                    Upon doing so you will be given a choice on what the total supply of fractions created from the NFT will be, there is no lower 
                    or upper bound to this number, but it can only be defined once. You will also need to define a price-per-fraction that users will
                    pay when making a purchase from your vault. This amount can be changed any number of times after the contract is deployed. Other 
                    variables that can be changed include the public name and description for the vault.  </p>

                <p style={{fontWeight:'bold'}}> Withdrawing NFT </p>
                <p>Once fractions are minted from an NFT it is to remain locked inside the vault, since it will be considered 'fractioned'. At this 
                    point the owner will have the option of burning fractions that haven't been sold in order to reduce the total amount in circulation. 
                    If all the fractions that were initially minted are burned, then this will unlock the NFT where it can safely be withdrawn from the 
                    vault. However if a single fraction is purchased, then the NFT would remain permenantly locked inside the vault unless the fraction 
                    was returned by the buyer.  </p> 

                <p> Note: Locking the NFT when fractions are minted maintains the integrity of the vault, including buyers who have purchased any fractions. If the NFT 
                    were to be withdrawn with fractions still in circulation, then it would be similar to diluting or even rug-pulling a tokens supply, the entire thing would become useless.
                </p>

                <p style={{fontWeight:'bold'}}> Purchasing Fractions </p>
                <p> Fractions available for sale can be found in the gallery at the 'Explore' section of the site. Once purchased the possabilities
                    of what one can do with fractions are entirely up to the user. Possible use cases, as well as potential future upgrades to the project, can include additional liquidity mechanisms such
                    as fraction pooling and swapping. As well as social/interaction mechanisms involving fractions and the NFTs they are derived from. 
                </p>
            </Row>
            </Container>
        </Container>
    )
}
export default About;