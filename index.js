// const dois = Symbol('oi');
// const tres = Symbol('oi');

const teste = {
    [Symbol.for('oi')]: 2,
    [Symbol.for('oi')]: 3,
}

console.log(teste)