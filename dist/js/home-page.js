/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/components/_grid.ts":
/*!*****************************************!*\
  !*** ./src/scripts/components/_grid.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBreadcrumb: function() { return /* binding */ renderBreadcrumb; },
/* harmony export */   renderDocumentTable: function() { return /* binding */ renderDocumentTable; },
/* harmony export */   showLoading: function() { return /* binding */ showLoading; }
/* harmony export */ });
/* harmony import */ var _models_enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/_enums */ "./src/scripts/models/_enums.ts");

// Icon mapping
const fileIconMap = {
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Xlsx]: { icon: 'uiw:file-excel', cssClass: 'excel-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Docx]: { icon: 'vscode-icons:file-type-word', cssClass: 'word-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Pptx]: { icon: 'vscode-icons:file-type-powerpoint', cssClass: 'ppt-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Pdf]: { icon: 'vscode-icons:file-type-pdf2', cssClass: 'pdf-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Txt]: { icon: 'fluent-mdl2:text-document', cssClass: 'txt-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Jpg]: { icon: 'fluent-mdl2:file-image', cssClass: 'img-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Png]: { icon: 'fluent-mdl2:file-image', cssClass: 'img-icon' },
    [_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Other]: { icon: 'fluent-mdl2:page', cssClass: 'file-icon' },
};
// Date formatting
const formatDate = (iso) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffSec < 60)
        return 'A few seconds ago';
    if (diffMin < 60)
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24)
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay === 1)
        return 'Yesterday';
    if (diffDay < 7)
        return `${diffDay} days ago`;
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
};
const escapeHtml = (text) => {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};
// Render helpers
const renderFolderRow = (folder) => {
    return `
  <tr data-id="${folder.id}" data-type="folder">
    <td class="sp-col-select">
      <input type="checkbox" class="row-select">
    </td>
    <td class="sp-col-icon" data-label="File Type">
      <iconify-icon icon="ooui:folder-placeholder-rtl" class="folder-icon"></iconify-icon>
    </td>
    <td class="sp-col-name" data-label="Name">
      <span class="sp-name-content">
        <span class="sp-value sp-folder-link" data-folder-id="${folder.id}">${escapeHtml(folder.name)}</span>
      </span>
    </td>
    <td class="sp-col-modified" data-label="Modified">${formatDate(folder.modifiedAt)}</td>
    <td class="sp-col-modified-by" data-label="Modified By">${escapeHtml(folder.modifiedBy)}</td>
    <td class="sp-col-add"></td>
    <td class="sp-col-actions" data-label="">
      <button class="btn btn-sm btn-outline-primary sp-btn-rename" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Rename">
        <iconify-icon icon="fluent-mdl2:rename"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger sp-btn-delete" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Delete">
        <iconify-icon icon="fluent-mdl2:delete"></iconify-icon>
      </button>
    </td>
  </tr>`;
};
const renderFileRow = (file) => {
    const iconInfo = fileIconMap[file.extension] || fileIconMap[_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Other];
    const displayName = file.extension === _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Other ? file.name : `${file.name}.${file.extension}`;
    return `
  <tr data-id="${file.id}" data-type="file" data-parent="${file.parentFolderId}">
    <td class="sp-col-select">
      <input type="checkbox" class="row-select">
    </td>
    <td class="sp-col-icon" data-label="File Type">
      <iconify-icon icon="${iconInfo.icon}" class="${iconInfo.cssClass}"></iconify-icon>
    </td>
    <td class="sp-col-name" data-label="Name">
      <span class="sp-name-content">
        <span class="sp-value">${escapeHtml(displayName)}</span>
      </span>
    </td>
    <td class="sp-col-modified" data-label="Modified">${formatDate(file.modifiedAt)}</td>
    <td class="sp-col-modified-by" data-label="Modified By">${escapeHtml(file.modifiedBy)}</td>
    <td class="sp-col-add"></td>
    <td class="sp-col-actions" data-label="">
      <button class="btn btn-sm btn-outline-primary sp-btn-rename" data-id="${file.id}" data-type="file" data-name="${escapeHtml(file.name)}" data-parent="${file.parentFolderId}" title="Rename">
        <iconify-icon icon="fluent-mdl2:rename"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger sp-btn-delete" data-id="${file.id}" data-type="file" data-name="${escapeHtml(displayName)}" data-parent="${file.parentFolderId}" title="Delete">
        <iconify-icon icon="fluent-mdl2:delete"></iconify-icon>
      </button>
    </td>
  </tr>`;
};
// Loading spinner
const showLoading = () => {
    const tbody = document.querySelector('.sp-table tbody');
    if (tbody) {
        tbody.innerHTML = `
      <tr class="sp-loading-row">
        <td colspan="7">
          <div class="sp-spinner">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span class="sp-loading-text">Loading documents...</span>
          </div>
        </td>
      </tr>`;
    }
};
// Render document table
const renderDocumentTable = (folder) => {
    const tbody = document.querySelector('.sp-table tbody');
    if (!tbody)
        return;
    const rows = [];
    // Folders first, then files (no back row – breadcrumb handles navigation)
    folder.subFolders.forEach((sub) => rows.push(renderFolderRow(sub)));
    folder.files.forEach((file) => rows.push(renderFileRow(file)));
    if (folder.subFolders.length === 0 && folder.files.length === 0) {
        rows.push(`
      <tr class="sp-empty-row">
        <td colspan="7">
          <div class="sp-empty-message">
            <iconify-icon icon="fluent-mdl2:empty-recycle-bin" class="sp-empty-icon"></iconify-icon>
            <span>This folder is empty</span>
          </div>
        </td>
      </tr>`);
    }
    tbody.innerHTML = rows.join('');
};
// Breadcrumb
const renderBreadcrumb = (path, onNavigate) => {
    const titleEl = document.getElementById('sp-title');
    const navEl = document.getElementById('sp-breadcrumb');
    if (!titleEl || !navEl)
        return;
    const current = path[path.length - 1];
    titleEl.textContent = current.name;
    const items = path.map((item, index) => {
        if (index === path.length - 1) {
            // Active (current)
            return `<li class="breadcrumb-item active" aria-current="page">${escapeHtml(item.name)}</li>`;
        }
        return `<li class="breadcrumb-item"><a href="#" class="sp-breadcrumb-link" data-folder-id="${item.id}">${escapeHtml(item.name)}</a></li>`;
    });
    navEl.innerHTML = `<ol class="breadcrumb sp-breadcrumb">${items.join('')}</ol>`;
    // Bind click events
    navEl.querySelectorAll('.sp-breadcrumb-link').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const folderId = el.dataset.folderId;
            if (folderId)
                onNavigate(folderId);
        });
    });
};


