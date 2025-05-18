const prisma = require('../prisma/prisma')

exports.record_time = async (req,res) => {
    try {
        const { course_name, year, prof_id, update_data } = req.body;

        const subjectRecord = await prisma.subject.findFirst({
            where: {
                course_name: course_name,
                year: Number(year),
                prof_id: Number(prof_id),
            }
        });
        if (!subjectRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        const updatedRecord = await prisma.subject.update({
            where: {
                subj_id: subjectRecord.subj_id,
            },
            data: {
                update_data: new Date(update_data),
            }
        });
        res.status(200).json(updatedRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.weight_update = async (req,res) => {
    try {
        const { resp_year, prof_id, newweight_data } = req.body;

        const committeeRecord = await prisma.responsible_committee.findFirst({
            where: {
                resp_year: Number(resp_year),
                prof_id: Number(prof_id),
            }
        });
        if (!committeeRecord) {
            return res.status(404).json({ message: "Committee not found" });
        }
        const updatedCommitteeRecord = await prisma.responsible_committee.update({
            where: {
                committee_id: committeeRecord.committee_id,
            },
            data: {
                weight: newweight_data
            },
            select: {
                resp_year: true,
                prof_id: true,
                PI_id: true,
                weight: true
            }
        });
        res.status(200).json(updatedCommitteeRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
