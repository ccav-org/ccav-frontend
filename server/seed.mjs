/**
 * ccav.com Phase 2 — 课程数据种子
 * 将师训Day1-Day5课程数据导入数据库
 */
import db from './db.js';
import './models.mjs';

const COURSES = [
  {
    slug: 'training',
    title: 'AIGC视频制作规范与实践 — 5天师训',
    subtitle: '从零到一掌握AI视频制作全流程',
    description: '包含完整5天的培训课程体系，覆盖AI视频制作的全流程：从行业认知、工具矩阵、提示词工程、AI视频生成到AIGC短片创作实践。',
    category: 'training',
    level: 'all',
    duration_hours: 40,
    lesson_count: 30,
    sort_order: 1,
  },
  {
    slug: 'ai-vivid-generation',
    title: 'AI生图高级实战',
    subtitle: '精通AI图像生成技巧',
    description: '深入学习AI图像生成技术，掌握可灵、Midjourney等工具的高级用法。',
    category: 'img-gen',
    level: 'intermediate',
    duration_hours: 20,
    sort_order: 2,
  },
];

// 模块定义（师训）
const MODULES = [
  { course_idx: 0, title: 'Day 1：AI行业认知与工具矩阵', description: '了解AI最新发展趋势，建立AI工具矩阵，选择适合自己的工具', sort_order: 1, duration: 480 },
  { course_idx: 0, title: 'Day 2：提示词工程与AI文案生成', description: '掌握提示词工程核心技术，高效生成文案', sort_order: 2, duration: 480 },
  { course_idx: 0, title: 'Day 3：AI视频生成技术', description: '文生视频、图生视频、视频编辑', sort_order: 3, duration: 480 },
  { course_idx: 0, title: 'Day 4：AIGC短片创作实践', description: '从选题到成片，完整创作流程', sort_order: 4, duration: 480 },
  { course_idx: 0, title: 'Day 5：商业应用与生态搭建', description: '变现模式、作品集、持续成长', sort_order: 5, duration: 480 },
];

// 课时（30课）
const LESSONS = [
  // Day1 (lesson_count=8)
  { mod_idx: 0, title: '课程导入：AIGC时代的名片与作品', content_type: 'lecture', duration: 30 },
  { mod_idx: 0, title: '模块一：AI最新发展趋势', content_type: 'lecture', duration: 45 },
  { mod_idx: 0, title: '模块一：AI与视频的未来', content_type: 'lecture', duration: 30 },
  { mod_idx: 0, title: '模块二：AI工具矩阵概览', content_type: 'lecture', duration: 60 },
  { mod_idx: 0, title: '模块二：AI工具选择与部署', content_type: 'lecture', duration: 45 },
  { mod_idx: 0, title: '模块三：提示词基础与AI对话', content_type: 'lecture', duration: 60 },
  { mod_idx: 0, title: '模块四：文生图技术与实战', content_type: 'lecture', duration: 60 },
  { mod_idx: 0, title: 'Day1 综合演练与答疑', content_type: 'lecture', duration: 30 },
  // Day2
  { mod_idx: 1, title: '模块一：提示词工程进阶', content_type: 'lecture', duration: 60 },
  { mod_idx: 1, title: '模块一：AI文案写作工具箱', content_type: 'lecture', duration: 45 },
  { mod_idx: 1, title: '模块二：分镜脚本设计', content_type: 'lecture', duration: 60 },
  { mod_idx: 1, title: '模块二：AI辅助剧本创作', content_type: 'lecture', duration: 45 },
  { mod_idx: 1, title: '模块三：AI配音与音效', content_type: 'lecture', duration: 60 },
  { mod_idx: 1, title: 'Day2 综合演练与答疑', content_type: 'lecture', duration: 30 },
  // Day3
  { mod_idx: 2, title: '模块一：文生视频入门', content_type: 'lecture', duration: 60 },
  { mod_idx: 2, title: '模块一：图生视频进阶', content_type: 'lecture', duration: 60 },
  { mod_idx: 2, title: '模块二：视频编辑与后期', content_type: 'lecture', duration: 60 },
  { mod_idx: 2, title: '模块二：AI视频特效与转场', content_type: 'lecture', duration: 45 },
  { mod_idx: 2, title: '模块三：视频质量优化', content_type: 'lecture', duration: 45 },
  { mod_idx: 2, title: 'Day3 综合演练与答疑', content_type: 'lecture', duration: 30 },
  // Day4
  { mod_idx: 3, title: '模块一：AIGC短片创作流程', content_type: 'lecture', duration: 60 },
  { mod_idx: 3, title: '模块一：选题策划与创意构思', content_type: 'lecture', duration: 45 },
  { mod_idx: 3, title: '模块二：AI短片实战——从0到1', content_type: 'lecture', duration: 90 },
  { mod_idx: 3, title: '模块二：联合作战与角色分工', content_type: 'lecture', duration: 60 },
  { mod_idx: 3, title: 'Day4 作品打磨与反馈', content_type: 'lecture', duration: 45 },
  // Day5
  { mod_idx: 4, title: '模块一：AIGC在各领域的应用', content_type: 'lecture', duration: 60 },
  { mod_idx: 4, title: '模块一：变现模式与商业机会', content_type: 'lecture', duration: 45 },
  { mod_idx: 4, title: '模块二：作品集与个人品牌', content_type: 'lecture', duration: 45 },
  { mod_idx: 4, title: '模块二：持续成长与社区建设', content_type: 'lecture', duration: 45 },
  { mod_idx: 4, title: 'Day5 结业与未来展望', content_type: 'lecture', duration: 60 },
];

