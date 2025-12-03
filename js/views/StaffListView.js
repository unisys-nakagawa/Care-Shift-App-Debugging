/**
 * スタッフリストビュー
 * スタッフ一覧の表示を担当
 */
export class StaffListView {
    constructor(gridElementId) {
        this.gridElement = document.getElementById(gridElementId);
    }

    /**
     * スタッフリストをレンダリング
     * @param {Staff[]} staffList
     */
    render(staffList) {
        this.gridElement.innerHTML = '';

        staffList.forEach(staff => {
            const cardElement = this.createStaffCard(staff);
            this.gridElement.appendChild(cardElement);
        });
    }

    /**
     * スタッフカード要素を作成
     * @param {Staff} staff
     * @returns {HTMLElement}
     */
    createStaffCard(staff) {
        const card = document.createElement('div');
        card.className = 'staff-card';

        // ヘッダー
        const header = document.createElement('div');
        header.className = 'staff-card-header';

        const name = document.createElement('div');
        name.className = 'staff-name';
        name.textContent = staff.name;

        const gender = document.createElement('div');
        gender.className = 'staff-gender';
        gender.textContent = staff.gender;

        header.appendChild(name);
        header.appendChild(gender);
        card.appendChild(header);

        // 経験
        const experience = document.createElement('div');
        experience.className = 'staff-experience';
        experience.textContent = `経験: ${staff.experience}`;
        card.appendChild(experience);

        // スキル
        const skillsContainer = document.createElement('div');
        skillsContainer.className = 'staff-skills';

        staff.skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            skillsContainer.appendChild(tag);
        });

        card.appendChild(skillsContainer);

        return card;
    }

    /**
     * 表示/非表示を切り替え
     * @param {boolean} visible
     */
    setVisible(visible) {
        const section = this.gridElement.closest('.staff-section');
        if (section) {
            section.style.display = visible ? 'block' : 'none';
        }
    }
}