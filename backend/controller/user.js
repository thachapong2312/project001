const prisma = require('../prisma/prisma')

// UPDATE
exports.user = async (req,res) => {
    try{
        const { prof_id } = req.params
        const { username, email, password } = req.body
        if (!username || !password) {
            return res.status(400).json("Please fill in new username and password");
        }
        const updated = await prisma.user.update({
            where:{
                prof_id: Number(prof_id)
            },
            data:{
                username: username,
                email: email,
                password: password
            },
            select: {
                prof_id: true,
                username: true,
                email: true
            }
        })
        res.status(200).json(updated)
        // res.status(200).json("Updata sucessful")
    }catch(err){
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
}