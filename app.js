// ==================== Состояние игры ====================
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

// ====== Загрузка данных из JSON ======
async function loadGameData() {
    try {
        console.log('Загрузка данных из JSON...');
        const response = await fetch('/digital-education-day2-task1/final_full_mediaplan.json');

        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        console.log('Данные успешно загружены:', data);

        gameState.gameData = data;
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
}

// ====== Ожидаем полной загрузки DOM ======
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM загружен, инициализация приложения...');
    await initApp();
});

async function initApp() {
    console.log('Инициализация приложения...');
    try {
        await loadGameData();
        setupEventListeners();
        showScreen('welcome-screen');
        console.log('Приложение инициализировано успешно');
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

// ====== Обработчики событий ======
function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    const startButton = document.getElementById('start-game');
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Начало игры!');
            showScreen('step1-screen');
            initializeStep1();
        });
    }

    const completeStep1Button = document.getElementById('complete-step1');
    if (completeStep1Button) {
        completeStep1Button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Завершение этапа 1');
            handleStep1Complete();
        });
    }

    const tryAgainButton = document.getElementById('try-again');
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleTryAgain();
        });
    }

    const continueButton = document.getElementById('continue-to-step2');
    if (continueButton) {
        continueButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Переход к этапу 2...');
            showScreen('step2-screen');
            initializeStep2();
        });
    }

    const completeStep2Button = document.getElementById('complete-step2');
    if (completeStep2Button) {
        completeStep2Button.addEventListener('click', function(e) {
            e.preventDefault();
            handleStep2Complete();
        });
    }

    const restartButton = document.getElementById('restart-game');
    if (restartButton) {
        restartButton.addEventListener('click', function(e) {
            e.preventDefault();
            restartGame();
        });
    }
}

function showScreen(screenId) {
    console.log('Переключение на экран:', screenId);
    try {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            gameState.currentStep = screenId.replace('-screen', '');
            console.log('✓ Успешно показан экран:', screenId);
        } else {
            console.error('✗ Целевой экран не найден:', screenId);
        }
    } catch (error) {
        console.error('Ошибка переключения экрана:', error);
    }
}

// ====== ЭТАП 1: отбор площадок ======
function initializeStep1() {
    console.log('Инициализация этапа 1...');
    if (!gameState.gameData) {
        console.error('Данные не загружены');
        return;
    }
    try {
        const tableBody = document.getElementById('mediaplan-table-body');
        if (!tableBody) {
            console.error('Тело таблицы медиаплана не найдено');
            return;
        }
        tableBody.innerHTML = '';

        // Используем step1
        const platforms = gameState.gameData.step1 || [];
        console.log('Загружено площадок:', platforms.length);

        platforms.forEach(platform => {
            const row = createMediaplanRow(platform);
            tableBody.appendChild(row);
        });

        updateStep1Button();
        updateAttemptsCounter();
        updateSelectionCount();
        console.log('✓ Этап 1 инициализирован с', platforms.length, 'площадками');
    } catch (error) {
        console.error('Ошибка инициализации этапа 1:', error);
    }
}

