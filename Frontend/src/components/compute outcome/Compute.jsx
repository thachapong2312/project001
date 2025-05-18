import axios from 'axios';

const ENP = "http://localhost:8800/api";

async function fetchAndCombineData(year, courses, surveyId, profCode) {
    try {
        // 🔽 Get latest year from the courses array
        const sortedYears = [...courses.map(c => parseInt(c.year))].sort((a, b) => b - a);
        const latestYear = sortedYears[0];
        const isLatestYear = parseInt(year) === latestYear;

        // Fetch weight mappings
        const courseWeightRes = await axios.get(`${ENP}/fetchdbs/weight/${year}/${profCode}`);
        const courseWeightMap = Object.fromEntries(courseWeightRes.data.map(w => [w.resp_year, w.weight]));

        const courseWeightObj = courses.find(c => c.year === year);
        if (!courseWeightObj) {
            console.error(`No course data found for year ${year}`);
            return null;
        }

        const { courses: courseList } = courseWeightObj;
        const surveyWeight = parseFloat(courseWeightMap[year]) || 0;
        const courseWeight = 100 - surveyWeight;
        const courseNames = courseList.split(', ');

        console.log("\n🔁 Year:", year);
        console.log("📘 Courses:", courseNames);
        console.log("🟩 Course Weight:", courseWeight, "%");
        console.log("🟨 Survey Weight:", surveyWeight, "%");

        let courseOnlyScores = {}; // Sum of course-weighted scores
        let courseCount = {};      // Count of course subjects
        let surveyScores = {};     // Keep survey scores separately

        // 🟢 Process course scores
        for (const course of courseNames) {
            const scoreRes = await axios.get(`${ENP}/score/piScoreFetching/${year}/${course}`);
            const scoreData = scoreRes.data;

            console.log(`📚 Processing course: ${course}`);

            scoreData.forEach(entry => {
                const piId = entry.PI_id;
                if (!courseOnlyScores[piId]) courseOnlyScores[piId] = {};
                if (!courseCount[piId]) courseCount[piId] = 0;

                for (let i = 1; i <= 5; i++) {
                    const key = `Final_score${i}`;
                    const weighted = entry[`PI_score${i}`] * (courseWeight / 100);
                    courseOnlyScores[piId][key] = (courseOnlyScores[piId][key] || 0) + weighted;
                    console.log(`  🧮 PI ${piId} - PI_score${i}: ${entry[`PI_score${i}`]} x ${courseWeight}% = ${weighted.toFixed(2)}`);
                    console.log(`    🔄 Updated courseOnlyScores[${piId}][${key}] = ${courseOnlyScores[piId][key].toFixed(2)}`);
                }

                courseCount[piId] += 1;
            });
        }

        // 🟡 Survey scores
        if (isLatestYear) {
            const surveyRes = await axios.get(`${ENP}/score/piSurveyFetching/${surveyId}/${year}`);
            const surveyData = surveyRes.data;
            console.log("📊 Processing surveys (latest year only)");
        
            surveyData.forEach(entry => {
                const piId = entry.PI_id;
                if (!surveyScores[piId]) surveyScores[piId] = {};
        
                for (let i = 1; i <= 5; i++) {
                    const key = `Final_score${i}`;
                    const weightedSurvey = entry[`PIS_score${i}`] * (surveyWeight / 100);
                    surveyScores[piId][key] = weightedSurvey;
        
                    console.log(`  🧪 PI ${piId} - PIS_score${i}: ${entry[`PIS_score${i}`]} x ${surveyWeight}% = ${weightedSurvey.toFixed(2)}`);
                }
            });
        } else {
            console.log("⚠️ Skipping survey for year", year, "- not latest year.");
        }
        

        return {
            courseScores: courseOnlyScores,
            courseCount: courseCount,
            surveyScores: surveyScores,
            surveyWei: surveyWeight
        };
    } catch (error) {
        console.error("❌ Error:", error);
        return null;
    }
}

export default fetchAndCombineData;
