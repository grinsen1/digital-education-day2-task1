let gameState = {
    currentStep: 'welcome',
    selectedPlatforms: new Set(),
    correctPlatforms: new Set([2, 4, 5, 7, 8]),
    attempts: 1,
    budgetData: [],
    totalBudget: 0,
    totalConversions: 0,
    totalReach: 0,
    isComplete: false,
    step1Complete: false,
    gameData: null
};

async function loadGameData() {
    try {
        const response = await fetch('/digital-education-day2-task1/final_full_mediaplan.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        gameState.gameData = data;
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await initApp();
});

async function initApp() {
    try {
        await loadGameData();
        setupEventListeners();
        showScreen('welcome-screen');
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

function setupEventListeners() {
    const startButton = document.getElementById('start-game');
    if (startButton) startButton.addEventListener('click', function(e) { e.preventDefault(); showScreen('step1-screen'); initializeStep1(); });

    const completeStep1Button = document.getElementById('complete-step1');
    if (completeStep1Button) completeStep1Button.addEventListener('click', function(e) { e.preventDefault(); handleStep1Complete(); });

    const tryAgainButton = document.getElementById('try-again');
    if (tryAgainButton) tryAgainButton.addEventListener('click', function(e) { e.preventDefault(); handleTryAgain(); });

    const continueButton = document.getElementById('continue-to-step2');
    if (continueButton) continueButton.addEventListener('click', function(e) { e.preventDefault(); showScreen('step2-screen'); initializeStep2(); });

    const completeStep2Button = document.getElementById('complete-step2');
    if (completeStep2Button) completeStep2Button.addEventListener('click', function(e) { e.preventDefault(); handleStep2Complete(); });

    const restartButton = document.getElementById('restart-game');
    if (restartButton) restartButton.addEventListener('click', function(e) { e.preventDefault(); restartGame(); });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.add('active');
    gameState.currentStep = screenId.replace('-screen', '');
}

function initializeStep1() {
    if (!gameState.gameData) return;
    const tableBody = document.getElementById('mediaplan-table-body');
    tableBody.innerHTML = '';
    const platforms = gameState.gameData.step1 || [];
    platforms.forEach(platform => {
        const row = createMediaplanRow(platform);
        tableBody.appendChild(row);
    });
    updateStep1Button();
    updateAttemptsCounter();
    updateSelectionCount();
}

function createMediaplanRow(platform) {
    const row = document.createElement('tr');
    row.dataset.platformId = platform.id;
    if (platform.feedback) {
        row.title = platform.feedback;
        row.style.cursor = 'help';
    }
    row.innerHTML = `
        <td><input type="checkbox" class="mediaplan-checkbox" data-platform-id="${platform.id}"></td>
        <td>${platform.id ?? '-'}</td>
        <td>${platform.site ?? platform.platform ?? '-'}</td>
        <td>${platform.age ?? '-'}</td>
        <td>${platform.segments ?? '-'}</td>
        <td>${platform.format ?? '-'}</td>
        <td>${platform.placement_example ?? '-'}</td>
        <td>${platform.purchase_unit ?? '-'}</td>
        <td>${platform.max_capacity?.toLocaleString() ?? '-'}</td>
        <td>${platform.take_quantity ?? '-'}</td>
        <td>${platform.cost_per_unit?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.budget?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.shows?.toLocaleString() ?? '-'}</td>
        <td>${platform.frequency ?? '-'}</td>
        <td>${platform.cpm?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.reach?.toLocaleString() ?? '-'}</td>
        <td>${platform.cpt?.toLocaleString() ?? '-'}</td>
        <td>${platform.ctr ? (platform.ctr * 100).toFixed(2) + '%' : '-'}</td>
        <td>${platform.clicks?.toLocaleString() ?? '-'}</td>
        <td>${platform.cpc?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.views?.toLocaleString() ?? '-'}</td>
        <td>${platform.vtr ? (platform.vtr * 100).toFixed(1) + '%' : '-'}</td>
        <td>${platform.cpv?.toLocaleString() ?? '-'}</td>
        <td>${platform.conversions_session?.toLocaleString() ?? '-'}</td>
        <td>${platform.sessions?.toLocaleString() ?? '-'}</td>
        <td>${platform.cr_successful ? (platform.cr_successful * 100).toFixed(2) + '%' : '-'}</td>
        <td>${platform.conversions_successful?.toLocaleString() ?? '-'}</td>
        <td>${platform.cpa_successful?.toLocaleString() ?? '-'} ₽</td>
    `;
    row.querySelector('.mediaplan-checkbox').addEventListener('change', function(e) {
        handlePlatformSelection(e.target);
    });
    return row;
}

function handlePlatformSelection(checkbox) {
    const platformId = parseInt(checkbox.dataset.platformId);
    if (checkbox.checked) gameState.selectedPlatforms.add(platformId);
    else gameState.selectedPlatforms.delete(platformId);
    updateStep1Button();
    updateSelectionCount();
}

function updateStep1Button() {
    const button = document.getElementById('complete-step1');
    if (button) button.disabled = gameState.selectedPlatforms.size === 0;
}

function updateSelectionCount() {
    const counter = document.getElementById('selection-count');
    if (counter) counter.textContent = `Выбрано площадок: ${gameState.selectedPlatforms.size}`;
}
function updateAttemptsCounter() {
    const counter = document.getElementById('attempts-counter');
    if (counter) counter.textContent = gameState.attempts;
}

function handleStep1Complete() {
    const selectedCorrectIds = Array.from(gameState.selectedPlatforms).filter(id => gameState.correctPlatforms.has(id));
    const selectedIncorrectIds = Array.from(gameState.selectedPlatforms).filter(id => !gameState.correctPlatforms.has(id));
    const isCorrectSelection = selectedCorrectIds.length === 5 && selectedIncorrectIds.length === 0;
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.classList.remove('hidden');
    const continueButton = document.getElementById('continue-to-step2');
    const tryAgainButton = document.getElementById('try-again');
    gameState.step1Complete = isCorrectSelection;
    if (isCorrectSelection) {
        if (continueButton) continueButton.classList.remove('hidden');
        if (tryAgainButton) tryAgainButton.classList.add('hidden');
    } else {
        if (continueButton) continueButton.classList.add('hidden');
        if (tryAgainButton) tryAgainButton.classList.remove('hidden');
    }
    showStep1Results();
}

function showStep1Results() {
    const platforms = gameState.gameData.step1 || [];
    platforms.forEach(platform => {
        const row = document.querySelector(`tr[data-platform-id="${platform.id}"]`);
        if (!row) return;
        const isSelected = gameState.selectedPlatforms.has(platform.id);
        const isCorrect = gameState.correctPlatforms.has(platform.id);
        row.classList.remove('correct', 'incorrect');
        if (isSelected && isCorrect) row.classList.add('correct');
        if (isSelected && !isCorrect) row.classList.add('incorrect');
    });
    showDetailedFeedback();
}

function showDetailedFeedback() {
    const feedbackResults = document.getElementById('feedback-results');
    if (!feedbackResults || !gameState.gameData) return;
    feedbackResults.innerHTML = '';
    const platforms = gameState.gameData.step1 || [];
    const selectedPlatforms = platforms.filter(platform => gameState.selectedPlatforms.has(platform.id));
    if (selectedPlatforms.length === 0) {
        feedbackResults.innerHTML = '<div class="feedback-item"><div class="feedback-text">Площадки не выбраны. Выберите хотя бы одну площадку для получения обратной связи.</div></div>';
        return;
    }
    selectedPlatforms.forEach(platform => {
        const isCorrect = gameState.correctPlatforms.has(platform.id);
        const feedbackItem = document.createElement('div');
        feedbackItem.className = `feedback-item ${isCorrect ? 'correct' : 'incorrect'}`;
        const platformName = document.createElement('div');
        platformName.className = `feedback-platform ${isCorrect ? 'correct' : 'incorrect'}`;
        platformName.textContent = `${isCorrect ? '✅' : '❌'} ${platform.site ?? platform.platform ?? '-'}`;
        const feedbackText = document.createElement('div');
        feedbackText.className = 'feedback-text';
        feedbackText.textContent = platform.feedback || (isCorrect ? 'Позиция подходит, берем в план' : 'Площадка не подходит для данной кампании');
        feedbackItem.appendChild(platformName);
        feedbackItem.appendChild(feedbackText);
        feedbackResults.appendChild(feedbackItem);
    });
}

function handleTryAgain() {
    gameState.attempts++;
    gameState.selectedPlatforms.clear();
    gameState.step1Complete = false;
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.classList.add('hidden');
    document.querySelectorAll('#mediaplan-table tr').forEach(row => {
        row.classList.remove('selected', 'correct', 'incorrect');
        const checkbox = row.querySelector('.mediaplan-checkbox');
        if (checkbox) checkbox.checked = false;
    });
    updateStep1Button();
    updateAttemptsCounter();
    updateSelectionCount();
}

function initializeStep2() {
    if (!gameState.step1Complete || !gameState.gameData) {
        showScreen('step1-screen');
        return;
    }
    const platforms = gameState.gameData.step2 || [];
    gameState.budgetData = platforms.map(platform => ({
        ...platform,
        current_quantity: platform.current_quantity ?? platform.take_quantity ?? 0
    }));
    createBudgetTable(gameState.budgetData);
    updateBudgetDisplay();
}

function createBudgetTable(platforms) {
    const tableBody = document.getElementById('budget-table-body');
    tableBody.innerHTML = '';
    platforms.forEach(platform => {
        const row = createBudgetRow(platform);
        tableBody.appendChild(row);
    });
}

function createBudgetRow(platform) {
    const row = document.createElement('tr');
    row.dataset.platformId = platform.id;
    row.innerHTML = `
        <td><input type="checkbox" checked disabled></td>
        <td>${platform.id ?? '-'}</td>
        <td>${platform.site ?? platform.platform ?? '-'}</td>
        <td>${platform.age ?? '-'}</td>
        <td>${platform.segments ?? '-'}</td>
        <td>${platform.format ?? '-'}</td>
        <td>${platform.placement_example ?? '-'}</td>
        <td>${platform.purchase_unit ?? '-'}</td>
        <td>${platform.max_capacity?.toLocaleString() ?? '-'}</td>
        <td><div class="quantity-controls">
            <button class="quantity-btn" data-action="decrease" data-platform-id="${platform.id}">−</button>
            <input type="number"
                   class="quantity-input"
                   data-platform-id="${platform.id}"
                   value="${platform.current_quantity ?? platform.take_quantity ?? 0}"
                   min="0" max="${platform.max_capacity ?? 0}" step="100">
            <button class="quantity-btn" data-action="increase" data-platform-id="${platform.id}">+</button>
        </div></td>
        <td>${platform.cost_per_unit?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.budget?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.shows?.toLocaleString() ?? '-'}</td>
        <td>${platform.frequency ?? '-'}</td>
        <td>${platform.cpm?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.reach?.toLocaleString() ?? '-'}</td>
        <td>${platform.cpt?.toLocaleString() ?? '-'}</td>
        <td>${platform.ctr ? (platform.ctr * 100).toFixed(2) + '%' : '-'}</td>
        <td>${platform.clicks?.toLocaleString() ?? '-'}</td>
        <td>${platform.cpc?.toLocaleString() ?? '-'} ₽</td>
        <td>${platform.views?.toLocaleString() ?? '-'}</td>
        <td>${platform.vtr ? (platform.vtr * 100).toFixed(1) + '%' : '-'}</td>
        <td>${platform.cpv?.toLocaleString() ?? '-'}</td>
        <td>${platform.conversions_session?.toLocaleString() ?? '-'}</td>
        <td>${platform.sessions?.toLocaleString() ?? '-'}</td>
        <td>${platform.cr_successful ? (platform.cr_successful * 100).toFixed(2) + '%' : '-'}</td>
        <td>${platform.conversions_successful?.toLocaleString() ?? '-'}</td>
        <td>${platform.cpa_successful?.toLocaleString() ?? '-'} ₽</td>
    `;
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    const input = row.querySelector('.quantity-input');
    if (decreaseBtn) decreaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        changeQuantity(platform.id, -100);
    });
    if (increaseBtn) increaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        changeQuantity(platform.id, 100);
    });
    if (input) input.addEventListener('input', function(e) {
        let val = parseInt(e.target.value); if (isNaN(val)) val = 0;
        val = Math.max(0, Math.min(platform.max_capacity ?? 0, val));
        platform.current_quantity = val;
        input.value = val;
        updateRowDisplay(platform.id);
        updateBudgetDisplay();
    });
    return row;
}

