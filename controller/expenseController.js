const client = require('../db-connection')
const utils = require('../config/utils')
const { aborted } = require('util')


exports.addExpense = async (request, response) => {
    try {
        let check_param = [
            { name: 'expense_name', type: 'string' },
            { name: 'amount', type: 'string' },
            { name: 'include_item', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'expense_person', type: 'string' },
            { name: 'expense_date', type: 'string' },
            { name: 'payment_mode', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const file = request.files;
            const { expense_name, amount, include_item, status, expense_person, expense_date, remark, vendor_name, transaction_id, payment_mode } = request.body
            const imageUrl = [];
            if (file.length > 0) {
                file.map((f, index) => {
                    const fileUpload = utils.fileRead(`${__dirname}/../uploads/${f.filename}`)
                    if (fileUpload.success) {
                        const uploadImage = utils.writeFile(`${__dirname}/../uploads/expenses/${expense_name}${index}${f.originalname}`, fileUpload.data)
                        const url = `uploads/expenses/${expense_name}${index}${f.originalname}`
                        imageUrl.push(url)
                        if (uploadImage.success) {
                            utils.deleteFile(`${__dirname}/../uploads/${f.filename}`)
                        }
                    }
                })
                const sql = `INSERT into expense ('expense_name, amount, include_item, status, expense_person, expense_date, remark, vendor_name, transaction_id, payment_mode,expense_bil) VALUES ('${expense_name}', ${amount}, '${include_item}', '${status}', ${expense_person}, '${expense_date}', '${remark}', '${vendor_name}', '${transaction_id}', '${payment_mode}','${JSON.stringify(imageUrl)}')`
                const resp = await client(sql);
                return response.status(200).send({
                    success: true,
                    message: "Expense Add successfully",
                    data: resp
                })
            } else {
                return response.status(400).send({
                    success: false,
                    message: 'Image is missing'
                })
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

exports.getExpense = async (request, response) => {
    try {
        const sql = `SELECT * from expense as e inner join employee as u on e.expense_person = u.employee_id OR e.expense_approve_person = u.employee_id`
        const res = await client(sql)
        return response.status(200).send({
            success: true,
            message: `Expense Data Found`,
            data: res
        })
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}

exports.approveExpense = async (request, response) => {
    try {
        let check_param = [
            { name: 'status', type: 'string' },
            { name: 'expense_approve_person', type: 'number' },
            { name: 'expense_approve_date', type: 'string' },
            { name: 'expense_id', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { status, expense_approve_person, expense_approve_date, expense_id } = request.body
            const sql = `UPDATE expense SET status = '${status}',expense_approve_person = ${expense_approve_person},expense_approve_date='${expense_approve_date}' where expense_id  = ${expense_id}`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: "Expense Approved"
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(200).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}