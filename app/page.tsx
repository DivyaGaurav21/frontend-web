import React from 'react'
import ProductCarousel from './component/ProductCarousel'
import ProductList from './component/ProductList'
import CateogaryItem from './component/CateogaryItem'

const page = () => {
  return (
    <div>
      <ProductCarousel/>
      <ProductList/>
      <CateogaryItem/>
    </div>
  )
}

export default page