function changeQuantity(platformId, delta) {
    const platform = gameState.budgetData.find(p => p.id === platformId);
    if (!platform) return;
    platform.current_quantity = Math.max(0, Math.min(platform.max_capacity ?? 0, (platform.current_quantity ?? 0) + delta));
    document.querySelectorAll('.quantity-input').forEach(input => {
        if (parseInt(input.dataset.platformId) === platformId) input.value = platform.current_quantity;
    });
    updateRowDisplay(platformId);
    updateBudgetDisplay();
}

function updateRowDisplay(platformId) {
    const platform = gameState.budgetData.find(p => p.id === platformId);
    const row = document.querySelector(`tr[data-platform-id="${platformId}"]`);
    if (!platform || !row) return;
    const input = row.querySelector('.quantity-input');
    const totalCostDisplay = row.querySelector('.cost-col');
    if (input) input.value = platform.current_quantity ?? 0;
    if (totalCostDisplay) totalCostDisplay.textContent = ((platform.current_quantity ?? 0) * (platform.cost_per_unit ?? 0)).toLocaleString() + ' ₽';
}

function updateBudgetDisplay() {
    gameState.totalBudget = gameState.budgetData.reduce((sum, platform) => sum + ((platform.current_quantity ?? 0) * (platform.cost_per_unit ?? 0)), 0);
    gameState.totalConversions = gameState.budgetData.reduce((sum, platform) => sum + ((platform.current_quantity ?? 0) * (platform.cr_successful ?? 0)), 0);
    gameState.totalReach = gameState.budgetData.reduce((sum, platform) => sum + ((platform.current_quantity ?? 0) > 0 ? (platform.reach ?? 0) : 0), 0);
    const budgetElement = document.getElementById('current-budget');
    if (budgetElement) budgetElement.textContent = gameState.totalBudget.toLocaleString() + ' ₽';
    const reachElement = document.getElementById('current-reach');
    if (reachElement) reachElement.textContent = gameState.totalReach.toLocaleString();
    const cpaElement = document.getElementById('current-cpa');
    if (cpaElement) {
        const cpa = gameState.totalConversions > 0 ? gameState.totalBudget / gameState.totalConversions : 0;
        cpaElement.textContent = Math.round(cpa).toLocaleString() + ' ₽';
    }
    const conversionsElement = document.getElementById('total-conversions');
    if (conversionsElement) conversionsElement.textContent = Math.round(gameState.totalConversions).toLocaleString();
}

