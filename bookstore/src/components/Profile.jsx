import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminProfile from "./AdminProfile";  
import { useNavigate } from "react-router-dom";
import {jwtDecode as jwt_decode} from 'jwt-decode';

const UserProfile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  const [activeTab, setActiveTab] = useState("information");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");
  
  if (!token) {
    navigate("/login");
  }

  const decodedToken = jwt_decode(token);
  const email = decodedToken.email;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get-user-details", { email });
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchDetails();

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get-order-details", { email });
        console.log(response.data);
        setOrderDetails(response.data.orders);

      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();

  }, [email]);

    const firstName = localStorage.getItem("firstname");
    console.log(firstName);

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password must match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/change-password", {
        email,
        ...passwordData,
      });
      if (response.data.success) {
        alert("Password changed successfully!");
        setShowPasswordModal(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstname");
    localStorage.removeItem("email");
    localStorage.removeItem("lastname");
  
    // Navigate to the login page after clearing the session
    navigate("/login", { replace: true });
  
    // Optional: Force a page reload after navigation
    window.location.reload();
  };
  



  // Check if the user is an admin, then return AdminProfile
  if (userDetails?.role === "admin") {
    return <AdminProfile userDetails={userDetails} />;
  }

  if (userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-indigo-600 md:w-56 flex flex-col items-center justify-center py-8">
              {userDetails && (
                <>
                  <div className="w-24 h-24 bg-white text-indigo-600 flex justify-center items-center rounded-full text-3xl font-bold">
                    {userDetails.name[0]}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">{userDetails.name}</h2>
                  <p className="mt-2 text-indigo-200">{userDetails.email}</p>
                </>
              )}
            </div>
            <div className="p-8 w-full">
              <div className="flex border-b border-gray-200 mb-6">
                {["Information", "Purchase History", "Settings"].map((tab) => (
                  <button
                    key={tab}
                    className={`mr-4 py-2 px-1 font-medium text-sm focus:outline-none ${
                      activeTab === tab.toLowerCase()
                        ? "border-b-2 border-indigo-500 text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "information" && userDetails && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                  <p className="mt-1 text-sm text-gray-900">Role: {userDetails.role || "N/A"}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="mt-1 text-sm text-gray-900">{userDetails.phone || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Address</h4>
                      <p className="mt-1 text-sm text-gray-900">{userDetails.address || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {userDetails.dob ? new Date(userDetails.dob).toDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

{activeTab === "purchase history" && (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
    {orderDetails.length > 0 ? (
      orderDetails.map((order) => (
        <div
          key={order.orderId}
          className="bg-gray-50 rounded-lg p-4 mb-4 w-full max-w-full" // Ensure the div takes the full width of the parent
        >
          <div className="flex flex-wrap justify-between items-center mb-2">
            <h4 className="text-md font-semibold break-words">
              Order ID: {order.orderId} {/* Text wraps properly */}
            </h4>
            <span className="text-sm text-gray-500 break-words">
              Status: {order.status}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-sm font-medium">
              Total Amount: AED{order.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-normal text-sm break-words">
                      {item.title}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      AED {item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No purchase history available</p>
    )}
  </div>
)}


              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                    >
                      Change Password
                    </button>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
                      <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200">
                        <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Receive Email Notifications</span>
                      <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600">
                        <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="bg-indigo-600 text-white rounded-md py-2 px-4"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>Loading...</div>
  );
};

export default UserProfile;
