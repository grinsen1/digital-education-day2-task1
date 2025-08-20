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
        
        // ✅ ДОБАВЬТЕ: Очистка всех таблиц при переходе к этапу 2
        if (screenId === 'step2-screen') {
            console.log('🧹 Очищаем таблицы этапа 1 при переходе к этапу 2');
            
            // Очистить таблицу этапа 1
            const step1TableBody = document.getElementById('mediaplan-table-body');
            if (step1TableBody) {
                step1TableBody.innerHTML = '';
                console.log('✅ Таблица этапа 1 очищена');
            }
            
            // Убедиться, что все строки с data-platform-id удалены
            const allPlatformRows = document.querySelectorAll('tr[data-platform-id]');
            allPlatformRows.forEach(row => {
                console.log('🗑️ Удаляем старую строку:', row.dataset.platformId);
                row.remove();
            });
        }
        
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
    console.log('🏗️ createBudgetTable вызвана, создаем строки для этапа 2');
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
        console.log('🔨 Создаем строку для платформы:', platform.id, 'через createBudgetRow');
        const row = createBudgetRow(platform);
        
        console.log('➕ Добавляем строку в DOM для платформы:', platform.id);
        tableBody.appendChild(row);
        
        // Проверяем, что строка действительно добавилась в DOM
        const addedRow = document.querySelector(`tr[data-platform-id="${platform.id}"]`);
        if (addedRow) {
            console.log('✅ Строка успешно добавлена в DOM для платформы:', platform.id);
            
            // Проверяем элементы в DOM
            const quantityInputInDOM = addedRow.querySelector('.quantity-input');
            const totalCostInDOM = addedRow.querySelector('.total-cost-col');
            
            console.log('🔍 ПРОВЕРКА ЭЛЕМЕНТОВ В DOM:');
            console.log('   quantity-input в DOM:', quantityInputInDOM ? '✅ есть' : '❌ отсутствует');
            console.log('   total-cost-col в DOM:', totalCostInDOM ? '✅ есть' : '❌ отсутствует');
        } else {
            console.error('❌ Строка НЕ найдена в DOM после добавления для платформы:', platform.id);
        }
    });
    
    console.log('🏁 createBudgetTable завершена');
}


