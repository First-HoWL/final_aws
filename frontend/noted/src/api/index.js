// ВСЕ ОБРАЩЕНИЯ К БЕКУ — ЗДЕСЬ

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:8000/api"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export const MOCK_TAGS = [
    'любовь', 'работа', 'страхи', 'семья', 'стыд', 'мечты', 'радость', 'учеба', 'детство', 'прочее'
]

export const MOCK_CONFESSIONS = [
    {
        id: '1',
        text: 'Иногда я притворяюсь, что занят, просто чтобы не отвечать на сообщения.',
        tags: ['стыд', 'прочее'],
        status: 'published',
        likes: 142,
        views: 891,
        created_at: '2024-06-01T12:00:00Z',
    },
    {
        id: '2',
        text: 'Три года думал, что не умею любить. Потом встретил её.',
        tags: ['любовь'],
        status: 'published',
        likes: 327,
        views: 2104,
        created_at: '2024-06-03T09:30:00Z',
    },
    {
        id: '3',
        text: 'Я ухожу с работы, которую ненавижу. Страшно, но впервые за год дышу свободно.',
        tags: ['работа', 'страхи'],
        status: 'published',
        likes: 88,
        views: 540,
        created_at: '2024-06-05T18:00:00Z',
    },
    {
        id: '4',
        text: 'Мечтаю бросить всё и уехать в маленький город у моря.',
        tags: ['мечты'],
        status: 'published',
        likes: 201,
        views: 1300,
        created_at: '2024-06-07T14:20:00Z',
    },
];

export async function getConfessions({tag, sort} = {}) {
    // TODO: return api.get('/confessions', { params: { tag, sort } }).then(r => r.data);
    let list = [...MOCK_CONFESSIONS];
    if (tag) list = list.filter(c => c.tags.includes(tag));
    if (sort === "popular") list.sort((a,b) => b.likes - a.likes);
    return list;
}

export async function getConfession(id) {
    // TODO: return api.get(`/confessions/${id}`).then(r => r.data);
    return MOCK_CONFESSIONS.find(c => c.id === id) || null;
}

export async function getRandomConfession() {
    // TODO: return api.get('/confessions/random').then(r => r.data);
    return MOCK_CONFESSIONS[Math.floor(Math.random() * MOCK_CONFESSIONS.length)];
}

export async function submitConfession({ test, tags }) {
    // TODO: return api.post('/confessions', { text, tags }).then(r => r.data);
    return { id: 'new-' + Date.now(), status: 'pending', text, tags };
}

export async function likeConfession(id) {
    // TODO: return api.post(`/confessions/${id}/like`).then(r => r.data);
    return {likes: 999};
}

export async function sendFeedback({ confession_id, text }) {
    // TODO: return api.post('/feedback', { confession_id, text }).then(r => r.data);
    return { ok: true };
}

export async function loginUser({ username, password }) {
    // TODO: return api.post('/auth/login', { username, password }).then(r => r.data);
    return { token: "mock-token", user: { id: 1, username } };
}

export async function registerUser({ username, password, email }) {
    // TODO: return api.post('/auth/register', { username, password, email }).then(r => r.data);
    return { token: "mock-token", user: { id: 1, username } };
}

export async function logoutUser() {
    // TODO: return api.post('/auth/logout').then(r => r.data);
    return { ok: true };
}

export async function getMe() {
    // TODO: return api.get('/auth/me').then(r => r.data);
    return null;
}

export async function getDonateStats() {
    // TODO: return api.get('/support/stats').then(r => r.data);
    return { total: 4280, supporters: 37 };
}
