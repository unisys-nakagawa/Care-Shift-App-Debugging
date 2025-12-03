/**
 * カレンダービュー
 * カレンダーの表示を担当
 */
export class CalendarView {
    constructor(gridElementId, year, month) {
        this.gridElement = document.getElementById(gridElementId);
        this.year = year;
        this.month = month;
        this.onDateClick = null; // コールバック関数
    }

    /**
     * カレンダーをレンダリング
     * @param {Shift[]} shifts - 表示するシフトの配列
     * @param {StaffManager} staffManager - スタッフ管理
     * @param {string} viewMode - 'staff' or 'coordinator'
     * @param {number} currentStaffId - スタッフ視点の場合のスタッフID
     */
    render(shifts, staffManager, viewMode = 'staff', currentStaffId = 1) {
        this.gridElement.innerHTML = '';

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

            const dayElement = this.createDayElement(
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
     * 空白日要素を作成
     * @returns {HTMLElement}
     */
    createEmptyDay() {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        return emptyDay;
    }

    /**
     * 日付要素を作成
     * @param {Date} date
     * @param {Shift[]} dayShifts
     * @param {StaffManager} staffManager
     * @param {string} viewMode
     * @param {number} currentStaffId
     * @param {boolean} isToday
     * @param {number} dayOfWeek
     * @returns {HTMLElement}
     */
    createDayElement(date, dayShifts, staffManager, viewMode, currentStaffId, isToday, dayOfWeek) {
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