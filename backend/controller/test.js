const prisma = require('../prisma/prisma')

exports.name = async (req,res) => {
    try {
        const { Id } = req.params
        const userData = await prisma.user.findMany({
            where: {
                prof_id: Number(Id)
            },
            select: {
              name: true,
              surname: true,
            }
        });
        res.json(userData);
      } catch (error) {
        console.error("Error fetching USER data:", error);
        res.status(500).json({
          error: 'Error fetching USER data',
          details: error.message
        });
      }
}

exports.score = async (req,res) => {
    try {
        const { Id } = req.params
        const pi_sumData = await prisma.pi_summary.findMany({
            where: {
                subj_id: Number(Id)
            },
            select: {
                PI_id: true,
                PI_score1: true,
                PI_score2: true,
                PI_score3: true,
                PI_score4: true,
                PI_score5: true,
            }
        });
        // Sort the data by PI_id in ascending order
        const sortedData = pi_sumData.sort((a, b) => a.PI_id - b.PI_id);

        // Send the sorted data as a response
        res.json(sortedData);
      } catch (error) {
        console.error("Error fetching PI_SUMMARY data:", error);
        res.status(500).json({
          error: 'Error fetching PI_SUMMARY data',
          details: error.message
        });
      }
}

exports.subjectss = async (req,res) => {
    try {
        const { Id } = req.params
        const pi_sumData = await prisma.subject.findMany({
            where: {
                prof_id: Number(Id)
            },
            select: {
                course_name: true,
                subj_name: true,
                year: true,
            }
        });
        res.json(pi_sumData);
      } catch (error) {
        console.error("Error fetching SUBJECT data:", error);
        res.status(500).json({
          error: 'Error fetching SUBJECT data',
          details: error.message
        });
      }
}

exports.piie = async (req,res) => {
    try {
        const piData = await prisma.pi.findMany(); // Ensure correct case
        res.json(piData);
      } catch (error) {
        console.error("Error fetching PI data:", error);
        res.status(500).json({
          error: 'Error fetching PI data',
          details: error.message
        });
      }
}

exports.allData = async (req,res) => {
  try {
      const { Id } = req.params
      const userData = await prisma.user.findMany({
          where: {
              prof_id: Number(Id)
          },
          select: {
              name: true,
              surname: true,
              subject: {
                select: {
                  course_name: true,
                  subj_name: true,
                  year: true,
                  update_data: true,
                  pi_summary: {
                  select: {
                    PI_score1: true,
                    PI_score2: true,
                    PI_score3: true,
                    PI_score4: true,
                    PI_score5: true,
                    }
                  }
                  
                }
              }
          },
      });
      res.json(userData);
    } catch (error) {
      console.error("Error fetching USER data:", error);
      res.status(500).json({
        error: 'Error fetching USER data',
        details: error.message
      });
    }
}
