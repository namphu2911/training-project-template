import { FileExtension } from '../models/_enums';
import { IFolder } from '../models/_interfaces';

// Seed data (matches existing HTML content)
const now = new Date().toISOString();
const ROOT_FOLDER_ID = '00000000-0000-0000-0000-000000000000';

// ID generator
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const seedData = (): IFolder => ({
    id: ROOT_FOLDER_ID,
    name: 'Documents',
    parentId: null,
    createdAt: now,
    createdBy: 'System',
    modifiedAt: now,
    modifiedBy: 'System',
    subFolders: [
        {
            id: generateId(),
            name: 'CAS',
            parentId: ROOT_FOLDER_ID,
            files: [],
            subFolders: [],
            createdAt: '2025-04-30T00:00:00.000Z',
            createdBy: 'Megan Bowen',
            modifiedAt: '2025-04-30T00:00:00.000Z',
            modifiedBy: 'Megan Bowen',
        },
    ],
    files: [
        {
            id: generateId(),
            name: 'CoasterAndBargeLoading',
            extension: FileExtension.Xlsx,
            parentFolderId: ROOT_FOLDER_ID,
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices',
            extension: FileExtension.Xlsx,
            parentFolderId: ROOT_FOLDER_ID,
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices2016',
            extension: FileExtension.Xlsx,
            parentFolderId: ROOT_FOLDER_ID,
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices2017',
            extension: FileExtension.Xlsx,
            parentFolderId: ROOT_FOLDER_ID,
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
    ],
});