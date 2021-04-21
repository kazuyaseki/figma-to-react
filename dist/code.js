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
var getTagName = function (tag, cssStyle) {
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
};
var getClassName = function (tag, cssStyle) {
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
var buildCode = function (tag, css) {
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
var modifyTreeForComponent_1 = __webpack_require__(/*! ./modifyTreeForComponent */ "./src/modifyTreeForComponent.ts");
var buildCode_1 = __webpack_require__(/*! ./buildCode */ "./src/buildCode.ts");
var extractCSSDatum_1 = __webpack_require__(/*! ./extractCSSDatum */ "./src/extractCSSDatum.ts");
var buildTagTree_1 = __webpack_require__(/*! ./buildTagTree */ "./src/buildTagTree.ts");
figma.showUI(__html__, { width: 480, height: 440 });
var selectedNodes = figma.currentPage.selection;
var CSS_STYLE_KEY = 'CSS_STYLE_KEY';
function generate(node, cssStyle) {
    return __awaiter(this, void 0, void 0, function () {
        var _css, tag, generatedCodeStr, cssDatum;
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
                    tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(node), figma);
                    generatedCodeStr = buildCode_1.buildCode(tag, _css);
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
        var tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(selectedNodes[0]), figma);
        var generatedCodeStr = buildCode_1.buildCode(tag, msg.cssStyle);
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
            tag.isComponent = true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkVGFnVHJlZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9leHRyYWN0Q1NTRGF0dW0udHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9nZXRDc3NEYXRhRm9yVGFnLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvbW9kaWZ5VHJlZUZvckNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL3V0aWxzL2lzSW1hZ2VOb2RlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvc3RyaW5nVXRpbHMudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsaUJBQWlCO0FBQ2pCLG9CQUFvQixtQkFBTyxDQUFDLHVEQUFxQjtBQUNqRDtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixnRkFBZ0YsaURBQWlELGVBQWUsRUFBRTtBQUNoTDtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsbURBQW1ELEVBQUU7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUseURBQXlEO0FBQ25JO0FBQ0EsaUJBQWlCOzs7Ozs7Ozs7OztBQ3ZFSjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxvQkFBb0I7QUFDcEIseUJBQXlCLG1CQUFPLENBQUMscURBQW9CO0FBQ3JELG9CQUFvQixtQkFBTyxDQUFDLHVEQUFxQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7Ozs7Ozs7QUNoQ1A7QUFDYjtBQUNBLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQWEsNkJBQTZCLDBCQUEwQixhQUFhLEVBQUUscUJBQXFCO0FBQ3hHLGdCQUFnQixxREFBcUQsb0VBQW9FLGFBQWEsRUFBRTtBQUN4SixzQkFBc0Isc0JBQXNCLHFCQUFxQixHQUFHO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QyxrQ0FBa0MsU0FBUztBQUMzQyxrQ0FBa0MsV0FBVyxVQUFVO0FBQ3ZELHlDQUF5QyxjQUFjO0FBQ3ZEO0FBQ0EsNkdBQTZHLE9BQU8sVUFBVTtBQUM5SCxnRkFBZ0YsaUJBQWlCLE9BQU87QUFDeEcsd0RBQXdELGdCQUFnQixRQUFRLE9BQU87QUFDdkYsOENBQThDLGdCQUFnQixnQkFBZ0IsT0FBTztBQUNyRjtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EsU0FBUyxZQUFZLGFBQWEsT0FBTyxFQUFFLFVBQVUsV0FBVztBQUNoRSxtQ0FBbUMsU0FBUztBQUM1QztBQUNBO0FBQ0EsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELCtCQUErQixtQkFBTyxDQUFDLGlFQUEwQjtBQUNqRSxrQkFBa0IsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN2Qyx3QkFBd0IsbUJBQU8sQ0FBQyxtREFBbUI7QUFDbkQscUJBQXFCLG1CQUFPLENBQUMsNkNBQWdCO0FBQzdDLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLHlFQUF5RTtBQUNuSDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIseURBQXlEO0FBQ3ZGO0FBQ0E7Ozs7Ozs7Ozs7O0FDNUZhO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHVCQUF1QjtBQUN2QixvQkFBb0IsbUJBQU8sQ0FBQyx1REFBcUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsdUNBQXVDO0FBQ3BFO0FBQ0E7QUFDQSw2QkFBNkIsMkVBQTJFO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGtEQUFrRDtBQUNuRjtBQUNBO0FBQ0EsaUNBQWlDLGlDQUFpQztBQUNsRSxpQ0FBaUMscUZBQXFGO0FBQ3RILGlDQUFpQyxzRkFBc0Y7QUFDdkgsaUNBQWlDLDhFQUE4RTtBQUMvRztBQUNBLHFDQUFxQyxpREFBaUQ7QUFDdEY7QUFDQTtBQUNBLHFDQUFxQyw0RUFBNEU7QUFDakg7QUFDQTtBQUNBLHFDQUFxQyxxSUFBcUk7QUFDMUs7QUFDQSxpQ0FBaUMsOENBQThDO0FBQy9FO0FBQ0E7QUFDQSxpQ0FBaUMsd0RBQXdEO0FBQ3pGLGlDQUFpQyxzREFBc0Q7QUFDdkY7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDJEQUEyRDtBQUM1RjtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsbUZBQW1GO0FBQ3BIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsa0RBQWtEO0FBQ25GO0FBQ0EsNkJBQTZCLHdEQUF3RDtBQUNyRiw2QkFBNkIsc0RBQXNEO0FBQ25GO0FBQ0E7QUFDQSxpQ0FBaUMsMkRBQTJEO0FBQzVGO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxtRkFBbUY7QUFDcEg7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLDBFQUEwRTtBQUN2Ryw2QkFBNkIsb0ZBQW9GO0FBQ2pILDZCQUE2QixpREFBaUQ7QUFDOUUsNkJBQTZCLG1EQUFtRDtBQUNoRjtBQUNBO0FBQ0EsaUNBQWlDLHNHQUFzRztBQUN2STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxpQ0FBaUMsK0VBQStFO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxnREFBZ0Q7QUFDakY7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHdEQUF3RDtBQUNyRiw2QkFBNkIsc0RBQXNEO0FBQ25GO0FBQ0E7QUFDQSxpQ0FBaUMsbUZBQW1GO0FBQ3BIO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix3REFBd0Q7QUFDckYsNkJBQTZCLHNEQUFzRDtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsV0FBVyxzRkFBc0YsaUJBQWlCLEdBQUcsV0FBVyxpQ0FBaUMsaUJBQWlCO0FBQy9MO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3pLYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCx3QkFBd0I7QUFDeEIsb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHVDQUF1QztBQUNwRTtBQUNBO0FBQ0EsNkJBQTZCLDJFQUEyRTtBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxrREFBa0Q7QUFDbkY7QUFDQTtBQUNBLGlDQUFpQyxpQ0FBaUM7QUFDbEUsaUNBQWlDLHFGQUFxRjtBQUN0SCxpQ0FBaUMsc0ZBQXNGO0FBQ3ZILGlDQUFpQyw4RUFBOEU7QUFDL0c7QUFDQSxxQ0FBcUMsaURBQWlEO0FBQ3RGO0FBQ0E7QUFDQSxxQ0FBcUMsNEVBQTRFO0FBQ2pIO0FBQ0E7QUFDQSxxQ0FBcUMscUlBQXFJO0FBQzFLO0FBQ0EsaUNBQWlDLDhDQUE4QztBQUMvRTtBQUNBO0FBQ0EsaUNBQWlDLHdEQUF3RDtBQUN6RixpQ0FBaUMsc0RBQXNEO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywyREFBMkQ7QUFDNUY7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG1GQUFtRjtBQUNwSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGtEQUFrRDtBQUNuRjtBQUNBLDZCQUE2Qix3REFBd0Q7QUFDckYsNkJBQTZCLHNEQUFzRDtBQUNuRjtBQUNBO0FBQ0EsaUNBQWlDLDJEQUEyRDtBQUM1RjtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsbUZBQW1GO0FBQ3BIO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QiwwRUFBMEU7QUFDdkcsNkJBQTZCLG9GQUFvRjtBQUNqSCw2QkFBNkIsaURBQWlEO0FBQzlFLDZCQUE2QixtREFBbUQ7QUFDaEY7QUFDQTtBQUNBLGlDQUFpQyxzR0FBc0c7QUFDdkk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsaUNBQWlDLCtFQUErRTtBQUNoSDtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsZ0RBQWdEO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix3REFBd0Q7QUFDckYsNkJBQTZCLHNEQUFzRDtBQUNuRjtBQUNBO0FBQ0EsaUNBQWlDLG1GQUFtRjtBQUNwSDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsd0RBQXdEO0FBQ3JGLDZCQUE2QixzREFBc0Q7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM3SmE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLHFDQUFxQywwRUFBMEU7QUFDL0c7QUFDQTtBQUNBLHFDQUFxQyx3RUFBd0U7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSw4QkFBOEI7Ozs7Ozs7Ozs7O0FDekNqQjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLCtCQUErQixFQUFFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDMUJOO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHlCQUF5QixHQUFHLDZCQUE2QixHQUFHLGdCQUFnQjtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7Ozs7OztVQ25CekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZENvZGUgPSB2b2lkIDA7XG52YXIgc3RyaW5nVXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZ1V0aWxzXCIpO1xuZnVuY3Rpb24gYnVpbGRTcGFjZXMoYmFzZVNwYWNlcywgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VzU3RyID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlU3BhY2VzOyBpKyspIHtcbiAgICAgICAgc3BhY2VzU3RyICs9ICcgJztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbDsgaSsrKSB7XG4gICAgICAgIHNwYWNlc1N0ciArPSAnICAnO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2VzU3RyO1xufVxuZnVuY3Rpb24gZ3Vlc3NUYWdOYW1lKG5hbWUpIHtcbiAgICB2YXIgX25hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdidXR0b24nKSkge1xuICAgICAgICByZXR1cm4gJ2J1dHRvbic7XG4gICAgfVxuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnc2VjdGlvbicpKSB7XG4gICAgICAgIHJldHVybiAnc2VjdGlvbic7XG4gICAgfVxuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnYXJ0aWNsZScpKSB7XG4gICAgICAgIHJldHVybiAnYXJ0aWNsZSc7XG4gICAgfVxuICAgIHJldHVybiAnZGl2Jztcbn1cbnZhciBnZXRUYWdOYW1lID0gZnVuY3Rpb24gKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnICYmICF0YWcuaXNDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICdpbWcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ3AnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBndWVzc1RhZ05hbWUodGFnLm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGFnLmlzVGV4dCA/ICdUZXh0JyA6IHRhZy5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJyk7XG59O1xudmFyIGdldENsYXNzTmFtZSA9IGZ1bmN0aW9uICh0YWcsIGNzc1N0eWxlKSB7XG4gICAgaWYgKGNzc1N0eWxlID09PSAnY3NzJyAmJiAhdGFnLmlzQ29tcG9uZW50KSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICcgY2xhc3NOYW1lPVwidGV4dFwiJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIgY2xhc3NOYW1lPVxcXCJcIiArIHN0cmluZ1V0aWxzXzEua2ViYWJpemUodGFnLm5hbWUpICsgXCJcXFwiXCI7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn07XG52YXIgYnVpbGRKc3hTdHJpbmcgPSBmdW5jdGlvbiAodGFnLCBjc3NTdHlsZSwgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VTdHJpbmcgPSBidWlsZFNwYWNlcyg0LCBsZXZlbCk7XG4gICAgdmFyIGhhc0NoaWxkcmVuID0gdGFnLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgdmFyIHRhZ05hbWUgPSBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpO1xuICAgIHZhciBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB0YWcucHJvcGVydGllc1xuICAgICAgICAubWFwKGZ1bmN0aW9uIChwcm9wKSB7IHJldHVybiBcIiBcIiArIHByb3AubmFtZSArIChwcm9wLnZhbHVlICE9PSBudWxsID8gXCI9XCIgKyAocHJvcC5ub3RTdHJpbmdWYWx1ZSA/ICd7JyA6ICdcIicpICsgcHJvcC52YWx1ZSArIChwcm9wLm5vdFN0cmluZ1ZhbHVlID8gJ30nIDogJ1wiJykgOiAnJyk7IH0pXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICB2YXIgb3BlbmluZ1RhZyA9IHNwYWNlU3RyaW5nICsgXCI8XCIgKyB0YWdOYW1lICsgY2xhc3NOYW1lICsgcHJvcGVydGllcyArIChoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gXCJcIiA6ICcgLycpICsgXCI+XCI7XG4gICAgdmFyIGNoaWxkVGFncyA9IGhhc0NoaWxkcmVuXG4gICAgICAgID8gJ1xcbicgKyB0YWcuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gYnVpbGRKc3hTdHJpbmcoY2hpbGQsIGNzc1N0eWxlLCBsZXZlbCArIDEpOyB9KS5qb2luKCdcXG4nKVxuICAgICAgICA6IHRhZy5pc1RleHRcbiAgICAgICAgICAgID8gXCJcXG5cIiArIGJ1aWxkU3BhY2VzKDQsIGxldmVsICsgMSkgKyB0YWcudGV4dENoYXJhY3RlcnNcbiAgICAgICAgICAgIDogJyc7XG4gICAgdmFyIGNsb3NpbmdUYWcgPSBoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gXCJcXG5cIiArIHNwYWNlU3RyaW5nICsgXCI8L1wiICsgdGFnTmFtZSArIFwiPlwiIDogJyc7XG4gICAgcmV0dXJuIG9wZW5pbmdUYWcgKyBjaGlsZFRhZ3MgKyBjbG9zaW5nVGFnO1xufTtcbnZhciBidWlsZENvZGUgPSBmdW5jdGlvbiAodGFnLCBjc3MpIHtcbiAgICByZXR1cm4gXCJjb25zdCBcIiArIHRhZy5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJykgKyBcIjogUmVhY3QuVkZDID0gKCkgPT4ge1xcbiAgcmV0dXJuIChcXG5cIiArIGJ1aWxkSnN4U3RyaW5nKHRhZywgY3NzLCAwKSArIFwiXFxuICApXFxufVwiO1xufTtcbmV4cG9ydHMuYnVpbGRDb2RlID0gYnVpbGRDb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IHZvaWQgMDtcbnZhciBnZXRDc3NEYXRhRm9yVGFnXzEgPSByZXF1aXJlKFwiLi9nZXRDc3NEYXRhRm9yVGFnXCIpO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBidWlsZFRhZ1RyZWUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmICghbm9kZS52aXNpYmxlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgaXNJbWcgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgaWYgKGlzSW1nKSB7XG4gICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdzcmMnLCB2YWx1ZTogJycgfSk7XG4gICAgfVxuICAgIHZhciBjaGlsZFRhZ3MgPSBbXTtcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmICFpc0ltZykge1xuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBjaGlsZFRhZ3MucHVzaChleHBvcnRzLmJ1aWxkVGFnVHJlZShjaGlsZCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHRhZyA9IHtcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICBpc1RleHQ6IG5vZGUudHlwZSA9PT0gJ1RFWFQnLFxuICAgICAgICB0ZXh0Q2hhcmFjdGVyczogbm9kZS50eXBlID09PSAnVEVYVCcgPyBub2RlLmNoYXJhY3RlcnMgOiBudWxsLFxuICAgICAgICBpc0ltZzogaXNJbWcsXG4gICAgICAgIGNzczogZ2V0Q3NzRGF0YUZvclRhZ18xLmdldENzc0RhdGFGb3JUYWcobm9kZSksXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZFRhZ3MsXG4gICAgICAgIG5vZGU6IG5vZGVcbiAgICB9O1xuICAgIHJldHVybiB0YWc7XG59O1xuZXhwb3J0cy5idWlsZFRhZ1RyZWUgPSBidWlsZFRhZ1RyZWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vbW9kaWZ5VHJlZUZvckNvbXBvbmVudFwiKTtcbnZhciBidWlsZENvZGVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkQ29kZVwiKTtcbnZhciBleHRyYWN0Q1NTRGF0dW1fMSA9IHJlcXVpcmUoXCIuL2V4dHJhY3RDU1NEYXR1bVwiKTtcbnZhciBidWlsZFRhZ1RyZWVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkVGFnVHJlZVwiKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDgwLCBoZWlnaHQ6IDQ0MCB9KTtcbnZhciBzZWxlY3RlZE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xudmFyIENTU19TVFlMRV9LRVkgPSAnQ1NTX1NUWUxFX0tFWSc7XG5mdW5jdGlvbiBnZW5lcmF0ZShub2RlLCBjc3NTdHlsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9jc3MsIHRhZywgZ2VuZXJhdGVkQ29kZVN0ciwgY3NzRGF0dW07XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jc3MgPSBjc3NTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhX2NzcykgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoQ1NTX1NUWUxFX0tFWSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgX2NzcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3NzID0gJ2Nzcyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xLm1vZGlmeVRyZWVGb3JDb21wb25lbnQoYnVpbGRUYWdUcmVlXzEuYnVpbGRUYWdUcmVlKG5vZGUpLCBmaWdtYSk7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUodGFnLCBfY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgY3NzRGF0dW0gPSBleHRyYWN0Q1NTRGF0dW1fMS5leHRyYWN0Q3NzRGF0dW0oW10sIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGdlbmVyYXRlZENvZGVTdHI6IGdlbmVyYXRlZENvZGVTdHIsIGNzc0RhdHVtOiBjc3NEYXR1bSwgY3NzU3R5bGU6IF9jc3MgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5pZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IG9ubHkgMSBub2RlJyk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbmVsc2UgaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IGEgbm9kZScpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5lbHNlIHtcbiAgICBnZW5lcmF0ZShzZWxlY3RlZE5vZGVzWzBdKTtcbn1cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdub3RpZnktY29weS1zdWNjZXNzJykge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ2NvcGllZCB0byBjbGlwYm9hcmTwn5GNJyk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ25ldy1jc3Mtc3R5bGUtc2V0Jykge1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKENTU19TVFlMRV9LRVksIG1zZy5jc3NTdHlsZSk7XG4gICAgICAgIHZhciB0YWcgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEubW9kaWZ5VHJlZUZvckNvbXBvbmVudChidWlsZFRhZ1RyZWVfMS5idWlsZFRhZ1RyZWUoc2VsZWN0ZWROb2Rlc1swXSksIGZpZ21hKTtcbiAgICAgICAgdmFyIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUodGFnLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICB2YXIgY3NzRGF0dW0gPSBleHRyYWN0Q1NTRGF0dW1fMS5leHRyYWN0Q3NzRGF0dW0oW10sIHNlbGVjdGVkTm9kZXNbMF0pO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGdlbmVyYXRlZENvZGVTdHI6IGdlbmVyYXRlZENvZGVTdHIsIGNzc0RhdHVtOiBjc3NEYXR1bSB9KTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4dHJhY3RDc3NEYXR1bSA9IHZvaWQgMDtcbnZhciBpc0ltYWdlTm9kZV8xID0gcmVxdWlyZShcIi4vdXRpbHMvaXNJbWFnZU5vZGVcIik7XG52YXIganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXMgPSB7XG4gICAgTUlOOiAnZmxleC1zdGFydCcsXG4gICAgTUFYOiAnZmxleC1lbmQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgU1BBQ0VfQkVUV0VFTjogJ3NwYWNlLWJldHdlZW4nXG59O1xudmFyIGFsaWduSXRlbXNDc3NWYWx1ZXMgPSB7XG4gICAgTUlOOiAnZmxleC1zdGFydCcsXG4gICAgTUFYOiAnZmxleC1lbmQnLFxuICAgIENFTlRFUjogJ2NlbnRlcidcbn07XG52YXIgdGV4dEFsaWduQ3NzVmFsdWVzID0ge1xuICAgIExFRlQ6ICdsZWZ0JyxcbiAgICBSSUdIVDogJ3JpZ2h0JyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIEpVU1RJRklFRDogJ2p1c3RpZnknXG59O1xudmFyIHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzID0ge1xuICAgIFRPUDogJ3RvcCcsXG4gICAgQ0VOVEVSOiAnbWlkZGxlJyxcbiAgICBCT1RUT006ICdib3R0b20nXG59O1xudmFyIHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzID0ge1xuICAgIFVOREVSTElORTogJ3VuZGVybGluZScsXG4gICAgU1RSSUxFVEhST1VHSDogJ2xpbmUtdGhyb3VnaCdcbn07XG52YXIgZXh0cmFjdENzc0RhdHVtID0gZnVuY3Rpb24gKGRhdHVtLCBub2RlKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcbiAgICAvLyBza2lwIHZlY3RvciBzaW5jZSBpdCdzIG9mdGVuIGRpc3BsYXllZCB3aXRoIGltZyB0YWdcbiAgICBpZiAobm9kZS52aXNpYmxlICYmIG5vZGUudHlwZSAhPT0gJ1ZFQ1RPUicpIHtcbiAgICAgICAgaWYgKCdvcGFjaXR5JyBpbiBub2RlICYmIG5vZGUub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdvcGFjaXR5JywgdmFsdWU6IG5vZGUub3BhY2l0eSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5yb3RhdGlvbiAhPT0gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RyYW5zZm9ybScsIHZhbHVlOiBcInJvdGF0ZShcIiArIE1hdGguZmxvb3Iobm9kZS5yb3RhdGlvbikgKyBcImRlZylcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fCBub2RlLnR5cGUgPT09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdkaXNwbGF5JywgdmFsdWU6ICdmbGV4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZmxleC1kaXJlY3Rpb24nLCB2YWx1ZTogbm9kZS5sYXlvdXRNb2RlID09PSAnSE9SSVpPTlRBTCcgPyAncm93JyA6ICdjb2x1bW4nIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdqdXN0aWZ5LWNvbnRlbnQnLCB2YWx1ZToganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXNbbm9kZS5wcmltYXJ5QXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdhbGlnbi1pdGVtcycsIHZhbHVlOiBhbGlnbkl0ZW1zQ3NzVmFsdWVzW25vZGUuY291bnRlckF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdMZWZ0ICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0JvdHRvbSAmJiBub2RlLnBhZGRpbmdMZWZ0ID09PSBub2RlLnBhZGRpbmdSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nTGVmdCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdSaWdodCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdCb3R0b20gKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nTGVmdCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2dhcCcsIHZhbHVlOiBub2RlLml0ZW1TcGFjaW5nICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1hbGlnbicsIHZhbHVlOiB0ZXh0QWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25Ib3Jpem9udGFsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd2ZXJ0aWNhbC1hbGlnbicsIHZhbHVlOiB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnblZlcnRpY2FsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LXNpemUnLCB2YWx1ZTogbm9kZS5mb250U2l6ZSArIFwicHhcIiB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LWZhbWlseScsIHZhbHVlOiBub2RlLmZvbnROYW1lLmZhbWlseSB9KTtcbiAgICAgICAgICAgIHZhciBsZXR0ZXJTcGFjaW5nID0gbm9kZS5sZXR0ZXJTcGFjaW5nO1xuICAgICAgICAgICAgaWYgKGxldHRlclNwYWNpbmcudmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnbGV0dGVyLXNwYWNpbmcnLCB2YWx1ZTogbGV0dGVyU3BhY2luZy52YWx1ZSArIChsZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gJ3B4JyA6ICclJykgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaW5lLWhlaWdodCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5vZGUubGluZUhlaWdodC51bml0ID09PSAnQVVUTydcbiAgICAgICAgICAgICAgICAgICAgPyAnYXV0bydcbiAgICAgICAgICAgICAgICAgICAgOiBub2RlLmxpbmVIZWlnaHQudmFsdWUgKyAobm9kZS5sZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gJ3B4JyA6ICclJylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUudGV4dERlY29yYXRpb24gIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWRlY29yYXRpb24nLCB2YWx1ZTogdGV4dERlY29yYXRpb25Dc3NWYWx1ZXNbbm9kZS50ZXh0RGVjb3JhdGlvbl0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0xJTkUnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdHUk9VUCcgfHwgbm9kZS50eXBlID09PSAnRUxMSVBTRScgfHwgbm9kZS50eXBlID09PSAnUE9MWUdPTicgfHwgbm9kZS50eXBlID09PSAnU1RBUicpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGlzSW1hZ2UgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgICAgICB2YXIgY3NzRGF0YUZvck5vZGUgPSB7XG4gICAgICAgICAgICAvLyBuYW1lIFRleHQgbm9kZSBhcyBcIlRleHRcIiBzaW5jZSBuYW1lIG9mIHRleHQgbm9kZSBpcyBvZnRlbiB0aGUgY29udGVudCBvZiB0aGUgbm9kZSBhbmQgaXMgbm90IGFwcHJvcHJpYXRlIGFzIGEgbmFtZVxuICAgICAgICAgICAgY2xhc3NOYW1lOiBpc0ltYWdlID8gJ0ltZycgOiBub2RlLnR5cGUgPT09ICdURVhUJyA/ICdUZXh0JyA6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICAgICAgZGF0dW0ucHVzaChjc3NEYXRhRm9yTm9kZSk7XG4gICAgfVxuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUpIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgZXhwb3J0cy5leHRyYWN0Q3NzRGF0dW0oZGF0dW0sIGNoaWxkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkYXR1bTtcbn07XG5leHBvcnRzLmV4dHJhY3RDc3NEYXR1bSA9IGV4dHJhY3RDc3NEYXR1bTtcbmZ1bmN0aW9uIGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKSB7XG4gICAgaWYgKG5vZGUuY29ybmVyUmFkaXVzICE9PSAwKSB7XG4gICAgICAgIGlmIChub2RlLmNvcm5lclJhZGl1cyA9PT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLnRvcExlZnRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS50b3BSaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzICsgXCJweCBcIiArIG5vZGUuYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5jb3JuZXJSYWRpdXMgKyBcInB4XCI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmdiVmFsdWVUb0hleCh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogMjU1KS50b1N0cmluZygxNik7XG59XG5mdW5jdGlvbiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgaWYgKHBhaW50Lm9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBwYWludC5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuciAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmcgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5iICogMjU1KSArIFwiLCBcIiArIHBhaW50Lm9wYWNpdHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLnIpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5nKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuYik7XG4gICAgfVxuICAgIGlmIChwYWludC50eXBlID09PSAnR1JBRElFTlRfQU5HVUxBUicgfHwgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0RJQU1PTkQnIHx8IHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9MSU5FQVInIHx8IHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9SQURJQUwnKSB7XG4gICAgICAgIC8vIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNGMjBBMEEgMCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkgMTAwJSk7XG4gICAgICAgIC8vW1s2LjEyMzIzNDI2MjkyNTgzOWUtMTcsIDEsIDBdLCBbLTEsIDYuMTIzMjM0MjYyOTI1ODM5ZS0xNywgMV1dXG4gICAgICAgIC8vIFt7IFwiY29sb3JcIjogeyBcInJcIjogMC45NTAyOTU4NjU1MzU3MzYxLCBcImdcIjogMC4wMzg1MTU2MjczODQxODU3OSwgXCJiXCI6IDAuMDM4NTE1NjI3Mzg0MTg1NzksIFwiYVwiOiAxIH0sIFwicG9zaXRpb25cIjogMCB9LCB7IFwiY29sb3JcIjogeyBcInJcIjogMSwgXCJnXCI6IDEsIFwiYlwiOiAxLCBcImFcIjogMCB9LCBcInBvc2l0aW9uXCI6IDEgfV07XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYWludC5ncmFkaWVudFRyYW5zZm9ybSkgKyBKU09OLnN0cmluZ2lmeShwYWludC5ncmFkaWVudFN0b3BzKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENzc0RhdGFGb3JUYWcgPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xudmFyIGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIFNQQUNFX0JFVFdFRU46ICdzcGFjZS1iZXR3ZWVuJ1xufTtcbnZhciBhbGlnbkl0ZW1zQ3NzVmFsdWVzID0ge1xuICAgIE1JTjogJ2ZsZXgtc3RhcnQnLFxuICAgIE1BWDogJ2ZsZXgtZW5kJyxcbiAgICBDRU5URVI6ICdjZW50ZXInXG59O1xudmFyIHRleHRBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBMRUZUOiAnbGVmdCcsXG4gICAgUklHSFQ6ICdyaWdodCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBKVVNUSUZJRUQ6ICdqdXN0aWZ5J1xufTtcbnZhciB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlcyA9IHtcbiAgICBUT1A6ICd0b3AnLFxuICAgIENFTlRFUjogJ21pZGRsZScsXG4gICAgQk9UVE9NOiAnYm90dG9tJ1xufTtcbnZhciB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlcyA9IHtcbiAgICBVTkRFUkxJTkU6ICd1bmRlcmxpbmUnLFxuICAgIFNUUklMRVRIUk9VR0g6ICdsaW5lLXRocm91Z2gnXG59O1xudmFyIGdldENzc0RhdGFGb3JUYWcgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgd2l0aCBpbWcgdGFnXG4gICAgaWYgKG5vZGUudmlzaWJsZSAmJiBub2RlLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgIGlmICgnb3BhY2l0eScgaW4gbm9kZSAmJiBub2RlLm9wYWNpdHkgPCAxKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnb3BhY2l0eScsIHZhbHVlOiBub2RlLm9wYWNpdHkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUucm90YXRpb24gIT09IDApIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0cmFuc2Zvcm0nLCB2YWx1ZTogXCJyb3RhdGUoXCIgKyBNYXRoLmZsb29yKG5vZGUucm90YXRpb24pICsgXCJkZWcpXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZGlzcGxheScsIHZhbHVlOiAnZmxleCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZsZXgtZGlyZWN0aW9uJywgdmFsdWU6IG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnID8gJ3JvdycgOiAnY29sdW1uJyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnanVzdGlmeS1jb250ZW50JywgdmFsdWU6IGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzW25vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYWxpZ24taXRlbXMnLCB2YWx1ZTogYWxpZ25JdGVtc0Nzc1ZhbHVlc1tub2RlLmNvdW50ZXJBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nTGVmdCAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nTGVmdCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nUmlnaHQgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nQm90dG9tICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdnYXAnLCB2YWx1ZTogbm9kZS5pdGVtU3BhY2luZyArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtYWxpZ24nLCB2YWx1ZTogdGV4dEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduSG9yaXpvbnRhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndmVydGljYWwtYWxpZ24nLCB2YWx1ZTogdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25WZXJ0aWNhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1zaXplJywgdmFsdWU6IG5vZGUuZm9udFNpemUgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1mYW1pbHknLCB2YWx1ZTogbm9kZS5mb250TmFtZS5mYW1pbHkgfSk7XG4gICAgICAgICAgICB2YXIgbGV0dGVyU3BhY2luZyA9IG5vZGUubGV0dGVyU3BhY2luZztcbiAgICAgICAgICAgIGlmIChsZXR0ZXJTcGFjaW5nLnZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2xldHRlci1zcGFjaW5nJywgdmFsdWU6IGxldHRlclNwYWNpbmcudmFsdWUgKyAobGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGluZS1oZWlnaHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLmxpbmVIZWlnaHQudW5pdCA9PT0gJ0FVVE8nXG4gICAgICAgICAgICAgICAgICAgID8gJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIDogbm9kZS5saW5lSGVpZ2h0LnZhbHVlICsgKG5vZGUubGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnRleHREZWNvcmF0aW9uICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1kZWNvcmF0aW9uJywgdmFsdWU6IHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzW25vZGUudGV4dERlY29yYXRpb25dIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2NvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMSU5FJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnR1JPVVAnIHx8IG5vZGUudHlwZSA9PT0gJ0VMTElQU0UnIHx8IG5vZGUudHlwZSA9PT0gJ1BPTFlHT04nIHx8IG5vZGUudHlwZSA9PT0gJ1NUQVInKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpc0ltYWdlID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIG5hbWUgVGV4dCBub2RlIGFzIFwiVGV4dFwiIHNpbmNlIG5hbWUgb2YgdGV4dCBub2RlIGlzIG9mdGVuIHRoZSBjb250ZW50IG9mIHRoZSBub2RlIGFuZCBpcyBub3QgYXBwcm9wcmlhdGUgYXMgYSBuYW1lXG4gICAgICAgICAgICBjbGFzc05hbWU6IGlzSW1hZ2UgPyAnSW1nJyA6IG5vZGUudHlwZSA9PT0gJ1RFWFQnID8gJ1RleHQnIDogbm9kZS5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG5leHBvcnRzLmdldENzc0RhdGFGb3JUYWcgPSBnZXRDc3NEYXRhRm9yVGFnO1xuZnVuY3Rpb24gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpIHtcbiAgICBpZiAobm9kZS5jb3JuZXJSYWRpdXMgIT09IDApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlLmNvcm5lclJhZGl1cyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLnRvcExlZnRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS50b3BSaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzICsgXCJweCBcIiArIG5vZGUuYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5jb3JuZXJSYWRpdXMgKyBcInB4XCI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmdiVmFsdWVUb0hleCh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogMjU1KS50b1N0cmluZygxNik7XG59XG5mdW5jdGlvbiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgaWYgKHBhaW50Lm9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBwYWludC5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuciAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmcgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5iICogMjU1KSArIFwiLCBcIiArIHBhaW50Lm9wYWNpdHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLnIpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5nKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuYik7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tb2RpZnlUcmVlRm9yQ29tcG9uZW50ID0gdm9pZCAwO1xudmFyIGNvbXBvbmVudHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnU3BhY2VyJyxcbiAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09ICdTcGFjZXInICYmICghKCdjaGlsZHJlbicgaW4gbm9kZSkgfHwgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApO1xuICAgICAgICB9LFxuICAgICAgICBtb2RpZnlGdW5jOiBmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICBpZiAodGFnLm5vZGUud2lkdGggPiB0YWcubm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0YWcucHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiB0YWcubm9kZS5oZWlnaHQudG9TdHJpbmcoKSwgbm90U3RyaW5nVmFsdWU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWcucHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IHRhZy5ub2RlLndpZHRoLnRvU3RyaW5nKCksIG5vdFN0cmluZ1ZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFnLmlzQ29tcG9uZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgIH1cbiAgICB9XG5dO1xudmFyIG1vZGlmeSA9IGZ1bmN0aW9uICh0YWcsIF9maWdtYSkge1xuICAgIGlmICghdGFnIHx8ICF0YWcubm9kZSkge1xuICAgICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgICB2YXIgbW9kaWZpZWRPbmNlID0gZmFsc2U7XG4gICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZXR0aW5nKSB7XG4gICAgICAgIGlmICghbW9kaWZpZWRPbmNlICYmIHNldHRpbmcubWF0Y2hlcih0YWcubm9kZSkpIHtcbiAgICAgICAgICAgIHRhZyA9IHNldHRpbmcubW9kaWZ5RnVuYyh0YWcsIF9maWdtYSk7XG4gICAgICAgICAgICBtb2RpZmllZE9uY2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhZztcbn07XG52YXIgbW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IGZ1bmN0aW9uICh0cmVlLCBfZmlnbWEpIHtcbiAgICB2YXIgbmV3VGFnID0gbW9kaWZ5KHRyZWUsIF9maWdtYSk7XG4gICAgbmV3VGFnLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpbmRleCkge1xuICAgICAgICBuZXdUYWcuY2hpbGRyZW5baW5kZXhdID0gZXhwb3J0cy5tb2RpZnlUcmVlRm9yQ29tcG9uZW50KGNoaWxkLCBfZmlnbWEpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cmVlO1xufTtcbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSB2b2lkIDA7XG52YXIgaXNJbWFnZU5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIOS4i+mDqOOBqyBWZWN0b3Ig44GX44GL5a2Y5Zyo44GX44Gq44GE44KC44Gu44Gv55S75YOP44Go5Yik5a6a44GZ44KLXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGhhc09ubHlWZWN0b3JfMSA9IHRydWU7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICAgICAgICAgIGhhc09ubHlWZWN0b3JfMSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGhhc09ubHlWZWN0b3JfMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVkVDVE9SJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgIGlmIChub2RlLmZpbGxzLmZpbmQoZnVuY3Rpb24gKHBhaW50KSB7IHJldHVybiBwYWludC50eXBlID09PSAnSU1BR0UnOyB9KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuZXhwb3J0cy5pc0ltYWdlTm9kZSA9IGlzSW1hZ2VOb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmtlYmFiVG9VcHBlckNhbWVsID0gZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBleHBvcnRzLmtlYmFiaXplID0gdm9pZCAwO1xudmFyIGtlYmFiaXplID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsZXR0ZXIsIGlkeCkge1xuICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCkgPT09IGxldHRlciA/IFwiXCIgKyAoaWR4ICE9PSAwID8gJy0nIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJycpO1xufTtcbmV4cG9ydHMua2ViYWJpemUgPSBrZWJhYml6ZTtcbnZhciBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn07XG5leHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlciA9IGNhcGl0YWxpemVGaXJzdExldHRlcjtcbmZ1bmN0aW9uIGtlYmFiVG9VcHBlckNhbWVsKHN0cikge1xuICAgIHJldHVybiBleHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlcihzdHIuc3BsaXQoLy18Xy9nKS5tYXAoZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIpLmpvaW4oJycpKTtcbn1cbmV4cG9ydHMua2ViYWJUb1VwcGVyQ2FtZWwgPSBrZWJhYlRvVXBwZXJDYW1lbDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=