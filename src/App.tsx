import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Home from './Pages/Home';
import NewGame from './Pages/NewGame';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className=" w-[90%] h-full m-auto pt-8 bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newGame" element={<NewGame />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
