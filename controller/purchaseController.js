const client = require('../db-connection')
const utils = require('../config/utils')
const { v4: uuidv4 } = require("uuid");


exports.addPurchase = async (request, response) => {
    try {
        let check_param = [
            { name: 'vendor_id', type: 'string' },
            { name: 'order_person', type: 'string' },
            { name: 'total_paid_amount', type: 'string' },
            { name: 'include_item', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'order_date', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const file = request.files;
            console.log(file)
            const { vendor_id, order_date, order_person, total_paid_amount, include_item, status, delivary_date, remark } = request.body
            const imageUrl = [];
            if (file.length > 0) {
                file.map((f, index) => {
                    const imgId = uuidv4()
                    const fileUpload = utils.fileRead(`${__dirname}/../uploads/${f.filename}`)
                    if (fileUpload.success) {
                        const uploadImage = utils.writeFile(`${__dirname}/../uploads/purchasebill/${imgId}${vendor_id}${index}${f.originalname}`, fileUpload.data)
                        const url = `uploads/purchasebill/${imgId}${vendor_id}${index}${f.originalname}`
                        imageUrl.push(url)
                        if (uploadImage.success) {
                            utils.deleteFile(`${__dirname}/../uploads/${f.filename}`)
                        }
                    }
                })
            }

            const addpurchaseQuery = `INSERT into purchase (vendor_id, p_order_date, order_person, total_paid_amount, include_item, status, delivary_date,remark,bill_image)VALUES(${vendor_id}, '${order_date}', ${order_person},  ${total_paid_amount},' ${include_item}','${status}','${delivary_date}','${remark}','${JSON.stringify(imageUrl)}' )`

            const res = await client(addpurchaseQuery)
            return response.status(200).send({
                success: true,
                message: 'Add purchase Successfully'
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

exports.getPurchaseList = async (request, response) => {
    try {
        const sql = `SELECT p.*, v.vendor_name, v.vendor_code, v.vendor_address, v.vendor_contact_num,
        CONCAT(e1.first_name, ' ', e1.last_name) AS order_person_full_name,
        COALESCE(CONCAT(e2.first_name, ' ', e2.last_name), 'N/A') AS confirm_person_full_name
 FROM test.purchase AS p
 INNER JOIN test.vendor AS v ON p.vendor_id = v.vendor_id
 INNER JOIN test.employee AS e1 ON p.order_person = e1.employee_id
 LEFT JOIN test.employee AS e2 ON p.confirm_person = e2.employee_id
 WHERE p.p_isdelete = 0;
 `
        const res = await client(sql)

        return response.status(200).send({
            success: true,
            message: "Purchase Data Found",
            data: res
        })

    } catch (error) {
        console.log(error)
        return response.status(200).send({
            success: false,
            message: `Ooop's Server Internal Eroor`
        })
    }
}

exports.updatePurchase = async (request, response) => {
    try {
        let check_param = [
            { name: 'purchase_id', type: 'string' },
            { name: 'total_paid_amount', type: 'string' },
            { name: 'include_item', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'order_date', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            let { deletedImage } = request.body
            const { purchase_id, total_paid_amount, include_item, status, delivary_date, remark, order_date, vendor_id } = request.body
            let { existImage } = request.body
            if (deletedImage) {
                deletedImage = JSON.parse(deletedImage)
                console.log(deletedImage)
                deletedImage.length > 0 && deletedImage.map((d) => {
                    utils.deleteFile(`${__dirname}/../${d}`)
                })
            }
            const file = request.files;
            existImage = JSON.parse(existImage)
            const imageUrl = [...existImage];
            if (file.length > 0) {
                file.map((f, index) => {
                    const imgId = uuidv4()
                    const fileUpload = utils.fileRead(`${__dirname}/../uploads/${f.filename}`)
                    if (fileUpload.success) {
                        const uploadImage = utils.writeFile(`${__dirname}/../uploads/purchasebill/${imgId}${vendor_id}${index}${f.originalname}`, fileUpload.data)
                        const url = `uploads/purchasebill/${imgId}${vendor_id}${index}${f.originalname}`
                        imageUrl.push(url)
                        if (uploadImage.success) {
                            utils.deleteFile(`${__dirname}/../uploads/${f.filename}`)
                        }
                    }
                })
            }
            const updatePurchase = `UPDATE purchase SET status = '${status}',include_item = '${include_item}',p_order_date = '${order_date}',total_paid_amount = ${total_paid_amount} ,delivary_date = '${delivary_date}',remark = '${remark}',bill_image = '${JSON.stringify(imageUrl)}' where purchase_id = ${purchase_id}`

            const r = await client(updatePurchase)

            return response.status(200).send({
                success: true,
                message: 'data update successfully'
            })

        } else {
            return response.status(400).json(result);
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's Server Internal Eroor`
        })
    }
}

exports.deletePurchase = async (request, response) => {
    try {
        const { purchase_id } = request.params

        if (purchase_id) {
            const query = `SELECT status from purchase where purchase_id = ${purchase_id}`
            const [check_status] = await client(query)
            if (check_status.status === 'New') {
                const deletePurchase = `UPDATE purchase SET p_isdelete = 1 , status = 'Deleted', deleted_parson = ${request.user} where purchase_id = ${purchase_id}`
                const d = await client(deletePurchase)
                return response.status(200).send({
                    success: true,
                    message: 'Purchase Delete Successfully'
                })
            } else {
                return response.status(403).send({
                    success: false,
                    message: "This Purchase Can't Delete Because It's Confirmed"
                })
            }
        } else {
            return response.status(403).send({
                success: false,
                message: 'purchase_id is Missing'
            })
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's server internal error`
        })
    }
}


exports.getPurchaseDetail = async (request, response) => {
    try {
        const { purchase_id } = request.params
        if (purchase_id) {
            const sql = `SELECT * from purchase where purchase_id = ${purchase_id}`
            const r = await client(r)
            const item = JSON.parse(r[0].include_item)
        } else {
            return response.status(404).send({ success: false, message: 'Purchase Id Is Missing' })
        }
    } catch (error) {
        console.log(error)
        return response.status(500).send({
            success: false,
            message: `Ooop's Server Internal Error`
        })
    }
}

exports.getIncludeProduct = async (req, res) => {
    try {
        const { product_ids } = req.body
        if (product_ids) {
            const sql = `SELECT * FROM product WHERE product_id IN (?)`
            const r = await client(sql, [product_ids])
            r.map((re) => {
                re.pd_image = JSON.parse(re.pd_image);
                re.pd_include_items = JSON.parse(re.pd_include_items)
            })
            return res.status(200).send({
                success: true,
                message: "product found",
                data: r
            })
        } else {
            return response.status(400).json({
                success: false,
                message: "missing code parameter"
            });
        }
    } catch (error) {

    }
}

exports.confirmPurchase = async (req, res) => {
    try {
        const { purchase_id } = req.params
        if (purchase_id) {
            const sql = `UPDATE purchase SET status = 'Confirm' where purchase_id = ${purchase_id}`
            const r = await client(sql)
            if (r) {
                const getIncludeProduct = `SELECT include_item from purchase where purchase_id = ${purchase_id}`
                let [include_item] = await client(getIncludeProduct)
                include_item = JSON.parse(include_item.include_item)
                console.log(include_item)
                const product_ids = include_item.map(item => item.product_id);
                const whereClause = `product_id IN (${product_ids.join(',')})`;
                const setClause = include_item.reduce((acc, item) => {
                    return acc + `WHEN ${item.product_id} THEN pd_quantity + ${item.quantity} `;
                }, 'SET pd_quantity = CASE ');
                const query = `UPDATE product ${setClause} ELSE pd_quantity END WHERE ${whereClause}`;
                const updateProduct = await client(query)
                return res.status(200).send({
                    success: true,
                    message: "Update Status SuccessFully",
                })
            }

        } else {
            return res.status(403).send({
                success: false,
                message: "Code parameter  Is Missing"
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: "Ooop's Server Internal Error"
        })
    }
}
