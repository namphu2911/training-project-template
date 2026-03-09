import { IFolder } from "../models/_interfaces";

// Folder tree helpers
export const findFolderById = (folder: IFolder, id: string): IFolder | null => {
  if (folder.id === id) return folder;
  for (const sub of folder.subFolders) {
    const found = findFolderById(sub, id);
    if (found) return found;
  }
  return null;
};

export const findParentOfFolder = (root: IFolder, targetId: string): IFolder | null => {
  for (const sub of root.subFolders) {
    if (sub.id === targetId) return root;
    const found = findParentOfFolder(sub, targetId);
    if (found) return found;
  }
  return null;
};