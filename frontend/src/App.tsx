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
import { RecoilRoot } from 'recoil';
import SignUpPage from './Components/SignUpPage';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ClearkPro>
            <Routes>

              <Route path='/' element={<Landing />} />
              <Route path='/game/:gameId' element={<Game />} />
              <Route path='/sign-in' element={<SignInPage />} />
              <Route path='/sign-up' element={<SignUpPage />} />





            </Routes>
          </ClearkPro>
        </BrowserRouter>


      </RecoilRoot>






    </>
  )
}

export default App
