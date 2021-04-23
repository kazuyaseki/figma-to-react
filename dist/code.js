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
function generate(node, cssStyle) {
    return __awaiter(this, void 0, void 0, function () {
        var _css, tag, generatedCodeStr, cssString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _css = cssStyle;
                    if (!!_css) return [3 /*break*/, 2];
                    return [4 /*yield*/, figma.clientStorage.getAsync(CSS_STYLE_KEY)];
                case 1:
                    _css = _a.sent();
                    if (!_css) {
                        _css = 'css';
                    }
                    _a.label = 2;
                case 2:
                    tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(node, 'px'), figma);
                    generatedCodeStr = buildCode_1.buildCode(tag, _css);
                    cssString = buildCssString_1.buildCssString(tag, _css);
                    figma.ui.postMessage({ generatedCodeStr: generatedCodeStr, cssString: cssString, cssStyle: _css });
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
    generate(selectedNodes[0]);
}
figma.ui.onmessage = function (msg) {
    if (msg.type === 'notify-copy-success') {
        figma.notify('copied to clipboard👍');
    }
    if (msg.type === 'new-css-style-set') {
        figma.clientStorage.setAsync(CSS_STYLE_KEY, msg.cssStyle);
        var tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(selectedNodes[0], 'px'), figma);
        var generatedCodeStr = buildCode_1.buildCode(tag, msg.cssStyle);
        var cssString = buildCssString_1.buildCssString(tag, msg.cssStyle);
        figma.ui.postMessage({ generatedCodeStr: generatedCodeStr, cssString: cssString });
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
                    properties.push({ name: 'padding', value: "" + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingTop, unitType) + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingLeft, unitType) });
                }
                else {
                    properties.push({
                        name: 'padding',
                        value: buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingTop, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingRight, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingBottom, unitType) + " " + buildSizeStringByUnit_1.buildSizeStringByUnit(node.paddingLeft, unitType)
                    });
                }
                if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ3NzU3RyaW5nLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRTaXplU3RyaW5nQnlVbml0LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRUYWdUcmVlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2dldENzc0RhdGFGb3JUYWcudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9tb2RpZnlUcmVlRm9yQ29tcG9uZW50LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9zdHJpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIsb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDhCQUE4Qjs7Ozs7Ozs7Ozs7QUN6Q2pCO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsK0JBQStCLEVBQUU7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7Ozs7Ozs7Ozs7QUMxQk47QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsNkJBQTZCLEdBQUcsZ0JBQWdCO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOzs7Ozs7O1VDbkJ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkQ29kZSA9IHZvaWQgMDtcbnZhciBzdHJpbmdVdGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nVXRpbHNcIik7XG5mdW5jdGlvbiBidWlsZFNwYWNlcyhiYXNlU3BhY2VzLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZXNTdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2VTcGFjZXM7IGkrKykge1xuICAgICAgICBzcGFjZXNTdHIgKz0gJyAnO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsOyBpKyspIHtcbiAgICAgICAgc3BhY2VzU3RyICs9ICcgICc7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZXNTdHI7XG59XG5mdW5jdGlvbiBndWVzc1RhZ05hbWUobmFtZSkge1xuICAgIHZhciBfbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ2J1dHRvbicpKSB7XG4gICAgICAgIHJldHVybiAnYnV0dG9uJztcbiAgICB9XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdzZWN0aW9uJykpIHtcbiAgICAgICAgcmV0dXJuICdzZWN0aW9uJztcbiAgICB9XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdhcnRpY2xlJykpIHtcbiAgICAgICAgcmV0dXJuICdhcnRpY2xlJztcbiAgICB9XG4gICAgcmV0dXJuICdkaXYnO1xufVxuZnVuY3Rpb24gZ2V0VGFnTmFtZSh0YWcsIGNzc1N0eWxlKSB7XG4gICAgaWYgKGNzc1N0eWxlID09PSAnY3NzJyAmJiAhdGFnLmlzQ29tcG9uZW50KSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnaW1nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICdwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3Vlc3NUYWdOYW1lKHRhZy5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhZy5pc1RleHQgPyAnVGV4dCcgOiB0YWcubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpO1xufVxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnICYmICF0YWcuaXNDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJyBjbGFzc05hbWU9XCJ0ZXh0XCInO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIiBjbGFzc05hbWU9XFxcIlwiICsgc3RyaW5nVXRpbHNfMS5rZWJhYml6ZSh0YWcubmFtZSkgKyBcIlxcXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYnVpbGRQcm9wZXJ0eVN0cmluZyhwcm9wKSB7XG4gICAgcmV0dXJuIFwiIFwiICsgcHJvcC5uYW1lICsgKHByb3AudmFsdWUgIT09IG51bGwgPyBcIj1cIiArIChwcm9wLm5vdFN0cmluZ1ZhbHVlID8gJ3snIDogJ1wiJykgKyBwcm9wLnZhbHVlICsgKHByb3Aubm90U3RyaW5nVmFsdWUgPyAnfScgOiAnXCInKSA6ICcnKTtcbn1cbmZ1bmN0aW9uIGJ1aWxkQ2hpbGRUYWdzU3RyaW5nKHRhZywgY3NzU3R5bGUsIGxldmVsKSB7XG4gICAgaWYgKHRhZy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiAnXFxuJyArIHRhZy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBidWlsZEpzeFN0cmluZyhjaGlsZCwgY3NzU3R5bGUsIGxldmVsICsgMSk7IH0pLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRhZy50ZXh0Q2hhcmFjdGVycztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYnVpbGRKc3hTdHJpbmcodGFnLCBjc3NTdHlsZSwgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VTdHJpbmcgPSBidWlsZFNwYWNlcyg0LCBsZXZlbCk7XG4gICAgdmFyIGhhc0NoaWxkcmVuID0gdGFnLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgdmFyIHRhZ05hbWUgPSBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpO1xuICAgIHZhciBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB0YWcucHJvcGVydGllcy5tYXAoYnVpbGRQcm9wZXJ0eVN0cmluZykuam9pbignJyk7XG4gICAgdmFyIG9wZW5pbmdUYWcgPSBzcGFjZVN0cmluZyArIFwiPFwiICsgdGFnTmFtZSArIGNsYXNzTmFtZSArIHByb3BlcnRpZXMgKyAoaGFzQ2hpbGRyZW4gfHwgdGFnLmlzVGV4dCA/IFwiXCIgOiAnIC8nKSArIFwiPlwiO1xuICAgIHZhciBjaGlsZFRhZ3MgPSBidWlsZENoaWxkVGFnc1N0cmluZyh0YWcsIGNzc1N0eWxlLCBsZXZlbCk7XG4gICAgdmFyIGNsb3NpbmdUYWcgPSBoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gKCF0YWcuaXNUZXh0ID8gJ1xcbicgKyBzcGFjZVN0cmluZyA6ICcnKSArIFwiPC9cIiArIHRhZ05hbWUgKyBcIj5cIiA6ICcnO1xuICAgIHJldHVybiBvcGVuaW5nVGFnICsgY2hpbGRUYWdzICsgY2xvc2luZ1RhZztcbn1cbmZ1bmN0aW9uIGJ1aWxkQ29kZSh0YWcsIGNzcykge1xuICAgIHJldHVybiBcImNvbnN0IFwiICsgc3RyaW5nVXRpbHNfMS5jYXBpdGFsaXplRmlyc3RMZXR0ZXIodGFnLm5hbWUucmVwbGFjZSgvXFxzL2csICcnKSkgKyBcIjogUmVhY3QuVkZDID0gKCkgPT4ge1xcbiAgcmV0dXJuIChcXG5cIiArIGJ1aWxkSnN4U3RyaW5nKHRhZywgY3NzLCAwKSArIFwiXFxuICApXFxufVwiO1xufVxuZXhwb3J0cy5idWlsZENvZGUgPSBidWlsZENvZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRDc3NTdHJpbmcgPSB2b2lkIDA7XG52YXIgc3RyaW5nVXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZ1V0aWxzXCIpO1xuZnVuY3Rpb24gYnVpbGRBcnJheSh0YWcsIGFycikge1xuICAgIGFyci5wdXNoKHRhZy5jc3MpO1xuICAgIHRhZy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBhcnIgPSBidWlsZEFycmF5KGNoaWxkLCBhcnIpO1xuICAgIH0pO1xuICAgIHJldHVybiBhcnI7XG59XG5mdW5jdGlvbiBidWlsZENzc1N0cmluZyh0YWcsIGNzc1N0eWxlKSB7XG4gICAgdmFyIGNzc0FycmF5ID0gYnVpbGRBcnJheSh0YWcsIFtdKTtcbiAgICB2YXIgY29kZVN0ciA9ICcnO1xuICAgIGNzc0FycmF5LmZvckVhY2goZnVuY3Rpb24gKGNzc0RhdGEpIHtcbiAgICAgICAgdmFyIGNzc1N0ciA9IGNzc1N0eWxlID09PSAnc3R5bGVkLWNvbXBvbmVudHMnXG4gICAgICAgICAgICA/IFwiY29uc3QgXCIgKyBjc3NEYXRhLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMvZywgJycpICsgXCIgPSBzdHlsZWQuZGl2YFxcblwiICsgY3NzRGF0YS5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbiAocHJvcGVydHkpIHsgcmV0dXJuIFwiICBcIiArIHByb3BlcnR5Lm5hbWUgKyBcIjogXCIgKyBwcm9wZXJ0eS52YWx1ZSArIFwiO1wiOyB9KS5qb2luKCdcXG4nKSArIFwiXFxuYFxcblwiXG4gICAgICAgICAgICA6IFwiLlwiICsgc3RyaW5nVXRpbHNfMS5rZWJhYml6ZShjc3NEYXRhLmNsYXNzTmFtZSkgKyBcIiB7XFxuXCIgKyBjc3NEYXRhLnByb3BlcnRpZXMubWFwKGZ1bmN0aW9uIChwcm9wZXJ0eSkgeyByZXR1cm4gXCIgIFwiICsgcHJvcGVydHkubmFtZSArIFwiOiBcIiArIHByb3BlcnR5LnZhbHVlICsgXCI7XCI7IH0pLmpvaW4oJ1xcbicpICsgXCJcXG59XFxuXCI7XG4gICAgICAgIGNvZGVTdHIgKz0gY3NzU3RyO1xuICAgIH0pO1xuICAgIHJldHVybiBjb2RlU3RyO1xufVxuZXhwb3J0cy5idWlsZENzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChwaXhlbFZhbHVlLCB0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT09ICdweCcpIHtcbiAgICAgICAgcmV0dXJuIHBpeGVsVmFsdWUgKyAncHgnO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ3JlbScpIHtcbiAgICAgICAgcmV0dXJuIHBpeGVsVmFsdWUgLyAxNiArICdyZW0nO1xuICAgIH1cbiAgICByZXR1cm4gcGl4ZWxWYWx1ZSAvIDEwICsgJ3JlbSc7XG59XG5leHBvcnRzLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdCA9IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZFRhZ1RyZWUgPSB2b2lkIDA7XG52YXIgZ2V0Q3NzRGF0YUZvclRhZ18xID0gcmVxdWlyZShcIi4vZ2V0Q3NzRGF0YUZvclRhZ1wiKTtcbnZhciBpc0ltYWdlTm9kZV8xID0gcmVxdWlyZShcIi4vdXRpbHMvaXNJbWFnZU5vZGVcIik7XG5mdW5jdGlvbiBidWlsZFRhZ1RyZWUobm9kZSwgdW5pdFR5cGUpIHtcbiAgICBpZiAoIW5vZGUudmlzaWJsZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGlzSW1nID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgIGlmIChpc0ltZykge1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnc3JjJywgdmFsdWU6ICcnIH0pO1xuICAgIH1cbiAgICB2YXIgY2hpbGRUYWdzID0gW107XG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiAhaXNJbWcpIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgY2hpbGRUYWdzLnB1c2goYnVpbGRUYWdUcmVlKGNoaWxkLCB1bml0VHlwZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHRhZyA9IHtcbiAgICAgICAgbmFtZTogaXNJbWcgPyAnaW1nJyA6IG5vZGUubmFtZSxcbiAgICAgICAgaXNUZXh0OiBub2RlLnR5cGUgPT09ICdURVhUJyxcbiAgICAgICAgdGV4dENoYXJhY3RlcnM6IG5vZGUudHlwZSA9PT0gJ1RFWFQnID8gbm9kZS5jaGFyYWN0ZXJzIDogbnVsbCxcbiAgICAgICAgaXNJbWc6IGlzSW1nLFxuICAgICAgICBjc3M6IGdldENzc0RhdGFGb3JUYWdfMS5nZXRDc3NEYXRhRm9yVGFnKG5vZGUsIHVuaXRUeXBlKSxcbiAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkVGFncyxcbiAgICAgICAgbm9kZTogbm9kZVxuICAgIH07XG4gICAgcmV0dXJuIHRhZztcbn1cbmV4cG9ydHMuYnVpbGRUYWdUcmVlID0gYnVpbGRUYWdUcmVlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIG1vZGlmeVRyZWVGb3JDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL21vZGlmeVRyZWVGb3JDb21wb25lbnRcIik7XG52YXIgYnVpbGRDb2RlXzEgPSByZXF1aXJlKFwiLi9idWlsZENvZGVcIik7XG52YXIgYnVpbGRUYWdUcmVlXzEgPSByZXF1aXJlKFwiLi9idWlsZFRhZ1RyZWVcIik7XG52YXIgYnVpbGRDc3NTdHJpbmdfMSA9IHJlcXVpcmUoXCIuL2J1aWxkQ3NzU3RyaW5nXCIpO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0ODAsIGhlaWdodDogNDQwIH0pO1xudmFyIHNlbGVjdGVkTm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG52YXIgQ1NTX1NUWUxFX0tFWSA9ICdDU1NfU1RZTEVfS0VZJztcbmZ1bmN0aW9uIGdlbmVyYXRlKG5vZGUsIGNzc1N0eWxlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2NzcywgdGFnLCBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NTdHJpbmc7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jc3MgPSBjc3NTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhX2NzcykgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoQ1NTX1NUWUxFX0tFWSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgX2NzcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3NzID0gJ2Nzcyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xLm1vZGlmeVRyZWVGb3JDb21wb25lbnQoYnVpbGRUYWdUcmVlXzEuYnVpbGRUYWdUcmVlKG5vZGUsICdweCcpLCBmaWdtYSk7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUodGFnLCBfY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgY3NzU3RyaW5nID0gYnVpbGRDc3NTdHJpbmdfMS5idWlsZENzc1N0cmluZyh0YWcsIF9jc3MpO1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGdlbmVyYXRlZENvZGVTdHI6IGdlbmVyYXRlZENvZGVTdHIsIGNzc1N0cmluZzogY3NzU3RyaW5nLCBjc3NTdHlsZTogX2NzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3Qgb25seSAxIG5vZGUnKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZWxzZSBpZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3QgYSBub2RlJyk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbmVsc2Uge1xuICAgIGdlbmVyYXRlKHNlbGVjdGVkTm9kZXNbMF0pO1xufVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ25vdGlmeS1jb3B5LXN1Y2Nlc3MnKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnY29waWVkIHRvIGNsaXBib2FyZPCfkY0nKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnbmV3LWNzcy1zdHlsZS1zZXQnKSB7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoQ1NTX1NUWUxFX0tFWSwgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgdmFyIHRhZyA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnRfMS5tb2RpZnlUcmVlRm9yQ29tcG9uZW50KGJ1aWxkVGFnVHJlZV8xLmJ1aWxkVGFnVHJlZShzZWxlY3RlZE5vZGVzWzBdLCAncHgnKSwgZmlnbWEpO1xuICAgICAgICB2YXIgZ2VuZXJhdGVkQ29kZVN0ciA9IGJ1aWxkQ29kZV8xLmJ1aWxkQ29kZSh0YWcsIG1zZy5jc3NTdHlsZSk7XG4gICAgICAgIHZhciBjc3NTdHJpbmcgPSBidWlsZENzc1N0cmluZ18xLmJ1aWxkQ3NzU3RyaW5nKHRhZywgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBnZW5lcmF0ZWRDb2RlU3RyOiBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NTdHJpbmc6IGNzc1N0cmluZyB9KTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENzc0RhdGFGb3JUYWcgPSB2b2lkIDA7XG52YXIgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEgPSByZXF1aXJlKFwiLi9idWlsZFNpemVTdHJpbmdCeVVuaXRcIik7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIFNQQUNFX0JFVFdFRU46ICdzcGFjZS1iZXR3ZWVuJ1xufTtcbnZhciBhbGlnbkl0ZW1zQ3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInXG59O1xudmFyIHRleHRBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBMRUZUOiAnbGVmdCcsXG4gICAgUklHSFQ6ICdyaWdodCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBKVVNUSUZJRUQ6ICdqdXN0aWZ5J1xufTtcbnZhciB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBUT1A6ICd0b3AnLFxuICAgIENFTlRFUjogJ21pZGRsZScsXG4gICAgQk9UVE9NOiAnYm90dG9tJ1xufTtcbnZhciB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlcyA9IHtcbiAgICBVTkRFUkxJTkU6ICd1bmRlcmxpbmUnLFxuICAgIFNUUklMRVRIUk9VR0g6ICdsaW5lLXRocm91Z2gnXG59O1xuZnVuY3Rpb24gZ2V0Q3NzRGF0YUZvclRhZyhub2RlLCB1bml0VHlwZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgYXMgYW4gaW1nIHRhZ1xuICAgIGlmIChub2RlLnZpc2libGUgJiYgbm9kZS50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICBpZiAoJ29wYWNpdHknIGluIG5vZGUgJiYgbm9kZS5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ29wYWNpdHknLCB2YWx1ZTogbm9kZS5vcGFjaXR5IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnJvdGF0aW9uICE9PSAwKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndHJhbnNmb3JtJywgdmFsdWU6IFwicm90YXRlKFwiICsgTWF0aC5mbG9vcihub2RlLnJvdGF0aW9uKSArIFwiZGVnKVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlLCB1bml0VHlwZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdkaXNwbGF5JywgdmFsdWU6ICdmbGV4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZmxleC1kaXJlY3Rpb24nLCB2YWx1ZTogbm9kZS5sYXlvdXRNb2RlID09PSAnSE9SSVpPTlRBTCcgPyAncm93JyA6ICdjb2x1bW4nIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdqdXN0aWZ5LWNvbnRlbnQnLCB2YWx1ZToganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXNbbm9kZS5wcmltYXJ5QXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdhbGlnbi1pdGVtcycsIHZhbHVlOiBhbGlnbkl0ZW1zQ3NzVmFsdWVzW25vZGUuY291bnRlckF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdMZWZ0ICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IFwiXCIgKyBidWlsZFNpemVTdHJpbmdCeVVuaXRfMS5idWlsZFNpemVTdHJpbmdCeVVuaXQobm9kZS5wYWRkaW5nVG9wLCB1bml0VHlwZSkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nTGVmdCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogXCJcIiArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnBhZGRpbmdUb3AsIHVuaXRUeXBlKSArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnBhZGRpbmdMZWZ0LCB1bml0VHlwZSkgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3BhZGRpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnBhZGRpbmdUb3AsIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUucGFkZGluZ1JpZ2h0LCB1bml0VHlwZSkgKyBcIiBcIiArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnBhZGRpbmdCb3R0b20sIHVuaXRUeXBlKSArIFwiIFwiICsgYnVpbGRTaXplU3RyaW5nQnlVbml0XzEuYnVpbGRTaXplU3RyaW5nQnlVbml0KG5vZGUucGFkZGluZ0xlZnQsIHVuaXRUeXBlKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zICE9PSAnU1BBQ0VfQkVUV0VFTicpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2dhcCcsIHZhbHVlOiBidWlsZFNpemVTdHJpbmdCeVVuaXRfMS5idWlsZFNpemVTdHJpbmdCeVVuaXQobm9kZS5pdGVtU3BhY2luZywgdW5pdFR5cGUpIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnN0cm9rZVdlaWdodCwgdW5pdFR5cGUpICsgXCIgc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUsIHVuaXRUeXBlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBidWlsZFNpemVTdHJpbmdCeVVuaXRfMS5idWlsZFNpemVTdHJpbmdCeVVuaXQobm9kZS5zdHJva2VXZWlnaHQsIHVuaXRUeXBlKSArIFwiIHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1hbGlnbicsIHZhbHVlOiB0ZXh0QWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25Ib3Jpem9udGFsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd2ZXJ0aWNhbC1hbGlnbicsIHZhbHVlOiB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnblZlcnRpY2FsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LXNpemUnLCB2YWx1ZTogbm9kZS5mb250U2l6ZSArIFwicHhcIiB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LWZhbWlseScsIHZhbHVlOiBub2RlLmZvbnROYW1lLmZhbWlseSB9KTtcbiAgICAgICAgICAgIHZhciBsZXR0ZXJTcGFjaW5nID0gbm9kZS5sZXR0ZXJTcGFjaW5nO1xuICAgICAgICAgICAgaWYgKGxldHRlclNwYWNpbmcudmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnbGV0dGVyLXNwYWNpbmcnLCB2YWx1ZTogbGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChsZXR0ZXJTcGFjaW5nLnZhbHVlLCB1bml0VHlwZSkgOiBsZXR0ZXJTcGFjaW5nLnZhbHVlICsgJyUnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGluZS1oZWlnaHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLmxpbmVIZWlnaHQudW5pdCA9PT0gJ0FVVE8nXG4gICAgICAgICAgICAgICAgICAgID8gJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIDogbm9kZS5sZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLmxpbmVIZWlnaHQudmFsdWUsIHVuaXRUeXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBub2RlLmxpbmVIZWlnaHQudmFsdWUgKyAnJSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUudGV4dERlY29yYXRpb24gIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWRlY29yYXRpb24nLCB2YWx1ZTogdGV4dERlY29yYXRpb25Dc3NWYWx1ZXNbbm9kZS50ZXh0RGVjb3JhdGlvbl0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0xJTkUnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnN0cm9rZVdlaWdodCwgdW5pdFR5cGUpICsgXCIgc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnR1JPVVAnIHx8IG5vZGUudHlwZSA9PT0gJ0VMTElQU0UnIHx8IG5vZGUudHlwZSA9PT0gJ1BPTFlHT04nIHx8IG5vZGUudHlwZSA9PT0gJ1NUQVInKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpc0ltYWdlID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIG5hbWUgVGV4dCBub2RlIGFzIFwiVGV4dFwiIHNpbmNlIG5hbWUgb2YgdGV4dCBub2RlIGlzIG9mdGVuIHRoZSBjb250ZW50IG9mIHRoZSBub2RlIGFuZCBpcyBub3QgYXBwcm9wcmlhdGUgYXMgYSBuYW1lXG4gICAgICAgICAgICBjbGFzc05hbWU6IGlzSW1hZ2UgPyAnaW1nJyA6IG5vZGUudHlwZSA9PT0gJ1RFWFQnID8gJ3RleHQnIDogbm9kZS5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmV4cG9ydHMuZ2V0Q3NzRGF0YUZvclRhZyA9IGdldENzc0RhdGFGb3JUYWc7XG5mdW5jdGlvbiBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSwgdW5pdFR5cGUpIHtcbiAgICBpZiAobm9kZS5jb3JuZXJSYWRpdXMgIT09IDApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlLmNvcm5lclJhZGl1cyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZFNpemVTdHJpbmdCeVVuaXRfMS5idWlsZFNpemVTdHJpbmdCeVVuaXQobm9kZS50b3BMZWZ0UmFkaXVzLCB1bml0VHlwZSkgKyBcIiBcIiArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLnRvcFJpZ2h0UmFkaXVzLCB1bml0VHlwZSkgKyBcIiBcIiArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLmJvdHRvbVJpZ2h0UmFkaXVzLCB1bml0VHlwZSkgKyBcIiBcIiArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLmJvdHRvbUxlZnRSYWRpdXMsIHVuaXRUeXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIiArIGJ1aWxkU2l6ZVN0cmluZ0J5VW5pdF8xLmJ1aWxkU2l6ZVN0cmluZ0J5VW5pdChub2RlLmNvcm5lclJhZGl1cywgdW5pdFR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJnYlZhbHVlVG9IZXgodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuZnVuY3Rpb24gYnVpbGRDb2xvclN0cmluZyhwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGlmIChwYWludC5vcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgcGFpbnQub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLnIgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5nICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuYiAqIDI1NSkgKyBcIiwgXCIgKyBwYWludC5vcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5yKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuZykgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmIpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IHZvaWQgMDtcbnZhciBjb21wb25lbnRzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ1NwYWNlcicsXG4gICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSAnU3BhY2VyJyAmJiAoISgnY2hpbGRyZW4nIGluIG5vZGUpIHx8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgbW9kaWZ5RnVuYzogZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZy5ub2RlLndpZHRoID4gdGFnLm5vZGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGFnLnByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogdGFnLm5vZGUuaGVpZ2h0LnRvU3RyaW5nKCksIG5vdFN0cmluZ1ZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFnLnByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiB0YWcubm9kZS53aWR0aC50b1N0cmluZygpLCBub3RTdHJpbmdWYWx1ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhZy5pc0NvbXBvbmVudCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICB9XG4gICAgfVxuXTtcbmZ1bmN0aW9uIG1vZGlmeSh0YWcsIF9maWdtYSkge1xuICAgIGlmICghdGFnIHx8ICF0YWcubm9kZSkge1xuICAgICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgICB2YXIgbW9kaWZpZWRPbmNlID0gZmFsc2U7XG4gICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZXR0aW5nKSB7XG4gICAgICAgIGlmICghbW9kaWZpZWRPbmNlICYmIHNldHRpbmcubWF0Y2hlcih0YWcubm9kZSkpIHtcbiAgICAgICAgICAgIHRhZyA9IHNldHRpbmcubW9kaWZ5RnVuYyh0YWcsIF9maWdtYSk7XG4gICAgICAgICAgICBtb2RpZmllZE9uY2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhZztcbn1cbmZ1bmN0aW9uIG1vZGlmeVRyZWVGb3JDb21wb25lbnQodHJlZSwgX2ZpZ21hKSB7XG4gICAgdmFyIG5ld1RhZyA9IG1vZGlmeSh0cmVlLCBfZmlnbWEpO1xuICAgIG5ld1RhZy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgbmV3VGFnLmNoaWxkcmVuW2luZGV4XSA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnQoY2hpbGQsIF9maWdtYSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRyZWU7XG59XG5leHBvcnRzLm1vZGlmeVRyZWVGb3JDb21wb25lbnQgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzSW1hZ2VOb2RlID0gdm9pZCAwO1xuZnVuY3Rpb24gaXNJbWFnZU5vZGUobm9kZSkge1xuICAgIC8vIOS4i+mDqOOBqyBWZWN0b3Ig44GX44GL5a2Y5Zyo44GX44Gq44GE44KC44Gu44Gv55S75YOP44Go5Yik5a6a44GZ44KLXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGhhc09ubHlWZWN0b3JfMSA9IHRydWU7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICAgICAgICAgIGhhc09ubHlWZWN0b3JfMSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGhhc09ubHlWZWN0b3JfMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVkVDVE9SJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgIGlmIChub2RlLmZpbGxzLmZpbmQoZnVuY3Rpb24gKHBhaW50KSB7IHJldHVybiBwYWludC50eXBlID09PSAnSU1BR0UnOyB9KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmlzSW1hZ2VOb2RlID0gaXNJbWFnZU5vZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMua2ViYWJUb1VwcGVyQ2FtZWwgPSBleHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlciA9IGV4cG9ydHMua2ViYWJpemUgPSB2b2lkIDA7XG5mdW5jdGlvbiBrZWJhYml6ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAobGV0dGVyLCBpZHgpIHtcbiAgICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpID09PSBsZXR0ZXIgPyBcIlwiICsgKGlkeCAhPT0gMCA/ICctJyA6ICcnKSArIGxldHRlci50b0xvd2VyQ2FzZSgpIDogbGV0dGVyO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCcnKTtcbn1cbmV4cG9ydHMua2ViYWJpemUgPSBrZWJhYml6ZTtcbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHIpIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxuZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXI7XG5mdW5jdGlvbiBrZWJhYlRvVXBwZXJDYW1lbChzdHIpIHtcbiAgICByZXR1cm4gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHN0ci5zcGxpdCgvLXxfL2cpLm1hcChjYXBpdGFsaXplRmlyc3RMZXR0ZXIpLmpvaW4oJycpKTtcbn1cbmV4cG9ydHMua2ViYWJUb1VwcGVyQ2FtZWwgPSBrZWJhYlRvVXBwZXJDYW1lbDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=