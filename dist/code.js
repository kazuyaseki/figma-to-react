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
    return "const " + tag.name.replace(/\s/g, '') + ": React.VFC = () => {\n  return (\n" + buildJsxString(tag, css, 0) + "\n  )\n}";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ3NzU3RyaW5nLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRUYWdUcmVlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2dldENzc0RhdGFGb3JUYWcudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9tb2RpZnlUcmVlRm9yQ29tcG9uZW50LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9zdHJpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIsb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUYs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QTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsK0JBQStCLEVBQUU7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7Ozs7Ozs7Ozs7QUMxQk47QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsNkJBQTZCLEdBQUcsZ0JBQWdCO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOzs7Ozs7O1VDbkJ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkQ29kZSA9IHZvaWQgMDtcbnZhciBzdHJpbmdVdGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nVXRpbHNcIik7XG5mdW5jdGlvbiBidWlsZFNwYWNlcyhiYXNlU3BhY2VzLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZXNTdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2VTcGFjZXM7IGkrKykge1xuICAgICAgICBzcGFjZXNTdHIgKz0gJyAnO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsOyBpKyspIHtcbiAgICAgICAgc3BhY2VzU3RyICs9ICcgICc7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZXNTdHI7XG59XG5mdW5jdGlvbiBndWVzc1RhZ05hbWUobmFtZSkge1xuICAgIHZhciBfbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ2J1dHRvbicpKSB7XG4gICAgICAgIHJldHVybiAnYnV0dG9uJztcbiAgICB9XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdzZWN0aW9uJykpIHtcbiAgICAgICAgcmV0dXJuICdzZWN0aW9uJztcbiAgICB9XG4gICAgaWYgKF9uYW1lLmluY2x1ZGVzKCdhcnRpY2xlJykpIHtcbiAgICAgICAgcmV0dXJuICdhcnRpY2xlJztcbiAgICB9XG4gICAgcmV0dXJuICdkaXYnO1xufVxuZnVuY3Rpb24gZ2V0VGFnTmFtZSh0YWcsIGNzc1N0eWxlKSB7XG4gICAgaWYgKGNzc1N0eWxlID09PSAnY3NzJyAmJiAhdGFnLmlzQ29tcG9uZW50KSB7XG4gICAgICAgIGlmICh0YWcuaXNJbWcpIHtcbiAgICAgICAgICAgIHJldHVybiAnaW1nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICdwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3Vlc3NUYWdOYW1lKHRhZy5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhZy5pc1RleHQgPyAnVGV4dCcgOiB0YWcubmFtZS5yZXBsYWNlKC9cXHMvZywgJycpO1xufVxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnICYmICF0YWcuaXNDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJyBjbGFzc05hbWU9XCJ0ZXh0XCInO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIiBjbGFzc05hbWU9XFxcIlwiICsgc3RyaW5nVXRpbHNfMS5rZWJhYml6ZSh0YWcubmFtZSkgKyBcIlxcXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYnVpbGRQcm9wZXJ0eVN0cmluZyhwcm9wKSB7XG4gICAgcmV0dXJuIFwiIFwiICsgcHJvcC5uYW1lICsgKHByb3AudmFsdWUgIT09IG51bGwgPyBcIj1cIiArIChwcm9wLm5vdFN0cmluZ1ZhbHVlID8gJ3snIDogJ1wiJykgKyBwcm9wLnZhbHVlICsgKHByb3Aubm90U3RyaW5nVmFsdWUgPyAnfScgOiAnXCInKSA6ICcnKTtcbn1cbmZ1bmN0aW9uIGJ1aWxkQ2hpbGRUYWdzU3RyaW5nKHRhZywgY3NzU3R5bGUsIGxldmVsKSB7XG4gICAgaWYgKHRhZy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiAnXFxuJyArIHRhZy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBidWlsZEpzeFN0cmluZyhjaGlsZCwgY3NzU3R5bGUsIGxldmVsICsgMSk7IH0pLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBpZiAodGFnLmlzVGV4dCkge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRhZy50ZXh0Q2hhcmFjdGVycztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYnVpbGRKc3hTdHJpbmcodGFnLCBjc3NTdHlsZSwgbGV2ZWwpIHtcbiAgICB2YXIgc3BhY2VTdHJpbmcgPSBidWlsZFNwYWNlcyg0LCBsZXZlbCk7XG4gICAgdmFyIGhhc0NoaWxkcmVuID0gdGFnLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgdmFyIHRhZ05hbWUgPSBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpO1xuICAgIHZhciBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB0YWcucHJvcGVydGllcy5tYXAoYnVpbGRQcm9wZXJ0eVN0cmluZykuam9pbignJyk7XG4gICAgdmFyIG9wZW5pbmdUYWcgPSBzcGFjZVN0cmluZyArIFwiPFwiICsgdGFnTmFtZSArIGNsYXNzTmFtZSArIHByb3BlcnRpZXMgKyAoaGFzQ2hpbGRyZW4gfHwgdGFnLmlzVGV4dCA/IFwiXCIgOiAnIC8nKSArIFwiPlwiO1xuICAgIHZhciBjaGlsZFRhZ3MgPSBidWlsZENoaWxkVGFnc1N0cmluZyh0YWcsIGNzc1N0eWxlLCBsZXZlbCk7XG4gICAgdmFyIGNsb3NpbmdUYWcgPSBoYXNDaGlsZHJlbiB8fCB0YWcuaXNUZXh0ID8gKCF0YWcuaXNUZXh0ID8gJ1xcbicgKyBzcGFjZVN0cmluZyA6ICcnKSArIFwiPC9cIiArIHRhZ05hbWUgKyBcIj5cIiA6ICcnO1xuICAgIHJldHVybiBvcGVuaW5nVGFnICsgY2hpbGRUYWdzICsgY2xvc2luZ1RhZztcbn1cbmZ1bmN0aW9uIGJ1aWxkQ29kZSh0YWcsIGNzcykge1xuICAgIHJldHVybiBcImNvbnN0IFwiICsgdGFnLm5hbWUucmVwbGFjZSgvXFxzL2csICcnKSArIFwiOiBSZWFjdC5WRkMgPSAoKSA9PiB7XFxuICByZXR1cm4gKFxcblwiICsgYnVpbGRKc3hTdHJpbmcodGFnLCBjc3MsIDApICsgXCJcXG4gIClcXG59XCI7XG59XG5leHBvcnRzLmJ1aWxkQ29kZSA9IGJ1aWxkQ29kZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZENzc1N0cmluZyA9IHZvaWQgMDtcbnZhciBzdHJpbmdVdGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nVXRpbHNcIik7XG5mdW5jdGlvbiBidWlsZEFycmF5KHRhZywgYXJyKSB7XG4gICAgYXJyLnB1c2godGFnLmNzcyk7XG4gICAgdGFnLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGFyciA9IGJ1aWxkQXJyYXkoY2hpbGQsIGFycik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFycjtcbn1cbmZ1bmN0aW9uIGJ1aWxkQ3NzU3RyaW5nKHRhZywgY3NzU3R5bGUpIHtcbiAgICB2YXIgY3NzQXJyYXkgPSBidWlsZEFycmF5KHRhZywgW10pO1xuICAgIHZhciBjb2RlU3RyID0gJyc7XG4gICAgY3NzQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoY3NzRGF0YSkge1xuICAgICAgICB2YXIgY3NzU3RyID0gY3NzU3R5bGUgPT09ICdzdHlsZWQtY29tcG9uZW50cydcbiAgICAgICAgICAgID8gXCJjb25zdCBcIiArIGNzc0RhdGEuY2xhc3NOYW1lLnJlcGxhY2UoL1xccy9nLCAnJykgKyBcIiA9IHN0eWxlZC5kaXZgXFxuXCIgKyBjc3NEYXRhLnByb3BlcnRpZXMubWFwKGZ1bmN0aW9uIChwcm9wZXJ0eSkgeyByZXR1cm4gXCIgIFwiICsgcHJvcGVydHkubmFtZSArIFwiOiBcIiArIHByb3BlcnR5LnZhbHVlICsgXCI7XCI7IH0pLmpvaW4oJ1xcbicpICsgXCJcXG5gXFxuXCJcbiAgICAgICAgICAgIDogXCIuXCIgKyBzdHJpbmdVdGlsc18xLmtlYmFiaXplKGNzc0RhdGEuY2xhc3NOYW1lKSArIFwiIHtcXG5cIiArIGNzc0RhdGEucHJvcGVydGllcy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5KSB7IHJldHVybiBcIiAgXCIgKyBwcm9wZXJ0eS5uYW1lICsgXCI6IFwiICsgcHJvcGVydHkudmFsdWUgKyBcIjtcIjsgfSkuam9pbignXFxuJykgKyBcIlxcbn1cXG5cIjtcbiAgICAgICAgY29kZVN0ciArPSBjc3NTdHI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvZGVTdHI7XG59XG5leHBvcnRzLmJ1aWxkQ3NzU3RyaW5nID0gYnVpbGRDc3NTdHJpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRUYWdUcmVlID0gdm9pZCAwO1xudmFyIGdldENzc0RhdGFGb3JUYWdfMSA9IHJlcXVpcmUoXCIuL2dldENzc0RhdGFGb3JUYWdcIik7XG52YXIgaXNJbWFnZU5vZGVfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL2lzSW1hZ2VOb2RlXCIpO1xuZnVuY3Rpb24gYnVpbGRUYWdUcmVlKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUudmlzaWJsZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGlzSW1nID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICAgIGlmIChpc0ltZykge1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnc3JjJywgdmFsdWU6ICcnIH0pO1xuICAgIH1cbiAgICB2YXIgY2hpbGRUYWdzID0gW107XG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiAhaXNJbWcpIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgY2hpbGRUYWdzLnB1c2goYnVpbGRUYWdUcmVlKGNoaWxkKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgdGFnID0ge1xuICAgICAgICBuYW1lOiBpc0ltZyA/ICdpbWcnIDogbm9kZS5uYW1lLFxuICAgICAgICBpc1RleHQ6IG5vZGUudHlwZSA9PT0gJ1RFWFQnLFxuICAgICAgICB0ZXh0Q2hhcmFjdGVyczogbm9kZS50eXBlID09PSAnVEVYVCcgPyBub2RlLmNoYXJhY3RlcnMgOiBudWxsLFxuICAgICAgICBpc0ltZzogaXNJbWcsXG4gICAgICAgIGNzczogZ2V0Q3NzRGF0YUZvclRhZ18xLmdldENzc0RhdGFGb3JUYWcobm9kZSksXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZFRhZ3MsXG4gICAgICAgIG5vZGU6IG5vZGVcbiAgICB9O1xuICAgIHJldHVybiB0YWc7XG59XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IGJ1aWxkVGFnVHJlZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9tb2RpZnlUcmVlRm9yQ29tcG9uZW50XCIpO1xudmFyIGJ1aWxkQ29kZV8xID0gcmVxdWlyZShcIi4vYnVpbGRDb2RlXCIpO1xudmFyIGJ1aWxkVGFnVHJlZV8xID0gcmVxdWlyZShcIi4vYnVpbGRUYWdUcmVlXCIpO1xudmFyIGJ1aWxkQ3NzU3RyaW5nXzEgPSByZXF1aXJlKFwiLi9idWlsZENzc1N0cmluZ1wiKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDgwLCBoZWlnaHQ6IDQ0MCB9KTtcbnZhciBzZWxlY3RlZE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xudmFyIENTU19TVFlMRV9LRVkgPSAnQ1NTX1NUWUxFX0tFWSc7XG5mdW5jdGlvbiBnZW5lcmF0ZShub2RlLCBjc3NTdHlsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9jc3MsIHRhZywgZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY3NzID0gY3NzU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIV9jc3MpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKENTU19TVFlMRV9LRVkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9jc3MgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2Nzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NzcyA9ICdjc3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnRfMS5tb2RpZnlUcmVlRm9yQ29tcG9uZW50KGJ1aWxkVGFnVHJlZV8xLmJ1aWxkVGFnVHJlZShub2RlKSwgZmlnbWEpO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWRDb2RlU3RyID0gYnVpbGRDb2RlXzEuYnVpbGRDb2RlKHRhZywgX2Nzcyk7XG4gICAgICAgICAgICAgICAgICAgIGNzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nXzEuYnVpbGRDc3NTdHJpbmcodGFnLCBfY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBnZW5lcmF0ZWRDb2RlU3RyOiBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NTdHJpbmc6IGNzc1N0cmluZywgY3NzU3R5bGU6IF9jc3MgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5pZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IG9ubHkgMSBub2RlJyk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbmVsc2UgaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IGEgbm9kZScpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5lbHNlIHtcbiAgICBnZW5lcmF0ZShzZWxlY3RlZE5vZGVzWzBdKTtcbn1cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdub3RpZnktY29weS1zdWNjZXNzJykge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ2NvcGllZCB0byBjbGlwYm9hcmTwn5GNJyk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ25ldy1jc3Mtc3R5bGUtc2V0Jykge1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKENTU19TVFlMRV9LRVksIG1zZy5jc3NTdHlsZSk7XG4gICAgICAgIHZhciB0YWcgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEubW9kaWZ5VHJlZUZvckNvbXBvbmVudChidWlsZFRhZ1RyZWVfMS5idWlsZFRhZ1RyZWUoc2VsZWN0ZWROb2Rlc1swXSksIGZpZ21hKTtcbiAgICAgICAgdmFyIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUodGFnLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICB2YXIgY3NzU3RyaW5nID0gYnVpbGRDc3NTdHJpbmdfMS5idWlsZENzc1N0cmluZyh0YWcsIG1zZy5jc3NTdHlsZSk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgZ2VuZXJhdGVkQ29kZVN0cjogZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nOiBjc3NTdHJpbmcgfSk7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gdm9pZCAwO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBqdXN0aWZ5Q29udGVudENzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBTUEFDRV9CRVRXRUVOOiAnc3BhY2UtYmV0d2Vlbidcbn07XG52YXIgYWxpZ25JdGVtc0Nzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJ1xufTtcbnZhciB0ZXh0QWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgSlVTVElGSUVEOiAnanVzdGlmeSdcbn07XG52YXIgdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgVE9QOiAndG9wJyxcbiAgICBDRU5URVI6ICdtaWRkbGUnLFxuICAgIEJPVFRPTTogJ2JvdHRvbSdcbn07XG52YXIgdGV4dERlY29yYXRpb25Dc3NWYWx1ZXMgPSB7XG4gICAgVU5ERVJMSU5FOiAndW5kZXJsaW5lJyxcbiAgICBTVFJJTEVUSFJPVUdIOiAnbGluZS10aHJvdWdoJ1xufTtcbmZ1bmN0aW9uIGdldENzc0RhdGFGb3JUYWcobm9kZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgYXMgYW4gaW1nIHRhZ1xuICAgIGlmIChub2RlLnZpc2libGUgJiYgbm9kZS50eXBlICE9PSAnVkVDVE9SJykge1xuICAgICAgICBpZiAoJ29wYWNpdHknIGluIG5vZGUgJiYgbm9kZS5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ29wYWNpdHknLCB2YWx1ZTogbm9kZS5vcGFjaXR5IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnJvdGF0aW9uICE9PSAwKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndHJhbnNmb3JtJywgdmFsdWU6IFwicm90YXRlKFwiICsgTWF0aC5mbG9vcihub2RlLnJvdGF0aW9uKSArIFwiZGVnKVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2Rpc3BsYXknLCB2YWx1ZTogJ2ZsZXgnIH0pO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdmbGV4LWRpcmVjdGlvbicsIHZhbHVlOiBub2RlLmxheW91dE1vZGUgPT09ICdIT1JJWk9OVEFMJyA/ICdyb3cnIDogJ2NvbHVtbicgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2p1c3RpZnktY29udGVudCcsIHZhbHVlOiBqdXN0aWZ5Q29udGVudENzc1ZhbHVlc1tub2RlLnByaW1hcnlBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2FsaWduLWl0ZW1zJywgdmFsdWU6IGFsaWduSXRlbXNDc3NWYWx1ZXNbbm9kZS5jb3VudGVyQXhpc0FsaWduSXRlbXNdIH0pO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0JvdHRvbSAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ0xlZnQgJiYgbm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ0xlZnQgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHggXCIgKyBub2RlLnBhZGRpbmdMZWZ0ICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ1JpZ2h0ICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0JvdHRvbSArIFwicHggXCIgKyBub2RlLnBhZGRpbmdMZWZ0ICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZ2FwJywgdmFsdWU6IG5vZGUuaXRlbVNwYWNpbmcgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCAmJiBub2RlLmZpbGxzWzBdLnR5cGUgIT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScpIHtcbiAgICAgICAgICAgIHZhciBib3JkZXJSYWRpdXNWYWx1ZSA9IGdldEJvcmRlclJhZGl1c1N0cmluZyhub2RlKTtcbiAgICAgICAgICAgIGlmIChib3JkZXJSYWRpdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXItcmFkaXVzJywgdmFsdWU6IGJvcmRlclJhZGl1c1ZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0ZXh0LWFsaWduJywgdmFsdWU6IHRleHRBbGlnbkNzc1ZhbHVlc1tub2RlLnRleHRBbGlnbkhvcml6b250YWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3ZlcnRpY2FsLWFsaWduJywgdmFsdWU6IHRleHRWZXJ0aWNhbEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduVmVydGljYWxdIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtc2l6ZScsIHZhbHVlOiBub2RlLmZvbnRTaXplICsgXCJweFwiIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZvbnQtZmFtaWx5JywgdmFsdWU6IG5vZGUuZm9udE5hbWUuZmFtaWx5IH0pO1xuICAgICAgICAgICAgdmFyIGxldHRlclNwYWNpbmcgPSBub2RlLmxldHRlclNwYWNpbmc7XG4gICAgICAgICAgICBpZiAobGV0dGVyU3BhY2luZy52YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdsZXR0ZXItc3BhY2luZycsIHZhbHVlOiBsZXR0ZXJTcGFjaW5nLnZhbHVlICsgKGxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUycgPyAncHgnIDogJyUnKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2xpbmUtaGVpZ2h0JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbm9kZS5saW5lSGVpZ2h0LnVuaXQgPT09ICdBVVRPJ1xuICAgICAgICAgICAgICAgICAgICA/ICdhdXRvJ1xuICAgICAgICAgICAgICAgICAgICA6IG5vZGUubGluZUhlaWdodC52YWx1ZSArIChub2RlLmxldHRlclNwYWNpbmcudW5pdCA9PT0gJ1BJWEVMUycgPyAncHgnIDogJyUnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS50ZXh0RGVjb3JhdGlvbiAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtZGVjb3JhdGlvbicsIHZhbHVlOiB0ZXh0RGVjb3JhdGlvbkNzc1ZhbHVlc1tub2RlLnRleHREZWNvcmF0aW9uXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLmZpbGxzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdjb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnTElORScpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdoZWlnaHQnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLmhlaWdodCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS53aWR0aCkgKyAncHgnIH0pO1xuICAgICAgICAgICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5zdHJva2VzWzBdO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdib3JkZXInLCB2YWx1ZTogbm9kZS5zdHJva2VXZWlnaHQgKyBcInB4IHNvbGlkIFwiICsgYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0dST1VQJyB8fCBub2RlLnR5cGUgPT09ICdFTExJUFNFJyB8fCBub2RlLnR5cGUgPT09ICdQT0xZR09OJyB8fCBub2RlLnR5cGUgPT09ICdTVEFSJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaXNJbWFnZSA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBuYW1lIFRleHQgbm9kZSBhcyBcIlRleHRcIiBzaW5jZSBuYW1lIG9mIHRleHQgbm9kZSBpcyBvZnRlbiB0aGUgY29udGVudCBvZiB0aGUgbm9kZSBhbmQgaXMgbm90IGFwcHJvcHJpYXRlIGFzIGEgbmFtZVxuICAgICAgICAgICAgY2xhc3NOYW1lOiBpc0ltYWdlID8gJ2ltZycgOiBub2RlLnR5cGUgPT09ICdURVhUJyA/ICd0ZXh0JyA6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5leHBvcnRzLmdldENzc0RhdGFGb3JUYWcgPSBnZXRDc3NEYXRhRm9yVGFnO1xuZnVuY3Rpb24gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpIHtcbiAgICBpZiAobm9kZS5jb3JuZXJSYWRpdXMgIT09IDApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlLmNvcm5lclJhZGl1cyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLnRvcExlZnRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS50b3BSaWdodFJhZGl1cyArIFwicHggXCIgKyBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzICsgXCJweCBcIiArIG5vZGUuYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5jb3JuZXJSYWRpdXMgKyBcInB4XCI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmdiVmFsdWVUb0hleCh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogMjU1KS50b1N0cmluZygxNik7XG59XG5mdW5jdGlvbiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgaWYgKHBhaW50Lm9wYWNpdHkgIT09IHVuZGVmaW5lZCAmJiBwYWludC5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuciAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmcgKiAyNTUpICsgXCIsIFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5iICogMjU1KSArIFwiLCBcIiArIHBhaW50Lm9wYWNpdHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLnIpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5nKSArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IuYik7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tb2RpZnlUcmVlRm9yQ29tcG9uZW50ID0gdm9pZCAwO1xudmFyIGNvbXBvbmVudHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnU3BhY2VyJyxcbiAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09ICdTcGFjZXInICYmICghKCdjaGlsZHJlbicgaW4gbm9kZSkgfHwgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApO1xuICAgICAgICB9LFxuICAgICAgICBtb2RpZnlGdW5jOiBmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICBpZiAodGFnLm5vZGUud2lkdGggPiB0YWcubm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0YWcucHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiB0YWcubm9kZS5oZWlnaHQudG9TdHJpbmcoKSwgbm90U3RyaW5nVmFsdWU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWcucHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3dpZHRoJywgdmFsdWU6IHRhZy5ub2RlLndpZHRoLnRvU3RyaW5nKCksIG5vdFN0cmluZ1ZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFnLmlzQ29tcG9uZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgIH1cbiAgICB9XG5dO1xuZnVuY3Rpb24gbW9kaWZ5KHRhZywgX2ZpZ21hKSB7XG4gICAgaWYgKCF0YWcgfHwgIXRhZy5ub2RlKSB7XG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICAgIHZhciBtb2RpZmllZE9uY2UgPSBmYWxzZTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNldHRpbmcpIHtcbiAgICAgICAgaWYgKCFtb2RpZmllZE9uY2UgJiYgc2V0dGluZy5tYXRjaGVyKHRhZy5ub2RlKSkge1xuICAgICAgICAgICAgdGFnID0gc2V0dGluZy5tb2RpZnlGdW5jKHRhZywgX2ZpZ21hKTtcbiAgICAgICAgICAgIG1vZGlmaWVkT25jZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGFnO1xufVxuZnVuY3Rpb24gbW9kaWZ5VHJlZUZvckNvbXBvbmVudCh0cmVlLCBfZmlnbWEpIHtcbiAgICB2YXIgbmV3VGFnID0gbW9kaWZ5KHRyZWUsIF9maWdtYSk7XG4gICAgbmV3VGFnLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpbmRleCkge1xuICAgICAgICBuZXdUYWcuY2hpbGRyZW5baW5kZXhdID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudChjaGlsZCwgX2ZpZ21hKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHJlZTtcbn1cbmV4cG9ydHMubW9kaWZ5VHJlZUZvckNvbXBvbmVudCA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSB2b2lkIDA7XG5mdW5jdGlvbiBpc0ltYWdlTm9kZShub2RlKSB7XG4gICAgLy8g5LiL6YOo44GrIFZlY3RvciDjgZfjgYvlrZjlnKjjgZfjgarjgYTjgoLjga7jga/nlLvlg4/jgajliKTlrprjgZnjgotcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaGFzT25seVZlY3Rvcl8xID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgICAgICAgICAgaGFzT25seVZlY3Rvcl8xID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaGFzT25seVZlY3Rvcl8xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdWRUNUT1InKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScpIHtcbiAgICAgICAgaWYgKG5vZGUuZmlsbHMuZmluZChmdW5jdGlvbiAocGFpbnQpIHsgcmV0dXJuIHBhaW50LnR5cGUgPT09ICdJTUFHRSc7IH0pICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuaXNJbWFnZU5vZGUgPSBpc0ltYWdlTm9kZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5rZWJhYlRvVXBwZXJDYW1lbCA9IGV4cG9ydHMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyID0gZXhwb3J0cy5rZWJhYml6ZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGtlYmFiaXplKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsZXR0ZXIsIGlkeCkge1xuICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCkgPT09IGxldHRlciA/IFwiXCIgKyAoaWR4ICE9PSAwID8gJy0nIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJycpO1xufVxuZXhwb3J0cy5rZWJhYml6ZSA9IGtlYmFiaXplO1xuZnVuY3Rpb24gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHN0cikge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5leHBvcnRzLmNhcGl0YWxpemVGaXJzdExldHRlciA9IGNhcGl0YWxpemVGaXJzdExldHRlcjtcbmZ1bmN0aW9uIGtlYmFiVG9VcHBlckNhbWVsKHN0cikge1xuICAgIHJldHVybiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyLnNwbGl0KC8tfF8vZykubWFwKGNhcGl0YWxpemVGaXJzdExldHRlcikuam9pbignJykpO1xufVxuZXhwb3J0cy5rZWJhYlRvVXBwZXJDYW1lbCA9IGtlYmFiVG9VcHBlckNhbWVsO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb2RlLnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==