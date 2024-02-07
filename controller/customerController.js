const client = require('../db-connection')
const utils = require('../config/utils')

exports.addCustomer = async (request, response) => {
    try {
        let check_param = [
            { name: 'c_first_name', type: 'string' },
            { name: 'c_last_name', type: 'string' },
            { name: 'c_address', type: 'string' },
            { name: 'wp_num', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const document = request.files
            console.log(document)
            const { c_first_name, c_last_name, c_code, wp_num, alt_code, alt_num, c_address, block } = request.body;
            if (document) {
                const documentUrl = [];
                document.map((d, index) => {
                    const readFile = utils.fileRead(`${__dirname}/../uploads/${d.filename}`)
                    if (readFile.success) {
                        const uploadDocument = utils.writeFile(`${__dirname}/../uploads/customerDocument/${wp_num}${index}${d.originalname}`, readFile.data)
                        if (uploadDocument.success) {
                            const url = `uploads/customerDocument/${wp_num}${index}${d.originalname}`
                            documentUrl.push(url)
                            utils.deleteFile(`${__dirname}/../uploads/${d.filename}`)
                        }
                    }
                })

                const sql = `INSERT into customer(c_first_name, c_last_name,c_code, wp_num, alt_code ,alt_num, c_address, block,document) VALUES ('${c_first_name}', '${c_last_name}','${c_code}', '${wp_num}','${alt_code}', '${alt_num}', '${c_address}', ${block},'${JSON.stringify(documentUrl)}')`
                const res = await client(sql);
                return response.status(200).send({
                    success: true,
                    message: 'Customer Add Successfully',
                    data: res
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

exports.getCustomerData = async (request, response) => {
    try {
        const sql = `SELECT * from customer where is_delete = ${0}`
        const res = await client(sql)
        res.map((r) => {
            r.document = JSON.parse(r.document)
        })
        return response.status(200).send({
            success: true,
            message: 'customerData found',
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

exports.updateCustomerData = async (request, response) => {
    console.log(request)
    try {
        let check_param = [
            { name: 'c_first_name', type: 'string' },
            { name: 'customer_id', type: 'string' },
            { name: 'c_last_name', type: 'string' },
            { name: 'c_address', type: 'string' },
            { name: 'c_code', type: 'string' },
            { name: 'wp_num', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            let { deletedImage } = request.body
            const { c_first_name, c_last_name, c_code, wp_num, alt_code, alt_num, c_address, block } = request.body

            if (deletedImage) {
                deletedImage = JSON.parse(deletedImage)
                deletedImage.length > 0 && deletedImage.map((d) => {
                    utils.deleteFile(`${__dirname}/../${d}`)
                })
            }
            const file = request.files;
            let { existImage } = request.body
            existImage = JSON.parse(existImage)
            const imageUrl = [...existImage];
            if (file.length > 0) {
                file.map((f, index) => {
                    const fileUpload = utils.fileRead(`${__dirname}/../uploads/${f.filename}`)
                    if (fileUpload.success) {
                        const uploadImage = utils.writeFile(`${__dirname}/../uploads/customerDocument/${wp_num}${index}${f.originalname}`, fileUpload.data)
                        const url = `uploads/customerDocument/${wp_num}${index}${f.originalname}`
                        imageUrl.push(url)
                        if (uploadImage.success) {
                            utils.deleteFile(`${__dirname}/../uploads/${f.filename}`)
                        }
                    }
                })
            }

            const { customer_id } = request.body;

            const sql = `UPDATE customer SET  first_name = '${c_first_name}',
            last_name = '${c_last_name}',
            c_code = '${c_code}',
            wp_num = '${wp_num}',
            alt_code = '${alt_code}',
            alt_num = '${alt_num}',
            c_address = '${c_address}',
            block = ${block},
            document = '${JSON.stringify(imageUrl)}'
          WHERE customer_id = ${customer_id}`


            const resp = await client(sql);
            return response.status(200).send({
                success: true,
                message: "Customer Detail Update successfully",
                data: resp
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

exports.deleteCustomer = async (request, response) => {
    try {
        const { customer_id } = request.params;
        if (customer_id) {
            // const sql = `DELETE from product where product_id = ${product_id}`
            const sql = `SELECT * from customer where customer_id = ${customer_id}`
            const resp = await client(sql);

            const image = JSON.parse(resp[0].document)
            image.map((i) => {
                utils.deleteFile(`${__dirname}/../${i}`)
            })
            const deletesql = `DELETE from customer where customer_id = ${customer_id}`
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

exports.varifyCustomer = async (request, response) => {
    try {
        let check_param = [
            { name: 'code', type: 'string' },
            { name: 'contact_num', type: 'string' },
        ]
        const result = utils.check_request_params(request.body, check_param)
        if (result.success) {
            const { code, contact_num } = request.body
            const sql = `SELECT * from customer where c_code = '${code}' AND wp_num = '${contact_num}'`
            const [res] = await client(sql)
            if (res) {
                return response.status(200).send({
                    success: true,
                    message: `Customer Found`,
                    data: res
                })
            } else {
                return response.status(404).send({
                    success: true,
                    message: `Customer Not Found`,
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

