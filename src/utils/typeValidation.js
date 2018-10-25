// It creates functions for checking the type of a variable
module.exports = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].reduce((obj, name) => {
    obj['is' + name] = x => toString.call(x) == '[object ' + name + ']';
    return obj;
}, {});
