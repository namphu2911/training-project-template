import { IFolder } from "../models/_interfaces";
import { seedData } from "./_data";

const STORAGE_KEY = 'sp_document_store';

export const readStore = (): IFolder => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        const initial = seedData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(raw) as IFolder;
};

export const writeStore = (root: IFolder): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
};