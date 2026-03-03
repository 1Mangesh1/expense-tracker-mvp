/* ========================================
   ExpenseTracker MVP — Application Logic
   ======================================== */

// ---------- Category Configuration ---------- //
const CATEGORIES = {
  Food:          { icon: '🍕', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  Transport:     { icon: '🚗', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  Housing:       { icon: '🏠', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  Entertainment: { icon: '🎬', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  Healthcare:    { icon: '🏥', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  Electronics:   { icon: '💻', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  Clothing:      { icon: '👔', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Education:     { icon: '📚', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  Utilities:     { icon: '⚡', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  Other:         { icon: '📦', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' }
};

const CATEGORY_NAMES = Object.keys(CATEGORIES);

// ---------- Sample Data ---------- //
const SAMPLE_EXPENSES = [
  { id: 's1', date: '2026-02-25', amount: 250,  description: 'Grocery shopping at Metro',   category: 'Food' },
  { id: 's2', date: '2026-02-24', amount: 45,   description: 'Uber ride to office',          category: 'Transport' },
  { id: 's3', date: '2026-02-23', amount: 12000, description: 'Monthly rent payment',         category: 'Housing' },
  { id: 's4', date: '2026-02-22', amount: 89,   description: 'Coffee and lunch meeting',     category: 'Food' },
  { id: 's5', date: '2026-02-21', amount: 2500, description: 'Laptop purchase for work',     category: 'Electronics' },
  { id: 's6', date: '2026-02-20', amount: 350,  description: 'Movie tickets and popcorn',    category: 'Entertainment' },
  { id: 's7', date: '2026-02-18', amount: 199,  description: 'Monthly gym subscription',     category: 'Healthcare' },
  { id: 's8', date: '2026-02-15', amount: 1800, description: 'Electricity bill payment',     category: 'Utilities' },
  { id: 's9', date: '2026-01-28', amount: 450,  description: 'Winter jacket from Zara',      category: 'Clothing' },
  { id: 's10', date: '2026-01-25', amount: 2200, description: 'Online Python course',         category: 'Education' },
  { id: 's11', date: '2026-01-20', amount: 180,  description: 'Train tickets to Pune',        category: 'Transport' },
  { id: 's12', date: '2026-01-15', amount: 320,  description: 'Dinner at Italian restaurant', category: 'Food' },
];

// ---------- Quick-Add Templates ---------- //
const QUICK_ADD_TEMPLATES = [
  { icon: '☕', label: 'Coffee', amount: 80, category: 'Food' },
  { icon: '🍱', label: 'Lunch', amount: 200, category: 'Food' },
  { icon: '🚕', label: 'Cab', amount: 150, category: 'Transport' },
  { icon: '🛒', label: 'Grocery', amount: 500, category: 'Food' },
  { icon: '⛽', label: 'Fuel', amount: 1000, category: 'Transport' },
  { icon: '🎬', label: 'Movie', amount: 300, category: 'Entertainment' },
  { icon: '💊', label: 'Medicine', amount: 250, category: 'Healthcare' },
  { icon: '📱', label: 'Recharge', amount: 299, category: 'Utilities' },
];

// ---------- Achievement Definitions ---------- //
const ACHIEVEMENT_DEFS = [
  { id: 'first_expense',   icon: '🎯', name: 'First Step',       desc: 'Add your first expense',                check: (s) => s.expenses.length >= 1 },
  { id: 'ten_expenses',    icon: '📊', name: 'Tracker',          desc: 'Log 10 expenses',                       check: (s) => s.expenses.length >= 10 },
  { id: 'fifty_expenses',  icon: '🏆', name: 'Dedicated',        desc: 'Log 50 expenses',                       check: (s) => s.expenses.length >= 50 },
  { id: 'budget_master',   icon: '💰', name: 'Budget Master',    desc: 'Stay under budget for a month',         check: (s) => { const mk = getCurrentMonthKey(); const t = s.expenses.filter(e => getMonthKey(e.date) === mk).reduce((a,e) => a + Number(e.amount), 0); return s.expenses.some(e => getMonthKey(e.date) === mk) && t <= s.monthlyBudget; } },
  { id: 'big_spender',     icon: '💎', name: 'Big Spender',      desc: 'Single expense over ₹5,000',            check: (s) => s.expenses.some(e => Number(e.amount) >= 5000) },
  { id: 'frugal',          icon: '🪙', name: 'Frugal',           desc: '5 expenses under ₹100',                 check: (s) => s.expenses.filter(e => Number(e.amount) < 100).length >= 5 },
  { id: 'multi_category',  icon: '🌈', name: 'Diversified',      desc: 'Use 5 different categories',            check: (s) => new Set(s.expenses.map(e => e.category)).size >= 5 },
  { id: 'all_categories',  icon: '🎨', name: 'Completionist',    desc: 'Use all 10 categories',                 check: (s) => new Set(s.expenses.map(e => e.category)).size >= 10 },
  { id: 'streak_3',        icon: '🔥', name: '3‑Day Streak',     desc: 'Log expenses 3 days in a row',          check: (s) => getMaxStreak(s.expenses) >= 3 },
  { id: 'streak_7',        icon: '⚡', name: 'Week Warrior',     desc: 'Log expenses 7 days in a row',          check: (s) => getMaxStreak(s.expenses) >= 7 },
  { id: 'streak_30',       icon: '👑', name: 'Month Champion',   desc: 'Log expenses 30 days in a row',         check: (s) => getMaxStreak(s.expenses) >= 30 },
  { id: 'early_bird',      icon: '🐦', name: 'Day-One Logger',   desc: 'Log expense on the 1st of a month',     check: (s) => s.expenses.some(e => new Date(e.date + 'T00:00:00').getDate() === 1) },
];

// ---------- State ---------- //
const state = {
  expenses: [],
  monthlyBudget: 25000,
  apiConfig: {
    googleSheetsId: '',
    geminiApiKey: ''
  },
  filters: {
    search: '',
    category: '',
    month: '',
    sort: 'date-desc'
  },
  deleteTargetId: null,
  recurringExpenses: [],
  heatmapMonth: new Date(),
  unlockedAchievements: [],
  firstVisit: true,
  theme: null
};

// ---------- Storage Keys ---------- //
const STORAGE_KEYS = {
  expenses: 'et_expenses',
  budget: 'et_budget',
  apiConfig: 'et_api_config',
  recurring: 'et_recurring',
  achievements: 'et_achievements',
  firstVisit: 'et_first_visit',
  theme: 'et_theme'
};

// ---------- Persistence ---------- //
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(state.expenses));
    localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(state.monthlyBudget));
    localStorage.setItem(STORAGE_KEYS.apiConfig, JSON.stringify(state.apiConfig));
    localStorage.setItem(STORAGE_KEYS.recurring, JSON.stringify(state.recurringExpenses));
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(state.unlockedAchievements));
    localStorage.setItem(STORAGE_KEYS.firstVisit, JSON.stringify(state.firstVisit));
    if (state.theme) localStorage.setItem(STORAGE_KEYS.theme, state.theme);
    else localStorage.removeItem(STORAGE_KEYS.theme);
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

function loadFromStorage() {
  try {
    const expenses = localStorage.getItem(STORAGE_KEYS.expenses);
    const budget = localStorage.getItem(STORAGE_KEYS.budget);
    const apiConfig = localStorage.getItem(STORAGE_KEYS.apiConfig);
    const recurring = localStorage.getItem(STORAGE_KEYS.recurring);
    const achievements = localStorage.getItem(STORAGE_KEYS.achievements);
    const firstVisit = localStorage.getItem(STORAGE_KEYS.firstVisit);

    if (expenses) {
      state.expenses = JSON.parse(expenses);
      state.firstVisit = false;
    } else {
      // First visit — load sample data
      state.expenses = SAMPLE_EXPENSES.map(e => ({ ...e }));
      state.firstVisit = true;
    }

    if (budget) state.monthlyBudget = JSON.parse(budget);
    if (apiConfig) state.apiConfig = JSON.parse(apiConfig);
    if (recurring) state.recurringExpenses = JSON.parse(recurring);
    if (achievements) state.unlockedAchievements = JSON.parse(achievements);
    if (firstVisit !== null) state.firstVisit = JSON.parse(firstVisit);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme) state.theme = savedTheme;
  } catch (e) {
    console.warn('localStorage load failed:', e);
    state.expenses = SAMPLE_EXPENSES.map(e => ({ ...e }));
    state.firstVisit = true;
  }
}

// ---------- DOM References ---------- //
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let dom = {};

function cacheDom() {
  dom = {
    // Header
    monthlyTotal: $('#monthlyTotal'),
    budgetLeft: $('#budgetLeft'),
    dailyAvg: $('#dailyAvg'),
    expenseCount: $('#expenseCount'),
    budgetProgress: $('#budgetProgress'),
    budgetText: $('#budgetText'),
    budgetAmount: $('#budgetAmount'),
    // Insights
    patternText: $('#patternText'),
    progressRing: $('#progressRing'),
    progressPercent: $('#progressPercent'),
    progressSub: $('#progressSub'),
    categoryBars: $('#categoryBars'),
    // Expense list
    expenseList: $('#expenseList'),
    emptyState: $('#emptyState'),
    filteredCount: $('#filteredCount'),
    filterSummary: $('#filterSummary'),
    filterSummaryText: $('#filterSummaryText'),
    // Filters
    searchInput: $('#searchInput'),
    categoryFilter: $('#categoryFilter'),
    monthFilter: $('#monthFilter'),
    sortSelect: $('#sortSelect'),
    // Expense modal
    expenseModal: $('#expenseModal'),
    expenseModalTitle: $('#expenseModalTitle'),
    addExpenseForm: $('#addExpenseForm'),
    amountInput: $('#amount'),
    dateInput: $('#date'),
    descriptionInput: $('#description'),
    categorySelect: $('#category'),
    editExpenseId: $('#editExpenseId'),
    submitBtn: $('#submitBtn'),
    // Settings modal
    settingsModal: $('#settingsModal'),
    monthlyBudgetInput: $('#monthlyBudgetInput'),
    sheetsIdInput: $('#sheetsId'),
    geminiKeyInput: $('#geminiKey'),
    // Delete modal
    deleteModal: $('#deleteModal'),
    deletePreview: $('#deletePreview'),
    // Overlay
    loadingOverlay: $('#loadingOverlay'),
    toastContainer: $('#toastContainer'),
    // Quick Add
    quickAddRow: $('#quickAddRow'),
    // Heatmap
    heatmapGrid: $('#heatmapGrid'),
    heatmapMonthLabel: $('#heatmapMonthLabel'),
    heatmapTooltip: $('#heatmapTooltip'),
    // Month Chart
    monthChart: $('#monthChart'),
    // Achievements
    achievementsGrid: $('#achievementsGrid'),
    achievementCount: $('#achievementCount'),
    // Recurring
    recurringList: $('#recurringList'),
    recurringEmpty: $('#recurringEmpty'),
    recurringModal: $('#recurringModal'),
    recurringForm: $('#recurringForm'),
    recurringDesc: $('#recurringDesc'),
    recurringAmount: $('#recurringAmount'),
    recurringCategory: $('#recurringCategory'),
    recurringFreq: $('#recurringFreq'),
    recurringDay: $('#recurringDay'),
    editRecurringId: $('#editRecurringId'),
    recurringModalTitle: $('#recurringModalTitle'),
    submitRecurring: $('#submitRecurring'),
    // Import
    importBtn: $('#importBtn'),
    importFile: $('#importFile'),
    // Lifetime stats
    lifetimeGrid: $('#lifetimeGrid'),
    // Smart Add
    smartAddInput: $('#smartAddInput'),
    smartAddBtn: $('#smartAddBtn'),
    smartAddDirectBtn: $('#smartAddDirectBtn'),
    smartAddHistory: $('#smartAddHistory'),
    smartAddPreview: $('#smartAddPreview'),
    // Forecast
    forecastContent: $('#forecastContent'),
    // Anomaly
    anomalyBanner: $('#anomalyBanner'),
    anomalyBannerText: $('#anomalyBannerText'),
  };
}

// ---------- Utility Functions ---------- //
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function formatCurrencyShort(value) {
  if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L';
  if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K';
  return formatCurrency(value);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
}

function getMonthKey(dateStr) {
  return dateStr.substring(0, 7); // "2026-02"
}

function getMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-');
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function showLoading() { dom.loadingOverlay.classList.remove('hidden'); }
function hideLoading() { dom.loadingOverlay.classList.add('hidden'); }

// ---------- Toast System ---------- //
function showToast(message, type = 'info', duration = 3500, action = null) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${message}</span>
    ${action ? `<button class="toast__action">${action.label}</button>` : ''}
  `;

  if (action) {
    toast.querySelector('.toast__action').addEventListener('click', () => {
      action.callback();
      removeToast(toast);
    });
  }

  dom.toastContainer.appendChild(toast);

  const timer = setTimeout(() => removeToast(toast), duration);
  toast._timer = timer;
}

function removeToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.add('toast--exiting');
  toast.addEventListener('animationend', () => toast.remove());
}

// ---------- Rendering ---------- //
function render() {
  renderHeader();
  renderInsights();
  renderExpenseList();
  renderFilters();
  renderQuickAdd();
  renderHeatmap();
  renderMonthChart();
  renderAchievements();
  renderRecurring();
  renderLifetimeStats();
  renderAnomalyBanner();
}

function renderHeader() {
  const currentMonth = getCurrentMonthKey();
  const monthExpenses = state.expenses.filter(e => getMonthKey(e.date) === currentMonth);
  const monthTotal = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const budgetLeft = state.monthlyBudget - monthTotal;
  const pct = state.monthlyBudget ? Math.min(100, (monthTotal / state.monthlyBudget) * 100) : 0;

  // Daily average (days elapsed in current month)
  const now = new Date();
  const daysElapsed = now.getDate();
  const dailyAvg = daysElapsed > 0 ? monthTotal / daysElapsed : 0;

  dom.monthlyTotal.textContent = formatCurrency(monthTotal);
  dom.budgetLeft.textContent = formatCurrency(Math.max(0, budgetLeft));
  dom.budgetLeft.style.color = budgetLeft < 0 ? 'var(--red-400)' : '';
  dom.dailyAvg.textContent = formatCurrency(Math.round(dailyAvg));
  dom.expenseCount.textContent = monthExpenses.length;

  // Budget bar
  dom.budgetProgress.style.width = `${pct}%`;
  dom.budgetProgress.className = 'budget-bar__fill' +
    (pct > 90 ? ' budget-bar__fill--danger' : pct > 70 ? ' budget-bar__fill--warning' : '');
  dom.budgetText.textContent = `${pct.toFixed(0)}% of budget used`;
  dom.budgetAmount.textContent = `${formatCurrency(monthTotal)} / ${formatCurrency(state.monthlyBudget)}`;
}

function renderInsights() {
  const currentMonth = getCurrentMonthKey();
  const monthExpenses = state.expenses.filter(e => getMonthKey(e.date) === currentMonth);
  const monthTotal = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);

  // --- Budget Ring ---
  const pct = state.monthlyBudget ? Math.min(100, (monthTotal / state.monthlyBudget) * 100) : 0;
  const circumference = 2 * Math.PI * 50; // r=50
  const offset = circumference - (pct / 100) * circumference;

  dom.progressRing.style.strokeDasharray = circumference;
  dom.progressRing.style.strokeDashoffset = offset;

  // Color based on percentage
  if (pct > 90) dom.progressRing.style.stroke = 'var(--red-400)';
  else if (pct > 70) dom.progressRing.style.stroke = 'var(--amber-400)';
  else dom.progressRing.style.stroke = 'var(--color-primary)';

  dom.progressPercent.textContent = `${pct.toFixed(0)}%`;
  dom.progressSub.textContent = pct > 100 ? 'over budget!' : 'used';

  // --- Spending Pattern ---
  if (monthExpenses.length >= 2) {
    const totalsByCat = {};
    monthExpenses.forEach(e => {
      totalsByCat[e.category] = (totalsByCat[e.category] || 0) + Number(e.amount);
    });
    const sorted = Object.entries(totalsByCat).sort((a, b) => b[1] - a[1]);
    const [topCat, topAmt] = sorted[0];
    const pctOfTotal = ((topAmt / monthTotal) * 100).toFixed(0);
    const avgPerTx = Math.round(monthTotal / monthExpenses.length);

    dom.patternText.textContent =
      `Your top spend is ${topCat} (${pctOfTotal}% of total). Average per transaction: ${formatCurrency(avgPerTx)}.`;
  } else if (monthExpenses.length === 1) {
    dom.patternText.textContent = `You have 1 expense this month. Add more to see patterns!`;
  } else {
    dom.patternText.textContent = 'No expenses this month yet. Start tracking!';
  }

  // --- Category Bars ---
  const totalsByCat = {};
  monthExpenses.forEach(e => {
    totalsByCat[e.category] = (totalsByCat[e.category] || 0) + Number(e.amount);
  });

  const sortedCats = Object.entries(totalsByCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxAmt = sortedCats.length ? sortedCats[0][1] : 1;

  if (sortedCats.length === 0) {
    dom.categoryBars.innerHTML = '<p class="insight-card__body">No data this month</p>';
  } else {
    dom.categoryBars.innerHTML = sortedCats.map(([cat, amt]) => {
      const config = CATEGORIES[cat] || CATEGORIES.Other;
      const widthPct = (amt / maxAmt) * 100;
      return `
        <div class="cat-bar">
          <div class="cat-bar__header">
            <span class="cat-bar__name">${config.icon} ${cat}</span>
            <span class="cat-bar__amount">${formatCurrency(amt)}</span>
          </div>
          <div class="cat-bar__track">
            <div class="cat-bar__fill" style="width:${widthPct}%;background:${config.color}"></div>
          </div>
        </div>`;
    }).join('');
  }

  // --- Forecast Card ---
  renderForecastCard(monthTotal);
}

function getFilteredExpenses() {
  let list = [...state.expenses];

  // Search
  if (state.filters.search) {
    const q = state.filters.search.toLowerCase();
    list = list.filter(e =>
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      String(e.amount).includes(q)
    );
  }

  // Category
  if (state.filters.category) {
    list = list.filter(e => e.category === state.filters.category);
  }

  // Month
  if (state.filters.month) {
    list = list.filter(e => getMonthKey(e.date) === state.filters.month);
  }

  // Sort
  switch (state.filters.sort) {
    case 'date-desc': list.sort((a, b) => b.date.localeCompare(a.date)); break;
    case 'date-asc':  list.sort((a, b) => a.date.localeCompare(b.date)); break;
    case 'amount-desc': list.sort((a, b) => b.amount - a.amount); break;
    case 'amount-asc':  list.sort((a, b) => a.amount - b.amount); break;
  }

  return list;
}

function renderExpenseList() {
  const filtered = getFilteredExpenses();

  // Show/hide empty state
  if (filtered.length === 0) {
    dom.expenseList.innerHTML = '';
    dom.emptyState.classList.remove('hidden');
    dom.filteredCount.textContent = '';
  } else {
    dom.emptyState.classList.add('hidden');
    const total = filtered.reduce((s, e) => s + Number(e.amount), 0);
    dom.filteredCount.textContent = `${filtered.length} expense${filtered.length === 1 ? '' : 's'} · ${formatCurrency(total)}`;

    const anomalousIds = detectAnomalies();

    dom.expenseList.innerHTML = filtered.map((expense, i) => {
      const cat = CATEGORIES[expense.category] || CATEGORIES.Other;
      const isAnomalous = anomalousIds.has(expense.id);
      return `
        <div class="expense-item" data-id="${expense.id}" style="animation-delay:${Math.min(i * 30, 300)}ms">
          <div class="expense-item__icon" style="background:${cat.bg};color:${cat.color}">
            ${cat.icon}
          </div>
          <div class="expense-item__info">
            <div class="expense-item__desc">${escapeHtml(expense.description)}</div>
            <div class="expense-item__meta">
              <span>${formatDate(expense.date)}</span>
              <span class="expense-item__category" style="background:${cat.bg};color:${cat.color}">
                ${expense.category}
              </span>
              ${isAnomalous ? '<span class="expense-item__anomaly">⚠️ unusual</span>' : ''}
            </div>
          </div>
          <div class="expense-item__right">
            <span class="expense-item__amount">${formatCurrency(expense.amount)}</span>
            <div class="expense-item__actions">
              <button class="action-btn" onclick="openEditModal('${expense.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="action-btn" onclick="duplicateExpense('${expense.id}')" title="Duplicate">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button class="action-btn action-btn--danger" onclick="openDeleteModal('${expense.id}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  // Update filter summary
  const hasFilters = state.filters.search || state.filters.category || state.filters.month;
  if (hasFilters) {
    dom.filterSummary.classList.remove('hidden');
    const parts = [];
    if (state.filters.search) parts.push(`"${state.filters.search}"`);
    if (state.filters.category) parts.push(state.filters.category);
    if (state.filters.month) parts.push(getMonthLabel(state.filters.month));
    dom.filterSummaryText.textContent = `Filtered by: ${parts.join(', ')}`;
  } else {
    dom.filterSummary.classList.add('hidden');
  }
}

function renderFilters() {
  // Populate category filter
  const catFilter = dom.categoryFilter;
  const currentCat = catFilter.value;
  catFilter.innerHTML = '<option value="">All Categories</option>' +
    CATEGORY_NAMES.map(c => `<option value="${c}" ${c === currentCat ? 'selected' : ''}>${CATEGORIES[c].icon} ${c}</option>`).join('');

  // Populate category select in form
  const catSelect = dom.categorySelect;
  const currentFormCat = catSelect.value;
  catSelect.innerHTML = '<option value="">Select...</option>' +
    CATEGORY_NAMES.map(c => `<option value="${c}" ${c === currentFormCat ? 'selected' : ''}>${CATEGORIES[c].icon} ${c}</option>`).join('');

  // Populate month filter
  const months = [...new Set(state.expenses.map(e => getMonthKey(e.date)))].sort().reverse();
  const currentMonth = dom.monthFilter.value;
  dom.monthFilter.innerHTML = '<option value="">All Time</option>' +
    months.map(m => `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${getMonthLabel(m)}</option>`).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- CRUD Operations ---------- //
function addExpense(data) {
  const expense = {
    id: generateId(),
    date: data.date,
    amount: parseFloat(data.amount),
    description: data.description.trim(),
    category: data.category
  };

  state.expenses.push(expense);
  saveToStorage();
  render();
  showToast(`Added ${formatCurrency(expense.amount)} for "${expense.description}"`, 'success');

  // Optionally sync to sheets
  appendExpenseToSheet(expense);
  // Refresh AI forecast
  setTimeout(fetchAIForecastNarrative, 300);
}

function updateExpense(id, data) {
  const idx = state.expenses.findIndex(e => e.id === id);
  if (idx === -1) return;

  state.expenses[idx] = {
    ...state.expenses[idx],
    date: data.date,
    amount: parseFloat(data.amount),
    description: data.description.trim(),
    category: data.category
  };

  saveToStorage();
  render();
  showToast('Expense updated', 'success');
  setTimeout(fetchAIForecastNarrative, 300);
}

function deleteExpense(id) {
  const idx = state.expenses.findIndex(e => e.id === id);
  if (idx === -1) return;

  const deleted = state.expenses.splice(idx, 1)[0];
  saveToStorage();
  render();

  showToast(`Deleted "${deleted.description}"`, 'info', 5000, {
    label: 'Undo',
    callback: () => {
      state.expenses.splice(idx, 0, deleted);
      saveToStorage();
      render();
      showToast('Expense restored', 'success');
    }
  });
}

function clearAllData() {
  if (!confirm('Are you sure you want to delete ALL expenses? This cannot be undone.')) return;
  state.expenses = [];
  saveToStorage();
  render();
  showToast('All data cleared', 'info');
}

function showFirstVisitWarning() {
  if (!state.firstVisit) return;
  
  state.firstVisit = false;
  saveToStorage();
  
  const modal = document.createElement('div');
  modal.className = 'modal modal--active';
  modal.id = 'firstVisitModal';
  modal.innerHTML = `
    <div class="modal__overlay"></div>
    <div class="modal__content">
      <div style="text-align: center; padding: 2rem;">
        <h2 style="margin-bottom: 1rem;">📝 Sample Data Loaded</h2>
        <p style="margin-bottom: 1.5rem; color: var(--gray-600); line-height: 1.6;">
          This app loaded with <strong>sample expense data</strong> to show you how it works. 
          Feel free to edit, delete, or add your own expenses.
        </p>
        <p style="margin-bottom: 2rem; color: var(--gray-500); font-size: 0.9rem;">
          <strong>💡 Tip:</strong> Achievements are earned as you log real expenses!
        </p>
        <button class="btn btn--primary" style="width: 100%;" onclick="document.getElementById('firstVisitModal').remove()">
          Got It! Let's Start
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ---------- Modal Management ---------- //
function openExpenseModal(editId = null) {
  const modal = dom.expenseModal;
  const form = dom.addExpenseForm;

  form.reset();
  dom.editExpenseId.value = '';
  dom.dateInput.value = new Date().toISOString().split('T')[0];

  if (editId) {
    const expense = state.expenses.find(e => e.id === editId);
    if (!expense) return;
    dom.expenseModalTitle.textContent = 'Edit Expense';
    dom.submitBtn.textContent = 'Save Changes';
    dom.editExpenseId.value = editId;
    dom.amountInput.value = expense.amount;
    dom.dateInput.value = expense.date;
    dom.descriptionInput.value = expense.description;

    // Need to render categories first so the option exists
    renderFilters();
    dom.categorySelect.value = expense.category;
  } else {
    dom.expenseModalTitle.textContent = 'Add Expense';
    dom.submitBtn.textContent = 'Add Expense';
    renderFilters();
  }

  modal.classList.remove('hidden');
  // Focus amount after animation
  setTimeout(() => dom.amountInput.focus(), 100);
}

// Make available to inline onclick handlers
window.openEditModal = function(id) { openExpenseModal(id); };

function closeExpenseModal() {
  dom.expenseModal.classList.add('hidden');
}

window.openDeleteModal = function(id) {
  state.deleteTargetId = id;
  const expense = state.expenses.find(e => e.id === id);
  if (!expense) return;

  const cat = CATEGORIES[expense.category] || CATEGORIES.Other;
  dom.deletePreview.innerHTML = `
    <div class="delete-preview__amount">${formatCurrency(expense.amount)}</div>
    <div class="delete-preview__desc">${cat.icon} ${escapeHtml(expense.description)} · ${formatDate(expense.date)}</div>
  `;
  dom.deleteModal.classList.remove('hidden');
};

function closeDeleteModal() {
  dom.deleteModal.classList.add('hidden');
  state.deleteTargetId = null;
}

function openSettings() {
  dom.settingsModal.classList.remove('hidden');
  dom.monthlyBudgetInput.value = state.monthlyBudget;
  dom.sheetsIdInput.value = state.apiConfig.googleSheetsId;
  dom.geminiKeyInput.value = state.apiConfig.geminiApiKey;
}

function closeSettings() {
  dom.settingsModal.classList.add('hidden');
}

function saveSettings() {
  state.monthlyBudget = parseFloat(dom.monthlyBudgetInput.value) || 25000;
  state.apiConfig.googleSheetsId = dom.sheetsIdInput.value.trim();
  state.apiConfig.geminiApiKey = dom.geminiKeyInput.value.trim();
  saveToStorage();
  closeSettings();
  render();
  showToast('Settings saved', 'success');
}

// ---------- Export ---------- //
function exportCSV() {
  if (state.expenses.length === 0) {
    showToast('No expenses to export', 'error');
    return;
  }

  const filtered = getFilteredExpenses();
  const headers = ['Date', 'Amount', 'Description', 'Category'];
  const rows = filtered.map(e => [
    e.date,
    e.amount,
    `"${e.description.replace(/"/g, '""')}"`,
    e.category
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  showToast(`Exported ${filtered.length} expenses`, 'success');
}

// ---------- Google Sheets ---------- //
async function appendExpenseToSheet(expense) {
  if (!state.apiConfig.googleSheetsId) return;

  try {
    const values = [[expense.date, expense.amount, expense.description, expense.category, expense.id]];
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${state.apiConfig.googleSheetsId}/values/Expenses!A:E:append?valueInputOption=USER_ENTERED`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values })
    });

    if (!response.ok) throw new Error('Sheets API error');
    showToast('Synced to Google Sheets', 'success');
  } catch (error) {
    console.error('Sheets sync error:', error);
    // Silently fail — don't bother user if sheets not configured properly
  }
}

// ---------- AI Category Suggestion ---------- //
const CATEGORY_RULES = {
  food: 'Food', grocery: 'Food', restaurant: 'Food', coffee: 'Food', lunch: 'Food',
  dinner: 'Food', breakfast: 'Food', snack: 'Food', pizza: 'Food', burger: 'Food',
  swiggy: 'Food', zomato: 'Food', eat: 'Food', cafe: 'Food', biryani: 'Food',
  uber: 'Transport', taxi: 'Transport', petrol: 'Transport', diesel: 'Transport',
  bus: 'Transport', train: 'Transport', metro: 'Transport', flight: 'Transport',
  ola: 'Transport', rapido: 'Transport', fuel: 'Transport', parking: 'Transport',
  rent: 'Housing', housing: 'Housing', apartment: 'Housing', maintenance: 'Housing',
  society: 'Housing', pg: 'Housing',
  movie: 'Entertainment', netflix: 'Entertainment', spotify: 'Entertainment',
  game: 'Entertainment', concert: 'Entertainment', party: 'Entertainment',
  doctor: 'Healthcare', hospital: 'Healthcare', medicine: 'Healthcare',
  pharmacy: 'Healthcare', gym: 'Healthcare', health: 'Healthcare', medical: 'Healthcare',
  laptop: 'Electronics', phone: 'Electronics', headphone: 'Electronics',
  charger: 'Electronics', gadget: 'Electronics', computer: 'Electronics',
  amazon: 'Electronics', flipkart: 'Electronics',
  shirt: 'Clothing', shoes: 'Clothing', jacket: 'Clothing', jeans: 'Clothing',
  clothes: 'Clothing', dress: 'Clothing', myntra: 'Clothing', ajio: 'Clothing',
  course: 'Education', book: 'Education', tuition: 'Education', class: 'Education',
  udemy: 'Education', school: 'Education', college: 'Education', exam: 'Education',
  electricity: 'Utilities', water: 'Utilities', internet: 'Utilities',
  wifi: 'Utilities', recharge: 'Utilities', bill: 'Utilities', gas: 'Utilities'
};

async function suggestCategory(description) {
  // Try Gemini AI first
  if (state.apiConfig.geminiApiKey) {
    try {
      showLoading();
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiConfig.geminiApiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Suggest exactly one expense category from this list: ${CATEGORY_NAMES.join(', ')}. For this expense description: "${description}". Reply with only the category name, nothing else.` }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        const found = CATEGORY_NAMES.find(c => c.toLowerCase() === text?.toLowerCase());
        hideLoading();
        if (found) return found;
      }
      hideLoading();
    } catch (err) {
      hideLoading();
      console.error('Gemini error:', err);
    }
  }

  // Fallback: rule-based
  const lower = description.toLowerCase();
  for (const [keyword, cat] of Object.entries(CATEGORY_RULES)) {
    if (lower.includes(keyword)) return cat;
  }
  return 'Other';
}

// ---------- AI Insights ---------- //
async function generateAIInsights() {
  if (!state.apiConfig.geminiApiKey) {
    showToast('Add a Gemini API key in Settings to use AI insights', 'info');
    return;
  }

  const currentMonth = getCurrentMonthKey();
  const monthExpenses = state.expenses.filter(e => getMonthKey(e.date) === currentMonth);

  if (monthExpenses.length < 2) {
    showToast('Need at least 2 expenses for AI analysis', 'info');
    return;
  }

  try {
    showLoading();
    const totalSpent = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
    const catSummary = {};
    monthExpenses.forEach(e => {
      catSummary[e.category] = (catSummary[e.category] || 0) + Number(e.amount);
    });

    const prompt = `Analyze my monthly expenses and give me a brief 2-sentence insight with an actionable tip. Budget: ₹${state.monthlyBudget}. Total spent: ₹${totalSpent}. Categories: ${JSON.stringify(catSummary)}. Number of transactions: ${monthExpenses.length}. Be concise, specific, and helpful.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiConfig.geminiApiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    hideLoading();

    if (insight) {
      dom.patternText.textContent = insight;
      showToast('AI insights updated', 'success');
    } else {
      showToast('Could not generate AI insight', 'error');
    }
  } catch (err) {
    hideLoading();
    console.error('AI insight error:', err);
    showToast('Failed to generate AI insights', 'error');
  }
}

// ---------- Quick Add ---------- //
function renderQuickAdd() {
  if (!dom.quickAddRow) return;
  dom.quickAddRow.innerHTML = QUICK_ADD_TEMPLATES.map((t, i) =>
    `<button class="quick-chip" data-qi="${i}" title="${t.label} · ${formatCurrency(t.amount)}">
      <span class="quick-chip__icon">${t.icon}</span>
      <span class="quick-chip__label">${t.label}</span>
    </button>`
  ).join('');

  dom.quickAddRow.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const t = QUICK_ADD_TEMPLATES[parseInt(chip.dataset.qi)];
      openExpenseModal();
      setTimeout(() => {
        dom.amountInput.value = t.amount;
        dom.descriptionInput.value = t.label;
        dom.categorySelect.value = t.category;
      }, 50);
    });
  });
}

// ---------- Heatmap Calendar ---------- //
function renderHeatmap() {
  if (!dom.heatmapGrid) return;

  const viewDate = state.heatmapMonth;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0
  const todayStr = new Date().toISOString().split('T')[0];

  dom.heatmapMonthLabel.textContent = firstDay.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Calculate daily totals
  const dailyTotals = {};
  state.expenses.forEach(e => {
    if (getMonthKey(e.date) === monthKey) {
      const day = parseInt(e.date.split('-')[2]);
      dailyTotals[day] = (dailyTotals[day] || 0) + Number(e.amount);
    }
  });

  const maxDaily = Math.max(...Object.values(dailyTotals), 1);

  // Build grid
  let html = '';
  // Empty cells for offset
  for (let i = 0; i < startWeekday; i++) {
    html += '<div class="heatmap-cell heatmap-cell--empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const total = dailyTotals[d] || 0;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;

    let level = 0;
    if (total > 0) {
      const ratio = total / maxDaily;
      level = ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
    }

    html += `<div class="heatmap-cell${isToday ? ' heatmap-cell--today' : ''}" 
      data-date="${dateStr}" data-total="${total}" data-day="${d}"
      style="background:var(--heatmap-${level})"
    ></div>`;
  }

  dom.heatmapGrid.innerHTML = html;

  // Tooltip behavior
  dom.heatmapGrid.querySelectorAll('.heatmap-cell:not(.heatmap-cell--empty)').forEach(cell => {
    cell.addEventListener('mouseenter', (e) => {
      const total = Number(cell.dataset.total);
      const day = cell.dataset.day;
      const expenses = state.expenses.filter(ex => ex.date === cell.dataset.date);
      let text = `${cell.dataset.date} — ${total > 0 ? formatCurrency(total) : 'No spending'}`;
      if (expenses.length > 0) text += ` (${expenses.length} tx)`;
      dom.heatmapTooltip.textContent = text;
      dom.heatmapTooltip.classList.remove('hidden');
      const rect = cell.getBoundingClientRect();
      dom.heatmapTooltip.style.left = `${rect.left + rect.width / 2}px`;
      dom.heatmapTooltip.style.top = `${rect.top - 36}px`;
      dom.heatmapTooltip.style.transform = 'translateX(-50%)';
    });
    cell.addEventListener('mouseleave', () => {
      dom.heatmapTooltip.classList.add('hidden');
    });
  });
}

function navigateHeatmap(direction) {
  const d = state.heatmapMonth;
  d.setMonth(d.getMonth() + direction);
  renderHeatmap();
}

// ---------- Month Comparison Chart ---------- //
function renderMonthChart() {
  if (!dom.monthChart) return;

  const monthTotals = {};
  state.expenses.forEach(e => {
    const mk = getMonthKey(e.date);
    monthTotals[mk] = (monthTotals[mk] || 0) + Number(e.amount);
  });

  const sortedMonths = Object.keys(monthTotals).sort().slice(-6);
  if (sortedMonths.length === 0) {
    dom.monthChart.innerHTML = '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);text-align:center;width:100%">Add expenses to see monthly trends</p>';
    return;
  }

  const currentMK = getCurrentMonthKey();
  const maxTotal = Math.max(...sortedMonths.map(m => monthTotals[m]));

  dom.monthChart.innerHTML = sortedMonths.map(mk => {
    const total = monthTotals[mk];
    const heightPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    const [y, m] = mk.split('-');
    const label = new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-IN', { month: 'short' });
    const isCurrent = mk === currentMK;

    return `<div class="month-bar">
      <span class="month-bar__amount">${formatCurrencyShort(total)}</span>
      <div class="month-bar__fill month-bar__fill--${isCurrent ? 'current' : 'past'}" 
        style="height:${Math.max(heightPct, 3)}%" title="${getMonthLabel(mk)}: ${formatCurrency(total)}"></div>
      <span class="month-bar__label">${label}</span>
    </div>`;
  }).join('');
}

// ---------- Streak Calculation ---------- //
function getMaxStreak(expenses) {
  if (expenses.length === 0) return 0;
  const dates = [...new Set(expenses.map(e => e.date))].sort();
  let maxStreak = 1, currentStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

function getCurrentStreak(expenses) {
  if (expenses.length === 0) return 0;
  const dates = [...new Set(expenses.map(e => e.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  // Check if most recent date is today or yesterday
  const latest = dates[0];
  const diffFromToday = (new Date(today + 'T00:00:00') - new Date(latest + 'T00:00:00')) / (1000 * 60 * 60 * 24);
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i - 1] + 'T00:00:00');
    const prev = new Date(dates[i] + 'T00:00:00');
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ---------- Achievements ---------- //
function renderAchievements() {
  if (!dom.achievementsGrid) return;

  const prevUnlocked = new Set(state.unlockedAchievements);
  const newlyUnlocked = [];
  let changed = false;

  // Check each achievement to see if it should be earned
  ACHIEVEMENT_DEFS.forEach(a => {
    const isEarned = a.check(state);
    const wasUnlocked = prevUnlocked.has(a.id);

    // New achievement earned
    if (!wasUnlocked && isEarned) {
      newlyUnlocked.push(a);
      state.unlockedAchievements.push(a.id);
      changed = true;
    }
    // Achievement lost (expenses deleted)
    else if (wasUnlocked && !isEarned) {
      state.unlockedAchievements = state.unlockedAchievements.filter(id => id !== a.id);
      changed = true;
    }
  });

  if (changed) {
    saveToStorage();
  }

  if (newlyUnlocked.length > 0) {
    newlyUnlocked.forEach(a => {
      showToast(`🏅 Achievement Unlocked: ${a.name}!`, 'success', 4000);
    });
    spawnConfetti();
  }

  const unlockedSet = new Set(state.unlockedAchievements);
  const unlocked = ACHIEVEMENT_DEFS.filter(a => unlockedSet.has(a.id));
  const locked = ACHIEVEMENT_DEFS.filter(a => !unlockedSet.has(a.id));

  dom.achievementCount.textContent = `${unlocked.length}/${ACHIEVEMENT_DEFS.length}`;

  const streak = getCurrentStreak(state.expenses);

  dom.achievementsGrid.innerHTML =
    (streak >= 2 ? `<div class="achievement achievement--unlocked">
      <span class="achievement__icon">🔥</span>
      <p class="achievement__name">${streak}-Day Streak!</p>
      <p class="achievement__desc">Keep it going!</p>
      <span class="achievement__badge">🔥</span>
    </div>` : '') +
    [...unlocked, ...locked].map(a => {
      const isUnlocked = unlockedSet.has(a.id);
      return `<div class="achievement achievement--${isUnlocked ? 'unlocked' : 'locked'}">
        <span class="achievement__icon">${a.icon}</span>
        <p class="achievement__name">${a.name}</p>
        <p class="achievement__desc">${a.desc}</p>
        ${isUnlocked ? '<span class="achievement__badge">✅</span>' : ''}
      </div>`;
    }).join('');
}

function spawnConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `-10px`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
    confetti.style.width = `${6 + Math.random() * 8}px`;
    confetti.style.height = `${6 + Math.random() * 8}px`;
    container.appendChild(confetti);
  }
  setTimeout(() => container.remove(), 5000);
}

// ---------- Recurring Expenses ---------- //
function renderRecurring() {
  if (!dom.recurringList) return;

  // Populate category dropdown
  if (dom.recurringCategory) {
    const current = dom.recurringCategory.value;
    dom.recurringCategory.innerHTML = '<option value="">Select...</option>' +
      CATEGORY_NAMES.map(c => `<option value="${c}" ${c === current ? 'selected' : ''}>${CATEGORIES[c].icon} ${c}</option>`).join('');
  }

  if (state.recurringExpenses.length === 0) {
    dom.recurringList.innerHTML = `<div class="empty-state" id="recurringEmpty">
      <p class="empty-state__text">No recurring expenses set up yet</p>
    </div>`;
    return;
  }

  dom.recurringList.innerHTML = state.recurringExpenses.map(r => {
    const cat = CATEGORIES[r.category] || CATEGORIES.Other;
    return `<div class="recurring-item" data-rid="${r.id}">
      <div class="recurring-item__icon" style="background:${cat.bg};color:${cat.color}">${cat.icon}</div>
      <div class="recurring-item__info">
        <div class="recurring-item__desc">${escapeHtml(r.description)}</div>
        <div class="recurring-item__meta">
          <span class="recurring-item__freq">${r.frequency}</span>
          <span>Day ${r.day || 1}</span>
        </div>
      </div>
      <span class="recurring-item__amount">${formatCurrency(r.amount)}</span>
      <button class="recurring-item__delete" onclick="deleteRecurring('${r.id}')" title="Remove">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>`;
  }).join('');
}

function openRecurringModal() {
  if (!dom.recurringModal) return;
  dom.recurringForm.reset();
  dom.editRecurringId.value = '';
  dom.recurringModalTitle.textContent = 'Add Recurring Expense';
  dom.submitRecurring.textContent = 'Add Recurring';
  // Re-populate category dropdown
  renderRecurring();
  dom.recurringModal.classList.remove('hidden');
  setTimeout(() => dom.recurringDesc.focus(), 100);
}

function closeRecurringModal() {
  if (!dom.recurringModal) return;
  dom.recurringModal.classList.add('hidden');
}

function handleRecurringSubmit(e) {
  e.preventDefault();
  const desc = dom.recurringDesc.value.trim();
  const amount = parseFloat(dom.recurringAmount.value);
  const category = dom.recurringCategory.value;
  const frequency = dom.recurringFreq.value;
  const day = parseInt(dom.recurringDay.value) || 1;

  if (!desc || !amount || !category) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  const editId = dom.editRecurringId.value;
  if (editId) {
    const idx = state.recurringExpenses.findIndex(r => r.id === editId);
    if (idx !== -1) {
      state.recurringExpenses[idx] = { ...state.recurringExpenses[idx], description: desc, amount, category, frequency, day };
    }
  } else {
    state.recurringExpenses.push({
      id: generateId(),
      description: desc,
      amount,
      category,
      frequency,
      day
    });
  }

  saveToStorage();
  closeRecurringModal();
  render();
  showToast(editId ? 'Recurring expense updated' : 'Recurring expense added', 'success');
}

window.deleteRecurring = function(id) {
  state.recurringExpenses = state.recurringExpenses.filter(r => r.id !== id);
  saveToStorage();
  render();
  showToast('Recurring expense removed', 'info');
};

// ---------- Forecast Card ---------- //
function renderForecastCard(monthTotal) {
  const el = dom.forecastContent;
  if (!el) return;

  const now = new Date();
  const daysElapsed = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = totalDays - daysElapsed;

  if (daysElapsed === 0 || monthTotal === 0) {
    el.innerHTML = '<p class="insight-card__body">Add expenses to see forecast...</p>';
    return;
  }

  const dailyRate = monthTotal / daysElapsed;
  const forecasted = Math.round(dailyRate * totalDays);
  const pctOfBudget = state.monthlyBudget ? (forecasted / state.monthlyBudget) * 100 : 0;
  const remaining = Math.max(0, state.monthlyBudget - monthTotal);
  const dailyAllowance = daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  let statusClass, statusLabel, statusIcon;
  if (pctOfBudget <= 90) { statusClass = 'good'; statusLabel = 'On track'; statusIcon = '✅'; }
  else if (pctOfBudget <= 110) { statusClass = 'warn'; statusLabel = 'Near limit'; statusIcon = '⚠️'; }
  else { statusClass = 'over'; statusLabel = 'Over budget'; statusIcon = '🔴'; }

  const barColor = statusClass === 'good' ? 'var(--green-500)' :
                   statusClass === 'warn' ? 'var(--amber-500)' : 'var(--red-500)';

  el.innerHTML = `
    <div class="forecast-number">${formatCurrencyShort(forecasted)}</div>
    <div class="forecast-progress">
      <div class="forecast-progress__fill" style="width:${Math.min(pctOfBudget, 100)}%;background:${barColor}"></div>
    </div>
    <span class="forecast-status forecast-status--${statusClass}">${statusIcon} ${statusLabel}</span>
    <p class="insight-card__body" style="margin-bottom:var(--sp-1)">Projected month-end · ${pctOfBudget.toFixed(0)}% of budget</p>
    ${daysLeft > 0 ? `<p class="insight-card__body" style="font-size:var(--text-xs)">Daily allowance left: <strong>${formatCurrencyShort(dailyAllowance)}</strong></p>` : ''}
    <div id="forecastAiText"></div>`;
}

// Enhance forecast with Gemini narrative (called separately to not block render)
async function fetchAIForecastNarrative() {
  if (!state.apiConfig.geminiApiKey) return;
  const el = document.getElementById('forecastAiText');
  if (!el) return;

  const now = new Date();
  const daysElapsed = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentMK = getCurrentMonthKey();
  const monthExpenses = state.expenses.filter(e => getMonthKey(e.date) === currentMK);
  const monthTotal = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  if (monthExpenses.length < 3 || daysElapsed < 3) return;

  const dailyRate = monthTotal / daysElapsed;
  const forecasted = Math.round(dailyRate * totalDays);

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiConfig.geminiApiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `In ONE sentence (max 20 words), give a sharp money tip based on this: ${daysElapsed} days into the month, spent ₹${monthTotal} out of ₹${state.monthlyBudget} budget. Projected month-end: ₹${forecasted}. Be direct and specific.` }] }]
      })
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (text && el) el.innerHTML = `<p class="forecast-ai">🤖 ${text}</p>`;
  } catch (_) { /* silent */ }
}

// ---------- Anomaly Detection ---------- //
function detectAnomalies() {
  const flagged = new Set();
  if (state.expenses.length < 4) return flagged;

  // Group amounts per category
  const catAmounts = {};
  state.expenses.forEach(e => {
    if (!catAmounts[e.category]) catAmounts[e.category] = [];
    catAmounts[e.category].push({ id: e.id, amount: Number(e.amount) });
  });

  for (const [, items] of Object.entries(catAmounts)) {
    if (items.length < 3) continue; // need at least 3 for a meaningful comparison
    const amounts = items.map(i => i.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / amounts.length);
    const threshold = mean + Math.max(stdDev * 2, mean * 1.5); // 2σ or 150% above mean
    items.forEach(i => { if (i.amount >= threshold) flagged.add(i.id); });
  }

  return flagged;
}

function renderAnomalyBanner() {
  if (!dom.anomalyBanner) return;
  const flagged = detectAnomalies();
  if (flagged.size === 0) {
    dom.anomalyBanner.classList.add('hidden');
    return;
  }

  dom.anomalyBanner.classList.remove('hidden');
  const examples = state.expenses
    .filter(e => flagged.has(e.id))
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 2)
    .map(e => `${CATEGORIES[e.category]?.icon || '📦'} ${escapeHtml(e.description)} (${formatCurrencyShort(e.amount)})`)
    .join(', ');

  dom.anomalyBannerText.innerHTML = `<strong>${flagged.size} unusual expense${flagged.size > 1 ? 's' : ''}</strong> detected — notably ${examples}`;
}

// ---------- Natural Language Expense Parsing ---------- //
const NL_DATE_PATTERNS = [
  { re: /\btoday\b/i,     offset: 0 },
  { re: /\byesterday\b/i, offset: -1 },
  { re: /\b2 days? ago\b/i, offset: -2 },
  { re: /\blast week\b/i, offset: -7 },
  { re: /\b(\d+) days? ago\b/i, fn: (m) => -parseInt(m[1]) },
  { re: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, fn: (m) => {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const target = days.indexOf(m[1].toLowerCase());
    const today = new Date().getDay();
    let diff = today - target;
    if (diff <= 0) diff += 7;
    return -diff;
  }}
];

function nlExtractDate(text) {
  const today = new Date();
  for (const { re, offset, fn } of NL_DATE_PATTERNS) {
    const m = text.match(re);
    if (m) {
      const d = new Date(today);
      d.setDate(d.getDate() + (fn ? fn(m) : offset));
      return d.toISOString().split('T')[0];
    }
  }
  // Try explicit date like "15 jan", "jan 15", "2026-02-15"
  const isoMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoMatch) return isoMatch[1];
  return today.toISOString().split('T')[0]; // default today
}

function nlExtractAmount(text) {
  // Match optional currency prefix, digits, optional decimal, optional k/L/lakh suffix
  const m = text.match(/(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|l\b|lakh|lakhs)?/i);
  if (!m) return null;
  let val = parseFloat(m[1].replace(/,/g, ''));
  const suffix = (m[2] || '').toLowerCase();
  if (suffix === 'k') val *= 1000;
  else if (suffix === 'l' || suffix === 'lakh' || suffix === 'lakhs') val *= 100000;
  return val;
}

function nlExtractDescription(text, amount, date) {
  let desc = text
    .replace(/(?:₹|rs\.?|inr)\s*/gi, '')
    .replace(/\d[\d,]*(?:\.\d+)?\s*(?:k\b|lakh|lakhs)?/gi, '')  // numbers + suffix
    .replace(/\btoday\b|\byesterday\b|\blast week\b|\b\d+ days? ago\b/gi, '')
    .replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
    .replace(/\b(paid|spent|bought|for|on|at|from|got|had|ordered)\b/gi, ' ')
    .replace(/[₹,]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return desc || 'Expense';
}

function nlParseLocal(text) {
  const amount = nlExtractAmount(text);
  const date = nlExtractDate(text);
  const description = nlExtractDescription(text, amount, date);
  const lower = text.toLowerCase();
  let category = 'Other';
  for (const [keyword, cat] of Object.entries(CATEGORY_RULES)) {
    if (lower.includes(keyword)) { category = cat; break; }
  }
  return { amount, date, description, category };
}

async function nlParseWithGemini(text) {
  const today = new Date().toISOString().split('T')[0];
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiConfig.geminiApiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Parse this expense note into JSON. Return ONLY valid JSON — no markdown or explanation. Keys: amount (number), description (string, concise), date (ISO YYYY-MM-DD, today is ${today}), category (one of: ${CATEGORY_NAMES.join(', ')}). Expense note: "${text}"` }] }]
    })
  });

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  // Strip possible markdown code fences
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.amount || !parsed.description) throw new Error('incomplete');
  // Normalize category
  parsed.category = CATEGORY_NAMES.find(c => c.toLowerCase() === parsed.category?.toLowerCase()) || 'Other';
  if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) parsed.date = today;
  return parsed;
}

