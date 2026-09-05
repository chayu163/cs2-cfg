# cfg 配置层语义化重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `cfg/config/` 从"数字编号 modules + 大杂烩 4_binds"重组为"settings / binds / modes / shared 语义目录"，控制台指令、按键、启动项、菜单输出零变化。

**Architecture:** 纯文件移动 + 引用同步，无任何逻辑改动。加载顺序的唯一真源是 `main.cfg` 的 exec 清单；每个文件单一职责；跨模式公共 alias 收敛到 `shared.cfg`。

**Tech Stack:** Source 引擎 .cfg 脚本；无构建/测试框架，验证 = 静态 grep/diff 核对。

**Spec:** `docs/superpowers/specs/2026-09-05-cfg-restructure-design.md`（执行者须先读 spec 再读本计划）

## Global Constraints

- `cfg/autoexec.cfg` 与 `cfg/config/main.cfg` 的**路径**不变（启动项依赖）
- 所有控制台指令名、所有按键绑定、菜单 ASCII 输出**零变化**；唯一批准的输出变化是菜单 echo 中的**路径提示文字**（Task 5）
- 所有文件移动必须 `git mv`（保留历史），禁止复制+删除
- `cfg/config/VNL/` 与 `cfg/config/VNL/deprecated/` 一个字节都不动
- 不碰 `site/`、`assets/`、`módules` 以外的 `.gitignore`（`docs/` 已放行）
- .cfg 注释中文、UTF-8 无 BOM；编辑时不要改动未涉及行的行尾与空白，保持 diff 最小
- 每个 Task 结束必须：跑该 Task 的验证命令 → 确认预期输出 → commit。验证不过禁止进入下一 Task
- 每个 Task 结束时仓库必须处于"可加载"状态：main.cfg 引用的每个路径都存在

---

### Task 0: 捕获重构前基线（对照物）

**Files:**
- Create: `/tmp/cs2cfg-baseline/`（临时目录，不入库）

**Interfaces:**
- Produces: `/tmp/cs2cfg-baseline/{alias_names,bind_keys,exec_refs,menu_echo}.txt`，Task 6 逐一 diff

- [ ] **Step 1: 捕获基线**

```bash
mkdir -p /tmp/cs2cfg-baseline
cd /c/Users/33170/repos/cs2-cfg
# 所有 alias 名（排除 deprecated）
grep -rhoE '^[[:space:]]*alias[[:space:]]+[+-]?[A-Za-z_0-9]+' cfg/config --include='*.cfg' --exclude-dir=deprecated \
  | awk '{print $2}' | sort -u > /tmp/cs2cfg-baseline/alias_names.txt
# 所有 bind 键（binddefaults 不匹配：模式要求 bind 后有空白）
grep -rhoE '^[[:space:]]*bind[[:space:]]+"?[A-Za-z_0-9]+' cfg/config --include='*.cfg' --exclude-dir=deprecated \
  | awk '{print $2}' | tr -d '"' | sort -u > /tmp/cs2cfg-baseline/bind_keys.txt
# 所有活跃 exec 引用（过滤整行注释后取行内 exec）
grep -rn 'exec' cfg/config --include='*.cfg' --exclude-dir=deprecated \
  | grep -vE ':[0-9]+:[[:space:]]*//' \
  | grep -oE 'exec "?[A-Za-z0-9_/]+\.?cfg?' \
  | sed -E 's/exec "?//; s/\.cfg?$//' | sort -u > /tmp/cs2cfg-baseline/exec_refs.txt
# main.cfg 菜单 echo 全文
sed -n '19,68p' cfg/config/main.cfg > /tmp/cs2cfg-baseline/menu_echo.txt
```

- [ ] **Step 2: 确认基线合理**

