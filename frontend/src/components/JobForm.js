import { Modal, Button, Form } from "react-bootstrap";
import "../pages/Dashboard.css";

function JobForm({ show, setShow, form, setForm, addJob, editingId }) {
    return (
        <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Header closeButton className="candidate-modal-header">
                <Modal.Title>{editingId ? "Edit Job Opening" : "Add Job Opening"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="candidate-modal-body">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control type="text" value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter job title"/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Control type="text" value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Enter department"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Number of Openings</Form.Label>
                        <Form.Control type="number" min="1" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })}
                        placeholder="Enter openings"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control as="textarea" rows={4} value={form.jobDescription}
                        onChange={(e) =>
                            setForm({ ...form, jobDescription: e.target.value })
                        } placeholder="Enter job description"
                        />
                    </Form.Group>

                    <Button onClick={addJob} className="candidate-primary-btn w-100 mt-2">
                        Save
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default JobForm;