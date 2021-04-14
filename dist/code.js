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
var buildTagTree_1 = __webpack_require__(/*! ./buildTagTree */ "./src/buildTagTree.ts");
var kebabize_1 = __webpack_require__(/*! ./utils/kebabize */ "./src/utils/kebabize.ts");
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
var getTagName = function (tag, cssStyle) {
    if (cssStyle === 'css') {
        if (tag.isImg) {
            return 'img';
        }
        if (tag.isText) {
            return 'p';
        }
        return guessTagName(tag.name);
    }
    return tag.isText ? 'Text' : tag.name.replace(/\s/g, '');
};
var getClassName = function (tag, cssStyle) {
    if (cssStyle === 'css') {
        if (tag.isImg) {
            return '';
        }
        if (tag.isText) {
            return ' className="text"';
        }
        return " className=\"" + kebabize_1.kebabize(tag.name) + "\"";
    }
    return '';
};
var buildJsxString = function (tag, cssStyle, level) {
    var spaceString = buildSpaces(4, level);
    var hasChildren = tag.children.length > 0;
    var tagName = getTagName(tag, cssStyle);
    var className = getClassName(tag, cssStyle);
    var properties = tag.properties.map(function (prop) { return " " + prop.name + "=\"" + prop.value + "\""; }).join('');
    var openingTag = spaceString + "<" + tagName + className + properties + (hasChildren && !tag.isText ? "" : ' /') + ">";
    var childTags = hasChildren
        ? '\n' + tag.children.map(function (child) { return buildJsxString(child, cssStyle, level + 1); }).join('\n')
        : tag.isText
            ? "\n" + buildSpaces(4, level + 1) + tag.textCharacters
            : '';
    var closingTag = hasChildren || tag.isText ? "\n" + spaceString + "</" + tagName + ">" : '';
    return openingTag + childTags + closingTag;
};
var buildCode = function (node, css) {
    var tag = buildTagTree_1.buildTagTree(node);
    return "const " + tag.name.replace(/\s/g, '') + ": React.VFC = () => {\n  return (\n" + buildJsxString(tag, css, 0) + "\n  )\n}";
};
exports.buildCode = buildCode;


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
var buildTagTree = function (node) {
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
            childTags.push(exports.buildTagTree(child));
        });
    }
    var tag = {
        name: node.name,
        isText: node.type === 'TEXT',
        textCharacters: node.type === 'TEXT' ? node.characters : null,
        isImg: isImg,
        css: getCssDataForTag_1.getCssDataForTag(node),
        properties: properties,
        children: childTags
    };
    return tag;
};
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
var buildCode_1 = __webpack_require__(/*! ./buildCode */ "./src/buildCode.ts");
var extractCSSDatum_1 = __webpack_require__(/*! ./extractCSSDatum */ "./src/extractCSSDatum.ts");
figma.showUI(__html__, { width: 480, height: 440 });
var selectedNodes = figma.currentPage.selection;
var CSS_STYLE_KEY = 'CSS_STYLE_KEY';
function generate(node, cssStyle) {
    return __awaiter(this, void 0, void 0, function () {
        var _css, generatedCodeStr, cssDatum;
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
                    generatedCodeStr = buildCode_1.buildCode(node, _css);
                    cssDatum = extractCSSDatum_1.extractCssDatum([], node);
                    figma.ui.postMessage({ generatedCodeStr: generatedCodeStr, cssDatum: cssDatum, cssStyle: _css });
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
        var generatedCodeStr = buildCode_1.buildCode(selectedNodes[0], msg.cssStyle);
        var cssDatum = extractCSSDatum_1.extractCssDatum([], selectedNodes[0]);
        figma.ui.postMessage({ generatedCodeStr: generatedCodeStr, cssDatum: cssDatum });
    }
};


/***/ }),

