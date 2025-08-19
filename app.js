// Состояние игры
let gameState = {
    currentStep: 'welcome',
    selectedPlatforms: new Set(),
    correctPlatforms: new Set([2, 4, 5, 7, 8]), // Правильные площадки
    attempts: 1,
    budgetData: [],
    totalBudget: 0,
    totalConversions: 0,
    totalReach: 0,
    isComplete: false,
    step1Complete: false,
    gameData: null
};

// Загрузка данных из JSON
async function loadGameData() {
    try {
        console.log('Загрузка данных из JSON...');
        const response = await fetch('digital-education-day2-task1/final_full_mediaplan.json');
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        
        const data = await response.json();
        console.log('Данные успешно загружены:', data);
        
        gameState.gameData = data;
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем фоллбэк данные если JSON не загрузился
        const fallbackData = {
            platforms: [
                {
                    id: 1,
                    site: "MyTarget",
                    age: "18-55",
                    segments_and_interests: "Интерес к покупке Компьютерных аксессуаров",
                    format: "Pre-roll (1920x1080)",
                    placement_example: "MT OLV",
                    purchase_unit: "CPM",
                    max_capacity: 5000,
                    cost_per_unit: 254.0,
                    reach: 250000,
                    frequency: 2.0,
                    cpm: 254.0,
                    cpc: 15.0,
                    ctr: 0.06,
                    conversion_rate: 0.0008,
                    cpa: 4500.0,
                    viewability: 0.85,
                    brand_safety: 0.95,
                    completion_rate: 0.78,
                    engagement_rate: 0.03,
                    gender_male: 0.65,
                    gender_female: 0.35,
                    mobile_traffic: 0.45,
                    desktop_traffic: 0.55,
                    geography: "Москва, СПб",
                    timing: "9:00-22:00",
                    feedback: "Таргетинг на не релевантную аудиторию, данная ЦА рассматривает для покупки другую категорию"
                },
                {
                    id: 2,
                    site: "Yandex.ru// Видеосеть",
                    age: "18-55",
                    segments_and_interests: "Ключевые слова: Монитор купить",
                    format: "Video In-stream",
                    placement_example: "Yandex OLV",
                    purchase_unit: "CPM",
                    max_capacity: 5000,
                    cost_per_unit: 100.0,
                    reach: 350000,
                    frequency: 1.8,
                    cpm: 100.0,
                    cpc: 8.0,
                    ctr: 0.125,
                    conversion_rate: 0.0012,
                    cpa: 2800.0,
                    viewability: 0.92,
                    brand_safety: 0.98,
                    completion_rate: 0.88,
                    engagement_rate: 0.05,
                    gender_male: 0.72,
                    gender_female: 0.28,
                    mobile_traffic: 0.35,
                    desktop_traffic: 0.65,
                    geography: "Вся Россия",
                    timing: "Круглосуточно",
                    feedback: "Позиция подходит, берем в план"
                },
                {
                    id: 3,
                    site: "Yandex.ru//Display",
                    age: "18-55",
                    segments_and_interests: "Интересы: «электроника»",
                    format: "ТГБ",
                    placement_example: "Yandex Display",
                    purchase_unit: "CPC",
                    max_capacity: 20000,
                    cost_per_unit: 20.0,
                    reach: 180000,
                    frequency: 2.5,
                    cpm: 0,
                    cpc: 20.0,
                    ctr: 0.08,
                    conversion_rate: 0.002,
                    cpa: 1800.0,
                    viewability: 0.88,
                    brand_safety: 0.96,
                    completion_rate: 0,
                    engagement_rate: 0.02,
                    gender_male: 0.68,
                    gender_female: 0.32,
                    mobile_traffic: 0.40,
                    desktop_traffic: 0.60,
                    geography: "Крупные города",
                    timing: "8:00-24:00",
                    feedback: "Конверсионный формат (CPC закупка) ввиду чего он не подходит для цели кампании - увеличение охвата"
                },
                {
                    id: 4,
                    site: "Digital Alliance Banner Network",
                    age: "18+",
                    segments_and_interests: "Интересы: «IT и технологии», «электроника»",
                    format: "300x250, 320x100, 320x50, 728x90, 336x280, 320x480, 300x300, 240x400",
                    placement_example: "DA",
                    purchase_unit: "CPM",
                    max_capacity: 4500,
                    cost_per_unit: 65.0,
                    reach: 200000,
                    frequency: 1.6,
                    cpm: 65.0,
                    cpc: 12.0,
                    ctr: 0.05,
                    conversion_rate: 0.0008,
                    cpa: 3200.0,
                    viewability: 0.82,
                    brand_safety: 0.92,
                    completion_rate: 0,
                    engagement_rate: 0.015,
                    gender_male: 0.75,
                    gender_female: 0.25,
                    mobile_traffic: 0.60,
                    desktop_traffic: 0.40,
                    geography: "Москва, регионы",
                    timing: "10:00-23:00",
                    feedback: "Позиция подходит, берем в план"
                },
                {
                    id: 5,
                    site: "Native Rent",
                    age: "18+",
                    segments_and_interests: "Интересы: «технологии»",
                    format: "Рекомендательный блок, блок советы, продуктовый блок, тизер (400х300)",
                    placement_example: "Native Rent",
                    purchase_unit: "CPM",
                    max_capacity: 4000,
                    cost_per_unit: 120.0,
                    reach: 180000,
                    frequency: 1.9,
                    cpm: 120.0,
                    cpc: 18.0,
                    ctr: 0.067,
                    conversion_rate: 0.0007,
                    cpa: 4100.0,
                    viewability: 0.90,
                    brand_safety: 0.94,
                    completion_rate: 0,
                    engagement_rate: 0.08,
                    gender_male: 0.58,
                    gender_female: 0.42,
                    mobile_traffic: 0.70,
                    desktop_traffic: 0.30,
                    geography: "Топ-10 городов",
                    timing: "9:00-21:00",
                    feedback: "Позиция подходит, берем в план"
                },
                {
                    id: 6,
                    site: "Soloway",
                    age: "25-40",
                    segments_and_interests: "Аудиторные сегменты: покупатели мониторов. Высокий доход",
                    format: "Баннеры (120x600, 160x600, 240x400, 240x600, 300x250, 300x300, 300x500, 300x600, 320x480, 336x280, 970x250)",
                    placement_example: "Soloway",
                    purchase_unit: "CPM",
                    max_capacity: 5500,
                    cost_per_unit: 90.0,
                    reach: 80000,
                    frequency: 2.2,
                    cpm: 90.0,
                    cpc: 14.0,
                    ctr: 0.064,
                    conversion_rate: 0.0015,
                    cpa: 2800.0,
                    viewability: 0.87,
                    brand_safety: 0.97,
                    completion_rate: 0,
                    engagement_rate: 0.025,
                    gender_male: 0.80,
                    gender_female: 0.20,
                    mobile_traffic: 0.25,
                    desktop_traffic: 0.75,
                    geography: "Москва",
                    timing: "11:00-19:00",
                    feedback: "Аудитория сильно сужена, благодаря чему мы теряем большой процент потенциальной аудитории"
                },
                {
                    id: 7,
                    site: "VC",
                    age: "18-55",
                    segments_and_interests: "Сегмент: геймеры",
                    format: "Banners:300x600",
                    placement_example: "VC",
                    purchase_unit: "CPM",
                    max_capacity: 3000,
                    cost_per_unit: 759.0,
                    reach: 120000,
                    frequency: 2.8,
                    cpm: 759.0,
                    cpc: 35.0,
                    ctr: 0.022,
                    conversion_rate: 0.0015,
                    cpa: 8500.0,
                    viewability: 0.95,
                    brand_safety: 0.89,
                    completion_rate: 0,
                    engagement_rate: 0.12,
                    gender_male: 0.85,
                    gender_female: 0.15,
                    mobile_traffic: 0.45,
                    desktop_traffic: 0.55,
                    geography: "Крупные города",
                    timing: "14:00-02:00",
                    feedback: "Позиция подходит, берем в план"
                },
                {
                    id: 8,
                    site: "4pda.to",
                    age: "18+",
                    segments_and_interests: "Интересы: «электроника»",
                    format: "Верхняя растяжка веб (1100х250 или 1100х200) + верхняя растяжка моб (1100х400)",
                    placement_example: "4pda to",
                    purchase_unit: "CPM",
                    max_capacity: 4000,
                    cost_per_unit: 176.0,
                    reach: 160000,
                    frequency: 2.1,
                    cpm: 176.0,
                    cpc: 22.0,
                    ctr: 0.08,
                    conversion_rate: 0.001,
                    cpa: 6200.0,
                    viewability: 0.91,
                    brand_safety: 0.90,
                    completion_rate: 0,
                    engagement_rate: 0.04,
                    gender_male: 0.88,
                    gender_female: 0.12,
                    mobile_traffic: 0.55,
                    desktop_traffic: 0.45,
                    geography: "Вся Россия",
                    timing: "Круглосуточно",
                    feedback: "Позиция подходит, берем в план"
                },
                {
                    id: 9,
                    site: "Ozon.ru",
                    age: "18-55",
                    segments_and_interests: "Таргетинг на категории: Компьютерная техника",
                    format: "Тест (Баннер на главной)",
                    placement_example: "Ozon",
                    purchase_unit: "CPM",
                    max_capacity: 6000,
                    cost_per_unit: 150.0,
                    reach: 280000,
                    frequency: 1.5,
                    cpm: 150.0,
                    cpc: 25.0,
                    ctr: 0.06,
                    conversion_rate: 0.0009,
                    cpa: 5800.0,
                    viewability: 0.86,
                    brand_safety: 0.99,
                    completion_rate: 0,
                    engagement_rate: 0.02,
                    gender_male: 0.55,
                    gender_female: 0.45,
                    mobile_traffic: 0.80,
                    desktop_traffic: 0.20,
                    geography: "Крупные города",
                    timing: "8:00-23:00",
                    feedback: "Тестовый формат, статистических данных по нему нет - выделять больший % бюджета на него неверно"
                }
            ]
        };
        
        gameState.gameData = fallbackData;
        console.log('Используются фоллбэк данные:', fallbackData);
        return fallbackData;
    }
}

