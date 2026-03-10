import { FileExtension } from '../models/_enums';
import { IFolder, IFileItem, IInfoParam } from '../models/_interfaces';
import { generateId } from '../utilities/_data';
import { randomDelay } from '../utilities/_helper';
import { readStore, writeStore } from '../utilities/_storage';
import { findFolderById, findParentOfFolder } from '../utilities/_treeFolder';

// Build breadcrumb path from root to target folder
export const getBreadcrumbPath = (targetId: string): IInfoParam[] => {
  const root = readStore();
  const path: IInfoParam[] = [];

  const findPath = (folder: IFolder, id: string) => {
    path.push({ id: folder.id, name: folder.name });
    if (folder.id === id) return true;
    for (const sub of folder.subFolders) {
      if (findPath(sub, id)) return true;
    }
    path.pop();
    return false;
  };

  findPath(root, targetId);
  return path;
};

// Load root folder from localStorage with simulated delay
export const loadDocuments = async () => {
  await randomDelay(500, 1000);
  return readStore();
};

// Get a specific folder by ID
export const getFolderById = async (id: string) => {
  await randomDelay();
  const root = readStore();
  return findFolderById(root, id);
};

// Unique name helpers
const getUniqueFolderName = (parent: IFolder, name: string): string => {
  const existing = new Set(parent.subFolders.map((f) => f.name));
  if (!existing.has(name)) return name;
  let i = 1;
  while (existing.has(`${name} (${i})`)) i++;
  return `${name} (${i})`;
};

const getUniqueFileName = (parent: IFolder, name: string, extension: FileExtension): string => {
  const existing = new Set(
    parent.files.filter((f) => f.extension === extension).map((f) => f.name)
  );
  if (!existing.has(name)) return name;
  let i = 1;
  while (existing.has(`${name} (${i})`)) i++;
  return `${name} (${i})`;
};

// Folder CRUD
export const createFolder = async (name: string, parentId: string, createdBy: string) => {
  await randomDelay();
  const root = readStore();
  console.log('Creating folder:', { name, parentId, createdBy });
  const parent = findFolderById(root, parentId);
  if (!parent) throw new Error(`Parent folder "${parentId}" not found`);

  const uniqueName = getUniqueFolderName(parent, name);
  const ts = new Date().toISOString();
  const newFolder: IFolder = {
    id: generateId(),
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
  writeStore(root);
  return newFolder;
};

export const renameFolder = async (folderId: string, newName: string, modifiedBy: string) => {
  await randomDelay();
  const root = readStore();
  const folder = findFolderById(root, folderId);
  if (!folder) throw new Error(`Foldser "${folderId}" not found`);

  folder.name = newName;
  folder.modifiedAt = new Date().toISOString();
  folder.modifiedBy = modifiedBy;
  writeStore(root);
  return folder;
};

export const deleteFolder = async (folderId: string) => {
  await randomDelay();
  if (folderId === 'root') throw new Error('Cannot delete root folder');

  const root = readStore();
  const parent = findParentOfFolder(root, folderId);
  if (!parent) throw new Error(`Folder "${folderId}" not found`);

  parent.subFolders = parent.subFolders.filter((f) => f.id !== folderId);
  parent.modifiedAt = new Date().toISOString();
  writeStore(root);
};

// File CRUD
export const createFile = async (
  name: string,
  extension: FileExtension,
  size: number,
  parentFolderId: string,
  createdBy: string
) => {
  await randomDelay();
  const root = readStore();
  const parent = findFolderById(root, parentFolderId);
  if (!parent) throw new Error(`Parent folder "${parentFolderId}" not found`);

  const uniqueName = getUniqueFileName(parent, name, extension);
  const ts = new Date().toISOString();
  const newFile: IFileItem = {
    id: generateId(),
    name: uniqueName,
    extension,
    size,
    parentFolderId,
    createdAt: ts,
    createdBy,
    modifiedAt: ts,
    modifiedBy: createdBy,
  };

  parent.files.push(newFile);
  parent.modifiedAt = ts;
  parent.modifiedBy = createdBy;
  writeStore(root);
  return newFile;
};

export const renameFile = async (
  fileId: string,
  parentFolderId: string,
  newName: string,
  modifiedBy: string
) => {
  await randomDelay();
  const root = readStore();
  const parent = findFolderById(root, parentFolderId);
  if (!parent) throw new Error(`Parent folder "${parentFolderId}" not found`);

  const file = parent.files.find((f) => f.id === fileId);
  if (!file) throw new Error(`File "${fileId}" not found`);

  file.name = newName;
  file.modifiedAt = new Date().toISOString();
  file.modifiedBy = modifiedBy;
  writeStore(root);
  return file;
};

export const deleteFile = async (fileId: string, parentFolderId: string) => {
  await randomDelay();
  const root = readStore();
  const parent = findFolderById(root, parentFolderId);
  if (!parent) throw new Error(`Parent folder "${parentFolderId}" not found`);

  parent.files = parent.files.filter((f) => f.id !== fileId);
  parent.modifiedAt = new Date().toISOString();
  writeStore(root);
};

export const uploadFile = async (file: File, parentFolderId: string, uploadedBy: string) => {
  await randomDelay(500, 1000); // slightly longer for "upload"

  const dotIndex = file.name.lastIndexOf('.');
  const rawName = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;
  const rawExt = dotIndex > 0 ? file.name.substring(dotIndex + 1).toLowerCase() : '';

  const isKnownExt = Object.values(FileExtension).includes(rawExt as FileExtension);

  const name = isKnownExt ? rawName : file.name;
  const extension = isKnownExt ? (rawExt as FileExtension) : FileExtension.Other;

  return createFile(name, extension, file.size, parentFolderId, uploadedBy);
};
