function JobTable({ setSelected, deleteJob, setEditingId, setForm, setShow, filteredJobs }) {
    return (
        <div className="job-card-grid">
            {filteredJobs.map((job, index) => (
                <div className="job-card clickable-row" key={job._id} onClick={() => setSelected(job)}>
                    <div className="job-card-top">
                        <div className="job-icon"><i className="bi bi-briefcase"></i></div>
                    </div>

                    <h4>{job.title}</h4>

                    <div className="job-meta">
                        <span><i className="bi bi-geo-alt"></i> {job.department}</span>
                        <span><i className="bi bi-people"></i> {job.openings} openings</span>
                    </div>

                    <div className="job-card-footer">
                        <div className="job-actions">
                            <button className="jobs-buttons" onClick={() => setSelected(job)}><i className="bi bi-eye"></i> View</button>
                            <button
                            className="jobs-buttons"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelected(null);
                                setEditingId(job._id);
                                setForm({
                                title: job.title || "",
                                department: job.department || "",
                                openings: job.openings || "",
                                jobDescription: job.jobDescription || ""
                                });
                                setShow(true);
                            }}
                            >
                            <i className="bi bi-pencil"></i>
                            </button>

                            <button className="jobs-buttons danger" onClick={(e) => { e.stopPropagation(); deleteJob(job._id)}}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default JobTable;