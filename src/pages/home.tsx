import React from 'react';
import Accounts from '../components/Accounts'
import RecentBlocks from '../components/RecentBlocks'
import './index.css'

const Home = () => {
    return (<>
    <Accounts></Accounts>
    <RecentBlocks></RecentBlocks>
    </>)
}

export default Home