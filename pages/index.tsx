import type { NextPage } from 'next'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import StateProvider, { initialState, reducer } from '../context/StateProvider'

const Home: NextPage = () => {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <div className="flex h-screen">
        <Sidebar />
        <Chat />
      </div>
    </StateProvider>
  );
}

export default Home