// Ожидаем полной загрузки DOM
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

function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    
    // Стартовая кнопка
    const startButton = document.getElementById('start-game');
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Начало игры!');
            showScreen('step1-screen');
            initializeStep1();
        });
    }
    
    // Кнопка завершения этапа 1
    const completeStep1Button = document.getElementById('complete-step1');
    if (completeStep1Button) {
        completeStep1Button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Завершение этапа 1');
            handleStep1Complete();
        });
    }
    
    // Кнопка "попробовать снова"
    const tryAgainButton = document.getElementById('try-again');
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleTryAgain();
        });
    }
    
    // Кнопка перехода к этапу 2
    const continueButton = document.getElementById('continue-to-step2');
    if (continueButton) {
        continueButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Переход к этапу 2...');
            showScreen('step2-screen');
            initializeStep2();
        });
    }
    
    // Кнопка завершения этапа 2
    const completeStep2Button = document.getElementById('complete-step2');
    if (completeStep2Button) {
        completeStep2Button.addEventListener('click', function(e) {
            e.preventDefault();
            handleStep2Complete();
        });
    }
    
    // Кнопка рестарта
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
        
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
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
        
        // Используем данные из JSON
        const platforms = gameState.gameData.platforms || [];
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
    
    // Добавляем tooltip с обратной связью
    if (platform.feedback) {
        row.title = platform.feedback;
        row.style.cursor = 'help';
    }
    
    // Все 27 столбцов согласно column_headers
    row.innerHTML = `
        <td class="checkbox-col sticky-col">
            <input type="checkbox" class="mediaplan-checkbox" data-platform-id="${platform.id}">
        </td>
        <td class="number-col">${platform.id || '-'}</td>
        <td class="site-col">${platform.site || '-'}</td>
        <td class="age-col">${platform.age || '-'}</td>
        <td class="segments-col">${platform.segments_and_interests || '-'}</td>
        <td class="format-col">${platform.format || '-'}</td>
        <td class="placement-col">${platform.placement_example || '-'}</td>
        <td class="unit-col">${platform.purchase_unit || '-'}</td>
        <td class="capacity-col">${platform.max_capacity ? platform.max_capacity.toLocaleString() : '-'}</td>
        <td class="cost-col">${platform.cost_per_unit ? platform.cost_per_unit.toLocaleString() + ' ₽' : '-'}</td>
        <td class="reach-col">${platform.reach ? platform.reach.toLocaleString() : '-'}</td>
        <td class="frequency-col">${platform.frequency || '-'}</td>
        <td class="cpm-col">${platform.cpm ? platform.cpm.toLocaleString() + ' ₽' : '-'}</td>
        <td class="cpc-col">${platform.cpc ? platform.cpc.toLocaleString() + ' ₽' : '-'}</td>
        <td class="ctr-col">${platform.ctr ? (platform.ctr * 100).toFixed(2) + '%' : '-'}</td>
        <td class="conversion-col">${platform.conversion_rate ? (platform.conversion_rate * 100).toFixed(2) + '%' : '-'}</td>
        <td class="cpa-col">${platform.cpa ? platform.cpa.toLocaleString() + ' ₽' : '-'}</td>
        <td class="viewability-col">${platform.viewability ? (platform.viewability * 100).toFixed(1) + '%' : '-'}</td>
        <td class="brand-safety-col">${platform.brand_safety ? (platform.brand_safety * 100).toFixed(1) + '%' : '-'}</td>
        <td class="completion-col">${platform.completion_rate ? (platform.completion_rate * 100).toFixed(1) + '%' : '-'}</td>
        <td class="engagement-col">${platform.engagement_rate ? (platform.engagement_rate * 100).toFixed(2) + '%' : '-'}</td>
        <td class="gender-male-col">${platform.gender_male ? (platform.gender_male * 100).toFixed(1) + '%' : '-'}</td>
        <td class="gender-female-col">${platform.gender_female ? (platform.gender_female * 100).toFixed(1) + '%' : '-'}</td>
        <td class="mobile-col">${platform.mobile_traffic ? (platform.mobile_traffic * 100).toFixed(1) + '%' : '-'}</td>
        <td class="desktop-col">${platform.desktop_traffic ? (platform.desktop_traffic * 100).toFixed(1) + '%' : '-'}</td>
        <td class="geography-col">${platform.geography || '-'}</td>
        <td class="timing-col">${platform.timing || '-'}</td>
    `;
    
    // Обработчик клика по строке
    row.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = row.querySelector('.mediaplan-checkbox');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                handlePlatformSelection(checkbox);
            }
        }
    });
    
    // Обработчик чекбокса
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
    if (button) {
        button.disabled = gameState.selectedPlatforms.size === 0;
    }
}

