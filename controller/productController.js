const client = require('../db-connection')
const utils = require('../config/utils')


exports.addProduct = async (request, response) => {
  try {
    let check_param = [
      { name: 'product_name', type: 'string' },
      { name: 'product_bussiness_type', type: 'string' },
      { name: 'pd_refrence', type: 'string' },
      { name: 'pd_main_type', type: 'string' },
      { name: 'pd_type', type: 'string' },
    ]
    const result = utils.check_request_params(request.body, check_param)
    if (result.success) {
      const file = request.files;
      const { product_name, product_bussiness_type, pd_refrence, pd_main_type, pd_type, pd_washcharge, pd_stitchcharge, pd_hsncode, pd_saleprice, pd_rentprice, pd_service_status, pd_delivary_status, pd_include_items, pd_tax_percentage, pd_size, pd_color,pd_unit_mesure } = request.body
      const pd_quantity = 0
      const imageUrl = [];
      if (file.length > 0) {
        file.map((f, index) => {
          const fileUpload = utils.fileRead(`${__dirname}/../uploads/${f.filename}`)
          if (fileUpload.success) {
            const uploadImage = utils.writeFile(`${__dirname}/../uploads/productImage/${product_name}${index}${f.originalname}`, fileUpload.data)
            const url = `uploads/productImage/${product_name}${index}${f.originalname}`
            imageUrl.push(url)
            if (uploadImage.success) {
              utils.deleteFile(`${__dirname}/../uploads/${f.filename}`)
            }
          }
        })
        const sql = `INSERT into product (product_name, product_bussiness_type, pd_refrence, pd_main_type, pd_type, pd_washcharge, pd_stitchcharge, pd_quantity, pd_hsncode, pd_saleprice, pd_rentprice, pd_service_status, pd_delivary_status, pd_include_items, pd_tax_percentage, pd_size, pd_color ,pd_image,pd_mesure) VALUES ('${product_name}', '${product_bussiness_type}','${pd_refrence}', '${pd_main_type}', '${pd_type}', ${pd_washcharge}, ${pd_stitchcharge}, ${pd_quantity}, '${pd_hsncode}', ${pd_saleprice}, ${pd_rentprice},' ${pd_service_status}',' ${pd_delivary_status}', ${JSON.stringify(pd_include_items)},'${pd_tax_percentage}','${pd_size}', '${pd_color}','${JSON.stringify(imageUrl)}','${pd_unit_mesure}')`
        const resp = await client(sql);
        return response.status(200).send({
          success: true,
          message: "Product Add successfully",
          data: resp
        })
      } else {
        return response.status(400).send({
          success: false,
          message: 'Image is missing'
        })
      }
      //    console.log(request.files, __dirname)/
      // const fileContent = fs.readFileSync(`${__dirname}/../uploads/${request.files[0].filename}`)
      // fs.writeFileSync(`${__dirname}/../uploads/users/${request.files[0].originalname}`, fileContent)
      // fs.unlinkSync(`${__dirname}/../uploads/${request.files[0].filename}`);

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

exports.getProduct = async (request, response) => {
  try {

    let sql = `SELECT * from product`
    const res = await client(sql)
    res.map((r) => {
      r.pd_image = JSON.parse(r.pd_image);
      r.pd_include_items = JSON.parse(r.pd_include_items)
    })
    return response.status(200).send({
      success: true,
      message: "Product Data found",
      data: res
    })
  } catch (error) {
    console.log(error)
    return response.status(500).send({
      success: false,
      message: "Ooo's servar internal error"
    })
  }

}

exports.updateProduct = async (request, response) => {
  try {
    let check_param = [
      { name: 'product_name', type: 'string' },
      { name: 'product_id', type: 'string' },
      { name: 'product_bussiness_type', type: 'string' },
      { name: 'pd_refrence', type: 'string' },
      { name: 'pd_main_type', type: 'string' },
      { name: 'pd_type', type: 'string' },
    ]
    const result = utils.check_request_params(request.body, check_param)
    if (result.success) {
      let { deletedImage } = request.body
      const { product_name, product_bussiness_type, pd_refrence, pd_main_type, pd_type, pd_washcharge, pd_stitchcharge, pd_quantity, pd_hsncode, pd_saleprice, pd_rentprice, pd_service_status, pd_delivary_status, pd_include_items, pd_tax_percentage, pd_size, pd_color,pd_unit_mesure } = request.body

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
            const uploadImage = utils.writeFile(`${__dirname}/../uploads/productImage/${product_name}${index}${f.originalname}`, fileUpload.data)
            const url = `uploads/productImage/${product_name}${index}${f.originalname}`
            imageUrl.push(url)
            if (uploadImage.success) {
              utils.deleteFile(`${__dirname}/../uploads/${f.filename}`)
            }
          }
        })
      }

      const { product_id } = request.body;

      const sql = `UPDATE product SET product_name = '${product_name}',product_bussiness_type = '${product_bussiness_type}',pd_refrence = '${pd_refrence}',pd_main_type = '${pd_main_type}',pd_type = '${pd_type}',pd_washcharge = ${pd_washcharge},pd_stitchcharge = ${pd_stitchcharge},pd_quantity = ${pd_quantity},pd_hsncode = '${pd_hsncode}',
        pd_saleprice = ${pd_saleprice},
        pd_rentprice = ${pd_rentprice},
        pd_service_status = '${pd_service_status}',
        pd_delivary_status = '${pd_delivary_status}',
        pd_include_items = '${JSON.stringify(pd_include_items)}',
        pd_tax_percentage = '${pd_tax_percentage}',
        pd_size = '${pd_size}',
        pd_color = '${pd_color}',
        pd_image = '${JSON.stringify(imageUrl)}',
        pd_mesure = '${pd_unit_mesure}'
      WHERE product_id = ${product_id}`


      const resp = await client(sql);
      return response.status(200).send({
        success: true,
        message: "Product Update successfully",
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

exports.deleteProduct = async (request, response) => {
  try {
    const { product_id } = request.params;
    if (product_id) {
      // const sql = `DELETE from product where product_id = ${product_id}`
      const sql = `SELECT * from product where product_id = ${product_id}`
      const resp = await client(sql);

      const image = JSON.parse(resp[0].pd_image)
      image.map((i) => {
        utils.deleteFile(`${__dirname}/../${i}`)
      })
      const deletesql = `DELETE from product where product_id = ${product_id}`
      const res = await client(deletesql);
      return response.status(200).send({
        success: true,
        message: "Product Delete successfully",
        data: res
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

exports.getProductDetail = async (request, response) => {
  let check_param = [
    { name: 'product_id', type: 'number' },
  ]

  const result = utils.check_request_params(request.params, check_param)
  if (result) {
    const { product_id } = request.params
    try {
      let sql = `SELECT * from product where product_id = ${product_id}`
      const res = await client(sql)
      res.map((r) => {
        r.pd_image = JSON.parse(r.pd_image);
        r.pd_include_items = JSON.parse(r.pd_include_items)
      })
      return response.status(200).send({
        success: true,
        message: "Product Data found",
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

exports.getAccessory = async (request, response) => {
  const sql = `SELECT * from product where pd_main_type = ' '`
  try {
    const res = await client(sql);
    console.log(res)
    const newResponse = res.map((r) => {
      const item = {
        value: r.product_id,
        label: r.product_name
      }
      return item
    })

    return response.status(200).send({
      success: true,
      message: "Data Found",
      data: newResponse
    })
  } catch (error) {
    console.log(error)
    return response.status(500).send({
      success: false,
      message: "Ooop's servar internal error"
    })
  }
}

exports.getSearchProduct = async (request, response) => {
  try {
    const { searchParams } = request.params
    if (searchParams) {
      const sql = `SELECT * from product where product_name LIKE '%${searchParams}%' OR pd_refrence LIKE '%${searchParams}%' AND product_bussiness_type = 1 OR product_bussiness_type = 2`
      const result = await client(sql);
      result.map((r) => {
        r.pd_image = JSON.parse(r.pd_image)
      })
      return response.status(200).send({
        success: true,
        message: 'Product Found',
        data: result
      })

    } else {
      return response.status(404).send({
        success: false,
        message: "Search value not found"
      })
    }
  } catch (error) {
    console.log(error)
    return response.status(500).send({
      success: false,
      message: "Ooo's servar internal error"
    })
  }
}