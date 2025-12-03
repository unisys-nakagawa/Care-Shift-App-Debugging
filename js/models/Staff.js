/**
 * スタッフモデル
 * 介護スタッフの情報を管理
 */
export class Staff {
    constructor(id, name, skills, experience, gender) {
        this.id = id;
        this.name = name;
        this.skills = skills; // 資格・スキルの配列
        this.experience = experience; // 経験年数
        this.gender = gender; // 性別
    }

    /**
     * スタッフが特定のスキルを持っているか確認
     * @param {string} skill - 確認するスキル
     * @returns {boolean}
     */
    hasSkill(skill) {
        return this.skills.includes(skill);
    }

    /**
     * スタッフが複数のスキルをすべて持っているか確認
     * @param {string[]} requiredSkills - 必要なスキルの配列
     * @returns {boolean}
     */
    hasAllSkills(requiredSkills) {
        return requiredSkills.every(skill => this.hasSkill(skill));
    }

    /**
     * スタッフ情報を文字列で取得
     * @returns {string}
     */
    toString() {
        return `${this.name} (${this.gender}, 経験${this.experience})`;
    }
}

/**
 * スタッフ管理クラス
 * 複数のスタッフを管理
 */
export class StaffManager {
    constructor() {
        this.staffList = [];
    }

    /**
     * スタッフを追加
     * @param {Staff} staff
     */
    addStaff(staff) {
        this.staffList.push(staff);
    }

    /**
     * IDでスタッフを取得
     * @param {number} id
     * @returns {Staff|null}
     */
    getStaffById(id) {
        return this.staffList.find(staff => staff.id === id) || null;
    }

    /**
     * 全スタッフを取得
     * @returns {Staff[]}
     */
    getAllStaff() {
        return this.staffList;
    }

    /**
     * 条件に合うスタッフを検索
     * @param {Object} conditions - { skills: string[], gender: string }
     * @returns {Staff[]}
     */
    findStaff(conditions) {
        return this.staffList.filter(staff => {
            // スキル条件
            if (conditions.skills && conditions.skills.length > 0) {
                if (!staff.hasAllSkills(conditions.skills)) {
                    return false;
                }
            }

            // 性別条件
            if (conditions.gender && staff.gender !== conditions.gender) {
                return false;
            }

            return true;
        });
    }

    /**
     * サンプルデータをロード
     */
    loadSampleData() {
        this.staffList = [
            new Staff(1, '山田太郎', ['介護福祉士', '喀痰吸引'], '5年', '男性'),
            new Staff(2, '佐藤花子', ['介護福祉士', '認知症ケア'], '3年', '女性'),
            new Staff(3, '鈴木一郎', ['ヘルパー2級'], '1年', '男性'),
            new Staff(4, '田中美咲', ['介護福祉士', '看護師'], '8年', '女性'),
        ];
    }
}