function createMediaplanRow(platform) {
    const row = document.createElement('tr');
    row.dataset.platformId = platform.id;
    if (platform.feedback) {
        row.title = platform.feedback;
        row.style.cursor = 'help';
    }
    // Только реальные поля из JSON
    row.innerHTML = `
        <td class="checkbox-col sticky-col">
            <input type="checkbox" class="mediaplan-checkbox" data-platform-id="${platform.id}">
        </td>
        <td class="number-col">${platform.id ?? '-'}</td>
        <td class="site-col">${platform.site ?? '-'}</td>
        <td class="age-col">${platform.age ?? '-'}</td>
        <td class="segments-col">${platform.segments ?? '-'}</td>
        <td class="format-col">${platform.format ?? '-'}</td>
        <td class="placement-col">${platform.placement_example ?? '-'}</td>
        <td class="unit-col">${platform.purchase_unit ?? '-'}</td>
        <td class="capacity-col">${platform.max_capacity?.toLocaleString() ?? '-'}</td>
        <td class="cost-col">${platform.cost_per_unit?.toLocaleString() ?? '-'} ₽</td>
        <td class="budget-col">${platform.budget?.toLocaleString() ?? '-'} ₽</td>
        <td class="shows-col">${platform.shows?.toLocaleString() ?? '-'}</td>
        <td class="frequency-col">${platform.frequency ?? '-'}</td>
        <td class="cpm-col">${platform.cpm?.toLocaleString() ?? '-'} ₽</td>
        <td class="reach-col">${platform.reach?.toLocaleString() ?? '-'}</td>
        <td class="cpt-col">${platform.cpt?.toLocaleString() ?? '-'}</td>
        <td class="ctr-col">${platform.ctr ? (platform.ctr * 100).toFixed(2) + '%' : '-'}</td>
        <td class="clicks-col">${platform.clicks?.toLocaleString() ?? '-'}</td>
        <td class="cpc-col">${platform.cpc?.toLocaleString() ?? '-'} ₽</td>
        <td class="views-col">${platform.views?.toLocaleString() ?? '-'}</td>
        <td class="vtr-col">${platform.vtr ? (platform.vtr * 100).toFixed(1) + '%' : '-'}</td>
        <td class="cpv-col">${platform.cpv?.toLocaleString() ?? '-'}</td>
        <td class="conversions-session-col">${platform.conversions_session?.toLocaleString() ?? '-'}</td>
        <td class="sessions-col">${platform.sessions?.toLocaleString() ?? '-'}</td>
        <td class="cr-successful-col">${platform.cr_successful ? (platform.cr_successful * 100).toFixed(2) + '%' : '-'}</td>
        <td class="conversions-successful-col">${platform.conversions_successful?.toLocaleString() ?? '-'}</td>
        <td class="cpa-successful-col">${platform.cpa_successful?.toLocaleString() ?? '-'} ₽</td>
    `;
    row.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = row.querySelector('.mediaplan-checkbox');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                handlePlatformSelection(checkbox);
            }
        }
    });
    const checkbox = row.querySelector('.mediaplan-checkbox');
    if (checkbox) {
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation();
            handlePlatformSelection(e.target);
        });
    }
    return row;
}

function handlePlatformSelection(checkbox) {
    const platformId = parseInt(checkbox.dataset.platformId);
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        gameState.selectedPlatforms.add(platformId);
        row.classList.add('selected');
    } else {
        gameState.selectedPlatforms.delete(platformId);
        row.classList.remove('selected');
    }
    updateStep1Button();
    updateSelectionCount();
    console.log('Выбор площадки обновлен. Выбрано:', Array.from(gameState.selectedPlatforms));
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
    console.log('Завершение этапа 1...');
    const results = showStep1Results();
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.classList.remove('hidden');
    const continueButton = document.getElementById('continue-to-step2');
    const tryAgainButton = document.getElementById('try-again');
    const selectedCorrectIds = Array.from(gameState.selectedPlatforms).filter(id =>
        gameState.correctPlatforms.has(id)
    );
    const selectedIncorrectIds = Array.from(gameState.selectedPlatforms).filter(id =>
        !gameState.correctPlatforms.has(id)
    );
    const isCorrectSelection = selectedCorrectIds.length === 5 && selectedIncorrectIds.length === 0;
    if (isCorrectSelection) {
        console.log('Правильный выбор площадок! Можно продолжить.');
        gameState.step1Complete = true;
        if (continueButton) {
            continueButton.classList.remove('hidden');
            continueButton.style.display = 'inline-block';
        }
        if (tryAgainButton) tryAgainButton.classList.add('hidden');
    } else {
        console.log('Неправильный выбор площадок. Нужно попробовать снова.');
        gameState.step1Complete = false;
        if (continueButton) continueButton.classList.add('hidden');
        if (tryAgainButton) {
            tryAgainButton.classList.remove('hidden');
            tryAgainButton.style.display = 'inline-block';
        }
    }
}

