import { Table, Form, Button } from "react-bootstrap";
import "../pages/Dashboard.css";

function PasswordResetModule({users, passwords, setPasswords, resetPassword, deleteUser}) {
    return (
        <div className="profile-password-section">

            <div className="modern-table-card profile-security-table">
                <Table responsive className="modern-table text-center mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>New Password</th>
                            <th>Reset</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="profile-role-pill">
                                        {user.role}
                                    </span>
                                </td>

                                <td>
                                    <Form.Control type="password" placeholder="Enter new password"
                                        className="profile-password-input" value={passwords[user._id] || ""}
                                        onChange={(e) =>
                                            setPasswords({
                                                ...passwords,
                                                [user._id]: e.target.value
                                            })
                                        }
                                    />
                                </td>

                                <td>
                                    <Button className="icon-action-btn edit-icon" onClick={() => resetPassword(user._id)}>
                                        <i className="bi bi-key-fill"></i>
                                    </Button>
                                </td>

                                <td>
                                    {user.role !== "Admin" && (
                                        <Button className="icon-action-btn delete-icon-btn" onClick={() => deleteUser(user._id)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default PasswordResetModule;