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
var modifyTreeForComponent_1 = __webpack_require__(/*! ./modifyTreeForComponent */ "./src/modifyTreeForComponent.ts");
var buildTagTree_1 = __webpack_require__(/*! ./buildTagTree */ "./src/buildTagTree.ts");
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
        return " className=\"" + stringUtils_1.kebabize(tag.name) + "\"";
    }
    return '';
};
var buildJsxString = function (tag, cssStyle, level) {
    var spaceString = buildSpaces(4, level);
    var hasChildren = tag.children.length > 0;
    var tagName = getTagName(tag, cssStyle);
    var className = getClassName(tag, cssStyle);
    var properties = tag.properties
        .map(function (prop) { return " " + prop.name + (prop.value !== null ? "=" + (prop.notStringValue ? '{' : '"') + prop.value + (prop.notStringValue ? '}' : '"') : ''); })
        .join('');
    var openingTag = spaceString + "<" + tagName + className + properties + (hasChildren || tag.isText ? "" : ' /') + ">";
    var childTags = hasChildren
        ? '\n' + tag.children.map(function (child) { return buildJsxString(child, cssStyle, level + 1); }).join('\n')
        : tag.isText
            ? "\n" + buildSpaces(4, level + 1) + tag.textCharacters
            : '';
    var closingTag = hasChildren || tag.isText ? "\n" + spaceString + "</" + tagName + ">" : '';
    return openingTag + childTags + closingTag;
};
var buildCode = function (node, css, _figma) {
    var tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(node), _figma);
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
        children: childTags,
        node: node
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
                    generatedCodeStr = buildCode_1.buildCode(node, _css, figma);
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
            return tag;
        }
    }
];
var modify = function (tag, _figma) {
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
};
var modifyTreeForComponent = function (tree, _figma) {
    var newTag = modify(tree, _figma);
    newTag.children.forEach(function (child, index) {
        newTag.children[index] = exports.modifyTreeForComponent(child, _figma);
    });
    return tree;
};
exports.modifyTreeForComponent = modifyTreeForComponent;


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