function showStep1Results() {
    let selectedCorrectCount = 0;
    let selectedIncorrectCount = 0;
    if (!gameState.gameData) return { selectedCorrectCount: 0, selectedIncorrectCount: 0 };
    const platforms = gameState.gameData.step1 || [];
    platforms.forEach(platform => {
        const row = document.querySelector(`tr[data-platform-id="${platform.id}"]`);
        if (!row) return;
        const isSelected = gameState.selectedPlatforms.has(platform.id);
        const isCorrect = gameState.correctPlatforms.has(platform.id);
        row.classList.remove('correct', 'incorrect');
        if (isSelected) {
            if (isCorrect) {
                row.classList.add('correct');
                selectedCorrectCount++;
            } else {
                row.classList.add('incorrect');
                selectedIncorrectCount++;
            }
        }
    });
    showDetailedFeedback();
    console.log(`Результаты: ${selectedCorrectCount} правильных и ${selectedIncorrectCount} неправильных площадок выбрано`);
    return { selectedCorrectCount, selectedIncorrectCount };
}

function showDetailedFeedback() {
    const feedbackResults = document.getElementById('feedback-results');
    if (!feedbackResults || !gameState.gameData) return;
    feedbackResults.innerHTML = '';
    const platforms = gameState.gameData.step1 || [];
    const selectedPlatforms = platforms.filter(platform =>
        gameState.selectedPlatforms.has(platform.id)
    );
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
        platformName.textContent = `${isCorrect ? '✅' : '❌'} ${platform.site ?? '-'}`;
        const feedbackText = document.createElement('div');
        feedbackText.className = 'feedback-text';
        feedbackText.textContent = platform.feedback || (isCorrect ? 'Позиция подходит, берем в план' : 'Площадка не подходит для данной кампании');
        feedbackItem.appendChild(platformName);
        feedbackItem.appendChild(feedbackText);
        feedbackResults.appendChild(feedbackItem);
    });
}

function handleTryAgain() {
    console.log('Попытка снова...');
    gameState.attempts++;
    gameState.selectedPlatforms.clear();
    gameState.step1Complete = false;
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.classList.add('hidden');
    document.querySelectorAll('tr[data-platform-id]').forEach(row => {
        row.classList.remove('selected', 'correct', 'incorrect');
        const checkbox = row.querySelector('.mediaplan-checkbox');
        if (checkbox) checkbox.checked = false;
    });
    updateStep1Button();
    updateAttemptsCounter();
    updateSelectionCount();
}

// ====== ЭТАП 2: балансировка бюджета ======
function initializeStep2() {
    console.log('Инициализация этапа 2...');
    if (!gameState.step1Complete || !gameState.gameData) {
        console.error('Этап 1 не завершен или данные не загружены! Возврат к этапу 1.');
        showScreen('step1-screen');
        return;
    }
    // Используем step2
    const platforms = gameState.gameData.step2 || [];
    // Можно добавить фильтр иначе, если в step2 содержатся только выбранные правильные
    gameState.budgetData = platforms.map(platform => ({
        ...platform,
        current_quantity: platform.current_quantity ?? platform.take_quantity ?? 0
    }));
    createBudgetTable(gameState.budgetData);
    updateBudgetDisplay();
    console.log('✓ Этап 2 инициализирован с', gameState.budgetData.length, 'правильными площадками');
}

function createBudgetTable(platforms) {
    console.log('Перерисовываем таблицу бюджета!');
    const tableBody = document.getElementById('budget-table-body');
    if (!tableBody) {
        console.error('Тело таблицы бюджета не найдено');
        return;
    }
    tableBody.innerHTML = '';
    if (platforms.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="28" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">Нет правильно выбранных площадок для балансировки бюджета</td>';
        tableBody.appendChild(row);
        return;
    }
    platforms.forEach(platform => {
        const row = createBudgetRow(platform);
        tableBody.appendChild(row);
    });
}