function createBudgetRow(platform) {
    console.log('🔨 createBudgetRow START для платформы:', platform.id);
    console.log('🔨 Platform data:', platform);
    
    const row = document.createElement('tr');
    row.dataset.platformId = platform.id;
    
    // Только реальные поля + input для выделения
    row.innerHTML = `
        <td class="checkbox-col sticky-col"><input type="checkbox" checked disabled></td>
        <td class="number-col">${platform.id ?? '-'}</td>
        <td class="site-col">${platform.platform ?? '-'}</td>
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
    
    console.log('📄 HTML строки после создания:');
    console.log(row.innerHTML);
    
    // Проверяем наличие ключевых элементов СРАЗУ после создания
    const quantityInput = row.querySelector('.quantity-input');
    const totalCostCol = row.querySelector('.total-cost-col');
    const quantityCol = row.querySelector('.quantity-col');
    
    console.log('🔍 ПРОВЕРКА ЭЛЕМЕНТОВ В НОВОЙ СТРОКЕ:');
    console.log('   quantity-col:', quantityCol ? '✅ найден' : '❌ отсутствует');
    console.log('   quantity-input:', quantityInput ? '✅ найден' : '❌ отсутствует');
    console.log('   total-cost-col:', totalCostCol ? '✅ найден' : '❌ отсутствует');
    
    if (quantityInput) {
        console.log('📝 Quantity input value:', quantityInput.value);
        console.log('📝 Quantity input data-platform-id:', quantityInput.dataset.platformId);
    }
    
    if (totalCostCol) {
        console.log('💰 Total cost содержимое:', totalCostCol.textContent);
    }
    
    // Находим кнопки
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    const input = row.querySelector('.quantity-input');

    console.log('🔍 ПОИСК КНОПОК И INPUT:');
    console.log('   decreaseBtn:', decreaseBtn ? '✅ найдена' : '❌ не найдена');
    console.log('   increaseBtn:', increaseBtn ? '✅ найдена' : '❌ не найдена');
    console.log('   input:', input ? '✅ найден' : '❌ не найден');

    // Привязываем обработчики
    if (decreaseBtn) {
        console.log('🔗 Привязываем обработчик decrease для платформы:', platform.id);
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔽 Нажата кнопка decrease для платформы:', platform.id);
            changeQuantity(platform.id, -100);
        });
    } else {
        console.error('❌ Не удалось привязать обработчик decrease - кнопка не найдена');
    }
    
    if (increaseBtn) {
        console.log('🔗 Привязываем обработчик increase для платформы:', platform.id);
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔼 Нажата кнопка increase для платформы:', platform.id);
            changeQuantity(platform.id, 100);
        });
    } else {
        console.error('❌ Не удалось привязать обработчик increase - кнопка не найдена');
    }
    
    if (input) {
        console.log('🔗 Привязываем обработчик input для платформы:', platform.id);
        input.addEventListener('input', function(e) {
            console.log('📝 INPUT CHANGED для платформы:', platform.id, 'новое значение:', e.target.value);
            
            let val = parseInt(e.target.value);
            if (isNaN(val)) val = 0;
            val = Math.max(0, Math.min(platform.max_capacity ?? 0, val));
            platform.current_quantity = val;
            if (e.target.value !== val.toString()) {
                e.target.value = val;
            }
            
            console.log('📊 Обновляем platform.current_quantity на:', val);
            console.log('🔄 Вызываем updateRowDisplay для платформы:', platform.id);
            
            updateRowDisplay(platform.id);
            updateBudgetDisplay();
        });
    } else {
        console.error('❌ Не удалось привязать обработчик input - поле не найдено');
    }
    
    console.log('✅ createBudgetRow END для платформы:', platform.id);
    console.log('📦 Возвращаем строку с data-platform-id:', row.dataset.platformId);
    
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
    console.log('=== updateRowDisplay START ===');
    
    const platform = gameState.budgetData.find(p => p.id === platformId);
    if (!platform) {
        console.error('❌ Platform не найден');
        return;
    }
    
    // Ищем строку ТОЛЬКО в таблице этапа 2
    const budgetTableBody = document.getElementById('budget-table-body');
    if (!budgetTableBody) {
        console.error('❌ budget-table-body не найдено');
        return;
    }
    
    const row = budgetTableBody.querySelector(`tr[data-platform-id="${platformId}"]`);
    if (!row) {
        console.error('❌ Строка не найдена в таблице этапа 2');
        return;
    }
    
    console.log('✅ Строка найдена, начинаем пересчеты...');
    
    // === БАЗОВЫЕ ЗНАЧЕНИЯ ===
    const currentQuantity = platform.current_quantity ?? 0;
    const costPerUnit = platform.cost_per_unit ?? 0;
    const frequency = platform.frequency ?? 1;
    const ctr = platform.ctr ?? 0;
    const vtr = platform.vtr ?? 0;
    const conversionsSession = platform.conversions_session ?? 0;
    const crSuccessful = platform.cr_successful ?? 0;
    
    // === РАСЧЕТЫ ===
    
    // 1. Общая стоимость
    const totalCost = currentQuantity * costPerUnit;
    
    // 2. Показы = Берем в МП * 1000
    const shows = currentQuantity * 1000;
    
    // 3. Охват = Показы / Частота
    const reach = frequency > 0 ? Math.round(shows / frequency) : 0;
    
    // 4. Клики = Показы * CTR
    const clicks = Math.round(shows * ctr);
    
    // 5. CPC = Общая стоимость / Клики
    const cpc = clicks > 0 ? Math.round(totalCost / clicks) : 0;
    
    // 6. Просмотры = Показы * VTR
    const views = Math.round(shows * vtr);
    
    // 7. Сессии = Клики * Конв. в сессии
    const sessions = Math.round(clicks * conversionsSession);
    
    // 8. Конв в успех = Клики * CR в успех
    const conversionsSuccessful = clicks * crSuccessful;
    
    // 9. CPA в конв. = Общая стоимость / Конв в успех
    const cpaSuccessful = conversionsSuccessful > 0 ? Math.round(totalCost / conversionsSuccessful) : 0;
    
    console.log('📊 РАСЧЕТЫ:');
    console.log('  Количество:', currentQuantity);
    console.log('  Показы:', shows.toLocaleString());
    console.log('  Охват:', reach.toLocaleString());
    console.log('  Клики:', clicks.toLocaleString());
    console.log('  CPC:', cpc.toLocaleString());
    console.log('  Просмотры:', views.toLocaleString());
    console.log('  Сессии:', sessions.toLocaleString());
    console.log('  Конв в успех:', conversionsSuccessful.toFixed(2));
    console.log('  CPA успешный:', cpaSuccessful.toLocaleString());
    
    // === ОБНОВЛЕНИЕ DOM ===
    
    // Количество (input)
    const quantityInput = row.querySelector('.quantity-input');
    if (quantityInput) {
        quantityInput.value = currentQuantity;
    }
    
    // Общая стоимость
    const totalCostDisplay = row.querySelector('.total-cost-col');
    if (totalCostDisplay) {
        totalCostDisplay.textContent = totalCost.toLocaleString() + ' ₽';
        console.log('✅ Общая стоимость обновлена');
    }
    
    // Показы
    const showsDisplay = row.querySelector('.shows-col');
    if (showsDisplay) {
        showsDisplay.textContent = shows.toLocaleString();
        console.log('✅ Показы обновлены');
    }
    
    // Охват
    const reachDisplay = row.querySelector('.reach-col');
    if (reachDisplay) {
        reachDisplay.textContent = reach.toLocaleString();
        console.log('✅ Охват обновлен');
    }
    
    // Клики
    const clicksDisplay = row.querySelector('.clicks-col');
    if (clicksDisplay) {
        clicksDisplay.textContent = clicks.toLocaleString();
        console.log('✅ Клики обновлены');
    }
    
    // CPC
    const cpcDisplay = row.querySelector('.cpc-col');
    if (cpcDisplay) {
        cpcDisplay.textContent = cpc.toLocaleString() + ' ₽';
        console.log('✅ CPC обновлен');
    }
    
    // Просмотры
    const viewsDisplay = row.querySelector('.views-col');
    if (viewsDisplay) {
        viewsDisplay.textContent = views.toLocaleString();
        console.log('✅ Просмотры обновлены');
    }
    
    // Сессии
    const sessionsDisplay = row.querySelector('.sessions-col');
    if (sessionsDisplay) {
        sessionsDisplay.textContent = sessions.toLocaleString();
        console.log('✅ Сессии обновлены');
    }
    
    // Конверсии в успешный заказ
    const conversionsSuccessfulDisplay = row.querySelector('.conversions-successful-col');
    if (conversionsSuccessfulDisplay) {
        conversionsSuccessfulDisplay.textContent = conversionsSuccessful.toFixed(2);
        console.log('✅ Конверсии в успех обновлены');
    }
    
    // CPA в успешный заказ
    const cpaSuccessfulDisplay = row.querySelector('.cpa-successful-col');
    if (cpaSuccessfulDisplay) {
        cpaSuccessfulDisplay.textContent = cpaSuccessful.toLocaleString() + ' ₽';
        console.log('✅ CPA успешный обновлен');
    }
    
    // === ОБНОВЛЕНИЕ КНОПОК ===
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    
    if (decreaseBtn) {
        decreaseBtn.disabled = currentQuantity === 0;
    }
    
    if (increaseBtn) {
        increaseBtn.disabled = currentQuantity >= (platform.max_capacity ?? 0);
    }
    
    console.log('🎉 Все расчеты и обновления завершены!');
    console.log('=== updateRowDisplay END ===');
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

/* ----------  calculateEfficiency()  ---------- */
/* отдаёт целое число 1–10                       */
function calculateEfficiency(cpa, budget, budgetLimit) {
  let score = 0;                                   // старт — 0

  /* === 1. Освоение бюджета (0–3 балла) === */
  const usage = budget / budgetLimit;              // доля лимита
  if (usage >= 0.99)          score += 3;          // 99–100 %
  else if (usage >= 0.90)     score += 2;          // 90–98,99 %
  else if (usage >= 0.80)     score += 1;          // 80–89,99 %
  // <80 % — 0 баллов

  /* === 2. CPA (–2…+6 баллов) ===
       Пороги под реальные минимумы (≈24 k ₽)      */
  if (cpa <= 25000)           score += 6;          // топ-эффективность
  else if (cpa <= 40000)      score += 4;          // норм
  else if (cpa <= 60000)      score += 2;          // терпимо
  else if (cpa > 80000)       score -= 2;          // очень плохо
  // 60–80 k — 0 баллов

  /* === 3. Бонус первой попытки (0/1 балл) === */
  if (gameState.attempts === 1) score += 1;

  /* === 4. Ограничение диапазона 1–10 === */
  score = Math.round(score);                       // делаем целым
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
