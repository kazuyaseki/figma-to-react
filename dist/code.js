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

/***/ "./src/buildTagTree.ts":
/*!*****************************!*\
  !*** ./src/buildTagTree.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildTagTree = void 0;
var getCssDataForTag_1 = __webpack_require__(/*! ./getCssDataForTag */ "./src/getCssDataForTag.ts");
var isImageNode_1 = __webpack_require__(/*! ./utils/isImageNode */ "./src/utils/isImageNode.ts");
function buildTagTree(node) {
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
            childTags.push(buildTagTree(child));
        });
    }
    var tag = {
        name: isImg ? 'img' : node.name,
        isText: node.type === 'TEXT',
        textCharacters: node.type === 'TEXT' ? node.characters : null,
        isImg: isImg,
        css: getCssDataForTag_1.getCssDataForTag(node),
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
                    tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(node), figma);
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
        var tag = modifyTreeForComponent_1.modifyTreeForComponent(buildTagTree_1.buildTagTree(selectedNodes[0]), figma);
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
function getCssDataForTag(node) {
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
            className: isImage ? 'img' : node.type === 'TEXT' ? 'text' : node.name,
            properties: properties
        };
    }
    return null;
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ3NzU3RyaW5nLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRUYWdUcmVlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2dldENzc0RhdGFGb3JUYWcudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9tb2RpZnlUcmVlRm9yQ29tcG9uZW50LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9zdHJpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIsb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUYs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QTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsK0JBQStCLEVBQUU7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7Ozs7Ozs7Ozs7QUMxQk47QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsNkJBQTZCLEdBQUcsZ0JBQWdCO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOzs7Ozs7O1VDbkJ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkQ29kZSA9IHZvaWQgMDtcbnZhciBzdHJpbmdVdGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nVXRpbHNcIik7XG5mdW5jdGlvbiBidWlsZFNwYWNlcyhiYXNlU3BhY2VzLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZXNTdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2VTcGFjZXM7IGkrKykge1xuICAgICAgICBzcGFjZXNTdHIgKz0gJyAnO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsOyBpKyspIHtcbiAgICAgICAgc3BhY2VzU3RyICs9ICcgICc7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZXNTdHI7XG59XG5mdW5jdGlvbiBndWVzc1RhZ05hbWUobmFtZSkge1xuICAgIHZhciBfbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ2J1dHRvbicpKSB7XG4gICAgICAgIHJldHVybiAnYnV0dG9uJztcbiAgICB9XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdzZWN0aW9uJykpIHtcbiAgICAgICAgcmV0dXJuICdzZWN0aW9uJztcbiAgICB9XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdhcnRpY2xlJykpIHtcbiAgICAgICAgcmV0dXJuICdhcnRpY2xlJztcbiAgICB9XG4gICAgcmV0dXJuICdkaXYnO1xufVxuZnVuY3Rpb24gZ2V0VGFnTmFtZSh0YWcsIGNzc1N0eWxlKSB7XG4gICAgaWYgKGNzc1N0eWxlID09PSAnY3NzJyAmJiAhdGFnLmlzQ29tcG9uZW50KSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnaW1nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICdwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3Vlc3NUYWdOYW1lKHRhZy5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhZy5pc1RleHQgPyAnVGV4dCcgOiB0YWcubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpO1xufVxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnICYmICF0YWcuaXNDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJyBjbGFzc05hbWU9XCJ0ZXh0XCInO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIiBjbGFzc05hbWU9XFxcIlwiICsgc3RyaW5nVXRpbHNfMS5rZWJhYml6ZSh0YWcubmFtZSkgKyBcIlxcXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYnVpbGRQcm9wZXJ0eVN0cmluZyhwcm9wKSB7XG4gICAgcmV0dXJuIFwiIFwiICsgcHJvcC5uYW1lICsgKHByb3AudmFsdWUgIT09IG51bGwgPyBcIj1cIiArIChwcm9wLm5vdFN0cmluZ1ZhbHVlID8gJ3snIDogJ1wiJykgKyBwcm9wLnZhbHVlICsgKHByb3Aubm90U3RyaW5nVmFsdWUgPyAnfScgOiAnXCInKSA6ICcnKTtcbn1cbmZ1bmN0aW9uIGJ1aWxkQ2hpbGRUYWdzU3RyaW5nKHRhZywgY3NzU3R5bGUsIGxldmVsKSB7XG4gICAgaWYgKHRhZy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiAnXFxuJyArIHRhZy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBidWlsZEpzeFN0cmluZyhjaGlsZCwgY3NzU3R5bGUsIGxldmVsICsgMSk7IH0pLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRhZy50ZXh0Q2hhcmFjdGVycztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYnVpbGRKc3hTdHJpbmcodGFnLCBjc3NTdHlsZSwgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VTdHJpbmcgPSBidWlsZFNwYWNlcyg0LCBsZXZlbCk7XG4gICAgdmFyIGhhc0NoaWxkcmVuID0gdGFnLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgdmFyIHRhZ05hbWUgPSBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpO1xuICAgIHZhciBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB0YWcucHJvcGVydGllcy5tYXAoYnVpbGRQcm9wZXJ0eVN0cmluZykuam9pbignJyk7XG4gICAgdmFyIG9wZW5pbmdUYWcgPSBzcGFjZVN0cmluZyArIFwiPFwiICsgdGFnTmFtZSArIGNsYXNzTmFtZSArIHByb3BlcnRpZXMgKyAoaGFzQ2hpbGRyZW4gfHwgdGFnLmlzVGV4dCA/IFwiXCIgOiAnIC8nKSArIFwiPlwiO1xuICAgIHZhciBjaGlsZFRhZ3MgPSBidWlsZENoaWxkVGFnc1N0cmluZyh0YWcsIGNzc1N0eWxlLCBsZXZlbCk7XG4gICAgdmFyIGNsb3NpbmdUYWcgPSBoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gKCF0YWcuaXNUZXh0ID8gJ1xcbicgKyBzcGFjZVN0cmluZyA6ICcnKSArIFwiPC9cIiArIHRhZ05hbWUgKyBcIj5cIiA6ICcnO1xuICAgIHJldHVybiBvcGVuaW5nVGFnICsgY2hpbGRUYWdzICsgY2xvc2luZ1RhZztcbn1cbmZ1bmN0aW9uIGJ1aWxkQ29kZSh0YWcsIGNzcykge1xuICAgIHJldHVybiBcImNvbnN0IFwiICsgc3RyaW5nVXRpbHNfMS5jYXBpdGFsaXplRmlyc3RMZXR0ZXIodGFnLm5hbWUucmVwbGFjZSgvXFxzL2csICcnKSkgKyBcIjogUmVhY3QuVkZDID0gKCkgPT4ge1xcbiAgcmV0dXJuIChcXG5cIiArIGJ1aWxkSnN4U3RyaW5nKHRhZywgY3NzLCAwKSArIFwiXFxuICApXFxufVwiO1xufVxuZXhwb3J0cy5idWlsZENvZGUgPSBidWlsZENvZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRDc3NTdHJpbmcgPSB2b2lkIDA7XG52YXIgc3RyaW5nVXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZ1V0aWxzXCIpO1xuZnVuY3Rpb24gYnVpbGRBcnJheSh0YWcsIGFycikge1xuICAgIGFyci5wdXNoKHRhZy5jc3MpO1xuICAgIHRhZy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBhcnIgPSBidWlsZEFycmF5KGNoaWxkLCBhcnIpO1xuICAgIH0pO1xuICAgIHJldHVybiBhcnI7XG59XG5mdW5jdGlvbiBidWlsZENzc1N0cmluZyh0YWcsIGNzc1N0eWxlKSB7XG4gICAgdmFyIGNzc0FycmF5ID0gYnVpbGRBcnJheSh0YWcsIFtdKTtcbiAgICB2YXIgY29kZVN0ciA9ICcnO1xuICAgIGNzc0FycmF5LmZvckVhY2goZnVuY3Rpb24gKGNzc0RhdGEpIHtcbiAgICAgICAgdmFyIGNzc1N0ciA9IGNzc1N0eWxlID09PSAnc3R5bGVkLWNvbXBvbmVudHMnXG4gICAgICAgICAgICA/IFwiY29uc3QgXCIgKyBjc3NEYXRhLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMvZywgJycpICsgXCIgPSBzdHlsZWQuZGl2YFxcblwiICsgY3NzRGF0YS5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbiAocHJvcGVydHkpIHsgcmV0dXJuIFwiICBcIiArIHByb3BlcnR5Lm5hbWUgKyBcIjogXCIgKyBwcm9wZXJ0eS52YWx1ZSArIFwiO1wiOyB9KS5qb2luKCdcXG4nKSArIFwiXFxuYFxcblwiXG4gICAgICAgICAgICA6IFwiLlwiICsgc3RyaW5nVXRpbHNfMS5rZWJhYml6ZShjc3NEYXRhLmNsYXNzTmFtZSkgKyBcIiB7XFxuXCIgKyBjc3NEYXRhLnByb3BlcnRpZXMubWFwKGZ1bmN0aW9uIChwcm9wZXJ0eSkgeyByZXR1cm4gXCIgIFwiICsgcHJvcGVydHkubmFtZSArIFwiOiBcIiArIHByb3BlcnR5LnZhbHVlICsgXCI7XCI7IH0pLmpvaW4oJ1xcbicpICsgXCJcXG59XFxuXCI7XG4gICAgICAgIGNvZGVTdHIgKz0gY3NzU3RyO1xuICAgIH0pO1xuICAgIHJldHVybiBjb2RlU3RyO1xufVxuZXhwb3J0cy5idWlsZENzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IHZvaWQgMDtcbnZhciBnZXRDc3NEYXRhRm9yVGFnXzEgPSByZXF1aXJlKFwiLi9nZXRDc3NEYXRhRm9yVGFnXCIpO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbmZ1bmN0aW9uIGJ1aWxkVGFnVHJlZShub2RlKSB7XG4gICAgaWYgKCFub2RlLnZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBpc0ltZyA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcbiAgICBpZiAoaXNJbWcpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3NyYycsIHZhbHVlOiAnJyB9KTtcbiAgICB9XG4gICAgdmFyIGNoaWxkVGFncyA9IFtdO1xuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgIWlzSW1nKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkVGFncy5wdXNoKGJ1aWxkVGFnVHJlZShjaGlsZCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHRhZyA9IHtcbiAgICAgICAgbmFtZTogaXNJbWcgPyAnaW1nJyA6IG5vZGUubmFtZSxcbiAgICAgICAgaXNUZXh0OiBub2RlLnR5cGUgPT09ICdURVhUJyxcbiAgICAgICAgdGV4dENoYXJhY3RlcnM6IG5vZGUudHlwZSA9PT0gJ1RFWFQnID8gbm9kZS5jaGFyYWN0ZXJzIDogbnVsbCxcbiAgICAgICAgaXNJbWc6IGlzSW1nLFxuICAgICAgICBjc3M6IGdldENzc0RhdGFGb3JUYWdfMS5nZXRDc3NEYXRhRm9yVGFnKG5vZGUpLFxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRUYWdzLFxuICAgICAgICBub2RlOiBub2RlXG4gICAgfTtcbiAgICByZXR1cm4gdGFnO1xufVxuZXhwb3J0cy5idWlsZFRhZ1RyZWUgPSBidWlsZFRhZ1RyZWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vbW9kaWZ5VHJlZUZvckNvbXBvbmVudFwiKTtcbnZhciBidWlsZENvZGVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkQ29kZVwiKTtcbnZhciBidWlsZFRhZ1RyZWVfMSA9IHJlcXVpcmUoXCIuL2J1aWxkVGFnVHJlZVwiKTtcbnZhciBidWlsZENzc1N0cmluZ18xID0gcmVxdWlyZShcIi4vYnVpbGRDc3NTdHJpbmdcIik7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDQ4MCwgaGVpZ2h0OiA0NDAgfSk7XG52YXIgc2VsZWN0ZWROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbnZhciBDU1NfU1RZTEVfS0VZID0gJ0NTU19TVFlMRV9LRVknO1xuZnVuY3Rpb24gZ2VuZXJhdGUobm9kZSwgY3NzU3R5bGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfY3NzLCB0YWcsIGdlbmVyYXRlZENvZGVTdHIsIGNzc1N0cmluZztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2NzcyA9IGNzc1N0eWxlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISFfY3NzKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhDU1NfU1RZTEVfS0VZKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBfY3NzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9jc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jc3MgPSAnY3NzJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEubW9kaWZ5VHJlZUZvckNvbXBvbmVudChidWlsZFRhZ1RyZWVfMS5idWlsZFRhZ1RyZWUobm9kZSksIGZpZ21hKTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkQ29kZVN0ciA9IGJ1aWxkQ29kZV8xLmJ1aWxkQ29kZSh0YWcsIF9jc3MpO1xuICAgICAgICAgICAgICAgICAgICBjc3NTdHJpbmcgPSBidWlsZENzc1N0cmluZ18xLmJ1aWxkQ3NzU3RyaW5nKHRhZywgX2Nzcyk7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgZ2VuZXJhdGVkQ29kZVN0cjogZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nOiBjc3NTdHJpbmcsIGNzc1N0eWxlOiBfY3NzIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID4gMSkge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBvbmx5IDEgbm9kZScpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5lbHNlIGlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBhIG5vZGUnKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZWxzZSB7XG4gICAgZ2VuZXJhdGUoc2VsZWN0ZWROb2Rlc1swXSk7XG59XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnbm90aWZ5LWNvcHktc3VjY2VzcycpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KCdjb3BpZWQgdG8gY2xpcGJvYXJk8J+RjScpO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICduZXctY3NzLXN0eWxlLXNldCcpIHtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhDU1NfU1RZTEVfS0VZLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICB2YXIgdGFnID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudF8xLm1vZGlmeVRyZWVGb3JDb21wb25lbnQoYnVpbGRUYWdUcmVlXzEuYnVpbGRUYWdUcmVlKHNlbGVjdGVkTm9kZXNbMF0pLCBmaWdtYSk7XG4gICAgICAgIHZhciBnZW5lcmF0ZWRDb2RlU3RyID0gYnVpbGRDb2RlXzEuYnVpbGRDb2RlKHRhZywgbXNnLmNzc1N0eWxlKTtcbiAgICAgICAgdmFyIGNzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nXzEuYnVpbGRDc3NTdHJpbmcodGFnLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IGdlbmVyYXRlZENvZGVTdHI6IGdlbmVyYXRlZENvZGVTdHIsIGNzc1N0cmluZzogY3NzU3RyaW5nIH0pO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0Q3NzRGF0YUZvclRhZyA9IHZvaWQgMDtcbnZhciBpc0ltYWdlTm9kZV8xID0gcmVxdWlyZShcIi4vdXRpbHMvaXNJbWFnZU5vZGVcIik7XG52YXIganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXMgPSB7XG4gICAgTUlOOiAnZmxleC1zdGFydCcsXG4gICAgTUFYOiAnZmxleC1lbmQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgU1BBQ0VfQkVUV0VFTjogJ3NwYWNlLWJldHdlZW4nXG59O1xudmFyIGFsaWduSXRlbXNDc3NWYWx1ZXMgPSB7XG4gICAgTUlOOiAnZmxleC1zdGFydCcsXG4gICAgTUFYOiAnZmxleC1lbmQnLFxuICAgIENFTlRFUjogJ2NlbnRlcidcbn07XG52YXIgdGV4dEFsaWduQ3NzVmFsdWVzID0ge1xuICAgIExFRlQ6ICdsZWZ0JyxcbiAgICBSSUdIVDogJ3JpZ2h0JyxcbiAgICBDRU5URVI6ICdjZW50ZXInLFxuICAgIEpVU1RJRklFRDogJ2p1c3RpZnknXG59O1xudmFyIHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzID0ge1xuICAgIFRPUDogJ3RvcCcsXG4gICAgQ0VOVEVSOiAnbWlkZGxlJyxcbiAgICBCT1RUT006ICdib3R0b20nXG59O1xudmFyIHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzID0ge1xuICAgIFVOREVSTElORTogJ3VuZGVybGluZScsXG4gICAgU1RSSUxFVEhST1VHSDogJ2xpbmUtdGhyb3VnaCdcbn07XG5mdW5jdGlvbiBnZXRDc3NEYXRhRm9yVGFnKG5vZGUpIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgIC8vIHNraXAgdmVjdG9yIHNpbmNlIGl0J3Mgb2Z0ZW4gZGlzcGxheWVkIGFzIGFuIGltZyB0YWdcbiAgICBpZiAobm9kZS52aXNpYmxlICYmIG5vZGUudHlwZSAhPT0gJ1ZFQ1RPUicpIHtcbiAgICAgICAgaWYgKCdvcGFjaXR5JyBpbiBub2RlICYmIG5vZGUub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdvcGFjaXR5JywgdmFsdWU6IG5vZGUub3BhY2l0eSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5yb3RhdGlvbiAhPT0gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RyYW5zZm9ybScsIHZhbHVlOiBcInJvdGF0ZShcIiArIE1hdGguZmxvb3Iobm9kZS5yb3RhdGlvbikgKyBcImRlZylcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fCBub2RlLnR5cGUgPT09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdkaXNwbGF5JywgdmFsdWU6ICdmbGV4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZmxleC1kaXJlY3Rpb24nLCB2YWx1ZTogbm9kZS5sYXlvdXRNb2RlID09PSAnSE9SSVpPTlRBTCcgPyAncm93JyA6ICdjb2x1bW4nIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdqdXN0aWZ5LWNvbnRlbnQnLCB2YWx1ZToganVzdGlmeUNvbnRlbnRDc3NWYWx1ZXNbbm9kZS5wcmltYXJ5QXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdhbGlnbi1pdGVtcycsIHZhbHVlOiBhbGlnbkl0ZW1zQ3NzVmFsdWVzW25vZGUuY291bnRlckF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdMZWZ0ICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0JvdHRvbSAmJiBub2RlLnBhZGRpbmdMZWZ0ID09PSBub2RlLnBhZGRpbmdSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nTGVmdCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdSaWdodCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdCb3R0b20gKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nTGVmdCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2dhcCcsIHZhbHVlOiBub2RlLml0ZW1TcGFjaW5nICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgICAgICB2YXIgYm9yZGVyUmFkaXVzVmFsdWUgPSBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSk7XG4gICAgICAgICAgICBpZiAoYm9yZGVyUmFkaXVzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyLXJhZGl1cycsIHZhbHVlOiBib3JkZXJSYWRpdXNWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1hbGlnbicsIHZhbHVlOiB0ZXh0QWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25Ib3Jpem9udGFsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd2ZXJ0aWNhbC1hbGlnbicsIHZhbHVlOiB0ZXh0VmVydGljYWxBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnblZlcnRpY2FsXSB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LXNpemUnLCB2YWx1ZTogbm9kZS5mb250U2l6ZSArIFwicHhcIiB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmb250LWZhbWlseScsIHZhbHVlOiBub2RlLmZvbnROYW1lLmZhbWlseSB9KTtcbiAgICAgICAgICAgIHZhciBsZXR0ZXJTcGFjaW5nID0gbm9kZS5sZXR0ZXJTcGFjaW5nO1xuICAgICAgICAgICAgaWYgKGxldHRlclNwYWNpbmcudmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnbGV0dGVyLXNwYWNpbmcnLCB2YWx1ZTogbGV0dGVyU3BhY2luZy52YWx1ZSArIChsZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gJ3B4JyA6ICclJykgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaW5lLWhlaWdodCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG5vZGUubGluZUhlaWdodC51bml0ID09PSAnQVVUTydcbiAgICAgICAgICAgICAgICAgICAgPyAnYXV0bydcbiAgICAgICAgICAgICAgICAgICAgOiBub2RlLmxpbmVIZWlnaHQudmFsdWUgKyAobm9kZS5sZXR0ZXJTcGFjaW5nLnVuaXQgPT09ICdQSVhFTFMnID8gJ3B4JyA6ICclJylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUudGV4dERlY29yYXRpb24gIT09ICdOT05FJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWRlY29yYXRpb24nLCB2YWx1ZTogdGV4dERlY29yYXRpb25Dc3NWYWx1ZXNbbm9kZS50ZXh0RGVjb3JhdGlvbl0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0xJTkUnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdHUk9VUCcgfHwgbm9kZS50eXBlID09PSAnRUxMSVBTRScgfHwgbm9kZS50eXBlID09PSAnUE9MWUdPTicgfHwgbm9kZS50eXBlID09PSAnU1RBUicpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGlzSW1hZ2UgPSBpc0ltYWdlTm9kZV8xLmlzSW1hZ2VOb2RlKG5vZGUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gbmFtZSBUZXh0IG5vZGUgYXMgXCJUZXh0XCIgc2luY2UgbmFtZSBvZiB0ZXh0IG5vZGUgaXMgb2Z0ZW4gdGhlIGNvbnRlbnQgb2YgdGhlIG5vZGUgYW5kIGlzIG5vdCBhcHByb3ByaWF0ZSBhcyBhIG5hbWVcbiAgICAgICAgICAgIGNsYXNzTmFtZTogaXNJbWFnZSA/ICdpbWcnIDogbm9kZS50eXBlID09PSAnVEVYVCcgPyAndGV4dCcgOiBub2RlLm5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gZ2V0Q3NzRGF0YUZvclRhZztcbmZ1bmN0aW9uIGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKSB7XG4gICAgaWYgKG5vZGUuY29ybmVyUmFkaXVzICE9PSAwKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygbm9kZS5jb3JuZXJSYWRpdXMgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS50b3BMZWZ0UmFkaXVzICsgXCJweCBcIiArIG5vZGUudG9wUmlnaHRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS5ib3R0b21SaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbUxlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuY29ybmVyUmFkaXVzICsgXCJweFwiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJnYlZhbHVlVG9IZXgodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuZnVuY3Rpb24gYnVpbGRDb2xvclN0cmluZyhwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGlmIChwYWludC5vcGFjaXR5ICE9PSB1bmRlZmluZWQgJiYgcGFpbnQub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLnIgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5nICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuYiAqIDI1NSkgKyBcIiwgXCIgKyBwYWludC5vcGFjaXR5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5yKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuZykgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmIpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IHZvaWQgMDtcbnZhciBjb21wb25lbnRzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ1NwYWNlcicsXG4gICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSAnU3BhY2VyJyAmJiAoISgnY2hpbGRyZW4nIGluIG5vZGUpIHx8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgbW9kaWZ5RnVuYzogZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZy5ub2RlLndpZHRoID4gdGFnLm5vZGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGFnLnByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogdGFnLm5vZGUuaGVpZ2h0LnRvU3RyaW5nKCksIG5vdFN0cmluZ1ZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFnLnByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiB0YWcubm9kZS53aWR0aC50b1N0cmluZygpLCBub3RTdHJpbmdWYWx1ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhZy5pc0NvbXBvbmVudCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICB9XG4gICAgfVxuXTtcbmZ1bmN0aW9uIG1vZGlmeSh0YWcsIF9maWdtYSkge1xuICAgIGlmICghdGFnIHx8ICF0YWcubm9kZSkge1xuICAgICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgICB2YXIgbW9kaWZpZWRPbmNlID0gZmFsc2U7XG4gICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZXR0aW5nKSB7XG4gICAgICAgIGlmICghbW9kaWZpZWRPbmNlICYmIHNldHRpbmcubWF0Y2hlcih0YWcubm9kZSkpIHtcbiAgICAgICAgICAgIHRhZyA9IHNldHRpbmcubW9kaWZ5RnVuYyh0YWcsIF9maWdtYSk7XG4gICAgICAgICAgICBtb2RpZmllZE9uY2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhZztcbn1cbmZ1bmN0aW9uIG1vZGlmeVRyZWVGb3JDb21wb25lbnQodHJlZSwgX2ZpZ21hKSB7XG4gICAgdmFyIG5ld1RhZyA9IG1vZGlmeSh0cmVlLCBfZmlnbWEpO1xuICAgIG5ld1RhZy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgbmV3VGFnLmNoaWxkcmVuW2luZGV4XSA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnQoY2hpbGQsIF9maWdtYSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRyZWU7XG59XG5leHBvcnRzLm1vZGlmeVRyZWVGb3JDb21wb25lbnQgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzSW1hZ2VOb2RlID0gdm9pZCAwO1xuZnVuY3Rpb24gaXNJbWFnZU5vZGUobm9kZSkge1xuICAgIC8vIOS4i+mDqOOBqyBWZWN0b3Ig44GX44GL5a2Y5Zyo44GX44Gq44GE44KC44Gu44Gv55S75YOP44Go5Yik5a6a44GZ44KLXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGhhc09ubHlWZWN0b3JfMSA9IHRydWU7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICAgICAgICAgIGhhc09ubHlWZWN0b3JfMSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGhhc09ubHlWZWN0b3JfMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS50eXBlID09PSAnVkVDVE9SJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnKSB7XG4gICAgICAgIGlmIChub2RlLmZpbGxzLmZpbmQoZnVuY3Rpb24gKHBhaW50KSB7IHJldHVybiBwYWludC50eXBlID09PSAnSU1BR0UnOyB9KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmlzSW1hZ2VOb2RlID0gaXNJbWFnZU5vZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMua2ViYWJUb1VwcGVyQ2FtZWwgPSBleHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlciA9IGV4cG9ydHMua2ViYWJpemUgPSB2b2lkIDA7XG5mdW5jdGlvbiBrZWJhYml6ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAobGV0dGVyLCBpZHgpIHtcbiAgICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpID09PSBsZXR0ZXIgPyBcIlwiICsgKGlkeCAhPT0gMCA/ICctJyA6ICcnKSArIGxldHRlci50b0xvd2VyQ2FzZSgpIDogbGV0dGVyO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCcnKTtcbn1cbmV4cG9ydHMua2ViYWJpemUgPSBrZWJhYml6ZTtcbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHIpIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxuZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXI7XG5mdW5jdGlvbiBrZWJhYlRvVXBwZXJDYW1lbChzdHIpIHtcbiAgICByZXR1cm4gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHN0ci5zcGxpdCgvLXxfL2cpLm1hcChjYXBpdGFsaXplRmlyc3RMZXR0ZXIpLmpvaW4oJycpKTtcbn1cbmV4cG9ydHMua2ViYWJUb1VwcGVyQ2FtZWwgPSBrZWJhYlRvVXBwZXJDYW1lbDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=