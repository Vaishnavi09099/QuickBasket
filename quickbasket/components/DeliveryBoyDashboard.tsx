'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MapPin, CheckCircle, XCircle, Bike, ArrowLeft } from 'lucide-react'
import { getSocket } from '@/lib/socket'



const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([])

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/api/delivery/get-assignments")
  setAssignments(Array.isArray(res.data) ? res.data : res.data.assignments ?? [])
       
      } catch (err) {console.log(err)}
    }
    fetchAssignments()
  }, [])


    useEffect((): any => {
    const socket = getSocket()

    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment])
    })
    return () => socket.off("new-assignment")
  }, [])

  

  const handleAccept = async (id:string) => {
    try {
      const res = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
      if (res.status === 200) {
        setAssignments((prev) => prev.map((a) =>
          a._id === id ? { ...a, status: "assigned" } : a
        ))
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gray-50'>

      {/* Header */}
      <div className="w-full bg-gradient-to-br from-green-50 to-white px-6 pt-8 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
           
            
          </div>
          <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">
            Deliveries
          </p>
          <h1 className="text-4xl font-extrabold text-green-950 mb-2">
            My Assignments
          </h1>
          <p className="text-sm text-gray-400">
            Accept orders, track deliveries, and keep every basket moving.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-3xl mx-auto px-4 py-6'>

        {assignments.length === 0 && (
          <div className='text-center py-20 text-gray-400'>
            <Bike size={36} className='mx-auto mb-2 opacity-30' />
            <p className='text-sm'>No assignments yet</p>
          </div>
        )}

       {assignments.filter((a) => a.order != null).map((a) => (
          <div key={a._id} className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden'>

            {/* Card Header */}
            <div className='px-5 py-3 bg-gradient-to-r from-green-50 to-white border-b border-gray-100 flex items-center justify-between'>
              <p className='text-sm font-bold text-gray-800'>
                Order #{a?.order?._id?.toString().slice(-6).toUpperCase() ?? "------"}
              </p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                a.status === "broadcasted"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {a.status === "broadcasted" ? "Pending" : "Accepted"}
              </span>
            </div>

            {/* Card Body */}
            <div className='px-5 py-4'>
              <div className='flex items-start gap-2 text-sm text-gray-500'>
                <MapPin size={14} className='text-green-600 mt-0.5 shrink-0' />
                <span>{a.order?.address?.fullAddress ?? "Address not found"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 px-5 py-3 bg-gray-50 border-t border-gray-100'>
              {a.status === "broadcasted" ? (
                <>
                  <button
                    onClick={() => handleAccept(a._id!)}
                    className='flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all'>
                    <CheckCircle size={15} /> Accept
                  </button>
                  <button
                    className='flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 text-sm font-semibold py-2.5 rounded-xl transition-all'>
                    <XCircle size={15} /> Reject
                  </button>
                </>
              ) : (
                <div className='flex-1 text-sm text-gray-600 flex items-center justify-center rounded-xl border border-green-300 bg-green-50 py-2.5'>
                  Assigned to you
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard