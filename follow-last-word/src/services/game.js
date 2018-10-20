import axios from 'axios'

const url = 'http://13.209.244.222:80'

export function getFirstEasyWord() {
    return axios.get(`${url}/easy/start`);
};

export function getFirstHardWord() {
    return axios.get(`${url}/hard/start`);
};

export function postEasyWord(word) {
    return axios.post(`${url}/easy`, {
        reqWord: word
    });
};

export function postHardWord(word) {
    return axios.post(`${url}/hard`, {
        reqWord: word
    });
};

