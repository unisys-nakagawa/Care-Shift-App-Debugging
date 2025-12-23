/**
 * カレンダービュー
 * カレンダーの表示を担当
 */
export class CalendarView {
    constructor(gridElementId, year, month) {
        this.gridElement = document.getElementById(gridElementId);
        this.weekdaysElement = document.getElementById('calendarWeekdays');
        this.headerElement = document.getElementById('calendarHeader');
        this.year = year;
        this.month = month;
        this.onDateClick = null; // コールバック関数
        this.viewMode = 'month'; // 'month' or 'week'
        this.currentWeekStart = null; // 週表示の開始日
    }

    /**
     * 表示モードを設定
     * @param {string} mode - 'month' or 'week'
     */
    setViewMode(mode) {
        this.viewMode = mode;
        
        if (mode === 'week') {
            this.gridElement.classList.add('week-view');
            this.weekdaysElement.style.display = 'none';
            // 現在表示している月の1日を含む週を表示
            const firstDayOfMonth = new Date(this.year, this.month, 1);
            this.currentWeekStart = this.getWeekStart(firstDayOfMonth);
        } else {
            this.gridElement.classList.remove('week-view');
            this.weekdaysElement.style.display = 'grid';
            this.currentWeekStart = null;
        }
    }

    /**
     * 週の開始日（日曜日）を取得
     * @param {Date} date
     * @returns {Date}
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    /**
     * 週を移動
     * @param {number} weeks - 移動する週数（正の数で未来、負の数で過去）
     */
    moveWeek(weeks) {
        if (!this.currentWeekStart) return;
        
        const newDate = new Date(this.currentWeekStart);
        newDate.setDate(newDate.getDate() + (weeks * 7));
        this.currentWeekStart = newDate;
    }

