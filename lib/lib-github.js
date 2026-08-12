import { execSync } from 'child_process';

const GITHUB_API = 'https://api.github.com';
const REPO = 'moranricardo/didactic-octo-chrome';

// Caché del token para evitar llamadas repetitivas y lentas a la terminal
let cachedToken = null;

const getToken = () => {
    if (cachedToken) return cachedToken;
    try {
        cachedToken = execSync('gh auth token', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
        return cachedToken;
    } catch (e) {
        throw new Error('No se pudo obtener el token de GitHub CLI. Asegúrate de ejecutar "gh auth login".');
    }
};

/**
 * Realiza peticiones GET a la API de GitHub para el repositorio actual.
 */
export async function getGitHubData(endpoint = '') {
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const url = cleanEndpoint ? `${GITHUB_API}/repos/${REPO}/${cleanEndpoint}` : `${GITHUB_API}/repos/${REPO}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${getToken()}`,
            'User-Agent': 'didactic-octo-chrome-bot'
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Crea un nuevo Issue automatizado en el repositorio.
 */
export async function createGitHubIssue(title, body) {
    if (!title || !body) {
        throw new Error('El título y el cuerpo del Issue son obligatorios.');
    }

    const url = `${GITHUB_API}/repos/${REPO}/issues`;
    console.log(`[GitHub Core] 🚀 Despachando alerta al repositorio: ${REPO}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'User-Agent': 'didactic-octo-chrome-bot'
        },
        body: JSON.stringify({
            title,
            body,
            labels: ['bug', 'automated-alert']
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub API Post Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}
