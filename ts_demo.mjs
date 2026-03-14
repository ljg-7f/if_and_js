var BypStyleEnum;
(function (BypStyleEnum) {
    BypStyleEnum[BypStyleEnum["HIDDEN"] = 0] = "HIDDEN";
    BypStyleEnum[BypStyleEnum["STYLE_ONE"] = 1] = "STYLE_ONE";
    BypStyleEnum[BypStyleEnum["STYLE_TWO"] = 2] = "STYLE_TWO";
    BypStyleEnum[BypStyleEnum["STYLE_THREE"] = 3] = "STYLE_THREE";
})(BypStyleEnum || (BypStyleEnum = {}));
console.log(BypStyleEnum.HIDDEN);
const n = 2;
console.log(2 !== BypStyleEnum.HIDDEN);
export {};
