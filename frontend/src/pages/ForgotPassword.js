import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function ForgotPassword () {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const sendResetLink = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await axios.post("http://localhost:5000/auth/forgot-password", {email});
            setMessage(res.data.message);

        } catch (err) {
            console.log(err.response?.data);
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "500px" }}>
            <h3>Forgot Password</h3>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={sendResetLink}>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your registered email" value={email} 
                        onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Button type="submit">Send Reset Link</Button>
            </Form>

            <p className="mt-3"><Link to="/">Back to Login</Link></p>
        </Container>
    )
}

export default ForgotPassword;