    /**
     * 週ラベルを取得
     * @returns {string}
     */
    getWeekLabel() {
        if (!this.currentWeekStart) return '';
        
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        return `${this.currentWeekStart.getMonth() + 1}/${this.currentWeekStart.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    }

    /**
     * カレンダーをレンダリング
     * @param {Shift[]} shifts - 表示するシフトの配列
     * @param {StaffManager} staffManager - スタッフ管理
     * @param {string} viewMode - 'staff' or 'coordinator'
     * @param {number} currentStaffId - スタッフ視点の場合のスタッフID
     */
    render(shifts, staffManager, viewMode = 'staff', currentStaffId = 1) {
        if (this.viewMode === 'week') {
            this.renderWeekView(shifts, staffManager, viewMode, currentStaffId);
        } else {
            this.renderMonthView(shifts, staffManager, viewMode, currentStaffId);
        }
    }

    /**
     * 月表示をレンダリング
     */
    renderMonthView(shifts, staffManager, viewMode, currentStaffId) {
        this.gridElement.innerHTML = '';

        // ヘッダー更新
        this.headerElement.textContent = `${this.year}年${this.month + 1}月`;

        const firstDay = new Date(this.year, this.month, 1);
        const lastDay = new Date(this.year, this.month + 1, 0);
        const today = new Date();

        // 空白日を追加
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = this.createEmptyDay();
            this.gridElement.appendChild(emptyDay);
        }

        // 実際の日付を追加
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(this.year, this.month, i);
            const dateStr = this.formatDate(date);
            const dayShifts = shifts.filter(s => s.date === dateStr);
            const dayOfWeek = date.getDay();
            const isToday = date.toDateString() === today.toDateString();

            const dayElement = this.createMonthDayElement(
                date, 
                dayShifts, 
                staffManager, 
                viewMode, 
                currentStaffId, 
                isToday, 
                dayOfWeek
            );

            this.gridElement.appendChild(dayElement);
        }
    }

    /**
     * 週表示をレンダリング
     */
    renderWeekView(shifts, staffManager, viewMode, currentStaffId) {
        this.gridElement.innerHTML = '';

        if (!this.currentWeekStart) {
            this.currentWeekStart = this.getWeekStart(new Date());
        }

        // ヘッダー更新
        this.headerElement.textContent = `${this.currentWeekStart.getFullYear()}年${this.currentWeekStart.getMonth() + 1}月`;

        const today = new Date();
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

        // 1週間分の日付を表示
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            
            const dateStr = this.formatDate(date);
            const dayShifts = shifts.filter(s => s.date === dateStr);
            const dayOfWeek = date.getDay();
            const isToday = date.toDateString() === today.toDateString();

            const dayElement = this.createWeekDayElement(
                date,
                dayNames[dayOfWeek],
                dayShifts,
                staffManager,
                viewMode,
                currentStaffId,
                isToday,
                dayOfWeek
            );

            this.gridElement.appendChild(dayElement);
        }
    }

    /**
     * 週表示の日付要素を作成
     */
    createWeekDayElement(date, dayName, dayShifts, staffManager, viewMode, currentStaffId, isToday, dayOfWeek) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        if (isToday) {
            dayDiv.classList.add('today');
        }

        // 日付情報エリア
        const dayInfo = document.createElement('div');
        dayInfo.className = 'day-info';

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        if (dayOfWeek === 0) dayNumber.classList.add('sunday');
        if (dayOfWeek === 6) dayNumber.classList.add('saturday');
        dayNumber.textContent = date.getDate();

        const dayNameDiv = document.createElement('div');
        dayNameDiv.className = 'day-name';
        dayNameDiv.textContent = dayName;

        dayInfo.appendChild(dayNumber);
        dayInfo.appendChild(dayNameDiv);
        dayDiv.appendChild(dayInfo);

        // シフトコンテナ
        const shiftsContainer = document.createElement('div');
        shiftsContainer.className = 'shifts-container';

        dayShifts.forEach(shift => {
            // スタッフ視点では自分のシフトと募集中のみ表示
            if (viewMode === 'staff' && shift.staffId !== currentStaffId && !shift.isRecruiting()) {
                return;
            }

            const shiftElement = this.createShiftElement(shift, staffManager, viewMode, currentStaffId);
            shiftsContainer.appendChild(shiftElement);
        });

        dayDiv.appendChild(shiftsContainer);

        // クリックイベント
        dayDiv.addEventListener('click', () => {
            if (this.onDateClick) {
                this.onDateClick(this.formatDate(date));
            }
        });

        return dayDiv;
    }

    /**
     * 空白日要素を作成
     * @returns {HTMLElement}
     */
    createEmptyDay() {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        return emptyDay;
    }

    /**
     * 月表示の日付要素を作成
     * @param {Date} date
     * @param {Shift[]} dayShifts
     * @param {StaffManager} staffManager
     * @param {string} viewMode
     * @param {number} currentStaffId
     * @param {boolean} isToday
     * @param {number} dayOfWeek
     * @returns {HTMLElement}
     */
    createMonthDayElement(date, dayShifts, staffManager, viewMode, currentStaffId, isToday, dayOfWeek) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        if (isToday) {
            dayDiv.classList.add('today');
        }

        // 日付番号
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        if (dayOfWeek === 0) dayNumber.classList.add('sunday');
        if (dayOfWeek === 6) dayNumber.classList.add('saturday');
        dayNumber.textContent = date.getDate();
        dayDiv.appendChild(dayNumber);

        // シフト表示
        dayShifts.forEach(shift => {
            // スタッフ視点では自分のシフトと募集中のみ表示
            if (viewMode === 'staff' && shift.staffId !== currentStaffId && !shift.isRecruiting()) {
                return;
            }

            const shiftElement = this.createShiftElement(shift, staffManager, viewMode, currentStaffId);
            dayDiv.appendChild(shiftElement);
        });

        // クリックイベント
        dayDiv.addEventListener('click', () => {
            if (this.onDateClick) {
                this.onDateClick(this.formatDate(date));
            }
        });

        return dayDiv;
    }

    /**
     * シフト要素を作成
     * @param {Shift} shift
     * @param {StaffManager} staffManager
     * @param {string} viewMode
     * @param {number} currentStaffId
     * @returns {HTMLElement}
     */
    createShiftElement(shift, staffManager, viewMode, currentStaffId) {
        const shiftDiv = document.createElement('div');
        shiftDiv.className = `shift-item shift-${shift.status}`;

        // 時間
        const timeDiv = document.createElement('div');
        timeDiv.className = 'shift-time';
        timeDiv.textContent = shift.time;
        shiftDiv.appendChild(timeDiv);

        // 調整者視点
        if (viewMode === 'coordinator') {
            const staff = shift.hasStaff() ? staffManager.getStaffById(shift.staffId) : null;
            
            const detailDiv = document.createElement('div');
            detailDiv.className = 'shift-detail';
            detailDiv.textContent = staff ? staff.name : '未割当';
            shiftDiv.appendChild(detailDiv);

            if (shift.facility) {
                const facilityDiv = document.createElement('div');
                facilityDiv.className = 'shift-detail';
                facilityDiv.textContent = shift.facility;
                shiftDiv.appendChild(facilityDiv);
            }
        } 
        // スタッフ視点
        else if (viewMode === 'staff' && shift.staffId === currentStaffId) {
            const detailDiv = document.createElement('div');
            detailDiv.className = 'shift-detail';
            detailDiv.textContent = shift.facility || '勤務可能';
            shiftDiv.appendChild(detailDiv);
        }

        return shiftDiv;
    }

    /**
     * 日付をYYYY-MM-DD形式にフォーマット
     * @param {Date} date
     * @returns {string}
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 日付クリック時のコールバックを設定
     * @param {Function} callback
     */
    setOnDateClick(callback) {
        this.onDateClick = callback;
    }
}