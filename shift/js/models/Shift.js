/**
 * シフトモデル
 * 1つのシフト枠を表現
 */
export class Shift {
    constructor(date, time, status, options = {}) {
        this.date = date; // YYYY-MM-DD形式
        this.time = time; // "08:00-16:00"形式
        this.status = status; // confirmed, pending, recruiting, available
        this.staffId = options.staffId || null;
        this.facility = options.facility || null;
        this.requirements = options.requirements || []; // 募集条件（資格、性別等）
    }

    /**
     * シフトが確定しているか
     * @returns {boolean}
     */
    isConfirmed() {
        return this.status === 'confirmed';
    }

    /**
     * シフトが募集中か
     * @returns {boolean}
     */
    isRecruiting() {
        return this.status === 'recruiting';
    }

    /**
     * シフトにスタッフが割り当てられているか
     * @returns {boolean}
     */
    hasStaff() {
        return this.staffId !== null;
    }

    /**
     * シフトのステータスラベルを取得
     * @returns {string}
     */
    getStatusLabel() {
        const labels = {
            confirmed: '確定',
            pending: '未確定',
            recruiting: '募集中',
            available: '勤務可'
        };
        return labels[this.status] || this.status;
    }

    /**
     * スタッフを割り当て
     * @param {number} staffId
     */
    assignStaff(staffId) {
        this.staffId = staffId;
        this.status = 'pending';
    }

    /**
     * シフトを確定
     */
    confirm() {
        if (this.hasStaff()) {
            this.status = 'confirmed';
        }
    }
}

/**
 * シフト管理クラス
 * 複数のシフトを管理
 */
export class ShiftManager {
    constructor() {
        this.shifts = [];
    }

    /**
     * シフトを追加
     * @param {Shift} shift
     */
    addShift(shift) {
        this.shifts.push(shift);
    }

    /**
     * 日付でシフトを取得
     * @param {string} date - YYYY-MM-DD形式
     * @returns {Shift[]}
     */
    getShiftsByDate(date) {
        return this.shifts.filter(shift => shift.date === date);
    }

    /**
     * スタッフIDでシフトを取得
     * @param {number} staffId
     * @returns {Shift[]}
     */
    getShiftsByStaffId(staffId) {
        return this.shifts.filter(shift => shift.staffId === staffId);
    }

    /**
     * 期間内のシフトを取得
     * @param {string} startDate - YYYY-MM-DD形式
     * @param {string} endDate - YYYY-MM-DD形式
     * @returns {Shift[]}
     */
    getShiftsByDateRange(startDate, endDate) {
        return this.shifts.filter(shift => {
            return shift.date >= startDate && shift.date <= endDate;
        });
    }

    /**
     * 募集中のシフトを取得
     * @returns {Shift[]}
     */
    getRecruitingShifts() {
        return this.shifts.filter(shift => shift.isRecruiting());
    }

    /**
     * 特定のスタッフのシフトを特定の期間で取得
     * @param {number} staffId
     * @param {string} startDate
     * @param {string} endDate
     * @returns {Shift[]}
     */
    getStaffShiftsInRange(staffId, startDate, endDate) {
        return this.shifts.filter(shift => {
            return shift.staffId === staffId && 
                   shift.date >= startDate && 
                   shift.date <= endDate;
        });
    }

    /**
     * 全シフトを取得
     * @returns {Shift[]}
     */
    getAllShifts() {
        return this.shifts;
    }

    /**
     * サンプルデータをロード
     */
    loadSampleData() {
        this.shifts = [
            new Shift('2025-01-01', '08:00-16:00', 'confirmed', { 
                staffId: 1, 
                facility: 'A施設' 
            }),
            new Shift('2025-01-01', '16:00-24:00', 'confirmed', { 
                staffId: 2, 
                facility: 'A施設' 
            }),
            new Shift('2025-01-02', '08:00-16:00', 'pending', { 
                staffId: 3, 
                facility: 'B施設' 
            }),
            new Shift('2025-01-02', '16:00-24:00', 'recruiting', { 
                facility: 'A施設', 
                requirements: ['介護福祉士', '女性'] 
            }),
            new Shift('2025-01-03', '08:00-16:00', 'available', { 
                staffId: 1 
            }),
            new Shift('2025-01-03', '16:00-24:00', 'confirmed', { 
                staffId: 4, 
                facility: 'C施設' 
            }),
            new Shift('2025-01-05', '08:00-16:00', 'confirmed', { 
                staffId: 1, 
                facility: 'A施設' 
            }),
            new Shift('2025-01-07', '08:00-16:00', 'confirmed', { 
                staffId: 2, 
                facility: 'B施設' 
            }),
            new Shift('2025-01-10', '16:00-24:00', 'recruiting', { 
                facility: 'C施設', 
                requirements: ['介護福祉士'] 
            }),
        ];
    }
}