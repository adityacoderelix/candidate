import Company from "../models/Company.js";
import mongoose from "mongoose";
import express from "express";

export const getCompanyDetails = async (req,res) => {
    const details = await Company.find();
    res.json(details);
}

export const createCompanyDetails = async (req,res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.json(company);
        
    } catch (err) {
        console.log("Error in creating company: ", err);
        res.status(500).json({
            message: "Error creating company",
            error: err.message
        });
    }
};

export const updateCompanyDetails = async (req, res) => {
    try {
        const { companyName, companyPhone, companyEmail, companyAddress } = req.body;

        if (!companyName || !companyPhone || !companyEmail || !companyAddress) {
            return res.status(400).json("All fields are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(companyEmail)) {
            return res.status(400).json("Enter a valid email address");
        }

        if (!phoneRegex.test(companyPhone)) {
            return res.status(400).json("Phone number must be exactly 10 digits");
        }

        const updatedCompanyDetails = await Company.findByIdAndUpdate(
            req.params.id,
            {
                companyName,
                companyPhone,
                companyEmail,
                companyAddress
            },
            { new: true, runValidators: true }
        );

        if (!updatedCompanyDetails) {
            return res.status(404).json("Company details not found");
        }

        res.status(200).json(updatedCompanyDetails);

    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};