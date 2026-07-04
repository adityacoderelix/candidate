import { useEffect } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import "../pages/Dashboard.css";

function CandidateForm({ show, setShow, form, setForm, saveCandidate, editingId, setResume, validated, setOfferLetter, error, users, selectedRecipients, setSelectedRecipients, manualRecipients, setManualRecipients, finalStatuses, conductStatuses, jobs
}) 
{
    const ratingStatuses = ["Screening Call", "In-Person Interview", "Shortlisted", "Negotiation"];

    useEffect(() => {
        if (show) {
            const latestConductRecord = form.conductRecords?.length > 0 ? form.conductRecords[form.conductRecords.length - 1]: null;

            const latestInterviewRound = form.interviewRounds?.length > 0 ? form.interviewRounds[form.interviewRounds.length - 1]: null;

            const latestRating = form.ratingRecords?.find((record) => record.stage === form.status);

            setForm((prev) => ({
                ...prev,
                conduct: prev.conduct || latestConductRecord?.conduct || "",
                conductRound: prev.conductRound || latestInterviewRound?.round || "",
                rating: latestRating?.rating || prev.rating || 5,
                extraInfo: ""
            }));

            setSelectedRecipients([]);
            setManualRecipients("");
            setResume(null);
            setOfferLetter(null);
        }
    }, [show]);

    const closeModal = () => {
        setForm((prev) => ({
            ...prev,
            extraInfo: "",
            note: "",
            conduct: prev.conduct || "",
            conductRound: prev.conductRound || ""
        }));

        setSelectedRecipients([]);
        setManualRecipients("");
        setResume(null);
        setOfferLetter(null);
        setShow(false);
    };

    return (
        <Modal show={show} onHide={closeModal} scrollable size="lg">
            <Modal.Header className="candidate-modal-header">
                <div className="candidate-header-content">
                    <Modal.Title>
                        {editingId ? "Edit Candidate" : "Add Candidate"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Modal.Body>
                <form className="form-box" onSubmit={saveCandidate} noValidate>
                    {error && (
                        <Alert variant="danger" className="custom-alert">{error}</Alert>
                    )}

                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Application Status</label>

                            {!editingId ? (
                                <select className="form-select" value="New Application" disabled>
                                    <option>New Application</option>
                                </select>
                            ) : (
                                <select className="form-select" value={form.status || "New Application"}
                                    disabled={editingId && finalStatuses.includes(form.savedStatus)}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            status: e.target.value
                                        })
                                    }
                                >
                                    <option>New Application</option>
                                    <option>Shortlisted</option>
                                    <option>Screening Call</option>
                                    <option>Interview Scheduled</option>
                                    <option>In-Person Interview</option>
                                    <option>Negotiation</option>
                                    <option>Offered</option>
                                    <option>Offer Accepted</option>
                                    <option>Offer Rejected</option>
                                    <option>Rejected</option>
                                    <option>Blacklisted</option>
                                    <option>Cooling Period</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">
                                Name <span className="text-danger">*</span>
                            </label>
                            <input type="text"
                                className={`form-control ${
                                    validated && !form.name?.trim() ? "is-invalid" : ""
                                }`}
                                value={form.name || ""}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">
                                Please enter candidate name
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">
                                Email <span className="text-danger">*</span>
                            </label>
                            <input type="email"
                                className={`form-control ${
                                    validated && !form.email?.trim() ? "is-invalid" : ""
                                }`}
                                value={form.email || ""}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">
                                Please enter candidate email
                            </div>
                        </div>

                        <div className="mb-3 col">
                            <label className="form-label">
                                Phone Number <span className="text-danger">*</span>
                            </label>
                            <input type="text" maxLength={10}
                                className={`form-control ${
                                    validated && !form.phone?.trim() ? "is-invalid" : ""
                                }`}
                                value={form.phone || ""}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">
                                Please enter candidate phone number
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Job Opening</label>
                            <select className="form-select" value={form.jobRole || ""}
                                onChange={(e) =>
                                    setForm({ ...form, jobRole: e.target.value })
                                }
                            >
                                <option value="">Select Job Opening</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job.title}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Experience</label>
                            <input type="text" className="form-control" value={form.experience || ""}
                                onChange={(e) =>
                                    setForm({ ...form, experience: e.target.value })
                                }
                            />
                        </div>

                        <div className="mb-3 col">
                            <label className="form-label">Qualification</label>
                            <input type="text" className="form-control" value={form.qualification || ""}
                                onChange={(e) =>
                                    setForm({ ...form, qualification: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {form.status === "Screening Call" && (
                        <>
                            <div className="row">
                                <div className="mb-3 col">
                                    <label className="form-label">
                                        Previous Employment Details
                                    </label>
                                    <input type="text" className="form-control" value={form.previousEmployment || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                previousEmployment: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="mb-3 col">
                                    <label className="form-label">Notice Period</label>
                                    <input className="form-control mb-2" value={form.noticePeriod || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                noticePeriod: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-3 col">
                                    <label className="form-label">Current Salary</label>
                                    <input className="form-control mb-2" value={form.currentSalary || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                currentSalary: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="mb-3 col">
                                    <label className="form-label">Expected Salary</label>
                                    <input className="form-control mb-2" value={form.expectedSalary || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                expectedSalary: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {ratingStatuses.includes(form.status) && (
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex justify-content-between">
                                <span>Candidate Rating</span>
                                <span className="rating-badge">{form.rating || 5}/10</span>
                            </Form.Label>

                            <Form.Range min={1} max={10} step={0.1} value={form.rating}
                                onChange={(e)=>
                                    setForm({
                                        ...form,
                                        rating: parseFloat(e.target.value)
                                    })
                                }
                            />

                            <div className="rating-labels">
                                <span>Poor</span>
                                <span>Average</span>
                                <span>Excellent</span>
                            </div>
                        </Form.Group>
                    )}

                    <div className="row">
                        {(form.status === "Interview Scheduled" ||
                            form.status === "In-Person Interview") && (
                            <div className="mb-3 col">
                                <label className="form-label">Interview Round</label>
                                <select className="form-select" value={form.conductRound || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            conductRound: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select Round</option>
                                    <option value="Round 1">Round 1</option>
                                    <option value="Round 2">Round 2</option>
                                    <option value="Round 3">Round 3</option>
                                    <option value="Round 4">Round 4</option>
                                </select>
                            </div>
                        )}

                        {conductStatuses.includes(form.status) && (
                            <div className="mb-3 col">
                                <label className="form-label">Conduct</label>
                                <select className="form-select" value={form.conduct || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            conduct: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select Conduct</option>
                                    <option value="Good">Good</option>
                                    <option value="Average">Average</option>
                                    <option value="Bad">Bad</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {form.status === "Interview Scheduled" && (
                        <>
                            <div className="row">
                                <div className="mb-3 col">
                                    <label className="form-label">Interview Date</label>
                                    <input type="date" className="form-control" value={form.interviewDate || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                interviewDate: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-3 col">
                                    <label className="form-label">Interview Time</label>
                                    <input type="time" className="form-control" value={form.interviewTime || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                interviewTime: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="mb-3 col">
                                    <label className="form-label">Interview Location</label>
                                    <input className="form-control mb-2" value={form.interviewLocation || ""} readOnly disabled/>
                                </div>
                            </div>
                        </>
                    )}

                    {form.status === "In-Person Interview" && (
                        <div className="row">
                            <div className="mb-3 col">
                                <label className="form-label">Aptitude Test Score (Out of 30)</label>
                                <input type="number" min="0" className="form-control mb-2" value={form.aptitudeScore || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            aptitudeScore: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="mb-3 col">
                                <label className="form-label">Skill Rating (1-10)</label>
                                <input type="number" min="1" max="10" className="form-control mb-2" value={form.skillRating || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            skillRating: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <div className="documents-section">
                        {form.resume && (
                            <div className="current-file mb-3">
                                <span className="current-file-label d-block mb-2">Current Resume</span>
                                <Button as="a" href={form.resume} target="_blank" rel="noopener noreferrer" size="sm" className="resume-btn">
                                    <i className="bi bi-file-earmark-pdf me-2"></i>
                                    View Existing Resume
                                </Button>
                            </div>
                        )}

                        <div className="file-input-group mb-3">
                            <label className="form-label">Resume</label>
                            <input type="file" accept=".jpeg,.jpg,.png,.pdf,.doc,.docx" className="form-control" id="inputResume"
                                onChange={(e) => setResume(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {form.status === "Offered" && (
                        <div className="file-input-group mb-3">
                            <label className="form-label">Offer Letter</label>
                            <input type="file" accept=".jpeg,.png,.pdf,.doc,.docx" className="form-control" id="inputOfferLetter"
                                onChange={(e) => setOfferLetter(e.target.files[0])}
                            />
                        </div>
                    )}

                    {(form.status === "Offered" || form.status === "Interview Scheduled") && (
                        <div className="mb-3">
                            <label className="form-label">Send Email To <span className="text-danger">*</span></label>
                            <select multiple className="form-control" value={selectedRecipients}
                                onChange={(e) =>
                                    setSelectedRecipients(
                                        Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                        )
                                    )
                                }
                            >
                                {users.map((user) => (
                                    <option key={user._id} value={user.email}>
                                        {user.name} - {user.email} ({user.role})
                                    </option>
                                ))}
                            </select>

                            <small className="text-muted">
                                Hold Ctrl to select multiple users
                            </small>

                            <input type="text" className="form-control mt-2" value={manualRecipients} placeholder="Add other emails separated by commas"
                                onChange={(e) =>
                                    setManualRecipients(e.target.value)
                                }
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Note</label>
                        <textarea rows="2" className="form-control" value={form.note || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    note: e.target.value
                                })
                            }
                        />
                    </div>

                    {form.status === "Interview Scheduled" && (
                        <div className="mb-3">
                            <label className="form-label">
                                Extra Information for Email
                            </label>
                            <textarea className="form-control" rows="4" placeholder="Add extra information to be appended to this email only"
                                value={form.extraInfo || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        extraInfo: e.target.value
                                    })
                                }
                            />
                        </div>
                    )}

                    <div className="d-grid gap-2">
                        <Button className="custom-button" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default CandidateForm;