Run: `wc -l /tmp/cs2cfg-baseline/*.txt && cat /tmp/cs2cfg-baseline/alias_names.txt`
Expected: 4 个文件非空；alias 清单包含 main/pt/solo/demo/kz/cj/cja/cjd/j/ja/jd/jb/vnltest/k/k500/k526/gan/gg/+nClip/-nClip 等，与 AGENTS.md 描述一致

- [ ] **Step 3: 无 commit（仅产生临时对照物）**

---

### Task 1: 创建 settings/ 并迁移 7 个常驻设置模块

**Files:**
- Create: `cfg/config/settings/`（目录）
- Move: `cfg/config/modules/0_network_framedata.cfg` → `cfg/config/settings/network.cfg`（内容不动）
- Move: `cfg/config/modules/1_mouse.cfg` → `cfg/config/settings/mouse.cfg`（内容不动）
- Move: `cfg/config/modules/2_crosshair_viewmodel.cfg` → `cfg/config/settings/crosshair_viewmodel.cfg`（内容不动）
- Move: `cfg/config/modules/3_video.cfg` → `cfg/config/settings/video.cfg`（内容不动）
- Move: `cfg/config/modules/6_basic.cfg` → `cfg/config/settings/basic.cfg`（内容不动）
- Move: `cfg/config/modules/7_audio.cfg` → `cfg/config/settings/audio.cfg`（内容不动）
- Move: `cfg/config/modules/8_hud.cfg` → `cfg/config/settings/hud.cfg`（内容不动）
- Modify: `cfg/config/main.cfg:4-12`

**Interfaces:**
- Produces: `config/settings/{network,mouse,crosshair_viewmodel,video,basic,audio,hud}.cfg` 七个路径，供 main.cfg 引用；`modules/` 内暂留 4_binds.cfg 与 5_buy.cfg（Task 3/4 处理）

- [ ] **Step 1: git mv 七个文件**

```bash
cd /c/Users/33170/repos/cs2-cfg
mkdir -p cfg/config/settings
git mv cfg/config/modules/0_network_framedata.cfg  cfg/config/settings/network.cfg
git mv cfg/config/modules/1_mouse.cfg              cfg/config/settings/mouse.cfg
git mv cfg/config/modules/2_crosshair_viewmodel.cfg cfg/config/settings/crosshair_viewmodel.cfg
git mv cfg/config/modules/3_video.cfg              cfg/config/settings/video.cfg
git mv cfg/config/modules/6_basic.cfg              cfg/config/settings/basic.cfg
git mv cfg/config/modules/7_audio.cfg              cfg/config/settings/audio.cfg
git mv cfg/config/modules/8_hud.cfg                cfg/config/settings/hud.cfg
```

- [ ] **Step 2: 更新 main.cfg 的 exec 清单（settings 7 行排到最前，4_binds/5_buy 暂留 modules 末尾）**

`cfg/config/main.cfg:4-12` 改为（保持原有对齐注释风格）：

```c
exec "config/settings/network.cfg"                 // 网络/帧数据
exec "config/settings/mouse.cfg"                   // 鼠标设置
exec "config/settings/crosshair_viewmodel.cfg"     // 准星&持枪设置
exec "config/settings/video.cfg"                   // 视频设置
exec "config/settings/basic.cfg"                   // 基础设置
exec "config/settings/audio.cfg"                   // 声音设置
exec "config/settings/hud.cfg"                     // HUD设置
exec "config/modules/4_binds.cfg"                  // 键位绑定
exec "config/modules/5_buy.cfg"                    // 快速买枪
```

（settings 整体前移行为等价：cvar 赋值间无顺序依赖；binddefaults 仍先于所有 bind。）

- [ ] **Step 3: 验证 exec 引用无悬空**

```bash
grep -oE 'exec "config/[^"]+' cfg/config/main.cfg | sed 's/exec "//' | while read p; do [ -f "cfg/$p" ] || echo "MISSING: $p"; done
```
Expected: 无输出（全存在）

- [ ] **Step 4: Commit**

