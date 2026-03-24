import { FileExtension } from '../models/_enums';
import { IFolder } from '../models/_interfaces';
import {
    loadDocuments,
    getFolderById,
    createFolder,
    renameFolder,
    deleteFolder,
    createFile,
    renameFile,
    deleteFile,
    uploadFile,
    getBreadcrumbPath,
} from '../services/_storage.service';
import { apiConfig } from '../config/auth.config';
import { initializeAuth, login, logout, getCurrentUser } from '../services/_auth.service';
import { apiGet } from '../services/_api.service';
import { findFolderById } from '../utilities/_treeFolder';
import { renderDocumentTable, showLoading, renderBreadcrumb } from './_grid';

// State
let rootFolder: IFolder | null = null;
let currentFolderId = 'root';
let currentUserLabel = 'Current User';

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

// Navigation (with browser history)
const navigateToFolder = async (folderId: string, pushState = true) => {
    showLoading();
    const folder = await getFolderById(folderId);
    if (!folder) return;

    currentFolderId = folderId;

    // Push to browser history so back/forward works
    if (pushState) {
        history.pushState({ folderId }, '', `#folder=${folderId}`);
    }

    const path = getBreadcrumbPath(folderId);
    renderBreadcrumb(path, (id) => navigateToFolder(id));
    renderDocumentTable(folder);
    bindTableEvents();
};

// Reload current folder
const reloadCurrentFolder = async () => {
    showLoading();
    rootFolder = await loadDocuments();
    const current = findFolderById(rootFolder, currentFolderId) || rootFolder;
    currentFolderId = current.id;

    const path = getBreadcrumbPath(currentFolderId);
    renderBreadcrumb(path, (id) => navigateToFolder(id));
    renderDocumentTable(current);
    bindTableEvents();
};

// Simple prompt-based modals
const promptInput = (title: string, defaultValue = '') => {
    return prompt(title, defaultValue);
};

const confirmAction = (message: string) => {
    return confirm(message);
};

// Navbar action handlers
const handleNewFolder = async () => {
    const name = promptInput('Enter folder name:');
    if (!name || !name.trim()) return;

    showLoading();
    await createFolder(name.trim(), currentFolderId, currentUserLabel);
    await reloadCurrentFolder();
};

const handleNewFile = async () => {
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
    await reloadCurrentFolder();
};

const handleUploadFiles = () => {
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
        await reloadCurrentFolder();
    };
    input.click();
};

// Row item action handlers (rename and delete) (both files and folders)
const handleRename = async (id: string, type: string, currentName: string, parentId?: string) => {
    const newName = promptInput(`Rename "${currentName}" to:`, currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    showLoading();
    if (type === 'folder') {
        await renameFolder(id, newName.trim(), currentUserLabel);
    } else if (parentId) {
        await renameFile(id, parentId, newName.trim(), currentUserLabel);
    }
    await reloadCurrentFolder();
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
        showLoading();
        const data = await apiGet<unknown>(apiConfig.testEndpoint);
        console.log('Protected API response', data);
        alert('Sync completed. Check browser console for API response payload.');
    } catch (error) {
        alert(`Sync failed: ${(error as Error).message}`);
    } finally {
        await reloadCurrentFolder();
    }
};

const handleDelete = async (id: string, type: string, name: string, parentId?: string) => {
    if (!confirmAction(`Are you sure you want to delete "${name}"?`)) return;

    showLoading();
    if (type === 'folder') {
        await deleteFolder(id);
    } else if (parentId) {
        await deleteFile(id, parentId);
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
            const folderId = (el as HTMLElement).dataset.folderId;
            if (folderId) navigateToFolder(folderId);
        });
    });

    // Table row double click (open folder)
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
        const folderId = event.state?.folderId || 'root';
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