function createBudgetRow(platform) {
    console.log('Создаём строку бюджета для', platform.id);
    const row = document.createElement('tr');
    row.dataset.platformId = platform.id;
    // Только реальные поля + input для выделения
    row.innerHTML = `
        <td class="checkbox-col sticky-col"><input type="checkbox" checked disabled></td>
        <td class="number-col">${platform.id ?? '-'}</td>
        <td class="site-col">${platform.site ?? '-'}</td>
        <td class="age-col">${platform.age ?? '-'}</td>
        <td class="segments-col">${platform.segments ?? '-'}</td>
        <td class="format-col">${platform.format ?? '-'}</td>
        <td class="placement-col">${platform.placement_example ?? '-'}</td>
        <td class="unit-col">${platform.purchase_unit ?? '-'}</td>
        <td class="capacity-col">${platform.max_capacity?.toLocaleString() ?? '-'}</td>
        <td class="quantity-col">
            <div class="quantity-controls">
                <button class="quantity-btn" data-action="decrease" data-platform-id="${platform.id}">−</button>
                <input type="number"
                       class="quantity-input"
                       data-platform-id="${platform.id}"
                       value="${platform.current_quantity ?? 0}"
                       min="0"
                       max="${platform.max_capacity ?? 0}"
                       step="100">
                <button class="quantity-btn" data-action="increase" data-platform-id="${platform.id}">+</button>
            </div>
        </td>
        <td class="cost-col">${platform.cost_per_unit?.toLocaleString() ?? '-'} ₽</td>
        <td class="total-cost-col">${((platform.current_quantity ?? 0) * (platform.cost_per_unit ?? 0)).toLocaleString()} ₽</td>
        <td class="budget-col">${platform.budget?.toLocaleString() ?? '-'} ₽</td>
        <td class="shows-col">${platform.shows?.toLocaleString() ?? '-'}</td>
        <td class="frequency-col">${platform.frequency ?? '-'}</td>
        <td class="cpm-col">${platform.cpm?.toLocaleString() ?? '-'} ₽</td>
        <td class="reach-col">${platform.reach?.toLocaleString() ?? '-'}</td>
        <td class="cpt-col">${platform.cpt?.toLocaleString() ?? '-'}</td>
        <td class="ctr-col">${platform.ctr ? (platform.ctr * 100).toFixed(2) + '%' : '-'}</td>
        <td class="clicks-col">${platform.clicks?.toLocaleString() ?? '-'}</td>
        <td class="cpc-col">${platform.cpc?.toLocaleString() ?? '-'} ₽</td>
        <td class="views-col">${platform.views?.toLocaleString() ?? '-'}</td>
        <td class="vtr-col">${platform.vtr ? (platform.vtr * 100).toFixed(1) + '%' : '-'}</td>
        <td class="cpv-col">${platform.cpv?.toLocaleString() ?? '-'}</td>
        <td class="conversions-session-col">${platform.conversions_session?.toLocaleString() ?? '-'}</td>
        <td class="sessions-col">${platform.sessions?.toLocaleString() ?? '-'}</td>
        <td class="cr-successful-col">${platform.cr_successful ? (platform.cr_successful * 100).toFixed(2) + '%' : '-'}</td>
        <td class="conversions-successful-col">${platform.conversions_successful?.toLocaleString() ?? '-'}</td>
        <td class="cpa-successful-col">${platform.cpa_successful?.toLocaleString() ?? '-'} ₽</td>
    `;
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    const input = row.querySelector('.quantity-input');

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changeQuantity(platform.id, -100);
        });
    }
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changeQuantity(platform.id, 100);
        });
    }
    if (input) {
        input.addEventListener('input', function(e) {
            let val = parseInt(e.target.value);
            if (isNaN(val)) val = 0;
            val = Math.max(0, Math.min(platform.max_capacity ?? 0, val));
            platform.current_quantity = val;
            if (e.target.value !== val.toString()) {
                e.target.value = val;
            }
            updateRowDisplay(platform.id);
            updateBudgetDisplay();
        });
    }
    return row;
}

