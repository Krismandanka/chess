import React from 'react'
import chessBoard from "../../public/chessBoard.png"
// import { useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUp, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from 'react-router-dom'

// import chessButton from "../../public/chessButton.jpg"

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className='relative bg-[#302E2B] flex justify-center items-center min-h-screen gap-10  '>
      <div >
        <img className='rounded-lg' src={chessBoard} alt="chessBoard" height={496} width={496} />

      </div>
      <div className=' flex flex-col gap-5 justify-center items-center'>
        <h1 className='text-6xl font-bold text-white'> Play Chess online on the #1 site</h1>
        <div>

        </div>
        <button className='text-white bg-[#5d9948] p-2 rounded-xl flex justify-between items-center gap-2' onClick={() => {
          navigate("/game");
        }}>
          <img src="../../public/chessMove.webp" className='bg-[#5d9948]' alt="Logo" width={36} height={36} />
          <p className='text-2xl font-bold'>Play online</p>
        </button>


        <SignedIn>
          <UserButton afterSignOutUrl='/sign-in' />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
        </SignedOut>





      </div>
    </div>

    // <div className=' bg-[#302E2B] size-full '>

    // </div>
  )
}

export default Landing