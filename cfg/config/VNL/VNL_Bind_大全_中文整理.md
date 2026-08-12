# VNL Bind 大全

> 根据提供的 VNL Bind 资料整理为中文版本。
>
> 来源·：https://docs.google.com/document/u/0/d/10FU22VLNa0cUlMEh2bBbRhnEzQxigm3pAcigNZ9K0mw/mobilebasic?tab=t.c3ksblarljbs&_immersive_translate_auto_translate=1
>
> - 依赖 `reset` 的绑定默认使用 `W` 作为 reset 键，也可以替换为任意按键。
> - 滚轮绑定默认使用鼠标上滚轮。
> - Insta-Strafe 默认使用左横移；如需右横移，将 `+left` 改为 `+right`。
> - 本文不介绍 `.vtest` 方法。

---

## 一、无争议绑定

以下绑定不包含对 `mouse_x` 或 `mouse_y` 的操作。

### 1. AD 移动绑定

防止移动时卡住：

```cfg
alias +a "+left";
alias -a "left -999 0 0";
alias +d "+right";
alias -d "right -999 0 0";
bind a +a;
bind d +d;
```

### 2. 滚轮 - W 长跳（CJ）

```cfg
alias +j "jump 1 0 0";
alias -j "jump -999 0 0";
alias lj "jump 1 0 0;bind mouse_wheel -j";
alias +tick "duck 1 0 0";
alias -tick "forward -999 0 0;bind mwheelup +tick1";
alias +tick1 "duck -999 0 0";
alias -tick1 "jump -999 0 0;bind mwheelup +j";

alias +reset "+forward;bind mwheelup +tick;bind mouse_wheel lj";
alias -reset "-forward";
bind w +reset;
```

### 3. 滚轮 - W 长跳（无 CJ）

```cfg
alias lj "jump -999 0 0"
alias +tick "jump 1 0 0"
alias -tick "forward -999 0 0"
bind mwheelup +tick
bind mouse_wheel lj
```

### 4. 滚轮 - W Insta-Strafe 长跳（CJ，左横移）

```cfg
alias +j "jump 1 0 0";
alias -j "jump -999 0 0";
alias lj "jump 1 0 0;bind mouse_wheel lj1";
alias lj1 "+left;bind mouse_wheel -j";
alias +tick "duck 1 0 0";
alias -tick "forward -999 0 0;bind mwheelup +tick1";
alias +tick1 "duck -999 0 0";
alias -tick1 "jump -999 0 0;bind mwheelup +j";

alias +reset "+forward;bind mwheelup +tick;bind mouse_wheel lj";
alias -reset "-forward";
bind w +reset;

alias +a "+left";
alias -a "left -999 0 0";
alias +d "+right";
alias -d "right -999 0 0";
bind a +a;
bind d +d;
```

### 5. 滚轮 - W Insta-Strafe 长跳（无 CJ，左横移）

```cfg
alias +j "jump 1 0 0"
alias -j "jump -999 0 0"
alias lj "+left;bind mouse_wheel -j"
alias +tick "jump 1 0 0"
alias -tick "forward -999 0 0;bind mwheelup +j"

alias +reset "+forward;bind mwheelup +tick;bind mouse_wheel lj"
alias -reset "-forward"
bind w +reset

alias +a "+left"
alias -a "left -999 0 0"
alias +d "+right"
alias -d "right -999 0 0"
bind a +a
bind d +d
```

### 6. 滚轮 JB

```cfg
alias +j "jump 1 0 0";
alias -j "jump -999 0 0";
alias +tick "duck 1 0 0";
alias -tick "bind mwheelup +tick1";
alias +tick1 "duck -999 0 0";
alias -tick1 "jump 1 0 0;bind mwheelup +j";

alias +reset "+forward;bind mwheelup +tick";
alias -reset "-forward";
bind w +reset;
```

---

## 二、有争议绑定

以下绑定可能包含对 `mouse_x` 或 `mouse_y` 的操作，因此更接近脚本式绑定。

资料指出：这些绑定不会导致游戏封禁，但属于有争议的绑定，部分服务器可能禁止使用。

### 1. Nulls

> **官方 CS2KZ 插件禁止 Nulls，使用 Nulls 会导致被踢出服务器。**

```cfg
bind a +mleft
bind d +mright

alias pl moveleft
alias pr moveright
alias ml def_1
alias mr def_1

alias +mleft "pl;alias mr moveleft"
alias +mright "pr;alias ml moveright"
alias -mleft "ml;alias mr def_1"
alias -mright "mr;alias ml def_1"

alias moveleft "rightleft -1 0 0"
alias moveright "rightleft 1 0 0"
alias def_1 "rightleft 0 0 0"
```

#### Nulls + Insta-Strafe

如果使用 Nulls，需要将原本的：

```cfg
alias +a "+left"
alias -a "left -999 0 0"
alias +d "+right"
alias -d "right -999 0 0"
bind a +a
bind d +d
```

替换为对应的：

