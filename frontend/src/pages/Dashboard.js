import { Card, Row, Col, Button, Container } from "react-bootstrap";
import { BriefcaseFill, PeopleFill, ClipboardCheckFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import CustomNavbar from "../components/CustomNavbar.js";
import '../App.css';
import './Dashboard.css';

function Dashboard () {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const jobsRes = await axios.get("http://localhost:5000/jobs", config);
            const candidateRes = await axios.get("http://localhost:5000/candidates", config);

            setJobs(jobsRes.data);
            setCandidates(candidateRes.data);
            
        } catch (err) {
            console.log(err);
        }
    }, [token]);
    
    useEffect(() => { fetchData(); }, [fetchData]);

    const totalJobs = jobs.length;
    const totalApplicants = candidates.length;
    const totalOpenings = jobs.reduce((total, job) => total + Number(job.openings), 0);

    return (
        <>
            <div className="dashboard-page">
            <CustomNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Container fluid className={`page-content dashboard-content ${collapsed ? "collapsed-content" : ""}`}>
                    <div className="welcome-card">
                        <div>
                            <p className="welcome-date">
                            {new Date().toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                            </p>
                            <h1>Welcome back, {localStorage.getItem("name") || "User"}!</h1>
                        </div>
                        <div className="welcome-emoji">👩‍💻</div>
                    </div>

                    <Row className="g-3 mt-3 dashboard-stats-row">
                        <Col lg={4} md={4} sm={12}>
                            <Card body className="dashboard-card shadow card border-0 card text-center 
                                mb-3 custom-card">
                                <div className="icon-circle jobs-bg">
                                    <BriefcaseFill size={28} />
                                </div>
                                <h5 className="card-title mt-4">Total Jobs</h5>
                                <h1 className="stats-number">{totalJobs}</h1>
                            </Card>
                        </Col>
                        <Col lg={4} md={4} sm={12}>
                            <Card body className="dashboard-card shadow card border-0 card text-center 
                                mb-3 custom-card">
                                <div className="icon-circle applicants-bg">
                                    <PeopleFill size={28} />
                                </div>
                                <h5 className="card-title mt-4">Total Applicants</h5>
                                <h1 className="stats-number">{totalApplicants}</h1>
                            </Card>
                        </Col>
                        <Col lg={4} md={4} sm={12}>
                            <Card body className="dashboard-card shadow card border-0 card text-center 
                                mb-3 custom-card">
                                <div className="icon-circle openings-bg">
                                    <ClipboardCheckFill size={28} />
                                </div>
                                <h5 className="card-title mt-4">Job Openings</h5>
                                <h1 className="stats-number">{totalOpenings}</h1>
                            </Card>
                        </Col>
                    </Row>
                    <div className="mt-3 d-grid gap-2 d-md-flex justify-content-md-center">
                        <Button className="btn custom-button btn-lg" onClick={()=>navigate("/candidates")}>
                            Manage Candidates</Button>
                        <Button className="btn custom-button btn-lg" onClick={()=>navigate("/jobs")}>
                            Manage Job Openings</Button>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Dashboard;