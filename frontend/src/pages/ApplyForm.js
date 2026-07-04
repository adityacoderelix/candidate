import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import "./ApplyForm.css";

function ApplyForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        coverLetter: "",
        jobRole: ""
    });

    const [resume, setResume] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateName = (name) => /^[A-Za-z\s]+$/.test(name.trim());
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
    const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        axios.get("http://localhost:5000/jobs/public")
            .then((res) => {
                console.log("Jobs fetched:", res.data);

                if (Array.isArray(res.data)) {
                    setJobs(res.data);
                } else {
                    setJobs(res.data.jobs || []);
                }
            })
            .catch((err) => {
                console.log(err);
                setJobs([]);
            });
    }, []);

    const submitApplication = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);
        setSuccess("");
        setError("");

        if (
            !form.name.trim() ||
            !form.phone.trim() ||
            !form.email.trim() ||
            !form.coverLetter.trim() ||
            !form.jobRole.trim() ||
            !resume
        ) {
            setError("All fields are required");
            return;
        }

        if (!validateName(form.name)) {
            setError("Name can only contain letters and spaces");
            return;
        }

        if (!validateEmail(form.email)) {
            setError("Enter a valid email address");
            return;
        }

        if (!validatePhone(form.phone)) {
            setError("Phone number must be exactly 10 digits");
            return;
        }

        const data = new FormData();

        data.append("name", form.name);
        data.append("phone", form.phone);
        data.append("email", form.email);
        data.append("coverLetter", form.coverLetter);
        data.append("jobRole", form.jobRole);
        data.append("resume", resume);

        try {
            setLoading(true);

            await axios.post("http://localhost:5000/candidates/apply", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccess("Application submitted successfully!");

            setForm({
                name: "",
                phone: "",
                email: "",
                coverLetter: "",
                jobRole: ""
            });

            setResume(null);
            setValidated(false);

            const resumeInput = document.getElementById("resumeInput");
            if (resumeInput) resumeInput.value = "";

        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="public-apply-page">
            <div className="apply-left">
                <h1>JOIN OUR TEAM</h1>
                <img
                    src="https://darvideo.tv/wp-content/uploads/Animation-Studios-Comparing.png"
                    alt="Office work illustration"
                    className="apply-illustration"
                />
            </div>

            <div className="apply-right">
                <div className="apply-form-box">
                    <h2>Send In Your Resume</h2>

                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={submitApplication} noValidate>
                        <Form.Group className="apply-input-group">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                className={
                                    validated && (!form.name.trim() || !validateName(form.name))
                                        ? "is-invalid"
                                        : ""
                                }
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="apply-input-group">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        className={
                                            validated && (!form.email.trim() || !validateEmail(form.email))
                                                ? "is-invalid"
                                                : ""
                                        }
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="apply-input-group">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        className={
                                            validated && (!form.phone.trim() || !validatePhone(form.phone))
                                                ? "is-invalid"
                                                : ""
                                        }
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        maxLength={10}
                                        onChange={handleChange}
                                        placeholder="10 digits"
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="apply-input-group">
                            <Form.Label>Job Role</Form.Label>
                            <Form.Select
                                name="jobRole"
                                className={validated && !form.jobRole.trim() ? "is-invalid" : ""}
                                value={form.jobRole}
                                onChange={handleChange}
                            >
                                <option value="">Select Job Opening</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job.title}>
                                        {job.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="apply-input-group">
                            <Form.Label>Cover Letter</Form.Label>
                            <Form.Control as="textarea" rows={6} name="coverLetter" value={form.coverLetter} onChange={handleChange} placeholder="Tell us about yourself, your skills, and why you'd liked to join our team..." 
                                className={validated && !form.coverLetter.trim() ? "is-invalid" : ""} />
                        </Form.Group>

                        <Form.Group className="apply-input-group">
                            <Form.Label>Resume</Form.Label>
                            <Form.Control
                                id="resumeInput"
                                className={validated && !resume ? "is-invalid" : ""}
                                type="file"
                                accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
                                onChange={(e) => setResume(e.target.files[0])}
                            />
                        </Form.Group>

                        <Button type="submit" className="apply-submit-btn" disabled={loading}>
                            {loading ? "Submitting..." : "Send Application"}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default ApplyForm;