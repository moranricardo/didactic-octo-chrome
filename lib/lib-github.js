import { execSync } from 'child_process';

const GITHUB_API = 'https://api.github.com';
const REPO = 'moranricardo/didactic-octo-chrome';

const getToken = () => execSync('gh auth token').toString().trim();

// 1. Lector base del repositorio en GitHub
export async function getGitHubData(endpoint) {
    const url = endpoint ? `${GITHUB_API}/repos/${REPO}/${endpoint}` : `${GITHUB_API}/repos/${REPO}`;

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

// 2. Escritor especializado: Crea un Issue automatizado de alerta
export async function createGitHubIssue(title, body) {
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
            title: title,
            body: body,
            labels: ['bug', 'automated-alert']
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub API Post Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}