```bash
git add -A cfg/
git commit -m "refactor(cfg): move 7 setting modules to config/settings, drop numeric prefixes"
```

---

### Task 2: 投掷物准星 cvar 迁入 crosshair_viewmodel.cfg

**Files:**
- Modify: `cfg/config/modules/4_binds.cfg:55-65`（删除该段）
- Modify: `cfg/config/settings/crosshair_viewmodel.cfg`（尾部追加该段）

**Interfaces:**
- Produces: `cl_grenadecrosshair*` 十个 cvar 现位于 `settings/crosshair_viewmodel.cfg`；4_binds.cfg 后续拆分（Task 3）基于缩减后的内容

- [ ] **Step 1: 从 4_binds.cfg 删除 55-65 行整段**（`//─────────────────────────    游戏内置投掷物准星    ────` 起至 `cl_grenadecrosshairdelay_smoke` 行止，连同其分隔条注释）

- [ ] **Step 2: 在 settings/crosshair_viewmodel.cfg 文件末尾追加以下内容**

```c

//─────────────────────────    游戏内置投掷物准星    ────────────────────────────
cl_grenadecrosshair_decoy          0     // 是否显示诱饵弹准星，默认关闭
cl_grenadecrosshair_explosive      1     // 是否显示雷准星，默认开启
cl_grenadecrosshair_fire           1     // 是否显示燃烧弹准星，默认开启
cl_grenadecrosshair_flash          1     // 是否显示闪光弹准星，默认开启
cl_grenadecrosshair_smoke          1     // 是否显示烟雾弹准星，默认开启
cl_grenadecrosshairdelay_decoy     2.0   // 诱饵弹准星显示时间，默认值2.0
cl_grenadecrosshairdelay_explosive 0.5   // 雷准星显示时间，默认值2.0
cl_grenadecrosshairdelay_fire      0.5   // 燃烧弹准星显示时间，默认值2.0
cl_grenadecrosshairdelay_flash     0.5   // 闪光弹准星显示时间，默认值2.0
cl_grenadecrosshairdelay_smoke     0.2   // 烟雾弹准星显示时间，默认值2.0
```

- [ ] **Step 3: 验证 cvar 全局恰好出现一次**

```bash
grep -rc 'cl_grenadecrosshair' cfg/config --include='*.cfg' | grep -v ':0'
```
Expected: 仅 `cfg/config/settings/crosshair_viewmodel.cfg:10`（旧位置 0 次即不出现）

- [ ] **Step 4: Commit**

```bash
git add -A cfg/
git commit -m "refactor(cfg): move grenade crosshair cvars into crosshair_viewmodel.cfg"
```

---

### Task 3: 拆分 4_binds.cfg → binds/{keys,utility,loaders}.cfg + shared.cfg

**Files:**
- Move: `cfg/config/modules/4_binds.cfg` → `cfg/config/binds/keys.cfg`（git mv 承载历史，再编辑）
- Create: `cfg/config/binds/utility.cfg`
- Create: `cfg/config/binds/loaders.cfg`
- Create: `cfg/config/shared.cfg`
- Modify: `cfg/config/main.cfg`（4_binds 行 → shared + 4 行 binds）

**Interfaces:**
- Consumes: Task 2 缩减后的 4_binds.cfg
- Produces: `config/shared.cfg`（含 `+nClip`/`-nClip`）、`config/binds/{keys,utility,loaders}.cfg` 供 main.cfg 引用；loaders.cfg 本 Task 暂用旧模式路径（`config/pt` 等，仍有效），Task 4 统一改为 `config/modes/*`

- [ ] **Step 1: git mv 并建立目录**

```bash
mkdir -p cfg/config/binds
git mv cfg/config/modules/4_binds.cfg cfg/config/binds/keys.cfg
```

- [ ] **Step 2: 将 keys.cfg 编辑为以下完整内容**

