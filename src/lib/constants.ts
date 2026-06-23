// 团标等级数据
export const levels = [
  {
    id: "L0",
    name: "入门",
    std: "1级",
    modules: ["M1 概念认知", "M2 提示词基础"],
    desc: "AI视频制作入门，掌握基本概念与工具" ,
    color: "#3fb950",
  },
  {
    id: "L1",
    name: "进阶",
    std: "2级",
    modules: ["M3 AI图像创作", "M4 AI视频入门", "M5 AI音频处理"],
    desc: "独立完成AI图像、视频、音频创作",
    color: "#58a6ff",
  },
  {
    id: "L2",
    name: "高级",
    std: "3-4级",
    modules: ["M6 专业剪辑", "M7 虚拟数字人", "M8 互动视频", "M9 AI编导"],
    desc: "专业级AI视频制作与编导能力",
    color: "#d2991d",
  },
  {
    id: "L3",
    name: "大师",
    std: "5-6级",
    modules: ["M10 多模态", "M11 商业实战", "M12 毕业大作"],
    desc: "多模态融合、商业项目实施与教学设计",
    color: "#bc8cff",
  },
];

// 师训Day数据
export const trainingDays = [
  {
    day: 1,
    theme: "文生图入门",
    level: "L1",
    duration: "6小时",
    modules: [
      { time: "09:00", title: "导论与AI工具矩阵" },
      { time: "10:30", title: "提示词基础与实践" },
      { time: "14:00", title: "文生图核心技巧" },
      { time: "15:30", title: "实战作业与路演" },
    ],
    color: "#3fb950",
  },
  {
    day: 2,
    theme: "文本生成+提示词进阶",
    level: "L2",
    duration: "6小时",
    modules: [
      { time: "09:00", title: "文本生成原理与工具" },
      { time: "10:30", title: "提示词进阶策略" },
      { time: "14:00", title: "剧本与台词写作" },
      { time: "15:30", title: "实战作业与路演" },
    ],
    color: "#58a6ff",
  },
  {
    day: 3,
    theme: "图像生成+多模态",
    level: "L2",
    duration: "6小时",
    modules: [
      { time: "09:00", title: "图生图与风格迁移" },
      { time: "10:30", title: "ControlNet与精准控制" },
      { time: "14:00", title: "多模态融合工作流" },
      { time: "15:30", title: "实战作业与路演" },
    ],
    color: "#58a6ff",
  },
  {
    day: 4,
    theme: "AIGC视频制作实战",
    level: "L2+",
    duration: "6小时",
    modules: [
      { time: "09:00", title: "文生视频工具全解析" },
      { time: "10:30", title: "分镜脚本与运镜设计" },
      { time: "14:00", title: "配音、字幕与剪辑" },
      { time: "15:30", title: "完整短片实战" },
    ],
    color: "#d2991d",
  },
  {
    day: 5,
    theme: "综合实战+认证考核",
    level: "L3",
    duration: "6小时",
    modules: [
      { time: "09:00", title: "完整项目设计" },
      { time: "10:30", title: "素材生产与合成" },
      { time: "14:00", title: "作品路演与同侣互评" },
      { time: "15:30", title: "认证考核与结业" },
    ],
    color: "#bc8cff",
  },
];
