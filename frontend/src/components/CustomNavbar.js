import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import "../pages/Dashboard.css";

function CustomNavbar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    const role = localStorage.getItem("role");

    const [username] = useState(localStorage.getItem("name") || "User");
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <>
            <div className={`sidebar shadow-sm ${collapsed ? "collapsed" : ""}`}>
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i className="bi bi-list"></i>
                </button>

                <div>
                    {!collapsed && (
                        <>
                            <h4 className="sidebar-brand">CodeRelix LLP</h4>
                            <small className="sidebar-subtitle">
                                Candidate Management System
                            </small>
                        </>
                    )}

                    <div className="sidebar-links mt-4">
                        <button
                            className={location.pathname === "/dashboard" ? "active-link" : ""}
                            onClick={() => navigate("/dashboard")}
                        >
                            <i className="bi bi-speedometer2"></i>
                            {!collapsed && <span>Dashboard</span>}
                        </button>

                        <button
                            className={location.pathname === "/candidates" ? "active-link" : ""}
                            onClick={() => navigate("/candidates")}
                        >
                            <i className="bi bi-people-fill"></i>
                            {!collapsed && <span>Candidates</span>}
                        </button>

                        <button
                            className={location.pathname === "/jobs" ? "active-link" : ""}
                            onClick={() => navigate("/jobs")}
                        >
                            <i className="bi bi-briefcase-fill"></i>
                            {!collapsed && <span>Jobs</span>}
                        </button>

                        {role === "Admin" && (
                            <button
                                className={
                                    location.pathname === "/company-details"
                                        ? "active-link"
                                        : ""
                                }
                                onClick={() => navigate("/company-details")}
                            >
                                <i className="bi bi-building-fill"></i>
                                {!collapsed && <span>Company Details</span>}
                            </button>
                        )}
                    </div>
                </div>

                <div className="sidebar-profile">
                    <div
                        className="profile-info"
                        onClick={() => navigate("/profile")}
                    >
                        <img
                            src="https://i.pinimg.com/736x/b5/4f/c0/b54fc0fc3bd8a5775a08061ee30843a1.jpg"
                            alt="profile"
                            className="sidebar-profile-avatar"
                        />

                        {!collapsed && (
                            <div>
                                <strong>{username}</strong>
                            </div>
                        )}
                    </div>

                    <button
                        className="logout-sidebar-btn"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        {collapsed ? (
                            <i className="bi bi-box-arrow-right"></i>
                        ) : (
                            "Logout"
                        )}
                    </button>
                </div>
            </div>

            <Modal
                show={showLogoutModal}
                onHide={() => setShowLogoutModal(false)}
                centered
            >
                <Modal.Header closeButton className="delete-modal-header">
                    <Modal.Title>Logout?</Modal.Title>
                </Modal.Header>

                <Modal.Body className="delete-modal-body">
                    <div className="delete-icon">
                        <i className="bi bi-box-arrow-right"></i>
                    </div>

                    <h5>Are you sure?</h5>

                    <p>You will be logged out of your account.</p>
                </Modal.Body>

                <Modal.Footer className="delete-modal-footer">
                    <Button className="delete-confirm-btn" onClick={logout}>
                        Yes, Logout
                    </Button>

                    <Button
                        variant="light"
                        onClick={() => setShowLogoutModal(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CustomNavbar;