// import React from 'react'
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { apiConnector } from '../services/apiconnector';
const GameArchieList = () => {
    const { user } = useUser();
    console.log("user", user?.emailAddresses[0].emailAddress)
    const { isLoaded } = useUser();
    const navigate = useNavigate();
    // const { isSignedIn } = useUser();
    const [email, setEmail] = useState<string>();
    const [whiteGames, setWhiteGames] = useState<any>([]);
    const [blackGames, setBlackGames] = useState<any>([]);


    // setEmail(user?.emailAddresses[0].emailAddress);


    // const { gameId } = useParams();
    //   console.log("gameif", user?.emailAddresses[0].emailAddress);



    // if (!user) {
    //     setTimeout(() => {
    //         console.log("Delayed for 1 second.");
    //     }, 2000);

    // }


    useEffect(() => {



        ArchiGameHistory();

    }, [user?.emailAddresses[0].emailAddress])

    const ArchiGameHistory = async () => {
        // if (user?.emailAddresses[0].emailAddress === undefined) {

        //     return <div>
        //         Email loading
        //     </div>
        // }
        // const email = user?.emailAddresses[0].emailAddress;
        // 
        console.log("email", email)
        const games = await axios(`http://localhost:4000/gamehistory/${user?.emailAddresses[0].emailAddress}`);

        setWhiteGames(games.data.gameWhite);
        setBlackGames(games.data.gameBlack);

        console.log("gaem as white", whiteGames);
        console.log("game as black", blackGames);



    }
    if (user === undefined) {
        return <div>
            userUndef
        </div>
    }




    if (!isLoaded) {
        // Handle loading state however you like
        return <div>Loading</div>;
    }
    if (user?.emailAddresses[0].emailAddress === undefined) {
        return <div>
            Email loading
        </div>
    }


    return (
        <div className='relative bg-[#302E2B] flex justify-center  min-h-screen gap-10 text-white pt-9'>

            <div className='flex flex-col h-full gap-6 '>
                <div className='text-2xl'>
                    gameaswhite
                </div>
                <div className='flex flex-col h-full gap-3'>
                    {
                        whiteGames && whiteGames.length > 0 && whiteGames.map((gameId: any, index: number) => {

                            return (<div className='' key={index} onClick={() => { navigate(`/pregame/${gameId}`) }}>
                                {gameId}
                            </div>)
                        })
                    }
                </div>

            </div>
            <div className='flex flex-col gap-6'>
                <div className='text-2xl'>
                    gameasBlack
                </div>
                <div className='flex flex-col gap-3'>
                    {

                        blackGames && blackGames.length > 0 && blackGames.map((gameId: any, index: number) => {
                            return (<div className='' key={index} onClick={() => { navigate(`/pregame/${gameId}`) }}>
                                {gameId}
                            </div>)
                        })
                    }
                </div>

            </div>

        </div>
    )
}

export default GameArchieList

// <div className='flex justify-between p-6 gap-5 w-screen min-h-screen'>

// <div className='flex flex-col h-full'>
//     <div>
//         gameaswhite {whiteGames}
//     </div>
//     <div className='flex flex-col h-full'>
//         {
//             whiteGames && whiteGames.lenrth > 0 && whiteGames.map((gameId: any, index: number) => {

//                 return (<div className='' key={index} >
//                     {gameId}
//                 </div>)
//             })
//         }
//     </div>

// </div>
// <div className='flex flex-col'>
//     <div>
//         gameasBlack
//     </div>
//     <div className='flex flex-col'>
//         {

//             blackGames && blackGames.length > 0 && blackGames.map((gameId: any, index: number) => {
//                 return (<div className='' key={index}>
//                     {gameId}
//                 </div>)
//             })
//         }
//     </div>

// </div>

// </div>