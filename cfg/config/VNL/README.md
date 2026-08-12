# VNL Bind Configuration

基于 VNL 输入机制的 CS2 KZ Movement Bind 配置。

本目录用于整理、维护和加载 KZ 环境下的 VNL Movement Bind。
配置以不操作 `mouse_x` / `mouse_y` 的无争议 Bind 为基础，
并按照跳跃方式、-W 行为以及横向输入方向进行区分。

---

## 目录结构

```text
VNL/
├── movement.cfg
│
├── cj.cfg
├── cja.cfg
├── cjd.cfg
│
├── j.cfg
├── ja.cfg
├── jd.cfg
│
├── jb.cfg
│
├── test.cfg
├── README.md
├── VNL_Bind_大全_中文整理.md
│
└── deprecated/
    ├── cj.cfg
    ├── CS2VNL.cfg
    ├── jb.cfg
    └── nulls.cfg
```

| 配置           | 功能                   |
| -------------- | ---------------------- |
| `movement.cfg` | 公共移动配置           |
| `cj.cfg`       | CJ / -W 大跳           |
| `cja.cfg`      | CJ / -W 大跳 / 左旋    |
| `cjd.cfg`      | CJ / -W 大跳 / 右旋    |
| `j.cfg`        | 普通跳跃 / 松 W        |
| `ja.cfg`       | 普通跳跃 / 松 W / 左旋 |
| `jd.cfg`       | 普通跳跃 / 松 W / 右旋 |
| `jb.cfg`       | 滚轮JumpBug            |
| `test.cfg`     | 测试配置               |

其中：

- `movement.cfg` 为公共配置，不属于某一种具体跳跃方式。
- 全部采用下滚轮 `MWHEELDOWN`触发
- `cj*` 为 CJ 系列。
- `j*` 为普通跳跃系列。
- `jb.cfg` 为独立的 JumpBug 配置。
- `deprecated/` 用于保存已经弃用的历史配置。

# 维护原则

VNL 配置遵循以下原则：

1. 公共逻辑集中管理。
2. 不重复定义公共 A/D 移动 Alias。
3. CJ 与普通跳跃保持独立。
4. 左旋与右旋使用明确的文件后缀区分。
5. 滚轮统一使用鼠标下滚轮。
6. 正式配置与测试配置分离。
7. 已弃用方案移入 `deprecated/`。
8. 不在正式配置中混入未经验证的实验性 Bind。
9. 配置实际行为以对应 `.cfg` 文件为准。

------

## 版本说明

本目录中的配置为当前 VNL Movement Bind 方案。

README 用于记录配置结构、命名规则、依赖关系及使用边界。

具体按键、Alias、执行顺序以及输入行为，
 以对应 `.cfg` 文件的实际内容为最终准则。