/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/buildCode.ts":
/*!**************************!*\
  !*** ./src/buildCode.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildCode = void 0;
var stringUtils_1 = __webpack_require__(/*! ./utils/stringUtils */ "./src/utils/stringUtils.ts");
function buildSpaces(baseSpaces, level) {
    var spacesStr = '';
    for (var i = 0; i < baseSpaces; i++) {
        spacesStr += ' ';
    }
    for (var i = 0; i < level; i++) {
        spacesStr += '  ';
    }
    return spacesStr;
}
function guessTagName(name) {
    var _name = name.toLowerCase();
    if (_name.includes('button')) {
        return 'button';
    }
    if (_name.includes('section')) {
        return 'section';
    }
    if (_name.includes('article')) {
        return 'article';
    }
    return 'div';
}
function getTagName(tag, cssStyle) {
    if (cssStyle === 'css' && !tag.isComponent) {
        if (tag.isImg) {
            return 'img';
        }
        if (tag.isText) {
            return 'p';
        }
        return guessTagName(tag.name);
    }
    return tag.isText ? 'Text' : tag.name.replace(/\s/g, '');
}
function getClassName(tag, cssStyle) {
    if (cssStyle === 'css' && !tag.isComponent) {
        if (tag.isImg) {
            return '';
        }
        if (tag.isText) {
            return ' className="text"';
        }
        return " className=\"" + stringUtils_1.kebabize(tag.name) + "\"";
    }
    return '';
}
function buildPropertyString(prop) {
    return " " + prop.name + (prop.value !== null ? "=" + (prop.notStringValue ? '{' : '"') + prop.value + (prop.notStringValue ? '}' : '"') : '');
}
function buildChildTagsString(tag, cssStyle, level) {
    if (tag.children.length > 0) {
        return '\n' + tag.children.map(function (child) { return buildJsxString(child, cssStyle, level + 1); }).join('\n');
    }
    if (tag.isText) {
        return "" + tag.textCharacters;
    }
    return '';
}
function buildJsxString(tag, cssStyle, level) {
    var spaceString = buildSpaces(4, level);
    var hasChildren = tag.children.length > 0;
    var tagName = getTagName(tag, cssStyle);
    var className = getClassName(tag, cssStyle);
    var properties = tag.properties.map(buildPropertyString).join('');
    var openingTag = spaceString + "<" + tagName + className + properties + (hasChildren || tag.isText ? "" : ' /') + ">";
    var childTags = buildChildTagsString(tag, cssStyle, level);
    var closingTag = hasChildren || tag.isText ? (!tag.isText ? '\n' + spaceString : '') + "</" + tagName + ">" : '';
    return openingTag + childTags + closingTag;
}
function buildCode(tag, css) {
    return "const " + stringUtils_1.capitalizeFirstLetter(tag.name.replace(/\s/g, '')) + ": React.VFC = () => {\n  return (\n" + buildJsxString(tag, css, 0) + "\n  )\n}";
}
exports.buildCode = buildCode;


/***/ }),

/***/ "./src/buildCssString.ts":
/*!*******************************!*\
  !*** ./src/buildCssString.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildCssString = void 0;
var stringUtils_1 = __webpack_require__(/*! ./utils/stringUtils */ "./src/utils/stringUtils.ts");
function buildArray(tag, arr) {
    arr.push(tag.css);
    tag.children.forEach(function (child) {
        arr = buildArray(child, arr);
    });
    return arr;
}
function buildCssString(tag, cssStyle) {
    var cssArray = buildArray(tag, []);
    var codeStr = '';
    cssArray.forEach(function (cssData) {
        var cssStr = cssStyle === 'styled-components'
            ? "const " + cssData.className.replace(/\s/g, '') + " = styled.div`\n" + cssData.properties.map(function (property) { return "  " + property.name + ": " + property.value + ";"; }).join('\n') + "\n`\n"
            : "." + stringUtils_1.kebabize(cssData.className) + " {\n" + cssData.properties.map(function (property) { return "  " + property.name + ": " + property.value + ";"; }).join('\n') + "\n}\n";
        codeStr += cssStr;
    });
    return codeStr;
}
exports.buildCssString = buildCssString;


/***/ }),

/***/ "./src/buildSizeStringByUnit.ts":
/*!**************************************!*\
  !*** ./src/buildSizeStringByUnit.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildSizeStringByUnit = void 0;
function buildSizeStringByUnit(pixelValue, type) {
    if (type === 'px') {
        return pixelValue + 'px';
    }
    if (type === 'rem') {
        return pixelValue / 16 + 'rem';
    }
    return pixelValue / 10 + 'rem';
}
exports.buildSizeStringByUnit = buildSizeStringByUnit;


/***/ }),

/***/ "./src/buildTagTree.ts":
/*!*****************************!*\
  !*** ./src/buildTagTree.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildTagTree = void 0;
var getCssDataForTag_1 = __webpack_require__(/*! ./getCssDataForTag */ "./src/getCssDataForTag.ts");
var isImageNode_1 = __webpack_require__(/*! ./utils/isImageNode */ "./src/utils/isImageNode.ts");
function buildTagTree(node, unitType) {
    if (!node.visible) {
        return null;
    }
    var isImg = isImageNode_1.isImageNode(node);
    var properties = [];
    if (isImg) {
        properties.push({ name: 'src', value: '' });
    }
    var childTags = [];
    if ('children' in node && !isImg) {
        node.children.forEach(function (child) {
            childTags.push(buildTagTree(child, unitType));
        });
    }
    var tag = {
        name: isImg ? 'img' : node.name,
        isText: node.type === 'TEXT',
        textCharacters: node.type === 'TEXT' ? node.characters : null,
        isImg: isImg,
        css: getCssDataForTag_1.getCssDataForTag(node, unitType),
        properties: properties,
        children: childTags,
        node: node
    };
    return tag;
}
exports.buildTagTree = buildTagTree;