/***/ }),

/***/ "./src/scripts/components/_home.ts":
/*!*****************************************!*\
  !*** ./src/scripts/components/_home.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initHome: function() { return /* binding */ initHome; }
/* harmony export */ });
/* harmony import */ var _models_enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/_enums */ "./src/scripts/models/_enums.ts");
/* harmony import */ var _services_storage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/_storage.service */ "./src/scripts/services/_storage.service.ts");
/* harmony import */ var _utilities_treeFolder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/_treeFolder */ "./src/scripts/utilities/_treeFolder.ts");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_grid */ "./src/scripts/components/_grid.ts");




// State
let rootFolder = null;
let currentFolderId = 'root';
const CURRENT_USER = 'Current User';
// Navigation (with browser history)
const navigateToFolder = async (folderId, pushState = true) => {
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
    const folder = await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.getFolderById)(folderId);
    if (!folder)
        return;
    currentFolderId = folderId;
    // Push to browser history so back/forward works
    if (pushState) {
        history.pushState({ folderId }, '', `#folder=${folderId}`);
    }
    const path = (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.getBreadcrumbPath)(folderId);
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.renderBreadcrumb)(path, (id) => navigateToFolder(id));
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.renderDocumentTable)(folder);
    bindTableEvents();
};
// Reload current folder
const reloadCurrentFolder = async () => {
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
    rootFolder = await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.loadDocuments)();
    const current = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_2__.findFolderById)(rootFolder, currentFolderId) || rootFolder;
    currentFolderId = current.id;
    const path = (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.getBreadcrumbPath)(currentFolderId);
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.renderBreadcrumb)(path, (id) => navigateToFolder(id));
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.renderDocumentTable)(current);
    bindTableEvents();
};
// Simple prompt-based modals
const promptInput = (title, defaultValue = '') => {
    return prompt(title, defaultValue);
};
const confirmAction = (message) => {
    return confirm(message);
};
// Navbar action handlers
const handleNewFolder = async () => {
    const name = promptInput('Enter folder name:');
    if (!name || !name.trim())
        return;
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
    await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.createFolder)(name.trim(), currentFolderId, CURRENT_USER);
    await reloadCurrentFolder();
};
const handleNewFile = async () => {
    const name = promptInput('Enter file name (e.g. report.xlsx):');
    if (!name || !name.trim())
        return;
    const trimmed = name.trim();
    const dotIndex = trimmed.lastIndexOf('.');
    const rawName = dotIndex > 0 ? trimmed.substring(0, dotIndex) : trimmed;
    const rawExt = dotIndex > 0 ? trimmed.substring(dotIndex + 1).toLowerCase() : 'txt';
    const isKnownExt = Object.values(_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension).includes(rawExt);
    const fileName = isKnownExt ? rawName : trimmed;
    const extension = isKnownExt ? rawExt : _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Other;
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
    await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.createFile)(fileName, extension, currentFolderId, CURRENT_USER);
    await reloadCurrentFolder();
};
const handleUploadFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async () => {
        if (!input.files || input.files.length === 0)
            return;
        (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
        const promises = Array.from(input.files).map((file) => (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.uploadFile)(file, currentFolderId, CURRENT_USER));
        await Promise.all(promises);
        await reloadCurrentFolder();
    };
    input.click();
};
const handleUploadFolder = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    // webkitdirectory enables folder selection in browsers
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.onchange = async () => {
        if (!input.files || input.files.length === 0)
            return;
        (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
        // Files from folder upload have webkitRelativePath like "FolderName/sub/file.txt"
        // Group by top-level folder name and create structure
        const files = Array.from(input.files);
        const topFolderName = files[0].webkitRelativePath.split('/')[0];
        // Create the top-level folder
        const topFolder = await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.createFolder)(topFolderName, currentFolderId, CURRENT_USER);
        // Upload all files into that folder (flat – ignoring nested subdirs for simplicity)
        const promises = files.map((file) => (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.uploadFile)(file, topFolder.id, CURRENT_USER));
        await Promise.all(promises);
        await reloadCurrentFolder();
    };
    input.click();
};
// Row item action handlers (rename and delete) (both files and folders)
const handleRename = async (id, type, currentName, parentId) => {
    const newName = promptInput(`Rename "${currentName}" to:`, currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName)
        return;
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
    if (type === 'folder') {
        await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.renameFolder)(id, newName.trim(), CURRENT_USER);
    }
    else if (parentId) {
        await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.renameFile)(id, parentId, newName.trim(), CURRENT_USER);
    }
    await reloadCurrentFolder();
};
const handleDelete = async (id, type, name, parentId) => {
    if (!confirmAction(`Are you sure you want to delete "${name}"?`))
        return;
    (0,_grid__WEBPACK_IMPORTED_MODULE_3__.showLoading)();
    if (type === 'folder') {
        await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.deleteFolder)(id);
    }
    else if (parentId) {
        await (0,_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.deleteFile)(id, parentId);
    }
    await reloadCurrentFolder();
};
// Event binding
// Table rows
const bindTableEvents = () => {
    // Folder link click (open folder)
    document.querySelectorAll('.sp-folder-link').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const folderId = el.dataset.folderId;
            if (folderId)
                navigateToFolder(folderId);
        });
    });
    // Table row double click (open folder)
    document.querySelectorAll('.sp-table tbody tr').forEach((el) => {
        el.addEventListener('dblclick', (e) => {
            if (e.target.closest('.row-select'))
                return;
            const type = el.dataset.type;
            const id = el.dataset.id;
            if (type === 'folder' && id) {
                navigateToFolder(id);
            }
        });
    });
    // Rename buttons
    document.querySelectorAll('.sp-btn-rename').forEach((el) => {
        el.addEventListener('click', () => {
            const btn = el;
            handleRename(btn.dataset.id, btn.dataset.type, btn.dataset.name, btn.dataset.parent);
        });
    });
    // Delete buttons
    document.querySelectorAll('.sp-btn-delete').forEach((el) => {
        el.addEventListener('click', () => {
            const btn = el;
            handleDelete(btn.dataset.id, btn.dataset.type, btn.dataset.name, btn.dataset.parent);
        });
    });
};
// Row selection (delegated – attached once)
const bindRowSelectEvents = () => {
    document.addEventListener('change', (e) => {
        const checkbox = e.target;
        if (!checkbox.classList.contains('row-select'))
            return;
        document.querySelectorAll('tr').forEach((row) => {
            row.classList.remove('row-selected');
        });
        document.querySelectorAll('.row-select').forEach((cb) => {
            if (cb !== checkbox)
                cb.checked = false;
        });
        if (checkbox.checked) {
            checkbox.closest('tr')?.classList.add('row-selected');
        }
    });
};
// Navbar dropdown buttons
const bindNavbarEvents = () => {
    document.getElementById('btn-new-folder')?.addEventListener('click', handleNewFolder);
    document.getElementById('btn-new-file')?.addEventListener('click', handleNewFile);
    document.getElementById('btn-upload-files')?.addEventListener('click', handleUploadFiles);
    document.getElementById('btn-upload-folder')?.addEventListener('click', handleUploadFolder);
};
// Browser history (back / forward)
const bindHistoryEvents = () => {
    window.addEventListener('popstate', (event) => {
        const folderId = event.state?.folderId || 'root';
        navigateToFolder(folderId, false); // false = don't push again
    });
};
// Initialize
const initHome = async () => {
    bindNavbarEvents();
    bindHistoryEvents();
    bindRowSelectEvents();
    // Check URL hash for initial folder
    const hash = window.location.hash;
    const match = hash.match(/^#folder=(.+)$/);
    // Set initial folder from URL hash before first load
    if (match)
        currentFolderId = match[1];
    await reloadCurrentFolder();
    // Record initial state for browser back/forward (replace, not push)
    history.replaceState({ folderId: currentFolderId }, '', `#folder=${currentFolderId}`);
};


/***/ }),

