const update = (target, command) => {
  const { keys, method, updateValue } = findMethod(command);  
  const targetKey = Object.keys(command)[0];
  const keysOfTarget = Object.keys(target);

  let newTarget = null;

  if(method === '$set') {
    newTarget = {};
    if(keys.length !== 0) {
      // for(let i = 0;i < keysOfTarget.length;i++) {
      //   newTarget[keysOfTarget[i]] = target[keysOfTarget[i]];
      // }
      newTarget = copyObject(target, targetKey);
      
      setValue(newTarget, keys, updateValue);
      //newTarget[targetKey] = command[targetKey]['$set'];

    } else {
      newTarget = updateValue;
    }
    
  } else if(method === '$push') {
    newTarget = target.slice(0);
    for(let i = 0;i < updateValue.length;i++) {
      newTarget.push(updateValue[i]);
    }

  } else if(method === '$unshift') {
    newTarget = target.slice(0);
    for(let i = 0;i < updateValue.length;i++) {
      newTarget.unshift(updateValue[i]);
    }

  } else if(method === '$merge') {
    newTarget = copyObject(target, null);
    let tmpObj = updateValue;
    for(let key in tmpObj) {
      newTarget[key] = tmpObj[key];
    }

  } else if(method === '$apply') {
    if(Array.isArray(target)) {

    } else if(typeof target === 'object') {

    } else {
      newTarget = updateValue(target);
    }

  } else if(method === '$splice') {
    newTarget = target.slice(0);
    for(let i = 0;i < updateValue.length;i++) {
      newTarget.splice.apply(newTarget, updateValue[i]);
    }

  } else {
    console.log('method is not exist')
  }
  
  return newTarget;
}


const findMethod = (command) => {
  let result = {};
  result.keys = [];
  
  const func = (target) => {
    const keyOfCommand = Object.keys(target)[0];
    let tmp = command;
    
    if(keyOfCommand[0] === '$') {
      result.method = keyOfCommand;
      if(result.keys.length === 0) {
        result.updateValue = command[result.method];
      } else {
        const tmpKey = nestedObj(tmp, result.keys);
        result.updateValue = tmpKey[result.method];
      }
    } else {
      result.keys.push(keyOfCommand);
      // for(let i = 0;i < result.keys.length;i++) {
      //   tmp = tmp[result.keys[i]];
      // }
      tmp = nestedObj(tmp, result.keys);
      func(tmp);
    }
  }
  func(command);

  return result;
}

const nestedObj = (obj, arr) => {
  let tmp = {};
  for(let i = 0;i < arr.length;i++) {
    if(i === 0) {
      tmp = obj[arr[i]];
    } else {
      tmp = tmp[arr[i]];
    }
    
  }
  
  return tmp;
}

const setValue = (obj, arr, value) => {
  for(let i = 0;i < arr.length;i++) {
    if(i === arr.length - 1) {
      obj[arr[i]] = value;
    } else {
      obj = obj[arr[i]];
    }
  }
}

const copyObject = (obj, keyOfCommand) => {
  let newObj = {};
  // if(Array.isArray(obj)) {
  //   newObj = [];
  // } else {
  //   newObj = {};
  // }
  
  for(let key in obj) {
    if(typeof obj[key] === 'object') {
      if(keyOfCommand === key) {
        newObj[key] = copyObject(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    } else {
      newObj[key] = obj[key];
    }
    
  }
  return newObj;
}

module.exports = update;