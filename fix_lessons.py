#!/usr/bin/env python3
"""Fix trainingCourse lessons: remove excess, add missing fields."""
import re

COURSE_FILE = '/Users/wanwei98241gmail.com/Desktop/AI视频制作/ccav-web/src/lib/courseData.ts'

# Lesson templates for missing fields
ADVANCED_CHALLENGES = {
    "AI工具全景与行业认知": "调研2025年AI视频工具最新生态图谱，对比至少5款免费工具的优劣势，撰写一份200字选型建议报告。",
    "提示词工程——从入门到精通": "设计一个'提示词自动优化器'系统提示词：输入任意教学需求后自动输出结构化提示词。测试至少3个不同学科场景验证效果。",
    "文生图入门——教学配图制作": "用同一教学主题在3个不同文生图工具生成对比，分析各工具在构图、细节、风格还原上的优劣，评出最佳工具。",
    "文生图进阶——控图技巧与质量控制": "为一部教学动画设计角色一致性方案：确定关键参数(种子/参考图/风格词)，生成不同场景的主角形象确保风格统一。",
    "CCAV平台工具演示与教学准备": "设计一个可复用的'AIGC教学素材生产SOP'，包含从需求分析到成品交付的完整步骤、检查点和质量标准。",
    "综合应用：从选题到成片——完整流程演练": "用你选择的学科主题完整跑通一遍全流程，制作一份5分钟教学短片并附制作复盘文档(遇到的问题+解决方案)。",
    "主流大模型对比与选型——教学生如何挑模型": "做一份'AI视频教学模型选型对比表'：对比Kimi/DeepSeek/通义千问/文心一言在脚本生成、创意性、准确度三个维度的表现。",
    "提示词核心框架精讲——结构参数化vs自然语言": "对比测试同一主题用自然语言vs结构化vs参数化三种写法，分析输出质量差异，输出选型建议。",
    "提示词设计模式——四大教学场景专属模式": "为'理科实验演示'和'文科历史叙事'各设计一套专属模式，在真实场景下测试迭代优化。",
    "图像生成实操——教学配图3步出图法": "批量生成同一学科10个不同知识点的教学配图，确保风格统一、主题清晰，输出配图质量标准检查清单。",
    "AI图像质控——翻车识别与修正技巧": "收集5个真实AI图像翻车案例(手指畸形/文字乱码/构图失衡/风格偏差/细节丢失)，逐一诊断+修复，做成翻车修复手册。",
    "跨工具实操对比——同题异构": "用同一教学主题在3个工具(MJ/可灵/即梦)生成教学素材包，做三方对比评测报告。",
    "综合实操——制作课件配图包": "为一个完整课件(≥20页)生成配套的AI配图包，确保风格连贯、每页配图与内容精准匹配。",
    "图像理解入门——让AI看懂你的图": "收集5张不同类型的教学图片(手绘图/照片/示意图/图表/截图)，用AI分析每张图的内容并验证准确性，分析AI图像理解的局限性。",
    "多模态教学应用——文本↔图像↔音频": "设计一个多模态教学场景：同一教学内容用文本+图像+音频三种形式表达，并分析各自的适用场景。",
    "文生视频核心——第一次AI视频生成": "对比同一提示词在不同视频生成工具(可灵/Sora/Runway)中的效果，分析各工具适用场景。",
    "图生视频——以图为基的精准控制": "用同一张图在不同工具生成视频，对比运动幅度、一致性、创意性三个维度，制作对比表。",
    "配音与音效合成——让视频会说话": "为同一个视频片段尝试至少3种不同风格配音(严肃/活泼/亲切)，并收集他人反馈选择最佳方案。",
    "AI字幕与基础剪辑——一生成片": "分别走全自动和半自动两条路径生成同一教学内容成片，分析两种工作流在质量、效率、可控性上的差异。",
    "完整短片制作全流程——5步搞定30秒教学短片": "升级你的30秒短片到60秒，增加过渡动画和音效，写制作复盘(5步各花多少时间？哪里可以优化？)。",
    "教学场景视频实战——分学科针对性制作": "为非你专业的学科制作一个教学视频，测试你的通用方法论能否跨学科迁移。",
    "5天技能总复盘与认证评估标准": "整理5天全部作品(至少10件)形成个人作品集，含每件作品说明、技术要点、改进方向。",
    "完整项目实战I——选题与教学设计": "用AI同时生成3个不同方向的教学设计草案，对比选优并详细说明选择理由。",
    "完整项目实战II——素材批量生产": "建立一套自动化素材生产流水线：输入主题→输出全部素材(≥20张图+5段配音+3段视频)。",
    "完整项目实战III——合成与精修": "用专业剪辑软件对AI成片做深度精修(调色/音效/转场)，提交精修前后对比并标注每处改动意图。",
    "翻车逆袭专场——5天典型问题TOP 10": "挑选你最典型的3个翻车经历写成完整的诊断→修复→预防文章，收录进个人教学素材库。",
    "结业总结与认证——30天行动路线图": "设计你的第一个独立AI视频教学项目方案(含课程大纲/目标学员/制作计划/推广方案)，提交给讲师评审。",
}

