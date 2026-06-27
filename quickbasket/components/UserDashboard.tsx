import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import GroceryItemCard from './GroceryItemCard'
import connectToDB from '@/lib/db'
import Grocery from '@/models/grocery.model'




async function UserDashboard() {
  await connectToDB()

  const grocery = await Grocery.find({}).lean()
  const plaingroceries = JSON.parse(JSON.stringify(grocery))
  return (
    <>
    <HeroSection />
    <CategorySlider />
    <div className='w-[90%] md:w-[80%] mx-auto mt-20'>
      <h2 className='text-2xl md:text-3xl  font-extrabold text-green-700 mb-6 text-center'>Popular Grocery Items</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {plaingroceries.map((item:any) => (
      <GroceryItemCard  key={item._id} item={item} />
    ))}

      </div>
     
    

    </div>
   
    
    </>
  )
}

export default UserDashboard