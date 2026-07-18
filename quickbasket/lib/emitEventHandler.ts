import axios from 'axios'

async function emitEventHandler(event: string, data: any, socketId?: string) {
  try {
    const socketUrl = process.env.INTERNAL_SOCKET_URL || process.env.NEXT_PUBLIC_SOCKET_SERVER
    await axios.post(`${socketUrl}/notify`, { socketId, event, data })
  } catch (error) {
    console.log(error)
  }
}

export default emitEventHandler