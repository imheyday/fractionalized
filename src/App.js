import { Routes, Route, Link } from "react-router-dom";
import Home from './components/homePage.js'
import About from './components/aboutPage.js'
import Explore from './components/explorePage.js'
import IndexerPage from './components/indexerPage.js';
import Fractionalize from './components/fractionalizePage.js';

function App() {
 
  return (
  
      <Routes>
        <Route path="/fractionalized" element={<Home/>} />
        <Route path="about" element={<About/>} />
        <Route path="explore" element={<Explore/>} />
        <Route path="index" element={<IndexerPage/>} />
        <Route path="fractionalize" element={<Fractionalize/>} />
      </Routes>
      
  );
}
export default App;
