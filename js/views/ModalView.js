/**
 * モーダルビュー
 * シフト詳細モーダルの表示を担当
 */
export class ModalView {
    constructor(modalElementId, contentElementId) {
        this.modalElement = document.getElementById(modalElementId);
        this.contentElement = document.getElementById(contentElementId);
        
        // モーダル背景クリックで閉じる
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });
    }

    /**
     * モーダルを表示
     * @param {string} date - YYYY-MM-DD形式
     * @param {Shift[]} shifts - その日のシフト
     * @param {StaffManager} staffManager
     * @param {string} viewMode - 'staff' or 'coordinator'
     */
    show(date, shifts, staffManager, viewMode = 'staff', currentStaffId = 1) {
        const dateObj = new Date(date + 'T00:00:00');
        const title = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日のシフト`;

        let html = `
            <div class="modal-header">
                <div class="modal-title">${title}</div>
                <button class="modal-close" id="modalCloseBtn">×</button>
            </div>
        `;

        // スタッフ視点では自分のシフトと募集中のみ表示
        const displayShifts = viewMode === 'staff' 
            ? shifts.filter(s => s.staffId === currentStaffId || s.isRecruiting())
            : shifts;

        if (displayShifts.length === 0) {
            html += '<div class="empty-message">この日のシフトはありません</div>';
        } else {
            displayShifts.forEach(shift => {
                html += this.createShiftDetailHTML(shift, staffManager, viewMode);
            });
        }

        this.contentElement.innerHTML = html;
        this.modalElement.classList.add('active');

        // 閉じるボタンのイベントリスナー
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    /**
     * シフト詳細のHTMLを生成
     * @param {Shift} shift
     * @param {StaffManager} staffManager
     * @param {string} viewMode
     * @returns {string}
     */
    createShiftDetailHTML(shift, staffManager, viewMode) {
        const staff = shift.hasStaff() ? staffManager.getStaffById(shift.staffId) : null;
        const statusClass = `shift-${shift.status}`;
        const statusLabel = shift.getStatusLabel();

        let html = `
            <div class="modal-shift ${statusClass}">
                <div class="modal-shift-header">
                    <div>
                        <div class="modal-shift-time">${shift.time}</div>
                        <div class="modal-shift-facility">${shift.facility || '施設未定'}</div>
                    </div>
                    <div class="modal-shift-status">${statusLabel}</div>
                </div>
        `;

        // スタッフ情報
        if (staff) {
            html += `
                <div class="modal-shift-staff">
                    <div class="modal-staff-name">${staff.name}</div>
                    <div class="modal-staff-info">${staff.gender} / 経験${staff.experience}</div>
                    <div class="staff-skills">
                        ${staff.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        } 
        // 募集条件
        else if (shift.isRecruiting() && shift.requirements.length > 0) {
            html += `
                <div class="modal-requirements">
                    <div class="modal-requirements-title">募集条件</div>
                    <div class="staff-skills">
                        ${shift.requirements.map(req => `<span class="skill-tag">${req}</span>`).join('')}
                    </div>
            `;

            if (viewMode === 'staff') {
                html += `
                    <div class="modal-actions">
                        <button class="btn btn-danger" onclick="alert('応募機能は未実装です')">このシフトに応募する</button>
                    </div>
                `;
            }

            html += '</div>';
        }

        // 調整者用のアクションボタン
        if (viewMode === 'coordinator') {
            html += `
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="alert('編集機能は未実装です')">編集</button>
                    <button class="btn btn-secondary" onclick="alert('削除機能は未実装です')">削除</button>
                </div>
            `;
        }

        html += '</div>';

        return html;
    }

    /**
     * モーダルを閉じる
     */
    close() {
        this.modalElement.classList.remove('active');
    }
}