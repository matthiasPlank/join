const STORAGE_TOKEN = 'HKBH1HYF6OXQYRFV7DKZO0DA3YUB8SQ2J7D9N2KT';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/*
********** KEYS ********** 
* contacts
* board
* username
************************** 
*/

/**
 * Sets a value in the backend.
 * @param {String} key - Name of the "field" to be accessed in the backend.
 * @param {String} value - Value to be written in the field/keyl.
 * @returns {String} 
 */
async function setItem(key, value) {
    if (!key || !value) {
        throw "Key and value are required.";
    }
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

/**
 * Reads a value from the baking from the handed over Field/Key and returns this value as a return parameter. 
 * @param {String} key - Name of the "field" to which the backend should be accessed.
 * @returns {String} - Gives the data that was made from the backend.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}