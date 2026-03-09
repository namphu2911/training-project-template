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
import { renderDocumentTable, showLoading, renderBreadcrumb } from './_grid';

// State
let rootFolder: IFolder | null = null;
let currentFolderId = 'root';
const CURRENT_USER = 'Current User';

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
    const findFolder = (f: IFolder, id: string): IFolder | null => {
        if (f.id === id) return f;
        for (const sub of f.subFolders) {
            const found = findFolder(sub, id);
            if (found) return found;
        }
        return null;
    };
    const current = findFolder(rootFolder, currentFolderId) || rootFolder;
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


// CRUD handlers
const handleNewFolder = async () => {
    const name = promptInput('Enter folder name:');
    if (!name || !name.trim()) return;

    showLoading();
    await createFolder(name.trim(), currentFolderId, CURRENT_USER);
    await reloadCurrentFolder();
};

const handleNewFile = async () => {
    const name = promptInput('Enter file name (e.g. report.xlsx):');
    if (!name || !name.trim()) return;

    const dotIndex = name.lastIndexOf('.');
    const fileName = dotIndex > 0 ? name.substring(0, dotIndex) : name;
    const ext = dotIndex > 0 ? name.substring(dotIndex + 1).toLowerCase() : 'txt';

    const { FileExtension } = await import('../models/_enums');
    const extension = Object.values(FileExtension).includes(ext as any)
        ? (ext as any)
        : FileExtension.Other;

    showLoading();
    await createFile(fileName.trim(), extension, 0, currentFolderId, CURRENT_USER);
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
            uploadFile(file, currentFolderId, CURRENT_USER)
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
            CURRENT_USER
        );

        // Upload all files into that folder (flat – ignoring nested subdirs for simplicity)
        const promises = files.map((file) =>
            uploadFile(file, topFolder.id, CURRENT_USER)
        );
        await Promise.all(promises);
        await reloadCurrentFolder();
    };
    input.click();
};

const handleRename = async (id: string, type: string, currentName: string, parentId?: string) => {
    const newName = promptInput(`Rename "${currentName}" to:`, currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    showLoading();
    if (type === 'folder') {
        await renameFolder(id, newName.trim(), CURRENT_USER);
    } else if (parentId) {
        await renameFile(id, parentId, newName.trim(), CURRENT_USER);
    }
    await reloadCurrentFolder();
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

// Event binding – table rows
const bindTableEvents = () => {
    document.querySelectorAll('.sp-folder-link').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const folderId = (el as HTMLElement).dataset.folderId;
            if (folderId) navigateToFolder(folderId);
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
export const initHome = async () => {
    showLoading();
    bindNavbarEvents();
    bindHistoryEvents();

    rootFolder = await loadDocuments();

    // Check URL hash for initial folder
    const hash = window.location.hash;
    const match = hash.match(/^#folder=(.+)$/);
    const initialFolderId = match ? match[1] : rootFolder.id;

    // Find the initial folder
    const findFolder = (f: IFolder, id: string): IFolder | null => {
        if (f.id === id) return f;
        for (const sub of f.subFolders) {
            const found = findFolder(sub, id);
            if (found) return found;
        }
        return null;
    };
    const initialFolder = findFolder(rootFolder, initialFolderId) || rootFolder;
    currentFolderId = initialFolder.id;

    // Replace current history entry (so first navigation is recorded)
    history.replaceState({ folderId: currentFolderId }, '', `#folder=${currentFolderId}`);

    const path = getBreadcrumbPath(currentFolderId);
    renderBreadcrumb(path, (id) => navigateToFolder(id));
    renderDocumentTable(initialFolder);
    bindTableEvents();
};
