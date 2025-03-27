import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import HospitalListWithMap from '../components/HospitalListWithMap'

const Home = () => {
 
  return (
    <div>
      <Header/>
      <SpecialityMenu/>
      <HospitalListWithMap/>
      <TopDoctors/>
      <Banner/>

    </div>
  )
}

export default Home