/***/ }),

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var modifyTreeForComponent_1 = __webpack_require__(/*! ./modifyTreeForComponent */ "./src/modifyTreeForComponent.ts");
var buildCode_1 = __webpack_require__(/*! ./buildCode */ "./src/buildCode.ts");
var buildTagTree_1 = __webpack_require__(/*! ./buildTagTree */ "./src/buildTagTree.ts");
var buildCssString_1 = __webpack_require__(/*! ./buildCssString */ "./src/buildCssString.ts");
figma.showUI(__html__, { width: 480, height: 440 });
var selectedNodes = figma.currentPage.selection;
var CSS_STYLE_KEY = 'CSS_STYLE_KEY';
var UNIT_TYPE_KEY = 'UNIT_TYPE_KEY';
function generate(node, config) {
    return __awaiter(this, void 0, void 0, function () {
        var cssStyle, unitType, tag, generatedCodeStr, cssString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cssStyle = config.cssStyle;
                    if (!!cssStyle) return [3 /*break*/, 2];
                    return [4 /*yield*/, figma.clientStorage.getAsync(CSS_STYLE_KEY)];
                case 1:
                    cssStyle = _a.sent();
                    if (!cssStyle) {
                        cssStyle = 'css';
                    }
                    _a.label = 2;
                case 2:
                    unitType = config.unitType;
                    if (!!unitType) return [3 /*break*/, 4];
                    return [4 /*yield*/, figma.clientStorage.getAsync(UNIT_TYPE_KEY)];
                case 3:
                    unitType = _a.sent();
                    if (!unitType) {
                        unitType = 'px';
                    }
                    _a.label = 4;
                case 4:
                    tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(node, unitType), figma);
                    generatedCodeStr = buildCode_1.buildCode(tag, cssStyle);
                    cssString = buildCssString_1.buildCssString(tag, cssStyle);
                    figma.ui.postMessage({ generatedCodeStr: generatedCodeStr, cssString: cssString, cssStyle: cssStyle, unitType: unitType });
                    return [2 /*return*/];
            }
        });
    });
}
if (selectedNodes.length > 1) {
    figma.notify('Please select only 1 node');
    figma.closePlugin();
}
else if (selectedNodes.length === 0) {
    figma.notify('Please select a node');
    figma.closePlugin();
}
else {
    generate(selectedNodes[0], {});
}
figma.ui.onmessage = function (msg) {
    if (msg.type === 'notify-copy-success') {
        figma.notify('copied to clipboard👍');
    }
    if (msg.type === 'new-css-style-set') {
        figma.clientStorage.setAsync(CSS_STYLE_KEY, msg.cssStyle);
        generate(selectedNodes[0], { cssStyle: msg.cssStyle });
    }
    if (msg.type === 'new-unit-type-set') {
        figma.clientStorage.setAsync(UNIT_TYPE_KEY, msg.unitType);
        generate(selectedNodes[0], { unitType: msg.unitType });
    }
};


/***/ }),

