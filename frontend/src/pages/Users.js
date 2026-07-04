import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Table } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import "./Dashboard.css";

function Users() {
    const token = localStorage.getItem("token");
    const [collapsed, setCollapsed] = useState(false);
    const [users, setUsers] = useState([]);
    const [passwords, setPasswords] = useState({});

    const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/auth/users", {
            headers: { Authorization: token }
        });
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const approveUser = async (id) => {
        await axios.put(`http://localhost:5000/auth/approve-user/${id}`, {}, {
            headers: { Authorization: token }
        });
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:5000/auth/delete-user/${id}`, {
            headers: { Authorization: token }
        });
        fetchUsers();
    };

    const resetPassword = async (id) => {
        await axios.put(
            `http://localhost:5000/auth/reset-user-password/${id}`,
            { password: passwords[id] },
            { headers: { Authorization: token } }
        );
        setPasswords({ ...passwords, [id]: "" });
    };

    const initials = (name) =>
        name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    const pendingUsers = users.filter(u => !u.isApproved);

    return (
        <>
            <CustomNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

            <Container fluid className={`hf-page ${collapsed ? "collapsed-page" : ""}`}>
                <h1 className="hf-page-title">Users</h1>
                <p className="hf-page-subtitle">Admin · approve registrations and manage access</p>

                <div className="hf-card mb-4">
                    <h4>Pending approvals</h4>
                    <p className="hf-muted">New registrations awaiting your review</p>

                    <div className="hf-pending-grid">
                        {pendingUsers.length === 0 && <p className="hf-muted">No pending approvals</p>}

                        {pendingUsers.map(user => (
                            <div className="hf-pending-user" key={user._id}>
                                <div className="hf-small-avatar">{initials(user.name)}</div>
                                <div>
                                    <strong>{user.name}</strong>
                                    <p>{user.email} · {user.role}</p>
                                </div>

                                <div className="hf-pending-actions">
                                    <button className="hf-approve-btn" onClick={() => approveUser(user._id)}>
                                        <i className="bi bi-check-lg"></i>
                                    </button>
                                    <button className="hf-reject-btn" onClick={() => deleteUser(user._id)}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hf-table-card">
                    <Table responsive hover className="hf-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>New Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="hf-user-cell">
                                            <div className="hf-small-avatar">{initials(user.name)}</div>
                                            <strong>{user.name}</strong>
                                        </div>
                                    </td>

                                    <td>{user.email}</td>

                                    <td>
                                        <span className="hf-purple-pill">{user.role}</span>
                                    </td>

                                    <td>
                                        <span className={user.isApproved ? "hf-green-pill" : "hf-orange-pill"}>
                                            {user.isApproved ? "Approved" : "Pending Approval"}
                                        </span>
                                    </td>

                                    <td>
                                        <input
                                            className="hf-mini-input"
                                            type="password"
                                            placeholder="New password"
                                            value={passwords[user._id] || ""}
                                            onChange={e => setPasswords({...passwords, [user._id]: e.target.value})}
                                        />
                                    </td>

                                    <td>
                                        <button className="hf-icon-btn" onClick={() => resetPassword(user._id)}>
                                            <i className="bi bi-key"></i>
                                        </button>

                                        {user.role !== "Admin" && (
                                            <button className="hf-icon-btn danger" onClick={() => deleteUser(user._id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}

export default Users;