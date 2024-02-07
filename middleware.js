const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

const varifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.headers.Authorization || req.headers["authorization"]
        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Token Is Required For authentication'
            })
        }
        const decoded = jwt.verify(token.replace("Bearer ", token), secretKey)
        req.user = decoded.employee_id
        // console.log(decoded)
        return next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Token'
        })
    }
}

module.exports = varifyToken