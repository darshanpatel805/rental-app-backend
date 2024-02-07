const client = require('../db-connection')
const utils = require('../config/utils')


exports.addVendor = async (request, response) => {
    try {
        let check_param = [
            { name: 'vendor_name', type: 'string' },
            { name: 'vendor_code', type: 'string' },
            { name: 'vendor_contact_num', type: 'string' },
            { name: 'vendor_address', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { vendor_name, vendor_code, vendor_contact_num, vendor_alt_code, vendor_alt_num, vendor_address } = request.body
            const sql = `INSERT into vendor(vendor_name, vendor_code, vendor_contact_num, vendor_alt_code, vendor_alt_num, vendor_address)VALUES('${vendor_name}', '${vendor_code}', '${vendor_contact_num}', '${vendor_alt_code}', '${vendor_alt_num}', '${vendor_address}')`
            const res = await client(sql);
            return response.status(200).send({
                success: true,
                message: `Vendor Add Successfully`
            })
        } else {
            return response.status(404).json({ success: false, message: 'File is missing' });
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}

exports.getVendor = async (request, response) => {
    try {
        const sql = `SELECT * from vendor where vendor_isdelete = 0`
        const res = await client(sql)
        return response.status(200).send({
            success: true,
            message: 'Vendor Found',
            data: res
        })
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}

exports.updateVendor = async (request, response) => {
    try {
        let check_param = [
            { name: 'vendor_name', type: 'string' },
            { name: 'vendor_code', type: 'string' },
            { name: 'vendor_contact_num', type: 'string' },
            { name: 'vendor_address', type: 'string' },
            { name: 'vendor_id', type: 'number' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { vendor_name, vendor_code, vendor_contact_num, vendor_alt_code, vendor_alt_num, vendor_address, vendor_id } = request.body

            const sql = `UPDATE vendor SET vendor_name = '${vendor_name}',vendor_code = '${vendor_code}', vendor_contact_num = '${vendor_contact_num}', vendor_alt_code = '${vendor_alt_code}', vendor_alt_num = '${vendor_alt_num}', vendor_address = '${vendor_address}' where vendor_id = ${vendor_id}`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: 'Vendor Update Successfully'
            })
        } else {
            return response.status(404).json({ success: false, message: 'File is missing' });
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}

exports.deleteVendor = async (request, response) => {
    try {
        const { vendor_id } = request.params
        if (vendor_id) {
            const sql = `UPDATE vendor SET vendor_isdelete = 1 where vendor_id = ${vendor_id}`
            const res = await client(sql)
            return response.status(200).send({
                success: true,
                message: 'Vendor Delete Successfully'
            })
        } else {
            return response.status(404).json({ success: false, message: 'vendor_id is missing' });
        }
    } catch (error) {
        console.log(error)
        return response.success(500).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}

exports.vendorVerify = async (request, response) => {
    try {
        let check_param = [
            { name: 'code', type: 'string' },
            { name: 'contact_num', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { code, contact_num } = request.body
            const sql = `SELECT *  from vendor where vendor_code  = '${code}' AND vendor_contact_num = '${contact_num}'`
            const res = await client(sql)
            if (res.length > 0) {
                return response.status(200).send({
                    success: true,
                    message: 'varify Vendor Found',
                    data:res[0]
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: `Vendor Not Found`
                })
            }
        } else {
            return response.status(404).json({ success: false, message: 'File is missing' });
        }
    } catch (error) {
        console.log(error)
        return response.status(200).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}