import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Alert } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import PasswordResetModule from "../components/PasswordResetModule";
import "./Dashboard.css";

function Profile() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const [collapsed, setCollapsed] = useState(false);

    const [profile, setProfile] = useState({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || ""
    });

    const [users, setUsers] = useState([]);
    const [passwords, setPasswords] = useState({});
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const initials = (name) =>
        name
            ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
            : "U";

    const pendingUsers = users.filter((user) => !user.isApproved);

    useEffect(() => {
        if (role === "Admin") {
            fetchUsers();
        }
    }, [role]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/users", {
                headers: { Authorization: token }
            });

            setUsers(res.data);
        } catch {
            setError("Failed to load users");
        }
    };

    const approveUser = async (userId) => {
        try {
            await axios.put(
                `http://localhost:5000/auth/approve-user/${userId}`,
                {},
                { headers: { Authorization: token } }
            );

            fetchUsers();
            setSuccess("User approved successfully");
            setError("");
        } catch {
            setError("User approval failed");
            setSuccess("");
        }
    };

    const rejectUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/auth/delete-user/${userId}`, {
                headers: { Authorization: token }
            });

            setUsers(users.filter((user) => user._id !== userId));
            setSuccess("User rejected successfully");
            setError("");
        } catch {
            setError("User rejection failed");
            setSuccess("");
        }
    };

    const saveProfile = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const res = await axios.put(
                `http://localhost:5000/auth/update-profile/${userId}`,
                profile,
                { headers: { Authorization: token } }
            );

            localStorage.setItem("name", res.data.name);
            localStorage.setItem("email", res.data.email);

            setSuccess("Profile updated successfully");
            setError("");
        } catch {
            setError("Profile update failed");
            setSuccess("");
        }
    };

    const resetPassword = async (userId) => {
        try {
            if (!passwords[userId]) {
                setError("Please enter a new password");
                setSuccess("");
                return;
            }

            await axios.put(
                `http://localhost:5000/auth/reset-password/${userId}`,
                { password: passwords[userId] },
                { headers: { Authorization: token } }
            );

            setPasswords({ ...passwords, [userId]: "" });
            setSuccess("Password reset successfully");
            setError("");
        } catch {
            setError("Password reset failed");
            setSuccess("");
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/auth/delete-user/${userId}`, {
                headers: { Authorization: token }
            });

            setUsers(users.filter((user) => user._id !== userId));
            setSuccess("User deleted successfully");
            setError("");
        } catch {
            setError("User delete failed");
            setSuccess("");
        }
    };

    return (
        <>
            <CustomNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

            <Container fluid className={`page-content profile-page ${collapsed ? "collapsed-content" : ""}`}>
                {success && <Alert variant="success" className="profile-alert">{success}</Alert>}
                {error && <Alert variant="danger" className="profile-alert">{error}</Alert>}

                <div className="profile-grid">
                    <div className="profile-form-card">
                        <div className="profile-card-header">
                            <div>
                                <h3>Personal Information</h3>
                                <p>Keep your profile details up to date.</p>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-input-group">
                                <label>Full Name</label>
                                <input
                                    value={profile.name}
                                    placeholder="Enter full name"
                                    onChange={(e) =>
                                        setProfile({ ...profile, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="profile-input-group">
                                <label>Email Address</label>
                                <input
                                    value={profile.email}
                                    placeholder="Enter email"
                                    onChange={(e) =>
                                        setProfile({ ...profile, email: e.target.value })
                                    }
                                />
                            </div>

                            <div className="profile-input-group">
                                <label>Role</label>
                                <input value={profile.role} disabled />
                            </div>
                        </div>

                        <div className="profile-actions">
                            <Button className="profile-save-btn" onClick={saveProfile}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {role === "Admin" && (
                    <>
                        <div className="profile-form-card mt-4">
                            <div className="profile-card-header">
                                <div>
                                    <h3>Pending Approvals</h3>
                                    <p>Approve or reject new user registrations.</p>
                                </div>
                            </div>

                            <div className="hf-pending-grid">
                                {pendingUsers.length === 0 && (
                                    <p className="hf-muted">No pending approvals</p>
                                )}

                                {pendingUsers.map((user) => (
                                    <div className="hf-pending-user" key={user._id}>
                                        <div className="hf-small-avatar">
                                            {initials(user.name)}
                                        </div>

                                        <div>
                                            <strong>{user.name}</strong>
                                            <p>{user.email}</p>
                                            <span className="hf-purple-pill">{user.role}</span>
                                        </div>

                                        <div className="hf-pending-actions">
                                            <button
                                                className="hf-approve-btn"
                                                onClick={() => approveUser(user._id)}
                                            >
                                                <i className="bi bi-check-lg"></i>
                                            </button>

                                            <button
                                                className="hf-reject-btn"
                                                onClick={() => rejectUser(user._id)}
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                                
                        <PasswordResetModule users={users} passwords={passwords} setPasswords={setPasswords}
                            resetPassword={resetPassword} deleteUser={deleteUser}
                        />
                    </>
                )}
            </Container>
        </>
    );
}

export default Profile;