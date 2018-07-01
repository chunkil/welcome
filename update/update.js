const update = function(target, command) {
  var tmpTarget = {};
  var targetKey = Object.keys(command)[0];

  var keysOfTarget = Object.keys(target);

  console.log(keysOfTarget[0]);

  for(var i = 0;i < keysOfTarget.length;i++) {
    tmpTarget[keysOfTarget[i]] = target[keysOfTarget[i]];
  }
  
  tmpTarget[targetKey] = command[targetKey]['$set'];

  return tmpTarget;
}

// const state = { name: "Alice", todos: [] };
// const nextState = update(state, {
//   name: { $set: "Bob" }
// });

// console.log(nextState.name === "Bob"); // true
// console.log(state.todos === nextState.todos); // true

module.exports = update;