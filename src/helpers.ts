import _G from "./_GLOBALS_.js";

export function resolvePath(obj: any, keyString: string) {
    keyString = keyString.trim();
    const keys = [{ label: "", type: "field", is_array: false }];
    let current_key = 0;
    for (let i = 0; i < keyString.length; i++) {
        const c = keyString.charAt(i);
        switch (c) {
            case ".":
                current_key++;
                keys[current_key] = { label: "", type: "field", is_array: false };
                break;
            case "[":
                keys[current_key].is_array = true;
                current_key++;
                keys[current_key] = { label: "", type: "index", is_array: false };
                break;
            case "]":
                break;
            default:
                keys[current_key].label += c;
        }
    }
    let part = obj;
    for (let i = 0; i < keys.length; i++) {
        let label = keys[i].label;
        if (i == keys.length - 1) {
            return part[label];
        } else {
            if (part[label] === undefined) {
                return undefined;
            }
            part = part[label];
        }
    }
}

export function setPath(obj: any, keyString: string, val: any) {
    keyString = keyString.trim();
    const keys = [{ label: "", type: "field", is_array: false }];
    let current_key = 0;
    for (let i = 0; i < keyString.length; i++) {
        const c = keyString.charAt(i);
        switch (c) {
            case ".":
                current_key++;
                keys[current_key] = { label: "", type: "field", is_array: false };
                break;
            case "[":
                keys[current_key].is_array = true;
                current_key++;
                keys[current_key] = { label: "", type: "index", is_array: false };
                break;
            case "]":
                break;
            default:
                keys[current_key].label += c;
        }
    }
    let part = obj;
    for (let i = 0; i < keys.length; i++) {
        let label = keys[i].label;
        if (i == keys.length - 1) {
            part[label] = val;
        } else {
            if (part[label] === undefined) {
                if (keys[i].is_array) {
                    part[label] = [];
                } else {
                    part[label] = {};
                }
            }
            part = part[label];
        }
    }
}

export const splitTrim = (string: string, separator: string | RegExp) => {
    return string.split(separator).map((e) => e.trim());
};

export const replaceAll2 = (str: string, match: string | string[], replacement: string): string => {
    return [match].flat().reduce((acc, m) => {
        return acc.split(m).join(replacement);
    }, str);
};