/***/ "./src/scripts/models/_enums.ts":
/*!**************************************!*\
  !*** ./src/scripts/models/_enums.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileExtension: function() { return /* binding */ FileExtension; }
/* harmony export */ });
var FileExtension;
(function (FileExtension) {
    FileExtension["Xlsx"] = "xlsx";
    FileExtension["Docx"] = "docx";
    FileExtension["Pptx"] = "pptx";
    FileExtension["Pdf"] = "pdf";
    FileExtension["Txt"] = "txt";
    FileExtension["Jpg"] = "jpg";
    FileExtension["Png"] = "png";
    FileExtension["Other"] = "other";
})(FileExtension || (FileExtension = {}));


/***/ }),

/***/ "./src/scripts/services/_storage.service.ts":
/*!**************************************************!*\
  !*** ./src/scripts/services/_storage.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFile: function() { return /* binding */ createFile; },
/* harmony export */   createFolder: function() { return /* binding */ createFolder; },
/* harmony export */   deleteFile: function() { return /* binding */ deleteFile; },
/* harmony export */   deleteFolder: function() { return /* binding */ deleteFolder; },
/* harmony export */   getBreadcrumbPath: function() { return /* binding */ getBreadcrumbPath; },
/* harmony export */   getFolderById: function() { return /* binding */ getFolderById; },
/* harmony export */   loadDocuments: function() { return /* binding */ loadDocuments; },
/* harmony export */   renameFile: function() { return /* binding */ renameFile; },
/* harmony export */   renameFolder: function() { return /* binding */ renameFolder; },
/* harmony export */   uploadFile: function() { return /* binding */ uploadFile; }
/* harmony export */ });
/* harmony import */ var _models_enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/_enums */ "./src/scripts/models/_enums.ts");
/* harmony import */ var _utilities_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/_data */ "./src/scripts/utilities/_data.ts");
/* harmony import */ var _utilities_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/_helper */ "./src/scripts/utilities/_helper.ts");
/* harmony import */ var _utilities_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/_storage */ "./src/scripts/utilities/_storage.ts");
/* harmony import */ var _utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utilities/_treeFolder */ "./src/scripts/utilities/_treeFolder.ts");





