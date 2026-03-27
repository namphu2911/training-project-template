import { FileExtension } from '../models/_enums';
import {
    getFolderById,
    createFolder,
    renameFolder,
    deleteFolder,
    deleteFolderPermanently,
    restoreFolder,
    createFile,
    renameFile,
    deleteFile,
    deleteFilePermanently,
    restoreFile,
    uploadFile,
    downloadFileById,
    downloadFolderById,
    getBreadcrumbPath,
    loadRecycleBinDocuments,
    DOCUMENT_ROOT_ID,
} from '../services/_storage.service';
import { initializeAuth, login, logout, getCurrentUser } from '../services/_auth.service';
import { renderDocumentTable, showLoading, renderBreadcrumb, TableViewMode } from './_grid';

// State
let currentFolderId = DOCUMENT_ROOT_ID;
let currentUserLabel = 'Current User';
let currentViewMode: TableViewMode = 'documents';

const uiLog = (...args: unknown[]) => {
    console.log('[UI]', ...args);
};

const setCurrentUser = () => {
    const user = getCurrentUser();
    currentUserLabel = user?.name || user?.username || 'Current User';
};

const setAuthUiState = () => {
    const user = getCurrentUser();
    const userLabel = document.getElementById('sp-auth-user');
    const loginBtn = document.getElementById('btn-auth-login') as HTMLButtonElement | null;
    const logoutBtn = document.getElementById('btn-auth-logout') as HTMLButtonElement | null;

    if (userLabel) {
        userLabel.textContent = user?.name || user?.username || 'Not signed in';
    }

    if (loginBtn) {
        loginBtn.style.display = user ? 'none' : 'flex';
    }

    if (logoutBtn) {
        logoutBtn.style.display = user ? 'flex' : 'none';
    }
};

const setElementVisibility = (id: string, visible: boolean) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navItem = element.closest('.nav-item') as HTMLElement | null;
    const target = navItem || (element as HTMLElement);
    target.style.display = visible ? '' : 'none';
};

const setViewUiState = (mode: TableViewMode) => {
    const inRecycleBin = mode === 'recycle-bin';
    const toggleLabel = document.getElementById('sp-recycle-toggle-label');
    const toggleIcon = document.getElementById('sp-icon-state') as HTMLElement | null;

    setElementVisibility('btn-new-folder', !inRecycleBin);
    setElementVisibility('btn-upload-folder', !inRecycleBin);

    if (toggleLabel) {
        toggleLabel.textContent = inRecycleBin ? 'Back to Documents' : 'Recycle Bin';
    }
    if (toggleIcon) {
        toggleIcon.setAttribute('icon', inRecycleBin ? 'fluent-mdl2:back' : 'fluent-mdl2:empty-recycle-bin');
    }
};

const setTableHeaderLabels = (mode: TableViewMode) => {
    const dateLabelEl = document.getElementById('sp-col-date-label');
    const userLabelEl = document.getElementById('sp-col-user-label');

    if (dateLabelEl) {
        dateLabelEl.textContent = mode === 'recycle-bin' ? 'Deleted At' : 'Modified';
    }

    if (userLabelEl) {
        userLabelEl.textContent = mode === 'recycle-bin' ? 'Deleted By' : 'Modified By';
    }
};

const renderRecycleBinBreadcrumb = () => {
    const titleEl = document.getElementById('sp-title');
    const navEl = document.getElementById('sp-breadcrumb');
    if (!titleEl || !navEl) return;

    titleEl.textContent = 'Recycle Bin';
    navEl.innerHTML = '<ol class="breadcrumb sp-breadcrumb"><li class="breadcrumb-item active" aria-current="page">Recycle Bin</li></ol>';
};

