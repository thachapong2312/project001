const prisma = require('../prisma/prisma')

exports.addOrUpdatePISummary = async (req,res) => {
    try{
        const { prof_id, year, course_name } = req.params
        const indicators = req.body
        
        const subjectRec = await prisma.subject.findUnique({
            where: {
                course_name_year_prof_id: {
                    course_name: course_name,
                    year: Number(year),
                    prof_id: Number(prof_id),
                }
            }
        })
        if (!subjectRec) {
            return res.status(404).json({ error: 'Subject not found'})
        }

        const subj_id = subjectRec.subj_id
        const operations =  await Promise.all(
            indicators.map(async (indicatorData) => {
                const { indicator, Score1, Score2, Score3, Score4, Score5 } = indicatorData
                const piRec = await prisma.pi.findUnique({
                    where: {
                        PI_no: `PI${indicator}`,
                    }
                })
                if (!piRec) {
                    throw new Error(`Performance Indicator ${indicator} not found`)
                }
                const PI_id = piRec.PI_id
                const PI_score1 = parseInt(Score1.replace('%', ''));
                const PI_score2 = parseInt(Score2.replace('%', ''));
                const PI_score3 = parseInt(Score3.replace('%', ''));
                const PI_score4 = parseInt(Score4.replace('%', ''));
                const PI_score5 = parseInt(Score5.replace('%', ''));

                const existSummary = await prisma.pi_summary.findFirst({
                    where: {
                        subj_id,
                        PI_id
                    }
                })
                if(existSummary){
                    return prisma.pi_summary.update({
                        where: {
                            summary_id: existSummary.summary_id
                        },
                        data: {
                            PI_score1,
                            PI_score2,
                            PI_score3,
                            PI_score4,
                            PI_score5,
                        }
                    })
                }
                else {
                    return prisma.pi_summary.create({
                        data: {
                            subj_id,
                            PI_id,
                            PI_score1,
                            PI_score2,
                            PI_score3,
                            PI_score4,
                            PI_score5,
                        }
                    })
                }
            })
        )
        res.status(201).json({ message: 'PI Summaries added or Updated Sucessful', operations })
    }catch(err){
        res.status(500).json({ error: 'An error occurred while processing the PI Summaries' });
        console.error('Error adding or updating PI Summaries:', err.message);
    }finally {
        await prisma.$disconnect();
      }
}

exports.recallingPISummary = async (req,res) => {
    try{
        const { prof_id, year, course_name } = req.params
        const subjectId = await prisma.subject.findUnique({
            where: {
                course_name_year_prof_id: {
                    course_name: course_name,
                    year: Number(year),
                    prof_id: Number(prof_id),
                }
            }
        })
        if (!subjectId) {
            return res.status(404).json({ error: 'Subject not found'})
        }
        const subj_id = subjectId.subj_id
        const summaryScore = await prisma.pi_summary.findMany({
            where: {
                subj_id,
            },
            orderBy: {
                PI_id: 'asc'
            },
            select: {
                PI_id: true,
                PI_score1: true,
                PI_score2: true,
                PI_score3: true,
                PI_score4: true,
                PI_score5: true,
                pi: {
                    select: { PI_no: true },
                  },
                },
              });
              if (summaryScore.length === 0) {
                return res.status(404).json({ error: 'No PI Summary entries found for this subject' });
              }
              const formattedData = summaryScore.map(summary => ({
                PI_no: summary.pi.PI_no,
                PI_score1: summary.PI_score1,
                PI_score2: summary.PI_score2,
                PI_score3: summary.PI_score3,
                PI_score4: summary.PI_score4,
                PI_score5: summary.PI_score5,
              }));
              res.status(200).json({ data: formattedData });
    }catch(err){
        res.status(500).json(err.message)
    }
}

exports.pi_score_fetch = async (req,res) => {
    try {
        const { year, course_name } = req.params
        const sort_subj_id = await prisma.subject.findMany({
            where: {
                year: Number(year),
                course_name : course_name
            },
            select: {
                subj_id: true
            }
        });

        const SubjId = sort_subj_id.map(item => item.subj_id);

        if (SubjId.length === 0) {
            return res.json([])
        }
        const score_search = await prisma.pi_summary.findMany({
            where: {
                subj_id: Number(SubjId)
            },
            select: {
                PI_id: true,
                PI_score1: true,
                PI_score2: true,
                PI_score3: true,
                PI_score4: true,
                PI_score5: true,
            }
        })
        // Sort the data by PI_id in ascending order
        const sortedData = score_search.sort((a, b) => a.PI_id - b.PI_id);
        res.json(sortedData);
      } catch (error) {
        console.error("Error fetching PI_SUMMARY Score:", error);
        res.status(500).json({
          error: 'Error fetching PI_SUMMARY Score',
          details: error.message
        });
      }
}

exports.pi_survey_fetch = async (req, res) => {
    try {
        const { PiNumber, year } = req.params;

        // Fetch all PI_id and PI_no values from the PI table
        const all_PI_data = await prisma.pi.findMany({
            select: {
                PI_id: true,
                PI_no: true,
            },
        });
        // Filter PI_id values where the third character of PI_no matches PiNumber
        const matchedPI_ids = all_PI_data
            .filter(item => item.PI_no[2] === PiNumber) // Extract third character and compare
            .map(item => item.PI_id); // Get matching PI_id values

        if (matchedPI_ids.length === 0) {
            return res.status(404).json({ error: `No matching PI_id found for PiNumber ${PiNumber}.` });
        }

        // Fetch data from pi_summary table where PI_id is in the found list and year matches
        const piSurveyData = await prisma.pi_survey.findMany({
            where: {
                PI_id: { in: matchedPI_ids }, // Filter by matched PI_ids
                survey_year: Number(year), // Filter by year
            },
            select: {
                PI_id: true,
                PIS_score1: true,
                PIS_score2: true,
                PIS_score3: true,
                PIS_score4: true,
                PIS_score5: true,
            }
        });

        res.json(piSurveyData);
    } catch (error) {
        console.error("Error fetching PI Survey Score:", error);
        res.status(500).json({
            error: "Error fetching PI Survey Score",
            details: error.message,
        });
    }
};
