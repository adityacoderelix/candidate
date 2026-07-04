import Candidate from "../models/Candidate.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

export const getCandidates = async (req,res) => {
    const candidates = await Candidate.find().sort({ createdAt: -1});
    res.json(candidates);
}

export const createCandidate = async (req,res) => {
    try {
        console.log(req.body);
        const phoneRegex = /^[0-9]{10}$/;

        const resume = req.files?.resume?.[0]
        ? `http://localhost:5000/uploads/resumes/${req.files.resume[0].filename}`
        : "";

        const payslip = req.files?.payslip?.[0]
        ? `http://localhost:5000/uploads/payslips/${req.files.payslip[0].filename}`
        : "";

        const offerLetter = req.files?.offerLetter?.[0]
        ? `http://localhost:5000/uploads/offerLetters/${req.files.offerLetter[0].filename}`
        : "";

        if (!phoneRegex.test(req.body.phone)) {
            return res.status(400).json("Phone number must be 10 digits");
        }

        const count = await Candidate.countDocuments();

        const recipients = Array.isArray(req.body.recipients)
        ? req.body.recipients
        : req.body.recipients
        ? [req.body.recipients]
        : [];

        const formattedRecipients = recipients.map(email => ({
            email,
            name: ""
        }))

        if (typeof req.body.conductRecords === "string") {
            req.body.conductRecords = JSON.parse(req.body.conductRecords);
        }

        if (typeof req.body.interviewRounds === "string") {
            req.body.interviewRounds = JSON.parse(req.body.interviewRounds);
        }

        if (typeof req.body.ratingRecords === "string") {
            req.body.ratingRecords = JSON.parse(req.body.ratingRecords);
        }

        const candidate = new Candidate({
            ...req.body,
            resume: resume,
            payslip: payslip,
            offerLetter: offerLetter,
            applicationDate: new Date(),
            recipients: formattedRecipients,
            status: "New Application",
            candidateId: `C${String(count + 1).padStart(4, "0")}`
        });

        await candidate.save();
        res.json(candidate);

    } catch (err) {
        console.log("Create candidate error:", err);
        res.status(500).json({
            message: "Error creating candidate",
            error: err.message
        });
    }
};

