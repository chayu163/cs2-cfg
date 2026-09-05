# cfg 配置层语义化重构设计

- 日期：2026-09-05
- 状态：已批准（设计阶段），待写实施计划
- 范围：仅 `cfg/` 游戏配置层；`site/`、`assets/` 不碰

## 背景与动机

当前 cfg 层存在四类结构问题：

1. **`modules/4_binds.cfg` 职责混杂**：核心键位、全部模式切换 alias、VNL 加载 alias、投掷物准星 cvar（非键位）、注释状态的可选功能块堆在同一个文件。
2. **数字编号固化顺序**：modules/0~8 的编号是加载顺序的冗余元数据，插入新模块需要重排序号；顺序的真源本来就是 `main.cfg` 的 exec 列表。
3. **重复定义**：`+nClip`/`-nClip` alias 在 `4_binds.cfg`、`pt.cfg`、`kz.cfg` 定义了 3 次。
4. **模式文件散落在 config/ 根目录**：4 个模式 cfg 与其附属文件（pt_knife / pt_help / solo_help）和主文件混在一起，没有"常驻"与"按需加载"的目录区分。

用户诉求：结构"不优雅但能用"，本次在**使用体验完全不变**的前提下重组内部结构。

## 目标

- 目录按语义分层：常驻设置 / 键位 / 模式 / 公共 alias / VNL 五类一目了然
- 每个文件单一职责；加载顺序只在 `main.cfg` 一处表达
- 消除跨文件的重复 alias 定义
- 控制台指令、按键绑定、启动项、ASCII 菜单与帮助输出**全部保持不变**（唯一例外见"菜单路径文字"）

## 非目标

- 不做模式退出时的 cvar 状态自动还原（方案 C 已否决：会改变使用行为，且 Source 引擎 alias 快照脆弱）
- 不动 `site/`、`assets/`、`.gitignore` 白名单结构（`cfg/config/**` 天然兼容新目录）
- 不改 `cfg/config/VNL/` 内部任何内容（有自己的 README 维护体系）
- 不新增任何功能或指令

## 固定不变项（硬约束）

| 项 | 原因 |
|---|---|
| `cfg/autoexec.cfg` 路径与内容 | 引擎固定入口 + 项目边界（AGENTS.md） |
| `cfg/config/main.cfg` 路径 | 启动项 `+exec config/main.cfg` 依赖 |
| 所有控制台指令名（main/pt/solo/demo/kz/cj/cja/cjd/j/ja/jd/jb/vnltest/k/k500~k526/gan/gg/tk/notk/mute/refundall/+pwaswitchknife/+nClip/+Pucci…） | 用户肌肉记忆 |
| 所有按键绑定（含 Insert→main、Delete→pt） | 用户肌肉记忆 |
| main.cfg 的 ASCII 大字与菜单 echo 内容 | 控制台输出体验（路径提示文字除外，见下） |
| pt_help / solo_help / pt_knife 的菜单输出 | 同上 |

## 最终目录结构

```
cfg/
├── autoexec.cfg                      # 不动（固定入口，含 pwaswitchknife/refundall）
└── config/
    ├── main.cfg                      # 路径不动 → 唯一加载清单 + 菜单输出
    ├── shared.cfg                    # 新建：跨模式公共 alias（+nClip/-nClip）
    ├── settings/                     # 常驻 cvar 设置（原 modules 去数字前缀）
    │   ├── network.cfg               # ← modules/0_network_framedata.cfg
    │   ├── mouse.cfg                 # ← modules/1_mouse.cfg
    │   ├── crosshair_viewmodel.cfg   # ← modules/2_crosshair_viewmodel.cfg（+ 投掷物准星 cvar）
    │   ├── video.cfg                 # ← modules/3_video.cfg
    │   ├── basic.cfg                 # ← modules/6_basic.cfg
    │   ├── audio.cfg                 # ← modules/7_audio.cfg
    │   └── hud.cfg                   # ← modules/8_hud.cfg
    ├── binds/                        # 键位层（拆自 4_binds.cfg + 5_buy.cfg）
    │   ├── keys.cfg                  # binddefaults + 基础键位（含 Insert/Delete、滚轮跳）
    │   ├── buy.cfg                   # ← modules/5_buy.cfg
    │   ├── utility.cfg               # mute/双闪 bind + 注释状态的可选功能块
    │   └── loaders.cfg               # 模式切换 + VNL 加载 alias
    ├── modes/                        # 模式全家桶
    │   ├── pt.cfg  solo.cfg  demo.cfg  kz.cfg
    │   └── pt_knife.cfg  pt_help.cfg  solo_help.cfg
    └── VNL/                          # 原样不动
```

## main.cfg 加载清单（新）

```c
// ──────────────────  加载清单  ────────────────────
// 常驻设置
exec "config/settings/network.cfg"
exec "config/settings/mouse.cfg"
exec "config/settings/crosshair_viewmodel.cfg"
exec "config/settings/video.cfg"
exec "config/settings/basic.cfg"
exec "config/settings/audio.cfg"
exec "config/settings/hud.cfg"
// 跨模式公共 alias
exec "config/shared.cfg"
// 键位
exec "config/binds/keys.cfg"        // 开头保留 binddefaults
exec "config/binds/buy.cfg"
exec "config/binds/utility.cfg"
exec "config/binds/loaders.cfg"
// VNL 基础（必须先于任何 VNL 子配置被调用时存在）
exec "config/VNL/movement.cfg"
```

