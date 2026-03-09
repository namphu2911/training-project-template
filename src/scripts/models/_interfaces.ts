import { FileExtension } from "./_enums";

export interface IFileItem {
  id: string;
  name: string;
  extension: FileExtension;
  size: number;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  parentFolderId: string | null; // null = root
}

export interface IFolder {
  id: string;
  name: string;
  files: IFileItem[];
  subFolders: IFolder[];
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  parentId: string | null; // null = root
}

export type DocumentItem =
  | { type: 'folder'; data: IFolder }
  | { type: 'file'; data: IFileItem };

export interface ICreateFileDto {
  name: string;
  extension: FileExtension;
  size: number;
  createdBy: string;
  parentFolderId: string | null;
}

export interface IUpdateFileDto {
  name?: string;
  modifiedBy: string;
}

export interface ICreateFolderDto {
  name: string;
  createdBy: string;
  parentId: string | null;
}

export interface IUpdateFolderDto {
  name?: string;
  modifiedBy: string;
}

export interface IInfoParam {
  id: string;
  name: string
};
