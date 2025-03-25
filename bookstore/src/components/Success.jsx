import { useEffect, useState } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {jwtDecode as jwt_decode} from 'jwt-decode';

const Success = () => {
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }

      try {
        const decodedToken = jwt_decode(token)
        const email = decodedToken.email

        const response = await fetch("http://localhost:5000/get-order-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        if (data.success && data.orders.length > 0) {
          // Sort orders by createdAt in descending order
          const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

          // Get the most recent order
          const mostRecentOrder = sortedOrders[0]
          // Check if the order was placed within the last 5 minutes
          const orderTime = new Date(mostRecentOrder.createdAt)
          console.log(orderTime);
          const currentTime = new Date()

          console.log(currentTime)
          const timeDifference = (currentTime - orderTime) / 1000 / 60 // difference in minutes

          if (timeDifference <= 5) {
            setOrderDetails(mostRecentOrder)
          } else {
            console.log("No recent orders found")
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      }
    }

    fetchOrderDetails()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Thank you for your purchase!
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-gray-600"
          >
            Your order number is <strong>{orderDetails ? orderDetails.orderId : "Processing..."}</strong>
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            {orderDetails ? (
              orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-black">{item.title}</span>
                  <span className="font-medium text-black">AED {item.price}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">Loading order details...</div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <span className="text-black">Total</span>
                <span className="text-black font-bold">AED {orderDetails ? orderDetails.totalAmount : "..."}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col space-y-3"
        >
          <Link to="/shop" className="w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Shop
            </motion.button>
          </Link>
          <Link to="/udashboard" className="w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Success

