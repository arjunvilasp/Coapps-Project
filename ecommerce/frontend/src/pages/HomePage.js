import React from 'react'
import Header from '../components/Header/Header'
import SubNav from '../components/SubNavbar/SubNav'
import Slider from '../components/Slider/Slider'
import ProductsList from './ProductList'
import Footer from '../components/Footer/Footer'


const HomePage = () => {
  return (
    <div>
    <Header/>
     <SubNav/>
     <Slider/>
     <ProductsList/>
     <Footer/>
    </div>
  )
}

export default HomePage