```c
//══════════════════════    键位绑定    ══════════════════════════════════════
binddefaults;                     // 重置所有按键，以防键位冲突，bind指令必须放在之后↓
bind  `      "toggleconsole";     // ` 显示控制台
bind  mouse3 "player_ping";       // 鼠标中键标记位置
bind  z "+voicerecord";      // z 键使用麦克风
bind  ins    "exec config/main.cfg";     // Insert 加载main.cfg
bind  del    "exec config/pt.cfg"; // Delete 加载pt.cfg<跑图cfg>
bind  h      "switchhands";       // H 切换左右手持枪
bind  j      "toggleradarscale";  // J 切换雷达缩放 2个比例请在 hud.cfg 中修改
// bind  y      "clutch_mode_toggle";// Y 切换残局模式 禁止聊天
bind  p      "say_team .drop"     // P 一键发刀
// bind  r      "+reload;say_team 正在换弹中...;" // 换子弹提醒队友（删//开启 如果不怕被T）

bind  backspace "sellbackall";                       // 后退键 退回所有已购买物品
bind  alt    "+nClip";            // 按住alt飞行（alias 定义在 config/shared.cfg）

//─────────────────────────    固定滚轮跳    ──────────────────────────────────
   bind  mwheelup +jump;  
   bind mwheeldown +jump;
//═════════════════════════════════════════════════════════════════════════════
```

（注意两处注释微调：`<8.HUD>` → `hud.cfg`；alt 行注明 alias 来源。`bind del` 路径本 Task 不动，Task 4 改。）

- [ ] **Step 3: 创建 cfg/config/shared.cfg，完整内容**

```c
//══════════════════════    跨模式公共 alias    ══════════════════════════════
// pt.cfg / kz.cfg 会按需重定义 +nClip（kz 版本为 kz_nc），重定义优先于本文件

// 长按穿墙（Noclip）
alias +nClip "noclip"
alias -nClip "noclip"
//═════════════════════════════════════════════════════════════════════════════
```

- [ ] **Step 4: 创建 cfg/config/binds/utility.cfg，完整内容**

```c
//══════════════════════    实用功能键位    ══════════════════════════════════
alias mute   "toggle volume 0 1";                    // 定义mute切换静音(未绑定按键)

//────────────────────     快速切换道具(未开启)    ─────────────────────────────
// bind z "slot8"        // 烟
bind v "slot3; slot7" // 闪（快速双闪）
// bind c "slot6"        // 雷
// bind v "slot10"       // 火
// bind x "slot12"       // 医疗针

//────────────────────    基本投掷物准星（未开启）    ─────────────────────────────
// bind  "mouse4"           "+crosshair_throw";         // "mouse4" 后侧键 可修改
// alias "-crosshair_throw" "exec crosshair.cfg";       // 个人准星参数存放在 "config/settings/crosshair.cfg" 中
// alias "+crosshair_throw" "exec crosshair_throw.cfg"; // 投掷物准星 config/settings/crosshair_throw.cfg

//─────────────────────    快速扔包（未开启）    ────────────────────────────────
// H 键丢包 可修改（没有包会丢出手上的东西）
// bind h +dropbomb
// alias +dropbomb "slot5"
// alias -dropbomb "drop"

//─────────────────────    双键大跳（未开启）    ────────────────────────────────
// C+空格 一起按 → 大跳
// bind c +duck;

//──────────────────────────    跳投（未开启）    ───────────────────────────────
// Q 键跳投 [修改3处 改动按键] 按住鼠标左键后使用 使用一次后需要鼠标水平移动才能再次使用
//bind  q +jumpthrow;
//alias +muteh "unbind q"
//alias -muteh "bind q +jumpthrow"
//alias +jumpthrow "+jump"
//alias -jumpthrow "-attack;+muteh;bind mouse_x combo"
//alias revert "bind mouse_x yaw"
//alias combo  "-jump;revert;-muteh"