**顺序语义与行为等价**：原顺序为 modules 0~8（binds 在 buy 前）+ VNL/movement。cvar 赋值之间无顺序依赖，settings 整体前移不影响结果；`binddefaults` 仍在所有 bind 之前执行；bind/alias 相对顺序保持原样（keys 先于 buy，同原 4→5）。菜单 echo 部分保持在加载清单之后，内容除路径文字外逐字节不变。

## 迁移映射（4_binds.cfg 拆分明细）

| 原位置（modules/4_binds.cfg） | 去向 |
|---|---|
| 1-14 行：binddefaults + 基础键位 + Insert/Delete | `binds/keys.cfg` |
| 16-19 行：+nClip/-nClip alias 定义 | `shared.cfg`（alt 键的 bind 留在 keys.cfg；pt/kz 内的重定义保留不动） |
| 21 行：mute alias；50 行：双闪 bind | `binds/utility.cfg` |
| 22-42 行：main/pt/pt_help/solo_help/solo/demo/kz + 全部 VNL 加载 alias | `binds/loaders.cfg` |
| 44-46 行：滚轮跳 bind | `binds/keys.cfg` |
| 55-65 行：投掷物准星 cvar（cl_grenadecrosshair*） | `settings/crosshair_viewmodel.cfg` 尾部分区 |
| 67-99 行：注释的可选功能块（跳投/扔包/大跳等） | `binds/utility.cfg`，注释状态原样保留 |

其余整文件移动：modules/0~3、6~8 → `settings/` 去编号同名；modules/5_buy.cfg → `binds/buy.cfg`；pt/solo/demo/kz/pt_knife/pt_help/solo_help → `modes/`。新建 `shared.cfg`（含注释说明 pt/kz 会按需重定义 +nClip）。全部使用 `git mv` 保留历史。

## 引用同步清单（全部活跃 exec 引用）

| 位置 | 现值 | 新值 |
|---|---|---|
| main.cfg 4-12 行 | `config/modules/N_*.cfg` ×9 | `config/settings/*.cfg` ×7 + `config/binds/{keys,buy,utility,loaders}.cfg` + `config/shared.cfg` |
| loaders.cfg（原 4_binds 22-27 行） | `config/{pt,pt_help,solo_help,solo,demo}` | `config/modes/*`（`main` 不变） |
| loaders.cfg（原 42 行） | `config/kz` | `config/modes/kz` |
| loaders.cfg VNL alias（原 31-40 行） | `config/VNL/*` | 路径不变，仅换所在文件 |
| keys.cfg（原 6 行 Insert bind） | `config/main.cfg` | 不变 |
| keys.cfg（原 7 行 Delete bind） | `config/pt.cfg` | `config/modes/pt.cfg` |
| modes/pt.cfg 30 行 `k` alias | `config/pt_knife.cfg` | `config/modes/pt_knife.cfg` |
| modes/pt.cfg 132 行 `ptinfo` alias | `config/pt_help.cfg` | `config/modes/pt_help.cfg` |
| autoexec.cfg | `exec config/main` | 不变 |
| main.cfg 15 行 | `config/VNL/movement.cfg` | 不变 |

## 菜单路径文字（唯一批准的输出变化）

main.cfg 菜单 echo 中引用的路径文字（如 `pt 加载跑图配置"config/pt.cfg"`）同步为新路径（`config/modes/pt.cfg` 等），避免提示失效路径。指令名、对齐格式、其余文字不变。

## 验证计划

1. **静态核对**：重构后 `grep -rn "exec " cfg/` 全量列出引用，逐一核对目标文件存在；确认无指向 `modules/` 或 config 根目录旧模式文件的残留引用（deprecated/ 除外）。
2. **等价核对**：重构前后各生成两份清单并逐条对照——控制台指令清单（所有 alias 名）、按键清单（所有 bind 键）；确认零增删改。
3. **菜单输出核对**：main.cfg / pt_help / solo_help / pt_knife 的 echo 行与原版 diff，仅允许路径文字差异。
4. **git 历史核对**：`git log --follow` 确认迁移文件历史连续。
5. **实机验证**（用户执行）：CS2 启动加载 main 无报错，逐个执行 main/pt/solo/demo/kz/cj/j/jb 及 Insert/Delete 键确认行为不变。

## 文档同步

- `AGENTS.md`：仓库结构树、加载链描述、"常见改动任务"中的文件路径与工作流（如"在 4_binds.cfg 末尾加 alias"→"在 binds/loaders.cfg 加"）
- `README.md` / `README.en.md`：目录结构、加载链、菜单相关描述
- `.gitignore`：无需修改（`cfg/config/**` 覆盖新目录）；另需放行 `docs/`（本 spec 提交所需）

## 风险与回滚

- 主要风险是 exec 路径遗漏同步 → 靠验证计划第 1 步静态核对兜底
- cvar/alias 在 settings 与 binds 之间的移动若存在隐藏的读写顺序依赖会导致行为差异 → 已按"binddefaults 最先、bind/alias 相对序不变"原则规避，实施时逐文件核对
- 回滚：整个重构为单分支内的一组 git mv + 内容编辑，`git revert` 或分支丢弃即可完全回滚
