/**
 * 加载器用到的工具函数
 */

export function removeDupsAndLowercase(list: string[]) {
    if (!list.length) return list;
    const lowercaseItems = list.map((str) => str.toLowerCase());
    const uniqueItems = new Set(lowercaseItems);
    return Array.from(uniqueItems);
}