// H 右键跳投 [修改3处 改动按键] 使用一次后需要鼠标水平移动才能再次使用
// bind  h +jumpthrow2;
// alias +muteh2 "unbind h"
// alias -muteh2 "bind h +jumpthrow2"
// alias +jumpthrow2 "+jump"
// alias -jumpthrow2 "-attack2;+muteh2;bind mouse_x combo2"
// alias revert "bind mouse_x yaw"
// alias combo2  "-jump;revert;-muteh2"
//═════════════════════════════════════════════════════════════════════════════
```

（唯一内容改动：注释里 `config/modules/crosshair*.cfg` → `config/settings/crosshair*.cfg`，与 Task 1 的目录语义一致。）

- [ ] **Step 5: 创建 cfg/config/binds/loaders.cfg，完整内容（本 Task 保持旧模式路径）**

```c
//══════════════════════    配置加载器    ════════════════════════════════════
// 控制台指令 → 加载对应配置文件（模式 cfg 见 config/modes/，VNL 见 config/VNL/）

alias main   "exec config/main"                             // 指令 main 载入游戏cfg
alias pt     "exec config/pt"                               // 指令 pt 载入跑图cfg
alias pt_help     "exec config/pt_help"                     // 指令 pt_help 载入跑图cfg帮助
alias solo_help   "exec config/solo_help"                   // 指令 solo_help 载入单挑cfg帮助
alias solo   "exec config/solo"                             // 指令 solo 载入单挑cfg
alias demo   "exec config/demo"                             // 指令 demo 载入录像cfg
alias kz     "exec config/kz"                               // 指令kz 加载kz配置

// ──────────────────  VNL Bind  ────────────────────
// alias movement "exec config/VNL/movement"    // 加载公共移动配置
alias cj       "exec config/VNL/cj"          // 加载 CJ / -W 大跳
alias cja      "exec config/VNL/cja"         // 加载 CJ / -W 左旋
alias cjd      "exec config/VNL/cjd"         // 加载 CJ / -W 右旋
alias j        "exec config/VNL/j"           // 加载普通跳跃 / 松 W
alias ja       "exec config/VNL/ja"          // 加载普通跳跃 / 松 W 左旋
alias jd       "exec config/VNL/jd"          // 加载普通跳跃 / 松 W 右旋
alias jb       "exec config/VNL/jb"          // 加载滚轮 JB
alias vnltest  "exec config/VNL/test"        // 加载 VNL 测试配置
//═════════════════════════════════════════════════════════════════════════════
```

- [ ] **Step 6: main.cfg 中 `exec "config/modules/4_binds.cfg"    // 4. 键位绑定` 一行替换为**

```c
exec "config/shared.cfg"                           // 跨模式公共 alias
exec "config/binds/keys.cfg"                       // 键位绑定
exec "config/binds/utility.cfg"                    // 实用功能键位
exec "config/binds/loaders.cfg"                    // 配置加载器
```

- [ ] **Step 7: 验证**

```bash
grep -oE 'exec "config/[^"]+' cfg/config/main.cfg | sed 's/exec "//' | while read p; do [ -f "cfg/$p" ] || echo "MISSING: $p"; done
grep -rc 'alias +nClip' cfg/config --include='*.cfg' | grep -v ':0'
```
Expected: 第一条无输出；第二条 `shared.cfg:1`、`pt.cfg:1`、`kz.cfg:1`（恰好三处，与重构前一致）

- [ ] **Step 8: Commit**

```bash
git add -A cfg/
git commit -m "refactor(cfg): split 4_binds.cfg into binds/{keys,utility,loaders}.cfg and shared.cfg"
```

---

### Task 4: 模式文件迁入 modes/，buy 迁入 binds/，同步全部引用