NEXT_PREVIEWS = {
    "AI工具全景与行业认知": "下一课将深入提示词工程——这是AI视频制作中最核心的能力，直接影响每个环节的输出质量。",
    "提示词工程——从入门到精通": "下一课将进入文生图实操——学会如何将你的教学想法转化为视觉画面。",
    "文生图入门——教学配图制作": "下一课将学习文生图进阶技巧——控制构图、风格和质量，让AI按你的想法出图。",
    "文生图进阶——控图技巧与质量控制": "下一课将体验CCAV平台工具——看看教学平台如何整合AI能力简化工作流。",
    "CCAV平台工具演示与教学准备": "下一课是Day1收官实战——从选题到成片完整流程演练，检验今天的学习效果。",
    "综合应用：从选题到成片——完整流程演练": "Day 2将进入文本生成与提示词深水区——从Kimi API实战到提示词设计模式。",
    "主流大模型对比与选型——教学生如何挑模型": "下一课将深入提示词核心框架——学会结构化参数化写法让AI精准输出。",
    "提示词核心框架精讲——结构参数化vs自然语言": "下一课将系统学习提示词设计模式——四大教学场景各有专属写法。",
    "提示词设计模式——四大教学场景专属模式": "最后一课将综合Day2所学搭建AI教学工作站并掌握文本质控体系。",
    "图像生成实操——教学配图3步出图法": "下一课将专门解决AI图像翻车问题——学不会诊断翻车做不出好素材。",
    "AI图像质控——翻车识别与修正技巧": "下一课将进行跨工具同题异构实战——体验不同AI工具的风格差异。",
    "跨工具实操对比——同题异构": "下一课是综合实操——批量制作一套完整的课件配图包练练手。",
    "综合实操——制作课件配图包": "下一课将学习图像理解——让AI看懂你的图为多模态教学做准备。",
    "图像理解入门——让AI看懂你的图": "最后一课将学习多模态教学应用——文本图像音频如何协同提升教学效果。",
    "多模态教学应用——文本↔图像↔音频": "Day 4将进入视频制作核心——从文生视频到完整的教学短片全流程。",
    "文生视频核心——第一次AI视频生成": "下一课将学习图生视频——以图片为基础实现更精准的视频控制。",
    "图生视频——以图为基的精准控制": "下一课将让你的视频开口说话——AI配音与音效合成技巧。",
    "配音与音效合成——让视频会说话": "下一课将学习AI字幕与一键成片——两种工作流各有千秋。",
    "AI字幕与基础剪辑——一生成片": "下一课将串联Day4全部技能——5步制作你的第一条完整教学短片。",
    "完整短片制作全流程——5步搞定30秒教学短片": "下一课将分学科针对性实战——不同学科的教学视频制作策略大不同。",
    "教学场景视频实战——分学科针对性制作": "Day 5是综合实战日——全API串联完整项目制作认证考核一站完成。",
    "5天技能总复盘与认证评估标准": "下一课是完整项目实战——全API串联完成选题设计与素材批量生产。",
    "完整项目实战I——选题与教学设计": "下一课将批量生产全部素材——从文本到图像到配音自动化流水线。",
    "完整项目实战II——素材批量生产": "下一课将合成精修——把一切素材变成最终成片。",
    "完整项目实战III——合成与精修": "下一课是翻车逆袭专场——5天最典型问题逐一诊断修复。",
    "翻车逆袭专场——5天典型问题TOP 10": "最后一课——结业总结认证颁发30天行动路线图启程。",
    "结业总结与认证——30天行动路线图": "恭喜完成5天师训！持证上岗开启AI视频教学之旅。",
}

