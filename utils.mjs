import { createHash } from 'node:crypto';

/**
 * Returns the file name (with the hash) to be used for a screenshot of a given URL
 * 
 * @param {string} url 
 * @return {string}
 */
export function getFileNameFromUrl(url) {
    // e.g. https://web.archive.org/web/20060621110703/http://www.faroejet.fo/
    const domain = url.match('/https?://([^/]+)')[1];
    const hash = createHash('md5').update(url).digest('hex').substring(1, 16);

    return `web_archive_${domain}_${hash}.png`;
}