function changeQuantity(platformId, delta) {
    const platform = gameState.budgetData.find(p => p.id === platformId);
    if (!platform) return;
    platform.current_quantity = Math.max(0, Math.min(platform.max_capacity ?? 0, (platform.current_quantity ?? 0) + delta));
    document.querySelectorAll('.quantity-input').forEach(input => {
        if (parseInt(input.dataset.platformId) === platformId) {
            input.value = platform.current_quantity;
        }
    });
    updateRowDisplay(platformId);
    updateBudgetDisplay();
}

function updateRowDisplay(platformId) {
    const platform = gameState.budgetData.find(p => p.id === platformId);
    const row = document.querySelector(`tr[data-platform-id="${platformId}"]`);
    if (!platform || !row) return;
    const quantityInput = row.querySelector('.quantity-input');
    const totalCostDisplay = row.querySelector('td.total-cost-col');
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    if (quantityInput) {
        quantityInput.value = platform.current_quantity ?? 0;
    }
    if (totalCostDisplay) {
        const totalCost = (platform.current_quantity ?? 0) * (platform.cost_per_unit ?? 0);
        totalCostDisplay.textContent = totalCost.toLocaleString() + ' ₽';
    }
    if (decreaseBtn) {
        decreaseBtn.disabled = (platform.current_quantity ?? 0) === 0;
    }
    if (increaseBtn) {
        increaseBtn.disabled = (platform.current_quantity ?? 0) >= (platform.max_capacity ?? 0);
    }
}

function updateBudgetDisplay() {
    gameState.totalBudget = gameState.budgetData.reduce((sum, platform) =>
        sum + ((platform.current_quantity ?? 0) * (platform.cost_per_unit ?? 0)), 0
    );
    gameState.totalConversions = gameState.budgetData.reduce((sum, platform) =>
        sum + ((platform.current_quantity ?? 0) * (platform.cr_successful ?? 0)), 0
    );
    gameState.totalReach = gameState.budgetData.reduce((sum, platform) =>
        sum + ((platform.current_quantity ?? 0) > 0 ? (platform.reach ?? 0) : 0), 0
    );
    const budgetElement = document.getElementById('current-budget');
    if (budgetElement) {
        budgetElement.textContent = gameState.totalBudget.toLocaleString() + ' ₽';
    }
    const reachElement = document.getElementById('current-reach');
    if (reachElement) {
        reachElement.textContent = gameState.totalReach.toLocaleString();
    }
    const progressFill = document.getElementById('budget-progress-fill');
    const budgetPercentage = document.getElementById('budget-percentage');
    const budgetLimit = gameState.gameData.budget_limit ?? 2000000;
    const percentage = Math.min(100, (gameState.totalBudget / budgetLimit) * 100);
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        if (gameState.totalBudget > budgetLimit) {
            progressFill.classList.add('over-limit');
        } else {
            progressFill.classList.remove('over-limit');
        }
    }
    if (budgetPercentage) {
        budgetPercentage.textContent = Math.round(percentage) + '%';
    }
    const warningMessage = document.getElementById('budget-warning');
    const completeButton = document.getElementById('complete-step2');
    const budgetOverview = document.querySelector('.budget-overview');
    if (gameState.totalBudget > budgetLimit) {
        if (budgetElement) budgetElement.classList.add('over-limit');
        if (budgetOverview) budgetOverview.classList.add('over-limit');
        if (warningMessage) warningMessage.classList.remove('hidden');
        if (completeButton) completeButton.disabled = true;
    } else {
        if (budgetElement) budgetElement.classList.remove('over-limit');
        if (budgetOverview) budgetOverview.classList.remove('over-limit');
        if (warningMessage) warningMessage.classList.add('hidden');
        if (completeButton) completeButton.disabled = gameState.totalBudget === 0;
    }
    const cpaElement = document.getElementById('current-cpa');
    if (cpaElement) {
        const cpa = gameState.totalConversions > 0 ? gameState.totalBudget / gameState.totalConversions : 0;
        cpaElement.textContent = Math.round(cpa).toLocaleString() + ' ₽';
    }
    const conversionsElement = document.getElementById('total-conversions');
    if (conversionsElement) {
        conversionsElement.textContent = Math.round(gameState.totalConversions).toLocaleString();
    }
}

