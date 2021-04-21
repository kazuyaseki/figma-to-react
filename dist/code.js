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
function buildJsxString(tag, cssStyle, level) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2J1aWxkQ3NzU3RyaW5nLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvYnVpbGRUYWdUcmVlLnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuLy4vc3JjL2dldENzc0RhdGFGb3JUYWcudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy9tb2RpZnlUcmVlRm9yQ29tcG9uZW50LnRzIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vLi9zcmMvdXRpbHMvaXNJbWFnZU5vZGUudHMiLCJ3ZWJwYWNrOi8vcmVhY3QtY29kZWdlbi8uL3NyYy91dGlscy9zdHJpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9yZWFjdC1jb2RlZ2VuL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlYWN0LWNvZGVnZW4vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIsb0JBQW9CLG1CQUFPLENBQUMsdURBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBLDhDQUE4QywrQkFBK0IsRUFBRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COzs7Ozs7Ozs7OztBQzFCTjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCx5QkFBeUIsR0FBRyw2QkFBNkIsR0FBRyxnQkFBZ0I7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7Ozs7Ozs7VUNuQnpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VDckJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRDb2RlID0gdm9pZCAwO1xudmFyIHN0cmluZ1V0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmdVdGlsc1wiKTtcbmZ1bmN0aW9uIGJ1aWxkU3BhY2VzKGJhc2VTcGFjZXMsIGxldmVsKSB7XG4gICAgdmFyIHNwYWNlc1N0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZVNwYWNlczsgaSsrKSB7XG4gICAgICAgIHNwYWNlc1N0ciArPSAnICc7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWw7IGkrKykge1xuICAgICAgICBzcGFjZXNTdHIgKz0gJyAgJztcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlc1N0cjtcbn1cbmZ1bmN0aW9uIGd1ZXNzVGFnTmFtZShuYW1lKSB7XG4gICAgdmFyIF9uYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChfbmFtZS5pbmNsdWRlcygnYnV0dG9uJykpIHtcbiAgICAgICAgcmV0dXJuICdidXR0b24nO1xuICAgIH1cbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ3NlY3Rpb24nKSkge1xuICAgICAgICByZXR1cm4gJ3NlY3Rpb24nO1xuICAgIH1cbiAgICBpZiAoX25hbWUuaW5jbHVkZXMoJ2FydGljbGUnKSkge1xuICAgICAgICByZXR1cm4gJ2FydGljbGUnO1xuICAgIH1cbiAgICByZXR1cm4gJ2Rpdic7XG59XG5mdW5jdGlvbiBnZXRUYWdOYW1lKHRhZywgY3NzU3R5bGUpIHtcbiAgICBpZiAoY3NzU3R5bGUgPT09ICdjc3MnICYmICF0YWcuaXNDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRhZy5pc0ltZykge1xuICAgICAgICAgICAgcmV0dXJuICdpbWcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWcuaXNUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ3AnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBndWVzc1RhZ05hbWUodGFnLm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGFnLmlzVGV4dCA/ICdUZXh0JyA6IHRhZy5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJyk7XG59XG5mdW5jdGlvbiBnZXRDbGFzc05hbWUodGFnLCBjc3NTdHlsZSkge1xuICAgIGlmIChjc3NTdHlsZSA9PT0gJ2NzcycgJiYgIXRhZy5pc0NvbXBvbmVudCkge1xuICAgICAgICBpZiAodGFnLmlzSW1nKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZy5pc1RleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAnIGNsYXNzTmFtZT1cInRleHRcIic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiIGNsYXNzTmFtZT1cXFwiXCIgKyBzdHJpbmdVdGlsc18xLmtlYmFiaXplKHRhZy5uYW1lKSArIFwiXFxcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5mdW5jdGlvbiBidWlsZEpzeFN0cmluZyh0YWcsIGNzc1N0eWxlLCBsZXZlbCkge1xuICAgIHZhciBzcGFjZVN0cmluZyA9IGJ1aWxkU3BhY2VzKDQsIGxldmVsKTtcbiAgICB2YXIgaGFzQ2hpbGRyZW4gPSB0YWcuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB2YXIgdGFnTmFtZSA9IGdldFRhZ05hbWUodGFnLCBjc3NTdHlsZSk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGdldENsYXNzTmFtZSh0YWcsIGNzc1N0eWxlKTtcbiAgICB2YXIgcHJvcGVydGllcyA9IHRhZy5wcm9wZXJ0aWVzXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHByb3ApIHsgcmV0dXJuIFwiIFwiICsgcHJvcC5uYW1lICsgKHByb3AudmFsdWUgIT09IG51bGwgPyBcIj1cIiArIChwcm9wLm5vdFN0cmluZ1ZhbHVlID8gJ3snIDogJ1wiJykgKyBwcm9wLnZhbHVlICsgKHByb3Aubm90U3RyaW5nVmFsdWUgPyAnfScgOiAnXCInKSA6ICcnKTsgfSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIHZhciBvcGVuaW5nVGFnID0gc3BhY2VTdHJpbmcgKyBcIjxcIiArIHRhZ05hbWUgKyBjbGFzc05hbWUgKyBwcm9wZXJ0aWVzICsgKGhhc0NoaWxkcmVuIHx8IHRhZy5pc1RleHQgPyBcIlwiIDogJyAvJykgKyBcIj5cIjtcbiAgICB2YXIgY2hpbGRUYWdzID0gaGFzQ2hpbGRyZW5cbiAgICAgICAgPyAnXFxuJyArIHRhZy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBidWlsZEpzeFN0cmluZyhjaGlsZCwgY3NzU3R5bGUsIGxldmVsICsgMSk7IH0pLmpvaW4oJ1xcbicpXG4gICAgICAgIDogdGFnLmlzVGV4dFxuICAgICAgICAgICAgPyBcIlxcblwiICsgYnVpbGRTcGFjZXMoNCwgbGV2ZWwgKyAxKSArIHRhZy50ZXh0Q2hhcmFjdGVyc1xuICAgICAgICAgICAgOiAnJztcbiAgICB2YXIgY2xvc2luZ1RhZyA9IGhhc0NoaWxkcmVuIHx8IHRhZy5pc1RleHQgPyBcIlxcblwiICsgc3BhY2VTdHJpbmcgKyBcIjwvXCIgKyB0YWdOYW1lICsgXCI+XCIgOiAnJztcbiAgICByZXR1cm4gb3BlbmluZ1RhZyArIGNoaWxkVGFncyArIGNsb3NpbmdUYWc7XG59XG5mdW5jdGlvbiBidWlsZENvZGUodGFnLCBjc3MpIHtcbiAgICByZXR1cm4gXCJjb25zdCBcIiArIHRhZy5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJykgKyBcIjogUmVhY3QuVkZDID0gKCkgPT4ge1xcbiAgcmV0dXJuIChcXG5cIiArIGJ1aWxkSnN4U3RyaW5nKHRhZywgY3NzLCAwKSArIFwiXFxuICApXFxufVwiO1xufVxuZXhwb3J0cy5idWlsZENvZGUgPSBidWlsZENvZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRDc3NTdHJpbmcgPSB2b2lkIDA7XG52YXIgc3RyaW5nVXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZ1V0aWxzXCIpO1xuZnVuY3Rpb24gYnVpbGRBcnJheSh0YWcsIGFycikge1xuICAgIGFyci5wdXNoKHRhZy5jc3MpO1xuICAgIHRhZy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBhcnIgPSBidWlsZEFycmF5KGNoaWxkLCBhcnIpO1xuICAgIH0pO1xuICAgIHJldHVybiBhcnI7XG59XG5mdW5jdGlvbiBidWlsZENzc1N0cmluZyh0YWcsIGNzc1N0eWxlKSB7XG4gICAgdmFyIGNzc0FycmF5ID0gYnVpbGRBcnJheSh0YWcsIFtdKTtcbiAgICB2YXIgY29kZVN0ciA9ICcnO1xuICAgIGNzc0FycmF5LmZvckVhY2goZnVuY3Rpb24gKGNzc0RhdGEpIHtcbiAgICAgICAgdmFyIGNzc1N0ciA9IGNzc1N0eWxlID09PSAnc3R5bGVkLWNvbXBvbmVudHMnXG4gICAgICAgICAgICA/IFwiY29uc3QgXCIgKyBjc3NEYXRhLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMvZywgJycpICsgXCIgPSBzdHlsZWQuZGl2YFxcblwiICsgY3NzRGF0YS5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbiAocHJvcGVydHkpIHsgcmV0dXJuIFwiICBcIiArIHByb3BlcnR5Lm5hbWUgKyBcIjogXCIgKyBwcm9wZXJ0eS52YWx1ZSArIFwiO1wiOyB9KS5qb2luKCdcXG4nKSArIFwiXFxuYFxcblwiXG4gICAgICAgICAgICA6IFwiLlwiICsgc3RyaW5nVXRpbHNfMS5rZWJhYml6ZShjc3NEYXRhLmNsYXNzTmFtZSkgKyBcIiB7XFxuXCIgKyBjc3NEYXRhLnByb3BlcnRpZXMubWFwKGZ1bmN0aW9uIChwcm9wZXJ0eSkgeyByZXR1cm4gXCIgIFwiICsgcHJvcGVydHkubmFtZSArIFwiOiBcIiArIHByb3BlcnR5LnZhbHVlICsgXCI7XCI7IH0pLmpvaW4oJ1xcbicpICsgXCJcXG59XFxuXCI7XG4gICAgICAgIGNvZGVTdHIgKz0gY3NzU3RyO1xuICAgIH0pO1xuICAgIHJldHVybiBjb2RlU3RyO1xufVxuZXhwb3J0cy5idWlsZENzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IHZvaWQgMDtcbnZhciBnZXRDc3NEYXRhRm9yVGFnXzEgPSByZXF1aXJlKFwiLi9nZXRDc3NEYXRhRm9yVGFnXCIpO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbmZ1bmN0aW9uIGJ1aWxkVGFnVHJlZShub2RlKSB7XG4gICAgaWYgKCFub2RlLnZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBpc0ltZyA9IGlzSW1hZ2VOb2RlXzEuaXNJbWFnZU5vZGUobm9kZSk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcbiAgICBpZiAoaXNJbWcpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3NyYycsIHZhbHVlOiAnJyB9KTtcbiAgICB9XG4gICAgdmFyIGNoaWxkVGFncyA9IFtdO1xuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgIWlzSW1nKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkVGFncy5wdXNoKGJ1aWxkVGFnVHJlZShjaGlsZCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHRhZyA9IHtcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICBpc1RleHQ6IG5vZGUudHlwZSA9PT0gJ1RFWFQnLFxuICAgICAgICB0ZXh0Q2hhcmFjdGVyczogbm9kZS50eXBlID09PSAnVEVYVCcgPyBub2RlLmNoYXJhY3RlcnMgOiBudWxsLFxuICAgICAgICBpc0ltZzogaXNJbWcsXG4gICAgICAgIGNzczogZ2V0Q3NzRGF0YUZvclRhZ18xLmdldENzc0RhdGFGb3JUYWcobm9kZSksXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZFRhZ3MsXG4gICAgICAgIG5vZGU6IG5vZGVcbiAgICB9O1xuICAgIHJldHVybiB0YWc7XG59XG5leHBvcnRzLmJ1aWxkVGFnVHJlZSA9IGJ1aWxkVGFnVHJlZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9tb2RpZnlUcmVlRm9yQ29tcG9uZW50XCIpO1xudmFyIGJ1aWxkQ29kZV8xID0gcmVxdWlyZShcIi4vYnVpbGRDb2RlXCIpO1xudmFyIGJ1aWxkVGFnVHJlZV8xID0gcmVxdWlyZShcIi4vYnVpbGRUYWdUcmVlXCIpO1xudmFyIGJ1aWxkQ3NzU3RyaW5nXzEgPSByZXF1aXJlKFwiLi9idWlsZENzc1N0cmluZ1wiKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDgwLCBoZWlnaHQ6IDQ0MCB9KTtcbnZhciBzZWxlY3RlZE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xudmFyIENTU19TVFlMRV9LRVkgPSAnQ1NTX1NUWUxFX0tFWSc7XG5mdW5jdGlvbiBnZW5lcmF0ZShub2RlLCBjc3NTdHlsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9jc3MsIHRhZywgZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY3NzID0gY3NzU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIV9jc3MpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKENTU19TVFlMRV9LRVkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9jc3MgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2Nzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NzcyA9ICdjc3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IG1vZGlmeVRyZWVGb3JDb21wb25lbnRfMS5tb2RpZnlUcmVlRm9yQ29tcG9uZW50KGJ1aWxkVGFnVHJlZV8xLmJ1aWxkVGFnVHJlZShub2RlKSwgZmlnbWEpO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWRDb2RlU3RyID0gYnVpbGRDb2RlXzEuYnVpbGRDb2RlKHRhZywgX2Nzcyk7XG4gICAgICAgICAgICAgICAgICAgIGNzc1N0cmluZyA9IGJ1aWxkQ3NzU3RyaW5nXzEuYnVpbGRDc3NTdHJpbmcodGFnLCBfY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBnZW5lcmF0ZWRDb2RlU3RyOiBnZW5lcmF0ZWRDb2RlU3RyLCBjc3NTdHJpbmc6IGNzc1N0cmluZywgY3NzU3R5bGU6IF9jc3MgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5pZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IG9ubHkgMSBub2RlJyk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbmVsc2UgaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IGEgbm9kZScpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5lbHNlIHtcbiAgICBnZW5lcmF0ZShzZWxlY3RlZE5vZGVzWzBdKTtcbn1cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdub3RpZnktY29weS1zdWNjZXNzJykge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ2NvcGllZCB0byBjbGlwYm9hcmTwn5GNJyk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ25ldy1jc3Mtc3R5bGUtc2V0Jykge1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKENTU19TVFlMRV9LRVksIG1zZy5jc3NTdHlsZSk7XG4gICAgICAgIHZhciB0YWcgPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50XzEubW9kaWZ5VHJlZUZvckNvbXBvbmVudChidWlsZFRhZ1RyZWVfMS5idWlsZFRhZ1RyZWUoc2VsZWN0ZWROb2Rlc1swXSksIGZpZ21hKTtcbiAgICAgICAgdmFyIGdlbmVyYXRlZENvZGVTdHIgPSBidWlsZENvZGVfMS5idWlsZENvZGUodGFnLCBtc2cuY3NzU3R5bGUpO1xuICAgICAgICB2YXIgY3NzU3RyaW5nID0gYnVpbGRDc3NTdHJpbmdfMS5idWlsZENzc1N0cmluZyh0YWcsIG1zZy5jc3NTdHlsZSk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgZ2VuZXJhdGVkQ29kZVN0cjogZ2VuZXJhdGVkQ29kZVN0ciwgY3NzU3RyaW5nOiBjc3NTdHJpbmcgfSk7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRDc3NEYXRhRm9yVGFnID0gdm9pZCAwO1xudmFyIGlzSW1hZ2VOb2RlXzEgPSByZXF1aXJlKFwiLi91dGlscy9pc0ltYWdlTm9kZVwiKTtcbnZhciBqdXN0aWZ5Q29udGVudENzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBTUEFDRV9CRVRXRUVOOiAnc3BhY2UtYmV0d2Vlbidcbn07XG52YXIgYWxpZ25JdGVtc0Nzc1ZhbHVlcyA9IHtcbiAgICBNSU46ICdmbGV4LXN0YXJ0JyxcbiAgICBNQVg6ICdmbGV4LWVuZCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJ1xufTtcbnZhciB0ZXh0QWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnLFxuICAgIENFTlRFUjogJ2NlbnRlcicsXG4gICAgSlVTVElGSUVEOiAnanVzdGlmeSdcbn07XG52YXIgdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXMgPSB7XG4gICAgVE9QOiAndG9wJyxcbiAgICBDRU5URVI6ICdtaWRkbGUnLFxuICAgIEJPVFRPTTogJ2JvdHRvbSdcbn07XG52YXIgdGV4dERlY29yYXRpb25Dc3NWYWx1ZXMgPSB7XG4gICAgVU5ERVJMSU5FOiAndW5kZXJsaW5lJyxcbiAgICBTVFJJTEVUSFJPVUdIOiAnbGluZS10aHJvdWdoJ1xufTtcbmZ1bmN0aW9uIGdldENzc0RhdGFGb3JUYWcobm9kZSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gW107XG4gICAgLy8gc2tpcCB2ZWN0b3Igc2luY2UgaXQncyBvZnRlbiBkaXNwbGF5ZWQgd2l0aCBpbWcgdGFnXG4gICAgaWYgKG5vZGUudmlzaWJsZSAmJiBub2RlLnR5cGUgIT09ICdWRUNUT1InKSB7XG4gICAgICAgIGlmICgnb3BhY2l0eScgaW4gbm9kZSAmJiBub2RlLm9wYWNpdHkgPCAxKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnb3BhY2l0eScsIHZhbHVlOiBub2RlLm9wYWNpdHkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUucm90YXRpb24gIT09IDApIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd0cmFuc2Zvcm0nLCB2YWx1ZTogXCJyb3RhdGUoXCIgKyBNYXRoLmZsb29yKG5vZGUucm90YXRpb24pICsgXCJkZWcpXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZGlzcGxheScsIHZhbHVlOiAnZmxleCcgfSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2ZsZXgtZGlyZWN0aW9uJywgdmFsdWU6IG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnID8gJ3JvdycgOiAnY29sdW1uJyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnanVzdGlmeS1jb250ZW50JywgdmFsdWU6IGp1c3RpZnlDb250ZW50Q3NzVmFsdWVzW25vZGUucHJpbWFyeUF4aXNBbGlnbkl0ZW1zXSB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYWxpZ24taXRlbXMnLCB2YWx1ZTogYWxpZ25JdGVtc0Nzc1ZhbHVlc1tub2RlLmNvdW50ZXJBeGlzQWxpZ25JdGVtc10gfSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nQm90dG9tICYmIG5vZGUucGFkZGluZ1RvcCA9PT0gbm9kZS5wYWRkaW5nTGVmdCAmJiBub2RlLnBhZGRpbmdUb3AgPT09IG5vZGUucGFkZGluZ1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdwYWRkaW5nJywgdmFsdWU6IG5vZGUucGFkZGluZ1RvcCArIFwicHhcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYWRkaW5nVG9wID09PSBub2RlLnBhZGRpbmdCb3R0b20gJiYgbm9kZS5wYWRkaW5nTGVmdCA9PT0gbm9kZS5wYWRkaW5nUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3BhZGRpbmcnLCB2YWx1ZTogbm9kZS5wYWRkaW5nVG9wICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAncGFkZGluZycsIHZhbHVlOiBub2RlLnBhZGRpbmdUb3AgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nUmlnaHQgKyBcInB4IFwiICsgbm9kZS5wYWRkaW5nQm90dG9tICsgXCJweCBcIiArIG5vZGUucGFkZGluZ0xlZnQgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICdnYXAnLCB2YWx1ZTogbm9kZS5pdGVtU3BhY2luZyArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5maWxscy5sZW5ndGggPiAwICYmIG5vZGUuZmlsbHNbMF0udHlwZSAhPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogYnVpbGRDb2xvclN0cmluZyhwYWludCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICAgICAgdmFyIGJvcmRlclJhZGl1c1ZhbHVlID0gZ2V0Qm9yZGVyUmFkaXVzU3RyaW5nKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGJvcmRlclJhZGl1c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlci1yYWRpdXMnLCB2YWx1ZTogYm9yZGVyUmFkaXVzVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLmZpbGxzLmxlbmd0aCA+IDAgJiYgbm9kZS5maWxsc1swXS50eXBlICE9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaW50ID0gbm9kZS5maWxsc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuc3Ryb2tlc1swXTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnYm9yZGVyJywgdmFsdWU6IG5vZGUuc3Ryb2tlV2VpZ2h0ICsgXCJweCBzb2xpZCBcIiArIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ3RleHQtYWxpZ24nLCB2YWx1ZTogdGV4dEFsaWduQ3NzVmFsdWVzW25vZGUudGV4dEFsaWduSG9yaXpvbnRhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndmVydGljYWwtYWxpZ24nLCB2YWx1ZTogdGV4dFZlcnRpY2FsQWxpZ25Dc3NWYWx1ZXNbbm9kZS50ZXh0QWxpZ25WZXJ0aWNhbF0gfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1zaXplJywgdmFsdWU6IG5vZGUuZm9udFNpemUgKyBcInB4XCIgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnZm9udC1mYW1pbHknLCB2YWx1ZTogbm9kZS5mb250TmFtZS5mYW1pbHkgfSk7XG4gICAgICAgICAgICB2YXIgbGV0dGVyU3BhY2luZyA9IG5vZGUubGV0dGVyU3BhY2luZztcbiAgICAgICAgICAgIGlmIChsZXR0ZXJTcGFjaW5nLnZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2xldHRlci1zcGFjaW5nJywgdmFsdWU6IGxldHRlclNwYWNpbmcudmFsdWUgKyAobGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGluZS1oZWlnaHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLmxpbmVIZWlnaHQudW5pdCA9PT0gJ0FVVE8nXG4gICAgICAgICAgICAgICAgICAgID8gJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIDogbm9kZS5saW5lSGVpZ2h0LnZhbHVlICsgKG5vZGUubGV0dGVyU3BhY2luZy51bml0ID09PSAnUElYRUxTJyA/ICdweCcgOiAnJScpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChub2RlLnRleHREZWNvcmF0aW9uICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAndGV4dC1kZWNvcmF0aW9uJywgdmFsdWU6IHRleHREZWNvcmF0aW9uQ3NzVmFsdWVzW25vZGUudGV4dERlY29yYXRpb25dIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwYWludCA9IG5vZGUuZmlsbHNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2NvbG9yJywgdmFsdWU6IGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMSU5FJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2hlaWdodCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUuaGVpZ2h0KSArICdweCcgfSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogTWF0aC5mbG9vcihub2RlLndpZHRoKSArICdweCcgfSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpbnQgPSBub2RlLnN0cm9rZXNbMF07XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHsgbmFtZTogJ2JvcmRlcicsIHZhbHVlOiBub2RlLnN0cm9rZVdlaWdodCArIFwicHggc29saWQgXCIgKyBidWlsZENvbG9yU3RyaW5nKHBhaW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnR1JPVVAnIHx8IG5vZGUudHlwZSA9PT0gJ0VMTElQU0UnIHx8IG5vZGUudHlwZSA9PT0gJ1BPTFlHT04nIHx8IG5vZGUudHlwZSA9PT0gJ1NUQVInKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IE1hdGguZmxvb3Iobm9kZS5oZWlnaHQpICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh7IG5hbWU6ICd3aWR0aCcsIHZhbHVlOiBNYXRoLmZsb29yKG5vZGUud2lkdGgpICsgJ3B4JyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpc0ltYWdlID0gaXNJbWFnZU5vZGVfMS5pc0ltYWdlTm9kZShub2RlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIG5hbWUgVGV4dCBub2RlIGFzIFwiVGV4dFwiIHNpbmNlIG5hbWUgb2YgdGV4dCBub2RlIGlzIG9mdGVuIHRoZSBjb250ZW50IG9mIHRoZSBub2RlIGFuZCBpcyBub3QgYXBwcm9wcmlhdGUgYXMgYSBuYW1lXG4gICAgICAgICAgICBjbGFzc05hbWU6IGlzSW1hZ2UgPyAnaW1nJyA6IG5vZGUudHlwZSA9PT0gJ1RFWFQnID8gJ3RleHQnIDogbm9kZS5uYW1lLFxuICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmV4cG9ydHMuZ2V0Q3NzRGF0YUZvclRhZyA9IGdldENzc0RhdGFGb3JUYWc7XG5mdW5jdGlvbiBnZXRCb3JkZXJSYWRpdXNTdHJpbmcobm9kZSkge1xuICAgIGlmIChub2RlLmNvcm5lclJhZGl1cyAhPT0gMCkge1xuICAgICAgICBpZiAodHlwZW9mIG5vZGUuY29ybmVyUmFkaXVzICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUudG9wTGVmdFJhZGl1cyArIFwicHggXCIgKyBub2RlLnRvcFJpZ2h0UmFkaXVzICsgXCJweCBcIiArIG5vZGUuYm90dG9tUmlnaHRSYWRpdXMgKyBcInB4IFwiICsgbm9kZS5ib3R0b21MZWZ0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmNvcm5lclJhZGl1cyArIFwicHhcIjtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiByZ2JWYWx1ZVRvSGV4KHZhbHVlKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbn1cbmZ1bmN0aW9uIGJ1aWxkQ29sb3JTdHJpbmcocGFpbnQpIHtcbiAgICBpZiAocGFpbnQudHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICBpZiAocGFpbnQub3BhY2l0eSAhPT0gdW5kZWZpbmVkICYmIHBhaW50Lm9wYWNpdHkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgTWF0aC5mbG9vcihwYWludC5jb2xvci5yICogMjU1KSArIFwiLCBcIiArIE1hdGguZmxvb3IocGFpbnQuY29sb3IuZyAqIDI1NSkgKyBcIiwgXCIgKyBNYXRoLmZsb29yKHBhaW50LmNvbG9yLmIgKiAyNTUpICsgXCIsIFwiICsgcGFpbnQub3BhY2l0eSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIiNcIiArIHJnYlZhbHVlVG9IZXgocGFpbnQuY29sb3IucikgKyByZ2JWYWx1ZVRvSGV4KHBhaW50LmNvbG9yLmcpICsgcmdiVmFsdWVUb0hleChwYWludC5jb2xvci5iKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1vZGlmeVRyZWVGb3JDb21wb25lbnQgPSB2b2lkIDA7XG52YXIgY29tcG9uZW50cyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdTcGFjZXInLFxuICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gJ1NwYWNlcicgJiYgKCEoJ2NoaWxkcmVuJyBpbiBub2RlKSB8fCBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vZGlmeUZ1bmM6IGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICAgIGlmICh0YWcubm9kZS53aWR0aCA+IHRhZy5ub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRhZy5wcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IHRhZy5ub2RlLmhlaWdodC50b1N0cmluZygpLCBub3RTdHJpbmdWYWx1ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhZy5wcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiAnd2lkdGgnLCB2YWx1ZTogdGFnLm5vZGUud2lkdGgudG9TdHJpbmcoKSwgbm90U3RyaW5nVmFsdWU6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWcuaXNDb21wb25lbnQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgfVxuICAgIH1cbl07XG5mdW5jdGlvbiBtb2RpZnkodGFnLCBfZmlnbWEpIHtcbiAgICBpZiAoIXRhZyB8fCAhdGFnLm5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gICAgdmFyIG1vZGlmaWVkT25jZSA9IGZhbHNlO1xuICAgIGNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2V0dGluZykge1xuICAgICAgICBpZiAoIW1vZGlmaWVkT25jZSAmJiBzZXR0aW5nLm1hdGNoZXIodGFnLm5vZGUpKSB7XG4gICAgICAgICAgICB0YWcgPSBzZXR0aW5nLm1vZGlmeUZ1bmModGFnLCBfZmlnbWEpO1xuICAgICAgICAgICAgbW9kaWZpZWRPbmNlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0YWc7XG59XG5mdW5jdGlvbiBtb2RpZnlUcmVlRm9yQ29tcG9uZW50KHRyZWUsIF9maWdtYSkge1xuICAgIHZhciBuZXdUYWcgPSBtb2RpZnkodHJlZSwgX2ZpZ21hKTtcbiAgICBuZXdUYWcuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGluZGV4KSB7XG4gICAgICAgIG5ld1RhZy5jaGlsZHJlbltpbmRleF0gPSBtb2RpZnlUcmVlRm9yQ29tcG9uZW50KGNoaWxkLCBfZmlnbWEpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cmVlO1xufVxuZXhwb3J0cy5tb2RpZnlUcmVlRm9yQ29tcG9uZW50ID0gbW9kaWZ5VHJlZUZvckNvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0ltYWdlTm9kZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGlzSW1hZ2VOb2RlKG5vZGUpIHtcbiAgICAvLyDkuIvpg6jjgasgVmVjdG9yIOOBl+OBi+WtmOWcqOOBl+OBquOBhOOCguOBruOBr+eUu+WDj+OBqOWIpOWumuOBmeOCi1xuICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBoYXNPbmx5VmVjdG9yXzEgPSB0cnVlO1xuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQudHlwZSAhPT0gJ1ZFQ1RPUicpIHtcbiAgICAgICAgICAgICAgICBoYXNPbmx5VmVjdG9yXzEgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChoYXNPbmx5VmVjdG9yXzEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ1ZFQ1RPUicpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnUkVDVEFOR0xFJykge1xuICAgICAgICBpZiAobm9kZS5maWxscy5maW5kKGZ1bmN0aW9uIChwYWludCkgeyByZXR1cm4gcGFpbnQudHlwZSA9PT0gJ0lNQUdFJzsgfSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc0ltYWdlTm9kZSA9IGlzSW1hZ2VOb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmtlYmFiVG9VcHBlckNhbWVsID0gZXhwb3J0cy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBleHBvcnRzLmtlYmFiaXplID0gdm9pZCAwO1xuZnVuY3Rpb24ga2ViYWJpemUoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGxldHRlciwgaWR4KSB7XG4gICAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKSA9PT0gbGV0dGVyID8gXCJcIiArIChpZHggIT09IDAgPyAnLScgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKSA6IGxldHRlcjtcbiAgICB9KVxuICAgICAgICAuam9pbignJyk7XG59XG5leHBvcnRzLmtlYmFiaXplID0ga2ViYWJpemU7XG5mdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn1cbmV4cG9ydHMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyO1xuZnVuY3Rpb24ga2ViYWJUb1VwcGVyQ2FtZWwoc3RyKSB7XG4gICAgcmV0dXJuIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHIuc3BsaXQoLy18Xy9nKS5tYXAoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKS5qb2luKCcnKSk7XG59XG5leHBvcnRzLmtlYmFiVG9VcHBlckNhbWVsID0ga2ViYWJUb1VwcGVyQ2FtZWw7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvZGUudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9