/***/ "./src/extractCSSDatum.ts":
/*!********************************!*\
  !*** ./src/extractCSSDatum.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractCssDatum = void 0;
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
var extractCssDatum = function (datum, node) {
    var properties = [];
    // skip vector since it's often displayed with img tag
    if (node.visible && node.type !== 'VECTOR') {
        if ('opacity' in node && node.opacity < 1) {
            properties.push({ name: 'opacity', value: node.opacity });
        }
        if (node.rotation !== 0) {
            properties.push({ name: 'transform', value: "rotate(" + Math.floor(node.rotation) + "deg)" });
        }
        if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
            var borderRadiusValue = getBorderRadiusString(node);
            if (borderRadiusValue) {
                properties.push({ name: 'border-radius', value: borderRadiusValue });
            }
            if (node.layoutMode !== 'NONE') {
                properties.push({ name: 'display', value: 'flex' });
                properties.push({ name: 'flex-direction', value: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column' });
                properties.push({ name: 'justify-content', value: justifyContentCssValues[node.primaryAxisAlignItems] });
                properties.push({ name: 'align-items', value: alignItemsCssValues[node.counterAxisAlignItems] });
                if (node.paddingTop === node.paddingBottom && node.paddingTop === node.paddingLeft && node.paddingTop === node.paddingRight) {
                    properties.push({ name: 'padding', value: node.paddingTop + "px" });
                }
                else if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight) {
                    properties.push({ name: 'padding', value: node.paddingTop + "px " + node.paddingLeft + "px" });
                }
                else {
                    properties.push({ name: 'padding', value: node.paddingTop + "px " + node.paddingRight + "px " + node.paddingBottom + "px " + node.paddingLeft + "px" });
                }
                properties.push({ name: 'gap', value: node.itemSpacing + 'px' });
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
                properties.push({ name: 'border', value: node.strokeWeight + "px solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'RECTANGLE') {
            var borderRadiusValue = getBorderRadiusString(node);
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
                properties.push({ name: 'border', value: node.strokeWeight + "px solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'TEXT') {
            properties.push({ name: 'text-align', value: textAlignCssValues[node.textAlignHorizontal] });
            properties.push({ name: 'vertical-align', value: textVerticalAlignCssValues[node.textAlignVertical] });
            properties.push({ name: 'font-size', value: node.fontSize + "px" });
            properties.push({ name: 'font-family', value: node.fontName.family });
            var letterSpacing = node.letterSpacing;
            if (letterSpacing.value !== 0) {
                properties.push({ name: 'letter-spacing', value: letterSpacing.value + (letterSpacing.unit === 'PIXELS' ? 'px' : '%') });
            }
            properties.push({
                name: 'line-height',
                value: node.lineHeight.unit === 'AUTO'
                    ? 'auto'
                    : node.lineHeight.value + (node.letterSpacing.unit === 'PIXELS' ? 'px' : '%')
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
                properties.push({ name: 'border', value: node.strokeWeight + "px solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'GROUP' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'STAR') {
            properties.push({ name: 'height', value: Math.floor(node.height) + 'px' });
            properties.push({ name: 'width', value: Math.floor(node.width) + 'px' });
        }
    }
    if (properties.length > 0) {
        var isImage = isImageNode_1.isImageNode(node);
        var cssDataForNode = {
            // name Text node as "Text" since name of text node is often the content of the node and is not appropriate as a name
            className: isImage ? 'Img' : node.type === 'TEXT' ? 'Text' : node.name,
            properties: properties
        };
        datum.push(cssDataForNode);
    }
    if ('children' in node) {
        node.children.forEach(function (child) {
            exports.extractCssDatum(datum, child);
        });
    }
    return datum;
};
exports.extractCssDatum = extractCssDatum;
function getBorderRadiusString(node) {
    if (node.cornerRadius !== 0) {
        if (node.cornerRadius === figma.mixed) {
            return node.topLeftRadius + "px " + node.topRightRadius + "px " + node.bottomRightRadius + "px " + node.bottomLeftRadius + "px";
        }
        return node.cornerRadius + "px";
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
    if (paint.type === 'GRADIENT_ANGULAR' || paint.type === 'GRADIENT_DIAMOND' || paint.type === 'GRADIENT_LINEAR' || paint.type === 'GRADIENT_RADIAL') {
        // background: linear-gradient(180deg, #F20A0A 0%, rgba(255, 255, 255, 0) 100%);
        //[[6.123234262925839e-17, 1, 0], [-1, 6.123234262925839e-17, 1]]
        // [{ "color": { "r": 0.9502958655357361, "g": 0.03851562738418579, "b": 0.03851562738418579, "a": 1 }, "position": 0 }, { "color": { "r": 1, "g": 1, "b": 1, "a": 0 }, "position": 1 }];
        return JSON.stringify(paint.gradientTransform) + JSON.stringify(paint.gradientStops);
    }
    return '';
}


/***/ }),

