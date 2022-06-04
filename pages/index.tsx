import { signIn } from "next-auth/react";


const Home = () => {

   return (

     <div className="grid place-items-center h-screen w-full">
       <div>
         <img
           src="https://logos-download.com/wp-content/uploads/2021/01/Discord_Logo-1.png"
           alt="discord logo"
           className="object-contain h-40"
         />
       </div>
       <button className="w-80 font-semibold text-white bg-blue-button px-4 py-2 rounded-[3px] hover:bg-blue-button-hover transition"
       onClick={() => signIn('google', {callbackUrl: `/1`})}
       >
         Sign in with Google
       </button>
     </div>
   );


}

export default Home;
