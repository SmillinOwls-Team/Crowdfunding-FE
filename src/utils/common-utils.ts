import { VIETNAMESE_REGEX } from "../constants/string";

export function formatNumberStrWithCommas(number: string | number): string {
    return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function addCharacterBeforeString(string: string, character: string): string {
    return character.concat(string);
}

export function addCharacterAfterString(string: string, character: string): string {
    return string.concat(character);
}

export function createSlugFromVietnameseName(value: string): string {
    const { from, to } = VIETNAMESE_REGEX;

    let slug = value;
    for (let i = 0, l = from.length; i < l; i++) {
        slug = slug.replace(RegExp(from[i], "gi"), to[i]);
    }

    return slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/-$/, "");
}