**Files:**
- Move: `cfg/config/{pt,solo,demo,kz,pt_knife,pt_help,solo_help}.cfg` → `cfg/config/modes/`（7 个，内容除 pt.cfg 两处路径外不动）
- Move: `cfg/config/modules/5_buy.cfg` → `cfg/config/binds/buy.cfg`（内容不动）
- Modify: `cfg/config/binds/loaders.cfg`（6 条 alias 路径）
- Modify: `cfg/config/binds/keys.cfg`（Delete bind 路径）
- Modify: `cfg/config/modes/pt.cfg:30,132`（k、ptinfo 两条 alias 路径）
- Modify: `cfg/config/main.cfg`（5_buy 行 → binds/buy.cfg，位置移到 keys 之后 utility 之前）
- Move 后 `cfg/config/modules/` 目录应为空并删除

**Interfaces:**
- Consumes: Task 3 的 binds/loaders.cfg、binds/keys.cfg
- Produces: 最终目录结构；`config/modes/*` 七个路径；`config/binds/buy.cfg`

- [ ] **Step 1: git mv 八个文件**

```bash
mkdir -p cfg/config/modes
git mv cfg/config/pt.cfg       cfg/config/modes/pt.cfg
git mv cfg/config/solo.cfg     cfg/config/modes/solo.cfg
git mv cfg/config/demo.cfg     cfg/config/modes/demo.cfg
git mv cfg/config/kz.cfg       cfg/config/modes/kz.cfg
git mv cfg/config/pt_knife.cfg cfg/config/modes/pt_knife.cfg
git mv cfg/config/pt_help.cfg  cfg/config/modes/pt_help.cfg
git mv cfg/config/solo_help.cfg cfg/config/modes/solo_help.cfg
git mv cfg/config/modules/5_buy.cfg cfg/config/binds/buy.cfg
```

- [ ] **Step 2: loaders.cfg 六条 alias 改为新路径**

`exec config/pt` → `exec config/modes/pt`；`exec config/pt_help` → `exec config/modes/pt_help`；`exec config/solo_help` → `exec config/modes/solo_help`；`exec config/solo` → `exec config/modes/solo`；`exec config/demo` → `exec config/modes/demo`；`exec config/kz` → `exec config/modes/kz`（`main` 与全部 VNL 路径不动）

- [ ] **Step 3: keys.cfg 的 Delete bind 改为**

```c
bind  del    "exec config/modes/pt.cfg"; // Delete 加载pt.cfg<跑图cfg>
```

- [ ] **Step 4: modes/pt.cfg 两处**

第 30 行 `alias k "exec config/pt_knife.cfg"` → `alias k "exec config/modes/pt_knife.cfg"`
第 132 行 `alias ptinfo "exec config/pt_help.cfg"` → `alias ptinfo "exec config/modes/pt_help.cfg"`

- [ ] **Step 5: main.cfg 中 `exec "config/modules/5_buy.cfg"    // 5. 快速买枪` 一行删除，并在 `exec "config/binds/keys.cfg"` 之后插入**

```c
exec "config/binds/buy.cfg"                        // 快速买枪
```

- [ ] **Step 6: 验证旧路径零残留 + 无悬空**

```bash
grep -rnE 'config/(modules|pt\.cfg|pt[^_a-z]|solo|demo|kz)' cfg/config --include='*.cfg' --exclude-dir=deprecated --exclude-dir=VNL | grep -v 'modes/' | grep 'exec'
ls cfg/config/modules/ 2>/dev/null
grep -oE 'exec "config/[^"]+' cfg/config/main.cfg | sed 's/exec "//' | while read p; do [ -f "cfg/$p" ] || echo "MISSING: $p"; done
```
Expected: 第一条无输出（无 exec 指向旧路径）；第二条目录不存在；第三条无输出

- [ ] **Step 7: Commit**

```bash
git add -A cfg/
git commit -m "refactor(cfg): move mode cfgs to config/modes and buy binds to binds/buy.cfg"
```

---

### Task 5: 菜单 echo 路径提示文字同步（唯一批准的输出变化）

