import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { useState, useEffect } from "react";
import axios from "axios";

import "../pages/Dashboard.css";

function CustomNavbar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const [username, setUsername] = useState(
        localStorage.getItem("name") || "User"
    );

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [passwords, setPasswords] = useState({});
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [show, setShow] = useState(false);

    const [profile, setProfile] = useState({
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email")
    });

    useEffect(() => {
        if (role === "Admin") {
            fetchUsers();
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/auth/users",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setUsers(res.data);
        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data);
        }
    };

    const deleteUser = async (id) => {
        await axios.delete(
            `http://localhost:5000/auth/delete-user/${id}`,
            {
                headers: { Authorization: token }
            }
        );

        fetchUsers();
    };

    const resetPassword = async (id) => {
        try {
            await axios.put(
                `http://localhost:5000/auth/reset-user-password/${id}`,
                {
                    password: passwords[id]
                },
                {
                    headers: { Authorization: token }
                }
            );

            setSuccess("Password Reset Successful");
        } catch (err) {
            console.log(err);
            setError("Password reset failed");
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const saveProfile = async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                setError("User not found");
                return;
            }

            const res = await axios.put(
                `http://localhost:5000/auth/update-profile/${userId}`,
                profile,
                {
                    headers: { Authorization: token }
                }
            );

            localStorage.setItem("name", res.data.name);
            localStorage.setItem("email", res.data.email);

            setUsername(res.data.name);

            setProfile({
                name: res.data.name,
                email: res.data.email
            });

            if (role === "Admin") {
                fetchUsers();
            }

            setSuccess("Profile Updated Successfully");
        } catch (err) {
            console.log(err);
            setError("Profile update failed");
        }
    };

    return (
        <>
            <div className={`sidebar shadow-sm ${collapsed ? "collapsed" : ""}`}>

                <button className="sidebar-toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    <i class="bi bi-list"></i>
                </button>

                <div>
                    {!collapsed && (
                        <>
                            <h4 className="sidebar-brand">CodeRelix LLP</h4>
                            <small className="sidebar-subtitle">Candidate Management System</small>
                        </>
                    )}

                    <div className="sidebar-links mt-4">
                        <button className={location.pathname === "/dashboard" ? "active-link" : ""} onClick={() => navigate("/dashboard")}>
                            <i className="bi bi-speedometer2"></i>
                            {!collapsed && <span>Dashboard</span>}
                        </button>

                        <button className={location.pathname === "/candidates" ? "active-link" : ""} onClick={() => navigate("/candidates")}>
                            <i className="bi bi-people-fill"></i>
                            {!collapsed && <span>Candidates</span>}
                        </button>

                        <button className={location.pathname === "/jobs" ? "active-link" : ""} onClick={() => navigate("/jobs")}>
                            <i className="bi bi-briefcase-fill"></i>
                            {!collapsed && <span>Jobs</span>}
                        </button>

                        {role === "Admin" && (
                            <button className={location.pathname === "/company-details" ? "active-link" : ""} onClick={() => navigate("/company-details")}>
                                <i className="bi bi-building-fill"></i>
                                {!collapsed && (
                                    <span>Company Details</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <div className="sidebar-profile">
                    <div className="profile-info" onClick={() => navigate("/profile")}>
                        <img src="https://i.pinimg.com/736x/b5/4f/c0/b54fc0fc3bd8a5775a08061ee30843a1.jpg"
                            alt="profile" className="sidebar-profile-avatar"
                        />

                        {!collapsed && (
                            <div>
                                <strong>{username}</strong>
                            </div>
                        )}
                    </div>

                    <button className="logout-sidebar-btn" onClick={() => setShowLogoutModal(true)}>
                        {collapsed ? (
                            <i className="bi bi-box-arrow-right"></i>
                        ) : (
                            "Logout"
                        )}
                    </button>
                </div>
            </div>

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
                <Modal.Header closeButton className="delete-modal-header">
                    <Modal.Title>Logout?</Modal.Title>
                </Modal.Header>

                <Modal.Body className="delete-modal-body">
                    <div className="delete-icon">
                        <i className="bi bi-box-arrow-right"></i>
                    </div>

                    <h5>Are you sure?</h5>

                    <p>
                        You will be logged out of your
                        account.
                    </p>
                </Modal.Body>

                <Modal.Footer className="delete-modal-footer">
                    <Button className="delete-confirm-btn" onClick={logout}>
                        Yes, Logout
                    </Button>

                    <Button variant="light" onClick={() => setShowLogoutModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CustomNavbar;