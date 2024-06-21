import React from "react";
import { useState } from "react";
import { CHAT_MESSAGE } from "../Constants";
import { Dice1 } from "lucide-react";
interface IResult {


    isOpp: boolean;
    message: string;


}
const Chat = ({ socket, chatMessages }: {
    socket: WebSocket;
    chatMessages: IResult[]

}) => {

    console.log("chat messsssssssssssss", chatMessages);

    const [mess, setMess] = useState<string>("");
    const [chatBool, setChatBool] = useState<boolean>(false);
    console.log("majjjjjjjjjjjjjjj", mess);
    const handleSubmit = (event: any) => {

        event.preventDefault();
        socket.send(
            JSON.stringify({
                type: CHAT_MESSAGE,
                payload: { mess },
            })
        );


        console.log("submit,", mess);
        setMess("");

    }


    return (
        <div className="">
            <button
                className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
                type="button"
                aria-haspopup="dialog"
                aria-expanded="false"
                data-state="closed"
                onClick={() => {
                    setChatBool(!chatBool);
                }}
            >
                <svg
                    xmlns=" http://www.w3.org/2000/svg"
                    width="30"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white block border-gray-200 align-middle"
                >
                    <path
                        d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
                        className="border-gray-200"
                    ></path>
                </svg>
            </button>

            {chatBool && (
                <div className=" fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6  border border-[#e5e7eb] w-[440px] h-[634px] [box-shadow:0_0_#0000,_0_0_#0000,_0_1px_2px_0_rgb(0_0_0_/_0.05)] rounded-2xl">
                    <div className="flex flex-col space-y-1.5 pb-6">
                        <h2 className="font-semibold text-lg tracking-tight">Chessbot</h2>
                        <p className="text-sm text-[#6b7280] leading-3">Powered by Kris</p>
                    </div>

                    <div className="h-[474px] overflow-y-auto pr-4">



                        {
                            chatMessages.map((chat, index) => {
                                return (
                                    chat.isOpp ? (
                                        <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                                            <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                                                <div className="rounded-full bg-gray-100 border p-1">
                                                    <svg
                                                        stroke="none"
                                                        fill="black"
                                                        strokeWidth="1.5"
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                        height="20"
                                                        width="20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </span>
                                            <p className="leading-relaxed">
                                                <span className="block font-bold text-gray-700">AI </span>Sorry,
                                                {chat.message}
                                            </p>
                                        </div>
                                    ) :
                                        (
                                            <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                                                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                                                    <div className="rounded-full bg-gray-100 border p-1">
                                                        <svg
                                                            stroke="none"
                                                            fill="black"
                                                            strokeWidth="0"
                                                            viewBox="0 0 16 16"
                                                            height="20"
                                                            width="20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                                                        </svg>
                                                    </div>
                                                </span>
                                                <p className="leading-relaxed">
                                                    <span className="block font-bold text-gray-700">You </span>
                                                    {chat.message}
                                                </p>
                                            </div>
                                        )
                                )
                            })
                        }



                        {/* <!--  User Chat Message --> */}









                        {/* dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        Style your web text with this online font CSS generator. Set the desired style for your text in the control panel and get your code instantly.

                        Finding the correct line to declare a CSS font is not always the easiest thing that is in top of people's head. Here you can easily choose a web-safe font from the dropdown, increase the font size, set the letter and word spacing. Adjust the color, font-weight, decoration, font-style, variant and the transform.
                        When the preview is close to your objective, send the code to the interactive editor for manual adjustments. Please note that the text might look slightly differently on a live website that has a different .ccs file.
                        Style your web text with this online font CSS generator. Set the desired style for your text in the control panel and get your code instantly.

                        Finding the correct line to declare a CSS font is not always the easiest thing that is in top of people's head. Here you can easily choose a web-safe font from the dropdown, increase the font size, set the letter and word spacing. Adjust the color, font-weight, decoration, font-style, variant and the transform.
                        When the preview is close to your objective, send the code to the interactive editor for manual adjustments. Please note that the text might look slightly differently on a live website that has a different .ccs file. */}
                    </div>


                    {/* <!-- Input box  --> */}
                    <div className="flex items-center pt-0">
                        <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSubmit}>
                            <input
                                className="flex h-10 w-full  border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2 rounded-2xl"
                                placeholder="Type your message"
                                type="text"
                                value={mess}
                                onChange={(e) => setMess(e.target.value)}
                            />
                            <button className="inline-flex items-center justify-center  text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2 rounded-2xl" type="submit">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;


// <div className="pr-4 max-h-[474px] min-w-full table  ">
//                         {/* <!-- Chat Message AI --> */}
//                         <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
//                             <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//                                 <div className="rounded-full bg-gray-100 border p-1">
//                                     <svg
//                                         stroke="none"
//                                         fill="black"
//                                         stroke-width="1.5"
//                                         viewBox="0 0 24 24"
//                                         aria-hidden="true"
//                                         height="20"
//                                         width="20"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path
//                                             stroke-linecap="round"
//                                             stroke-linejoin="round"
//                                             d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
//                                         ></path>
//                                     </svg>
//                                 </div>
//                             </span>
//                             <p className="leading-relaxed">
//                                 <span className="block font-bold text-gray-700">AI </span>Hi,
//                                 how can I help you today?
//                             </p>
//                         </div>

//                         {/* <!--  User Chat Message --> */}
//                         <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
//                             <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//                                 <div className="rounded-full bg-gray-100 border p-1">
//                                     <svg
//                                         stroke="none"
//                                         fill="black"
//                                         stroke-width="0"
//                                         viewBox="0 0 16 16"
//                                         height="20"
//                                         width="20"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
//                                     </svg>
//                                 </div>
//                             </span>
//                             <p className="leading-relaxed">
//                                 <span className="block font-bold text-gray-700">You </span>
//                                 fewafef
//                             </p>
//                         </div>
//                         {/* <!-- Ai Chat Message  --> */}
//                         <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
//                             <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//                                 <div className="rounded-full bg-gray-100 border p-1">
//                                     <svg
//                                         stroke="none"
//                                         fill="black"
//                                         stroke-width="1.5"
//                                         viewBox="0 0 24 24"
//                                         aria-hidden="true"
//                                         height="20"
//                                         width="20"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path
//                                             stroke-linecap="round"
//                                             stroke-linejoin="round"
//                                             d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
//                                         ></path>
//                                     </svg>
//                                 </div>
//                             </span>
//                             <p className="leading-relaxed">
//                                 <span className="block font-bold text-gray-700">AI </span>Sorry,
//                                 I couldn't find any information in the documentation about that.
//                                 Expect answer to be less accurateI could not find the answer to
//                                 this in the verified sources.
//                             </p>
//                         </div>
//                         <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
//                             <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//                                 <div className="rounded-full bg-gray-100 border p-1">
//                                     <svg
//                                         stroke="none"
//                                         fill="black"
//                                         stroke-width="0"
//                                         viewBox="0 0 16 16"
//                                         height="20"
//                                         width="20"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
//                                     </svg>
//                                 </div>
//                             </span>
//                             <p className="leading-relaxed">
//                                 <span className="block font-bold text-gray-700">You </span>
//                                 fewafef
//                             </p>
//                         </div>
//                         <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
//                             <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//                                 <div className="rounded-full bg-gray-100 border p-1">
//                                     <svg
//                                         stroke="none"
//                                         fill="black"
//                                         stroke-width="1.5"
//                                         viewBox="0 0 24 24"
//                                         aria-hidden="true"
//                                         height="20"
//                                         width="20"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path
//                                             stroke-linecap="round"
//                                             stroke-linejoin="round"
//                                             d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
//                                         ></path>
//                                     </svg>
//                                 </div>
//                             </span>
//                             <p className="leading-relaxed">
//                                 <span className="block font-bold text-gray-700">AI </span>Sorry,
//                                 I couldn't find any information in the documentation about that.
//                                 Expect answer to be less accurateI could not find the answer to
//                                 this in the verified sources.
//                             </p>
//                         </div>




//                     </div>