// Build breadcrumb path from root to target folder
const getBreadcrumbPath = (targetId) => {
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    const path = [];
    const findPath = (folder, id) => {
        path.push({ id: folder.id, name: folder.name });
        if (folder.id === id)
            return true;
        for (const sub of folder.subFolders) {
            if (findPath(sub, id))
                return true;
        }
        path.pop();
        return false;
    };
    findPath(root, targetId);
    return path;
};
// Load root folder from localStorage with simulated delay
const loadDocuments = async () => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)(500, 1000);
    return (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
};
// Get a specific folder by ID
const getFolderById = async (id) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    return (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findFolderById)(root, id);
};
// Unique name helpers
const getUniqueFolderName = (parent, name) => {
    const existing = new Set(parent.subFolders.map((f) => f.name));
    if (!existing.has(name))
        return name;
    let i = 1;
    while (existing.has(`${name} (${i})`))
        i++;
    return `${name} (${i})`;
};
const getUniqueFileName = (parent, name, extension) => {
    const existing = new Set(parent.files.filter((f) => f.extension === extension).map((f) => f.name));
    if (!existing.has(name))
        return name;
    let i = 1;
    while (existing.has(`${name} (${i})`))
        i++;
    return `${name} (${i})`;
};
// Folder CRUD
const createFolder = async (name, parentId, createdBy) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    console.log('Creating folder:', { name, parentId, createdBy });
    const parent = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findFolderById)(root, parentId);
    if (!parent)
        throw new Error(`Parent folder "${parentId}" not found`);
    const uniqueName = getUniqueFolderName(parent, name);
    const ts = new Date().toISOString();
    const newFolder = {
        id: (0,_utilities_data__WEBPACK_IMPORTED_MODULE_1__.generateId)(),
        name: uniqueName,
        parentId,
        files: [],
        subFolders: [],
        createdAt: ts,
        createdBy,
        modifiedAt: ts,
        modifiedBy: createdBy,
    };
    parent.subFolders.push(newFolder);
    parent.modifiedAt = ts;
    parent.modifiedBy = createdBy;
    (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.writeStore)(root);
    return newFolder;
};
const renameFolder = async (folderId, newName, modifiedBy) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    const folder = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findFolderById)(root, folderId);
    if (!folder)
        throw new Error(`Foldser "${folderId}" not found`);
    folder.name = newName;
    folder.modifiedAt = new Date().toISOString();
    folder.modifiedBy = modifiedBy;
    (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.writeStore)(root);
    return folder;
};
const deleteFolder = async (folderId) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    if (folderId === 'root')
        throw new Error('Cannot delete root folder');
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    const parent = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findParentOfFolder)(root, folderId);
    if (!parent)
        throw new Error(`Folder "${folderId}" not found`);
    parent.subFolders = parent.subFolders.filter((f) => f.id !== folderId);
    parent.modifiedAt = new Date().toISOString();
    (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.writeStore)(root);
};
// File CRUD
const createFile = async (name, extension, parentFolderId, createdBy) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    const parent = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findFolderById)(root, parentFolderId);
    if (!parent)
        throw new Error(`Parent folder "${parentFolderId}" not found`);
    const uniqueName = getUniqueFileName(parent, name, extension);
    const ts = new Date().toISOString();
    const newFile = {
        id: (0,_utilities_data__WEBPACK_IMPORTED_MODULE_1__.generateId)(),
        name: uniqueName,
        extension,
        parentFolderId,
        createdAt: ts,
        createdBy,
        modifiedAt: ts,
        modifiedBy: createdBy,
    };
    parent.files.push(newFile);
    parent.modifiedAt = ts;
    parent.modifiedBy = createdBy;
    (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.writeStore)(root);
    return newFile;
};
const renameFile = async (fileId, parentFolderId, newName, modifiedBy) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    const parent = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findFolderById)(root, parentFolderId);
    if (!parent)
        throw new Error(`Parent folder "${parentFolderId}" not found`);
    const file = parent.files.find((f) => f.id === fileId);
    if (!file)
        throw new Error(`File "${fileId}" not found`);
    file.name = newName;
    file.modifiedAt = new Date().toISOString();
    file.modifiedBy = modifiedBy;
    (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.writeStore)(root);
    return file;
};
const deleteFile = async (fileId, parentFolderId) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)();
    const root = (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.readStore)();
    const parent = (0,_utilities_treeFolder__WEBPACK_IMPORTED_MODULE_4__.findFolderById)(root, parentFolderId);
    if (!parent)
        throw new Error(`Parent folder "${parentFolderId}" not found`);
    parent.files = parent.files.filter((f) => f.id !== fileId);
    parent.modifiedAt = new Date().toISOString();
    (0,_utilities_storage__WEBPACK_IMPORTED_MODULE_3__.writeStore)(root);
};
const uploadFile = async (file, parentFolderId, uploadedBy) => {
    await (0,_utilities_helper__WEBPACK_IMPORTED_MODULE_2__.randomDelay)(500, 1000); // slightly longer for "upload"
    const dotIndex = file.name.lastIndexOf('.');
    const rawName = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;
    const rawExt = dotIndex > 0 ? file.name.substring(dotIndex + 1).toLowerCase() : '';
    const isKnownExt = Object.values(_models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension).includes(rawExt);
    const name = isKnownExt ? rawName : file.name;
    const extension = isKnownExt ? rawExt : _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Other;
    return createFile(name, extension, parentFolderId, uploadedBy);
};


