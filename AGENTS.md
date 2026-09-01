# CS2 CFG Preset

> Counter-Strike 2 个人自用配置组合。基础方案 fork 自 [Purple-CSGO/CS2-Config-Presets](https://github.com/Purple-CSGO/CS2-Config-Presets)，经二次精简、改造而来。
> 跨项目全局规则（PowerShell 偏好、文件写出、shell 例外）见 `~/.claude/CLAUDE.md`，不在此重复。

## 项目性质

- **类型**：CS2 客户端 .cfg 配置合集 + `site/` 独立网站子项目（Vite + React 19）。游戏配置层没有构建/测试/lint 流水线；`site/` 有独立的开发/构建命令
- **用户**：个人自用精简版本
- **语言**：全部 .cfg 文件（Source 引擎脚本），注释中文，文件编码 UTF-8 无 BOM
- **运行环境**：CS2 客户端 `game\csgo\cfg\` 目录下，通过启动项 `+exec config/main.cfg` 加载

## 仓库结构

```
.
├── .gitignore                             # 白名单式忽略规则（默认全忽略，按需放行）
├── CLAUDE.md                              # Claude Code 专属，@AGENTS.md 继承本文件
├── AGENTS.md                              # 项目级 agent 指令
├── README.md                              # 中文 README（默认入口）
├── README.en.md                           # 英文 README
├── mise.toml                              # mise 运行时配置：node = "22.23.1"
├── assets/                                # 静态资源（架构图、键位图）
│   ├── architecture.html                  # 架构图 HTML 版
│   ├── 架构图.png
│   └── 键位图.png
├── cfg/                                   # 游戏配置（被 .gitignore 白名单跟踪）
│   ├── autoexec.cfg                       # 入口：定义全局 alias 后 exec config/main
│   └── config/
│       ├── main.cfg                       # 主流：exec 加载所有 modules/* + VNL/movement + 输出菜单
│       ├── kz.cfg                         # KZ 模式：跑酷计时、存点、回放、夜视仪
│       ├── pt.cfg                         # 跑图练习：sv_cheats 1 + 无限子弹 + 投掷物预览
│       ├── solo.cfg                       # 单挑模式：武器库 alias + 热身设定
│       ├── demo.cfg                       # 录像复盘：demoui、播放速度齿轮、录屏预设
│       ├── pt_knife.cfg                   # 跑图子模式：k数字 换刀
│       ├── pt_help.cfg                    # 跑图 ASCII 双栏菜单
│       ├── solo_help.cfg                  # solo 双栏菜单
│       ├── modules/                       # 主配置子模块（编号 0~8，按 main.cfg 顺序加载）
│       │   ├── 0_network_framedata.cfg    # 网络/帧数据遥测
│       │   ├── 1_mouse.cfg                # 鼠标灵敏度/视角
│       │   ├── 2_crosshair_viewmodel.cfg  # 准星 + 持枪视角（主控）
│       │   ├── 3_video.cfg                # 亮度
│       │   ├── 4_binds.cfg                # 键位 + VNL/PT/solo 切换 alias + 投掷物准星
│       │   ├── 5_buy.cfg                  # 快速买枪（半甲沙鹰 / 全甲烟闪）
│       │   ├── 6_basic.cfg                # 控制台、FPS、语音、击杀预测、教学
│       │   ├── 7_audio.cfg                # 音量、耳机 EQ、透视校正
│       │   └── 8_hud.cfg                  # 队伍颜色、雷达、HUD 缩放
│       └── VNL/                           # VNL Movement Bind（KZ/身法用）
│           ├── README.md                  # 维护原则、目录结构、命名规范
│           ├── VNL_Bind_大全_中文整理.md  # 来源资料中文整理
│           ├── movement.cfg               # 公共 A/D 移动 alias（防 Insta-Strafe 卡住）
│           ├── cj.cfg                     # CJ / -W 大跳（无 Insta-Strafe）
│           ├── cja.cfg                    # CJ / -W 大跳 / 左旋（Insta-Strafe）
│           ├── cjd.cfg                    # CJ / -W 大跳 / 右旋（Insta-Strafe）
│           ├── j.cfg                      # 普通跳跃 / 松 W
│           ├── ja.cfg                     # 普通跳跃 / 松 W / 左旋
│           ├── jd.cfg                     # 普通跳跃 / 松 W / 右旋
│           ├── jb.cfg                     # 滚轮 JumpBug
│           ├── test.cfg                   # 测试占位
│           └── deprecated/                # 历史弃用配置（保留供参考，不加载）
│               ├── cj.cfg
│               ├── CS2VNL.cfg
│               ├── jb.cfg
│               └── nulls.cfg
└── site/                                  # 独立 React + Vite 欢迎页/文档站（不参与游戏加载）
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                        # 页面结构与文案（中英双语切换）
        ├── main.jsx
        ├── styles.css                     # 样式与动效
        └── assets/                        # 网站静态资源
```

## 加载与运行

仓库的**游戏配置部分没有构建/测试/lint** 步骤，配置直接拷贝到 `game\csgo\cfg\` 目录使用。

网站子项目（`site/`）单独开发与构建：

```bash
cd site
mise exec npm ci
mise exec npm run dev    # 本地预览
mise exec npm run build  # 生产构建（输出 dist/，不提交）
```

**CS2 启动项（README 第 39-49 行）**：
```
-promptperfectworld -coop_fullscreen -nojoy -novid -tickrate 128 +exec config/main.cfg -disable_workshop_command_filtering
```

**控制台模式切换指令**（控制台按 `~` 输入）：
- `main` / `pt` / `solo` / `demo` / `pt_help` / `solo_help` 加载对应配置
- `cj` / `cja` / `cjd` / `j` / `ja` / `jd` / `jb` / `vnltest` 加载 VNL 移动 bind
- `kz` 加载 KZ 模式
- **Insert 键**：加载 `main.cfg`；**Delete 键**：加载 `pt.cfg`

## 关键架构约定

### 加载链
1. `autoexec.cfg` 定义 `+pwaswitchknife` / `refundall` alias，再 `exec config/main`
2. `main.cfg` 依次 `exec` 9 个 `modules/N_*.cfg`（按数字编号 0~8 决定加载顺序），最后 `exec config/VNL/movement.cfg`
3. 模式 cfg（`pt`/`solo`/`demo`/`kz`）互相独立，通过 alias 在控制台/键位调用

### 切换模式的实现
每个模式 cfg 末尾都通过 `echo` 输出 ASCII 艺术标题 + 指令/键位对照表（双栏使用 `┏┇┗╋` Unicode 制表字符）。`pt_help.cfg` / `solo_help.cfg` / `pt_knife.cfg` 单独提供更详细的双栏菜单（仅 `echo`，无执行逻辑）。

### VNL Bind 体系（KZ 身法核心）
- **触发键**：全部 `MWHEELDOWN`（鼠标下滚轮）
- **公共 alias**：`movement.cfg` 定义的 `+a`/`-a`/`+d`/`-d` 防止 Insta-Strafe 时卡住
- **配置职责分离**：
  - `cj*` = CJ（Crouch Jump）系列
  - `j*` = 普通跳跃系列
  - `jb*` = JumpBug（独立）
  - `*a` / `*d` 后缀 = 左旋 / 右旋（Insta-Strafe）
- **`movement.cfg` 始终先于 VNL 子配置加载**（由 `main.cfg` 第 15 行保证）
- **详见 `cfg/config/VNL/README.md`** 的维护原则

### 命名/格式约定
- .cfg 文件注释中文，行内 `// 单行注释` 或 `//═════...══` 分隔条
- `alias` 定义惯例：`alias <name> "<cmd1>;<cmd2>"`（分号串接多命令）
- 菜单输出用 `echo` 大量行首对齐（双栏依赖列宽，需保持 ASCII 字符宽度）
- 暂时关闭的功能统一前置 `//`，README 和各文件头部均有"未开启功能删除前面的 `//` 即可开启"提示

### gitignore 规则
`.gitignore` 默认全忽略，仅跟踪：
- `README.md` / `README.en.md`
- `assets/**`
- `cfg/autoexec.cfg`
- `cfg/config/**`
- `mise.toml`
- `site/**`（排除 `site/node_modules/`、`site/dist/`）
- `CLAUDE.md` / `AGENTS.md`（项目级上下文文档，与代码同步入库）

游戏自动生成的 .cfg、录像、缓存，以及网站的依赖和构建产物都不会进版本库。`cfg/config/VNL/deprecated/` 通过 `**` 隐式跟踪（保留历史参考）。

## 常见改动任务

- **新增模式 cfg**（如 prefire / retake）：在 `cfg/config/` 下建文件，`main.cfg` 加一行 `echo 指令名 描述"路径.cfg"`，并在 `4_binds.cfg` 末尾加对应 `alias`
- **调整准星/持枪**：只改 `modules/2_crosshair_viewmodel.cfg`（demo 模式有独立准星在 `demo.cfg` 第 60-87 行）
- **新增买枪绑定**：在 `modules/5_buy.cfg` 加 `bind`，参考 https://config.upup.cool/v2/ 的购买代码
- **修改 VNL bind**：先读 `cfg/config/VNL/README.md` 维护原则，再动对应 .cfg；改完跑 `vnltest` 验证（test.cfg 当前是空文件）
- **更新键位图**：替换 `assets/键位图.png`，README 末尾的 `<img>` 引用会自动取新图
- **网站页面/文案**：改 `site/src/App.jsx`（含中英双语切换逻辑与文案）
- **网站样式/动效**：改 `site/src/styles.css`
- **网站静态资源**：放 `site/src/assets/`；构建用 `mise exec npm run build`，产物 `site/dist/` 不提交

## Boundaries

- **不**改 `autoexec.cfg` 的 `exec config/main`（这是固定入口）
- **不**删 `cfg/config/VNL/deprecated/` 内容（保留为历史参考）
- **不**在 `pt_help.cfg` / `solo_help.cfg` / `pt_knife.cfg` 加执行逻辑（这些文件只负责 `echo` 菜单）
- **不**把模块的 `exec` 顺序搞乱（modules/ 编号 0~8 的顺序由 `main.cfg` 第 4-12 行固化，0 在前 8 在后）
- **不**向 `cfg/` 游戏配置层加构建系统/lint/test；`site/` 的 Vite 构建保留，但 `site/dist/`、`site/node_modules/` 不提交
