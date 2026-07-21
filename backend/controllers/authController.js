import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const updateProfile = async (req,res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const register = async (req,res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });

        if (existingUser) { 
            return res.status(400).json("Email already exists!"); 
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            role: "HR",
            isApproved: false
        });

        await user.save();

        res.json("Registration request sent. Wait for admin approval");

        const approveLink = `${process.env.BACKEND_URL}/auth/approve-user-link/${user._id}`;
        
        const admins = await User.find({
            role: "Admin",
            isApproved: true
        }).select("email name");

        admins.forEach((admin) => {
            sendEmail({
                to: admin.email,
                subject: "New User Registration Approval",
                html: `
                    <h3>New user registered</h3>

                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>

                    <p>
                        Please approve this user if they should be allowed to access the system.
                    </p>

                    <a href="${approveLink}"
                    style="
                        display:inline-block;
                        padding:12px 18px;
                        background:#198754;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                        font-weight:bold;
                    ">
                        Approve User
                    </a>
                `
            }).catch((emailError) => {
                console.log(`Approval email failed for ${admin.email}:`, emailError.message);
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

export const login = async (req,res) => {
    const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailVal.test(req.body.email)) { 
        return res.status(400).json('Invalid Email'); 
    }
    
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(400).json("User not found");
        }

        const valid = await bcrypt.compare(req.body.password, user.password);

        if(!valid) {
            return res.status(400).json("Invalid Password");
        }

        if (!user.isApproved) {
            return res.status(403).json("Your account is waiting for admin approval");
        }

        console.log("User approval status:", user.isApproved);

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email
        }, "secretkey",
        {
            expiresIn: "1d"
        });

        res.json({
            token,
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
}

export const getUsers = async (req,res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json("Access Denied");
        }
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
}

export const resetPassword = async (req,res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json("Only Admin can reset passwords");
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json("User not found");
        }
        if (!req.body.password) {
            return res.status(400).json("Password is required");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        res.json("Password Reset Successful");
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
}

export const checkEmail = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email missing"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        return res.json({
            exists: !!existingUser
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
};

export const deleteUser = async (req,res) => {
    if(req.user.role !== "Admin") {
        return res.status(403).json("Only Admin can delete");
    }
    await User.findByIdAndDelete(req.params.id);
    res.json("User deleted");
}

export const getHrAndAdminUsers = async (req,res) => {
    try {
        const users = await User.find({ role: { $in: ["HR", "Admin"]}}).select("name email role");
        res.json(users);

    } catch (err) {
        res.status(500).json("Failed to fetch users");
    }
}

export const approveUser = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json("Only Admin can approve users");
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json("User not found");
        }

        if (user.isApproved) {
            return res.json("User already approved");
        }

        user.isApproved = true;
        await user.save();

        res.json("User approved successfully");
    } catch (err) {
        console.log(err);
        res.status(500).json("Approval failed");
    }
};

export const approveUserFromEmail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send(`
                <h2>User not found ❌</h2>
            `);
        }

        if (user.isApproved) {
            return res.send(`
                <div style="font-family:Arial;padding:40px;text-align:center;">
                    <h2 style="color:#0f766e;">User Already Approved ✅</h2>
                    <p><strong>${user.name}</strong> (${user.email}) has already been approved.</p>
                </div>
            `);
        }

        user.isApproved = true;
        await user.save();

        res.send(`
            <div style="
                max-width:600px;
                margin:60px auto;
                padding:40px;
                font-family:Segoe UI,Arial,sans-serif;
                border-radius:12px;
                box-shadow:0 5px 25px rgba(0,0,0,.15);
                text-align:center;
            ">
                <div style="font-size:60px;">✅</div>

                <h1 style="color:#198754;">
                    User Approved Successfully
                </h1>

                <p style="font-size:18px;">
                    <strong>${user.name}</strong>
                </p>

                <p>
                    ${user.email} can now log in to the Candidate Management System.
                </p>

                <hr style="margin:25px 0;">

                <p style="color:#6c757d;">
                    CodeRelix Recruitment System
                </p>
            </div>
        `);

    } catch (err) {
        console.log(err);

        res.status(500).send(`
            <h2>Approval Failed ❌</h2>
            <p>Please try again later.</p>
        `);
    }
};