const renderSignedOutState = () => {
    const titleEl = document.getElementById('sp-title');
    const navEl = document.getElementById('sp-breadcrumb');
    const tbody = document.querySelector('.sp-table tbody');

    if (titleEl) {
        titleEl.textContent = 'Documents';
    }

    currentViewMode = 'documents';
    setViewUiState(currentViewMode);
    setTableHeaderLabels(currentViewMode);

    if (navEl) {
        navEl.innerHTML = '<ol class="breadcrumb sp-breadcrumb"><li class="breadcrumb-item active" aria-current="page">Documents</li></ol>';
    }

    if (tbody) {
        tbody.innerHTML = `
            <tr class="sp-empty-row">
                <td colspan="7">
                    <div class="sp-empty-message">
                        <iconify-icon icon="fluent-mdl2:permissions" class="sp-empty-icon"></iconify-icon>
                        <span>Please sign in to load documents</span>
                    </div>
                </td>
            </tr>`;
    }
};

// Navigation (with browser history)
const navigateToFolder = async (folderId: string, pushState = true) => {
    currentViewMode = 'documents';
    setViewUiState(currentViewMode);
    setTableHeaderLabels(currentViewMode);

    showLoading();
    console.log('navigateToFolder');
    const folder = await getFolderById(folderId);
    if (!folder) return;

    currentFolderId = folderId;

    // Push to browser history so back/forward works
    if (pushState) {
        history.pushState({ mode: currentViewMode, folderId }, '', `#folder=${folderId}`);
    }

    const path = await getBreadcrumbPath(folderId);
    renderBreadcrumb(path, (id) => navigateToFolder(id));
    renderDocumentTable(folder, currentViewMode);
    bindTableEvents();
};

const openRecycleBin = async (pushState = true) => {
    currentViewMode = 'recycle-bin';
    setViewUiState(currentViewMode);
    setTableHeaderLabels(currentViewMode);

    showLoading();
    const recycleBinRoot = await loadRecycleBinDocuments();

    renderRecycleBinBreadcrumb();
    renderDocumentTable(recycleBinRoot, currentViewMode);
    bindTableEvents();

    if (pushState) {
        history.pushState({ mode: currentViewMode, folderId: currentFolderId }, '', '#recycle-bin');
    }
};

// Reload current view
const reloadCurrentView = async () => {
    if (currentViewMode === 'recycle-bin') {
        await openRecycleBin(false);
        return;
    }

    await navigateToFolder(currentFolderId, false);
};

// Simple prompt-based modals
const promptInput = (title: string, defaultValue = '') => {
    return prompt(title, defaultValue);
};

const confirmAction = (message: string) => {
    return confirm(message);
};

const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
};

const checkLoggedIn = () => {
    const user = getCurrentUser();
    if (!user) {
        alert('You must be signed in to use this feature.');
        return false;
    }
    return true;
};

// Navbar action handlers
const handleNewFolder = async () => {
    if (!checkLoggedIn()) return;

    const name = promptInput('Enter folder name:');
    if (!name || !name.trim()) return;

    showLoading();
    await createFolder(name.trim(), currentFolderId, currentUserLabel);
    await reloadCurrentView();
};

const handleNewFile = async () => {
    if (!checkLoggedIn()) return;

    const name = promptInput('Enter file name (e.g. report.xlsx):');
    if (!name || !name.trim()) return;

    const trimmed = name.trim();
    const dotIndex = trimmed.lastIndexOf('.');

    const rawName = dotIndex > 0 ? trimmed.substring(0, dotIndex) : trimmed;
    const rawExt = dotIndex > 0 ? trimmed.substring(dotIndex + 1).toLowerCase() : 'txt';

    const isKnownExt = Object.values(FileExtension).includes(rawExt as any);

    const fileName = isKnownExt ? rawName : trimmed;
    const extension = isKnownExt ? (rawExt as any) : FileExtension.Other;

    showLoading();
    await createFile(fileName, extension, currentFolderId, currentUserLabel);
    await reloadCurrentView();
};

const handleUploadFiles = () => {
    if (!checkLoggedIn()) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async () => {
        if (!input.files || input.files.length === 0) return;
        showLoading();
        const promises = Array.from(input.files).map((file) =>
            uploadFile(file, currentFolderId, currentUserLabel)
        );
        await Promise.all(promises);
        await reloadCurrentView();
    };
    input.click();
};

