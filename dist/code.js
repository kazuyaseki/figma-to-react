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
    var openingTag = spaceString + "<" + tagName + className + properties + (hasChildren || tag.isText ? "" : ' /') + ">";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkVGFnVHJlZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9leHRyYWN0Q1NTRGF0dW0udHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9nZXRDc3NEYXRhRm9yVGFnLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9rZWJhYml6ZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIscUJBQXFCLG1CQUFPLENBQUMsNkNBQWdCO0FBQzdDLGlCQUFpQixtQkFBTyxDQUFDLGlEQUFrQjtBQUMzQztBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsb0RBQW9ELEVB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0I7Ozs7Ozs7VUNYaEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZENvZGUgPSB2b2lkIDA7XG52YXIgYnVpbGRUYWdUcmVlXzEgPSByZXF1aXJlKFwiLi9idWlsZFRhZ1RyZWVcIik7XG52YXIga2ViYWJpemVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2tlYmFiaXplXCIpO1xuZnVuY3Rpb24gYnVpbGRTcGFjZXMoYmFzZVNwYWNlcywgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VzU3RyID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlU3BhY2VzOyBpKyspIHtcbiAgICAgICAgc3BhY2VzU3RyICs9ICcgJztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbDsgaSsrKSB7XG4gICAgICAgIHNwYWNlc1N0ciArPSAnICAnO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2VzU3RyO1xufVxuZnVuY3Rpb24gZ3Vlc3NUYWdOYW1lKG5hbWUpIHtcbiAgICB2YXIgX25hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdidXR0b24nKSkge1xuICAgICAgICByZXR1cm4gJ2J1dHRvbic7XG4gICAgfVxuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnc2VjdGlvbicpKSB7XG4gICAgICAgIHJldHVybiAnc2VjdGlvbic7XG4gICAgfVxuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnYXJ0aWNsZScpKSB7XG4gICAgICAgIHJldHVybiAnYXJ0aWNsZSc7XG4gICAgfVxuICAgIHJldHVybiAnZGl2Jztcbn1cbnZhciBnZXRUYWdOYW1lID0gZnVuY3Rpb24gKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnKSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnaW1nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICdwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3Vlc3NUYWdOYW1lKHRhZy5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhZy5pc1RleHQgPyAnVGV4dCcgOiB0YWcubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpO1xufTtcbnZhciBnZXRDbGFzc05hbWUgPSBmdW5jdGlvbiAodGFnLCBjc3NTdHlsZSkge1xuICAgIGlmIChjc3NTdHlsZSA9PT0gJ2NzcycpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJyBjbGFzc05hbWU9XCJ0ZXh0XCInO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIiBjbGFzc05hbWU9XFxcIlwiICsga2ViYWJpemVfMS5rZWJhYml6ZSh0YWcubmFtZSkgKyBcIlxcXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufTtcbnZhciBidWlsZEpzeFN0cmluZyA9IGZ1bmN0aW9uICh0YWcsIGNzc1N0eWxlLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZVN0cmluZyA9IGJ1aWxkU3BhY2VzKDQsIGxldmVsKTtcbiAgICB2YXIgaGFzQ2hpbGRyZW4gPSB0YWcuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB2YXIgdGFnTmFtZSA9IGdldFRhZ05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGdldENsYXNzTmFtZSh0YWcsIGNzc1N0eWxlKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IHRhZy5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbiAocHJvcCkgeyByZXR1cm4gXCIgXCIgKyBwcm9wLm5hbWUgKyBcIj1cXFwiXCIgKyBwcm9wLnZhbHVlICsgXCJcXFwiXCI7IH0pLmpvaW4oJycpO1xuICAgIHZhciBvcGVuaW5nVGFnID0gc3BhY2VTdHJpbmcgKyBcIjxcIiArIHRhZ05hbWUgKyBjbGFzc05hbWUgKyBwcm9wZXJ0aWVzICsgKGhhc0NoaWxkcmVuIHx8IHRhZy5pc1RleHQgPyBcIlwiIDogJyAvJykgKyBcIj5cIjtcbiAgICB2YXIgY2hpbGRUYWdzID0gaGFzQ2hpbGRyZW5cbiAgICAgICAgPyAnXFxuJyArIHRhZy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBidWlsZEpzeFN0cmluZyhjaGlsZCwgY3NzU3R5bGUsIGxldmVsICsgMSk7IH0pLmpvaW4oJ1xcbicpXG4gICAgICAgIDogdGFnLmlzVGV4dFxuICAgICAgICAgICAgPyBcIlxcblwiICsgYnVpbGRTcGFjZXMoNCwgbGV2ZWwgKyAxKSArIHRhZy50ZXh0Q2hhcmFjdGVyc1xuICAgICAgICAgICAgOiAnJztcbiAgICB2YXIgY2xvc2luZ1RhZyA9IGhhc0NoaWxkcmVuIHx8IHRhZy5pc1RleHQgPyBcIlxcblwiICsgc3BhY2VTdHJpbmcgKyBcIjwvXCIgKyB0YWdOYW1lICsgXCI+XCIgOiAnJztcbiAgICByZXR1cm4gb3BlbmluZ1RhZyArIGNoaWxkVGFncyArIGNsb3NpbmdUYWc7XG59O1xudmFyIGJ1aWxkQ29kZSA9IGZ1bmN0aW9uIChub2RlLCBjc3MpIHtcbiAgICB2YXIgdGFnID0gYnVpbGRUYWdUcmVlXzEuYnVpbGRUYWdUcmVlKG5vZGUpO1xuICAgIHJldHVybiBcImNvbnN0IFwiICsgdGFnLm5hbWUucmVwbGFjZSgvXFxzL2csICcnKSArIFwiOiBSZWFjdC5WRkMgPSAoKSA9PiB7XFxuICByZXR1cm4gKFxcblwiICsgYnVpbGRKc3hTdHJpbmcodGFnLCBjc3MsIDApICsgXCJcXG4gIClcXG59XCI7XG59O1xuZXhwb3J0cy5idWlsZENvZGUgPSBidWlsZENvZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRUYWdUcmVlID0gdm9pZCAwO1xudmFyIGdldENzc0RhdGFGb3JUYWdfMSA9IHJlcXVpcmUoXCIuL2dldENzc0RhdGFGb3JUYWdcIik7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGJ1aWxkVGFnVHJlZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKCFub2RlLnZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBpc0ltZyA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcbiAgICBpZiAoaXNJbWcpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3NyYycsIHZhbHVlOiAnJyB9KTtcbiAgICB9XG4gICAgdmFyIGNoaWxkVGFncyA9IFtdO1xuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgIWlzSW1nKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkVGFncy5wdXNoKGV4cG9ydHMuYnVpbGRUYWdUcmVlKGNoaWxkKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgdGFnID0ge1xuICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgIGlzVGV4dDogbm9kZS50eXBlID09PSAnVEVYVCcsXG4gICAgICAgIHRleHRDaGFyYWN0ZXJzOiBub2RlLnR5cGUgPT09ICdURVhUJyA/IG5vZGUuY2hhcmFjdGVycyA6IG51bGwsXG4gICAgICAgIGlzSW1nOiBpc0ltZyxcbiAgICAgICAgY3NzOiBnZXRDc3NEYXRhRm9yVGFnXzEuZ2V0Q3NzRGF0YUZvclRhZyhub2RlKSxcbiAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkVGFnc1xuICAgIH07XG4gICAgcmV0dXJuIHRhZztcbn07XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IGJ1aWxkVGFnVHJlZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBidWlsZENvZGVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkQ29kZVwiKTtcbnZhciBleHRyYWN0Q1NTRGF0dW1fMSA9IHJlcXVpcmUoXCIuL2V4dHJhY3RDU1NEYXR1bVwiKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDgwLCBoZWlnaHQ6IDQ0MCB9KTtcbnZhciBzZWxlY3RlZE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xudmFyIENTU19TVFlMRV9LRVkgPSAnQ1NTX1NUWUxFX0tFWSc7XG5mdW5jdGlvbiBnZW5lcmF0ZShub2RlLCBjc3NTdHlsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9jc3MsIGdlbmVyYXRlZENvZGVTdHIsIGNzc0RhdHVtO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY3NzID0gY3NzU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIV9jc3MpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKENTU19TVFlMRV9LRVkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9jc3MgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2Nzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NzcyA9ICdjc3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUobm9kZSwgX2Nzcyk7XG4gICAgICAgICAgICAgICAgICAgIGNzc0RhdHVtID0gZXh0cmFjdENTU0RhdHVtXzEuZXh0cmFjdENzc0RhdHVtKFtdLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBnZW5lcmF0ZWRDb2RlU3RyOiBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NEYXR1bTogY3NzRGF0dW0sIGNzc1N0eWxlOiBfY3NzIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID4gMSkge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBvbmx5IDEgbm9kZScpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5lbHNlIGlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBhIG5vZGUnKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZWxzZSB7XG4gICAgZ2VuZXJhdGUoc2VsZWN0ZWROb2Rlc1swXSk7XG59XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnbm90aWZ5LWNvcHktc3VjY2VzcycpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KCdjb3BpZWQgdG8gY2xpcGJvYXJk8J+RjScpO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICduZXctY3NzLXN0eWxlLXNldCcpIHtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhDU1NfU1RZTEVfS0VZLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICB2YXIgZ2VuZXJhdGVkQ29kZVN0ciA9IGJ1aWxkQ29kZV8xLmJ1aWxkQ29kZShzZWxlY3RlZE5vZGVzWzBdLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICB2YXIgY3NzRGF0dW0gPSBleHRyYWN0Q1NTRGF0dW1fMS5leHRyYWN0Q3NzRGF0dW0oW10sIHNlbGVjdGVkTm9kZXNbMF0pO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGdlbmVyYXRlZENvZGVTdHI6IGdlbmVyYXRlZENvZGVTdHIsIGNzc0RhdHVtOiBjc3NEYXR1bSB9KTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4dHJhY3RDc3NEYXR1bSA9IHZvaWQgMDtcbnZhciBpc0ltYWdlTm9kZV8xID0gcmVxdWlyZShcIi4vdXRpbHMvaXNJbWFnZU5vZGVcIik7XG52YXIganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXMgPSB7XG4gICAgTUlOOiAnZmxleC1zdGFydCcsXG4gICAgTUFYOiAnZmxleC1lbmQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgU1BBQ0VfQkVUV0VFTjogJ3NwYWNlLWJldHdlZW4nXG59O1xudmFyIGFsaWduSXRlbXNDc3NWYWx1ZXMgPSB7XG4gICAgTUlOOiAnZmxleC1zdGFydCcsXG4gICAgTUFYOiAnZmxleC1lbmQnLFxuICAgIENFTlRFUjogJ2NlbnRlcidcbn07XG52YXIgdGV4dEFsaWduQ3NzVmFsdWVzID0ge1xuICAgIExFRlQ6ICdsZWZ0JyxcbiAgICBSSUdIVDogJ3JpZ2h0JyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIEpVU1RJRklFRDogJ2p1c3RpZnknXG59O1xudmFyIHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzID0ge1xuICAgIFRPUDogJ3RvcCcsXG4gICAgQ0VOVEVSOiAnbWlkZGxlJyxcbiAgICBCT1RUT006ICdib3R0b20nXG59O1xudmFyIHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzID0ge1xuICAgIFVOREVSTElORTogJ3VuZGVybGluZScsXG4gICAgU1RSSUxFVEhST1VHSDogJ2xpbmUtdGhyb3VnaCdcbn07XG52YXIgZXh0cmFjdENzc0RhdHVtID0gZnVuY3Rpb24gKGRhdHVtLCBub2RlKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcbiAgICAvLyBza2lwIHZlY3RvciBzaW5jZSBpdCdzIG9mdGVuIGRpc3BsYXllZCB3aXRoIGltZyB0YWdcbiAgICBpZiAobm9kZS52aXNpYmxlICYmIG5vZGUudHlwZSAhPT0gJ1ZFQ1RPUicpIHtcbiAgICAgICAgaWYgKCdvcGFjaXR5JyBpbiBub2RlICYmIG5vZGUub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdvcGFjaXR5JywgdmFsdWU6IG5vZGUub3BhY2l0eSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5yb3RhdGlvbiAhPT0gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RyYW5zZm9ybScsIHZhbHVlOiBcInJvdGF0ZShcIiArIE1hdGguZmxvb3Iobm9kZS5yb3RhdGlvbikgKyBcImRlZylcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fCBub2RlLnR5cGUgPT09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdkaXNwbGF5JywgdmFsdWU6ICdmbGV4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZmxleC1kaXJlY3Rpb24nLCB2YWx1ZTogbm9kZS5sYXlvdXRNb2RlID09PSAnSE9SSVpPTlRBTCcgPyAncm93JyA6ICdjb2x1bW4nIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdqdXN0aWZ5LWNvbnRlbnQnLCB2YWx1ZToganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXNbbm9kZS5wcmltYXJ5QXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdhbGlnbi1pdGVtcycsIHZhbHVlOiBhbGlnbkl0ZW1zQ3NzVmFsdWVzW25vZGUuY291bnRlckF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdMZWZ0ICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0JvdHRvbSAmJiBub2RlLnBhZGRpbmdMZWZ0ID09PSBub2RlLnBhZGRpbmdSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nTGVmdCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdSaWdodCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdCb3R0b20gKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nTGVmdCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2dhcCcsIHZhbHVlOiBub2RlLml0ZW1TcGFjaW5nICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1hbGlnbicsIHZhbHVlOiB0ZXh0QWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25Ib3Jpem9udGFsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd2ZXJ0aWNhbC1hbGlnbicsIHZhbHVlOiB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnblZlcnRpY2FsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LXNpemUnLCB2YWx1ZTogbm9kZS5mb250U2l6ZSArIFwicHhcIiB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LWZhbWlseScsIHZhbHVlOiBub2RlLmZvbnROYW1lLmZhbWlseSB9KTtcbiAgICAgICAgICAgIHZhciBsZXR0ZXJTcGFjaW5nID0gbm9kZS5sZXR0ZXJTcGFjaW5nO1xuICAgICAgICAgICAgaWYgKGxldHRlclNwYWNpbmcudmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnbGV0dGVyLXNwYWNpbmcnLCB2YWx1ZTogbGV0dGVyU3BhY2luZy52YWx1ZSArIChsZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gJ3B4JyA6ICclJykgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaW5lLWhlaWdodCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5vZGUubGluZUhlaWdodC51bml0ID09PSAnQVVUTydcbiAgICAgICAgICAgICAgICAgICAgPyAnYXV0bydcbiAgICAgICAgICAgICAgICAgICAgOiBub2RlLmxpbmVIZWlnaHQudmFsdWUgKyAobm9kZS5sZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gJ3B4JyA6ICclJylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUudGV4dERlY29yYXRpb24gIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWRlY29yYXRpb24nLCB2YWx1ZTogdGV4dERlY29yYXRpb25Dc3NWYWx1ZXNbbm9kZS50ZXh0RGVjb3JhdGlvbl0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0xJTkUnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdHUk9VUCcgfHwgbm9kZS50eXBlID09PSAnRUxMSVBTRScgfHwgbm9kZS50eXBlID09PSAnUE9MWUdPTicgfHwgbm9kZS50eXBlID09PSAnU1RBUicpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGlzSW1hZ2UgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgICAgICB2YXIgY3NzRGF0YUZvck5vZGUgPSB7XG4gICAgICAgICAgICAvLyBuYW1lIFRleHQgbm9kZSBhcyBcIlRleHRcIiBzaW5jZSBuYW1lIG9mIHRleHQgbm9kZSBpcyBvZnRlbiB0aGUgY29udGVudCBvZiB0aGUgbm9kZSBhbmQgaXMgbm90IGFwcHJvcHJpYXRlIGFzIGEgbmFtZVxuICAgICAgICAgICAgY2xhc3NOYW1lOiBpc0ltYWdlID8gJ0ltZycgOiBub2RlLnR5cGUgPT09ICdURVhUJyA/ICdUZXh0JyA6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICAgICAgZGF0dW0ucHVzaChjc3NEYXRhRm9yTm9kZSk7XG4gICAgfVxuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUpIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgZXhwb3J0cy5leHRyYWN0Q3NzRGF0dW0oZGF0dW0sIGNoaWxkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkYXR1bTtcbn07XG5leHBvcnRzLmV4dHJhY3RDc3NEYXR1bSA9IGV4dHJhY3RDc3NEYXR1bTtcbmZ1bmN0aW9uIGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKSB7XG4gICAgaWYgKG5vZGUuY29ybmVyUmFkaXVzICE9PSAwKSB7XG4gICAgICAgIGlmIChub2RlLmNvcm5lclJhZGl1cyA9PT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLnRvcExlZnRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS50b3BSaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzICsgXCJweCBcIiArIG5vZGUuYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5jb3JuZXJSYWRpdXMgKyBcInB4XCI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmdiVmFsdWVUb0hleCh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogMjU1KS50b1N0cmluZygxNik7XG59XG5mdW5jdGlvbiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgaWYgKHBhaW50Lm9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBwYWludC5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuciAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmcgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5iICogMjU1KSArIFwiLCBcIiArIHBhaW50Lm9wYWNpdHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLnIpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5nKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuYik7XG4gICAgfVxuICAgIGlmIChwYWludC50eXBlID09PSAnR1JBRElFTlRfQU5HVUxBUicgfHwgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0RJQU1PTkQnIHx8IHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9MSU5FQVInIHx8IHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9SQURJQUwnKSB7XG4gICAgICAgIC8vIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNGMjBBMEEgMCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkgMTAwJSk7XG4gICAgICAgIC8vW1s2LjEyMzIzNDI2MjkyNTgzOWUtMTcsIDEsIDBdLCBbLTEsIDYuMTIzMjM0MjYyOTI1ODM5ZS0xNywgMV1dXG4gICAgICAgIC8vIFt7IFwiY29sb3JcIjogeyBcInJcIjogMC45NTAyOTU4NjU1MzU3MzYxLCBcImdcIjogMC4wMzg1MTU2MjczODQxODU3OSwgXCJiXCI6IDAuMDM4NTE1NjI3Mzg0MTg1NzksIFwiYVwiOiAxIH0sIFwicG9zaXRpb25cIjogMCB9LCB7IFwiY29sb3JcIjogeyBcInJcIjogMSwgXCJnXCI6IDEsIFwiYlwiOiAxLCBcImFcIjogMCB9LCBcInBvc2l0aW9uXCI6IDEgfV07XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYWludC5ncmFkaWVudFRyYW5zZm9ybSkgKyBKU09OLnN0cmluZ2lmeShwYWludC5ncmFkaWVudFN0b3BzKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENzc0RhdGFGb3JUYWcgPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIFNQQUNFX0JFVFdFRU46ICdzcGFjZS1iZXR3ZWVuJ1xufTtcbnZhciBhbGlnbkl0ZW1zQ3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInXG59O1xudmFyIHRleHRBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBMRUZUOiAnbGVmdCcsXG4gICAgUklHSFQ6ICdyaWdodCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBKVVNUSUZJRUQ6ICdqdXN0aWZ5J1xufTtcbnZhciB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBUT1A6ICd0b3AnLFxuICAgIENFTlRFUjogJ21pZGRsZScsXG4gICAgQk9UVE9NOiAnYm90dG9tJ1xufTtcbnZhciB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlcyA9IHtcbiAgICBVTkRFUkxJTkU6ICd1bmRlcmxpbmUnLFxuICAgIFNUUklMRVRIUk9VR0g6ICdsaW5lLXRocm91Z2gnXG59O1xudmFyIGdldENzc0RhdGFGb3JUYWcgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgd2l0aCBpbWcgdGFnXG4gICAgaWYgKG5vZGUudmlzaWJsZSAmJiBub2RlLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgIGlmICgnb3BhY2l0eScgaW4gbm9kZSAmJiBub2RlLm9wYWNpdHkgPCAxKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnb3BhY2l0eScsIHZhbHVlOiBub2RlLm9wYWNpdHkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUucm90YXRpb24gIT09IDApIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0cmFuc2Zvcm0nLCB2YWx1ZTogXCJyb3RhdGUoXCIgKyBNYXRoLmZsb29yKG5vZGUucm90YXRpb24pICsgXCJkZWcpXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZGlzcGxheScsIHZhbHVlOiAnZmxleCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZsZXgtZGlyZWN0aW9uJywgdmFsdWU6IG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnID8gJ3JvdycgOiAnY29sdW1uJyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnanVzdGlmeS1jb250ZW50JywgdmFsdWU6IGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzW25vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYWxpZ24taXRlbXMnLCB2YWx1ZTogYWxpZ25JdGVtc0Nzc1ZhbHVlc1tub2RlLmNvdW50ZXJBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nTGVmdCAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nTGVmdCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nUmlnaHQgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nQm90dG9tICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdnYXAnLCB2YWx1ZTogbm9kZS5pdGVtU3BhY2luZyArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtYWxpZ24nLCB2YWx1ZTogdGV4dEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduSG9yaXpvbnRhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndmVydGljYWwtYWxpZ24nLCB2YWx1ZTogdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25WZXJ0aWNhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1zaXplJywgdmFsdWU6IG5vZGUuZm9udFNpemUgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1mYW1pbHknLCB2YWx1ZTogbm9kZS5mb250TmFtZS5mYW1pbHkgfSk7XG4gICAgICAgICAgICB2YXIgbGV0dGVyU3BhY2luZyA9IG5vZGUubGV0dGVyU3BhY2luZztcbiAgICAgICAgICAgIGlmIChsZXR0ZXJTcGFjaW5nLnZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2xldHRlci1zcGFjaW5nJywgdmFsdWU6IGxldHRlclNwYWNpbmcudmFsdWUgKyAobGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGluZS1oZWlnaHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLmxpbmVIZWlnaHQudW5pdCA9PT0gJ0FVVE8nXG4gICAgICAgICAgICAgICAgICAgID8gJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIDogbm9kZS5saW5lSGVpZ2h0LnZhbHVlICsgKG5vZGUubGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnRleHREZWNvcmF0aW9uICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1kZWNvcmF0aW9uJywgdmFsdWU6IHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzW25vZGUudGV4dERlY29yYXRpb25dIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2NvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMSU5FJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnR1JPVVAnIHx8IG5vZGUudHlwZSA9PT0gJ0VMTElQU0UnIHx8IG5vZGUudHlwZSA9PT0gJ1BPTFlHT04nIHx8IG5vZGUudHlwZSA9PT0gJ1NUQVInKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpc0ltYWdlID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIG5hbWUgVGV4dCBub2RlIGFzIFwiVGV4dFwiIHNpbmNlIG5hbWUgb2YgdGV4dCBub2RlIGlzIG9mdGVuIHRoZSBjb250ZW50IG9mIHRoZSBub2RlIGFuZCBpcyBub3QgYXBwcm9wcmlhdGUgYXMgYSBuYW1lXG4gICAgICAgICAgICBjbGFzc05hbWU6IGlzSW1hZ2UgPyAnSW1nJyA6IG5vZGUudHlwZSA9PT0gJ1RFWFQnID8gJ1RleHQnIDogbm9kZS5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG5leHBvcnRzLmdldENzc0RhdGFGb3JUYWcgPSBnZXRDc3NEYXRhRm9yVGFnO1xuZnVuY3Rpb24gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpIHtcbiAgICBpZiAobm9kZS5jb3JuZXJSYWRpdXMgIT09IDApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlLmNvcm5lclJhZGl1cyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLnRvcExlZnRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS50b3BSaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzICsgXCJweCBcIiArIG5vZGUuYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5jb3JuZXJSYWRpdXMgKyBcInB4XCI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmdiVmFsdWVUb0hleCh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogMjU1KS50b1N0cmluZygxNik7XG59XG5mdW5jdGlvbiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgaWYgKHBhaW50Lm9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBwYWludC5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuciAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmcgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5iICogMjU1KSArIFwiLCBcIiArIHBhaW50Lm9wYWNpdHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLnIpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5nKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuYik7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0ltYWdlTm9kZSA9IHZvaWQgMDtcbnZhciBpc0ltYWdlTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgLy8g5LiL6YOo44GrIFZlY3RvciDjgZfjgYvlrZjlnKjjgZfjgarjgYTjgoLjga7jga/nlLvlg4/jgajliKTlrprjgZnjgotcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaGFzT25seVZlY3Rvcl8xID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgICAgICAgICAgaGFzT25seVZlY3Rvcl8xID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaGFzT25seVZlY3Rvcl8xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdWRUNUT1InKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScpIHtcbiAgICAgICAgaWYgKG5vZGUuZmlsbHMuZmluZChmdW5jdGlvbiAocGFpbnQpIHsgcmV0dXJuIHBhaW50LnR5cGUgPT09ICdJTUFHRSc7IH0pICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5leHBvcnRzLmlzSW1hZ2VOb2RlID0gaXNJbWFnZU5vZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMua2ViYWJpemUgPSB2b2lkIDA7XG52YXIga2ViYWJpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGxldHRlciwgaWR4KSB7XG4gICAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKSA9PT0gbGV0dGVyID8gXCJcIiArIChpZHggIT09IDAgPyAnLScgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKSA6IGxldHRlcjtcbiAgICB9KVxuICAgICAgICAuam9pbignJyk7XG59O1xuZXhwb3J0cy5rZWJhYml6ZSA9IGtlYmFiaXplO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb2RlLnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==