/***/ }),

/***/ "./src/scripts/utilities/_data.ts":
/*!****************************************!*\
  !*** ./src/scripts/utilities/_data.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateId: function() { return /* binding */ generateId; },
/* harmony export */   seedData: function() { return /* binding */ seedData; }
/* harmony export */ });
/* harmony import */ var _models_enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/_enums */ "./src/scripts/models/_enums.ts");

// Seed data (matches existing HTML content)
const now = new Date().toISOString();
// ID generator
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
const seedData = () => ({
    id: 'root',
    name: 'Documents',
    parentId: null,
    createdAt: now,
    createdBy: 'System',
    modifiedAt: now,
    modifiedBy: 'System',
    subFolders: [
        {
            id: generateId(),
            name: 'CAS',
            parentId: 'root',
            files: [],
            subFolders: [],
            createdAt: '2025-04-30T00:00:00.000Z',
            createdBy: 'Megan Bowen',
            modifiedAt: '2025-04-30T00:00:00.000Z',
            modifiedBy: 'Megan Bowen',
        },
    ],
    files: [
        {
            id: generateId(),
            name: 'CoasterAndBargeLoading',
            extension: _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices',
            extension: _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices2016',
            extension: _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices2017',
            extension: _models_enums__WEBPACK_IMPORTED_MODULE_0__.FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
    ],
});


/***/ }),

