const prisma = require('../prisma/prisma')
 
// REGISTER
exports.register = async (req,res) => {
    try{
        const { username, email, password } = req.body
    
        // const usesrData = {
        //     username: username,
        //     email: email,
        //     password: password
        // }
        // const newYear = await prisma.user.create({
        //     data: usesrData,
        //     select: {
        //         prof_id: true,
        //         username: true,
        //         email: true
        //     }
        // })
        res.status(200).json(newYear)
    }catch(err){
        res.status(500).json(err)
    }
}

// LOGIN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json("Please fill in both username and password");
        }
        const profId = await prisma.user.findMany({
            where: {
                username: username,
                password: password
            },
        });
        const caseSensitiveMatch = profId.filter(user =>
            user.username === username && user.password === password
        )
        if (caseSensitiveMatch.length === 0) {
            return res.status(401).json("Invalid username or password");
        }
        res.status(200).json([{
            prof_id: caseSensitiveMatch[0].prof_id,
            username: caseSensitiveMatch[0].username,
            email: caseSensitiveMatch[0].email,
        }]);
    } catch (err) {
        res.status(500).json(err);
        console.log(err.message)
    }
};