/***/ "./src/utils/stringUtils.ts":
/*!**********************************!*\
  !*** ./src/utils/stringUtils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kebabToUpperCamel = exports.capitalizeFirstLetter = exports.kebabize = void 0;
var kebabize = function (str) {
    return str
        .split('')
        .map(function (letter, idx) {
        return letter.toUpperCase() === letter ? "" + (idx !== 0 ? '-' : '') + letter.toLowerCase() : letter;
    })
        .join('');
};
exports.kebabize = kebabize;
var capitalizeFirstLetter = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function kebabToUpperCamel(str) {
    return exports.capitalizeFirstLetter(str.split(/-|_/g).map(exports.capitalizeFirstLetter).join(''));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkVGFnVHJlZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9leHRyYWN0Q1NTRGF0dW0udHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9nZXRDc3NEYXRhRm9yVGFnLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvbW9kaWZ5VHJlZUZvckNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL3V0aWxzL2lzSW1hZ2VOb2RlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvc3RyaW5nVXRpbHMudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsaUJBQWlCO0FBQ2pCLCtCQUErQixtQkFBTyxDQUFDLGlFQUEwQjtBQUNqRSxxQkFBcUIsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDN0Msb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDhCQUE4Qjs7Ozs7Ozs7Ozs7QUN4Q2pCO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsK0JBQStCLEVBQUU7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7Ozs7Ozs7Ozs7QUMxQk47QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsNkJBQTZCLEdBQUcsZ0JBQWdCO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOzs7Ozs7O1VDbkJ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkQ29kZSA9IHZvaWQgMDtcbnZhciBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9tb2RpZnlUcmVlRm9yQ29tcG9uZW50XCIpO1xudmFyIGJ1aWxkVGFnVHJlZV8xID0gcmVxdWlyZShcIi4vYnVpbGRUYWdUcmVlXCIpO1xudmFyIHN0cmluZ1V0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmdVdGlsc1wiKTtcbmZ1bmN0aW9uIGJ1aWxkU3BhY2VzKGJhc2VTcGFjZXMsIGxldmVsKSB7XG4gICAgdmFyIHNwYWNlc1N0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZVNwYWNlczsgaSsrKSB7XG4gICAgICAgIHNwYWNlc1N0ciArPSAnICc7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWw7IGkrKykge1xuICAgICAgICBzcGFjZXNTdHIgKz0gJyAgJztcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlc1N0cjtcbn1cbmZ1bmN0aW9uIGd1ZXNzVGFnTmFtZShuYW1lKSB7XG4gICAgdmFyIF9uYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnYnV0dG9uJykpIHtcbiAgICAgICAgcmV0dXJuICdidXR0b24nO1xuICAgIH1cbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ3NlY3Rpb24nKSkge1xuICAgICAgICByZXR1cm4gJ3NlY3Rpb24nO1xuICAgIH1cbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ2FydGljbGUnKSkge1xuICAgICAgICByZXR1cm4gJ2FydGljbGUnO1xuICAgIH1cbiAgICByZXR1cm4gJ2Rpdic7XG59XG52YXIgZ2V0VGFnTmFtZSA9IGZ1bmN0aW9uICh0YWcsIGNzc1N0eWxlKSB7XG4gICAgaWYgKGNzc1N0eWxlID09PSAnY3NzJykge1xuICAgICAgICBpZiAodGFnLmlzSW1nKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2ltZyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZy5pc1RleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAncCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGd1ZXNzVGFnTmFtZSh0YWcubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0YWcuaXNUZXh0ID8gJ1RleHQnIDogdGFnLm5hbWUucmVwbGFjZSgvXFxzL2csICcnKTtcbn07XG52YXIgZ2V0Q2xhc3NOYW1lID0gZnVuY3Rpb24gKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnKSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICcgY2xhc3NOYW1lPVwidGV4dFwiJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIgY2xhc3NOYW1lPVxcXCJcIiArIHN0cmluZ1V0aWxzXzEua2ViYWJpemUodGFnLm5hbWUpICsgXCJcXFwiXCI7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn07XG52YXIgYnVpbGRKc3hTdHJpbmcgPSBmdW5jdGlvbiAodGFnLCBjc3NTdHlsZSwgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VTdHJpbmcgPSBidWlsZFNwYWNlcyg0LCBsZXZlbCk7XG4gICAgdmFyIGhhc0NoaWxkcmVuID0gdGFnLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgdmFyIHRhZ05hbWUgPSBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpO1xuICAgIHZhciBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB0YWcucHJvcGVydGllc1xuICAgICAgICAubWFwKGZ1bmN0aW9uIChwcm9wKSB7IHJldHVybiBcIiBcIiArIHByb3AubmFtZSArIChwcm9wLnZhbHVlICE9PSBudWxsID8gXCI9XCIgKyAocHJvcC5ub3RTdHJpbmdWYWx1ZSA/ICd7JyA6ICdcIicpICsgcHJvcC52YWx1ZSArIChwcm9wLm5vdFN0cmluZ1ZhbHVlID8gJ30nIDogJ1wiJykgOiAnJyk7IH0pXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICB2YXIgb3BlbmluZ1RhZyA9IHNwYWNlU3RyaW5nICsgXCI8XCIgKyB0YWdOYW1lICsgY2xhc3NOYW1lICsgcHJvcGVydGllcyArIChoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gXCJcIiA6ICcgLycpICsgXCI+XCI7XG4gICAgdmFyIGNoaWxkVGFncyA9IGhhc0NoaWxkcmVuXG4gICAgICAgID8gJ1xcbicgKyB0YWcuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gYnVpbGRKc3hTdHJpbmcoY2hpbGQsIGNzc1N0eWxlLCBsZXZlbCArIDEpOyB9KS5qb2luKCdcXG4nKVxuICAgICAgICA6IHRhZy5pc1RleHRcbiAgICAgICAgICAgID8gXCJcXG5cIiArIGJ1aWxkU3BhY2VzKDQsIGxldmVsICsgMSkgKyB0YWcudGV4dENoYXJhY3RlcnNcbiAgICAgICAgICAgIDogJyc7XG4gICAgdmFyIGNsb3NpbmdUYWcgPSBoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gXCJcXG5cIiArIHNwYWNlU3RyaW5nICsgXCI8L1wiICsgdGFnTmFtZSArIFwiPlwiIDogJyc7XG4gICAgcmV0dXJuIG9wZW5pbmdUYWcgKyBjaGlsZFRhZ3MgKyBjbG9zaW5nVGFnO1xufTtcbnZhciBidWlsZENvZGUgPSBmdW5jdGlvbiAobm9kZSwgY3NzLCBfZmlnbWEpIHtcbiAgICB2YXIgdGFnID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xLm1vZGlmeVRyZWVGb3JDb21wb25lbnQoYnVpbGRUYWdUcmVlXzEuYnVpbGRUYWdUcmVlKG5vZGUpLCBfZmlnbWEpO1xuICAgIHJldHVybiBcImNvbnN0IFwiICsgdGFnLm5hbWUucmVwbGFjZSgvXFxzL2csICcnKSArIFwiOiBSZWFjdC5WRkMgPSAoKSA9PiB7XFxuICByZXR1cm4gKFxcblwiICsgYnVpbGRKc3hTdHJpbmcodGFnLCBjc3MsIDApICsgXCJcXG4gIClcXG59XCI7XG59O1xuZXhwb3J0cy5idWlsZENvZGUgPSBidWlsZENvZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRUYWdUcmVlID0gdm9pZCAwO1xudmFyIGdldENzc0RhdGFGb3JUYWdfMSA9IHJlcXVpcmUoXCIuL2dldENzc0RhdGFGb3JUYWdcIik7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGJ1aWxkVGFnVHJlZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKCFub2RlLnZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBpc0ltZyA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcbiAgICBpZiAoaXNJbWcpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3NyYycsIHZhbHVlOiAnJyB9KTtcbiAgICB9XG4gICAgdmFyIGNoaWxkVGFncyA9IFtdO1xuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgIWlzSW1nKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkVGFncy5wdXNoKGV4cG9ydHMuYnVpbGRUYWdUcmVlKGNoaWxkKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgdGFnID0ge1xuICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgIGlzVGV4dDogbm9kZS50eXBlID09PSAnVEVYVCcsXG4gICAgICAgIHRleHRDaGFyYWN0ZXJzOiBub2RlLnR5cGUgPT09ICdURVhUJyA/IG5vZGUuY2hhcmFjdGVycyA6IG51bGwsXG4gICAgICAgIGlzSW1nOiBpc0ltZyxcbiAgICAgICAgY3NzOiBnZXRDc3NEYXRhRm9yVGFnXzEuZ2V0Q3NzRGF0YUZvclRhZyhub2RlKSxcbiAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkVGFncyxcbiAgICAgICAgbm9kZTogbm9kZVxuICAgIH07XG4gICAgcmV0dXJuIHRhZztcbn07XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IGJ1aWxkVGFnVHJlZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBidWlsZENvZGVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkQ29kZVwiKTtcbnZhciBleHRyYWN0Q1NTRGF0dW1fMSA9IHJlcXVpcmUoXCIuL2V4dHJhY3RDU1NEYXR1bVwiKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDgwLCBoZWlnaHQ6IDQ0MCB9KTtcbnZhciBzZWxlY3RlZE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xudmFyIENTU19TVFlMRV9LRVkgPSAnQ1NTX1NUWUxFX0tFWSc7XG5mdW5jdGlvbiBnZW5lcmF0ZShub2RlLCBjc3NTdHlsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9jc3MsIGdlbmVyYXRlZENvZGVTdHIsIGNzc0RhdHVtO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY3NzID0gY3NzU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIV9jc3MpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKENTU19TVFlMRV9LRVkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9jc3MgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2Nzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NzcyA9ICdjc3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUobm9kZSwgX2NzcywgZmlnbWEpO1xuICAgICAgICAgICAgICAgICAgICBjc3NEYXR1bSA9IGV4dHJhY3RDU1NEYXR1bV8xLmV4dHJhY3RDc3NEYXR1bShbXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgZ2VuZXJhdGVkQ29kZVN0cjogZ2VuZXJhdGVkQ29kZVN0ciwgY3NzRGF0dW06IGNzc0RhdHVtLCBjc3NTdHlsZTogX2NzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3Qgb25seSAxIG5vZGUnKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZWxzZSBpZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3QgYSBub2RlJyk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbmVsc2Uge1xuICAgIGdlbmVyYXRlKHNlbGVjdGVkTm9kZXNbMF0pO1xufVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ25vdGlmeS1jb3B5LXN1Y2Nlc3MnKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnY29waWVkIHRvIGNsaXBib2FyZPCfkY0nKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnbmV3LWNzcy1zdHlsZS1zZXQnKSB7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoQ1NTX1NUWUxFX0tFWSwgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgdmFyIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUoc2VsZWN0ZWROb2Rlc1swXSwgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgdmFyIGNzc0RhdHVtID0gZXh0cmFjdENTU0RhdHVtXzEuZXh0cmFjdENzc0RhdHVtKFtdLCBzZWxlY3RlZE5vZGVzWzBdKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBnZW5lcmF0ZWRDb2RlU3RyOiBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NEYXR1bTogY3NzRGF0dW0gfSk7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0Q3NzRGF0dW0gPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIFNQQUNFX0JFVFdFRU46ICdzcGFjZS1iZXR3ZWVuJ1xufTtcbnZhciBhbGlnbkl0ZW1zQ3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInXG59O1xudmFyIHRleHRBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBMRUZUOiAnbGVmdCcsXG4gICAgUklHSFQ6ICdyaWdodCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBKVVNUSUZJRUQ6ICdqdXN0aWZ5J1xufTtcbnZhciB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBUT1A6ICd0b3AnLFxuICAgIENFTlRFUjogJ21pZGRsZScsXG4gICAgQk9UVE9NOiAnYm90dG9tJ1xufTtcbnZhciB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlcyA9IHtcbiAgICBVTkRFUkxJTkU6ICd1bmRlcmxpbmUnLFxuICAgIFNUUklMRVRIUk9VR0g6ICdsaW5lLXRocm91Z2gnXG59O1xudmFyIGV4dHJhY3RDc3NEYXR1bSA9IGZ1bmN0aW9uIChkYXR1bSwgbm9kZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgd2l0aCBpbWcgdGFnXG4gICAgaWYgKG5vZGUudmlzaWJsZSAmJiBub2RlLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgIGlmICgnb3BhY2l0eScgaW4gbm9kZSAmJiBub2RlLm9wYWNpdHkgPCAxKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnb3BhY2l0eScsIHZhbHVlOiBub2RlLm9wYWNpdHkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUucm90YXRpb24gIT09IDApIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0cmFuc2Zvcm0nLCB2YWx1ZTogXCJyb3RhdGUoXCIgKyBNYXRoLmZsb29yKG5vZGUucm90YXRpb24pICsgXCJkZWcpXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZGlzcGxheScsIHZhbHVlOiAnZmxleCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZsZXgtZGlyZWN0aW9uJywgdmFsdWU6IG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnID8gJ3JvdycgOiAnY29sdW1uJyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnanVzdGlmeS1jb250ZW50JywgdmFsdWU6IGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzW25vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYWxpZ24taXRlbXMnLCB2YWx1ZTogYWxpZ25JdGVtc0Nzc1ZhbHVlc1tub2RlLmNvdW50ZXJBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nTGVmdCAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nTGVmdCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nUmlnaHQgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nQm90dG9tICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdnYXAnLCB2YWx1ZTogbm9kZS5pdGVtU3BhY2luZyArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtYWxpZ24nLCB2YWx1ZTogdGV4dEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduSG9yaXpvbnRhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndmVydGljYWwtYWxpZ24nLCB2YWx1ZTogdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25WZXJ0aWNhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1zaXplJywgdmFsdWU6IG5vZGUuZm9udFNpemUgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1mYW1pbHknLCB2YWx1ZTogbm9kZS5mb250TmFtZS5mYW1pbHkgfSk7XG4gICAgICAgICAgICB2YXIgbGV0dGVyU3BhY2luZyA9IG5vZGUubGV0dGVyU3BhY2luZztcbiAgICAgICAgICAgIGlmIChsZXR0ZXJTcGFjaW5nLnZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2xldHRlci1zcGFjaW5nJywgdmFsdWU6IGxldHRlclNwYWNpbmcudmFsdWUgKyAobGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGluZS1oZWlnaHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLmxpbmVIZWlnaHQudW5pdCA9PT0gJ0FVVE8nXG4gICAgICAgICAgICAgICAgICAgID8gJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIDogbm9kZS5saW5lSGVpZ2h0LnZhbHVlICsgKG5vZGUubGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnRleHREZWNvcmF0aW9uICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1kZWNvcmF0aW9uJywgdmFsdWU6IHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzW25vZGUudGV4dERlY29yYXRpb25dIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2NvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMSU5FJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnR1JPVVAnIHx8IG5vZGUudHlwZSA9PT0gJ0VMTElQU0UnIHx8IG5vZGUudHlwZSA9PT0gJ1BPTFlHT04nIHx8IG5vZGUudHlwZSA9PT0gJ1NUQVInKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpc0ltYWdlID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICAgICAgdmFyIGNzc0RhdGFGb3JOb2RlID0ge1xuICAgICAgICAgICAgLy8gbmFtZSBUZXh0IG5vZGUgYXMgXCJUZXh0XCIgc2luY2UgbmFtZSBvZiB0ZXh0IG5vZGUgaXMgb2Z0ZW4gdGhlIGNvbnRlbnQgb2YgdGhlIG5vZGUgYW5kIGlzIG5vdCBhcHByb3ByaWF0ZSBhcyBhIG5hbWVcbiAgICAgICAgICAgIGNsYXNzTmFtZTogaXNJbWFnZSA/ICdJbWcnIDogbm9kZS50eXBlID09PSAnVEVYVCcgPyAnVGV4dCcgOiBub2RlLm5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgICAgIH07XG4gICAgICAgIGRhdHVtLnB1c2goY3NzRGF0YUZvck5vZGUpO1xuICAgIH1cbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZXh0cmFjdENzc0RhdHVtKGRhdHVtLCBjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGF0dW07XG59O1xuZXhwb3J0cy5leHRyYWN0Q3NzRGF0dW0gPSBleHRyYWN0Q3NzRGF0dW07XG5mdW5jdGlvbiBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSkge1xuICAgIGlmIChub2RlLmNvcm5lclJhZGl1cyAhPT0gMCkge1xuICAgICAgICBpZiAobm9kZS5jb3JuZXJSYWRpdXMgPT09IGZpZ21hLm1peGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS50b3BMZWZ0UmFkaXVzICsgXCJweCBcIiArIG5vZGUudG9wUmlnaHRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS5ib3R0b21SaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbUxlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuY29ybmVyUmFkaXVzICsgXCJweFwiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJnYlZhbHVlVG9IZXgodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuZnVuY3Rpb24gYnVpbGRDb2xvclN0cmluZyhwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGlmIChwYWludC5vcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgcGFpbnQub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLnIgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5nICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuYiAqIDI1NSkgKyBcIiwgXCIgKyBwYWludC5vcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5yKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuZykgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmIpO1xuICAgIH1cbiAgICBpZiAocGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0FOR1VMQVInIHx8IHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9ESUFNT05EJyB8fCBwYWludC50eXBlID09PSAnR1JBRElFTlRfTElORUFSJyB8fCBwYWludC50eXBlID09PSAnR1JBRElFTlRfUkFESUFMJykge1xuICAgICAgICAvLyBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjRjIwQTBBIDAlLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApIDEwMCUpO1xuICAgICAgICAvL1tbNi4xMjMyMzQyNjI5MjU4MzllLTE3LCAxLCAwXSwgWy0xLCA2LjEyMzIzNDI2MjkyNTgzOWUtMTcsIDFdXVxuICAgICAgICAvLyBbeyBcImNvbG9yXCI6IHsgXCJyXCI6IDAuOTUwMjk1ODY1NTM1NzM2MSwgXCJnXCI6IDAuMDM4NTE1NjI3Mzg0MTg1NzksIFwiYlwiOiAwLjAzODUxNTYyNzM4NDE4NTc5LCBcImFcIjogMSB9LCBcInBvc2l0aW9uXCI6IDAgfSwgeyBcImNvbG9yXCI6IHsgXCJyXCI6IDEsIFwiZ1wiOiAxLCBcImJcIjogMSwgXCJhXCI6IDAgfSwgXCJwb3NpdGlvblwiOiAxIH1dO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFpbnQuZ3JhZGllbnRUcmFuc2Zvcm0pICsgSlNPTi5zdHJpbmdpZnkocGFpbnQuZ3JhZGllbnRTdG9wcyk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gdm9pZCAwO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBqdXN0aWZ5Q29udGVudENzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBTUEFDRV9CRVRXRUVOOiAnc3BhY2UtYmV0d2Vlbidcbn07XG52YXIgYWxpZ25JdGVtc0Nzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJ1xufTtcbnZhciB0ZXh0QWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgSlVTVElGSUVEOiAnanVzdGlmeSdcbn07XG52YXIgdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgVE9QOiAndG9wJyxcbiAgICBDRU5URVI6ICdtaWRkbGUnLFxuICAgIEJPVFRPTTogJ2JvdHRvbSdcbn07XG52YXIgdGV4dERlY29yYXRpb25Dc3NWYWx1ZXMgPSB7XG4gICAgVU5ERVJMSU5FOiAndW5kZXJsaW5lJyxcbiAgICBTVFJJTEVUSFJPVUdIOiAnbGluZS10aHJvdWdoJ1xufTtcbnZhciBnZXRDc3NEYXRhRm9yVGFnID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgIC8vIHNraXAgdmVjdG9yIHNpbmNlIGl0J3Mgb2Z0ZW4gZGlzcGxheWVkIHdpdGggaW1nIHRhZ1xuICAgIGlmIChub2RlLnZpc2libGUgJiYgbm9kZS50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICBpZiAoJ29wYWNpdHknIGluIG5vZGUgJiYgbm9kZS5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ29wYWNpdHknLCB2YWx1ZTogbm9kZS5vcGFjaXR5IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnJvdGF0aW9uICE9PSAwKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndHJhbnNmb3JtJywgdmFsdWU6IFwicm90YXRlKFwiICsgTWF0aC5mbG9vcihub2RlLnJvdGF0aW9uKSArIFwiZGVnKVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2Rpc3BsYXknLCB2YWx1ZTogJ2ZsZXgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmbGV4LWRpcmVjdGlvbicsIHZhbHVlOiBub2RlLmxheW91dE1vZGUgPT09ICdIT1JJWk9OVEFMJyA/ICdyb3cnIDogJ2NvbHVtbicgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2p1c3RpZnktY29udGVudCcsIHZhbHVlOiBqdXN0aWZ5Q29udGVudENzc1ZhbHVlc1tub2RlLnByaW1hcnlBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2FsaWduLWl0ZW1zJywgdmFsdWU6IGFsaWduSXRlbXNDc3NWYWx1ZXNbbm9kZS5jb3VudGVyQXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0JvdHRvbSAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0xlZnQgJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ0xlZnQgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdMZWZ0ICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ1JpZ2h0ICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0JvdHRvbSArIFwicHggXCIgKyBub2RlLnBhZGRpbmdMZWZ0ICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZ2FwJywgdmFsdWU6IG5vZGUuaXRlbVNwYWNpbmcgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWFsaWduJywgdmFsdWU6IHRleHRBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnbkhvcml6b250YWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3ZlcnRpY2FsLWFsaWduJywgdmFsdWU6IHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduVmVydGljYWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtc2l6ZScsIHZhbHVlOiBub2RlLmZvbnRTaXplICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtZmFtaWx5JywgdmFsdWU6IG5vZGUuZm9udE5hbWUuZmFtaWx5IH0pO1xuICAgICAgICAgICAgdmFyIGxldHRlclNwYWNpbmcgPSBub2RlLmxldHRlclNwYWNpbmc7XG4gICAgICAgICAgICBpZiAobGV0dGVyU3BhY2luZy52YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdsZXR0ZXItc3BhY2luZycsIHZhbHVlOiBsZXR0ZXJTcGFjaW5nLnZhbHVlICsgKGxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUycgPyAncHgnIDogJyUnKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2xpbmUtaGVpZ2h0JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbm9kZS5saW5lSGVpZ2h0LnVuaXQgPT09ICdBVVRPJ1xuICAgICAgICAgICAgICAgICAgICA/ICdhdXRvJ1xuICAgICAgICAgICAgICAgICAgICA6IG5vZGUubGluZUhlaWdodC52YWx1ZSArIChub2RlLmxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUycgPyAncHgnIDogJyUnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS50ZXh0RGVjb3JhdGlvbiAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtZGVjb3JhdGlvbicsIHZhbHVlOiB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlc1tub2RlLnRleHREZWNvcmF0aW9uXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdjb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnTElORScpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0dST1VQJyB8fCBub2RlLnR5cGUgPT09ICdFTExJUFNFJyB8fCBub2RlLnR5cGUgPT09ICdQT0xZR09OJyB8fCBub2RlLnR5cGUgPT09ICdTVEFSJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaXNJbWFnZSA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBuYW1lIFRleHQgbm9kZSBhcyBcIlRleHRcIiBzaW5jZSBuYW1lIG9mIHRleHQgbm9kZSBpcyBvZnRlbiB0aGUgY29udGVudCBvZiB0aGUgbm9kZSBhbmQgaXMgbm90IGFwcHJvcHJpYXRlIGFzIGEgbmFtZVxuICAgICAgICAgICAgY2xhc3NOYW1lOiBpc0ltYWdlID8gJ0ltZycgOiBub2RlLnR5cGUgPT09ICdURVhUJyA/ICdUZXh0JyA6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gZ2V0Q3NzRGF0YUZvclRhZztcbmZ1bmN0aW9uIGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKSB7XG4gICAgaWYgKG5vZGUuY29ybmVyUmFkaXVzICE9PSAwKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygbm9kZS5jb3JuZXJSYWRpdXMgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS50b3BMZWZ0UmFkaXVzICsgXCJweCBcIiArIG5vZGUudG9wUmlnaHRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS5ib3R0b21SaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbUxlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuY29ybmVyUmFkaXVzICsgXCJweFwiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJnYlZhbHVlVG9IZXgodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuZnVuY3Rpb24gYnVpbGRDb2xvclN0cmluZyhwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGlmIChwYWludC5vcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgcGFpbnQub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLnIgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5nICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuYiAqIDI1NSkgKyBcIiwgXCIgKyBwYWludC5vcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5yKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuZykgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmIpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IHZvaWQgMDtcbnZhciBjb21wb25lbnRzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ1NwYWNlcicsXG4gICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSAnU3BhY2VyJyAmJiAoISgnY2hpbGRyZW4nIGluIG5vZGUpIHx8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgbW9kaWZ5RnVuYzogZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZy5ub2RlLndpZHRoID4gdGFnLm5vZGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGFnLnByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogdGFnLm5vZGUuaGVpZ2h0LnRvU3RyaW5nKCksIG5vdFN0cmluZ1ZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFnLnByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiB0YWcubm9kZS53aWR0aC50b1N0cmluZygpLCBub3RTdHJpbmdWYWx1ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgIH1cbiAgICB9XG5dO1xudmFyIG1vZGlmeSA9IGZ1bmN0aW9uICh0YWcsIF9maWdtYSkge1xuICAgIGlmICghdGFnIHx8ICF0YWcubm9kZSkge1xuICAgICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgICB2YXIgbW9kaWZpZWRPbmNlID0gZmFsc2U7XG4gICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZXR0aW5nKSB7XG4gICAgICAgIGlmICghbW9kaWZpZWRPbmNlICYmIHNldHRpbmcubWF0Y2hlcih0YWcubm9kZSkpIHtcbiAgICAgICAgICAgIHRhZyA9IHNldHRpbmcubW9kaWZ5RnVuYyh0YWcsIF9maWdtYSk7XG4gICAgICAgICAgICBtb2RpZmllZE9uY2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhZztcbn07XG52YXIgbW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IGZ1bmN0aW9uICh0cmVlLCBfZmlnbWEpIHtcbiAgICB2YXIgbmV3VGFnID0gbW9kaWZ5KHRyZWUsIF9maWdtYSk7XG4gICAgbmV3VGFnLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpbmRleCkge1xuICAgICAgICBuZXdUYWcuY2hpbGRyZW5baW5kZXhdID0gZXhwb3J0cy5tb2RpZnlUcmVlRm9yQ29tcG9uZW50KGNoaWxkLCBfZmlnbWEpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cmVlO1xufTtcbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIOS4i+mDqOOBqyBWZWN0b3Ig44GX44GL5a2Y5Zyo44GX44Gq44GE44KC44Gu44Gv55S75YOP44Go5Yik5a6a44GZ44KLXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGhhc09ubHlWZWN0b3JfMSA9IHRydWU7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICAgICAgICAgIGhhc09ubHlWZWN0b3JfMSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGhhc09ubHlWZWN0b3JfMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVkVDVE9SJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgIGlmIChub2RlLmZpbGxzLmZpbmQoZnVuY3Rpb24gKHBhaW50KSB7IHJldHVybiBwYWludC50eXBlID09PSAnSU1BR0UnOyB9KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuZXhwb3J0cy5pc0ltYWdlTm9kZSA9IGlzSW1hZ2VOb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmtlYmFiVG9VcHBlckNhbWVsID0gZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBleHBvcnRzLmtlYmFiaXplID0gdm9pZCAwO1xudmFyIGtlYmFiaXplID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsZXR0ZXIsIGlkeCkge1xuICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCkgPT09IGxldHRlciA/IFwiXCIgKyAoaWR4ICE9PSAwID8gJy0nIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJycpO1xufTtcbmV4cG9ydHMua2ViYWJpemUgPSBrZWJhYml6ZTtcbnZhciBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn07XG5leHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlciA9IGNhcGl0YWxpemVGaXJzdExldHRlcjtcbmZ1bmN0aW9uIGtlYmFiVG9VcHBlckNhbWVsKHN0cikge1xuICAgIHJldHVybiBleHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlcihzdHIuc3BsaXQoLy18Xy9nKS5tYXAoZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIpLmpvaW4oJycpKTtcbn1cbmV4cG9ydHMua2ViYWJUb1VwcGVyQ2FtZWwgPSBrZWJhYlRvVXBwZXJDYW1lbDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=