import { FileExtension } from '../models/_enums';
import { IFolder, IFileItem, IInfoParam, TableViewMode } from '../models/_interfaces';

// Icon mapping
const fileIconMap: Record<FileExtension, { icon: string; cssClass: string }> = {
  [FileExtension.Xlsx]: { icon: 'uiw:file-excel', cssClass: 'excel-icon' },
  [FileExtension.Doc]: { icon: 'vscode-icons:file-type-word', cssClass: 'word-icon' },
  [FileExtension.Docx]: { icon: 'vscode-icons:file-type-word', cssClass: 'word-icon' },
  [FileExtension.Ppt]: { icon: 'vscode-icons:file-type-powerpoint', cssClass: 'ppt-icon' },
  [FileExtension.Pptx]: { icon: 'vscode-icons:file-type-powerpoint', cssClass: 'ppt-icon' },
  [FileExtension.Pdf]: { icon: 'vscode-icons:file-type-pdf2', cssClass: 'pdf-icon' },
  [FileExtension.Txt]: { icon: 'fluent-mdl2:text-document', cssClass: 'txt-icon' },
  [FileExtension.Jpg]: { icon: 'fluent-mdl2:file-image', cssClass: 'img-icon' },
  [FileExtension.Png]: { icon: 'fluent-mdl2:file-image', cssClass: 'img-icon' },
  [FileExtension.Other]: { icon: 'fluent-mdl2:page', cssClass: 'file-icon' },
};

// Date formatting
const formatDate = (iso: string) => {
  if (!iso) return '';
  const normalized = /Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + 'Z';
  const date = new Date(normalized); // 
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'A few seconds ago';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const escapeHtml = (text: string) => {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

// Render helpers
const renderFolderRow = (folder: IFolder, mode: TableViewMode) => {
  const dateLabel = mode === 'recycle-bin' ? 'Deleted At' : 'Modified';
  const userLabel = mode === 'recycle-bin' ? 'Deleted By' : 'Modified By';

  const folderNameCell = mode === 'recycle-bin'
    ? `<span class="sp-value">${escapeHtml(folder.name)}</span>`
    : `<span class="sp-value sp-folder-link" data-folder-id="${folder.id}">${escapeHtml(folder.name)}</span>`;
  const actionButtons = mode === 'recycle-bin'
    ? `
      <button class="btn btn-sm btn-outline-success sp-btn-restore" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Restore">
        <iconify-icon icon="fluent-mdl2:undo"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger sp-btn-delete" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Delete permanently">
        <iconify-icon icon="fluent-mdl2:delete"></iconify-icon>
      </button>`
    : `
      <button class="btn btn-sm btn-outline-secondary sp-btn-download" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Download">
        <iconify-icon icon="fluent-mdl2:download"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-primary sp-btn-rename" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Rename">
        <iconify-icon icon="fluent-mdl2:rename"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger sp-btn-delete" data-id="${folder.id}" data-type="folder" data-name="${escapeHtml(folder.name)}" title="Delete">
        <iconify-icon icon="fluent-mdl2:delete"></iconify-icon>
      </button>`;

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
        ${folderNameCell}
      </span>
    </td>
    <td class="sp-col-modified" data-label="${dateLabel}">${formatDate(folder.modifiedAt)}</td>
    <td class="sp-col-modified-by" data-label="${userLabel}">${escapeHtml(folder.modifiedBy)}</td>
    <td class="sp-col-add"></td>
    <td class="sp-col-actions" data-label="">
      ${actionButtons}
    </td>
  </tr>`;
}

const renderFileRow = (file: IFileItem, mode: TableViewMode) => {
  const ext = file.extension.replace(/^\./, '').toLowerCase();
  const iconInfo = fileIconMap[ext as FileExtension] ?? fileIconMap[FileExtension.Other];
  const displayName = ext === FileExtension.Other ? file.name : `${file.name}.${ext}`;

  const dateLabel = mode === 'recycle-bin' ? 'Deleted At' : 'Modified';
  const userLabel = mode === 'recycle-bin' ? 'Deleted By' : 'Modified By';
  const actionButtons = mode === 'recycle-bin'
    ? `
      <button class="btn btn-sm btn-outline-success sp-btn-restore" data-id="${file.id}" data-type="file" data-name="${escapeHtml(displayName)}" data-parent="${file.parentFolderId}" title="Restore">
        <iconify-icon icon="fluent-mdl2:undo"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger sp-btn-delete" data-id="${file.id}" data-type="file" data-name="${escapeHtml(displayName)}" data-parent="${file.parentFolderId}" title="Delete permanently">
        <iconify-icon icon="fluent-mdl2:delete"></iconify-icon>
      </button>`
    : `
      <button class="btn btn-sm btn-outline-secondary sp-btn-download" data-id="${file.id}" data-type="file" data-name="${escapeHtml(displayName)}" title="Download">
        <iconify-icon icon="fluent-mdl2:download"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-primary sp-btn-rename" data-id="${file.id}" data-type="file" data-name="${escapeHtml(file.name)}" data-parent="${file.parentFolderId}" title="Rename">
        <iconify-icon icon="fluent-mdl2:rename"></iconify-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger sp-btn-delete" data-id="${file.id}" data-type="file" data-name="${escapeHtml(displayName)}" data-parent="${file.parentFolderId}" title="Delete">
        <iconify-icon icon="fluent-mdl2:delete"></iconify-icon>
      </button>`;

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
    <td class="sp-col-modified" data-label="${dateLabel}">${formatDate(file.modifiedAt)}</td>
    <td class="sp-col-modified-by" data-label="${userLabel}">${escapeHtml(file.modifiedBy)}</td>
    <td class="sp-col-add"></td>
    <td class="sp-col-actions" data-label="">
      ${actionButtons}
    </td>
  </tr>`;
};

// Loading spinner
export const showLoading = (message?: string) => {
  const tbody = document.querySelector('.sp-table tbody');
  if (tbody) {
    tbody.innerHTML = `
      <tr class="sp-loading-row">
        <td colspan="7">
          <div class="sp-spinner">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span class="sp-loading-text">${message || 'Loading documents...'}</span>
          </div>
        </td>
      </tr>`;
  }
};

// Render document table
export const renderDocumentTable = (folder: IFolder, mode: TableViewMode = 'documents') => {
  const tbody = document.querySelector('.sp-table tbody');
  if (!tbody) return;

  const rows: string[] = [];

  // Folders first, then files (no back row – breadcrumb handles navigation)
  folder.subFolders.forEach((sub) => rows.push(renderFolderRow(sub, mode)));
  folder.files.forEach((file) => rows.push(renderFileRow(file, mode)));

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
export const renderBreadcrumb = (path: IInfoParam[], onNavigate: (folderId: string) => void) => {
  const titleEl = document.getElementById('sp-title');
  const navEl = document.getElementById('sp-breadcrumb');
  if (!titleEl || !navEl) return;

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
      const folderId = (el as HTMLElement).dataset.folderId;
      if (folderId)
        onNavigate(folderId);
    });
  });
};
export { TableViewMode };
