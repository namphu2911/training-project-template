// Document item interface
interface DocumentItem {
  type: 'folder' | 'excel' | 'word';
  name: string;
  modified: string;
  modifiedBy: string;
  hasGlimmer?: boolean;
}

// Document data
const documents: DocumentItem[] = [
  { type: 'folder', name: 'CAS', modified: 'April 30', modifiedBy: 'Megan Bowen' },
  { type: 'excel', name: 'CoasterAndBargeLoading.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
  { type: 'excel', name: 'RevenueByServices.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
  { type: 'excel', name: 'RevenueByServices2016.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
  { type: 'excel', name: 'RevenueByServices2017.xlsx', modified: 'A few seconds ago', modifiedBy: 'Administrator MOD', hasGlimmer: true },
];

// Icon mapping
const iconMap: Record<string, string> = {
  folder: 'ooui:folder-placeholder-rtl',
  excel: 'uiw:file-excel',
  word: 'simple-icons:microsoftword',
};

// Icon class mapping
const iconClassMap: Record<string, string> = {
  folder: 'folder-icon',
  excel: 'excel-icon',
  word: 'word-icon',
};

// Render glimmer icon if needed
const renderGlimmer = (hasGlimmer?: boolean): string => {
  return hasGlimmer 
    ? '<iconify-icon icon="fluent-mdl2:glimmer" class="sp-icon-pink"></iconify-icon>' 
    : '';
};

// Render file type icon
const renderFileIcon = (type: string): string => {
  return `<iconify-icon icon="${iconMap[type]}" class="${iconClassMap[type]}"></iconify-icon>`;
};

// Render desktop table row
const renderTableRow = (item: DocumentItem): string => {
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
const renderMobileCard = (item: DocumentItem): string => {
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
const renderHome = (): void => {
  const tableBody = document.querySelector('.sp-table tbody');
  const mobileList = document.querySelector('.sp-mobile-list');

  if (tableBody) {
    tableBody.innerHTML = documents.map(renderTableRow).join('');
  }

  if (mobileList) {
    mobileList.innerHTML = documents.map(renderMobileCard).join('');
  }
};

export default renderHome;
