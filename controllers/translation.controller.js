import { ErrorResponse } from '../utils/errorResponse.js';
import { User } from '../models/User.js';
import { Translation } from "../models/Translation.js"
import { dataResponse, messageResponse } from '../utils/successResponses.js';
import { asyncHandler } from '../middlewares/async.js';
import axios from 'axios';

async function detectLanguageByGoogle(data) {
    try {
        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': process.env.RAPID_API_Key,
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: {
                q: data.query,
            },
        };
        const response = await axios.request(options);
        return response.data.data.detections[0][0]
    } catch (e) {
        return -1;
    }
}

async function fetchTranslationByGoogle(data) {
    try {
        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': process.env.RAPID_API_Key,
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: {
                q: data.query,
                target: data.target,
                source: data.source,
            }
        };
        const language = await axios(options)
        return language.data.data
    } catch (e) {
        return -1
    }
}

async function finalPerformTranslationByGoogle(data) {
    const response = await detectLanguageByGoogle(data)
    if (response === -1)
        return -1
    data.source = response.language
    const translateResponse = await fetchTranslationByGoogle(data)
    if (translateResponse === -1)
        return -1
    translateResponse.translations[0].source = response.language
    translateResponse.translations[0].engine = "Google Translate"
    return translateResponse
}

async function detectLanguageByMicrosoft(data) {
    try {
        const options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/Detect',
            params: {
                'api-version': '3.0'
            },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_Key,
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            data: [
                {
                    Text: data.query
                }
            ]
        };
        const response = await axios.request(options);
        return response.data[0]
    } catch (e) {
        return -1;
    }
}

async function fetchTranslationByMicrosoft(data) {
    try {
        const options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: {
                'to[0]': data.target,
                from: data.source,
                'api-version': '3.0',
                profanityAction: 'NoAction',
                textType: 'plain'
            },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_Key,
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            data: [
                {
                    Text: data.query
                }
            ]
        };
        const language = await axios(options)
        return language.data
    } catch (e) {
        return -1
    }
}

async function finalPerformTranslationByMicrosoft(data) {
    const response = await detectLanguageByMicrosoft(data)
    if (response === -1)
        return -1
    data.source = response.language
    const translateResponse = await fetchTranslationByMicrosoft(data)
    if (translateResponse === -1)
        return -1
    translateResponse[0].translations[0].source = response.language
    translateResponse[0].translations[0].engine = "Microsoft Translator Text"
    return translateResponse
}

export const translate = asyncHandler(async (req, res, next) => {
    const { target, query } = req.body
    if (!target)
        return next(new ErrorResponse("the target language is required", 400));
    if (!query)
        return next(new ErrorResponse("the query is required", 400));
    let response;
    response = await finalPerformTranslationByGoogle(req.body)
    if (response === -1)
        response = await finalPerformTranslationByMicrosoft(req.body);
    if (response === -1)
        return next(new ErrorResponse("An error occured", 500));
    const translatedText = response.length > 0 ? response[0].translations[0].text
        : response.translations[0].translatedText;
    const source = response.length > 0 ? response[0].translations[0].source
        : response.translations[0].source;
    const engine = response.length > 0 ? response[0].translations[0].engine
        : response.translations[0].engine;
    const translation = await Translation.create({
        text: query,
        translation: translatedText,
        sourceLang: source,
        targetLang: target,
        engine: engine,
        userId: req.user.id
    })
    dataResponse(res, 201, { translatedText, translation })
})

// Paginated
export const getTranslationHistory = asyncHandler(async (req, res, next) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(+page, +size);
    const userId = req.user.id
    const translations = await Translation.findAndCountAll({
        where: { userId },
        limit,
        offset,
        attributes: ['text', 'translation', 'sourceLang', 'targetLang', 'engine']
    })
    const response = getPagingData(translations, page, limit);
    dataResponse(res, 201, response)
})

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: translations } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, translations, totalPages, currentPage };
};