const handleUploadFolder = () => {
    if (!checkLoggedIn()) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    // webkitdirectory enables folder selection in browsers
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.onchange = async () => {
        if (!input.files || input.files.length === 0) return;
        showLoading();

        // Files from folder upload have webkitRelativePath like "FolderName/sub/file.txt"
        // Group by top-level folder name and create structure
        const files = Array.from(input.files);
        const topFolderName = files[0].webkitRelativePath.split('/')[0];

        // Create the top-level folder
        const topFolder = await createFolder(
            topFolderName,
            currentFolderId,
            currentUserLabel
        );

        // Upload all files into that folder (flat – ignoring nested subdirs for simplicity)
        const promises = files.map((file) =>
            uploadFile(file, topFolder.id, currentUserLabel)
        );
        await Promise.all(promises);
        await reloadCurrentView();
    };
    input.click();
};

// Row item action handlers (rename and delete) (both files and folders)
const handleRename = async (id: string, type: string, currentName: string, parentId?: string) => {
    if (currentViewMode === 'recycle-bin') return;

    const newName = promptInput(`Rename "${currentName}" to:`, currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    showLoading();
    if (type === 'folder') {
        await renameFolder(id, newName.trim(), currentUserLabel);
    } else if (parentId) {
        await renameFile(id, parentId, newName.trim(), currentUserLabel);
    }
    await reloadCurrentView();
};

const handleLogin = async () => {
    uiLog('handleLogin:clicked');

    try {
        await login();
    } catch (error) {
        uiLog('handleLogin:error', error);
        alert(`Login failed: ${(error as Error).message}`);
    }
};

const handleLogout = async () => {
    try {
        await logout();
    } catch (error) {
        alert(`Logout failed: ${(error as Error).message}`);
    }
};

const handleSync = async () => {
    try {
        await reloadCurrentView();
    } catch (error) {
        alert(`Sync failed: ${(error as Error).message}`);
    }
};

const handleDownload = async (id: string, type: string, name: string) => {
    if (!checkLoggedIn()) return;

    try {
        if (type === 'folder') {
            const result = await downloadFolderById(id, name);
            triggerDownload(result.blob, result.fileName);
            return;
        }

        const result = await downloadFileById(id, name);
        triggerDownload(result.blob, result.fileName);
    } catch (error) {
        alert(`Download failed: ${(error as Error).message}`);
    }
};

const handleDelete = async (id: string, type: string, name: string, parentId?: string) => {
    const isRecycleBin = currentViewMode === 'recycle-bin';
    const message = isRecycleBin
        ? `Delete "${name}" permanently from database?`
        : `Are you sure you want to delete "${name}"?`;

    if (!confirmAction(message)) return;

    showLoading();
    if (isRecycleBin) {
        if (type === 'folder') {
            await deleteFolderPermanently(id);
        } else {
            await deleteFilePermanently(id);
        }
    } else if (type === 'folder') {
        await deleteFolder(id);
    } else if (parentId) {
        await deleteFile(id, parentId);
    }
    await reloadCurrentView();
};

const handleRestore = async (id: string, type: string, name: string) => {
    if (currentViewMode !== 'recycle-bin') return;
    if (!confirmAction(`Restore "${name}"?`)) return;

    showLoading();
    if (type === 'folder') {
        await restoreFolder(id);
    } else {
        await restoreFile(id);
    }
    await reloadCurrentView();
};

const handleToggleRecycleBin = async () => {
    if (currentViewMode === 'recycle-bin') {
        await navigateToFolder(currentFolderId);
        return;
    }

    await openRecycleBin();
};

// Event binding
// Table rows
const bindTableEvents = () => {
    // Folder link click (open folder)
    if (currentViewMode === 'documents') {
        document.querySelectorAll('.sp-folder-link').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const folderId = (el as HTMLElement).dataset.folderId;
                if (folderId) navigateToFolder(folderId);
            });
        });
    }

    // Table row double click (open folder)
    if (currentViewMode === 'documents') {
        document.querySelectorAll('.sp-table tbody tr').forEach((el) => {
            el.addEventListener('dblclick', (e) => {
                if ((e.target as HTMLElement).closest('.row-select')) return;
                const type = (el as HTMLElement).dataset.type;
                const id = (el as HTMLElement).dataset.id;
                if (type === 'folder' && id) {
                    navigateToFolder(id);
                }
            });
        });
    }

    // Rename buttons
    document.querySelectorAll('.sp-btn-rename').forEach((el) => {
        el.addEventListener('click', () => {
            const btn = el as HTMLElement;
            handleRename(
                btn.dataset.id!,
                btn.dataset.type!,
                btn.dataset.name!,
                btn.dataset.parent
            );
        });
    });

    // Download buttons
    document.querySelectorAll('.sp-btn-download').forEach((el) => {
        el.addEventListener('click', () => {
            const btn = el as HTMLElement;
            handleDownload(
                btn.dataset.id!,
                btn.dataset.type!,
                btn.dataset.name!
            );
        });
    });

    // Delete buttons
    document.querySelectorAll('.sp-btn-delete').forEach((el) => {
        el.addEventListener('click', () => {
            const btn = el as HTMLElement;
            handleDelete(
                btn.dataset.id!,
                btn.dataset.type!,
                btn.dataset.name!,
                btn.dataset.parent
            );
        });
    });

    // Restore buttons
    document.querySelectorAll('.sp-btn-restore').forEach((el) => {
        el.addEventListener('click', () => {
            const btn = el as HTMLElement;
            handleRestore(
                btn.dataset.id!,
                btn.dataset.type!,
                btn.dataset.name!
            );
        });
    });
};

