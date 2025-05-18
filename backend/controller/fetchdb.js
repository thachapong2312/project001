const prisma = require('../prisma/prisma')

exports.test = async (req,res) => {
    try{
        const { Id, Date } = req.params
        const year = Date.split('_')[0]
        const month = Date.split('_')[1]
        const start_month = 8
        let startYear, endYear

        if (month >= start_month){
            startYear = year
            endYear = year + 1
        }
        else{
            startYear = year - 1
            endYear = year
        }

        const disYear = startYear
        const SubjData = await prisma.subject.findMany({
            where: {
                prof_id: Number(Id),
                year: Number(disYear)
            },
        })
          res.json(SubjData)
          console.log(SubjData)
        
    }catch(err){
        res.status(500).json({detail: err.message})
    }
}

exports.tests_subjs = async (req,res) => {
    try{
        const course_name = req.params.subjName
        const output = await prisma.subject.findMany({
            where:{
                course_name: course_name
            },
            select: {
                subj_name: true
            }
        })
        res.json(output)
        
    }catch(err){
        res.status(500).json(err)
    }
}

exports.resp_committee = async (req, res) => {
    try{
        const { Date, ProfId } = req.params
        const year = Date.split('_')[0]
        const month = Date.split('_')[1]
        const start_month = 8
        let startYear, endYear

        if (month >= start_month){
            startYear = year
            endYear = year + 1
        }
        else{
            startYear = year - 1
            endYear = year
        }

        const disYear = startYear
        const OutputPI = await prisma.responsible_committee.findMany({
            where: {
                resp_year: Number(disYear),
                prof_id: Number(ProfId)
            }
        })
        res.json(OutputPI)
        console.log(OutputPI)
    }catch(err){
        res.status(500).json(err)
    }
}

exports.year_list_outcome = async (req, res) => {
    try {
        const yearList = await prisma.subject.findMany({
            where: {
            },
            select: {
                year: true,
            },
        });

        // Extract and deduplicate years
        const uniqueYears = [...new Set(yearList.map((item) => item.year))];

        res.json(uniqueYears);
    } catch (error) {
        console.error("Error fetching SUBJECT data:", error);
        res.status(500).json({
            error: "Error fetching SUBJECT data",
            details: error.message,
        });
    }
};

exports.courses_list_outcome = async (req, res) => {
    try {
        const { year } = req.query;
        const courseList = await prisma.subject.findMany({
            where: {
                year: Number(year)
            },
            select: {
                course_name: true,
            },
        });
        res.json(courseList);
    } catch (error) {
        console.error("Error fetching SUBJECT data:", error);
        res.status(500).json({
            error: "Error fetching SUBJECT data",
            details: error.message,
        });
    }
};

exports.weight_outcome = async (req, res) => {
    try {
        const { AcdYear, ProfId } = req.params;
        const weightOutcome = await prisma.responsible_committee.findMany({
            where: {
                prof_id: Number(ProfId),
            },
            select: {
                resp_year: true,
                weight: true,
            },
        });
        res.json(weightOutcome);
    } catch (error) {
        console.error("Error fetching Responsible Committee data:", error);
        res.status(500).json({
            error: "Error fetching Responsible Committee data",
            details: error.message,
        });
    }
};

exports.fetchSurveyScore = async (req, res) => {
    try {
        const { SurveyYear, PI_id } = req.params;
        const SurveyScore = await prisma.pi_survey.findMany({
            where: {
                survey_year: Number(SurveyYear),
                PI_id: Number(PI_id),
            },
            // select: {
            //     weight: true,
            // },
        });
        res.json(SurveyScore);
    } catch (error) {
        console.error("Error fetching PI SURVEY data:", error);
        res.status(500).json({
            error: "Error fetching PI SURVEY data",
            details: error.message,
        });
    }
};

exports.student_outcome = async (req, res) => {
    try {
        const { RespYear, ProfId } = req.params;
        const Pre_Outcome = await prisma.responsible_committee.findMany({
            where: {
                resp_year: Number(RespYear),
                prof_id: Number(ProfId),
            },
            select: {
                PI_id: true,
            },
        });

        // Extract PI_id values from the response
        const PI_ids = Pre_Outcome.map(item => item.PI_id);

        if (PI_ids.length === 0) {
            return res.json([]); // If no PI_id found, return an empty array
        }

        // Fetch ALL PI_no values from the PI table
        const all_PI_data = await prisma.pi.findMany({
            select: {
                PI_id: true,
                PI_no: true,
            },
        });

        // Group ALL PI_no values by the third letter
        const groupByThirdLetter = (data) => {
            const groups = {};
            data.forEach((item) => {
                const groupKey = item.PI_no[2]; // Extract the third letter
                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(item);
            });
            return groups;
        };

        const groupedData = groupByThirdLetter(all_PI_data);

        // Find the group for each PI_id in the requested list
        const findGroupByPIId = (PI_id) => {
            const target = all_PI_data.find((item) => item.PI_id === PI_id);
            if (!target) {
                return `PI_id: ${PI_id} not found.`;
            }
            const groupKey = target.PI_no[2]; // Extract third letter for grouping
            return groupedData[groupKey]?.map((item) => item.PI_no) || [];
        };

        // Construct the final response
        const finalResult = PI_ids.map((PI_id) => ({
            PI_id,
            PI_no_list: findGroupByPIId(PI_id),
        }));

        res.json(finalResult);
    } catch (error) {
        console.error("Error fetching Responsible Committee data:", error);
        res.status(500).json({
            error: "Error fetching Responsible Committee data",
            details: error.message,
        });
    }
};