/***/ "./src/getCssDataForTag.ts":
/*!*********************************!*\
  !*** ./src/getCssDataForTag.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCssDataForTag = void 0;
var buildSizeStringByUnit_1 = __webpack_require__(/*! ./buildSizeStringByUnit */ "./src/buildSizeStringByUnit.ts");
var isImageNode_1 = __webpack_require__(/*! ./utils/isImageNode */ "./src/utils/isImageNode.ts");
var justifyContentCssValues = {
    MIN: 'flex-start',
    MAX: 'flex-end',
    CENTER: 'center',
    SPACE_BETWEEN: 'space-between'
};
var alignItemsCssValues = {
    MIN: 'flex-start',
    MAX: 'flex-end',
    CENTER: 'center'
};
var textAlignCssValues = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center',
    JUSTIFIED: 'justify'
};
var textVerticalAlignCssValues = {
    TOP: 'top',
    CENTER: 'middle',
    BOTTOM: 'bottom'
};
var textDecorationCssValues = {
    UNDERLINE: 'underline',
    STRILETHROUGH: 'line-through'
};
function getCssDataForTag(node, unitType) {
    var properties = [];
    // skip vector since it's often displayed as an img tag
    if (node.visible && node.type !== 'VECTOR') {
        if ('opacity' in node && node.opacity < 1) {
            properties.push({ name: 'opacity', value: node.opacity });
        }
        if (node.rotation !== 0) {
            properties.push({ name: 'transform', value: "rotate(" + Math.floor(node.rotation) + "deg)" });
        }
        if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
            var borderRadiusValue = getBorderRadiusString(node, unitType);
            if (borderRadiusValue) {
                properties.push({ name: 'border-radius', value: borderRadiusValue });
            }
            if (node.layoutMode !== 'NONE') {
                properties.push({ name: 'display', value: 'flex' });
                properties.push({ name: 'flex-direction', value: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column' });
                properties.push({ name: 'justify-content', value: justifyContentCssValues[node.primaryAxisAlignItems] });
                properties.push({ name: 'align-items', value: alignItemsCssValues[node.counterAxisAlignItems] });
                if (node.paddingTop === node.paddingBottom && node.paddingTop === node.paddingLeft && node.paddingTop === node.paddingRight) {
                    if (node.paddingTop > 0) {
                        properties.push({ name: 'padding', value: "" + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingTop, unitType) });
                    }
                }
                else if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight) {
                    properties.push({ name: 'padding', value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingTop, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingLeft, unitType) });
                }
                else {
                    properties.push({
                        name: 'padding',
                        value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingTop, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingRight, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingBottom, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingLeft, unitType)
                    });
                }
                if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && node.itemSpacing > 0) {
                    properties.push({ name: 'gap', value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.itemSpacing, unitType) });
                }
            }
            else {
                properties.push({ name: 'height', value: Math.floor(node.height) + 'px' });
                properties.push({ name: 'width', value: Math.floor(node.width) + 'px' });
            }
            if (node.fills.length > 0 && node.fills[0].type !== 'IMAGE') {
                var paint = node.fills[0];
                properties.push({ name: 'background-color', value: buildColorString(paint) });
            }
            if (node.strokes.length > 0) {
                var paint = node.strokes[0];
                properties.push({ name: 'border', value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.strokeWeight, unitType) + " solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'RECTANGLE') {
            var borderRadiusValue = getBorderRadiusString(node, unitType);
            if (borderRadiusValue) {
                properties.push({ name: 'border-radius', value: borderRadiusValue });
            }
            properties.push({ name: 'height', value: Math.floor(node.height) + 'px' });
            properties.push({ name: 'width', value: Math.floor(node.width) + 'px' });
            if (node.fills.length > 0 && node.fills[0].type !== 'IMAGE') {
                var paint = node.fills[0];
                properties.push({ name: 'background-color', value: buildColorString(paint) });
            }
            if (node.strokes.length > 0) {
                var paint = node.strokes[0];
                properties.push({ name: 'border', value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.strokeWeight, unitType) + " solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'TEXT') {
            properties.push({ name: 'text-align', value: textAlignCssValues[node.textAlignHorizontal] });
            properties.push({ name: 'vertical-align', value: textVerticalAlignCssValues[node.textAlignVertical] });
            properties.push({ name: 'font-size', value: node.fontSize + "px" });
            properties.push({ name: 'font-family', value: node.fontName.family });
            var letterSpacing = node.letterSpacing;
            if (letterSpacing.value !== 0) {
                properties.push({ name: 'letter-spacing', value: letterSpacing.unit === 'PIXELS' ? buildSizeStringByUnit_1.buildSizeStringByUnit(letterSpacing.value, unitType) : letterSpacing.value + '%' });
            }
            properties.push({
                name: 'line-height',
                value: node.lineHeight.unit === 'AUTO'
                    ? 'auto'
                    : node.letterSpacing.unit === 'PIXELS'
                        ? buildSizeStringByUnit_1.buildSizeStringByUnit(node.lineHeight.value, unitType)
                        : node.lineHeight.value + '%'
            });
            if (node.textDecoration !== 'NONE') {
                properties.push({ name: 'text-decoration', value: textDecorationCssValues[node.textDecoration] });
            }
            if (node.fills.length > 0) {
                var paint = node.fills[0];
                properties.push({ name: 'color', value: buildColorString(paint) });
            }
        }
        if (node.type === 'LINE') {
            properties.push({ name: 'height', value: Math.floor(node.height) + 'px' });
            properties.push({ name: 'width', value: Math.floor(node.width) + 'px' });
            if (node.strokes.length > 0) {
                var paint = node.strokes[0];
                properties.push({ name: 'border', value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.strokeWeight, unitType) + " solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'GROUP' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'STAR') {
            properties.push({ name: 'height', value: Math.floor(node.height) + 'px' });
            properties.push({ name: 'width', value: Math.floor(node.width) + 'px' });
        }
    }
    if (properties.length > 0) {
        var isImage = isImageNode_1.isImageNode(node);
        return {
            // name Text node as "Text" since name of text node is often the content of the node and is not appropriate as a name
            className: isImage ? 'img' : node.type === 'TEXT' ? 'text' : node.name,
            properties: properties
        };
    }
    return null;
}
exports.getCssDataForTag = getCssDataForTag;
function getBorderRadiusString(node, unitType) {
    if (node.cornerRadius !== 0) {
        if (typeof node.cornerRadius !== 'number') {
            return buildSizeStringByUnit_1.buildSizeStringByUnit(node.topLeftRadius, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.topRightRadius, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.bottomRightRadius, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.bottomLeftRadius, unitType);
        }
        return "" + buildSizeStringByUnit_1.buildSizeStringByUnit(node.cornerRadius, unitType);
    }
    return null;
}
function rgbValueToHex(value) {
    return Math.floor(value * 255).toString(16);
}
function buildColorString(paint) {
    if (paint.type === 'SOLID') {
        if (paint.opacity !== undefined && paint.opacity < 1) {
            return "rgba(" + Math.floor(paint.color.r * 255) + ", " + Math.floor(paint.color.g * 255) + ", " + Math.floor(paint.color.b * 255) + ", " + paint.opacity + ")";
        }
        return "#" + rgbValueToHex(paint.color.r) + rgbValueToHex(paint.color.g) + rgbValueToHex(paint.color.b);
    }
    return '';
}


/***/ }),

/***/ "./src/modifyTreeForComponent.ts":
/*!***************************************!*\
  !*** ./src/modifyTreeForComponent.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.modifyTreeForComponent = void 0;
var components = [
    {
        name: 'Spacer',
        matcher: function (node) {
            return node.name === 'Spacer' && (!('children' in node) || node.children.length === 0);
        },
        modifyFunc: function (tag) {
            if (tag.node.width > tag.node.height) {
                tag.properties.push({ name: 'height', value: tag.node.height.toString(), notStringValue: true });
            }
            else {
                tag.properties.push({ name: 'width', value: tag.node.width.toString(), notStringValue: true });
            }
            tag.isComponent = true;
            return tag;
        }
    }
];
function modify(tag, _figma) {
    if (!tag || !tag.node) {
        return tag;
    }
    var modifiedOnce = false;
    components.forEach(function (setting) {
        if (!modifiedOnce && setting.matcher(tag.node)) {
            tag = setting.modifyFunc(tag, _figma);
            modifiedOnce = true;
        }
    });
    return tag;
}
function modifyTreeForComponent(tree, _figma) {
    var newTag = modify(tree, _figma);
    newTag.children.forEach(function (child, index) {
        newTag.children[index] = modifyTreeForComponent(child, _figma);
    });
    return tree;
}
exports.modifyTreeForComponent = modifyTreeForComponent;


/***/ }),

