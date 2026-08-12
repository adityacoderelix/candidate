import { Modal } from "react-bootstrap";

function JobDetails({ selected, setSelected }) {
    if (!selected) return null;

    return (
        <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg" >
            <Modal.Header closeButton className="job-details-header">
                <div className="job-header-left">
                    <div className="job-details-icon">
                        <i className="bi bi-briefcase"></i>
                    </div>

                    <div>
                        <h2>{selected.title}</h2>
                        <p><b>{selected.department} • {selected.openings} Opening</b><b>{selected.openings > 1 && "s"}</b></p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="job-details-body">
                <div className="job-info-card">
                    <div className="job-info-row">
                        <span><i className="bi bi-building me-2"></i>Department</span>
                        <strong>{selected.department}</strong>
                    </div>

                    <div className="job-info-row">
                        <span><i className="bi bi-people me-2"></i>Open Positions</span>
                        <strong>{selected.openings}</strong>
                    </div>

                    <div className="job-info-description">
                        <h6><i className="bi bi-file-text me-2"></i>Job Description</h6>
                        <p>{selected.jobDescription || "No description available."}</p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default JobDetails;