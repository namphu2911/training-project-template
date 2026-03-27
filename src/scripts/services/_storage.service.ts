import { FileExtension } from '../models/_enums';
import { IFolder, IFileItem, IInfoParam, ICreateFolderDto, IUpdateFolderDto, ICreateFileDto, IUpdateFileDto, ApiDownloadResult } from '../models/_interfaces';
import { apiGet, apiPost, apiPut, apiDelete, apiPostForm, apiDownload } from './_api.service';

const FOLDERS_BASE = '/api/folders';
const FILES_BASE = '/api/files';
const DOCUMENTS_BASE = '/api/documents';
export const DOCUMENT_ROOT_ID = '00000000-0000-0000-0000-000000000000';

// Build breadcrumb path by calling API: GET /api/folders/{id}/breadcrumb
// Returns [{ id, name }, ...] from root to current folder
export const getBreadcrumbPath = async (folderId: string): Promise<IInfoParam[]> => {
  return apiGet<IInfoParam[]>(`${FOLDERS_BASE}/${folderId}/breadcrumb`);
};

// Load root folder: GET /api/documents/me
// Returns IFolder (with direct files[] and subFolders[])
export const loadDocuments = async (): Promise<IFolder> => {
  return apiGet<IFolder>(`${DOCUMENTS_BASE}/me`);
};

// Load recycle bin root: GET /api/documents/recycle-bin
// Returns IFolder containing deleted files[] and subFolders[]
export const loadRecycleBinDocuments = async (): Promise<IFolder> => {
  return apiGet<IFolder>(`${DOCUMENTS_BASE}/recycle-bin`);
};

// Get specific folder by ID: GET /api/folders/{id}
// For root folder, calls GET /api/documents/me instead
export const getFolderById = async (id: string): Promise<IFolder | undefined> => {
  const path = id === DOCUMENT_ROOT_ID ? `${DOCUMENTS_BASE}/me` : `${FOLDERS_BASE}/${id}`;
  return await apiGet<IFolder>(path);
};

// Create folder: POST /api/folders
// Body: ICreateFolderDto { name, parentId, createdBy }
export const createFolder = async (name: string, parentId: string, createdBy: string): Promise<IFolder> => {
  const dto: ICreateFolderDto = { name, parentId, createdBy };
  return apiPost<IFolder>(FOLDERS_BASE, dto);
};

// Rename folder: PUT /api/folders/{id}
// Body: IUpdateFolderDto { name, modifiedBy }
export const renameFolder = async (folderId: string, newName: string, modifiedBy: string): Promise<IFolder> => {
  const dto: IUpdateFolderDto = { id: folderId, name: newName, modifiedBy };
  return apiPut<IFolder>(FOLDERS_BASE, dto);
};

// Delete folder: DELETE /api/folders/{id}
export const deleteFolder = async (folderId: string): Promise<void> => {
  return apiDelete(`${FOLDERS_BASE}/${folderId}`);
};

// Restore soft-deleted folder: POST /api/folders/{id}/restore
export const restoreFolder = async (folderId: string): Promise<void> => {
  await apiPost<void>(`${FOLDERS_BASE}/${folderId}/restore`, {});
};

// Permanently delete folder: DELETE /api/folders/{id}/permanent
export const deleteFolderPermanently = async (folderId: string): Promise<void> => {
  return apiDelete(`${FOLDERS_BASE}/${folderId}/permanent`);
};

// Create file entry: POST /api/files
// Body: ICreateFileDto { name, extension, parentFolderId, createdBy }
export const createFile = async (
  name: string,
  extension: FileExtension,
  parentFolderId: string,
  createdBy: string
): Promise<IFileItem> => {
  const dto: ICreateFileDto = { name, extension, parentFolderId, createdBy };
  return apiPost<IFileItem>(FILES_BASE, dto);
};

// Rename file: PUT /api/files/{id}
// Body: IUpdateFileDto { name, modifiedBy }
// parentFolderId kept in signature for backward compatibility but not sent (file ID is sufficient)
export const renameFile = async (
  fileId: string,
  _parentFolderId: string,
  newName: string,
  modifiedBy: string
): Promise<IFileItem> => {
  const dto: IUpdateFileDto = { id: fileId, name: newName, modifiedBy };
  return apiPut<IFileItem>(FILES_BASE, dto);
};

// Delete file: DELETE /api/files/{id}
export const deleteFile = async (fileId: string, _parentFolderId: string): Promise<void> => {
  return apiDelete(`${FILES_BASE}/${fileId}`);
};

// Restore soft-deleted file: POST /api/files/{id}/restore
export const restoreFile = async (fileId: string): Promise<void> => {
  await apiPost<void>(`${FILES_BASE}/${fileId}/restore`, {});
};

// Permanently delete file: DELETE /api/files/{id}/permanent
export const deleteFilePermanently = async (fileId: string): Promise<void> => {
  return apiDelete(`${FILES_BASE}/${fileId}/permanent`);
};

// Upload file: POST /api/files/upload (multipart/form-data)
// FormData fields: file (binary), parentFolderId (string), uploadedBy (string)
export const uploadFile = async (file: File, parentFolderId: string, uploadedBy: string): Promise<IFileItem> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('parentFolderId', parentFolderId);
  formData.append('uploadedBy', uploadedBy);
  return apiPostForm<IFileItem>(`${FILES_BASE}/upload`, formData);
};

export const downloadFileById = async (fileId: string, fallbackName: string): Promise<ApiDownloadResult> => {
  const result = await apiDownload(`${FILES_BASE}/${fileId}/download`);
  return {
    blob: result.blob,
    fileName: result.fileName || fallbackName,
  };
};

export const downloadFolderById = async (folderId: string, fallbackName: string): Promise<ApiDownloadResult> => {
  const result = await apiDownload(`${FOLDERS_BASE}/${folderId}/download`);
  return {
    blob: result.blob,
    fileName: result.fileName || `${fallbackName}.zip`,
  };
};