// Row selection (delegated – attached once)
const bindRowSelectEvents = () => {
    document.addEventListener('change', (e) => {
        const checkbox = e.target as HTMLInputElement;
        if (!checkbox.classList.contains('row-select')) return;

        document.querySelectorAll('tr').forEach((row) => {
            row.classList.remove('row-selected');
        });

        document.querySelectorAll<HTMLInputElement>('.row-select').forEach((cb) => {
            if (cb !== checkbox) cb.checked = false;
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
    document.getElementById('btn-sync')?.addEventListener('click', handleSync);
    document.getElementById('btn-toggle-recycle-bin')?.addEventListener('click', handleToggleRecycleBin);

    const loginBtn = document.getElementById('btn-auth-login');
    if (!loginBtn) {
        uiLog('bindNavbarEvents:btn-auth-login not found');
    }
    loginBtn?.addEventListener('click', handleLogin);

    document.getElementById('btn-auth-logout')?.addEventListener('click', handleLogout);
};

// Browser history (back / forward)
const bindHistoryEvents = () => {
    window.addEventListener('popstate', (event) => {
        const mode = event.state?.mode as TableViewMode | undefined;
        if (mode === 'recycle-bin') {
            openRecycleBin(false);
            return;
        }

        const folderId = event.state?.folderId || DOCUMENT_ROOT_ID;
        navigateToFolder(folderId, false); // false = don't push again
    });
};

// Initialize
export const initHome = async () => {
    await initializeAuth();
    setCurrentUser();
    setAuthUiState();

    bindNavbarEvents();
    bindHistoryEvents();
    bindRowSelectEvents();
    setViewUiState(currentViewMode);
    setTableHeaderLabels(currentViewMode);

    // Check URL hash for initial folder
    const hash = window.location.hash;
    const match = hash.match(/^#folder=(.+)$/);
    const isRecycleBinHash = hash === '#recycle-bin';

    const user = getCurrentUser();

    if (!user) {
        renderSignedOutState();
        history.replaceState({ mode: 'documents', folderId: DOCUMENT_ROOT_ID }, '', `#folder=${DOCUMENT_ROOT_ID}`);
        return;
    }

    if (isRecycleBinHash) {
        await openRecycleBin(false);
        history.replaceState({ mode: 'recycle-bin', folderId: currentFolderId }, '', '#recycle-bin');
        return;
    }

    // Set initial folder from URL hash before first load
    if (match)
        currentFolderId = match[1];
    await reloadCurrentView();

    // Record initial state for browser back/forward (replace, not push)
    history.replaceState({ mode: 'documents', folderId: currentFolderId }, '', `#folder=${currentFolderId}`);
};