/***/ "./src/scripts/utilities/_helper.ts":
/*!******************************************!*\
  !*** ./src/scripts/utilities/_helper.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   randomDelay: function() { return /* binding */ randomDelay; },
/* harmony export */   ready: function() { return /* binding */ ready; }
/* harmony export */ });
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
const randomDelay = (min = 100, max = 200) => {
    return delay(min + Math.floor(Math.random() * (max - min)));
};


/***/ }),

/***/ "./src/scripts/utilities/_storage.ts":
/*!*******************************************!*\
  !*** ./src/scripts/utilities/_storage.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readStore: function() { return /* binding */ readStore; },
/* harmony export */   writeStore: function() { return /* binding */ writeStore; }
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_data */ "./src/scripts/utilities/_data.ts");

const STORAGE_KEY = 'sp_document_store';
const readStore = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        const initial = (0,_data__WEBPACK_IMPORTED_MODULE_0__.seedData)();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(raw);
};
const writeStore = (root) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
};


/***/ }),

/***/ "./src/scripts/utilities/_treeFolder.ts":
/*!**********************************************!*\
  !*** ./src/scripts/utilities/_treeFolder.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findFolderById: function() { return /* binding */ findFolderById; },
/* harmony export */   findParentOfFolder: function() { return /* binding */ findParentOfFolder; }
/* harmony export */ });
// Folder tree helpers
const findFolderById = (folder, id) => {
    if (folder.id === id)
        return folder;
    for (const sub of folder.subFolders) {
        const found = findFolderById(sub, id);
        if (found)
            return found;
    }
    return null;
};
const findParentOfFolder = (root, targetId) => {
    for (const sub of root.subFolders) {
        if (sub.id === targetId)
            return root;
        const found = findParentOfFolder(sub, targetId);
        if (found)
            return found;
    }
    return null;
};


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
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
/* harmony import */ var _components_home__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/_home */ "./src/scripts/components/_home.ts");


(0,_utilities_helper__WEBPACK_IMPORTED_MODULE_0__.ready)(() => {
    (0,_components_home__WEBPACK_IMPORTED_MODULE_1__.initHome)();
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