function handleStep2Complete() {
    gameState.isComplete = true;
    showScreen('results-screen');
    showResults();
}

function showResults() {
    const summaryElement = document.getElementById('results-summary');
    const activePlatforms = gameState.budgetData.filter(platform => (platform.current_quantity ?? 0) > 0).length;
    const totalUnits = gameState.budgetData.reduce((sum, platform) => sum + (platform.current_quantity ?? 0), 0);
    const cpa = gameState.totalConversions > 0 ? gameState.totalBudget / gameState.totalConversions : 0;
    if (summaryElement) {
        summaryElement.innerHTML =
            `<div class="summary-item"><span>Активных площадок:</span><span>${activePlatforms}</span></div>
            <div class="summary-item"><span>Общий охват:</span><span>${gameState.totalReach.toLocaleString()}</span></div>
            <div class="summary-item"><span>Общий объем показов:</span><span>${totalUnits.toLocaleString()}</span></div>
            <div class="summary-item"><span>Прогнозируемые конверсии:</span><span>${Math.round(gameState.totalConversions).toLocaleString()}</span></div>
            <div class="summary-item"><span>Использованный бюджет:</span><span>${gameState.totalBudget.toLocaleString()} ₽</span></div>
            <div class="summary-item"><span>CPA (стоимость конверсии):</span><span>${Math.round(cpa).toLocaleString()} ₽</span></div>`;
    }
}

function restartGame() {
    gameState = {
        currentStep: 'welcome',
        selectedPlatforms: new Set(),
        correctPlatforms: new Set([2, 4, 5, 7, 8]),
        attempts: 1,
        budgetData: [],
        totalBudget: 0,
        totalConversions: 0,
        totalReach: 0,
        isComplete: false,
        step1Complete: false,
        gameData: gameState.gameData
    };
    showScreen('welcome-screen');
}