**Files:**
- Modify: `cfg/config/main.cfg:31-50`（仅路径字符串）

**Interfaces:**
- Consumes: Task 4 的 modes/ 结构
- Produces: 与旧版逐字节一致、仅 6 处路径文字不同的菜单输出

- [ ] **Step 1: 精确替换以下 6 处（指令名与对齐空格不动，只改引号内路径）**

```text
"config/pt.cfg"        → "config/modes/pt.cfg"        （pt 行）
"config/pt_help.cfg"   → "config/modes/pt_help.cfg"   （pt_help 行）
"config/solo.cfg"      → "config/modes/solo.cfg"      （solo 行）
"config/solo_help.cfg" → "config/modes/solo_help.cfg" （solo_help 行）
"config/demo.cfg"      → "config/modes/demo.cfg"      （demo 行）
"pt.cfg"（Delete键行，无 config/ 前缀） → "config/modes/pt.cfg"
```

`main` 行、Insert键行、全部 VNL 行、启动项行不动。

- [ ] **Step 2: 验证菜单 diff 仅含路径差异**

```bash
sed -n '19,68p' cfg/config/main.cfg | diff /tmp/cs2cfg-baseline/menu_echo.txt - 
```
Expected: 仅 6 行不同，且每行差异只是 `config/` → `config/modes/` 或补全 `config/modes/` 前缀

- [ ] **Step 3: Commit**

```bash
git add cfg/config/main.cfg
git commit -m "refactor(cfg): update menu echo paths to new layout"
```

---

### Task 6: 全量静态验收

**Files:**
- 无新增/修改（纯验证；发现问题时回到对应 Task 修复）

**Interfaces:**
- Consumes: Task 0 基线 + Task 1-5 产物

- [ ] **Step 1: alias 名单零变化**

```bash
grep -rhoE '^[[:space:]]*alias[[:space:]]+[+-]?[A-Za-z_0-9]+' cfg/config --include='*.cfg' --exclude-dir=deprecated \
  | awk '{print $2}' | sort -u > /tmp/cs2cfg-after-alias.txt
diff /tmp/cs2cfg-baseline/alias_names.txt /tmp/cs2cfg-after-alias.txt && echo ALIAS-OK
```
Expected: `ALIAS-OK`（alias 名单与重构前完全一致）

- [ ] **Step 2: bind 键位零变化**

```bash
grep -rhoE '^[[:space:]]*bind[[:space:]]+"?[A-Za-z_0-9]+' cfg/config --include='*.cfg' --exclude-dir=deprecated \
  | awk '{print $2}' | tr -d '"' | sort -u > /tmp/cs2cfg-after-bind.txt
diff /tmp/cs2cfg-baseline/bind_keys.txt /tmp/cs2cfg-after-bind.txt && echo BIND-OK
```
Expected: `BIND-OK`

- [ ] **Step 3: 全部 exec 引用可解析（含 bind/alias 行内的 exec）**

```bash
grep -rn 'exec' cfg/config --include='*.cfg' --exclude-dir=deprecated \
  | grep -vE ':[0-9]+:[[:space:]]*//' \
  | grep -oE 'exec "?[A-Za-z0-9_/]+\.?cfg?' \
  | sed -E 's/exec "?//; s/\.cfg?$//' | sort -u \
  | while read p; do [ -f "cfg/$p" ] || [ -f "cfg/$p.cfg" ] || echo "MISSING: $p"; done; echo EXEC-CHECK-DONE
```
Expected: 无 MISSING 行，最后输出 `EXEC-CHECK-DONE`；另用 `grep -rn exec cfg/config --include='*.cfg' | grep -vE ':[0-9]+:[[:space:]]*//'` 人工扫一遍，确认没有上面正则漏掉的 exec 写法

- [ ] **Step 4: git 历史连续**