function seed() {
  console.log('📦 Seeding course data...');

  // 清空旧数据（保持幂等）
  db.exec('DELETE FROM user_progress');
  db.exec('DELETE FROM quiz_results');
  db.exec('DELETE FROM quizzes');
  db.exec('DELETE FROM lessons');
  db.exec('DELETE FROM modules');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM courses');

  // 插入课程
  for (const c of COURSES) {
    const existing = db.prepare('SELECT id FROM courses WHERE slug = ?').get(c.slug);
    if (existing) continue;
    db.prepare(`
      INSERT INTO courses (slug, title, subtitle, description, category, level, duration_hours, lesson_count, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(c.slug, c.title, c.subtitle, c.description, c.category, c.level, c.duration_hours, c.lesson_count, c.sort_order);
  }

  const trainingCourse = db.prepare("SELECT id FROM courses WHERE slug = 'training'").get();

  // 插入模块
  for (const m of MODULES) {
    db.prepare(`
      INSERT INTO modules (course_id, title, description, sort_order, duration_minutes, lesson_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(trainingCourse.id, m.title, m.description, m.sort_order, m.duration, 0);
  }

  // 获取所有模块ID
  const modules = db.prepare(
    'SELECT id, sort_order FROM modules WHERE course_id = ? ORDER BY sort_order'
  ).all(trainingCourse.id);

  // 插入课时
  for (const l of LESSONS) {
    const modId = modules[l.mod_idx].id;
    db.prepare(`
      INSERT INTO lessons (module_id, course_id, title, content_type, duration_minutes, sort_order, is_free)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(modId, trainingCourse.id, l.title, l.content_type, l.duration, 0, 1);
  }

  // 更新 lesson_count
  for (const mod of modules) {
    const count = db.prepare('SELECT COUNT(*) as cnt FROM lessons WHERE module_id = ?').get(mod.id);
    db.prepare('UPDATE modules SET lesson_count = ? WHERE id = ?').run(count.cnt, mod.id);
  }

  console.log('✅ Seeded:');
  console.log(`   Courses: ${COURSES.length}`);
  console.log(`   Modules: ${MODULES.length}`);
  console.log(`   Lessons: ${LESSONS.length}`);

  db.close();
}

seed();