function updateSelectionCount() {
    const counter = document.getElementById('selection-count');
    if (counter) {
        counter.textContent = `Выбрано площадок: ${gameState.selectedPlatforms.size}`;
    }
}

function updateAttemptsCounter() {
    const counter = document.getElementById('attempts-counter');
    if (counter) {
        counter.textContent = gameState.attempts;
    }
}

function handleStep1Complete() {
    console.log('Завершение этапа 1...');
    
    const results = showStep1Results();
    
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) {
        feedbackSection.classList.remove('hidden');
    }
    
    const continueButton = document.getElementById('continue-to-step2');
    const tryAgainButton = document.getElementById('try-again');
    
    // Проверяем правильность выбора - должны быть выбраны площадки [2,4,5,7,8]
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
    
    // Обновляем визуальное отображение строк
    if (!gameState.gameData) return { selectedCorrectCount: 0, selectedIncorrectCount: 0 };
    
    const platforms = gameState.gameData.platforms || [];
    
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
    
    // Показываем детальную обратную связь
    showDetailedFeedback();
    
    console.log(`Результаты: ${selectedCorrectCount} правильных и ${selectedIncorrectCount} неправильных площадок выбрано`);
    
    return { selectedCorrectCount, selectedIncorrectCount };
}

function showDetailedFeedback() {
    const feedbackResults = document.getElementById('feedback-results');
    if (!feedbackResults || !gameState.gameData) return;
    
    feedbackResults.innerHTML = '';
    
    // Показываем обратную связь только для выбранных площадок
    const platforms = gameState.gameData.platforms || [];
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
        platformName.textContent = `${isCorrect ? '✅' : '❌'} ${platform.site}`;
        
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
    if (feedbackSection) {
        feedbackSection.classList.add('hidden');
    }
    
    document.querySelectorAll('tr[data-platform-id]').forEach(row => {
        row.classList.remove('selected', 'correct', 'incorrect');
        const checkbox = row.querySelector('.mediaplan-checkbox');
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    
    updateStep1Button();
    updateAttemptsCounter();
    updateSelectionCount();
}

function initializeStep2() {
    console.log('Инициализация этапа 2...');
    
    if (!gameState.step1Complete || !gameState.gameData) {
        console.error('Этап 1 не завершен или данные не загружены! Возврат к этапу 1.');
        showScreen('step1-screen');
        return;
    }
    
    // Получаем только правильно выбранные площадки
    const platforms = gameState.gameData.platforms || [];
    const selectedCorrectPlatforms = platforms.filter(platform => 
        gameState.selectedPlatforms.has(platform.id) && gameState.correctPlatforms.has(platform.id)
    );
    
    // Инициализируем количество для этапа 2
    selectedCorrectPlatforms.forEach(platform => {
        platform.current_quantity = 0;
    });
    
    gameState.budgetData = selectedCorrectPlatforms;
    
    createBudgetTable(selectedCorrectPlatforms);
    updateBudgetDisplay();
    
    console.log('✓ Этап 2 инициализирован с', selectedCorrectPlatforms.length, 'правильными площадками');
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
        row.innerHTML = '<td colspan="29" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">Нет правильно выбранных площадок для балансировки бюджета</td>';
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
    
    row.innerHTML = `
        <td class="checkbox-col sticky-col">
            <input type="checkbox" checked disabled>
        </td>
        <td class="number-col">${platform.id || '-'}</td>
        <td class="site-col">${platform.site || '-'}</td>
        <td class="age-col">${platform.age || '-'}</td>
        <td class="segments-col">${platform.segments_and_interests || '-'}</td>
        <td class="format-col">${platform.format || '-'}</td>
        <td class="placement-col">${platform.placement_example || '-'}</td>
        <td class="unit-col">${platform.purchase_unit || '-'}</td>
        <td class="capacity-col">${platform.max_capacity ? platform.max_capacity.toLocaleString() : '-'}</td>
         <td class="quantity-col">
            <div class="quantity-controls">
                <button class="quantity-btn" data-action="decrease" data-platform-id="${platform.id}">−</button>
                <input type="number" 
                       class="quantity-input" 
                       data-platform-id="${platform.id}" 
                       value="${platform.current_quantity}" 
                       min="0" 
                       max="${platform.max_capacity}" 
                       step="100">
                <button class="quantity-btn" data-action="increase" data-platform-id="${platform.id}">+</button>
            </div>
        </td>
        <td class="cost-col">${platform.cost_per_unit ? platform.cost_per_unit.toLocaleString() + ' ₽' : '-'}</td>
        <td class="total-cost-col">${(platform.current_quantity * (platform.cost_per_unit || 0)).toLocaleString()} ₽</td>
        <td class="reach-col">${platform.reach ? platform.reach.toLocaleString() : '-'}</td>
        <td class="frequency-col">${platform.frequency || '-'}</td>
        <td class="cpm-col">${platform.cpm ? platform.cpm.toLocaleString() + ' ₽' : '-'}</td>
        <td class="cpc-col">${platform.cpc ? platform.cpc.toLocaleString() + ' ₽' : '-'}</td>
        <td class="ctr-col">${platform.ctr ? (platform.ctr * 100).toFixed(2) + '%' : '-'}</td>
        <td class="conversion-col">${platform.conversion_rate ? (platform.conversion_rate * 100).toFixed(2) + '%' : '-'}</td>
        <td class="cpa-col">${platform.cpa ? platform.cpa.toLocaleString() + ' ₽' : '-'}</td>
        <td class="viewability-col">${platform.viewability ? (platform.viewability * 100).toFixed(1) + '%' : '-'}</td>
        <td class="brand-safety-col">${platform.brand_safety ? (platform.brand_safety * 100).toFixed(1) + '%' : '-'}</td>
        <td class="completion-col">${platform.completion_rate ? (platform.completion_rate * 100).toFixed(1) + '%' : '-'}</td>
        <td class="engagement-col">${platform.engagement_rate ? (platform.engagement_rate * 100).toFixed(2) + '%' : '-'}</td>
        <td class="gender-male-col">${platform.gender_male ? (platform.gender_male * 100).toFixed(1) + '%' : '-'}</td>
        <td class="gender-female-col">${platform.gender_female ? (platform.gender_female * 100).toFixed(1) + '%' : '-'}</td>
        <td class="mobile-col">${platform.mobile_traffic ? (platform.mobile_traffic * 100).toFixed(1) + '%' : '-'}</td>
        <td class="desktop-col">${platform.desktop_traffic ? (platform.desktop_traffic * 100).toFixed(1) + '%' : '-'}</td>
        <td class="geography-col">${platform.geography || '-'}</td>
        <td class="timing-col">${platform.timing || '-'}</td>
    `;
    
    // Кнопки +/−
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    const input = row.querySelector('.quantity-input');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Кнопка минус нажата для', platform.id);
            changeQuantity(platform.id, -100);
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Кнопка плюс нажата для', platform.id);
            changeQuantity(platform.id, 100);
        });
    }
    
    // Обработка ручного ввода
    if (input) {
    input.addEventListener('input', function(e) {
        let val = parseInt(e.target.value);
        if (isNaN(val)) {
            val = 0;
        }
        // Ограничиваем в диапазоне [0, max_capacity]
        val = Math.max(0, Math.min(platform.max_capacity, val));
        
        platform.current_quantity = val;
        console.log('input платформы', platform.id, val);
        // Чтобы не давать пользователю писать больше capacity, обновляем поле
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
    platform.current_quantity = Math.max(0, Math.min(platform.max_capacity, platform.current_quantity + delta));

    // Переписать инпут В ЛЮБОМ СЛУЧАЕ
    document.querySelectorAll('.quantity-input').forEach(input => {
        if (parseInt(input.dataset.platformId) === platformId) {
            input.value = platform.current_quantity;
            console.log('Инпут найден и обновлён:', input, platform.current_quantity);
        }
    });

    updateRowDisplay(platformId);
    updateBudgetDisplay();
}

function updateRowDisplay(platformId) {
    console.log('Вызван updateRowDisplay для:', platformId);
    const platform = gameState.budgetData.find(p => p.id === platformId);
    const row = document.querySelector(`tr[data-platform-id="${platformId}"]`);
    
    if (!platform || !row) return;
    
    const quantityInput = row.querySelector('.quantity-input');
    const totalCostDisplay = row.querySelector('.total-cost-col');
    const decreaseBtn = row.querySelector('[data-action="decrease"]');
    const increaseBtn = row.querySelector('[data-action="increase"]');
    
    if (quantityInput) {
        quantityInput.value = platform.current_quantity;
    }
    
    if (totalCostDisplay) {
    const totalCost = platform.current_quantity * (platform.cost_per_unit || 0);
    console.log('Меняю total-cost для', platformId, 'на', totalCost); // ← вот лог!
    totalCostDisplay.textContent = totalCost.toLocaleString() + ' ₽';
}
    
    if (decreaseBtn) {
        decreaseBtn.disabled = platform.current_quantity === 0;
    }
    
    if (increaseBtn) {
        increaseBtn.disabled = platform.current_quantity >= platform.max_capacity;
    }
}

function updateBudgetDisplay() {
    console.log('Обновляю KPI', gameState.budgetData.map(p => p.current_quantity));
    gameState.totalBudget = gameState.budgetData.reduce((sum, platform) => 
        sum + (platform.current_quantity * (platform.cost_per_unit || 0)), 0
    );
    
    gameState.totalConversions = gameState.budgetData.reduce((sum, platform) => 
        sum + (platform.current_quantity * (platform.conversion_rate || 0)), 0
    );
    
    gameState.totalReach = gameState.budgetData.reduce((sum, platform) => 
        sum + (platform.current_quantity > 0 ? (platform.reach || 0) : 0), 0
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
    const budgetLimit = 2000000; // 2 млн руб
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
    
    const activePlatforms = gameState.budgetData.filter(platform => platform.current_quantity > 0).length;
    const totalUnits = gameState.budgetData.reduce((sum, platform) => sum + platform.current_quantity, 0);
    const cpa = gameState.totalConversions > 0 ? gameState.totalBudget / gameState.totalConversions : 0;
    
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="summary-item">
                <span>Активных площадок:</span>
                <span>${activePlatforms}</span>
            </div>
            <div class="summary-item">
                <span>Общий охват:</span>
                <span>${gameState.totalReach.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span>Общий объем показов:</span>
                <span>${totalUnits.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span>Прогнозируемые конверсии:</span>
                <span>${Math.round(gameState.totalConversions).toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span>Использованный бюджет:</span>
                <span>${gameState.totalBudget.toLocaleString()} ₽</span>
            </div>
            <div class="summary-item">
                <span>CPA (стоимость конверсии):</span>
                <span>${Math.round(cpa).toLocaleString()} ₽</span>
            </div>
        `;
    }
    
    const efficiencyElement = document.getElementById('efficiency-rating');
    let efficiency = calculateEfficiency(cpa, gameState.totalBudget, 2000000);
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
    let score = 5; // Базовая оценка
    
    // Оценка использования бюджета
    const budgetUsage = budget / budgetLimit;
    if (budgetUsage > 0.8 && budgetUsage <= 1) {
        score += 2; // Отлично использован бюджет
    } else if (budgetUsage > 0.6) {
        score += 1; // Хорошо использован
    } else if (budgetUsage < 0.3) {
        score -= 1; // Слишком мало использован
    }
    
    // Оценка CPA
    if (cpa < 5000 && cpa > 0) {
        score += 2; // Отличный CPA
    } else if (cpa < 10000 && cpa > 0) {
        score += 1; // Хороший CPA
    } else if (cpa > 15000) {
        score -= 2; // Слишком дорогой CPA
    }
    
    // Учитываем количество попыток
    if (gameState.attempts === 1) {
        score += 1; // Бонус за первую попытку
    }
    
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
        gameData: gameState.gameData // Сохраняем загруженные данные
    };
    
    const feedbackSection = document.getElementById('feedback-section');
    const budgetWarning = document.getElementById('budget-warning');
    
    if (feedbackSection) feedbackSection.classList.add('hidden');
    if (budgetWarning) budgetWarning.classList.add('hidden');
    
    showScreen('welcome-screen');
}
