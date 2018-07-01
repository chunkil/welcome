const update = (target, command) => {
  let newTarget = {};
  const commandInfo = findMethod(command);
  
  // const targetKey = Object.keys(command)[0];

  const keysOfTarget = Object.keys(target);


  for(let i = 0;i < keysOfTarget.length;i++) {
    newTarget[keysOfTarget[i]] = target[keysOfTarget[i]];
  }
  
  //console.log(commandInfo);
  setValue(newTarget, commandInfo.keys, commandInfo.updateValue);
  //newTarget[targetKey] = command[targetKey]['$set'];

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
      result.updateValue = nestedObj(tmp, result.keys);
      result.updateValue = result.updateValue[result.method];
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
  let tmp = obj;
  for(let i = 0;i < arr.length;i++) {
    if(i === arr.length - 1) {
      tmp[arr[i]] = value;
    } else {
      tmp = tmp[arr[i]];
    }
  }
}

// console.log(findMethod({a:{b:{c:{$set:1}}}}));



// const state = { name: "Alice", todos: [] };
// const nextState = update(state, {
//   name: { $set: "Bob" }
// });

// console.log('next', nextState);
// console.log('next', state);
// console.log(nextState.name === "Bob"); // true
// console.log(state.todos === nextState.todos); // true

module.exports = update;