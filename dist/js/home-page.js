/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/components/_grid.ts":
/*!*****************************************!*\
  !*** ./src/scripts/components/_grid.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Document data
const documents = [
    { type: 'folder', name: 'CAS', modified: 'April 30', modifiedBy: 'Megan Bowen' },
    { type: 'excel', name: 'CoasterAndBargeLoading.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
    { type: 'excel', name: 'RevenueByServices.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
    { type: 'excel', name: 'RevenueByServices2016.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
    { type: 'excel', name: 'RevenueByServices2017.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
];
// Icon mapping
const iconMap = {
    folder: 'ooui:folder-placeholder-rtl',
    excel: 'uiw:file-excel',
    word: 'simple-icons:microsoftword',
};
// Icon class mapping
const iconClassMap = {
    folder: 'folder-icon',
    excel: 'excel-icon',
    word: 'word-icon',
};
// Render glimmer icon if needed
const renderGlimmer = (hasGlimmer) => {
    return hasGlimmer
        ? '<iconify-icon icon="fluent-mdl2:glimmer" class="sp-icon-pink"></iconify-icon>'
        : '';
};
// Render file type icon
const renderFileIcon = (type) => {
    return `<iconify-icon icon="${iconMap[type]}" class="${iconClassMap[type]}"></iconify-icon>`;
};
// Render desktop table row
const renderTableRow = (item) => {
    return `
    <tr>
      <td class="col-icon">${renderFileIcon(item.type)}</td>
      <td class="name-cell">
        ${renderGlimmer(item.hasGlimmer)}
        <span>${item.name}</span>
      </td>
      <td>${item.modified}</td>
      <td>${item.modifiedBy}</td>
      <td></td>
    </tr>
  `;
};
// Render mobile card
const renderMobileCard = (item) => {
    return `
    <div class="sp-mobile-card">
      <div class="sp-card-row">
        <span class="sp-card-label">File Type</span>
        <span class="sp-card-value">${renderFileIcon(item.type)}</span>
      </div>
      <div class="sp-card-row">
        <span class="sp-card-label">Name</span>
        <span class="sp-card-value">${renderGlimmer(item.hasGlimmer)}${item.name}</span>
      </div>
      <div class="sp-card-row">
        <span class="sp-card-label">Modified</span>
        <span class="sp-card-value">${item.modified}</span>
      </div>
      <div class="sp-card-row">
        <span class="sp-card-label">Modified By</span>
        <span class="sp-card-value">${item.modifiedBy}</span>
      </div>
    </div>
  `;
};
// Main render function
const renderGrid = () => {
    const tableBody = document.querySelector('.sp-table tbody');
    const mobileList = document.querySelector('.sp-mobile-list');
    if (tableBody) {
        tableBody.innerHTML = documents.map(renderTableRow).join('');
    }
    if (mobileList) {
        mobileList.innerHTML = documents.map(renderMobileCard).join('');
    }
};
/* harmony default export */ __webpack_exports__["default"] = (renderGrid);


/***/ }),

/***/ "./src/scripts/utilities/_helper.ts":
/*!******************************************!*\
  !*** ./src/scripts/utilities/_helper.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
/* harmony default export */ __webpack_exports__["default"] = (ready);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./src/scripts/pages/home-page.ts ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utilities_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/_helper */ "./src/scripts/utilities/_helper.ts");
/* harmony import */ var _components_grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/_grid */ "./src/scripts/components/_grid.ts");


(0,_utilities_helper__WEBPACK_IMPORTED_MODULE_0__["default"])(() => {
    (0,_components_grid__WEBPACK_IMPORTED_MODULE_1__["default"])();
});

}();
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
/*!*****************************************!*\
  !*** ./src/styles/pages/home-page.scss ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

}();
/******/ })()
;
//# sourceMappingURL=home-page.js.map