async function handleSmartAdd() {
  const text = dom.smartAddInput.value.trim();
  if (!text) { showToast('Type an expense description first', 'info'); dom.smartAddInput.focus(); return; }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  setSmartBtnLoading(true);

  try {
    if (lines.length > 1) {
      const items = await parseBatchLines(lines);
      const valid = items.filter(i => i.amount && i.amount > 0);
      if (valid.length === 0) { showToast('No valid amounts found in any line', 'error'); return; }
      renderBatchConfirm(valid, text);
    } else {
      let parsed;
      try {
        parsed = state.apiConfig.geminiApiKey ? await nlParseWithGemini(text) : nlParseLocal(text);
      } catch (_) {
        parsed = nlParseLocal(text);
      }
      if (!parsed.amount || parsed.amount <= 0) {
        showToast('Could not detect an amount — try adding a number, e.g. "lunch 350"', 'error');
        return;
      }
      pushSmartHistory(text);
      dom.smartAddInput.value = '';
      dom.smartAddPreview.classList.add('hidden');
      openExpenseModal();
      setTimeout(() => {
        dom.amountInput.value = parsed.amount;
        dom.dateInput.value = parsed.date;
        dom.descriptionInput.value = parsed.description;
        renderFilters();
        dom.categorySelect.value = parsed.category;
        showToast(`Parsed: ${formatCurrency(parsed.amount)} · ${parsed.category}`, 'info');
      }, 80);
    }
  } finally {
    setSmartBtnLoading(false);
  }
}

