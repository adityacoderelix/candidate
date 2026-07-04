import Job from "../models/Job.js";

export const getJobs = async (req,res) => {
    const jobs = await Job.find();
    res.json(jobs);
}

export const createJob = async (req,res) => {
    const job = new Job(req.body);
    await job.save();
    res.json(job);
}

export const deleteJob = async (req,res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.json("Job Deleted");
}

export const updateJob = async (req,res) => {
    const updated = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
}