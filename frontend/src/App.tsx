// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Pages/Landing';
import Game from './Pages/Game';
// import { ClerkProvider, ClerkProviderProps } from '@clerk/clerk-react'
import ClearkPro from './ClearkPro';
// const frontendApin= process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
import SignInPage from './Components/SignInPage';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <ClearkPro>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/game' element={<Game />} />
            <Route path='/sign-in' element={<SignInPage />} />


          </Routes>
        </BrowserRouter>


    </ClearkPro>

    
    
    
      
    </>
  )
}

export default App
