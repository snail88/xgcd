function f1() {
    return 2
}
function f2(callback) {
    let a = callback();
    console.log(a+8);
}

f2(f1)

