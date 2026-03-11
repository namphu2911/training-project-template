import { FileExtension } from '../models/_enums';
import { IFolder } from '../models/_interfaces';

// Seed data (matches existing HTML content)
const now = new Date().toISOString();

// ID generator
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const seedData = (): IFolder => ({
    id: 'root',
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
            parentId: 'root',
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
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices',
            extension: FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices2016',
            extension: FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
        {
            id: generateId(),
            name: 'RevenueByServices2017',
            extension: FileExtension.Xlsx,
            parentFolderId: 'root',
            createdAt: now,
            createdBy: 'Administrator MOD',
            modifiedAt: now,
            modifiedBy: 'Administrator MOD',
        },
    ],
});