```bash
git log --follow --oneline -- cfg/config/modes/pt.cfg | head -3
git log --follow --oneline -- cfg/config/binds/keys.cfg | head -3
```
Expected: 两个文件的祖先提交包含重构前的历史（pt.cfg 早于本分支的提交；keys.cfg 连到 4_binds.cfg 的历史）

- [ ] **Step 5: 树形结构与 spec 一致**

```bash
find cfg -type f | sort
```
Expected: 与 spec"最终目录结构"一节完全一致（VNL/ 原样、无 modules/ 残留）

---

### Task 7: 文档同步

**Files:**
- Modify: `AGENTS.md`（仓库结构树、加载链、常见改动任务、gitignore 节）
- Modify: `README.md` / `README.en.md`（涉及目录结构与加载链的段落）
- Modify: `CLAUDE.md`（仅当 grep 发现引用旧路径时）

**Interfaces:**
- Consumes: Task 5 完成后的最终结构
- Produces: 文档与实际结构一致

- [ ] **Step 1: 找出全部需要改的文档位置**

```bash
grep -n 'modules\|4_binds\|5_buy\|config/pt\|config/solo\|config/demo\|config/kz\|pt_help\|solo_help\|pt_knife' AGENTS.md README.md README.en.md CLAUDE.md
```

- [ ] **Step 2: 逐处更新。AGENTS.md 需要的替换：**

- 仓库结构树：modules/ 7 文件 + 4_binds/5_buy + 平铺模式文件 → spec 的新树（settings/、binds/{keys,buy,utility,loaders}.cfg、modes/、shared.cfg；`shared.cfg` 注释写"跨模式公共 alias"）
- 加载链第 2 条：`main.cfg 依次 exec 9 个 modules/N_*.cfg（按数字编号 0~8 …）` → `main.cfg 依次 exec settings/ 7 个常驻设置 → shared.cfg → binds/ 4 个键位文件 → VNL/movement.cfg（顺序以 main.cfg 为唯一真源）`
- 「4_binds.cfg 始终先于 VNL 子配置加载（由 main.cfg 第 15 行保证）」→ 相应改写为 binds/loaders.cfg 与 movement.cfg 的加载顺序描述
- 常见改动任务：`在 4_binds.cfg 末尾加对应 alias` → `在 config/binds/loaders.cfg 加对应 alias`；`只改 modules/2_crosshair_viewmodel.cfg` → `只改 settings/crosshair_viewmodel.cfg`；`在 modules/5_buy.cfg 加 bind` → `在 binds/buy.cfg 加 bind`
- gitignore 节补一行：`docs/**`（设计文档与实施计划）
- README / README.en.md 中引用旧路径/结构树的段落按 grep 结果同步；英文版用英文措辞
- VNL 相关节（"movement.cfg 始终先于 VNL 子配置加载（由 main.cfg 第 15 行保证）"）行号若因 main.cfg 增行而变化，改为描述性表述（"由 main.cfg 加载顺序保证"），避免再次硬编码行号

- [ ] **Step 3: 验证文档无旧路径残留**

```bash
grep -rn 'modules/\|4_binds\|config/pt\.cfg\|config/solo\.cfg\|config/demo\.cfg\|config/kz\.cfg' AGENTS.md README.md README.en.md CLAUDE.md
```
Expected: 无输出（site/ 文档若引用则不在本次范围，忽略）

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md README.md README.en.md CLAUDE.md 2>/dev/null; git commit -m "docs: sync structure docs with cfg restructure"
```

---

## 完成后（不在计划内自动执行）

- 用户在 CS2 实机回归：启动加载无报错 → 逐个执行 `main`/`pt`/`solo`/`demo`/`kz`/`cj`/`j`/`jb`/`vnltest` → Insert/Delete 键 → `k` 菜单与 `ptinfo` → 确认菜单输出符合预期
- 实机通过后由用户决定是否合回 main（finishing-a-development-branch 流程）
