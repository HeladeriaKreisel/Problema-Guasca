/**
 * Visualizador Interactivo del Árbol de Problemas y Árbol de Objetivos
 * Proyecto Integrador I - Universidad de La Salle
 * Autores: Dilan Santiago Correa Gelves & Juan David Espitia Gutiérrez
 */

document.addEventListener('DOMContentLoaded', () => {
    initTreeVisualizer();
});

function initTreeVisualizer() {
    renderProblemTree();
    setupTreeTabs();
}

function setupTreeTabs() {
    const btnProblem = document.getElementById('tab-btn-problem');
    const btnSolution = document.getElementById('tab-btn-solution');
    const containerProblem = document.getElementById('view-problem-tree');
    const containerSolution = document.getElementById('view-solution-tree');

    if (!btnProblem || !btnSolution) return;

    btnProblem.addEventListener('click', () => {
        btnProblem.classList.add('active', 'btn-primary-guasca');
        btnProblem.classList.remove('btn-secondary-guasca');
        btnSolution.classList.remove('active', 'btn-primary-guasca');
        btnSolution.classList.add('btn-secondary-guasca');

        containerProblem.classList.remove('hidden');
        containerSolution.classList.add('hidden');
    });

    btnSolution.addEventListener('click', () => {
        btnSolution.classList.add('active', 'btn-primary-guasca');
        btnSolution.classList.remove('btn-secondary-guasca');
        btnProblem.classList.remove('active', 'btn-primary-guasca');
        btnProblem.classList.add('btn-secondary-guasca');

        containerSolution.classList.remove('hidden');
        containerProblem.classList.add('hidden');
    });
}

function renderProblemTree() {
    const effectsContainer = document.getElementById('problem-effects-container');
    const causesContainer = document.getElementById('problem-causes-container');

    if (effectsContainer) {
        effectsContainer.innerHTML = PROBLEM_TREE_DATA.effects.map((item, idx) => `
            <div class="tree-node-card node-effect group" onclick="showNodeDetail('Efecto Negativo', '${item.title}', '${item.description}')">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-black uppercase tracking-wider text-red-700">Efecto ${idx + 1}</span>
                    <span class="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold uppercase">${item.severity}</span>
                </div>
                <h4 class="font-bold text-gray-900 text-sm group-hover:text-red-900 transition-colors">${item.title}</h4>
                <p class="text-xs text-gray-600 mt-1 line-clamp-2">${item.description}</p>
            </div>
        `).join('');
    }

    if (causesContainer) {
        causesContainer.innerHTML = PROBLEM_TREE_DATA.causes.map((item, idx) => `
            <div class="tree-node-card node-cause group" onclick="showNodeDetail('Causa Raíz', '${item.title}', '${item.description}')">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-black uppercase tracking-wider text-emerald-800">Causa ${idx + 1}</span>
                    <span class="text-emerald-700 text-sm">🌱</span>
                </div>
                <h4 class="font-bold text-gray-900 text-sm group-hover:text-emerald-900 transition-colors">${item.title}</h4>
                <p class="text-xs text-gray-600 mt-1 line-clamp-2">${item.description}</p>
            </div>
        `).join('');
    }
}

function showNodeDetail(type, title, description) {
    const detailBox = document.getElementById('tree-node-detail-modal');
    if (!detailBox) {
        alert(`${type}: ${title}\n\n${description}`);
        return;
    }

    document.getElementById('tree-detail-type').textContent = type;
    document.getElementById('tree-detail-title').textContent = title;
    document.getElementById('tree-detail-desc').textContent = description;

    detailBox.classList.remove('hidden');
    detailBox.classList.add('flex');
}

function closeTreeDetail() {
    const detailBox = document.getElementById('tree-node-detail-modal');
    if (detailBox) {
        detailBox.classList.add('hidden');
        detailBox.classList.remove('flex');
    }
}
