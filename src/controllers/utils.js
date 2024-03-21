/* UTILITIES */

exports.genId = () => {
    const numberMap = {
        0: 'A',
        1: 'a',
        2: 'B',
        3: 'b',
        4: 'Z',
        5: 'E',
        6: 'e',
        7: 'Q',
        8 : 't',
        9 : 'K'
    };
    // Loop through each key in numberMap and replace occurrences in the string
    let str = (Math.floor(Math.random() * 10000 * (new Date()).getTime()) + "7").split("")
    let _res = ""
    for(let i=0;i<str.length;i++) {
        _res += numberMap[str[i] * 1]
    }
    return _res;
}

