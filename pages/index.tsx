import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";


const Home = () => {
  const router = useRouter();
  const {data: session, status } = useSession();

  if(status === 'authenticated'){
    router.push('/@me');
  }
  if(status === 'loading'){
    <h1>Loading...</h1>
  }
  if(status === 'unauthenticated') {
   return (
     <div className="grid place-items-center h-screen w-full">
       <div>
         <h1 className="font-bold text-7xl text-blue-button-hover">Discord</h1>
       </div>
       <button className="w-80 font-semibold text-white bg-blue-button px-4 py-2 rounded-[3px] hover:bg-blue-button-hover transition"
       onClick={() => signIn('google')}
       >
         Sign in with Google
       </button>
     </div>
   );
  }

}

export default Home;
