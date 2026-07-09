import { useState, useEffect, useMemo } from "react";
import { Button, Modal } from "react-bootstrap";

function CandidateDetails({selected, setSelected, selectedStatus, setSelectedStatus, currentNote, notes, getCoolingDaysLeft
}) {
    const [showAllLogs, setShowAllLogs] = useState(false);
    const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
    const [selectedConductIndex, setSelectedConductIndex] = useState(0);
    const [selectedConductStage, setSelectedConductStage] = useState("");

    const statusClass = (status) => `status-badge status-${status?.toLowerCase().replace(/\s+/g, "-")}`;
    
    const conductRecords = useMemo(
    () => selected?.conductRecords || [],
    [selected]
);

const conductStages = useMemo(
    () => [...new Set(conductRecords.map((record) => record.stage))],
    [conductRecords]
);

useEffect(() => {
    if (conductStages.length > 0) {
        setSelectedConductStage(conductStages[0]);
    } else {
        setSelectedConductStage("");
    }

    setSelectedConductIndex(0);
}, [conductStages]);

    if (!selected) return null;

    const displayValue = (value) => value || "-";
    const initials = selected.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const sortedLogs = [...(selected.changeLogs || [])].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    const visibleLogs = showAllLogs ? sortedLogs : sortedLogs.slice(0, 5);

    return (
        <Modal show={!!selected} onHide={() => setSelected(null)} size="xl" centered scrollable>
            <Modal.Header className="compact-details-header">
                <div className="compact-header-left">

                    <div className="compact-avatar">{initials}</div>

                    <div>
                        <h3>{selected.name}</h3>
                        <p>
                            {selected.candidateId} · {selected.jobRole || "No role selected"}
                        </p>
                    </div>
                </div>

                <div className="compact-header-right">
                    <span className={statusClass(selected.status)}>
                        {selected.status}
                    </span>
                </div>
            </Modal.Header>

            <Modal.Body className="compact-details-body">
                <section>
                    <h5>PERSONAL INFORMATION</h5>

                    <div className="compact-grid">
                        <div>
                            <span className="document-text">Email</span>
                            <strong>{displayValue(selected.email)}</strong>
                        </div>

                        <div>
                            <span className="document-text">Phone</span>
                            <strong>{displayValue(selected.phone)}</strong>
                        </div>

                        <div>
                            <span className="document-text">Qualification</span>
                            <strong>{displayValue(selected.qualification)}</strong>
                        </div>

                        <div>
                            <span className="document-text">Experience</span>
                            <strong>{displayValue(selected.experience)}</strong>
                        </div>

                        <div>
                            <span className="document-text">Previous Employment</span>
                            <strong>{displayValue(selected.previousEmployment)}</strong>
                        </div>
                    </div>
                </section>

                <section>
                    <h5>APPLICATION</h5>

                    <div className="compact-grid">
                        <div>
                            <span className="document-text">Applied Role</span>
                            <strong>{displayValue(selected.jobRole)}</strong>
                        </div>

                        <div>
                            <span className="document-text">Date</span>
                            <strong>
                                {selected.applicationDate
                                    ? new Date(selected.applicationDate).toLocaleDateString()
                                    : selected.createdAt
                                    ? new Date(selected.createdAt).toLocaleDateString()
                                    : "-"}
                            </strong>
                        </div>

                        <div>
                            <span className="document-text">Time</span>
                            <strong>
                                {selected.applicationDate
                                    ? new Date(selected.applicationDate).toLocaleTimeString()
                                    : selected.createdAt
                                    ? new Date(selected.createdAt).toLocaleTimeString()
                                    : "-"}
                            </strong>
                        </div>
                    </div>
                </section>

                {(selected.noticePeriod || selected.currentSalary || selected.expectedSalary) && (
                    <section>
                        <h5>SCREENING DETAILS</h5>

                        <div className="compact-grid">
                            <div>
                                <span className="document-text">Notice Period</span>
                                <strong>{displayValue(selected.noticePeriod)}</strong>
                            </div>

                            <div>
                                <span className="document-text">Current Salary</span>
                                <strong>{displayValue(selected.currentSalary)}</strong>
                            </div>

                            <div>
                                <span className="document-text">Expected Salary</span>
                                <strong>{displayValue(selected.expectedSalary)}</strong>
                            </div>
                        </div>
                    </section>
                )}

                {(selected.interviewDate || selected.interviewTime || selected.interviewLocation) && (
                    <section>
                        <h5>INTERVIEW INFORMATION</h5>

                        <div className="compact-grid">
                            <div>
                                <span className="document-text">Date</span>
                                <strong>{displayValue(selected.interviewDate)}</strong>
                            </div>

                            <div>
                                <span className="document-text">Time</span>
                                <strong>{displayValue(selected.interviewTime)}</strong>
                            </div>

                            <div>
                                <span className="document-text">Location</span>
                                <strong>{displayValue(selected.interviewLocation)}</strong>
                            </div>
                        </div>
                    </section>
                )}

                {(selected.aptitudeScore || selected.skillRating) && (
                    <section>
                        <h5>ASSESSMENT</h5>

                        <div className="compact-grid">
                            <div>
                                <span className="document-text">Aptitude Score</span>
                                <strong>{displayValue(selected.aptitudeScore)}</strong>
                            </div>

                            <div>
                                <span className="document-text">Skill Rating</span>
                                <strong>{selected.skillRating ? `${selected.skillRating}/10` : "-"}</strong>
                            </div>
                        </div>
                    </section>
                )}

                {selected.status === "Cooling Period" && (
                    <section>
                        <h5>COOLING PERIOD</h5>

                        <div className="compact-grid">
                            <div>
                                <span className="document-text">Days Left</span>
                                <strong>{getCoolingDaysLeft(selected.coolingPeriodEnd)} days</strong>
                            </div>

                            <div>
                                <span className="document-text">Start</span>
                                <strong>
                                    {selected.coolingPeriodStart
                                        ? new Date(selected.coolingPeriodStart).toLocaleDateString()
                                        : "-"}
                                </strong>
                            </div>

                            <div>
                                <span className="document-text">End</span>
                                <strong>
                                    {selected.coolingPeriodEnd
                                        ? new Date(selected.coolingPeriodEnd).toLocaleDateString()
                                        : "-"}
                                </strong>
                            </div>
                        </div>
                    </section>
                )}

                <section>
                    <h5>DOCUMENTS</h5>

                    <div className="document-grid">
                        <DocumentCard title="Resume" file={selected.resume} />
                        <DocumentCard title="Offer Letter" file={selected.offerLetter} />
                    </div>
                </section>

                {selected.coverLetter && (
                    <section>
                        <h5>COVER LETTER</h5>

                        <div className="compact-note-box">
                            <p
                                className={
                                    showFullCoverLetter
                                        ? "cover-letter-full"
                                        : "cover-letter-preview"
                                }
                            >
                                {selected.coverLetter}
                            </p>

                            {selected.coverLetter.length > 300 && (
                                <Button
                                    variant="link"
                                    className="p-0 mt-2"
                                    onClick={() => setShowFullCoverLetter(!showFullCoverLetter)}
                                >
                                    {showFullCoverLetter ? "Show Less" : "Read More"}
                                </Button>
                            )}
                        </div>
                    </section>
                )}

                <section>
                    <h5>CONDUCT</h5>

                    {conductRecords.length > 0 ? (
                        <>
                            <select
                                className="form-select compact-select"
                                value={selectedConductStage}
                                onChange={(e) => {
                                    setSelectedConductStage(e.target.value);
                                    setSelectedConductIndex(0);
                                }}
                            >
                                {conductStages.map((stage) => (
                                    <option key={stage} value={stage}>
                                        {stage}
                                    </option>
                                ))}
                            </select>

                            <div className="compact-note-box">
                                {(() => {
                                    const filteredConducts = conductRecords.filter(
                                        (record) => record.stage === selectedConductStage
                                    );

                                    const current = filteredConducts[selectedConductIndex] || filteredConducts[0];

                                    return current ? (
                                        <>
                                            <strong>{current.conduct || "-"}</strong>
                                            <p>
                                                {current.stage}
                                                {current.round ? ` · ${current.round}` : ""}
                                            </p>
                                            <small>
                                                Added by {current.createdBy || "Unknown User"} on{" "}
                                                {current.createdAt
                                                    ? new Date(current.createdAt).toLocaleString()
                                                    : "Unknown date"}
                                            </small>
                                        </>
                                    ) : (
                                        <p>No conduct available</p>
                                    );
                                })()}
                            </div>
                        </>
                    ) : (
                        <div className="compact-note-box">
                            <p>No conduct added yet.</p>
                        </div>
                    )}
                </section>
                
                <section>
                    <h5>RATING HISTORY</h5>

                    {selected.ratingRecords?.length > 0 ? (
                        <table className="rating-table">
                        <thead>
                            <tr>
                            <th>Stage</th>
                            <th>Rating</th>
                            </tr>
                        </thead>

                        <tbody>
                            {selected.ratingRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.stage}</td>
                                <td>{Number(record.rating).toFixed(1)}/10</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <div className="compact-note-box">
                        <p>No ratings added yet.</p>
                        </div>
                    )}
                    </section>

                <section>
                    <h5>NOTES</h5>

                    <select
                        className="form-select compact-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {notes.length > 0 ? (
                            notes.map((note) => (
                                <option key={note._id} value={note.status}>
                                    {note.status}
                                </option>
                            ))
                        ) : (
                            <option value="">No notes yet</option>
                        )}
                    </select>

                    <div className="compact-note-box">
                        {currentNote ? (
                            <>
                                <strong>{currentNote.status}</strong>
                                <p>{currentNote.note}</p>
                                <small>
                                    Added by {currentNote.createdBy || "Unknown User"} on{" "}
                                    {currentNote.createdAt
                                        ? new Date(currentNote.createdAt).toLocaleString()
                                        : "Unknown date"}
                                </small>
                            </>
                        ) : (
                            <p>No notes available</p>
                        )}
                    </div>
                </section>

                <section>
                    <h5>CHANGE HISTORY</h5>

                    {visibleLogs.length > 0 ? (
                        <>
                            {visibleLogs.map((log, index) => (
                                <div className="compact-log-box" key={index}>
                                    <p>
                                        <strong>{log.field}</strong> changed from{" "}
                                        <span>{log.oldValue || "Empty"}</span> to{" "}
                                        <span>{log.newValue || "Empty"}</span>
                                    </p>

                                    <small>
                                        By {log.changedBy || "Unknown User"} on{" "}
                                        {log.changedAt
                                            ? new Date(log.changedAt).toLocaleString()
                                            : "Unknown date"}
                                    </small>
                                </div>
                            ))}

                            {sortedLogs.length > 5 && (
                                <div className="text-center mt-3">
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => setShowAllLogs(!showAllLogs)}
                                    >
                                        {showAllLogs
                                            ? "Show Recent 5 Only"
                                            : `View All Changes (${sortedLogs.length})`}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-muted">No changes recorded yet.</p>
                    )}
                </section>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button className="close-btn" onClick={() => setSelected(null)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function DocumentCard({ title, file }) {
    return (
        <div className="document-card">
            <div>
                <i className="bi bi-file-earmark-text"></i>
            </div>

            <span>
                <strong>{title}</strong>
                <small>{file ? "Uploaded" : "Not uploaded"}</small>
            </span>

            {file && (
                <a href={file} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-arrow-up-right-circle document-icon"></i>
                </a>
            )}
        </div>
    );
}

export default CandidateDetails;