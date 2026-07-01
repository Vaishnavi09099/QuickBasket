'use client'
import { getSocket } from '@/lib/socket'
import { IDeliveryAssignment } from '@/models/deliveryAssignment.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { resolveSoa } from 'dns'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LiveMap from './LiveMap'
import DeliveryChat from './DeliveryChat'
import { div } from 'motion/react-client'
import { CheckCircle, Loader, MapPin } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ILocation {
  latitude: number,
  longitude: number
}
function DeliveryBoyDashboard({earning}:{earning:number}) {
  const [assignments, setAssignments] = useState<any[]>([])
  const { userData } = useSelector((state: RootState) => state.user)
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [showOtpBox,setShowOtpBox]=useState(false)
  const [otpError,setOtpError]=useState("")
  const [sendOtpLoading,setSendOtpLoading]=useState(false)
  const [verifyOtpLoading,setVerifyOtpLoading]=useState(false)
  const [otp,setOtp]=useState("")
  const [userLocation, setUserLocation] = useState<ILocation>(
    {
      latitude: 0,
      longitude: 0
    }
  )
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0
  })
  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const socket = getSocket()
    if (!userData?._id) return
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setDeliveryBoyLocation({
        latitude: lat,
        longitude: lon
      })
      socket.emit("update-location", {
        userId: userData?._id,
        latitude: lat,
        longitude: lon
      })
    }, (err) => {
      console.log(err)
    }, { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)
  }, [userData?._id])

  useEffect((): any => {
    const socket = getSocket()

    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment])
    })
    return () => socket.off("new-assignment")
  }, [])

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
      fetchCurrentOrder()
    } catch (error) {
    console.log(error)
    }
  }


  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order")
      if (result.data.active) {
        setActiveOrder(result.data.assignment)
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude
        })
      }

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(():any=>{
const socket=getSocket()
socket.on("update-deliveryBoy-location",({userId,location})=>{
  setDeliveryBoyLocation({
    latitude:location.coordinates[1],
    longitude:location.coordinates[0]
  })
})
return ()=>socket.off("update-deliveryBoy-location")
  },[])




  useEffect(() => {
    fetchCurrentOrder()
    fetchAssignments()
  }, [userData])


const sendOtp=async ()=>{
  setSendOtpLoading(true)
  try {
    const result=await axios.post("/api/delivery/otp/send",{orderId:activeOrder.order._id})
    console.log(result.data)
    setShowOtpBox(true)
    setSendOtpLoading(false)
  } catch (error) {
    console.log(error)
    setSendOtpLoading(false)
  }
}

const verifyOtp=async ()=>{
  setVerifyOtpLoading(true)
  try {
    const result=await axios.post("/api/delivery/otp/verify",{orderId:activeOrder.order._id,otp})
    console.log(result.data)
    setActiveOrder(null)
setVerifyOtpLoading(false)
await fetchCurrentOrder()
window.location.reload()
  } catch (error) {
   setOtpError("Otp Verification Error")
   console.log(error)
   setVerifyOtpLoading(false)
  }
}

if (!activeOrder && assignments.length === 0) {

  const todayEarning = [
    {
      name: "Today",
      earnings: earning,
      deliveries: Math.round(earning / 40)
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-6'>
      <div className='max-w-md w-full text-center'>

       
        <h2 className='font-serif text-3xl font-bold text-emerald-950 mt-5'>No Active Deliveries 🚛</h2>
        <p className='text-gray-500 mt-2 mb-8'>Stay online to receive new orders</p>

        <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6'>
          <h3 className='font-serif text-xl font-bold text-gray-900 mb-1'>Today's Performance</h3>
          <p className='text-xs text-gray-500 mb-6'>Earnings & deliveries snapshot</p>

           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={todayEarning}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" name="Earnings (₹)" fill="#16A34A" />
              <Bar dataKey="deliveries" name="Deliveries" fill="#4ADE80" />
            </BarChart>
          </ResponsiveContainer>
          <div className='mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5'>
            <p className='text-xs font-semibold text-emerald-700 tracking-wide uppercase mb-1'>Earned Today</p>
            <p className=' text-3xl font-bold text-emerald-950'>₹{earning || 0}</p>
          </div>

          <button
            className='mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors'
            onClick={() => window.location.reload()}
          >
            Refresh Earning
          </button>
        </div>

      </div>
    </div>
  )
}

if (activeOrder && userLocation) {
    return (
      <div className='p-4 pt-[40px] min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto'>

          <div className='flex items-center justify-between mb-1'>
            <h1 className='text-2xl font-bold text-green-700'>Active Delivery</h1>
            <span className='flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
              On the way
            </span>
          </div>
          <p className='text-gray-500 text-sm mb-6'>Order #{activeOrder.order._id.slice(-6)}</p>

          <div className='rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>

          <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id?.toString()!} />

          <div className='mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>

            {activeOrder.order.deliveryOtpVerification ? (
              <div className='flex flex-col items-center text-center py-4'>
                <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3'>
                  <CheckCircle size={24} className='text-green-600' />
                </div>
                <p className='text-green-700 font-bold text-lg'>Delivery completed!</p>
                <p className='text-gray-400 text-sm mt-1'>Great job, this order is closed.</p>
              </div>
            ) : (
              <>
                {!showOtpBox && (
                  <button
                    onClick={sendOtp}
                    disabled={sendOtpLoading}
                    className='w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors'
                  >
                    {sendOtpLoading
                      ? <Loader size={16} className='animate-spin' />
                      : "Mark as Delivered"}
                  </button>
                )}

                {showOtpBox && (
                  <div>
                    <p className='text-sm text-gray-500 mb-3 text-center'>
                      Enter the OTP shared by the customer
                    </p>
                    <input
                      type="text"
                      className='w-full py-3 border border-gray-200 rounded-xl text-center text-lg font-semibold tracking-[0.3em] outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='– – – –'
                      maxLength={4}
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                    />
                    <button
                      className='w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors'
                      onClick={verifyOtp}
                      disabled={verifyOtpLoading}
                    >
                      {verifyOtpLoading
                        ? <Loader size={16} className='animate-spin' />
                        : "Verify OTP"}
                    </button>
                    {otpError && (
                      <p className='text-red-600 text-sm mt-3 text-center'>{otpError}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    )
}

 return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className="max-w-3xl mx-auto pt-[120px] pb-10">
        <h2 className='text-2xl font-bold text-gray-800 mb-1'>Delivery Assignments</h2>
        <p className='text-gray-500 text-sm mb-6'>New orders waiting for your response</p>

        {assignments.length === 0 ? (
          <div className='text-center text-gray-400 py-10'>No new assignments right now</div>
        ) : (
          assignments.map((a, index) => (
            <div key={index} className='p-5 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='font-semibold text-gray-800'>Order ID</span>
                <span className='text-green-700 font-bold'>#{a?.order._id.slice(-6)}</span>
              </div>
              <div className='flex items-start gap-2 text-gray-600 text-sm'>
                <MapPin size={15} className='text-green-600 flex-shrink-0 mt-0.5' />
                <span>{a.order.address.fullAddress}</span>
              </div>

              <div className='flex gap-3 mt-4'>
                <button
                  className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold transition-colors'
                  onClick={() => handleAccept(a._id)}
                >
                  Accept
                </button>
                <button className='flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-colors'>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard
