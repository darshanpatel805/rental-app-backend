let db = require("../db-connection");
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
exports.addUser = async (req, res) => {
    console.log('object')
    try {
        let { name, password } = req.body;
        const imagePath = req.file.path

        const sql = `INSERT into user (name,password,image) VALUES ('${name}','${password}','${imagePath}')`
        try {
            db.query(sql, async (err, r) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Server Internal Error' })
                } else {
                    const token = jwt.sign({id:1, name: name, password: password, Image: imagePath }, secretKey, { expiresIn: '1h' })
                    res.status(200).json({ success: true, message: 'Data add successfully',token:token })
                }

            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server Internal Error', })
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getUser = async (req, res) => {
    try {
        let sql = `SELECT * from user where  id = ${req.user}`
        db.query(sql, async (err, r) => {
            if (err) {
                res.status(500).json({ success: false, message: "Internal Server Error" })
            } else {
                res.status(200).json({ success: true, message: "user data", data: r[0] })
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