/***/ "./src/utils/isImageNode.ts":
/*!**********************************!*\
  !*** ./src/utils/isImageNode.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isImageNode = void 0;
function isImageNode(node) {
    // 下部に Vector しか存在しないものは画像と判定する
    if ('children' in node && node.children.length > 0) {
        var hasOnlyVector_1 = true;
        node.children.forEach(function (child) {
            if (child.type !== 'VECTOR') {
                hasOnlyVector_1 = false;
            }
        });
        if (hasOnlyVector_1) {
            return true;
        }
    }
    else if (node.type === 'VECTOR') {
        return true;
    }
    if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
        if (node.fills.find(function (paint) { return paint.type === 'IMAGE'; }) !== undefined) {
            return true;
        }
    }
    return false;
}
exports.isImageNode = isImageNode;


/***/ }),

/***/ "./src/utils/stringUtils.ts":
/*!**********************************!*\
  !*** ./src/utils/stringUtils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kebabToUpperCamel = exports.capitalizeFirstLetter = exports.kebabize = void 0;
function kebabize(str) {
    return str
        .split('')
        .map(function (letter, idx) {
        return letter.toUpperCase() === letter ? "" + (idx !== 0 ? '-' : '') + letter.toLowerCase() : letter;
    })
        .join('');
}
exports.kebabize = kebabize;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function kebabToUpperCamel(str) {
    return capitalizeFirstLetter(str.split(/-|_/g).map(capitalizeFirstLetter).join(''));
}
exports.kebabToUpperCamel = kebabToUpperCamel;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/code.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ3NzU3RyaW5nLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRTaXplU3RyaW5nQnlVbml0LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRUYWdUcmVlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2dldENzc0RhdGFGb3JUYWcudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9tb2RpZnlUcmVlRm9yQ29tcG9uZW50LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9zdHJpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIsb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTBFO0FBQy9HO0FBQ0E7QUFDQSxxQ0FBcUMsd0VBQXdFO0FBQzdHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsOEJBQThCOzs7Ozs7Ozs7OztBQ3pDakI7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QywrQkFBK0IsRUFBRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COzs7Ozs7Ozs7OztBQzFCTjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCx5QkFBeUIsR0FBRyw2QkFBNkIsR0FBRyxnQkFBZ0I7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7Ozs7Ozs7VUNuQnpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VDckJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRDb2RlID0gdm9pZCAwO1xudmFyIHN0cmluZ1V0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmdVdGlsc1wiKTtcbmZ1bmN0aW9uIGJ1aWxkU3BhY2VzKGJhc2VTcGFjZXMsIGxldmVsKSB7XG4gICAgdmFyIHNwYWNlc1N0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZVNwYWNlczsgaSsrKSB7XG4gICAgICAgIHNwYWNlc1N0ciArPSAnICc7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWw7IGkrKykge1xuICAgICAgICBzcGFjZXNTdHIgKz0gJyAgJztcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlc1N0cjtcbn1cbmZ1bmN0aW9uIGd1ZXNzVGFnTmFtZShuYW1lKSB7XG4gICAgdmFyIF9uYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnYnV0dG9uJykpIHtcbiAgICAgICAgcmV0dXJuICdidXR0b24nO1xuICAgIH1cbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ3NlY3Rpb24nKSkge1xuICAgICAgICByZXR1cm4gJ3NlY3Rpb24nO1xuICAgIH1cbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ2FydGljbGUnKSkge1xuICAgICAgICByZXR1cm4gJ2FydGljbGUnO1xuICAgIH1cbiAgICByZXR1cm4gJ2Rpdic7XG59XG5mdW5jdGlvbiBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnICYmICF0YWcuaXNDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICdpbWcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ3AnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBndWVzc1RhZ05hbWUodGFnLm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGFnLmlzVGV4dCA/ICdUZXh0JyA6IHRhZy5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJyk7XG59XG5mdW5jdGlvbiBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSkge1xuICAgIGlmIChjc3NTdHlsZSA9PT0gJ2NzcycgJiYgIXRhZy5pc0NvbXBvbmVudCkge1xuICAgICAgICBpZiAodGFnLmlzSW1nKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZy5pc1RleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAnIGNsYXNzTmFtZT1cInRleHRcIic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiIGNsYXNzTmFtZT1cXFwiXCIgKyBzdHJpbmdVdGlsc18xLmtlYmFiaXplKHRhZy5uYW1lKSArIFwiXFxcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5mdW5jdGlvbiBidWlsZFByb3BlcnR5U3RyaW5nKHByb3ApIHtcbiAgICByZXR1cm4gXCIgXCIgKyBwcm9wLm5hbWUgKyAocHJvcC52YWx1ZSAhPT0gbnVsbCA/IFwiPVwiICsgKHByb3Aubm90U3RyaW5nVmFsdWUgPyAneycgOiAnXCInKSArIHByb3AudmFsdWUgKyAocHJvcC5ub3RTdHJpbmdWYWx1ZSA/ICd9JyA6ICdcIicpIDogJycpO1xufVxuZnVuY3Rpb24gYnVpbGRDaGlsZFRhZ3NTdHJpbmcodGFnLCBjc3NTdHlsZSwgbGV2ZWwpIHtcbiAgICBpZiAodGFnLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuICdcXG4nICsgdGFnLmNoaWxkcmVuLm1hcChmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIGJ1aWxkSnN4U3RyaW5nKGNoaWxkLCBjc3NTdHlsZSwgbGV2ZWwgKyAxKTsgfSkuam9pbignXFxuJyk7XG4gICAgfVxuICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgIHJldHVybiBcIlwiICsgdGFnLnRleHRDaGFyYWN0ZXJzO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5mdW5jdGlvbiBidWlsZEpzeFN0cmluZyh0YWcsIGNzc1N0eWxlLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZVN0cmluZyA9IGJ1aWxkU3BhY2VzKDQsIGxldmVsKTtcbiAgICB2YXIgaGFzQ2hpbGRyZW4gPSB0YWcuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB2YXIgdGFnTmFtZSA9IGdldFRhZ05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGdldENsYXNzTmFtZSh0YWcsIGNzc1N0eWxlKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IHRhZy5wcm9wZXJ0aWVzLm1hcChidWlsZFByb3BlcnR5U3RyaW5nKS5qb2luKCcnKTtcbiAgICB2YXIgb3BlbmluZ1RhZyA9IHNwYWNlU3RyaW5nICsgXCI8XCIgKyB0YWdOYW1lICsgY2xhc3NOYW1lICsgcHJvcGVydGllcyArIChoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gXCJcIiA6ICcgLycpICsgXCI+XCI7XG4gICAgdmFyIGNoaWxkVGFncyA9IGJ1aWxkQ2hpbGRUYWdzU3RyaW5nKHRhZywgY3NzU3R5bGUsIGxldmVsKTtcbiAgICB2YXIgY2xvc2luZ1RhZyA9IGhhc0NoaWxkcmVuIHx8IHRhZy5pc1RleHQgPyAoIXRhZy5pc1RleHQgPyAnXFxuJyArIHNwYWNlU3RyaW5nIDogJycpICsgXCI8L1wiICsgdGFnTmFtZSArIFwiPlwiIDogJyc7XG4gICAgcmV0dXJuIG9wZW5pbmdUYWcgKyBjaGlsZFRhZ3MgKyBjbG9zaW5nVGFnO1xufVxuZnVuY3Rpb24gYnVpbGRDb2RlKHRhZywgY3NzKSB7XG4gICAgcmV0dXJuIFwiY29uc3QgXCIgKyBzdHJpbmdVdGlsc18xLmNhcGl0YWxpemVGaXJzdExldHRlcih0YWcubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpKSArIFwiOiBSZWFjdC5WRkMgPSAoKSA9PiB7XFxuICByZXR1cm4gKFxcblwiICsgYnVpbGRKc3hTdHJpbmcodGFnLCBjc3MsIDApICsgXCJcXG4gIClcXG59XCI7XG59XG5leHBvcnRzLmJ1aWxkQ29kZSA9IGJ1aWxkQ29kZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZENzc1N0cmluZyA9IHZvaWQgMDtcbnZhciBzdHJpbmdVdGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nVXRpbHNcIik7XG5mdW5jdGlvbiBidWlsZEFycmF5KHRhZywgYXJyKSB7XG4gICAgYXJyLnB1c2godGFnLmNzcyk7XG4gICAgdGFnLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGFyciA9IGJ1aWxkQXJyYXkoY2hpbGQsIGFycik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFycjtcbn1cbmZ1bmN0aW9uIGJ1aWxkQ3NzU3RyaW5nKHRhZywgY3NzU3R5bGUpIHtcbiAgICB2YXIgY3NzQXJyYXkgPSBidWlsZEFycmF5KHRhZywgW10pO1xuICAgIHZhciBjb2RlU3RyID0gJyc7XG4gICAgY3NzQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoY3NzRGF0YSkge1xuICAgICAgICB2YXIgY3NzU3RyID0gY3NzU3R5bGUgPT09ICdzdHlsZWQtY29tcG9uZW50cydcbiAgICAgICAgICAgID8gXCJjb25zdCBcIiArIGNzc0RhdGEuY2xhc3NOYW1lLnJlcGxhY2UoL1xccy9nLCAnJykgKyBcIiA9IHN0eWxlZC5kaXZgXFxuXCIgKyBjc3NEYXRhLnByb3BlcnRpZXMubWFwKGZ1bmN0aW9uIChwcm9wZXJ0eSkgeyByZXR1cm4gXCIgIFwiICsgcHJvcGVydHkubmFtZSArIFwiOiBcIiArIHByb3BlcnR5LnZhbHVlICsgXCI7XCI7IH0pLmpvaW4oJ1xcbicpICsgXCJcXG5gXFxuXCJcbiAgICAgICAgICAgIDogXCIuXCIgKyBzdHJpbmdVdGlsc18xLmtlYmFiaXplKGNzc0RhdGEuY2xhc3NOYW1lKSArIFwiIHtcXG5cIiArIGNzc0RhdGEucHJvcGVydGllcy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5KSB7IHJldHVybiBcIiAgXCIgKyBwcm9wZXJ0eS5uYW1lICsgXCI6IFwiICsgcHJvcGVydHkudmFsdWUgKyBcIjtcIjsgfSkuam9pbignXFxuJykgKyBcIlxcbn1cXG5cIjtcbiAgICAgICAgY29kZVN0ciArPSBjc3NTdHI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvZGVTdHI7XG59XG5leHBvcnRzLmJ1aWxkQ3NzU3RyaW5nID0gYnVpbGRDc3NTdHJpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRTaXplU3RyaW5nQnlVbml0ID0gdm9pZCAwO1xuZnVuY3Rpb24gYnVpbGRTaXplU3RyaW5nQnlVbml0KHBpeGVsVmFsdWUsIHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3B4Jykge1xuICAgICAgICByZXR1cm4gcGl4ZWxWYWx1ZSArICdweCc7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAncmVtJykge1xuICAgICAgICByZXR1cm4gcGl4ZWxWYWx1ZSAvIDE2ICsgJ3JlbSc7XG4gICAgfVxuICAgIHJldHVybiBwaXhlbFZhbHVlIC8gMTAgKyAncmVtJztcbn1cbmV4cG9ydHMuYnVpbGRTaXplU3RyaW5nQnlVbml0ID0gYnVpbGRTaXplU3RyaW5nQnlVbml0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IHZvaWQgMDtcbnZhciBnZXRDc3NEYXRhRm9yVGFnXzEgPSByZXF1aXJlKFwiLi9nZXRDc3NEYXRhRm9yVGFnXCIpO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbmZ1bmN0aW9uIGJ1aWxkVGFnVHJlZShub2RlLCB1bml0VHlwZSkge1xuICAgIGlmICghbm9kZS52aXNpYmxlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgaXNJbWcgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgaWYgKGlzSW1nKSB7XG4gICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdzcmMnLCB2YWx1ZTogJycgfSk7XG4gICAgfVxuICAgIHZhciBjaGlsZFRhZ3MgPSBbXTtcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmICFpc0ltZykge1xuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBjaGlsZFRhZ3MucHVzaChidWlsZFRhZ1RyZWUoY2hpbGQsIHVuaXRUeXBlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgdGFnID0ge1xuICAgICAgICBuYW1lOiBpc0ltZyA/ICdpbWcnIDogbm9kZS5uYW1lLFxuICAgICAgICBpc1RleHQ6IG5vZGUudHlwZSA9PT0gJ1RFWFQnLFxuICAgICAgICB0ZXh0Q2hhcmFjdGVyczogbm9kZS50eXBlID09PSAnVEVYVCcgPyBub2RlLmNoYXJhY3RlcnMgOiBudWxsLFxuICAgICAgICBpc0ltZzogaXNJbWcsXG4gICAgICAgIGNzczogZ2V0Q3NzRGF0YUZvclRhZ18xLmdldENzc0RhdGFGb3JUYWcobm9kZSwgdW5pdFR5cGUpLFxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRUYWdzLFxuICAgICAgICBub2RlOiBub2RlXG4gICAgfTtcbiAgICByZXR1cm4gdGFnO1xufVxuZXhwb3J0cy5idWlsZFRhZ1RyZWUgPSBidWlsZFRhZ1RyZWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vbW9kaWZ5VHJlZUZvckNvbXBvbmVudFwiKTtcbnZhciBidWlsZENvZGVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkQ29kZVwiKTtcbnZhciBidWlsZFRhZ1RyZWVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkVGFnVHJlZVwiKTtcbnZhciBidWlsZENzc1N0cmluZ18xID0gcmVxdWlyZShcIi4vYnVpbGRDc3NTdHJpbmdcIik7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDQ4MCwgaGVpZ2h0OiA0NDAgfSk7XG52YXIgc2VsZWN0ZWROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbnZhciBDU1NfU1RZTEVfS0VZID0gJ0NTU19TVFlMRV9LRVknO1xudmFyIFVOSVRfVFlQRV9LRVkgPSAnVU5JVF9UWVBFX0tFWSc7XG5mdW5jdGlvbiBnZW5lcmF0ZShub2RlLCBjb25maWcpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjc3NTdHlsZSwgdW5pdFR5cGUsIHRhZywgZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBjc3NTdHlsZSA9IGNvbmZpZy5jc3NTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhY3NzU3R5bGUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKENTU19TVFlMRV9LRVkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGNzc1N0eWxlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNzc1N0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NTdHlsZSA9ICdjc3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlID0gY29uZmlnLnVuaXRUeXBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISF1bml0VHlwZSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoVU5JVF9UWVBFX0tFWSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdW5pdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlID0gJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEubW9kaWZ5VHJlZUZvckNvbXBvbmVudChidWlsZFRhZ1RyZWVfMS5idWlsZFRhZ1RyZWUobm9kZSwgdW5pdFR5cGUpLCBmaWdtYSk7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUodGFnLCBjc3NTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGNzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nXzEuYnVpbGRDc3NTdHJpbmcodGFnLCBjc3NTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgZ2VuZXJhdGVkQ29kZVN0cjogZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nOiBjc3NTdHJpbmcsIGNzc1N0eWxlOiBjc3NTdHlsZSwgdW5pdFR5cGU6IHVuaXRUeXBlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID4gMSkge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBvbmx5IDEgbm9kZScpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5lbHNlIGlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBhIG5vZGUnKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZWxzZSB7XG4gICAgZ2VuZXJhdGUoc2VsZWN0ZWROb2Rlc1swXSwge30pO1xufVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ25vdGlmeS1jb3B5LXN1Y2Nlc3MnKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnY29waWVkIHRvIGNsaXBib2FyZPCfkY0nKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnbmV3LWNzcy1zdHlsZS1zZXQnKSB7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoQ1NTX1NUWUxFX0tFWSwgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgZ2VuZXJhdGUoc2VsZWN0ZWROb2Rlc1swXSwgeyBjc3NTdHlsZTogbXNnLmNzc1N0eWxlIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICduZXctdW5pdC10eXBlLXNldCcpIHtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhVTklUX1RZUEVfS0VZLCBtc2cudW5pdFR5cGUpO1xuICAgICAgICBnZW5lcmF0ZShzZWxlY3RlZE5vZGVzWzBdLCB7IHVuaXRUeXBlOiBtc2cudW5pdFR5cGUgfSk7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gdm9pZCAwO1xudmFyIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xID0gcmVxdWlyZShcIi4vYnVpbGRTaXplU3RyaW5nQnlVbml0XCIpO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBqdXN0aWZ5Q29udGVudENzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBTUEFDRV9CRVRXRUVOOiAnc3BhY2UtYmV0d2Vlbidcbn07XG52YXIgYWxpZ25JdGVtc0Nzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJ1xufTtcbnZhciB0ZXh0QWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgSlVTVElGSUVEOiAnanVzdGlmeSdcbn07XG52YXIgdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgVE9QOiAndG9wJyxcbiAgICBDRU5URVI6ICdtaWRkbGUnLFxuICAgIEJPVFRPTTogJ2JvdHRvbSdcbn07XG52YXIgdGV4dERlY29yYXRpb25Dc3NWYWx1ZXMgPSB7XG4gICAgVU5ERVJMSU5FOiAndW5kZXJsaW5lJyxcbiAgICBTVFJJTEVUSFJPVUdIOiAnbGluZS10aHJvdWdoJ1xufTtcbmZ1bmN0aW9uIGdldENzc0RhdGFGb3JUYWcobm9kZSwgdW5pdFR5cGUpIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgIC8vIHNraXAgdmVjdG9yIHNpbmNlIGl0J3Mgb2Z0ZW4gZGlzcGxheWVkIGFzIGFuIGltZyB0YWdcbiAgICBpZiAobm9kZS52aXNpYmxlICYmIG5vZGUudHlwZSAhPT0gJ1ZFQ1RPUicpIHtcbiAgICAgICAgaWYgKCdvcGFjaXR5JyBpbiBub2RlICYmIG5vZGUub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdvcGFjaXR5JywgdmFsdWU6IG5vZGUub3BhY2l0eSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5yb3RhdGlvbiAhPT0gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RyYW5zZm9ybScsIHZhbHVlOiBcInJvdGF0ZShcIiArIE1hdGguZmxvb3Iobm9kZS5yb3RhdGlvbikgKyBcImRlZylcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fCBub2RlLnR5cGUgPT09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSwgdW5pdFR5cGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZGlzcGxheScsIHZhbHVlOiAnZmxleCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZsZXgtZGlyZWN0aW9uJywgdmFsdWU6IG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnID8gJ3JvdycgOiAnY29sdW1uJyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnanVzdGlmeS1jb250ZW50JywgdmFsdWU6IGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzW25vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYWxpZ24taXRlbXMnLCB2YWx1ZTogYWxpZ25JdGVtc0Nzc1ZhbHVlc1tub2RlLmNvdW50ZXJBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nTGVmdCAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnBhZGRpbmdUb3AgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBcIlwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUucGFkZGluZ1RvcCwgdW5pdFR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ0xlZnQgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnBhZGRpbmdUb3AsIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUucGFkZGluZ0xlZnQsIHVuaXRUeXBlKSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncGFkZGluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUucGFkZGluZ1RvcCwgdW5pdFR5cGUpICsgXCIgXCIgKyBidWlsZFNpemVTdHJpbmdCeVVuaXRfMS5idWlsZFNpemVTdHJpbmdCeVVuaXQobm9kZS5wYWRkaW5nUmlnaHQsIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUucGFkZGluZ0JvdHRvbSwgdW5pdFR5cGUpICsgXCIgXCIgKyBidWlsZFNpemVTdHJpbmdCeVVuaXRfMS5idWlsZFNpemVTdHJpbmdCeVVuaXQobm9kZS5wYWRkaW5nTGVmdCwgdW5pdFR5cGUpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wcmltYXJ5QXhpc0FsaWduSXRlbXMgIT09ICdTUEFDRV9CRVRXRUVOJyAmJiBub2RlLml0ZW1TcGFjaW5nID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZ2FwJywgdmFsdWU6IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLml0ZW1TcGFjaW5nLCB1bml0VHlwZSkgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUuc3Ryb2tlV2VpZ2h0LCB1bml0VHlwZSkgKyBcIiBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSwgdW5pdFR5cGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnN0cm9rZVdlaWdodCwgdW5pdFR5cGUpICsgXCIgc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWFsaWduJywgdmFsdWU6IHRleHRBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnbkhvcml6b250YWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3ZlcnRpY2FsLWFsaWduJywgdmFsdWU6IHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduVmVydGljYWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtc2l6ZScsIHZhbHVlOiBub2RlLmZvbnRTaXplICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtZmFtaWx5JywgdmFsdWU6IG5vZGUuZm9udE5hbWUuZmFtaWx5IH0pO1xuICAgICAgICAgICAgdmFyIGxldHRlclNwYWNpbmcgPSBub2RlLmxldHRlclNwYWNpbmc7XG4gICAgICAgICAgICBpZiAobGV0dGVyU3BhY2luZy52YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdsZXR0ZXItc3BhY2luZycsIHZhbHVlOiBsZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KGxldHRlclNwYWNpbmcudmFsdWUsIHVuaXRUeXBlKSA6IGxldHRlclNwYWNpbmcudmFsdWUgKyAnJScgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaW5lLWhlaWdodCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5vZGUubGluZUhlaWdodC51bml0ID09PSAnQVVUTydcbiAgICAgICAgICAgICAgICAgICAgPyAnYXV0bydcbiAgICAgICAgICAgICAgICAgICAgOiBub2RlLmxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUydcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUubGluZUhlaWdodC52YWx1ZSwgdW5pdFR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG5vZGUubGluZUhlaWdodC52YWx1ZSArICclJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS50ZXh0RGVjb3JhdGlvbiAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtZGVjb3JhdGlvbicsIHZhbHVlOiB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlc1tub2RlLnRleHREZWNvcmF0aW9uXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdjb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnTElORScpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUuc3Ryb2tlV2VpZ2h0LCB1bml0VHlwZSkgKyBcIiBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdHUk9VUCcgfHwgbm9kZS50eXBlID09PSAnRUxMSVBTRScgfHwgbm9kZS50eXBlID09PSAnUE9MWUdPTicgfHwgbm9kZS50eXBlID09PSAnU1RBUicpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGlzSW1hZ2UgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gbmFtZSBUZXh0IG5vZGUgYXMgXCJUZXh0XCIgc2luY2UgbmFtZSBvZiB0ZXh0IG5vZGUgaXMgb2Z0ZW4gdGhlIGNvbnRlbnQgb2YgdGhlIG5vZGUgYW5kIGlzIG5vdCBhcHByb3ByaWF0ZSBhcyBhIG5hbWVcbiAgICAgICAgICAgIGNsYXNzTmFtZTogaXNJbWFnZSA/ICdpbWcnIDogbm9kZS50eXBlID09PSAnVEVYVCcgPyAndGV4dCcgOiBub2RlLm5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gZ2V0Q3NzRGF0YUZvclRhZztcbmZ1bmN0aW9uIGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlLCB1bml0VHlwZSkge1xuICAgIGlmIChub2RlLmNvcm5lclJhZGl1cyAhPT0gMCkge1xuICAgICAgICBpZiAodHlwZW9mIG5vZGUuY29ybmVyUmFkaXVzICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnRvcExlZnRSYWRpdXMsIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUudG9wUmlnaHRSYWRpdXMsIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUuYm90dG9tUmlnaHRSYWRpdXMsIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUuYm90dG9tTGVmdFJhZGl1cywgdW5pdFR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUuY29ybmVyUmFkaXVzLCB1bml0VHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmdiVmFsdWVUb0hleCh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogMjU1KS50b1N0cmluZygxNik7XG59XG5mdW5jdGlvbiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgaWYgKHBhaW50Lm9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBwYWludC5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuciAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmcgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5iICogMjU1KSArIFwiLCBcIiArIHBhaW50Lm9wYWNpdHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLnIpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5nKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuYik7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tb2RpZnlUcmVlRm9yQ29tcG9uZW50ID0gdm9pZCAwO1xudmFyIGNvbXBvbmVudHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnU3BhY2VyJyxcbiAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09ICdTcGFjZXInICYmICghKCdjaGlsZHJlbicgaW4gbm9kZSkgfHwgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApO1xuICAgICAgICB9LFxuICAgICAgICBtb2RpZnlGdW5jOiBmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICBpZiAodGFnLm5vZGUud2lkdGggPiB0YWcubm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0YWcucHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiB0YWcubm9kZS5oZWlnaHQudG9TdHJpbmcoKSwgbm90U3RyaW5nVmFsdWU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWcucHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IHRhZy5ub2RlLndpZHRoLnRvU3RyaW5nKCksIG5vdFN0cmluZ1ZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFnLmlzQ29tcG9uZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgIH1cbiAgICB9XG5dO1xuZnVuY3Rpb24gbW9kaWZ5KHRhZywgX2ZpZ21hKSB7XG4gICAgaWYgKCF0YWcgfHwgIXRhZy5ub2RlKSB7XG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICAgIHZhciBtb2RpZmllZE9uY2UgPSBmYWxzZTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNldHRpbmcpIHtcbiAgICAgICAgaWYgKCFtb2RpZmllZE9uY2UgJiYgc2V0dGluZy5tYXRjaGVyKHRhZy5ub2RlKSkge1xuICAgICAgICAgICAgdGFnID0gc2V0dGluZy5tb2RpZnlGdW5jKHRhZywgX2ZpZ21hKTtcbiAgICAgICAgICAgIG1vZGlmaWVkT25jZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGFnO1xufVxuZnVuY3Rpb24gbW9kaWZ5VHJlZUZvckNvbXBvbmVudCh0cmVlLCBfZmlnbWEpIHtcbiAgICB2YXIgbmV3VGFnID0gbW9kaWZ5KHRyZWUsIF9maWdtYSk7XG4gICAgbmV3VGFnLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpbmRleCkge1xuICAgICAgICBuZXdUYWcuY2hpbGRyZW5baW5kZXhdID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudChjaGlsZCwgX2ZpZ21hKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHJlZTtcbn1cbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSB2b2lkIDA7XG5mdW5jdGlvbiBpc0ltYWdlTm9kZShub2RlKSB7XG4gICAgLy8g5LiL6YOo44GrIFZlY3RvciDjgZfjgYvlrZjlnKjjgZfjgarjgYTjgoLjga7jga/nlLvlg4/jgajliKTlrprjgZnjgotcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaGFzT25seVZlY3Rvcl8xID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgICAgICAgICAgaGFzT25seVZlY3Rvcl8xID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaGFzT25seVZlY3Rvcl8xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdWRUNUT1InKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScpIHtcbiAgICAgICAgaWYgKG5vZGUuZmlsbHMuZmluZChmdW5jdGlvbiAocGFpbnQpIHsgcmV0dXJuIHBhaW50LnR5cGUgPT09ICdJTUFHRSc7IH0pICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSBpc0ltYWdlTm9kZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5rZWJhYlRvVXBwZXJDYW1lbCA9IGV4cG9ydHMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyID0gZXhwb3J0cy5rZWJhYml6ZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGtlYmFiaXplKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsZXR0ZXIsIGlkeCkge1xuICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCkgPT09IGxldHRlciA/IFwiXCIgKyAoaWR4ICE9PSAwID8gJy0nIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJycpO1xufVxuZXhwb3J0cy5rZWJhYml6ZSA9IGtlYmFiaXplO1xuZnVuY3Rpb24gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHN0cikge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5leHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlciA9IGNhcGl0YWxpemVGaXJzdExldHRlcjtcbmZ1bmN0aW9uIGtlYmFiVG9VcHBlckNhbWVsKHN0cikge1xuICAgIHJldHVybiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyLnNwbGl0KC8tfF8vZykubWFwKGNhcGl0YWxpemVGaXJzdExldHRlcikuam9pbignJykpO1xufVxuZXhwb3J0cy5rZWJhYlRvVXBwZXJDYW1lbCA9IGtlYmFiVG9VcHBlckNhbWVsO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb2RlLnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==