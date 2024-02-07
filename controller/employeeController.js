const client = require('../db-connection')
const utils = require('../config/utils')
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

exports.addEmployee = async (request, response) => {
    try {
        let check_param = [
            { name: 'first_name', type: 'string' },
            { name: 'last_name', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'code', type: 'string' },
            { name: 'contact_num', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'joining_date', type: 'string' },
            { name: 'current_salary', type: 'string' },
            { name: 'employee_type', type: 'string' },
            { name: 'dob', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const files = request.files
            const { first_name, last_name, code, contact_num, alt_code, alt_num, email, current_salary, dob, address, joining_date, employee_type, password } = request.body
            if (files) {
                const filterEmployeeImage = files.filter((f) => f.fieldname === 'employee_img')
                const employeeImage = []
                if (filterEmployeeImage) {
                    filterEmployeeImage.map((e, index) => {
                        const readFile = utils.fileRead(`${__dirname}/../uploads/${e.filename}`)
                        if (readFile.success) {
                            const uploadDocument = utils.writeFile(`${__dirname}/../uploads/employee/employeeImage/${contact_num}${index}${e.originalname}`, readFile.data)
                            if (uploadDocument.success) {
                                const url = `uploads/employee/employeeImage/${contact_num}${index}${e.originalname}`
                                employeeImage.push(url)
                                utils.deleteFile(`${__dirname}/../uploads/${e.filename}`)
                            }
                        }
                    })
                }
                const filterEmployeeDoc = files.filter((d) => d.fieldname === 'employee_doc')
                const documentUrl = [];
                if (filterEmployeeDoc) {
                    filterEmployeeDoc.map((a, index) => {
                        const readFile = utils.fileRead(`${__dirname}/../uploads/${a.filename}`)
                        if (readFile.success) {
                            const uploadDocument = utils.writeFile(`${__dirname}/../uploads/employee/employeeDocument/${contact_num}${index}${a.originalname}`, readFile.data)
                            if (uploadDocument.success) {
                                const url = `uploads/employee/employeeDocument/${contact_num}${index}${a.originalname}`
                                documentUrl.push(url)
                                utils.deleteFile(`${__dirname}/../uploads/${a.filename}`)
                            }
                        }
                    })
                }

                const sql = `INSERT into employee(first_name, last_name, code, contact_num, alt_code, alt_num, email, current_salary,dob,address,joining_date,employee_type,employee_img,document , password ) VALUES('${first_name}', '${last_name}', '${code}', '${contact_num}', '${alt_code}', '${alt_num}', '${email}', '${current_salary}','${dob}','${address}','${joining_date}','${employee_type}','${JSON.stringify(employeeImage)}','${JSON.stringify(documentUrl)}','${password}')`
                const res = await client(sql)
                return response.status(200).send({
                    success: true,
                    message: 'Add Employee successFully',
                    data: res
                })

            } else {
                return response.status(404).json({ success: false, message: 'File is missing' });
            }
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}

exports.getEmployee = async (request, response) => {
    try {
        const sql = `SELECT * from employee`
        const result = await client(sql)
        result.map((r) => {
            r.employee_img = JSON.parse(r.employee_img)
            r.document = JSON.parse(r.document)
        })
        return response.status(200).send({
            success: true,
            message: '  Employee Data Found',
            data: result
        })
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}

exports.updateEmployee = async (request, response) => {
    try {
        let check_param = [
            { name: 'employee_id', type: 'string' },
            { name: 'first_name', type: 'string' },
            { name: 'last_name', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'code', type: 'string' },
            { name: 'contact_num', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'joining_date', type: 'string' },
            { name: 'current_salary', type: 'string' },
            { name: 'employee_type', type: 'string' },
            { name: 'dob', type: 'string' },
            { name: 'password', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const files = request.files
            let { deletedImage } = request.body
            const { first_name, last_name, code, contact_num, alt_code, alt_num, email, current_salary, dob, address, joining_date, employee_type, employee_id, password } = request.body
            if (deletedImage) {
                deletedImage = JSON.parse(deletedImage)
                deletedImage.length > 0 && deletedImage.map((d) => {
                    utils.deleteFile(`${__dirname}/../${d}`)
                })
            }
            let { existImage } = request.body
            let { existProfileImage } = request.body
            existProfileImage = JSON.parse(existProfileImage)
            existImage = JSON.parse(existImage)
            const employeeImage = [...existProfileImage]
            const documentUrl = [...existImage];

            if (files.length > 0) {
                const filterEmployeeImage = files.filter((f) => f.fieldname === 'employee_img')
                if (filterEmployeeImage) {
                    filterEmployeeImage.map((e, index) => {
                        const readFile = utils.fileRead(`${__dirname}/../uploads/${e.filename}`)
                        if (readFile.success) {
                            const uploadDocument = utils.writeFile(`${__dirname}/../uploads/employee/employeeImage/${contact_num}${index}${e.originalname}`, readFile.data)
                            if (uploadDocument.success) {
                                const url = `uploads/employee/employeeImage/${contact_num}${index}${e.originalname}`
                                employeeImage.push(url)
                                utils.deleteFile(`${__dirname}/../uploads/${e.filename}`)
                            }
                        }
                    })
                }
                const filterEmployeeDoc = files.filter((d) => d.fieldname === 'employee_doc')
                if (filterEmployeeDoc) {
                    filterEmployeeDoc.map((a, index) => {
                        const readFile = utils.fileRead(`${__dirname}/../uploads/${a.filename}`)
                        if (readFile.success) {
                            const uploadDocument = utils.writeFile(`${__dirname}/../uploads/employee/employeeDocument/${contact_num}${index}${a.originalname}`, readFile.data)
                            if (uploadDocument.success) {
                                const url = `uploads/employee/employeeDocument/${contact_num}${index}${a.originalname}`
                                documentUrl.push(url)
                                utils.deleteFile(`${__dirname}/../uploads/${a.filename}`)
                            }
                        }
                    })
                }
            }
            const sql = `UPDATE employee
            SET
              first_name = '${first_name}',
              last_name = '${last_name}',
              code = '${code}',
              contact_num = '${contact_num}',
              alt_code = '${alt_code}',
              alt_num = '${alt_num}',
              email = '${email}',
              current_salary = '${current_salary}',
              dob = '${dob}',
              address = '${address}',
              joining_date = '${joining_date}',
              employee_type = '${employee_type}',
              employee_img = '${JSON.stringify(employeeImage)}',
              document = '${JSON.stringify(documentUrl)}',
              password = '${password}'
            WHERE
              employee_id = ${employee_id};
            `
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: 'Add Employee successFully',
                data: res
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}

exports.deleteEmployee = async (request, response) => {
    try {
        const { employee_id } = request.params;
        if (employee_id) {
            // const sql = `DELETE from product where product_id = ${product_id}`
            const sql = `SELECT * from employee where employee_id = ${employee_id}`
            const resp = await client(sql);

            const image = JSON.parse(resp[0].document)
            const employeeImg = JSON.parse(resp[0].employee_img)
            image.map((i) => {
                utils.deleteFile(`${__dirname}/../${i}`)
            })
            employeeImg.map((D) => {
                utils.deleteFile(`${__dirname}/../${D}`)
            })
            const deletesql = `DELETE from employee where employee_id = ${employee_id}`
            const res = await client(deletesql);
            return response.status(200).send({
                success: true,
                message: "Customer Delete successfully",
                data: res
            })
        } else {
            response.status(404).send({
                success: false,
                message: "Customer Id Is Missing"
            })
        }

    } catch (error) {
        console.log(error)
        response.status(500).send({
            success: false,
            message: "Ooo'ps Server Internal Error"
        })
    }
}

exports.getEmployeeDetail = async (request, response) => {
    let check_param = [
        { name: 'employee_id', type: 'number' },
    ]

    const result = utils.check_request_params(request.params, check_param)
    if (result) {
        const { employee_id } = request.params
        try {
            let sql = `SELECT * from employee where employee_id = ${employee_id}`
            const res = await client(sql)
            res.map((r) => {
                r.document = JSON.parse(r.document);
                r.employee_img = JSON.parse(r.employee_img)
            })
            return response.status(200).send({
                success: true,
                message: "Employee Data found",
                data: res[0]
            })
        } catch (error) {
            console.log(error)
            return response.status(500).send({
                success: false,
                message: "Ooo's servar internal error"
            })
        }
    }
}

exports.loginUser = async (request, response) => {
    try {
        let check_param = [
            { name: 'email', type: 'string' },
            { name: 'password', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { email, password } = request.body
            const sql = `SELECT * from employee where email = '${email}' AND password = '${password}'`
            const res = await client(sql)
            console.log(res)
            if (res.length > 0) {
                const token = jwt.sign(res[0], secretKey, { expiresIn: '5h' })
                response.header(
                    'auth',
                    token
                )
                response.header("Access-Control-Expose-Headers", "auth")
                return response.status(200).send({
                    success: true,
                    message: 'user found',
                })
            } else {
                const sql1 = `SELECT * from employee where email = '${email}'`
                const emailRes = await client(sql1)
                if (emailRes.length > 0) {
                    return response.status(401).send({
                        success: false,
                        message: 'Please Enter Valid Password',
                    })
                } else {
                    return response.status(401).send({
                        success: false,
                        message: 'User does not Exits',
                    })
                }
            }

        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: "Ooo's servar internal error"
        })
    }
}

exports.getUserDetail = async (request, response) => {
    try {
        const id = request.user;
        const sql = `SELECT * from employee where employee_id = ${id}`
        const res = await client(sql);
        return response.status(200).send({
            success: true,
            message: "userDetail found",
            data: res[0]
        })
    } catch (error) {
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}

exports.getEmployeeBirth = async (request, response) => {
    try {
        const date = new Date().toDateString
        const sql = `SELECT * from employee where dob = '${date}'`
        const res = await client(sql)
        const sql2 = `SELECT * from employee where joining_date = ${joining_date}`
        const res2 = await client(sql2)

        return response.status(200).send({
            success: true,
            message: 'Dob And Work Anivarsary',
            data: {
                dob: res,
                anivarsary: res2
            }
        })
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: "Ooop's Server Internal Error"
        })
    }
}