async function handleSmartAddDirect() {
  const text = dom.smartAddInput.value.trim();
  if (!text) { showToast('Type an expense description first', 'info'); dom.smartAddInput.focus(); return; }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  setSmartBtnLoading(true, true);

  try {
    if (lines.length > 1) {
      const items = await parseBatchLines(lines);
      const valid = items.filter(i => i.amount && i.amount > 0);
      if (valid.length === 0) { showToast('No valid amounts found', 'error'); return; }
      valid.forEach(p => {
        const expense = { id: generateId(), date: p.date, amount: p.amount,
          description: p.description.trim(), category: p.category };
        state.expenses.push(expense);
        appendExpenseToSheet(expense);
      });
      saveToStorage(); render();
      pushSmartHistory(text);
      dom.smartAddInput.value = '';
      dom.smartAddPreview.classList.add('hidden');
      dom.smartAddInput.focus();
      showToast(`⚡ Added ${valid.length} expense${valid.length > 1 ? 's' : ''} directly`, 'success');
      if (valid.length >= 3) spawnConfetti();
    } else {
      let parsed;
      try {
        parsed = state.apiConfig.geminiApiKey ? await nlParseWithGemini(text) : nlParseLocal(text);
      } catch (_) { parsed = nlParseLocal(text); }
      if (!parsed.amount || parsed.amount <= 0) {
        showToast('Could not detect an amount', 'error'); return;
      }
      addExpense(parsed);
      pushSmartHistory(text);
      dom.smartAddInput.value = '';
      dom.smartAddPreview.classList.add('hidden');
      dom.smartAddInput.focus();
    }
  } finally {
    setSmartBtnLoading(false, true);
  }
}

