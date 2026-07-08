import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Button, Modal } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar.js";
import JobDetails from "../components/JobDetails.js";
import JobTable from "../components/JobTable.js";
import JobForm from "../components/JobForm.js";
import './Dashboard.css';

function Jobs () {
    const token = localStorage.getItem("token");
    const [jobs, setJobs] = useState([]);
    const [show, setShow] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState("");
    const [showDeleteModule, setShowDeleteModule] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const jobsPerPage = 6;

    const [form, setForm] = useState({
        title: "",
        department: "",
        openings: "",
        jobDescription: ""
    });

    useEffect(() => { setCurrentPage(1); }, [search, sortBy]);

    const fetchJobs = useCallback(async() => {
        const res = await axios.get("http://localhost:5000/jobs",
            {
                headers: { Authorization: token }
            }
        );
        setJobs(res.data);
    }, [token]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const addJob = async() => {
        try {
            if (editingId !== null) {
                await axios.put(`http://localhost:5000/jobs/${editingId}`,form,
                    {
                        headers: { Authorization: token }
                    }
                );
            } else {
                await axios.post( "http://localhost:5000/jobs",form,
                {
                    headers: { Authorization: token }
                }
            );
        }
        fetchJobs();
        setShow(false);
        setEditingId(null);
        setForm({
            title: "",
            department: "",
            openings: "",
            jobDescription: ""
        });

        } catch (err) {
            console.log(err);
        }
    };

    const deleteJob = async(id) => {
        await axios.delete(`http://localhost:5000/jobs/${id}`,
        {
            headers: { Authorization: token }
        }
        );
        fetchJobs();
    }

    const openDeleteModule = (id) => {
        setDeleteId(id);
        setShowDeleteModule(true);
    }

    const confirmDelete = async () => {
        await deleteJob(deleteId);
        setShowDeleteModule(false);
        setDeleteId(null);
    }

    let filteredJobs = jobs.filter(j => 
        j.title.toLowerCase().includes(search.toLowerCase()) || 
        j.department.toLowerCase().includes(search.toLowerCase()) ||
        j.openings.toString().includes(search.toLowerCase())
    );

    if (sortBy === "titleAsc") {
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (sortBy === "titleDesc") {
        filteredJobs.sort((a, b) => b.title.localeCompare(a.title));
    }
    else if (sortBy === "openingsAsc") {
        filteredJobs.sort((a, b) => a.openings - b.openings);
    }
    else if (sortBy === "openingsDesc") {
        filteredJobs.sort((a, b) => b.openings - a.openings);
    }

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    return (
        <>
            <CustomNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Container fluid className={`page-content ${collapsed ? "collapsed-content" : ""}`}>

                <Button className="add-btn" onClick={() => {
                        setEditingId(null);
                        setForm({
                        title: "",
                        department: "",
                        openings: "",
                        jobDescription: ""
                        });
                        setShow(true);
                    }}
                >
                <i className="bi bi-plus-circle me-2"></i>Add Job Opening
                </Button>
                    
                <div className="d-flex align-items-center mt-3 gap-2 mb-3">
                    <i class="bi bi-search-heart-fill"></i>
                    <input type="text" placeholder="Search Jobs" className="form-control search-input" 
                        value={search} onChange={(e)=> setSearch(e.target.value)} />
                    <select className="form-select sort-select" value={sortBy} 
                        onChange={(e)=> setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="titleAsc">Title (A-Z)</option>
                        <option value="titleDesc">Title (Z-A)</option>
                        <option value="openingsAsc">Openings (Asceding)</option>
                        <option value="openingsDesc">Openings (Descending)</option>
                    </select>
                </div>

                <JobTable filteredJobs={currentJobs} setSelected={setSelected} setShow={setShow} 
                    setEditingId={setEditingId} setForm={setForm} deleteJob={openDeleteModule}/>

                <div className="d-flex justify-content-center mt-3 gap-2">
                    <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Previous</Button>
                        {[...Array(totalPages)].map((_, index) => (
                            <Button key={index} size="sm" variant={currentPage === index + 1 ? "primary" : "outline-primary"}
                            onClick={() => setCurrentPage(index + 1)}>{index + 1}</Button>
                    ))}

                    <Button size="sm" disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
                </div>

            </Container>

            <JobForm show={show} setShow={setShow} form={form} setForm={setForm} addJob={addJob} editingId={editingId} />
            <JobDetails selected={selected} setSelected={setSelected} />

            <Modal show={showDeleteModule} onHide={() => setShowDeleteModule(false)} centered>
                <Modal.Header closeButton className="delete-modal-header">
                    <Modal.Title>Delete Job Opening?</Modal.Title>
                </Modal.Header>

                <Modal.Body className="delete-modal-body">
                    <div className="delete-icon">
                        <i className="bi bi-trash3-fill"></i>
                    </div>
                    <h5>Are you sure?</h5>
                    <p>
                        This job opening will be permanently removed from the system.
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

export default Jobs;