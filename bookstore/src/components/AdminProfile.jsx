import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiShoppingBag, FiBook, FiDatabase, FiSettings, FiDollarSign, FiPackage, FiUserCheck, FiTruck, FiBarChart, FiMail } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

const AdminDashboard = ({ userDetails }) => {
  const [activePanel, setActivePanel] = useState("orders");
  const [Users, setUsers] = useState([]);

  const adminOptions = [
    { id: "dashboard", icon: FiBarChart, label: "Dashboard" },
    { id: "orders", icon: FiShoppingBag, label: "Orders" },
    { id: "users", icon: FiUsers, label: "Users" },
    { id: "books", icon: FiBook, label: "Books" },
    { id: "shipping", icon: FiTruck, label: "Shipping" },
    { id: "marketing", icon: FiMail, label: "Marketing" },
    { id: "logs", icon: FiDatabase, label: "Logs" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getUsers");

        console.log("Response from backend:", response.data); // Debugging
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching Reviews:", err);
      }
    };
  });

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <DashboardPanel />;
      case "orders":
        return <OrdersPanel />;
      case "users":
        return <UsersPanel />;
      case "books":
        return <BooksPanel />;
      case "shipping":
        return <ShippingPanel />;
      case "marketing":
        return <MarketingPanel />;
      case "logs":
        return <LogsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.aside 
            className="md:w-64 flex-shrink-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl">
              <motion.div 
                className="flex items-center space-x-4 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {userDetails.name[0]}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{userDetails.name}</h2>
                  <p className="text-sm text-gray-400">{userDetails.email}</p>
                </div>
              </motion.div>
              <nav className="space-y-2">
                {adminOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setActivePanel(option.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activePanel === option.id ? "bg-gradient-to-r from-purple-500 to-pink-500" : "hover:bg-gray-800"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <option.icon className="w-5 h-5" />
                    <span>{option.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.aside>
          <motion.main 
            className="flex-grow"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {renderPanel()}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

const DashboardPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiBarChart className="mr-2 text-purple-500" />
      Dashboard Overview
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon={FiDollarSign} label="Total Revenue" value="$12,345" />
      <StatCard icon={FiPackage} label="Orders This Month" value="234" />
      <StatCard icon={FiUserCheck} label="New Customers" value="45" />
      <StatCard icon={FiBook} label="Books in Stock" value="1,234" />
    </div>
    {/* Add more dashboard widgets here */}
  </div>
);

const OrdersPanel = () => {
  const [orders, setOrders] = useState([
    { id: "ORD001", customer: "John Doe", total: "$59.99", status: "Pending" },
    { id: "ORD002", customer: "Jane Smith", total: "$129.99", status: "Processing" },
    { id: "ORD003", customer: "Bob Johnson", total: "$89.99", status: "Shipped" },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiShoppingBag className="mr-2 text-purple-500" />
        Recent Orders
      </h2>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Order ID</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Total</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <motion.tr 
                key={order.id} 
                className="border-b"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.customer}</td>
                <td className="py-2">{order.total}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

const UsersPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiUsers className="mr-2 text-purple-500" />
      User Management
    </h2>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">User ID</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Email</th>
            <th className="text-left py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: "USR001", name: "Alice Cooper", email: "alice@example.com", role: "Customer" },
            { id: "USR002", name: "Bob Dylan", email: "bob@example.com", role: "Admin" },
            { id: "USR003", name: "Charlie Brown", email: "charlie@example.com", role: "Customer" },
          ].map((user) => (
            <motion.tr 
              key={user.id} 
              className="border-b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td className="py-2">{user.id}</td>
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

const BooksPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiBook className="mr-2 text-purple-500" />
      Book Inventory
    </h2>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">ISBN</th>
            <th className="text-left py-2">Title</th>
            <th className="text-left py-2">Author</th>
            <th className="text-left py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {[
            { isbn: "9781234567890", title: "The Great Gatsby", author: "F. Scott Fitzgerald", stock: 15 },
            { isbn: "9780987654321", title: "To Kill a Mockingbird", author: "Harper Lee", stock: 8 },
            { isbn: "9781122334455", title: "1984", author: "George Orwell", stock: 12 },
          ].map((book) => (
            <motion.tr 
              key={book.isbn} 
              className="border-b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td className="py-2">{book.isbn}</td>
              <td className="py-2">{book.title}</td>
              <td className="py-2">{book.author}</td>
              <td className="py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  book.stock > 10 ? 'bg-green-100 text-green-800' :
                  book.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {book.stock}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

const ShippingPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiTruck className="mr-2 text-purple-500" />
      Shipping Management
    </h2>
    <p>Shipping management features will be implemented here.</p>
  </div>
);

const MarketingPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiMail className="mr-2 text-purple-500" />
      Marketing Campaigns
    </h2>
    <p>Marketing campaign management features will be implemented here.</p>
  </div>
);

const LogsPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiDatabase className="mr-2 text-purple-500" />
      Recent Logs
    </h2>
    <motion.ul 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {[
        { timestamp: "2023-05-01 10:30:15", action: "User login", details: "User ID: USR002" },
        { timestamp: "2023-05-01 11:45:22", action: "New order placed", details: "Order ID: ORD003" },
        { timestamp: "2023-05-01 14:15:07", action: "Inventory update", details: "Book ID: 9781234567890, New stock: 15" },
      ].map((log, index) => (
        <motion.li 
          key={index} 
          className="bg-gray-100 p-4 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <p className="text-sm text-gray-600">{log.timestamp}</p>
          <p className="font-semibold text-purple-600">{log.action}</p>
          <p className="text-sm text-gray-800">{log.details}</p>
        </motion.li>
      ))}
    </motion.ul>
  </div>
);

const SettingsPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center">
      <FiSettings className="mr-2 text-purple-500" />
      Settings
    </h2>
    <motion.form 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
        <input type="text" id="siteName" name="siteName" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" defaultValue="My Bookstore" />
      </div>
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <select id="currency" name="currency" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
        </select>
      </div>
      <div>
        <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
        <input type="number" id="taxRate" name="taxRate" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" defaultValue="10" />
      </div>
      <motion.button 
        type="submit" 
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save Settings
      </motion.button>
    </motion.form>
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <motion.div 
    className="bg-white p-4 rounded-lg shadow-md"
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="text-purple-500 mr-2" size={24} />
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
  </motion.div>
);

export default AdminDashboard;