```cfg
rightleft -1 0 0
rightleft 1 0 0
```

并删除上述 `+a` / `-a` / `+d` / `-d` 绑定。

### 2. 按键 - W 长跳（CJ）

```cfg
alias +lj "duck 1 0 0;bind mouse_y lj1"
alias -lj "duck -999 0 0;bind mouse_y lj3"
alias lj1 "jump 1 0 0;bind mouse_y lj2"
alias lj2 "forward -999 0 0;bind mouse_y pitch"
alias lj3 "jump -999 0 0;bind mouse_y pitch"
bind key +lj
```

> 不会提供一致的完整 Pre 和 -W。

### 3. 按键 - W 长跳（无 CJ）

```cfg
alias +lj "jump 1 0 0;bind mouse_y lj"
alias -lj "jump -999 0 0"
alias lj "forward -999 0 0;bind mouse_y pitch"
bind key +lj
```

> 不会提供一致的 -W。

### 4. 按键 - W Insta-Strafe 长跳（CJ，左横移）

```cfg
alias +lj "duck 1 0 0;bind mouse_y lj1"
alias -lj "duck -999 0 0;bind mouse_y lj4"
alias lj1 "jump 1 0 0;bind mouse_y lj2"
alias lj2 "forward -999 0 0;bind mouse_y lj3"
alias lj3 "+left;bind mouse_y lj4"
alias lj4 "jump -999 0 0;bind mouse_y pitch"
bind key +lj

alias +a "+left"
alias -a "left -999 0 0"
alias +d "+right"
alias -d "right -999 0 0"
bind a +a
bind d +d
```

> 不会提供一致的完整 Pre、-W 和第一次横移。

### 5. 按键 - W Insta-Strafe 长跳（无 CJ，左横移）

```cfg
alias +lj "jump 1 0 0;bind mouse_y lj1"
alias -lj "jump -999 0 0"
alias lj1 "forward -999 0 0;bind mouse_y lj2"
alias lj2 "+left;bind mouse_y pitch"
bind key +lj

alias +a "+left"
alias -a "left -999 0 0"
alias +d "+right"
alias -d "right -999 0 0"
bind a +a
bind d +d
```

> 不会提供一致的 -W 和第一次横移。

### 6. 双键 JB

```cfg
alias jb "duck -999 0 0;bind mouse_y jb1"
alias jb1 "jump 1 0 0;bind mouse_y jb2"
alias jb2 "jump -999 0 0; bind mouse_y pitch"
bind key jb
```

> 相比滚轮 JB，可能无法获得 Perf JB，并且一致性更低。

### 7. 单键 JB

```cfg
alias +jb "duck 1 0 0;bind mouse_y jb1"
alias -jb "duck -999 0 0;bind mouse_y jb1"
alias jb1 "jump 1 0 0;bind mouse_y jb2"
alias jb2 "jump -999 0 0; bind mouse_y pitch"
bind key +jb
```

> 相比滚轮 JB，可能无法获得 Perf JB，并且一致性更低。

---

## 三、快速选择

| 类型 | CJ | Insta-Strafe | 方式 | 备注 |
|---|---|---|---|---|
| W 长跳 | 是 | 否 | W + 滚轮 | 无争议 |
| W 长跳 | 否 | 否 | 滚轮 | 无争议 |
| W Insta-Strafe 长跳 | 是 | 是 | W + 滚轮 | 默认左横移 |
| W Insta-Strafe 长跳 | 否 | 是 | W + 滚轮 | 默认左横移 |
| 滚轮 JB | — | — | W + 滚轮 | 无争议 |
| 按键 W 长跳 | 是 | 否 | 自定义按键 | `mouse_y` |
| 按键 W 长跳 | 否 | 否 | 自定义按键 | `mouse_y` |
| 按键 W Insta-Strafe | 是 | 是 | 自定义按键 | `mouse_y` |
| 按键 W Insta-Strafe | 否 | 是 | 自定义按键 | `mouse_y` |
| 双键 JB | — | — | 自定义按键 | `mouse_y` |
| 单键 JB | — | — | 自定义按键 | `mouse_y` |
| Nulls | — | — | A / D | 官方 CS2KZ 插件禁止 |

---

## 四、说明

- `CJ`：资料中的 Crouch Jump（蹲跳）版本。
- `-W`：通过解除前进输入实现的长跳相关绑定。
- `Insta-Strafe`：自动加入横向移动，本文默认左横移。
- `Scroll`：使用鼠标滚轮触发。
- `Key`：使用指定按键触发，原资料中的 `key` 需要替换为实际按键。
- `mouse_y`：部分按键绑定会动态修改鼠标 Y 输入，因此归入有争议绑定。
- 使用 Nulls 时，需要按照 Nulls 部分修改 Insta-Strafe。
- 官方 CS2KZ 插件禁止 Nulls，资料明确说明使用后会被踢出服务器。
- 有争议绑定可能被部分服务器限制。
- 本文不包含 `.vtest` 方法。
