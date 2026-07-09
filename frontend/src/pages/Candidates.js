import { useEffect, useState, useCallback} from "react";
import axios from "axios";
import { Container, Button, Modal } from "react-bootstrap";

import CustomNavbar from "../components/CustomNavbar.js";
import CandidateTable from "../components/CandidateTable.js";
import CandidateForm from "../components/CandidateForm.js";
import CandidateDetails from "../components/CandidateDetails.js";
import './Dashboard.css';

function Candidates () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [resume, setResume] = useState(null);
    const [offerLetter, setOfferLetter] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [manualRecipients, setManualRecipients] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showDeleteModule, setShowDeleteModule] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [companyDetails, setCompanyDetails] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [otherStatusFilter, setOtherStatusFilter] = useState("");
    const candidatesPerPage = 4;

    const finalStatuses = ["Offer Accepted", "Offer Rejected", "Rejected", "Blacklisted"];
    const ratingStatuses = ["Shortlisted", "Screening Call", "In-Person Interview", "Negotiation"];
    const importantStatuses = ["All", "New Application", "Interview Scheduled", "In-Person Interview", "Rejected", "Offered",];
    const otherStatuses = ["Shortlisted", "Screening Call", "Negotiation", "Blacklisted", "Cooling Period", "Offer Rejected", "Offer Accepted"];
    const conductStatuses = ["Shortlisted", "Screening Call", "Rejected", "Offered", "Cooling Period", "In-Person Interview", "Negotiation", "Blacklisted"];

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "",
        qualification: "",
        previousEmployment: "",
        jobRole: "",
        status: "New Application",
        interviewDate: "",
        interviewTime: "",
        interviewLocation: "",
        noticePeriod: "",
        expectedSalary: "",
        currentSalary: "",
        aptitudeScore: "",
        skillRating: "",
        conduct: "",
        conductRound: "",
        ratingRecords: [],
        conductRecords: [],
        interviewRounds: [],
        extraInfo: "",
        note: "",
        resume: "",
        offerLetter: ""
    });

    useEffect(() => {
        if (selected) {
            axios.get(`http://localhost:5000/notes/${selected._id}`, {
                headers: { Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data"  }
            })
            .then(res => {
                setNotes(Array.isArray(res.data) ? res.data : []);

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setSelectedStatus(res.data[0].status);
                } else {
                    setSelectedStatus("");
                }
            })
            .catch(err => {
                console.log(err);
                setNotes([]);
                setSelectedStatus("");
            });
        }
    }, [selected, token]);

    useEffect(() => {
        if (form.status === "Interview Scheduled" && companyDetails?.companyAddress) {
            setForm((prev) => ({
                ...prev,
                interviewLocation: companyDetails.companyAddress
                
            }));
        }}, [form.status, companyDetails]
    );

    const getCompanyDetails = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/company-details",
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );

            if(res.data.length > 0 ) {
                setCompanyDetails(res.data[0]);
            }
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => {
        getCompanyDetails();
    }, [getCompanyDetails]);

    const fetchJobs = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => { 
        setCurrentPage(1); 
    }, [search, sortBy, statusFilter, otherStatusFilter]);

    const currentNote = notes.find(f => f.status?.trim() === selectedStatus?.trim());

    const fetchCandidates = useCallback(async() => {
        const res = await axios.get("http://localhost:5000/candidates",
        {
            headers: { Authorization: `Bearer ${token}` }
        }
        );
        setCandidates(res.data);
    }, [token]);

    const saveCandidate = async (e) => {
        setError("");
        e.preventDefault();
        setValidated(true);

        if(!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            setError("All fields are required");
            return;
        }

        if (!validateName(form.name)) {
            setError("Name can only contain letters and spaces");
            return;
        }

        if (!validateEmail(form.email)) {
            setError("Enter valid email");
            return;
        }

        if (!validatePhone(form.phone)) {
            setError("Phone number must be exactly 10 digits");
            return;
        }

        try {
            setError("");

            const updatedConductRecords = [...(form.conductRecords || [])];
            const updatedInterviewRounds = [...(form.interviewRounds || [])];

            const updatedRatingRecords = [...(form.ratingRecords || [])];

            if (form.rating && ratingStatuses.includes(form.status)) {
                const existingIndex = updatedRatingRecords.findIndex(
                    (record) => record.stage === form.status
                );

                const newRatingRecord = {
                    stage: form.status,
                    rating: Number(form.rating)
                };

                if (existingIndex !== -1) {
                    updatedRatingRecords[existingIndex] = newRatingRecord;
                } else {
                    updatedRatingRecords.push(newRatingRecord);
                }
            }

            if (form.status === "Interview Scheduled" && form.conductRound) {
                updatedInterviewRounds.push({
                    round: form.conductRound,
                    createdBy: localStorage.getItem("name") || "Unknown User",
                    createdAt: new Date()
                });
            }

            if (form.conduct && conductStatuses.includes(form.status)) {
                updatedConductRecords.push({
                    stage: form.status,
                    round: form.status === "In-Person Interview" ? form.conductRound : "",
                    conduct: form.conduct,
                    createdBy: localStorage.getItem("name") || "Unknown User",
                    createdAt: new Date()
                });
            }

            const formData = new FormData();

            const manualEmails = manualRecipients
            .split(",")
            .map(email => email.trim())
            .filter(email => email !== "");

            const allRecipients = [...selectedRecipients, ...manualEmails];

            allRecipients.forEach(email => {
                formData.append("recipients", email);
            });

            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("experience", form.experience);
            formData.append("qualification", form.qualification);
            formData.append("previousEmployment", form.previousEmployment);
            formData.append("status", form.status);
            formData.append("jobRole", form.jobRole);
            formData.append("aptitudeScore", form.aptitudeScore);
            formData.append("extraInfo", form.extraInfo || "");
            formData.append("interviewDate", form.interviewDate);
            formData.append("interviewTime", form.interviewTime);
            formData.append("interviewLocation", form.interviewLocation);
            formData.append("noticePeriod", form.noticePeriod);
            formData.append("expectedSalary", form.expectedSalary);
            formData.append("currentSalary", form.currentSalary);
            formData.append("note", form.note);
            formData.append("skillRating", form.skillRating);
            formData.append("conductRecords", JSON.stringify(updatedConductRecords));
            formData.append("ratingRecords", JSON.stringify(updatedRatingRecords));
            formData.append("interviewRounds", JSON.stringify(updatedInterviewRounds));

            if (resume) formData.append("resume", resume);
            if (offerLetter) formData.append("offerLetter", offerLetter);

            console.log("CONDUCT", updatedConductRecords)

            let candidateId;

            if (editingId) {
                await axios.put(`http://localhost:5000/candidates/${editingId}`, formData,
                    {
                        headers: { Authorization: token, "Content-Type": "multipart/form-data" }
                    }
                );
                candidateId = editingId;

            } else {
                const res = await axios.post("http://localhost:5000/candidates", formData,
                    {
                        headers: { Authorization: token, "Content-Type": "multipart/form-data"}
                    }
                );

                candidateId = res.data._id || res.data.candidate?._id;
                console.log("Created candidate ID:",candidateId);
            }

            if (form.note.trim() !== "") {
                await axios.post("http://localhost:5000/notes",
                {
                    candidateId,
                    status: form.status,
                    note: form.note
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
                );
            }

            const refreshed = await axios.get("http://localhost:5000/candidates", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCandidates(refreshed.data);
            setSelected(null);
            setShow(false);
            resetForm();

        } catch (err) {
            console.log("ERROR:",err.response?.data || err.message);
            setError(err.response?.data?.error || err.response?.data?.message || "Something went wrong");
        }
    };

    const deleteCandidate = async(id) => {
        await axios.delete(`http://localhost:5000/candidates/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
        );
        fetchCandidates();
    }

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/users-list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);

        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => {
        fetchCandidates();
        fetchJobs();
        fetchUsers();

        const interval = setInterval(fetchCandidates, 10000);

        return () => clearInterval(interval);

    }, [fetchCandidates,fetchJobs, fetchUsers]);

    const resetForm = () => {
        setEditingId(null);
        setResume(null);
        setOfferLetter(null);
        
        setForm({
            name: "",
            email: "",
            phone: "",
            experience: "",
            qualification: "",
            previousEmployment: "",
            status: "New Application",
            jobRole: "",
            interviewDate: "",
            interviewTime: "",
            interviewLocation: "",
            noticePeriod: "",
            expectedSalary: "",
            currentSalary: "",
            aptitudeScore: "",
            ratingRecords: [],
            skillRating: "",
            conduct: "",
            conductRound: "",
            conductRecords: [],
            interviewRounds: [],
            extraInfo: "",
            note: "",
            resume: "",
            offerLetter: ""
        });
    }

    const openDeleteModule = (id) => {
        setDeleteId(id);
        setShowDeleteModule(true);
    }

    const confirmDelete = async () => {
        await deleteCandidate(deleteId);
        setShowDeleteModule(false);
        setDeleteId(null);
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateName = (name) => {
        return /^[a-zA-Z\s]+$/.test(name.trim());
    };

    const validatePhone = (phone) => {
        return /^[0-9]{10}$/.test(phone);
    };
    
    let filteredCandidates = candidates
    .filter((candidate) =>
        candidate.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (statusFilter !== "All") {
        filteredCandidates = filteredCandidates.filter(c => c.status === statusFilter);
    }

    if (otherStatusFilter) {
        filteredCandidates = filteredCandidates.filter(c => c.status === otherStatusFilter);
    }

    if (sortBy === "nameAsc") {
        filteredCandidates.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sortBy === "nameDesc") {
        filteredCandidates.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if (sortBy === "idAsc") {
        filteredCandidates.sort((a, b) => a.candidateId.localeCompare(b.candidateId));
    }
    else if (sortBy === "idDesc") {
        filteredCandidates.sort((a, b) => b.candidateId.localeCompare(a.candidateId));
    }
    
    const indexOfLastCandidate = currentPage * candidatesPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;

    const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

    const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

    const getCoolingDaysLeft = (endDate) => {
        if (!endDate) return 0;

        const today = new Date();
        const end = new Date(endDate);
        const diff = end - today;

        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    };

    return (
        <>
            <CustomNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Container fluid className={`page-content ${collapsed ? "collapsed-content" : ""}`} >
                <Button className="add-btn" onClick={()=> {
                    resetForm();
                    setValidated(false);
                    setShow(true);
                }}><i className="bi bi-plus-circle me-2"></i>Add Candidate</Button>

                <div className="d-flex align-items-center mt-3 gap-2 mb-4">
                    <i className="bi bi-search-heart-fill"></i>
                    <input type="text" placeholder="Search Candidates By Name" 
                        className="form-control search-input" value={search} onChange={(e)=> 
                        setSearch(e.target.value)} />
                    <select className="form-select sort-select" value={sortBy} onChange={(e)=> 
                        setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="nameAsc">Name (A-Z)</option>
                        <option value="nameDesc">Name (Z-A)</option>
                        <option value="idAsc">Candidate ID (Ascending)</option>
                        <option value="idDesc">Candidate ID (Descending)</option>
                    </select>
                </div>

                <div className="status-filter-tabs">
                    {importantStatuses.map((status) => {
                        const count = status === "All" ? candidates.length : candidates.filter((c) => c.status === status).length;

                        return (
                            <button key={status} className={`status-tab ${statusFilter === status && !otherStatusFilter ? "active" : ""} status-tab-${status.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={() => {
                                    setStatusFilter(status);
                                    setOtherStatusFilter("");
                                }}
                            >
                                <i className={
                                    status === "All" ? "bi bi-grid-fill" :
                                    status === "New Application" ? "bi bi-inbox-fill" :
                                    status === "Shortlisted" ? "bi bi-star-fill" :
                                    status === "Interview Scheduled" ? "bi bi-calendar-check-fill" :
                                    status === "In-Person Interview" ? "bi bi-people-fill" :
                                    status === "Rejected" ? "bi bi-x-circle-fill" :
                                    status === "Offered" ? "bi bi-file-earmark-check-fill" :
                                    "bi bi-check-circle-fill"
                                }></i>

                                <span>{status}</span>
                                <small>{count}</small>
                            </button>
                        );
                    })}

                    <select className={`status-dropdown-tab ${otherStatusFilter ? "active" : ""}`} value={otherStatusFilter}
                        onChange={(e) => {
                            setOtherStatusFilter(e.target.value);
                            setStatusFilter("All");
                        }}
                    >
                        <option value="">More Statuses</option>
                        {otherStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status} ({candidates.filter((c) => c.status === status).length})
                            </option>
                        ))}
                    </select>
                </div>

                <CandidateTable candidates={candidates} role={role} setSelected={setSelected} 
                    deleteCandidate={openDeleteModule} setEditingId={setEditingId} setForm={setForm} 
                    setShow={setShow}  filteredCandidates={currentCandidates} editingId={editingId} 
                />

                <div className="d-flex justify-content-center mt-3 gap-2">
                    <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Previous
                    </Button>

                    {[...Array(totalPages)].map((_, index) => (
                        <Button key={index} size="sm" 
                            variant={currentPage === index + 1 ? "primary" : "outline-primary"}
                            onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                        </Button>
                    ))}

                    <Button size="sm" disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(currentPage + 1)}>Next
                    </Button>
                </div>
            </Container>

            <CandidateForm show={show} setShow={setShow} form={form} setForm={setForm} saveCandidate={saveCandidate} 
                editingId={editingId} role={role} setResume={setResume} validated={validated}
                setOfferLetter={setOfferLetter} error={error} setError={setError}  users={users} 
                selectedRecipients={selectedRecipients} setSelectedRecipients={setSelectedRecipients} 
                manualRecipients={manualRecipients} setManualRecipients={setManualRecipients} 
                finalStatuses={finalStatuses} conductStatuses={conductStatuses} jobs={jobs} companyDetails={companyDetails} setCompanyDetails={setCompanyDetails}
            />
            
            <CandidateDetails selected={selected} setSelected={setSelected} selectedStatus={selectedStatus} 
                setSelectedStatus={setSelectedStatus} currentNote={currentNote} notes={notes} 
                role={role} setForm={setForm} setShow={setShow} 
                getCoolingDaysLeft={getCoolingDaysLeft}
            />

            <Modal show={showDeleteModule} onHide={() => setShowDeleteModule(false)} centered>
                <Modal.Header closeButton className="delete-modal-header">
                    <Modal.Title>Delete Candidate?</Modal.Title>
                </Modal.Header>

                <Modal.Body className="delete-modal-body">
                    <div className="delete-icon">
                        <i className="bi bi-trash3-fill"></i>
                    </div>

                    <h5>Are you sure?</h5>
                    <p>
                        This candidate will be permanently removed from the system.
                    </p>
                </Modal.Body>
                
                <Modal.Footer className="delete-modal-footer">
                    <Button className="delete-confirm-btn" onClick={confirmDelete}>
                            Yes, Delete
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModule(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}

export default Candidates;