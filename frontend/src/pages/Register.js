import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../App.css";
import "./Dashboard.css";

function Register() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "HR",
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
  };

  const validateName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const checkEmailExists = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/auth/check-email`, { email });

      if (res.data.exists) {
        setEmailError("Email already exists");
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!validateName(form.name)) {
      setError("Name can only contain letters and spaces");
      setLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Enter valid email");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    try {
      console.log("API URL:", API_URL);
      const emailCheck = await axios.post(`${API_URL}/auth/check-email`, {
        email: form.email,
      });

      if (emailCheck.data.exists) {
        setError("Email already exists");
        return;
      }
      console.log("Sending registration request");

      await axios.post(`${API_URL}/auth/register`, form);
      setSuccess("Registration request sent. Please wait for admin approval.");
      setError("");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "HR",
      });

      localStorage.clear();

      setSuccess("Registration request sent. Please wait for admin approval.");
      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 1500);
      console.log("Registration successful");
    } catch (err) {
      setLoading(false);
      console.log(err.response);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 hero-section">
      <div className="w-25 container text-white text-center">
        <Container className="mt-5">
          <h2 className="register-title">Register</h2>
          {error && (
            <Alert variant="danger" className="custom-alert">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="custom-alert">
              {success}
            </Alert>
          )}
          <Form onSubmit={register} noValidate>
            <div className="form-floating mb-3">
              <Form.Control
                className="mb-3"
                id="name"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className="form-floating mb-3">
              <Form.Control
                className="mb-3"
                id="email"
                placeholder="Email"
                value={form.email}
                onChange={async (e) => {
                  const email = e.target.value;
                  setForm({
                    ...form,
                    email,
                  });
                  if (validateEmail(email)) {
                    checkEmailExists(email);
                  } else {
                    setEmailError("");
                  }
                }}
              />
              <label htmlFor="email">Email</label>
              {emailError && (
                <div className="text-danger text-start mb-2 small">
                  {emailError}
                </div>
              )}
            </div>
            <div className="form-floating mb-3">
              <Form.Control
                className="mb-3"
                type="password"
                id="password"
                value={form.password}
                placeholder="Password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="d-grid gap-2">
              <Button
                className="custom-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending Registration Request..." : "Register"}
              </Button>
            </div>
          </Form>
          <div>
            <a href="/">Back to Login</a>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Register;