/***/ "./src/getCssDataForTag.ts":
/*!*********************************!*\
  !*** ./src/getCssDataForTag.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCssDataForTag = void 0;
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
var getCssDataForTag = function (node) {
    var properties = [];
    // skip vector since it's often displayed with img tag
    if (node.visible && node.type !== 'VECTOR') {
        if ('opacity' in node && node.opacity < 1) {
            properties.push({ name: 'opacity', value: node.opacity });
        }
        if (node.rotation !== 0) {
            properties.push({ name: 'transform', value: "rotate(" + Math.floor(node.rotation) + "deg)" });
        }
        if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
            var borderRadiusValue = getBorderRadiusString(node);
            if (borderRadiusValue) {
                properties.push({ name: 'border-radius', value: borderRadiusValue });
            }
            if (node.layoutMode !== 'NONE') {
                properties.push({ name: 'display', value: 'flex' });
                properties.push({ name: 'flex-direction', value: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column' });
                properties.push({ name: 'justify-content', value: justifyContentCssValues[node.primaryAxisAlignItems] });
                properties.push({ name: 'align-items', value: alignItemsCssValues[node.counterAxisAlignItems] });
                if (node.paddingTop === node.paddingBottom && node.paddingTop === node.paddingLeft && node.paddingTop === node.paddingRight) {
                    properties.push({ name: 'padding', value: node.paddingTop + "px" });
                }
                else if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight) {
                    properties.push({ name: 'padding', value: node.paddingTop + "px " + node.paddingLeft + "px" });
                }
                else {
                    properties.push({ name: 'padding', value: node.paddingTop + "px " + node.paddingRight + "px " + node.paddingBottom + "px " + node.paddingLeft + "px" });
                }
                properties.push({ name: 'gap', value: node.itemSpacing + 'px' });
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
                properties.push({ name: 'border', value: node.strokeWeight + "px solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'RECTANGLE') {
            var borderRadiusValue = getBorderRadiusString(node);
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
                properties.push({ name: 'border', value: node.strokeWeight + "px solid " + buildColorString(paint) });
            }
        }
        if (node.type === 'TEXT') {
            properties.push({ name: 'text-align', value: textAlignCssValues[node.textAlignHorizontal] });
            properties.push({ name: 'vertical-align', value: textVerticalAlignCssValues[node.textAlignVertical] });
            properties.push({ name: 'font-size', value: node.fontSize + "px" });
            properties.push({ name: 'font-family', value: node.fontName.family });
            var letterSpacing = node.letterSpacing;
            if (letterSpacing.value !== 0) {
                properties.push({ name: 'letter-spacing', value: letterSpacing.value + (letterSpacing.unit === 'PIXELS' ? 'px' : '%') });
            }
            properties.push({
                name: 'line-height',
                value: node.lineHeight.unit === 'AUTO'
                    ? 'auto'
                    : node.lineHeight.value + (node.letterSpacing.unit === 'PIXELS' ? 'px' : '%')
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
                properties.push({ name: 'border', value: node.strokeWeight + "px solid " + buildColorString(paint) });
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
            className: isImage ? 'Img' : node.type === 'TEXT' ? 'Text' : node.name,
            properties: properties
        };
    }
    return null;
};
exports.getCssDataForTag = getCssDataForTag;
function getBorderRadiusString(node) {
    if (node.cornerRadius !== 0) {
        if (typeof node.cornerRadius !== 'number') {
            return node.topLeftRadius + "px " + node.topRightRadius + "px " + node.bottomRightRadius + "px " + node.bottomLeftRadius + "px";
        }
        return node.cornerRadius + "px";
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

/***/ "./src/utils/isImageNode.ts":
/*!**********************************!*\
  !*** ./src/utils/isImageNode.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isImageNode = void 0;
var isImageNode = function (node) {
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
};
exports.isImageNode = isImageNode;


/***/ }),