function handleStep2Complete() {
    console.log('Завершение этапа 2...');
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
        summaryElement.innerHTML = `
            <div class="summary-item"><span>Активных площадок:</span><span>${activePlatforms}</span></div>
            <div class="summary-item"><span>Общий охват:</span><span>${gameState.totalReach.toLocaleString()}</span></div>
            <div class="summary-item"><span>Общий объем показов:</span><span>${totalUnits.toLocaleString()}</span></div>
            <div class="summary-item"><span>Прогнозируемые конверсии:</span><span>${Math.round(gameState.totalConversions).toLocaleString()}</span></div>
            <div class="summary-item"><span>Использованный бюджет:</span><span>${gameState.totalBudget.toLocaleString()} ₽</span></div>
            <div class="summary-item"><span>CPA (стоимость конверсии):</span><span>${Math.round(cpa).toLocaleString()} ₽</span></div>
        `;
    }
    const efficiencyElement = document.getElementById('efficiency-rating');
    let efficiency = calculateEfficiency(cpa, gameState.totalBudget, gameState.gameData.budget_limit ?? 2000000);
    let efficiencyText = getEfficiencyText(efficiency);
    if (efficiencyElement) {
        efficiencyElement.innerHTML = `
            <h3>Оценка эффективности медиаплана</h3>
            <div class="efficiency-score">${efficiency}/10</div>
            <div class="efficiency-description">${efficiencyText}</div>
        `;
    }
}

function calculateEfficiency(cpa, budget, budgetLimit) {
    let score = 5;
    const budgetUsage = budget / budgetLimit;
    if (budgetUsage > 0.8 && budgetUsage <= 1) score += 2;
    else if (budgetUsage > 0.6) score += 1;
    else if (budgetUsage < 0.3) score -= 1;
    if (cpa < 5000 && cpa > 0) score += 2;
    else if (cpa < 10000 && cpa > 0) score += 1;
    else if (cpa > 15000) score -= 2;
    if (gameState.attempts === 1) score += 1;
    return Math.max(1, Math.min(10, score));
}

function getEfficiencyText(score) {
    if (score >= 9) {
        return 'Превосходный медиаплан! Отличное соотношение охвата и стоимости. Вы создали эффективную стратегию размещения.';
    } else if (score >= 7) {
        return 'Хороший медиаплан с эффективным использованием бюджета. Выбранные площадки обеспечат хороший охват целевой аудитории.';
    } else if (score >= 5) {
        return 'Приемлемый медиаплан, но есть возможности для оптимизации. Рассмотрите перераспределение бюджета между площадками.';
    } else {
        return 'Медиаплан требует доработки. Попробуйте оптимизировать распределение бюджета и выбор площадок для повышения эффективности.';
    }
}

function restartGame() {
    console.log('Перезапуск игры...');
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
    const feedbackSection = document.getElementById('feedback-section');
    const budgetWarning = document.getElementById('budget-warning');
    if (feedbackSection) feedbackSection.classList.add('hidden');
    if (budgetWarning) budgetWarning.classList.add('hidden');
    showScreen('welcome-screen');
}
