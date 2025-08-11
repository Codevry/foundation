/**
 * stringify and parse JSON again
 * @param json
 */
export function jsonReformat(json: any) {
    return JSON.parse(JSON.stringify(json));
}
