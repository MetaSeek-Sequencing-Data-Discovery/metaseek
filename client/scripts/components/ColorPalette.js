Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('material-ui/styles/colors');

var _colorManipulator = require('material-ui/utils/colorManipulator');

var _spacing = require('material-ui/styles/spacing');

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  spacing: _spacing2.default,
  palette: {
    primary1Color: "#6369E0",
    primary2Color: "#979CF2",
    primary3Color: "#9A99A6",
    accent1Color: "#FEB28D",
    accent2Color: "#E1E1E4",
    accent3Color: "#838291",
    textColor: "#0C0C12",
    secondaryTextColor: (0, _colorManipulator.fade)("#0C0C12", 0.54),
    alternateTextColor: _colors.white,
    canvasColor: _colors.white,
    borderColor: "#D0D0D7",
    disabledColor: (0, _colorManipulator.fade)("#0C0C12", 0.3),
    pickerHeaderColor: "#6369E0",
    clockCircleColor: (0, _colorManipulator.fade)("#0C0C12", 0.07),
    shadowColor: "#0C0C12"
  }
};