/***/ "./src/utils/kebabize.ts":
/*!*******************************!*\
  !*** ./src/utils/kebabize.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kebabize = void 0;
var kebabize = function (str) {
    return str
        .split('')
        .map(function (letter, idx) {
        return letter.toUpperCase() === letter ? "" + (idx !== 0 ? '-' : '') + letter.toLowerCase() : letter;
    })
        .join('');
};
exports.kebabize = kebabize;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkVGFnVHJlZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9leHRyYWN0Q1NTRGF0dW0udHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9nZXRDc3NEYXRhRm9yVGFnLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9rZWJhYml6ZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIscUJBQXFCLG1CQUFPLENBQUMsNkNBQWdCO0FBQzdDLGlCQUFpQixtQkFBTyxDQUFDLGlEQUFrQjtBQUMzQztBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsb0RBQW9ELEVB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0I7Ozs7Ozs7VUNYaEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZENvZGUgPSB2b2lkIDA7XG52YXIgYnVpbGRUYWdUcmVlXzEgPSByZXF1aXJlKFwiLi9idWlsZFRhZ1RyZWVcIik7XG52YXIga2ViYWJpemVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2tlYmFiaXplXCIpO1xuZnVuY3Rpb24gYnVpbGRTcGFjZXMoYmFzZVNwYWNlcywgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VzU3RyID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlU3BhY2VzOyBpKyspIHtcbiAgICAgICAgc3BhY2VzU3RyICs9ICcgJztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbDsgaSsrKSB7XG4gICAgICAgIHNwYWNlc1N0ciArPSAnICAnO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2VzU3RyO1xufVxuZnVuY3Rpb24gZ3Vlc3NUYWdOYW1lKG5hbWUpIHtcbiAgICB2YXIgX25hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdidXR0b24nKSkge1xuICAgICAgICByZXR1cm4gJ2J1dHRvbic7XG4gICAgfVxuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnc2VjdGlvbicpKSB7XG4gICAgICAgIHJldHVybiAnc2VjdGlvbic7XG4gICAgfVxuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnYXJ0aWNsZScpKSB7XG4gICAgICAgIHJldHVybiAnYXJ0aWNsZSc7XG4gICAgfVxuICAgIHJldHVybiAnZGl2Jztcbn1cbnZhciBnZXRUYWdOYW1lID0gZnVuY3Rpb24gKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnKSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnaW1nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICdwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3Vlc3NUYWdOYW1lKHRhZy5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhZy5pc1RleHQgPyAnVGV4dCcgOiB0YWcubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpO1xufTtcbnZhciBnZXRDbGFzc05hbWUgPSBmdW5jdGlvbiAodGFnLCBjc3NTdHlsZSkge1xuICAgIGlmIChjc3NTdHlsZSA9PT0gJ2NzcycpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJyBjbGFzc05hbWU9XCJ0ZXh0XCInO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIiBjbGFzc05hbWU9XFxcIlwiICsga2ViYWJpemVfMS5rZWJhYml6ZSh0YWcubmFtZSkgKyBcIlxcXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufTtcbnZhciBidWlsZEpzeFN0cmluZyA9IGZ1bmN0aW9uICh0YWcsIGNzc1N0eWxlLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZVN0cmluZyA9IGJ1aWxkU3BhY2VzKDQsIGxldmVsKTtcbiAgICB2YXIgaGFzQ2hpbGRyZW4gPSB0YWcuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB2YXIgdGFnTmFtZSA9IGdldFRhZ05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGdldENsYXNzTmFtZSh0YWcsIGNzc1N0eWxlKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IHRhZy5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbiAocHJvcCkgeyByZXR1cm4gXCIgXCIgKyBwcm9wLm5hbWUgKyBcIj1cXFwiXCIgKyBwcm9wLnZhbHVlICsgXCJcXFwiXCI7IH0pLmpvaW4oJycpO1xuICAgIHZhciBvcGVuaW5nVGFnID0gc3BhY2VTdHJpbmcgKyBcIjxcIiArIHRhZ05hbWUgKyBjbGFzc05hbWUgKyBwcm9wZXJ0aWVzICsgKGhhc0NoaWxkcmVuICYmICF0YWcuaXNUZXh0ID8gXCJcIiA6ICcgLycpICsgXCI+XCI7XG4gICAgdmFyIGNoaWxkVGFncyA9IGhhc0NoaWxkcmVuXG4gICAgICAgID8gJ1xcbicgKyB0YWcuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gYnVpbGRKc3hTdHJpbmcoY2hpbGQsIGNzc1N0eWxlLCBsZXZlbCArIDEpOyB9KS5qb2luKCdcXG4nKVxuICAgICAgICA6IHRhZy5pc1RleHRcbiAgICAgICAgICAgID8gXCJcXG5cIiArIGJ1aWxkU3BhY2VzKDQsIGxldmVsICsgMSkgKyB0YWcudGV4dENoYXJhY3RlcnNcbiAgICAgICAgICAgIDogJyc7XG4gICAgdmFyIGNsb3NpbmdUYWcgPSBoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gXCJcXG5cIiArIHNwYWNlU3RyaW5nICsgXCI8L1wiICsgdGFnTmFtZSArIFwiPlwiIDogJyc7XG4gICAgcmV0dXJuIG9wZW5pbmdUYWcgKyBjaGlsZFRhZ3MgKyBjbG9zaW5nVGFnO1xufTtcbnZhciBidWlsZENvZGUgPSBmdW5jdGlvbiAobm9kZSwgY3NzKSB7XG4gICAgdmFyIHRhZyA9IGJ1aWxkVGFnVHJlZV8xLmJ1aWxkVGFnVHJlZShub2RlKTtcbiAgICByZXR1cm4gXCJjb25zdCBcIiArIHRhZy5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJykgKyBcIjogUmVhY3QuVkZDID0gKCkgPT4ge1xcbiAgcmV0dXJuIChcXG5cIiArIGJ1aWxkSnN4U3RyaW5nKHRhZywgY3NzLCAwKSArIFwiXFxuICApXFxufVwiO1xufTtcbmV4cG9ydHMuYnVpbGRDb2RlID0gYnVpbGRDb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IHZvaWQgMDtcbnZhciBnZXRDc3NEYXRhRm9yVGFnXzEgPSByZXF1aXJlKFwiLi9nZXRDc3NEYXRhRm9yVGFnXCIpO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBidWlsZFRhZ1RyZWUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmICghbm9kZS52aXNpYmxlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgaXNJbWcgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgaWYgKGlzSW1nKSB7XG4gICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdzcmMnLCB2YWx1ZTogJycgfSk7XG4gICAgfVxuICAgIHZhciBjaGlsZFRhZ3MgPSBbXTtcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmICFpc0ltZykge1xuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBjaGlsZFRhZ3MucHVzaChleHBvcnRzLmJ1aWxkVGFnVHJlZShjaGlsZCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHRhZyA9IHtcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICBpc1RleHQ6IG5vZGUudHlwZSA9PT0gJ1RFWFQnLFxuICAgICAgICB0ZXh0Q2hhcmFjdGVyczogbm9kZS50eXBlID09PSAnVEVYVCcgPyBub2RlLmNoYXJhY3RlcnMgOiBudWxsLFxuICAgICAgICBpc0ltZzogaXNJbWcsXG4gICAgICAgIGNzczogZ2V0Q3NzRGF0YUZvclRhZ18xLmdldENzc0RhdGFGb3JUYWcobm9kZSksXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZFRhZ3NcbiAgICB9O1xuICAgIHJldHVybiB0YWc7XG59O1xuZXhwb3J0cy5idWlsZFRhZ1RyZWUgPSBidWlsZFRhZ1RyZWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgYnVpbGRDb2RlXzEgPSByZXF1aXJlKFwiLi9idWlsZENvZGVcIik7XG52YXIgZXh0cmFjdENTU0RhdHVtXzEgPSByZXF1aXJlKFwiLi9leHRyYWN0Q1NTRGF0dW1cIik7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDQ4MCwgaGVpZ2h0OiA0NDAgfSk7XG52YXIgc2VsZWN0ZWROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbnZhciBDU1NfU1RZTEVfS0VZID0gJ0NTU19TVFlMRV9LRVknO1xuZnVuY3Rpb24gZ2VuZXJhdGUobm9kZSwgY3NzU3R5bGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfY3NzLCBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NEYXR1bTtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2NzcyA9IGNzc1N0eWxlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISFfY3NzKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhDU1NfU1RZTEVfS0VZKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBfY3NzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9jc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jc3MgPSAnY3NzJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWRDb2RlU3RyID0gYnVpbGRDb2RlXzEuYnVpbGRDb2RlKG5vZGUsIF9jc3MpO1xuICAgICAgICAgICAgICAgICAgICBjc3NEYXR1bSA9IGV4dHJhY3RDU1NEYXR1bV8xLmV4dHJhY3RDc3NEYXR1bShbXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgZ2VuZXJhdGVkQ29kZVN0cjogZ2VuZXJhdGVkQ29kZVN0ciwgY3NzRGF0dW06IGNzc0RhdHVtLCBjc3NTdHlsZTogX2NzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3Qgb25seSAxIG5vZGUnKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZWxzZSBpZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3QgYSBub2RlJyk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbmVsc2Uge1xuICAgIGdlbmVyYXRlKHNlbGVjdGVkTm9kZXNbMF0pO1xufVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ25vdGlmeS1jb3B5LXN1Y2Nlc3MnKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnY29waWVkIHRvIGNsaXBib2FyZPCfkY0nKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnbmV3LWNzcy1zdHlsZS1zZXQnKSB7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoQ1NTX1NUWUxFX0tFWSwgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgdmFyIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUoc2VsZWN0ZWROb2Rlc1swXSwgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgdmFyIGNzc0RhdHVtID0gZXh0cmFjdENTU0RhdHVtXzEuZXh0cmFjdENzc0RhdHVtKFtdLCBzZWxlY3RlZE5vZGVzWzBdKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBnZW5lcmF0ZWRDb2RlU3RyOiBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NEYXR1bTogY3NzRGF0dW0gfSk7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0Q3NzRGF0dW0gPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIFNQQUNFX0JFVFdFRU46ICdzcGFjZS1iZXR3ZWVuJ1xufTtcbnZhciBhbGlnbkl0ZW1zQ3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInXG59O1xudmFyIHRleHRBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBMRUZUOiAnbGVmdCcsXG4gICAgUklHSFQ6ICdyaWdodCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBKVVNUSUZJRUQ6ICdqdXN0aWZ5J1xufTtcbnZhciB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBUT1A6ICd0b3AnLFxuICAgIENFTlRFUjogJ21pZGRsZScsXG4gICAgQk9UVE9NOiAnYm90dG9tJ1xufTtcbnZhciB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlcyA9IHtcbiAgICBVTkRFUkxJTkU6ICd1bmRlcmxpbmUnLFxuICAgIFNUUklMRVRIUk9VR0g6ICdsaW5lLXRocm91Z2gnXG59O1xudmFyIGV4dHJhY3RDc3NEYXR1bSA9IGZ1bmN0aW9uIChkYXR1bSwgbm9kZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgd2l0aCBpbWcgdGFnXG4gICAgaWYgKG5vZGUudmlzaWJsZSAmJiBub2RlLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgIGlmICgnb3BhY2l0eScgaW4gbm9kZSAmJiBub2RlLm9wYWNpdHkgPCAxKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnb3BhY2l0eScsIHZhbHVlOiBub2RlLm9wYWNpdHkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUucm90YXRpb24gIT09IDApIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0cmFuc2Zvcm0nLCB2YWx1ZTogXCJyb3RhdGUoXCIgKyBNYXRoLmZsb29yKG5vZGUucm90YXRpb24pICsgXCJkZWcpXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZGlzcGxheScsIHZhbHVlOiAnZmxleCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZsZXgtZGlyZWN0aW9uJywgdmFsdWU6IG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnID8gJ3JvdycgOiAnY29sdW1uJyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnanVzdGlmeS1jb250ZW50JywgdmFsdWU6IGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzW25vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYWxpZ24taXRlbXMnLCB2YWx1ZTogYWxpZ25JdGVtc0Nzc1ZhbHVlc1tub2RlLmNvdW50ZXJBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nTGVmdCAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nTGVmdCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nUmlnaHQgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nQm90dG9tICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdnYXAnLCB2YWx1ZTogbm9kZS5pdGVtU3BhY2luZyArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtYWxpZ24nLCB2YWx1ZTogdGV4dEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduSG9yaXpvbnRhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndmVydGljYWwtYWxpZ24nLCB2YWx1ZTogdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25WZXJ0aWNhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1zaXplJywgdmFsdWU6IG5vZGUuZm9udFNpemUgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1mYW1pbHknLCB2YWx1ZTogbm9kZS5mb250TmFtZS5mYW1pbHkgfSk7XG4gICAgICAgICAgICB2YXIgbGV0dGVyU3BhY2luZyA9IG5vZGUubGV0dGVyU3BhY2luZztcbiAgICAgICAgICAgIGlmIChsZXR0ZXJTcGFjaW5nLnZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2xldHRlci1zcGFjaW5nJywgdmFsdWU6IGxldHRlclNwYWNpbmcudmFsdWUgKyAobGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGluZS1oZWlnaHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLmxpbmVIZWlnaHQudW5pdCA9PT0gJ0FVVE8nXG4gICAgICAgICAgICAgICAgICAgID8gJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIDogbm9kZS5saW5lSGVpZ2h0LnZhbHVlICsgKG5vZGUubGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnRleHREZWNvcmF0aW9uICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1kZWNvcmF0aW9uJywgdmFsdWU6IHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzW25vZGUudGV4dERlY29yYXRpb25dIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2NvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMSU5FJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnR1JPVVAnIHx8IG5vZGUudHlwZSA9PT0gJ0VMTElQU0UnIHx8IG5vZGUudHlwZSA9PT0gJ1BPTFlHT04nIHx8IG5vZGUudHlwZSA9PT0gJ1NUQVInKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpc0ltYWdlID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICAgICAgdmFyIGNzc0RhdGFGb3JOb2RlID0ge1xuICAgICAgICAgICAgLy8gbmFtZSBUZXh0IG5vZGUgYXMgXCJUZXh0XCIgc2luY2UgbmFtZSBvZiB0ZXh0IG5vZGUgaXMgb2Z0ZW4gdGhlIGNvbnRlbnQgb2YgdGhlIG5vZGUgYW5kIGlzIG5vdCBhcHByb3ByaWF0ZSBhcyBhIG5hbWVcbiAgICAgICAgICAgIGNsYXNzTmFtZTogaXNJbWFnZSA/ICdJbWcnIDogbm9kZS50eXBlID09PSAnVEVYVCcgPyAnVGV4dCcgOiBub2RlLm5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgICAgIH07XG4gICAgICAgIGRhdHVtLnB1c2goY3NzRGF0YUZvck5vZGUpO1xuICAgIH1cbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZXh0cmFjdENzc0RhdHVtKGRhdHVtLCBjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0dW07XG59O1xuZXhwb3J0cy5leHRyYWN0Q3NzRGF0dW0gPSBleHRyYWN0Q3NzRGF0dW07XG5mdW5jdGlvbiBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSkge1xuICAgIGlmIChub2RlLmNvcm5lclJhZGl1cyAhPT0gMCkge1xuICAgICAgICBpZiAobm9kZS5jb3JuZXJSYWRpdXMgPT09IGZpZ21hLm1peGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS50b3BMZWZ0UmFkaXVzICsgXCJweCBcIiArIG5vZGUudG9wUmlnaHRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS5ib3R0b21SaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbUxlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuY29ybmVyUmFkaXVzICsgXCJweFwiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJnYlZhbHVlVG9IZXgodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuZnVuY3Rpb24gYnVpbGRDb2xvclN0cmluZyhwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGlmIChwYWludC5vcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgcGFpbnQub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLnIgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5nICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuYiAqIDI1NSkgKyBcIiwgXCIgKyBwYWludC5vcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5yKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuZykgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmIpO1xuICAgIH1cbiAgICBpZiAocGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0FOR1VMQVInIHx8IHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9ESUFNT05EJyB8fCBwYWludC50eXBlID09PSAnR1JBRElFTlRfTElORUFSJyB8fCBwYWludC50eXBlID09PSAnR1JBRElFTlRfUkFESUFMJykge1xuICAgICAgICAvLyBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjRjIwQTBBIDAlLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApIDEwMCUpO1xuICAgICAgICAvL1tbNi4xMjMyMzQyNjI5MjU4MzllLTE3LCAxLCAwXSwgWy0xLCA2LjEyMzIzNDI2MjkyNTgzOWUtMTcsIDFdXVxuICAgICAgICAvLyBbeyBcImNvbG9yXCI6IHsgXCJyXCI6IDAuOTUwMjk1ODY1NTM1NzM2MSwgXCJnXCI6IDAuMDM4NTE1NjI3Mzg0MTg1NzksIFwiYlwiOiAwLjAzODUxNTYyNzM4NDE4NTc5LCBcImFcIjogMSB9LCBcInBvc2l0aW9uXCI6IDAgfSwgeyBcImNvbG9yXCI6IHsgXCJyXCI6IDEsIFwiZ1wiOiAxLCBcImJcIjogMSwgXCJhXCI6IDAgfSwgXCJwb3NpdGlvblwiOiAxIH1dO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFpbnQuZ3JhZGllbnRUcmFuc2Zvcm0pICsgSlNPTi5zdHJpbmdpZnkocGFpbnQuZ3JhZGllbnRTdG9wcyk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gdm9pZCAwO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBqdXN0aWZ5Q29udGVudENzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBTUEFDRV9CRVRXRUVOOiAnc3BhY2UtYmV0d2Vlbidcbn07XG52YXIgYWxpZ25JdGVtc0Nzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJ1xufTtcbnZhciB0ZXh0QWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgSlVTVElGSUVEOiAnanVzdGlmeSdcbn07XG52YXIgdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgVE9QOiAndG9wJyxcbiAgICBDRU5URVI6ICdtaWRkbGUnLFxuICAgIEJPVFRPTTogJ2JvdHRvbSdcbn07XG52YXIgdGV4dERlY29yYXRpb25Dc3NWYWx1ZXMgPSB7XG4gICAgVU5ERVJMSU5FOiAndW5kZXJsaW5lJyxcbiAgICBTVFJJTEVUSFJPVUdIOiAnbGluZS10aHJvdWdoJ1xufTtcbnZhciBnZXRDc3NEYXRhRm9yVGFnID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgIC8vIHNraXAgdmVjdG9yIHNpbmNlIGl0J3Mgb2Z0ZW4gZGlzcGxheWVkIHdpdGggaW1nIHRhZ1xuICAgIGlmIChub2RlLnZpc2libGUgJiYgbm9kZS50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICBpZiAoJ29wYWNpdHknIGluIG5vZGUgJiYgbm9kZS5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ29wYWNpdHknLCB2YWx1ZTogbm9kZS5vcGFjaXR5IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnJvdGF0aW9uICE9PSAwKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndHJhbnNmb3JtJywgdmFsdWU6IFwicm90YXRlKFwiICsgTWF0aC5mbG9vcihub2RlLnJvdGF0aW9uKSArIFwiZGVnKVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2Rpc3BsYXknLCB2YWx1ZTogJ2ZsZXgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmbGV4LWRpcmVjdGlvbicsIHZhbHVlOiBub2RlLmxheW91dE1vZGUgPT09ICdIT1JJWk9OVEFMJyA/ICdyb3cnIDogJ2NvbHVtbicgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2p1c3RpZnktY29udGVudCcsIHZhbHVlOiBqdXN0aWZ5Q29udGVudENzc1ZhbHVlc1tub2RlLnByaW1hcnlBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2FsaWduLWl0ZW1zJywgdmFsdWU6IGFsaWduSXRlbXNDc3NWYWx1ZXNbbm9kZS5jb3VudGVyQXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0JvdHRvbSAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0xlZnQgJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ0xlZnQgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdMZWZ0ICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ1JpZ2h0ICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0JvdHRvbSArIFwicHggXCIgKyBub2RlLnBhZGRpbmdMZWZ0ICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZ2FwJywgdmFsdWU6IG5vZGUuaXRlbVNwYWNpbmcgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWFsaWduJywgdmFsdWU6IHRleHRBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnbkhvcml6b250YWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3ZlcnRpY2FsLWFsaWduJywgdmFsdWU6IHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduVmVydGljYWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtc2l6ZScsIHZhbHVlOiBub2RlLmZvbnRTaXplICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtZmFtaWx5JywgdmFsdWU6IG5vZGUuZm9udE5hbWUuZmFtaWx5IH0pO1xuICAgICAgICAgICAgdmFyIGxldHRlclNwYWNpbmcgPSBub2RlLmxldHRlclNwYWNpbmc7XG4gICAgICAgICAgICBpZiAobGV0dGVyU3BhY2luZy52YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdsZXR0ZXItc3BhY2luZycsIHZhbHVlOiBsZXR0ZXJTcGFjaW5nLnZhbHVlICsgKGxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUycgPyAncHgnIDogJyUnKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2xpbmUtaGVpZ2h0JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbm9kZS5saW5lSGVpZ2h0LnVuaXQgPT09ICdBVVRPJ1xuICAgICAgICAgICAgICAgICAgICA/ICdhdXRvJ1xuICAgICAgICAgICAgICAgICAgICA6IG5vZGUubGluZUhlaWdodC52YWx1ZSArIChub2RlLmxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUycgPyAncHgnIDogJyUnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS50ZXh0RGVjb3JhdGlvbiAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtZGVjb3JhdGlvbicsIHZhbHVlOiB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlc1tub2RlLnRleHREZWNvcmF0aW9uXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdjb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnTElORScpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0dST1VQJyB8fCBub2RlLnR5cGUgPT09ICdFTExJUFNFJyB8fCBub2RlLnR5cGUgPT09ICdQT0xZR09OJyB8fCBub2RlLnR5cGUgPT09ICdTVEFSJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaXNJbWFnZSA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBuYW1lIFRleHQgbm9kZSBhcyBcIlRleHRcIiBzaW5jZSBuYW1lIG9mIHRleHQgbm9kZSBpcyBvZnRlbiB0aGUgY29udGVudCBvZiB0aGUgbm9kZSBhbmQgaXMgbm90IGFwcHJvcHJpYXRlIGFzIGEgbmFtZVxuICAgICAgICAgICAgY2xhc3NOYW1lOiBpc0ltYWdlID8gJ0ltZycgOiBub2RlLnR5cGUgPT09ICdURVhUJyA/ICdUZXh0JyA6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gZ2V0Q3NzRGF0YUZvclRhZztcbmZ1bmN0aW9uIGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKSB7XG4gICAgaWYgKG5vZGUuY29ybmVyUmFkaXVzICE9PSAwKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygbm9kZS5jb3JuZXJSYWRpdXMgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS50b3BMZWZ0UmFkaXVzICsgXCJweCBcIiArIG5vZGUudG9wUmlnaHRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS5ib3R0b21SaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbUxlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuY29ybmVyUmFkaXVzICsgXCJweFwiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJnYlZhbHVlVG9IZXgodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuZnVuY3Rpb24gYnVpbGRDb2xvclN0cmluZyhwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGlmIChwYWludC5vcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgcGFpbnQub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLnIgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5nICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuYiAqIDI1NSkgKyBcIiwgXCIgKyBwYWludC5vcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5yKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuZykgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmIpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIOS4i+mDqOOBqyBWZWN0b3Ig44GX44GL5a2Y5Zyo44GX44Gq44GE44KC44Gu44Gv55S75YOP44Go5Yik5a6a44GZ44KLXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGhhc09ubHlWZWN0b3JfMSA9IHRydWU7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICAgICAgICAgIGhhc09ubHlWZWN0b3JfMSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGhhc09ubHlWZWN0b3JfMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVkVDVE9SJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgIGlmIChub2RlLmZpbGxzLmZpbmQoZnVuY3Rpb24gKHBhaW50KSB7IHJldHVybiBwYWludC50eXBlID09PSAnSU1BR0UnOyB9KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuZXhwb3J0cy5pc0ltYWdlTm9kZSA9IGlzSW1hZ2VOb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmtlYmFiaXplID0gdm9pZCAwO1xudmFyIGtlYmFiaXplID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsZXR0ZXIsIGlkeCkge1xuICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCkgPT09IGxldHRlciA/IFwiXCIgKyAoaWR4ICE9PSAwID8gJy0nIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJycpO1xufTtcbmV4cG9ydHMua2ViYWJpemUgPSBrZWJhYml6ZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=