export const updateCandidate = async (req, res) => {
    try {
        if (typeof req.body.conductRecords === "string") {
            req.body.conductRecords = JSON.parse(req.body.conductRecords);
        }

        if (typeof req.body.interviewRounds === "string") {
            req.body.interviewRounds = JSON.parse(req.body.interviewRounds);
        }

        if (typeof req.body.ratingRecords === "string") {
            req.body.ratingRecords = JSON.parse(req.body.ratingRecords);
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json("Invalid candidate ID");
        }

        const oldCandidate = await Candidate.findById(req.params.id);

        if (!oldCandidate) {
            return res.status(404).json("Candidate not found");
        }

        const changedBy = req.user?.name || "Unknown User";

        const finalStatuses = [
            "Offer Accepted",
            "Offer Rejected",
            "Rejected",
            "Blacklisted",
            "Cooling Period"
        ];

        if (
            finalStatuses.includes(oldCandidate.status) &&
            req.body.status &&
            req.body.status !== oldCandidate.status
        ) {
            return res.status(400).json("Status cannot be changed after final stage");
        }

        const oldStatus = oldCandidate.status;
        const allowedConduct = ["Good", "Average", "Bad"];

        if (!allowedConduct.includes(req.body.conduct)) {
            delete req.body.conduct;
        }

        const fieldsToTrack = ["status", "note", "expectedSalary", "noticePeriod"];
        const logs = [];

        fieldsToTrack.forEach((field) => {
            const oldValue = oldCandidate[field] || "";
            const newValue = req.body[field] || "";

            if (String(oldValue) !== String(newValue)) {
                logs.push({
                    field,
                    oldValue: String(oldValue),
                    newValue: String(newValue),
                    message: `${field} changed from ${oldValue} to ${newValue}`,
                    changedBy,
                    changedAt: new Date()
                });
            }
        });

        Object.assign(oldCandidate, req.body);

        if (req.body.status === "Cooling Period") {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3);

            oldCandidate.coolingPeriodStart = startDate;
            oldCandidate.coolingPeriodEnd = endDate;
        }

        if (req.files?.resume?.[0]) {
            oldCandidate.resume = `http://localhost:5000/uploads/resumes/${req.files.resume[0].filename}`;
        }

        if (req.files?.payslip?.[0]) {
            oldCandidate.payslip = `http://localhost:5000/uploads/payslips/${req.files.payslip[0].filename}`;
        }

        if (req.files?.offerLetter?.[0]) {
            oldCandidate.offerLetter = `http://localhost:5000/uploads/offerLetters/${req.files.offerLetter[0].filename}`;
        }

        const recipients = Array.isArray(req.body.recipients)
            ? req.body.recipients
            : req.body.recipients
            ? [req.body.recipients]
            : [];

        oldCandidate.recipients = recipients.map((email) => ({
            email,
            name: ""
        }));

        if (logs.length > 0) {
            oldCandidate.changeLogs.push(...logs);
        }

        const updated = await oldCandidate.save();

        res.json(updated);

        const isInterviewScheduled =
            updated.status === "Interview Scheduled" &&
            oldStatus !== "Interview Scheduled";

        const isOffered =
            updated.status === "Offered" &&
            oldStatus !== "Offered";

        const extraInfoHtml = req.body.extraInfo?.trim()
            ? `
                <div style="margin-top:20px;padding:15px;background:#f8fafc;border-left:4px solid #0b3c91;border-radius:6px;">
                    <strong>Additional Information</strong>
                    <p style="margin:8px 0 0;">${req.body.extraInfo}</p>
                </div>
            `
            : "";

        const emailTemplate = ({ title, subtitle, body }) => `
            <div style="max-width:700px;margin:auto;font-family:Segoe UI,Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;color:#1f2937;">
                
                <div style="background:#0b3c91;padding:26px 32px;color:#ffffff;">
                    <h2 style="margin:0;font-size:24px;">CodeRelix</h2>
                    <p style="margin:6px 0 0;font-size:14px;">IT & Digital Consultancy</p>
                </div>

                <div style="padding:32px;">
                    <h2 style="margin-top:0;color:#111827;">${title}</h2>
                    <p style="font-size:15px;color:#4b5563;">${subtitle}</p>

                    <div style="margin-top:24px;font-size:15px;line-height:1.7;">
                        ${body}
                    </div>
                </div>

                <div style="background:#f9fafb;padding:24px 32px;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;">
                    <p style="margin:0 0 12px;">
                        Best regards,<br/>
                        <strong>Admin & Office - CodeRelix</strong><br/>
                        IT & Digital Consultancy<br/>
                        www.coderelix.com
                    </p>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;"/>

                    <p style="margin:0 0 12px;">
                        <strong>IMPORTANT:</strong> The contents of this email and any attachments are confidential.
                        They are intended for the named recipient(s) only. If you have received this email by mistake,
                        please notify the sender immediately and do not disclose the contents to anyone or make copies thereof.
                    </p>

                    <p style="margin:0;color:green;">
                        Please consider your environmental responsibility. Before printing this e-mail message,
                        ask yourself whether you really need a hard copy.
                    </p>
                </div>
            </div>
        `;

        try {
            if (isInterviewScheduled && updated.email) {
                await sendEmail({
                    to: updated.email,
                    subject: "Interview Invitation | CodeRelix",
                    html: emailTemplate({
                        title: "Interview Invitation",
                        subtitle: `Hello ${updated.name},`,
                        body: `
                            <p>Thank you for your interest in CodeRelix.</p>
                            <p>We are pleased to invite you for an interview as part of the next stage of our recruitment process.</p>

                            <div style="margin-top:20px;padding:18px;background:#f3f6fb;border-radius:8px;">
                                <p><strong>Date:</strong> ${updated.interviewDate || "To be confirmed"}</p>
                                <p><strong>Time:</strong> ${updated.interviewTime || "To be confirmed"}</p>
                                <p><strong>Location:</strong> ${updated.interviewLocation || "To be confirmed"}</p>
                            </div>

                            ${extraInfoHtml}

                            <p style="margin-top:24px;">
                                Kindly arrive 10–15 minutes before your scheduled time and carry any required documents.
                            </p>

                            <p>We look forward to meeting you.</p>
                        `
                    })
                });
            }

            if (isInterviewScheduled && recipients.length > 0) {
                for (const email of recipients) {
                    await sendEmail({
                        to: email,
                        subject: `Interview Scheduled | ${updated.name}`,
                        html: emailTemplate({
                            title: "Candidate Interview Scheduled",
                            subtitle: "A candidate interview has been scheduled.",
                            body: `
                                <div style="padding:18px;background:#f3f6fb;border-radius:8px;">
                                    <p><strong>Candidate Name:</strong> ${updated.name}</p>
                                    <p><strong>Candidate ID:</strong> ${updated.candidateId}</p>
                                    <p><strong>Status:</strong> ${updated.status}</p>
                                    <p><strong>Interview Date:</strong> ${updated.interviewDate || "Not provided"}</p>
                                    <p><strong>Interview Time:</strong> ${updated.interviewTime || "Not provided"}</p>
                                    <p><strong>Interview Location:</strong> ${updated.interviewLocation || "Not provided"}</p>
                                    <p><strong>Updated By:</strong> ${changedBy}</p>
                                </div>

                                ${extraInfoHtml}
                            `
                        })
                    });
                }
            }

            if (isOffered && recipients.length > 0) {
                for (const email of recipients) {
                    await sendEmail({
                        to: email,
                        subject: `Candidate Offered | ${updated.name}`,
                        html: emailTemplate({
                            title: "Candidate Moved to Offered Stage",
                            subtitle: "A candidate has been moved to the Offered stage.",
                            body: `
                                <div style="padding:18px;background:#f3f6fb;border-radius:8px;">
                                    <p><strong>Candidate Name:</strong> ${updated.name}</p>
                                    <p><strong>Candidate ID:</strong> ${updated.candidateId}</p>
                                    <p><strong>Email:</strong> ${updated.email}</p>
                                    <p><strong>Phone:</strong> ${updated.phone}</p>
                                    <p><strong>Status:</strong> ${updated.status}</p>
                                    <p><strong>Updated By:</strong> ${changedBy}</p>
                                </div>

                                ${extraInfoHtml}
                            `
                        })
                    });
                }
            }
        } catch (emailError) {
            console.log("Email sending failed:", emailError.message);
        }

    } catch (err) {
        console.log("Update candidate error:", err.message);
        res.status(500).json(err.message);
    }
};

export const deleteCandidate = async (req,res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);

        if (!candidate) {
            return res.status(404).json("Candidate not found");
        }
        res.json("Candidate Deleted");
        
    } catch (err) {
        console.log(err);
        res.status(500).json("Error deleting candidate");
    }
}

export const createCandidateByForm = async (req,res) => {
    try {
        console.log(req.body);
        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(req.body.phone)) {
            return res.status(400).json("Phone number must be 10 digits");
        }

        const resume = req.files?.resume?.[0]
        ? `http://localhost:5000/uploads/resumes/${req.files.resume[0].filename}`
        : "";

        const count = await Candidate.countDocuments();

        const candidate = new Candidate({
            ...req.body,
            resume: resume,
            status: "New Application",
            candidateId: `C${String(count + 1).padStart(4, "0")}`
        });

        await candidate.save();
        res.json(candidate);

    } catch (err) {
        console.log("Create candidate error:", err);
        res.status(500).json({
            message: "Error creating candidate",
            error: err.message
        });
    }
}