with open(COURSE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Find trainingCourse
tc_start = content.find('export const trainingCourse')
obj_start = content.find('{', tc_start)
depth = 0
i = obj_start
while i < len(content):
    if content[i] == '{': depth += 1
    elif content[i] == '}': depth -= 1
    if depth == 0: break
    i += 1
tc_end = i + 1

before = content[:tc_start]
training = content[tc_start:tc_end]
after = content[tc_end:]

# Step 1: Remove Day4's 7th lesson (作品展评与进阶探索——ComfyUI与开源模型)
# Find the lesson block and remove it
day4_extra = '          {\n            title: "作品展评与进阶探索——ComfyUI与开源模型",'
if day4_extra in training:
    # Find the full lesson block
    extra_start = training.find(day4_extra)
    # Find matching closing of this lesson object
    # Count braces from the { 
    brace_start = training.find('{', extra_start)
    depth = 0
    j = brace_start
    while j < len(training):
        if training[j] == '{': depth += 1
        elif training[j] == '}': depth -= 1
        if depth == 0:
            # Include the comma after }
            if j+1 < len(training) and training[j+1] == ',':
                j += 1
            # Also remove trailing newline
            if j+1 < len(training) and training[j+1] == '\n':
                j += 1
            break
        j += 1
    training = training[:extra_start] + training[j+1:]
    print("✅ Removed Day4 Lesson 7 (作品展评)")
else:
    print("⚠️ Day4 Lesson 7 not found")

# Step 2: Remove Day5's 6th lesson (作品路演与教学场景研讨)
day5_extra = '          {\n            title: "作品路演与教学场景研讨",'
if day5_extra in training:
    extra_start = training.find(day5_extra)
    brace_start = training.find('{', extra_start)
    depth = 0
    j = brace_start
    while j < len(training):
        if training[j] == '{': depth += 1
        elif training[j] == '}': depth -= 1
        if depth == 0:
            if j+1 < len(training) and training[j+1] == ',':
                j += 1
            if j+1 < len(training) and training[j+1] == '\n':
                j += 1
            break
        j += 1
    training = training[:extra_start] + training[j+1:]
    print("✅ Removed Day5 Lesson 6 (作品路演)")
else:
    print("⚠️ Day5 Lesson 6 not found")

# Step 3: Add missing advancedChallenge and nextPreview to lessons
lessons_modified = 0
for lesson_title in ADVANCED_CHALLENGES:
    ac = ADVANCED_CHALLENGES[lesson_title]
    np = NEXT_PREVIEWS.get(lesson_title, "")
    
    # Find this lesson in training section
    title_marker = f'title: "{lesson_title}",'
    idx = training.find(title_marker)
    if idx < 0:
        continue
    
    # Check if advancedChallenge already exists
    # Search from title to the closing of this lesson
    lesson_obj_start = training.rfind('{', 0, idx)
    depth = 0
    j = lesson_obj_start
    lesson_end = -1
    while j < len(training):
        if training[j] == '{': depth += 1
        elif training[j] == '}': depth -= 1
        if depth == 0:
            lesson_end = j
            break
        j += 1
    
    lesson_block = training[lesson_obj_start:lesson_end+1]
    has_ac = 'advancedChallenge:' in lesson_block
    has_np = 'nextPreview:' in lesson_block
    
    if not has_ac and not has_np:
        # Add both before the closing or after selfTest
        # Find insertion point - after the last field before closing }
        # Look for the last "]," pattern (end of selfTest) or the last field
        last_selfTest = lesson_block.rfind('selfTest:')
        if last_selfTest > 0:
            # Find the closing of selfTest array and the lesson
            self_test_end = lesson_block.rfind('],')
            if self_test_end < 0:
                self_test_end = lesson_block.rfind(']')
            
            # Insert after selfTest but before the closing of the lesson
            insert_pos = lesson_obj_start + self_test_end
            # Find the next line after selfTest closing
            next_newline = training.find('\n', insert_pos)
            if next_newline > 0 and next_newline < lesson_end:
                indent = '            '
                insert_text = (
                    f'\n{indent}advancedChallenge: "{ac}"'
                    f'\n{indent}nextPreview: "{np}"'
                )
                training = training[:next_newline] + insert_text + training[next_newline:]
                lessons_modified += 1
    
    elif not has_ac:
        # Add advancedChallenge before nextPreview or at end
        if has_np:
            np_pos = lesson_block.find('nextPreview:')
            np_abs = lesson_obj_start + np_pos
            prev_newline = training.rfind('\n', 0, np_abs)
            indent = '            '
            insert_text = f'{indent}advancedChallenge: "{ac}"\n'
            training = training[:prev_newline+1] + insert_text + training[prev_newline+1:]
            lessons_modified += 1
    
    elif not has_np:
        # Add nextPreview at end
        # Insert before closing }
        prev_newline = training.rfind('\n', 0, lesson_end)
        indent = '            '
        insert_text = f'{indent}nextPreview: "{np}"\n'
        training = training[:prev_newline+1] + insert_text + training[prev_newline+1:]
        lessons_modified += 1

# Write back
new_content = before + training + after
with open(COURSE_FILE, 'w', encoding='utf-8') as f:
    f.write(new_content)

# Verify
ac_count = new_content.count('advancedChallenge:')
np_count = new_content.count('nextPreview:')
isp_count = training.count('isPractical:')

print(f"\n📊 Verification:")
print(f"  lessons (isPractical): {isp_count}")
print(f"  advancedChallenge: {ac_count}")
print(f"  nextPreview: {np_count}")
print(f"  lessons modified: {lessons_modified}")
