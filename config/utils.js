const fs = require('fs')

exports.check_request_params = (request_data_body, params_array) => {
  // console.log(request_data_body, 'request_data_body')
  let missing_param = "";
  let is_missing = false;
  let invalid_param = "";
  let is_invalid_param = false;

  params_array.forEach(function (param) {
    if (request_data_body[param.name] == undefined) {
      missing_param = param.name;
      is_missing = true;
    } else {
      if (param.type && typeof request_data_body[param.name] !== param.type) {
        is_invalid_param = true;
        invalid_param = param.name;
      }
    }
  });
  if (is_missing) {
    // console.log("missing_param: " + missing_param)
    return {
      success: false,
      error_code: "ERROR_CODE.PARAMETER_MISSING",
      error_description: missing_param + " parameter missing",
    };
  } else if (is_invalid_param) {
    // console.log("invalid_param: " + invalid_param)
    return {
      success: false,
      error_code: "ERROR_CODE.PARAMETER_INVALID",
      error_description: invalid_param + " parameter invalid",
    };
  } else {
    return { success: true };
  }
};

exports.fileRead = (fileUrl) => {
  if (fileUrl === '') {
    return { success: false, message: 'Missing File url' }
  } else {
    const fileContent = fs.readFileSync(fileUrl)
    if (fileContent) {
      return { success: true, message: 'file found', data: fileContent }
    } else {
      return { success: false, message: "file is missing" }
    }
  }
}

exports.writeFile = (filepath, filecontent) => {
  if (filepath === '') {
    return { success: false, message: "filePath is missing" };
  } else if (!filecontent) {
    return { success: faalse, message: "filecontent is missing" }
  } else {
    fs.writeFileSync(filepath, filecontent)
    return {success:true , message:"Write File succesfully"}
  }
}

exports.deleteFile  = (filepath) => {
  if(filepath === ''){
    return {success:false , message:'filepath is missing'}
  }else{
    fs.unlinkSync(filepath);
    return {success:true,message:"file removed Successfully"}
  }
}