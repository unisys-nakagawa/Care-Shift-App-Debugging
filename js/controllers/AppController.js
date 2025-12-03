import { StaffManager } from '../models/Staff.js';
import { ShiftManager } from '../models/Shift.js';
import { CalendarView } from '../views/CalendarView.js';
import { StaffListView } from '../views/StaffListView.js';
import { ModalView } from '../views/ModalView.js';

/**
 * アプリケーションコントローラー
 * ビューとモデルを仲介し、アプリケーション全体のロジックを制御
 */
export class AppController {
    constructor() {
        // モデル
        this.staffManager = new StaffManager();
        this.shiftManager = new ShiftManager();

        // ビュー
        this.calendarView = new CalendarView('calendarGrid', 2025, 0); // 2025年1月
        this.staffListView = new StaffListView('staffGrid');
        this.modalView = new ModalView('detailModal', 'modalContent');

        // 状態
        this.currentViewMode = 'staff'; // 'staff' or 'coordinator'
        this.currentStaffId = 1; // ログイン中のスタッフID（仮）

        // イベントリスナーの設定
        this.setupEventListeners();

        // データをロードして初期表示
        this.initialize();
    }

    /**
     * 初期化
     */
    initialize() {
        // サンプルデータをロード
        this.staffManager.loadSampleData();
        this.shiftManager.loadSampleData();

        // 初期表示
        this.updateView();
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // 視点切り替えボタン
        const staffViewBtn = document.getElementById('staffViewBtn');
        const coordinatorViewBtn = document.getElementById('coordinatorViewBtn');

        staffViewBtn.addEventListener('click', () => {
            this.switchViewMode('staff');
        });

        coordinatorViewBtn.addEventListener('click', () => {
            this.switchViewMode('coordinator');
        });

        // 月表示/週表示切り替えボタン
        const monthViewBtn = document.getElementById('monthViewBtn');
        const weekViewBtn = document.getElementById('weekViewBtn');
        const weekNavigation = document.getElementById('weekNavigation');

        monthViewBtn.addEventListener('click', () => {
            this.calendarView.setViewMode('month');
            monthViewBtn.classList.add('active');
            weekViewBtn.classList.remove('active');
            weekNavigation.style.display = 'none';
            this.updateView();
        });

        weekViewBtn.addEventListener('click', () => {
            this.calendarView.setViewMode('week');
            weekViewBtn.classList.add('active');
            monthViewBtn.classList.remove('active');
            weekNavigation.style.display = 'flex';
            this.updateWeekLabel();
            this.updateView();
        });

        // 週の前後移動
        const prevWeekBtn = document.getElementById('prevWeekBtn');
        const nextWeekBtn = document.getElementById('nextWeekBtn');

        prevWeekBtn.addEventListener('click', () => {
            this.calendarView.moveWeek(-1);
            this.updateWeekLabel();
            this.updateView();
        });

        nextWeekBtn.addEventListener('click', () => {
            this.calendarView.moveWeek(1);
            this.updateWeekLabel();
            this.updateView();
        });

        // カレンダーの日付クリック
        this.calendarView.setOnDateClick((date) => {
            this.showShiftDetail(date);
        });
    }

    /**
     * 週ラベルを更新
     */
    updateWeekLabel() {
        const weekLabel = document.getElementById('weekLabel');
        if (weekLabel) {
            weekLabel.textContent = this.calendarView.getWeekLabel();
        }
    }

    /**
     * 視点モードを切り替え
     * @param {string} mode - 'staff' or 'coordinator'
     */
    switchViewMode(mode) {
        this.currentViewMode = mode;

        // ボタンのアクティブ状態を更新
        const staffViewBtn = document.getElementById('staffViewBtn');
        const coordinatorViewBtn = document.getElementById('coordinatorViewBtn');
        const headerDesc = document.getElementById('headerDesc');

        if (mode === 'staff') {
            staffViewBtn.classList.add('active');
            coordinatorViewBtn.classList.remove('active');
            headerDesc.textContent = 'あなたのシフトと勤務可能日を管理できます';
            this.staffListView.setVisible(false);
        } else {
            coordinatorViewBtn.classList.add('active');
            staffViewBtn.classList.remove('active');
            headerDesc.textContent = '全スタッフのシフトを確認・調整できます';
            this.staffListView.setVisible(true);
        }

        this.updateView();
    }

    /**
     * ビューを更新
     */
    updateView() {
        // カレンダーを更新
        const shifts = this.shiftManager.getAllShifts();
        this.calendarView.render(
            shifts,
            this.staffManager,
            this.currentViewMode,
            this.currentStaffId
        );

        // 調整者視点の場合はスタッフリストも更新
        if (this.currentViewMode === 'coordinator') {
            const staffList = this.staffManager.getAllStaff();
            this.staffListView.render(staffList);
        }
    }

    /**
     * シフト詳細を表示
     * @param {string} date - YYYY-MM-DD形式
     */
    showShiftDetail(date) {
        const shifts = this.shiftManager.getShiftsByDate(date);
        this.modalView.show(date, shifts, this.staffManager, this.currentViewMode, this.currentStaffId);
    }

    /**
     * シフトを追加（今後の拡張用）
     * @param {Shift} shift
     */
    addShift(shift) {
        this.shiftManager.addShift(shift);
        this.updateView();
    }

    /**
     * スタッフを追加（今後の拡張用）
     * @param {Staff} staff
     */
    addStaff(staff) {
        this.staffManager.addStaff(staff);
        this.updateView();
    }

    /**
     * 募集中シフトを検索
     * @returns {Shift[]}
     */
    getRecruitingShifts() {
        return this.shiftManager.getRecruitingShifts();
    }

    /**
     * スタッフの月間シフトを取得
     * @param {number} staffId
     * @param {number} year
     * @param {number} month
     * @returns {Shift[]}
     */
    getStaffMonthlyShifts(staffId, year, month) {
        const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month + 1, 0).getDate();
        const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        
        return this.shiftManager.getStaffShiftsInRange(staffId, startDate, endDate);
    }

    /**
     * 条件に合うスタッフを検索（今後の拡張用）
     * @param {Object} conditions
     * @returns {Staff[]}
     */
    findMatchingStaff(conditions) {
        return this.staffManager.findStaff(conditions);
    }
}