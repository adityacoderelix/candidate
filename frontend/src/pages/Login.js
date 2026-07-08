import { useState } from "react";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import '../App.css';
import './Dashboard.css';

function Login () {
    const [error, setError] = useState("");
    const [form, setForm] = useState({ email: "", password: "" });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
    };

    const login = async (e) => {
        e.preventDefault();

        if (!validateEmail(form.email)) {
            setError("Enter valid email");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/auth/login", form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user?.role || res.data.role);
            localStorage.setItem("email", res.data.user?.email || res.data.email);
            localStorage.setItem("name", res.data.user?.name || res.data.name);
            localStorage.setItem("userId", res.data.user?._id || res.data._id);

            window.location.href = "/dashboard";

        } catch (err) {
            console.log(err);
            setError(err.response?.data || "Login failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 hero-section d-flex 
            align-items-center">
            <div className="w-25 container text-white text-center">
                <Container className="mt-5">
                    { error && <Alert variant="danger">{error}</Alert>}
                    <h1 className="login-title">Login</h1>
                    <Form onSubmit={login}>
                        <div className="form-floating mb-3">
                            <Form.Control className="form-control mb-3" id="email" placeholder="Email" 
                                value={form.email} onChange={(e)=>
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })} />
                            <label htmlForfor="email">Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <Form.Control className="form-control mb-3" id="password" type="password" 
                                value={form.password} placeholder="Password" onChange={(e)=>
                                setForm({
                                    ...form,
                                    password: e.target.value
                                })} />
                            <label htmlForfor="password">Password</label>
                        </div>
                        <div className="d-grid gap-2">
                            <Button type="submit" className="custom-button">
                                Login
                            </Button>
                            </div>
                        <div>
                            <p className="mt-3">Don't have an account?</p>
                            <Link className="link-info link-offset-3" to="/register">Register</Link>
                        </div>
                        <div>
                            <p className="mt-3">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </p>
                        </div>  
                    </Form>
                </Container>
            </div>
        </div>
    );
}

export default Login;