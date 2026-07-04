import { Button } from "react-bootstrap";
import "../pages/Dashboard.css";

function CandidateTable({role, setSelected, deleteCandidate, setForm, setShow, filteredCandidates, setEditingId}) {
    const validConduct = ["Good", "Average", "Bad"];

    const sortedCandidates = [...filteredCandidates].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const statusClass = (status) => `status-badge status-${status?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <div className="modern-table-card">
            <table className="modern-table text-center">
                <thead>
                    <tr>
                        <th>Candidate</th>
                        <th>Status</th>
                        <th>Job Role</th>
                        <th>Application Date</th>
                        <th>Application Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedCandidates.map((c) => (
                        <tr key={c._id} className="clickable-row" onClick={() => setSelected(c)}>
                            <td>
                                <div className="candidate-user-cell">
                                    <div className="candidate-avatar">
                                        {c.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <span>{c.name}</span>
                                </div>
                            </td>

                            <td><span className={statusClass(c.status)}>{c.status}</span></td>

                            <td>{c.jobRole || "-"}</td>

                            <td>
                                {c.applicationDate
                                ? new Date(c.applicationDate).toLocaleDateString()
                                : c.createdAt
                                ? new Date(c.createdAt).toLocaleDateString()
                                : "-"}
                            </td>

                            <td>
                                {c.applicationDate
                                ? new Date(c.applicationDate).toLocaleTimeString()
                                : c.createdAt
                                ? new Date(c.createdAt).toLocaleTimeString()
                                : "-"}
                            </td>

                            <td>
                                <div className="modern-action-icons">
                                <Button className="icon-action-btn edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(c._id);

                                        setForm({
                                            name: c.name || "",
                                            email: c.email || "",
                                            phone: c.phone || "",
                                            experience: c.experience || "",
                                            qualification: c.qualification || "",
                                            previousEmployment: c.previousEmployment || "",
                                            jobRole: c.jobRole || "",
                                            status: c.status || "New Application",
                                            savedStatus: c.status || "New Application",
                                            interviewDate: c.interviewDate || "",
                                            interviewTime: c.interviewTime || "",
                                            interviewLocation: c.interviewLocation || "",
                                            noticePeriod: c.noticePeriod || "",
                                            expectedSalary: c.expectedSalary || "",
                                            currentSalary: c.currentSalary || "",
                                            aptitudeScore: c.aptitudeScore || "",
                                            skillRating: c.skillRating || "",
                                            conduct: "",
                                            conductRound: "",
                                            rating: "",
                                            ratingRecords: c.ratingRecords || [],
                                            conductRecords: c.conductRecords || [],
                                            interviewRounds: c.interviewRounds || [],
                                            extraInfo: "",
                                            note: "",
                                            resume: c.resume || "",
                                            offerLetter: c.offerLetter || ""
                                        });

                                        setShow(true);
                                    }}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Button>

                                <Button className="icon-action-btn view-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelected(c);
                                    }}
                                >
                                    <i className="bi bi-eye"></i>
                                </Button>

                                <Button className="icon-action-btn delete-icon-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCandidate(c._id)
                                }}
                                >
                                    <i className="bi bi-trash"></i>
                                </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CandidateTable;