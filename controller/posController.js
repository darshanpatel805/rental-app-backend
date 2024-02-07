const client = require('../db-connection')
const utils = require('../config/utils')
const { request } = require('express')

exports.createSession = async (req, res) => {
    try {
        let check_param = [
            { name: 's_start_person', type: 'number' },
            { name: 's_start_date', type: 'string' },
            { name: 'status', type: 'string' },
        ]
        const result = utils.check_request_params(req.body, check_param)
        if (result.success) {
            const { s_start_person, s_start_date, status } = req.body
            console.log(req.body)
            const sql = `INSERT into session (  s_start_person,s_start_date, status)VALUES( ${s_start_person}, '${s_start_date}', '${status}')`
            const response = await client(sql)
            return res.status(200).send({
                success: true,
                message: `Session Start Successfully`,
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: `Ooop's Server Intarnal Error`
        })
    }
}

exports.getCurrentSession = async (request, response) => {
    try {
        const sql = `SELECT * from session where status = 'Active'`
        const result = await client(sql)
        return response.status(200).send({
            success: true,
            message: `Session Found`,
            data: result
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: `Ooop's Server Intarnal Error`
        })
    }
}

exports.endSession = async (request, response) => {
    try {
        let check_param = [
            { name: 's_end_person', type: 'number' },
            { name: 's_end_date', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'session_id', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { s_end_person, s_end_date, status, session_id } = request.body;
            const sql = `UPDATE session SET s_end_person = ${s_end_person},s_end_date = '${s_end_date}' , status = '${status}' where session_id = ${session_id}`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: `Session End Successfully`,
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: `Ooop's Server Intarnal Error`
        })
    }
}

exports.getSessionList = async (request, response) => {
    try {
        const sql = `SELECT * from session where status = 'Closed'`
        const r = await client(sql)
        return response.status(200).send({
            success: true,
            message: "Session Data",
            data: r
        })
    } catch (error) {
        console.error(error)
        return response.status(500).send({
            success: false,
            message: "Ooop's Server Internal Error"
        })
    }
}

exports.addNewOrder = async (request, response) => {
    try {
        let check_param = [
            { name: 'session_id', type: 'number' },
            { name: 'customer_id', type: 'number' },
            { name: 'order_date', type: 'string' },
            { name: 'service_person', type: 'number' },
            { name: 'p_include_item', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'paid_amount', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { session_id, customer_id, order_date, service_person, p_include_item, status, payment_mode, paid_amount, tax_amount, transaction_id, remark } = request.body
            const sql = `INSERT into pos (session_id, customer_id, order_date, service_person, p_include_item, status, payment_mode, paid_amount, tax_amount, transaction_id, remark )VALUES (${session_id}, ${customer_id}, '${order_date}', ${service_person}, '${p_include_item}', '${status}', '${payment_mode}', ${paid_amount}, '${tax_amount}', '${transaction_id}', '${remark}' )`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: `Order Create Successfully`,
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's  Server Internal Error`
        })
    }
}

exports.updatePosOrder = async (request, response) => {
    try {
        let check_param = [
            { name: 'pos_id', type: 'number' },
            { name: 'p_include_item', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'payment_mode', type: 'string' },
            { name: 'paid_amount', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { pos_id, p_include_item, status, payment_mode, paid_amount, confirm_person, transaction_id, remark } = request.body
            const sql = `UPDATE pos  SET p_include_item = '${p_include_item}',status = '${status}',payment_mode = '${payment_mode}',paid_amount = ${paid_amount},confirm_person = ${confirm_person},transaction_id = '${transaction_id}',remark = '${remark}' where pos_id = ${pos_id}`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: 'Update Order Successfully'
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's  Server Internal Error`
        })
    }
}

exports.getPosOrderList = async (request, response) => {
    try {
        const sql = `SELECT * from pos where p_isdelete = 1`
        const res = await client(sql)
        res.map((r) => {
            r.p_include_item = JSON.parse(r.p_include_item)
        })
        return response.status(200).send({
            success: true,
            message: 'POS Order Data Found'
        })
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's  Server Internal Error`
        })
    }
}

exports.deletePosOrder = async (request, response) => {
    try {
        let check_param = [
            { name: 'pos_id', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { pos_id } = request.params;
            const sql = `UPDATE pos SET p_isdelete = 1 where pos_id = '{pos_id}'`
            const res = await client(sql);
            return response.data(200).send({
                success: true,
                message: 'Order Deleted Successfullys'
            })
        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's  Server Internal Error`
        })
    }
}