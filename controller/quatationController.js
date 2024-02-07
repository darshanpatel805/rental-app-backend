const client = require('../db-connection')
const utils = require('../config/utils')


exports.getQuatationList = async (request, response) => {
    try {
        const sql = `SELECT * from quatation as q inner join customer as c on q.customer_id = c.customer_id inner join employee as e on e.employee_id  = q.sales_person where q.q_isdelete = 0`
        const result = await client(sql)
        const newResponse = []
        result.map((r) => {
            const newr = {
                quatation_id: r.quatation_id,
                customer_id: r.customer_id,
                quatation_date: r.quatation_date,
                status: r.status,
                confirm_date: r.confirm_date,
                cancel_date: r.cancel_date,
                sales_person: r.sales_person,
                delivary_date: r.delivary_date,
                return_date: r.return_date,
                final_amount: r.final_amount,
                quatation_item: r.quatation_item,
                customer_name: r.c_first_name + r.c_last_name,
                employee_name: r.first_name + r.last_name,
                customer_address: r.c_address,
                customer_contact: r.wp_num,
                customer_code: r.c_code
            }
            newResponse.push(newr)
        })

        return response.status(200).send({
            success: true,
            message: 'Quatationlist Found',
            data: newResponse
        })

    } catch (error) {
        console.log(error)
        response.status(500).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}

exports.addQuatation = async (request, response) => {
    try {
        let check_param = [
            { name: 'customer_id', type: 'number' },
            { name: 'quatation_date', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'delivary_date', type: 'string' },
            { name: 'return_date', type: 'string' },
            { name: 'final_amount', type: 'number' },
            { name: 'quatation_item', type: 'string' },
            { name: 'sales_person', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { customer_id, quatation_date, status, delivary_date, return_date, final_amount, quatation_item, sales_person } = request.body
            const sql = `INSERT into quatation (customer_id, quatation_date, status, delivary_date, return_date, final_amount, quatation_item, sales_person ) VALUES('${customer_id}', '${quatation_date}', '${status}', '${delivary_date}', '${return_date}', '${final_amount}', '${quatation_item}', '${sales_person}' )`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: "Quatation Add successfully"
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

exports.updateQuatation = async (request, response) => {
    try {
        let check_param = [
            { name: 'customer_id', type: 'number' },
            { name: 'quatation_id', type: 'number' },
            { name: 'quatation_date', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'delivary_date', type: 'string' },
            { name: 'return_date', type: 'string' },
            { name: 'final_amount', type: 'number' },
            { name: 'quatation_item', type: 'string' },
            { name: 'sales_person', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { quatation_id, customer_id, quatation_date, status, delivary_date, return_date, final_amount, quatation_item, sales_person, confirm_date, cancel_date } = request.body
            const sql = `UPDATE quatation
            SET
              customer_id = '${customer_id}',
              quatation_date = '${quatation_date}',
              status = '${status}',
              delivary_date = '${delivary_date}',
              return_date = '${return_date}',
              final_amount = '${final_amount}',
              quatation_item = '${quatation_item}',
              sales_person = '${sales_person}',
              confirm_date = '${confirm_date}',
              cancel_date = '${cancel_date}'
            WHERE quatation_id = ${quatation_id}`


            const res = await client(sql)

            return response.status(200).send({
                success: true,
                message: "Quatation Add successfully"
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

exports.deleteQuatation = async (request, response) => {
    try {
        const { quatation_id } = request.params
        if (quatation_id) {
            const checkStatus = `SELECT status from quatation where quatation_id = ${quatation_id}`
            const [status] = await client(checkStatus)
            console.log(status)
            if (status.status === 'New') {
                const sql = `UPDATE quatation SET q_isdelete = 1 , status = 'Deleted' where quatation_id = ${quatation_id}`
                const res = client(sql)
                return response.status(200).send({
                    success: true,
                    message: `Quatation Delete Successfully`
                })
            } else {
                return response.status(400).send({
                    success: false,
                    message: `Quatation Can't Delete `
                })
            }
        } else {
            return response.status(404).json({
                success: false,
                message: "Quatation Not Found"
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}

exports.confirmQuatation = async (request, response) => {
    try {
        const { quatation_id } = request.params;
        if (quatation_id) {
            const sql = `UPDATE quatation SET status = 'Confirm',confirm_date = '${new Date()}' where quatation_id = '${quatation_id}'`
            await client(sql)
            return response.status(200).send({
                success: true,
                message: "Quatation Confirm Successfully"
            })
        } else {
            return response.status(404).send({
                success: false,
                message: "Quatation Not Found"
            })
        }
    } catch (error) {
        console.error(error)
        return response.status(500).send({
            success: false,
            message: "Ooop's Server Internal Eroor"
        })
    }
}

exports.cancelQuatation = async (request, response) => {
    try {
        const { quatation_id } = request.params;
        if (quatation_id) {
            const sql = `UPDATE quatation SET status = 'Cancel',cancel_date = '${new Date()}' where quatation_id = ${quatation_id}`
            await client(sql)
            return response.status(200).send({
                success: true,
                message: "Cancel Quatation Successfully"
            })
        } else {
            return response.status(404).send({
                success: false,
                message: "Quatation Not Found"
            })
        }

    } catch (error) {
        console.error(error)
        response.status(500).send({
            success: false,
            message: "Ooop's Server Internal Error"
        })
    }
}

exports.delivaryOrder = async (request, response) => {
    try {
        const { quatation_id } = request.params;
        if (quatation_id) {
            const checkStatus = `SELECT status from quatation where quatation_id  =  ${quatation_id} AND q_isdelete =  0`
            const [status] = await client(checkStatus)
            if (status.status === 'Confirm') {
                const sql = `UPDATE quatation SET status = 'Delivared' where quatation_id = ${quatation_id}`
                await client(sql)
                return response.status(200).send({
                    success: true,
                    message: "Quatation  Delivared"
                })
            } else {
                return response.status(403).send({
                    success: false,
                    message: "Quatation Can't Delivared"
                })
            }
        } else {
            return response.status(404).send({
                success: false,
                message: "Quatation Not Found"
            })
        }
    } catch (error) {
        console.error(error)
        return response.status(500).send({
            success: false,
            message: "Ooop's Server Internal Error"
        })
    }
}

exports.doneOrder = async (request, response) => {

}

exports.getQuatationByStatus = async (request, response) => {
    try {
        const { status } = request.params;
        if (status) {
            const sql = `SELECT * from quatation as q inner join customer as c on q.customer_id = c.customer_id inner join employee as e on e.employee_id  = q.sales_person where q.q_isdelete = 0 AND q.status = '${status}'`
            const result = await client(sql)
            const newResponse = []
            result.map((r) => {
                const newr = {
                    quatation_id: r.quatation_id,
                    customer_id: r.customer_id,
                    quatation_date: r.quatation_date,
                    status: r.status,
                    confirm_date: r.confirm_date,
                    cancel_date: r.cancel_date,
                    sales_person: r.sales_person,
                    delivary_date: r.delivary_date,
                    return_date: r.return_date,
                    final_amount: r.final_amount,
                    quatation_item: r.quatation_item,
                    customer_name: r.c_first_name + r.c_last_name,
                    employee_name: r.first_name + r.last_name,
                    customer_address: r.c_address,
                    customer_contact: r.wp_num,
                    customer_code: r.c_code
                }
                newResponse.push(newr)
            })
            return response.status(200).send({
                success: true,
                message: "Quatation Data Found",
                data: newResponse
            })
        } else {
            return response.status(404).send({
                success: false,
                message: "Quatation Data Not Found"
            })
        }
    } catch (error) {
        console.error(error)
        return response.status(500).send({
            success: false,
            message: "Ooop's Server Internal Error"
        })
    }
}