import { FileExtension } from "./_enums";

export interface IFileItem {
  id: string;
  name: string;
  extension: FileExtension;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  parentFolderId: string | null; // root folder uses Guid.Empty id
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
  parentId: string | null; // root folder id is Guid.Empty; parentId can still be null at top level
}

export type DocumentItem =
  | { type: 'folder'; data: IFolder }
  | { type: 'file'; data: IFileItem };

export interface ICreateFileDto {
  name: string;
  extension: FileExtension;
  createdBy: string;
  parentFolderId: string | null;
}

export interface IUpdateFileDto {
  id: string;
  name?: string;
  modifiedBy: string;
}

export interface ICreateFolderDto {
  name: string;
  createdBy: string;
  parentId: string | null;
}

export interface IUpdateFolderDto {
  id: string;
  name?: string;
  modifiedBy: string;
}

export interface IInfoParam {
  id: string;
  name: string
};

export interface ApiDownloadResult {
  blob: Blob;
  fileName: string | null;
}

export interface AccessTokenResult {
  accessToken: string;
  fromCache: boolean;
}
