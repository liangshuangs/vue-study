const navigationStart = [
    1635161905682,
    1635162201467,
    1635162220818,
    1635162240088,
    1635162258299,
    1635162274215,
    1635162293575,
    1635162312563,
    1635162330926,
    1635162350192
];
const firstScreenTime = [
    1635161908205,
    1635162204232,
    1635162223334,
    1635162242579,
    1635162260490,
    1635162277513,
    1635162295907,
    1635162315167,
    1635162333160,
    1635162352682
];
const navigationStart2 = [
    1635162396212,
    1635162418026,
    1635162435590,
    1635162451434,
    1635162469489,
    1635162487047,
    1635162504924,
    1635162707153,
    1635162723407,
    1635162745047
]
const firstScreenTime2 = [
    1635162398685,
    1635162420450,
    1635162438090,
    1635162453801,
    1635162471654,
    1635162489217,
    1635162507322,
    1635162709793,
    1635162725531,
    1635162747374

]
function run(navigationStart, firstScreenTime) {
    let len = navigationStart.length;
    const res = [];
    let reg = 0;
    for (let i = 0; i < len; i++) {
        const num = firstScreenTime[i] - navigationStart[i];
        reg = reg + num;
        res.push(num);
    }
    const avg = reg / len;
    console.log(avg, res);
}
run(navigationStart, firstScreenTime)
run(navigationStart2, firstScreenTime2)