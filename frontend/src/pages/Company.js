import CustomNavbar from "../components/CustomNavbar.js";
import { useState, useEffect } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import axios from "axios";
import "./Dashboard.css";

function Company() {
    const token = localStorage.getItem("token");

    const [companyDetails, setCompanyDetails] = useState(null);
    const [editing, setEditing] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const [form, setForm] = useState({
        companyName: "",
        companyPhone: "",
        companyEmail: "",
        companyAddress: ""
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);

    const validatePhone = (phone) =>
        /^[0-9]{10}$/.test(phone);

    const fetchCompanyDetails = async () => {
        try {
            const res = await axios.get("http://localhost:5000/company-details", {
                headers: { Authorization: token }
            });

            const details = Array.isArray(res.data) ? res.data[0] : res.data;

            if (details) {
                setCompanyDetails(details);
                setForm({
                    companyName: details.companyName || "",
                    companyPhone: details.companyPhone || "",
                    companyEmail: details.companyEmail || "",
                    companyAddress: details.companyAddress || ""
                });
            }
        } catch (err) {
            setError(err.response?.data || "Failed to load company details");
        }
    };

    useEffect(() => {
        fetchCompanyDetails();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveCompanyDetails = async (e) => {
        e.preventDefault();

        setValidated(true);
        setSuccess("");
        setError("");

        if (
            !form.companyName.trim() ||
            !form.companyEmail.trim() ||
            !form.companyPhone.trim() ||
            !form.companyAddress.trim()
        ) {
            setError("All fields are required");
            return;
        }

        if (!validateEmail(form.companyEmail)) {
            setError("Enter a valid email address");
            return;
        }

        if (!validatePhone(form.companyPhone)) {
            setError("Phone number must be exactly 10 digits");
            return;
        }

        try {
            if (companyDetails?._id) {
                await axios.put(
                    `http://localhost:5000/company-details/${companyDetails._id}`,
                    form,
                    { headers: { Authorization: token } }
                );
                setSuccess("Company details updated successfully!");
            } else {
                await axios.post(
                    "http://localhost:5000/company-details",
                    form,
                    { headers: { Authorization: token } }
                );
                setSuccess("Company details saved successfully!");
            }

            setEditing(false);
            setValidated(false);
            fetchCompanyDetails();

        } catch (err) {
            setError(err.response?.data || "Something went wrong");
        }
    };

    const startEditing = () => {
        setEditing(true);
        setSuccess("");
        setError("");
    };

    return (
        <>
            <CustomNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Container fluid className={`page-content ${collapsed ? "collapsed-content" : ""}`}>

                <div className="company-page">
                    <div className="company-left">
                        <div className="office-image-container">
                            <img
                                src="https://img.freepik.com/free-vector/cartoon-company-office-interior-night-vector-illustration-dark-room-with-large-windows-laptops-folders-workspace-desks-chairs-ceiling-lamps-cityscape-buildings-starry-sky-view_107791-23305.jpg?semt=ais_hybrid&w=740&q=80"
                                alt="Office"
                                className="office-image"
                            />
                        </div>
                    </div>

                    <div className="company-right">
                        <Container>
                            <Card className="company-card">
                                <Card.Body>
                                    <h2 className="company-title">Company Details</h2>

                                    {success && <Alert variant="success">{success}</Alert>}
                                    {error && <Alert variant="danger">{error}</Alert>}

                                    {!editing && companyDetails ? (
                                        <>
                                            <div className="company-detail-box">
                                                <p><strong>Name:</strong> {companyDetails.companyName}</p>
                                                <p><strong>Phone:</strong> {companyDetails.companyPhone}</p>
                                                <p><strong>Email:</strong> {companyDetails.companyEmail}</p>
                                                <p><strong>Address:</strong> {companyDetails.companyAddress}</p>
                                            </div>

                                            <Button className="apply-submit-btn mt-3 edit-company-btn"
                                                onClick={startEditing}>
                                                Edit Details
                                            </Button>
                                        </>
                                    ) : (
                                        <Form onSubmit={saveCompanyDetails} noValidate>
                                            <Form.Group className="apply-input-group">
                                                <Form.Label>Company Name</Form.Label>
                                                <Form.Control
                                                    className={
                                                        validated && !form.companyName.trim()
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                    type="text"
                                                    name="companyName"
                                                    value={form.companyName}
                                                    onChange={handleChange}
                                                    placeholder="Enter the company name"
                                                />
                                            </Form.Group>

                                            <Form.Group className="apply-input-group">
                                                <Form.Label>Company Phone Number</Form.Label>
                                                <Form.Control className={
                                                        validated &&
                                                        (!form.companyPhone.trim() || !validatePhone(form.companyPhone))
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                    type="text" name="companyPhone" value={form.companyPhone} onChange={handleChange}
                                                    placeholder="Enter the company phone number" maxLength={10}
                                                />
                                            </Form.Group>

                                            <Form.Group className="apply-input-group">
                                                <Form.Label>Company Email</Form.Label>
                                                <Form.Control
                                                    className={
                                                        validated &&
                                                        (!form.companyEmail.trim() || !validateEmail(form.companyEmail))
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                    type="email"
                                                    name="companyEmail"
                                                    value={form.companyEmail}
                                                    onChange={handleChange}
                                                    placeholder="Enter the company email"
                                                />
                                            </Form.Group>

                                            <Form.Group className="apply-input-group">
                                                <Form.Label>Company Address</Form.Label>
                                                <Form.Control
                                                    className={
                                                        validated && !form.companyAddress.trim()
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                    as="textarea"
                                                    rows={3}
                                                    name="companyAddress"
                                                    value={form.companyAddress}
                                                    onChange={handleChange}
                                                    placeholder="Enter the company address"
                                                />
                                            </Form.Group>

                                            <div className="d-flex justify-content-center gap-2 mt-3">
                                                <Button type="submit" className="apply-submit-btn">
                                                    Save
                                                </Button>

                                                {companyDetails && (
                                                    <Button
                                                        className="apply-submit-btn"
                                                        onClick={() => setEditing(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </Form>
                                    )}
                                </Card.Body>
                            </Card>
                        </Container>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Company;