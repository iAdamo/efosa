
export const setValueIfRef = (fullJson, value) => {
//console.log('Set value if ref');
//console.log(value);
  if(value === undefined){
    return value;
  }

  while(value['$ref'] !== undefined){
    let refSplit = splitReference(value['$ref']);
    let temp = fullJson;

    for(let i = 1; i < refSplit.length; i++){
      if(temp === undefined){
        return value;
      }
      temp = temp[refSplit[i]];

    }
    value = temp;
  }

  return value;


};

export const isValueARef = (value) => {
  if(value === undefined){
    return false;
  }
  if(value['$ref'] !== undefined){
    return true;
  }
  return false;
};

export const getRefName = (value) => {
  if(value['$ref'] !== undefined){
    return value['$ref'];
  }
  return '';
};

const splitReference = (reference) => {
  return reference.split('/');
}

export const OpenAPIHelper = (obj) => {};
