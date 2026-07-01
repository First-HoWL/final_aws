// ВСЕ ОБРАЩЕНИЯ К БЕКУ — ЗДЕСЬ

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: false
});

export async function getTags() {
    return api.get('/tags').then(r => r.data);
}

export const TAG_MAP = {
    1: 'любовь',
    2: 'работа',
    3: 'страхи',
    4: 'семья',
    5: 'стыд',
    6: 'мечты',
    7: 'радость',
    8: 'учеба',
    9: 'детство',
    10: 'прочее'
};

export const MOCK_TAGS = Object.values(TAG_MAP);

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

export async function getConfessions({ tags, sort } = {}) {
    return api.get('/api/notes/').then(r => {
        let list = r.data;

        list = list.map(item => formatConfession(item));

        if (tags && tags.length > 0) {
            list = list.filter(c => c.tags.some(t => tags.includes(t)));
        }

        if (sort === "popular") {
            list.sort((a, b) => b.likes - a.likes);
        } else {
            list.sort((a, b) => b.id - a.id);
        }

        return list;
    });
}

function formatConfession(item) {
    if (!item) return null;
    const stringTags = Array.isArray(item.tags) 
        ? item.tags.map(tagId => TAG_MAP[tagId] || 'прочее')
        : [];
        
    return {
        id: item.id,
        text: item.text,
        title: item.title,
        tags: stringTags,
        likes: item.likes || 0,
        views: item.views || 0,
        status: item.status ? item.status.toLowerCase() : 'published',
        created_at: item.date
    };
}

export async function getConfession(id) {
    return api.get(`/api/note/${id}/`).then(r => {
        const data = Array.isArray(r.data) ? r.data[0] : r.data;
        return formatConfession(data);
    });
}

export async function getRandomConfession() {
    return api.get('/api/note/random/').then(r => {
        const data = Array.isArray(r.data) ? r.data[0] : r.data;
        return formatConfession(data);
    });
}

export async function submitConfession({ title, text, tags }) {
    const tagIds = tags.map(tagName => {
        const id = Object.keys(TAG_MAP).find(key => TAG_MAP[key] === tagName);
        return Number(id || 10);
    });

    const payload = {
        title: title,
        text: text,
        isAnonimuous: true,
        likes: 0,
        views: 0,
        tags: tagIds,
        status: "PUBLISHED"
    };

    return api.post('/api/notes/', payload).then(r => r.data);
}

export async function likeConfession(id) {
    // TODO: return api.post(`/confessions/${id}/like`).then(r => r.data);
    console.log(`Лайк для записи ${id} отправится на сервер`);
    return api.post(`/api/note/${id}/like/`).then(r => r.data);
}

export async function sendFeedback({ confession_id, text }) {
    // TODO: return api.post('/feedback', { confession_id, text }).then(r => r.data);
    console.log(`Фидбек для записи ${confession_id}: ${text}`);
    return { ok: true };
}

export async function loginUser({ username, password }) {
    // TODO: return api.post('/auth/login', { username, password }).then(r => r.data);
    return api.post('/account/login', { 
        login: username,
        password: password 
    }).then(r => {
        if (r.data.success) {
            localStorage.setItem('user_id', r.data.accaunt.id);
        }
        return {
            token: "django-session",
            user: { 
                id: r.data.accaunt.id, 
                username: r.data.accaunt.login,
                name: r.data.accaunt.name 
            }
        };
    });
}

export async function registerUser({ username, password, email }) {
    // TODO: return api.post('/auth/register', { username, password, email }).then(r => r.data);
    return api.post('/account/create', {
        login: username,
        password: password,
        name: username
    }).then(r => {
        if (r.data.success) {
            localStorage.setItem('user_id', r.data.account.id);
        }
        return {
            token: "django-session",
            user: { 
                id: r.data.account.id, 
                username: r.data.account.login,
                name: r.data.account.name 
            }
        };
    });
}

export async function logoutUser() {
    // TODO: return api.post('/auth/logout').then(r => r.data);
    localStorage.removeItem('user_id');
    return { ok: true };
}

export async function getMe() {
    // /api/notes/<int:pk>/    -- get posts that were written by user
    // TODO: return api.get('/auth/me').then(r => r.data);
    const userId = localStorage.getItem('user_id');
    if (!userId) return null;
    
    return api.get(`/notes/${userId}/`).then(r => {
        return {
            id: userId,
            written_notes: r.data
        };
    }).catch(() => null);
}