async function parseBatchLines(lines) {
  if (state.apiConfig.geminiApiKey) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiConfig.geminiApiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text:
          `Parse these expense notes into a JSON array. Return ONLY a valid JSON array, no markdown. Each item: {amount (number), description (string, concise), date (ISO YYYY-MM-DD, today=${today}), category (one of: ${CATEGORY_NAMES.join(', ')})}.\nNotes:\n${lines.map((l, i) => `${i + 1}. ${l}`).join('\n')}`
        }] }] })
      });
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const arr = JSON.parse(cleaned);
      const today2 = new Date().toISOString().split('T')[0];
      return arr.map(p => ({
        amount: Number(p.amount),
        description: p.description || 'Expense',
        date: /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : today2,
        category: CATEGORY_NAMES.find(c => c.toLowerCase() === p.category?.toLowerCase()) || 'Other'
      }));
    } catch (_) { /* fall through to local */ }
  }
  return lines.map(l => nlParseLocal(l));
}

function renderBatchConfirm(items, originalText) {
  const el = dom.smartAddPreview;
  if (!el) return;
  const total = items.reduce((s, i) => s + i.amount, 0);
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="smart-preview-label">
      <span class="smart-preview-badge smart-preview-badge--batch">📦 ${items.length} expenses detected · ${formatCurrency(total)}</span>
      <span style="color:var(--color-text-tertiary);font-size:var(--text-xs)">Review and confirm</span>
    </div>
    <div class="smart-preview-batch-list">
      ${items.map((p, idx) => {
        const cat = CATEGORIES[p.category] || CATEGORIES.Other;
        return `<div class="smart-preview-batch-item">
          <span style="font-size:1rem;width:22px;text-align:center;color:${cat.color};flex-shrink:0">${cat.icon}</span>
          <span>${escapeHtml(p.description)}</span>
          <span class="smart-preview-amount">${formatCurrency(p.amount)}</span>
          <span class="smart-preview-date">${formatDate(p.date)}</span>
          <span class="smart-preview-category" style="color:${cat.color}">${p.category}</span>
          <button class="btn btn--ghost btn--xs" style="margin-left:auto" onclick="removeBatchItem(${idx})">✕</button>
        </div>`;
      }).join('')}
    </div>
    <div class="smart-preview-batch-actions">
      <button class="btn btn--primary btn--sm" id="batchAddAllBtn">⚡ Add All ${items.length}</button>
      <button class="btn btn--secondary btn--sm" id="batchCancelBtn">Cancel</button>
    </div>`;

  // Store items for add-all handler
  window._pendingBatchItems = items;
  window._pendingBatchText = originalText;

  el.querySelector('#batchAddAllBtn').addEventListener('click', () => {
    const toAdd = window._pendingBatchItems || [];
    toAdd.forEach(p => {
      const expense = { id: generateId(), date: p.date, amount: p.amount,
        description: p.description.trim(), category: p.category };
      state.expenses.push(expense);
      appendExpenseToSheet(expense);
    });
    saveToStorage(); render();
    pushSmartHistory(window._pendingBatchText || '');
    dom.smartAddInput.value = '';
    el.classList.add('hidden');
    dom.smartAddInput.focus();
    showToast(`Added ${toAdd.length} expenses`, 'success');
    if (toAdd.length >= 3) spawnConfetti();
    window._pendingBatchItems = null;
  });

  el.querySelector('#batchCancelBtn').addEventListener('click', () => {
    el.classList.add('hidden');
    window._pendingBatchItems = null;
  });
}

// Remove one item from pending batch
window.removeBatchItem = function(idx) {
  if (!window._pendingBatchItems) return;
  window._pendingBatchItems.splice(idx, 1);
  if (window._pendingBatchItems.length === 0) {
    dom.smartAddPreview.classList.add('hidden');
    window._pendingBatchItems = null;
  } else {
    renderBatchConfirm(window._pendingBatchItems, window._pendingBatchText || '');
  }
};

function setSmartBtnLoading(loading, isDirect = false) {
  if (loading) {
    dom.smartAddBtn.disabled = true;
    dom.smartAddDirectBtn.disabled = true;
    dom.smartAddInput?.classList.add('smart-add-textarea--parsing');
    (isDirect ? dom.smartAddDirectBtn : dom.smartAddBtn).textContent = '⏳';
  } else {
    dom.smartAddBtn.disabled = false;
    dom.smartAddDirectBtn.disabled = false;
    dom.smartAddInput?.classList.remove('smart-add-textarea--parsing');
    dom.smartAddBtn.textContent = '✨ Parse & Fill';
    dom.smartAddDirectBtn.textContent = '⚡ Add Now';
  }
}

// ---------- Smart Add History ---------- //
const SMART_ADD_HIST_KEY = 'et_smart_hist';

function getSmartHistory() {
  try { return JSON.parse(sessionStorage.getItem(SMART_ADD_HIST_KEY) || '[]'); } catch { return []; }
}

function pushSmartHistory(text) {
  if (!text.trim()) return;
  const hist = getSmartHistory().filter(h => h !== text);
  hist.unshift(text);
  sessionStorage.setItem(SMART_ADD_HIST_KEY, JSON.stringify(hist.slice(0, 5)));
  renderSmartAddHistory();
}

function renderSmartAddHistory() {
  const el = dom.smartAddHistory;
  if (!el) return;
  const hist = getSmartHistory();
  if (hist.length === 0) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.innerHTML = '<span class="smart-hist__label">Recent:</span>' +
    hist.map((h, i) =>
      `<button class="smart-hist__chip" data-hi="${i}" title="${escapeHtml(h)}">${escapeHtml(h)}</button>`
    ).join('');
  el.querySelectorAll('.smart-hist__chip').forEach(chip => {
    chip.addEventListener('click', () => {
      dom.smartAddInput.value = chip.title;
      dom.smartAddInput.focus();
      updateSmartAddPreview();
    });
  });
}

// ---------- Smart Add Live Preview ---------- //
function updateSmartAddPreview() {
  const el = dom.smartAddPreview;
  if (!el) return;
  const raw = dom.smartAddInput.value;
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length === 0) { el.classList.add('hidden'); return; }

  // Don't overwrite a batch confirm already shown
  if (window._pendingBatchItems) return;

  if (lines.length > 1) {
    // Batch preview (local only — no API for live preview)
    const items = lines.map(l => nlParseLocal(l));
    const valid = items.filter(i => i.amount && i.amount > 0);
    if (valid.length === 0) { el.classList.add('hidden'); return; }
    const total = valid.reduce((s, i) => s + i.amount, 0);
    el.classList.remove('hidden');
    el.innerHTML = `
      <div class="smart-preview-label">
        <span class="smart-preview-badge smart-preview-badge--batch">📦 ${valid.length} expenses · ${formatCurrency(total)}</span>
        <span style="color:var(--color-text-tertiary);font-size:var(--text-xs)">local preview — hit Parse &amp; Fill to confirm</span>
      </div>
      <div class="smart-preview-batch-list">
        ${valid.map(p => {
          const cat = CATEGORIES[p.category] || CATEGORIES.Other;
          return `<div class="smart-preview-batch-item">
            <span style="font-size:1rem;width:22px;text-align:center;color:${cat.color};flex-shrink:0">${cat.icon}</span>
            <span>${escapeHtml(p.description)}</span>
            <span class="smart-preview-amount">${formatCurrency(p.amount)}</span>
            <span class="smart-preview-date">${formatDate(p.date)}</span>
            <span class="smart-preview-category" style="color:${cat.color}">${p.category}</span>
          </div>`;
        }).join('')}
      </div>`;
  } else {
    // Single item preview (local parser only for zero-latency)
    const parsed = nlParseLocal(lines[0]);
    if (!parsed.amount || parsed.amount <= 0) { el.classList.add('hidden'); return; }
    const cat = CATEGORIES[parsed.category] || CATEGORIES.Other;
    el.classList.remove('hidden');
    el.innerHTML = `
      <div class="smart-preview-pill">
        <span class="smart-preview-icon" style="background:${cat.bg};color:${cat.color}">${cat.icon}</span>
        <span class="smart-preview-desc">${escapeHtml(parsed.description)}</span>
        <span class="smart-preview-amount">${formatCurrency(parsed.amount)}</span>
        <span class="smart-preview-category" style="color:${cat.color}">${parsed.category}</span>
        <span class="smart-preview-date">${formatDate(parsed.date)}</span>
      </div>`;
  }
}

// ---------- Dark Mode ---------- //
function applyTheme() {
  if (state.theme === 'dark' || state.theme === 'light') {
    document.documentElement.dataset.theme = state.theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
  updateThemeToggleIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  state.theme = isDark ? 'light' : 'dark';
  applyTheme();
  saveToStorage();
}

function updateThemeToggleIcon() {
  const isDark = document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = isDark
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

// ---------- Import CSV ---------- //
function importCSV() {
  const file = dom.importFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        showToast('CSV has no data rows', 'error');
        dom.importFile.value = '';
        return;
      }

      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ''));
      const dateIdx = headers.findIndex(h => h === 'date');
      const amountIdx = headers.findIndex(h => h === 'amount');
      const descIdx = headers.findIndex(h => h === 'description' || h === 'desc');
      const catIdx = headers.findIndex(h => h === 'category' || h === 'cat');

      if (dateIdx === -1 || amountIdx === -1 || descIdx === -1 || catIdx === -1) {
        showToast('CSV must have columns: Date, Amount, Description, Category', 'error');
        dom.importFile.value = '';
        return;
      }

      let imported = 0, skipped = 0;
      const newExpenses = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        const date = (cols[dateIdx] || '').trim();
        const amount = parseFloat(cols[amountIdx]);
        const description = (cols[descIdx] || '').trim();
        const category = (cols[catIdx] || '').trim();

        if (!date || !description || isNaN(amount) || amount <= 0) { skipped++; continue; }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { skipped++; continue; }

        const normalizedCat = CATEGORY_NAMES.find(c => c.toLowerCase() === category.toLowerCase()) || 'Other';
        newExpenses.push({ id: generateId(), date, amount, description, category: normalizedCat });
        imported++;
      }

      dom.importFile.value = '';

      if (newExpenses.length > 0) {
        state.expenses.push(...newExpenses);
        saveToStorage();
        render();
        showToast(
          `Imported ${imported} expense${imported !== 1 ? 's' : ''}` +
          (skipped > 0 ? ` · ${skipped} skipped` : ''),
          'success'
        );
      } else {
        showToast(`No valid rows found${skipped > 0 ? ` (${skipped} skipped)` : ''}`, 'error');
      }
    } catch (err) {
      console.error('CSV import error:', err);
      dom.importFile.value = '';
      showToast('Failed to parse CSV file', 'error');
    }
  };
  reader.readAsText(file);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ---------- Duplicate Expense ---------- //
window.duplicateExpense = function(id) {
  const expense = state.expenses.find(e => e.id === id);
  if (!expense) return;
  const duplicate = {
    ...expense,
    id: generateId(),
    date: new Date().toISOString().split('T')[0]
  };
  state.expenses.push(duplicate);
  saveToStorage();
  render();
  showToast(`Duplicated "${expense.description}"`, 'success');
};

// ---------- Lifetime Stats ---------- //
function renderLifetimeStats() {
  const el = dom.lifetimeGrid;
  if (!el) return;

  const all = state.expenses;
  if (all.length === 0) {
    el.innerHTML = `<p style="color:var(--color-text-secondary);font-size:var(--text-sm);grid-column:1/-1;text-align:center;padding:var(--sp-4)">Add expenses to see lifetime statistics</p>`;
    return;
  }

  const totalEver = all.reduce((s, e) => s + Number(e.amount), 0);
  const highestExpense = Math.max(...all.map(e => Number(e.amount)));

  const monthlyTotals = {};
  all.forEach(e => {
    const mk = getMonthKey(e.date);
    monthlyTotals[mk] = (monthlyTotals[mk] || 0) + Number(e.amount);
  });
  const monthKeys = Object.keys(monthlyTotals);
  const avgMonthly = monthKeys.length > 0 ? totalEver / monthKeys.length : 0;

  const catTotals = {};
  all.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount); });
  const topCat = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b);
  const bestStreak = getMaxStreak(all);

  const stats = [
    { icon: '💸', value: formatCurrencyShort(totalEver), label: 'Total Spent' },
    { icon: '🧾', value: all.length.toLocaleString(), label: 'Transactions' },
    { icon: '📅', value: monthKeys.length, label: 'Months Tracked' },
    { icon: '📈', value: formatCurrencyShort(Math.round(avgMonthly)), label: 'Avg / Month' },
    { icon: '💎', value: formatCurrencyShort(highestExpense), label: 'Largest Expense' },
    { icon: CATEGORIES[topCat]?.icon || '📦', value: topCat, label: 'Top Category' },
    { icon: '🔥', value: `${bestStreak} day${bestStreak !== 1 ? 's' : ''}`, label: 'Best Streak' },
    { icon: '🗂️', value: new Set(all.map(e => e.category)).size, label: 'Categories Used' },
  ];

  el.innerHTML = stats.map(s => `
    <div class="card lifetime-stat">
      <div class="lifetime-stat__icon">${s.icon}</div>
      <div class="lifetime-stat__value">${s.value}</div>
      <div class="lifetime-stat__label">${s.label}</div>
    </div>`).join('');
}

// ---------- Event Handlers ---------- //
function handleFormSubmit(e) {
  e.preventDefault();

  const amount = dom.amountInput.value;
  const date = dom.dateInput.value;
  const description = dom.descriptionInput.value.trim();
  const category = dom.categorySelect.value;

  if (!amount || !date || !description || !category) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (parseFloat(amount) <= 0) {
    showToast('Amount must be greater than 0', 'error');
    return;
  }

  const editId = dom.editExpenseId.value;
  if (editId) {
    updateExpense(editId, { amount, date, description, category });
  } else {
    addExpense({ amount, date, description, category });
  }

  closeExpenseModal();
}

async function handleSuggestCategory() {
  const description = dom.descriptionInput.value.trim();
  if (!description) {
    showToast('Enter a description first', 'info');
    dom.descriptionInput.focus();
    return;
  }

  const suggestion = await suggestCategory(description);
  dom.categorySelect.value = suggestion;
  showToast(`Suggested: ${CATEGORIES[suggestion]?.icon || ''} ${suggestion}`, 'info');
}

function handleSearch() {
  state.filters.search = dom.searchInput.value.trim();
  renderExpenseList();
}

function handleCategoryFilter() {
  state.filters.category = dom.categoryFilter.value;
  renderExpenseList();
}

function handleMonthFilter() {
  state.filters.month = dom.monthFilter.value;
  renderExpenseList();
}

function handleSortChange() {
  state.filters.sort = dom.sortSelect.value;
  renderExpenseList();
}

function handleClearFilters() {
  state.filters = { search: '', category: '', month: '', sort: 'date-desc' };
  dom.searchInput.value = '';
  dom.categoryFilter.value = '';
  dom.monthFilter.value = '';
  dom.sortSelect.value = 'date-desc';
  renderExpenseList();
}

function handleConfirmDelete() {
  if (state.deleteTargetId) {
    deleteExpense(state.deleteTargetId);
    closeDeleteModal();
  }
}

// Keyboard shortcuts
function handleKeydown(e) {
  // Escape closes modals
  if (e.key === 'Escape') {
    if (!dom.deleteModal.classList.contains('hidden')) {
      closeDeleteModal();
    } else if (dom.recurringModal && !dom.recurringModal.classList.contains('hidden')) {
      closeRecurringModal();
    } else if (!dom.expenseModal.classList.contains('hidden')) {
      closeExpenseModal();
    } else if (!dom.settingsModal.classList.contains('hidden')) {
      closeSettings();
    }
  }

  // Ctrl/Cmd + N = new expense
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openExpenseModal();
  }

  // Ctrl/Cmd + E = export
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    exportCSV();
  }

  // / = focus search
  if (e.key === '/' && !isInputFocused()) {
    e.preventDefault();
    dom.searchInput.focus();
  }
}

function isInputFocused() {
  const tag = document.activeElement?.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}

// ---------- Event Binding ---------- //
function bindEvents() {
  // Add expense
  $('#addExpenseBtn').addEventListener('click', () => openExpenseModal());
  $('#emptyAddBtn')?.addEventListener('click', () => openExpenseModal());
  dom.addExpenseForm.addEventListener('submit', handleFormSubmit);
  $('#suggestCategory').addEventListener('click', handleSuggestCategory);
  $('#cancelExpense').addEventListener('click', closeExpenseModal);
  $('#closeExpenseModal').addEventListener('click', closeExpenseModal);
  $('#expenseModalBackdrop').addEventListener('click', closeExpenseModal);

  // Filters
  dom.searchInput.addEventListener('input', debounce(handleSearch, 200));
  dom.categoryFilter.addEventListener('change', handleCategoryFilter);
  dom.monthFilter.addEventListener('change', handleMonthFilter);
  dom.sortSelect.addEventListener('change', handleSortChange);
  $('#clearFilters')?.addEventListener('click', handleClearFilters);

  // Settings
  $('#settingsBtn').addEventListener('click', openSettings);
  $('#closeModal').addEventListener('click', closeSettings);
  $('#cancelSettings').addEventListener('click', closeSettings);
  $('#settingsBackdrop').addEventListener('click', closeSettings);
  $('#saveSettings').addEventListener('click', saveSettings);
  $('#clearAllData').addEventListener('click', clearAllData);

  // Delete modal
  $('#confirmDelete').addEventListener('click', handleConfirmDelete);
  $('#cancelDelete').addEventListener('click', closeDeleteModal);
  $('#closeDeleteModal').addEventListener('click', closeDeleteModal);
  $('#deleteBackdrop').addEventListener('click', closeDeleteModal);

  // Export
  $('#exportBtn').addEventListener('click', exportCSV);

  // Import
  dom.importBtn?.addEventListener('click', () => dom.importFile.click());
  dom.importFile?.addEventListener('change', importCSV);

  // Theme toggle
  $('#themeToggle')?.addEventListener('click', toggleTheme);

  // Smart Add
  dom.smartAddBtn?.addEventListener('click', handleSmartAdd);
  dom.smartAddDirectBtn?.addEventListener('click', handleSmartAddDirect);
  dom.smartAddInput?.addEventListener('input', debounce(updateSmartAddPreview, 220));
  dom.smartAddInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSmartAddDirect();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // Only trigger if not in multi-line (no existing newline content)
      const lines = dom.smartAddInput.value.split('\n').filter(l => l.trim());
      if (lines.length <= 1) { e.preventDefault(); handleSmartAdd(); }
    }
  });

  // Anomaly banner
  $('#anomalyDetailsBtn')?.addEventListener('click', () => {
    state.filters.search = ''; state.filters.category = ''; state.filters.month = '';
    document.getElementById('expenseSection')?.scrollIntoView({ behavior: 'smooth' });
    showToast('⚠️ Unusual expenses are marked in the list below', 'info', 4000);
  });

  // AI Insights
  $('#generateInsights').addEventListener('click', generateAIInsights);

  // Heatmap navigation
  $('#heatmapPrev')?.addEventListener('click', () => navigateHeatmap(-1));
  $('#heatmapNext')?.addEventListener('click', () => navigateHeatmap(1));

  // Recurring
  $('#addRecurringBtn')?.addEventListener('click', openRecurringModal);
  $('#cancelRecurring')?.addEventListener('click', closeRecurringModal);
  $('#closeRecurringModal')?.addEventListener('click', closeRecurringModal);
  $('#recurringBackdrop')?.addEventListener('click', closeRecurringModal);
  dom.recurringForm?.addEventListener('submit', handleRecurringSubmit);

  // Keyboard
  document.addEventListener('keydown', handleKeydown);
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ---------- Service Worker Registration ---------- //
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[App] Service Worker registered, scope:', reg.scope);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                showToast('App updated! Refresh for latest version.', 'info', 5000);
              }
            });
          });
        })
        .catch((err) => {
          console.warn('[App] SW registration failed:', err);
        });
    });
  }
}

// ---------- PWA Install Prompt ---------- //
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  // Show a subtle install hint after a delay
  setTimeout(() => {
    if (deferredInstallPrompt) {
      showToast('📲 Install ExpenseTracker as an app!', 'info', 6000, {
        label: 'Install',
        callback: promptInstall
      });
    }
  }, 10000);
});

function promptInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      showToast('App installed! 🎉', 'success');
    }
    deferredInstallPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  console.log('[App] PWA installed');
});

// ---------- Initialize ---------- //
function init() {
  cacheDom();
  loadFromStorage();
  applyTheme();
  bindEvents();
  render();
  renderSmartAddHistory();
  showFirstVisitWarning();
  registerServiceWorker();
  // Async AI enhancements (non-blocking)
  setTimeout(() => fetchAIForecastNarrative(), 500);
}

document.addEventListener('DOMContentLoaded', init);
