const update = (target, command) => {
  const commandInfo = findMethod(command);  
  const targetKey = Object.keys(command)[0];
  const keysOfTarget = Object.keys(target);

  let newTarget = null;

  if(commandInfo.method === '$set') {
    newTarget = {};
    if(commandInfo.keys.length !== 0) {
      // for(let i = 0;i < keysOfTarget.length;i++) {
      //   newTarget[keysOfTarget[i]] = target[keysOfTarget[i]];
      // }
      newTarget = copyObject(target, targetKey);
      
      //console.log(commandInfo);
      setValue(newTarget, commandInfo.keys, commandInfo.updateValue);
      //newTarget[targetKey] = command[targetKey]['$set'];

    } else {
      newTarget = commandInfo.updateValue;
    }
    
  } else if(commandInfo.method === '$push') {
    //console.log(commandInfo);
    newTarget = target.slice(0);
    for(let i = 0;i < commandInfo.updateValue.length;i++) {
      newTarget.push(commandInfo.updateValue[i]);
    }
  } else if(commandInfo.method === '$unshift') {
    //console.log(commandInfo);
    newTarget = target.slice(0);
    for(let i = 0;i < commandInfo.updateValue.length;i++) {
      newTarget.unshift(commandInfo.updateValue[i]);
    }
  } else if(commandInfo.method === '$merge') {
    newTarget = copyObject(target, null);
    console.log(commandInfo);
  }

  
  return newTarget;
}


const findMethod = (command) => {
  let result = {};
  result.keys = [];
  
  const func = (target) => {
    const keyOfCommand = Object.keys(target)[0];
    let tmp = command;
    //console.log(keyOfCommand);
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

// console.log(findMethod({a:{b:{c:{$set:1}}}}));

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


//console.log(update({ a: "b" }, { $set: { c: "d" } }));
console.log(update({ a: "b" }, { $merge: { c: "d" } }));

module.exports = update;