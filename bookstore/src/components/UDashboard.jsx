import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/udashboard.css";
import { Layout, Menu, Button, Avatar, Row, Col } from "antd";
import {jwtDecode as jwt_decode} from 'jwt-decode';
import axios from "axios";


import {
  HomeOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "/logo.png"; // Ensure the correct path to your logo

const { Sider, Content } = Layout;

// Sidebar Component
const Sidebar = ({ collapsed, onToggle, onLogout }) => (
  <Sider collapsible collapsed={collapsed} className="sidebar">
    <div className="logo" style={{ textAlign: "center", padding: "10px" }}>
      <img
        src={logo}
        alt="Book Logo"
        style={{
          width: collapsed ? "50px" : "120px",
          height: "auto",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      className="menu-bar"
      items={[
        { key: "1", icon: <HomeOutlined />, label: "Home" },
        { key: "2", icon: <BookOutlined />, label: "My Library" },
        { key: "3", icon: <ShoppingCartOutlined />, label: "My Orders" },
        { key: "4", icon: <SettingOutlined />, label: "Settings",           onClick: () => (window.location.href = "/profile"),         },
      ]}
    />
    <div
      style={{
        textAlign: "center",
        marginTop: "auto",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          marginRight: "10px",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
        }}
      />
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        onClick={onLogout}
        style={{ width: "70%" }}
      >
        {!collapsed && "Logout"}
      </Button>
    </div>
  </Sider>
);

// UDashboard Component
const UDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [userName, setUserName] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const firstName = localStorage.getItem("firstname");
    console.log(firstName);

    if (!token) {
      navigate("/login");
    }
   
      const decodedToken = jwt_decode(token);
      const email = decodedToken.email;

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

    if (firstName) {
      setUserName(firstName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  const handleReadNow = (book_id) => {
    navigate(`/Ereader/${book_id}`);
  };

 // const previewUrl = `https://books.google.com/books?id=${book_id}&printsec=frontcover&output=embed`;
 // window.open(previewUrl, '_blank');


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />
      <Layout>
        <Content style={{ padding: "20px" }} className="main">
          {/* Search Section */}
          <div
            className="header-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="search-container"
              style={{ display: "flex", alignItems: "center" }}
            >
              <SearchOutlined
                style={{
                  fontSize: "24px",
                  position: "absolute",
                  left: "15px",
                }}
              />
              <input
                type="text"
                placeholder="Search your fav books"
                className="searchfavbooks"
              />
            </div>
            {/* User Icon and Name */}
            <Row
              align="middle"
              style={{ cursor: "pointer" }}
              onClick={handleProfileClick}
            >
              <Col>
                <Avatar style={{ backgroundColor: "#1890ff" }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </Col>
              <Col style={{ marginLeft: "10px" }}>
                <span>{userName}</span>
              </Col>
            </Row>
          </div>

          {/* Main Content */}
          <div className="content">
            {/* Shelves */}
            <section>
              <h3>Currently Reading</h3>
              <div className="shelf">
                {orderDetails.map((order) => (

                  order.items.map((item, index) => (
                    <div className="book-container" key={index}>
                    <img className="book" src={item.image} alt="Book 1" />
                    <button className="read-now" onClick={()=> handleReadNow(item.book_id)}>Read Now</button>
                  </div>
                  ))

                ))}
             
               
              </div>
            </section>

          
           
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UDashboard;
