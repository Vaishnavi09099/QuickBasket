import React from 'react'
import connectDB from '@/lib/db';
import { auth } from '@/auth';
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import EditRoleMobile from '@/components/EditRoleMobile';
import Navbar from '@/components/Navbar';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import DeliveryBoy from '@/components/DeliveryBoy';
import HeroSection from '@/components/HeroSection';
import GeoUpdater from '@/components/GeoUpdater';



const EditRolePage = async () => {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id);

  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");

  if (inComplete) {
    // Render the client component which handles role selection and mobile input
    return <EditRoleMobile />;
  }

  const plainText = JSON.parse(JSON.stringify(user))
  return (
    <>
      <Navbar user={plainText}/> 
      <GeoUpdater userId={plainText._id} />
     
    {user.role == "user" ? (
      <UserDashboard /> 
    ) : user.role=="admin"? (<AdminDashboard />) : <DeliveryBoy /> 
  
    }
    </>
  )
};

export default EditRolePage