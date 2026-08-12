import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword () {
    const API_URL = process.env.REACT_APP_API_URL;
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const resetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password} );
            setMessage(res.data.message);

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "500px" }}>
            <h3>Reset Password</h3>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={resetPassword}>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" value={password} 
                        onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                <Button type="submit">Reset Password</Button>
            </Form>
        </Container>
    )
}

export default ResetPassword;