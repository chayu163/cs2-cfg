import { useEffect, useRef, useState } from 'react'
import architectureImg from './assets/架构图.png'
import keymapImg from './assets/键位图.png'
import architectureHtml from './assets/architecture.html?url'

const REPO = 'https://github.com/chayu163/cs2-cfg'
const LAUNCH = '-promptperfectworld -coop_fullscreen -nojoy -novid -tickrate 128 +exec config/main.cfg -disable_workshop_command_filtering'
const gh = (path) => `${REPO}/blob/main/${path}`
const sp = (n) => '\u00a0'.repeat(n)

const sceneCommands = [
  ['pt / pt_help', '跑图', 'sv_cheats、无限子弹、轨迹、bots、补道具'],
  ['solo / solo_help', '单挑', '武器别名（ak / awp / usp / …）'],
  ['demo', '录像', 'demoui、播放速度齿轮、录屏预设'],
  ['kz', 'KZ 跑酷', '存点 / 计时 / 回放 / 夜视仪']
]

const vnlCommands = [
  ['cj / cja / cjd', '-w CJ 大跳（无旋 / 左旋 / 右旋）'],
  ['j / ja / jd', '-w 普通跳跃（无旋 / 左旋 / 右旋）'],
  ['jb', '滚轮 JumpBug'],
  ['vnltest', '加载测试占位']
]

const docs = [
  { type: 'MD', title: 'README — 中文', meta: '项目说明 · 快速开始 · 工作流程 · 指令 · 自定义', href: gh('README.md') },
  { type: 'MD', title: 'README — English', meta: 'English overview · quick start · workflow · commands', href: gh('README.en.md') },
  { type: 'MD', title: 'VNL Movement Bind — 维护原则', meta: '目录结构 · 命名规范 · cj / j / jb 配置职责分离', href: gh('cfg/config/VNL/README.md') },
  { type: 'MD', title: 'VNL Bind 大全 — 中文整理', meta: '来源资料整理 · KZ / 身法 bind 参考', href: gh('cfg/config/VNL/VNL_Bind_大全_中文整理.md') },
  { type: 'HTML', title: '架构图 — 交互版', meta: '浅色双栏图版 · 面向打印与讲解', href: architectureHtml },
  { type: 'PNG', title: '键位图', meta: 'assets/键位图.png · 850 × 598', href: keymapImg }
]

function Reveal({ children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal${visible ? ' is-visible' : ''}`}>{children}</div>
}

function CopyButton({ text }) {
  const [label, setLabel] = useState('复制')
  const timer = useRef(null)

  const copy = async () => {
    let ok = false
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        ok = true
      }
    } catch (error) {
      ok = false
    }

    setLabel(ok ? '已复制' : '复制失败')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLabel('复制'), 1400)
  }

  return <button className="copy-btn" type="button" onClick={copy}>{label}</button>
}

function SectionHeading({ kicker, title, children }) {
  return (
    <div className="section-head">
      <div className="section-kicker">{kicker}</div>
      <h2>{title}</h2>
      {children ? <p className="section-lede">{children}</p> : null}
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="#top" aria-label="CS2 CFG Preset 首页">
          <span className="brand-mark">~/</span>
          <span>cs2-cfg<span className="sep"> :</span> preset</span>
        </a>
        <div className="nav-links">
          <a href="#start">快速开始</a>
          <a href="#commands">指令</a>
          <a href="#files">文件地图</a>
          <a href="#docs">文档</a>
          <a href="#keymap">键位图</a>
          <a className="nav-gh" href={REPO} target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </nav>
    </header>
  )
}

function TerminalExample() {
  return (
    <div className="terminal" aria-label="加载序列终端示例">
      <div className="terminal-bar">
        <span className="dot amber"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="path">cs2 — console</span>
      </div>
      <div className="terminal-body">
        <div className="line"><span className="prompt">&gt;</span><span>+exec config/main.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">modules/0_network_framedata.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">modules/2_crosshair_viewmodel.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">modules/4_binds.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">config/VNL/movement.cfg</span></div>
        <div className="line"><span className="prompt">&gt;</span><span>Main CFG 加载成功!</span></div>
        <div className="terminal-note">输入 main / pt / solo / demo / kz 切换场景模式。</div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="kicker">game\csgo\cfg\ · personal preset</div>
          <h1>一套以<span className="accent">文件为中心</span>的 CS2 配置。</h1>
          <p className="hero-sub">
            覆盖日常匹配、跑图训练、单挑对决、录像复盘与 KZ 跑酷。一个文件夹囊括全部设置——控制台随意尝试 bind，一条命令回滚。
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#start">四步开始</a>
            <a className="btn btn-ghost" href={REPO} target="_blank" rel="noopener">查看仓库 ↗</a>
          </div>
        </div>
        <TerminalExample />
      </div>
    </div>
  )
}

function QuickStart() {
  const steps = [
    { num: '01', title: '定位目录', body: <>Steam → 右键 CS2 → 管理 → 浏览本地文件，进入 <code>game\csgo\</code>。</> },
    { num: '02', title: '应用配置', body: <>把仓库的 <code>cfg/</code> 内容复制到 <code>game\csgo\cfg\</code>。根 README 与 assets 不需要。</> },
    { num: '03', title: '设置启动项', body: <>属性 → 通用 → 启动选项，粘贴下方命令。</> },
    { num: '04', title: '启动游戏', body: <>按 <kbd>~</kbd> 输入 <code>main</code>，应看到 Main CFG 加载成功标题。</> }
  ]

  return (
    <section id="start">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker="01 · Quick start" title="四步，从克隆到进图。">
            不需要额外工具、没有构建步骤——配置直接拷贝到本地目录，靠 <code>main</code> 一个命令回滚到文件源状态。
          </SectionHeading>

          <div className="steps">
            {steps.map((step) => (
              <article className="step" key={step.num}>
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="launch">
            <div className="launch-bar">
              <span>steam launch options</span>
              <CopyButton text={LAUNCH} />
            </div>
            <div className="launch-code">{LAUNCH}</div>
          </div>
          <div className="required">+ REQUIRED：+exec config/main.cfg 是入口，缺少它 main/场景模式无法自动加载。</div>
        </Reveal>
      </div>
    </section>
  )
}

function CommandTable({ columns, rows }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="cmd">{row[0]}</td>
              {row.slice(1).map((cell, cellIndex) => (
                <td className="desc" key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Commands() {
  return (
    <section id="commands">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker="02 · Commands" title="控制台输入，即换一套键位。">
            <code>main</code> 是基础模式；其余场景模式都是覆盖层，切换前先 <code>main</code> 回滚再加载新模式。
          </SectionHeading>

          <div className="group-title">场景模式 / 覆盖 main</div>
          <CommandTable columns={['指令', '场景', '说明']} rows={sceneCommands} />

          <div className="group-title">VNL 身法 / MWHEELDOWN 触发</div>
          <CommandTable columns={['指令', '说明']} rows={vnlCommands} />

          <div className="table-note">快捷键：<kbd>Insert</kbd> = 加载 main · <kbd>Delete</kbd> = 加载 pt。</div>
        </Reveal>
      </div>
    </section>
  )
}

function TreeLine({ prefix, children }) {
  return (
    <div>
      <span className="branch">{prefix}</span>
      {children}
    </div>
  )
}

function FileMap() {
  return (
    <section id="files">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker="03 · File map" title="文档与配置都在这棵树里。">
            修改某项设置 = 打开对应文件。文件树中的名字可以直接跳到 GitHub 源码或 README。
          </SectionHeading>

          <div className="tree-grid">
            <div className="tree-block">
              <h3>入口与模式</h3>
              <div className="tree">
                <TreeLine prefix=""><span className="dir">cfg/</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/autoexec.cfg')} target="_blank" rel="noopener">autoexec.cfg</a><span className="comment">// 全局 alias → exec config/main</span></TreeLine>
                <TreeLine prefix={sp(2) + '└─ '}><span className="dir">config/</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/main.cfg')} target="_blank" rel="noopener">main.cfg</a><span className="comment">// 基础配置 / 聚合模块</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/pt.cfg')} target="_blank" rel="noopener">pt.cfg</a><span className="comment">// 跑图</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/solo.cfg')} target="_blank" rel="noopener">solo.cfg</a><span className="comment">// 单挑</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/demo.cfg')} target="_blank" rel="noopener">demo.cfg</a><span className="comment">// 录像</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/kz.cfg')} target="_blank" rel="noopener">kz.cfg</a><span className="comment">// KZ</span></TreeLine>
                <TreeLine prefix={sp(6) + '└─ '}><a href={gh('cfg/config/pt_help.cfg')} target="_blank" rel="noopener">pt_help.cfg</a> · <a href={gh('cfg/config/solo_help.cfg')} target="_blank" rel="noopener">solo_help.cfg</a></TreeLine>
              </div>
            </div>

            <div className="tree-block">
              <h3>modules 与 VNL</h3>
              <div className="tree">
                <TreeLine prefix=""><span className="branch">config/modules/ · 编号 0–8 决定加载顺序</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/0_network_framedata.cfg')} target="_blank" rel="noopener">0_network_framedata.cfg</a><span className="comment">// 网络 / 帧数据</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/1_mouse.cfg')} target="_blank" rel="noopener">1_mouse.cfg</a><span className="comment">// 鼠标</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/2_crosshair_viewmodel.cfg')} target="_blank" rel="noopener">2_crosshair_viewmodel.cfg</a><span className="comment">// 准星 / 持枪</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/4_binds.cfg')} target="_blank" rel="noopener">4_binds.cfg</a><span className="comment">// 键位 / 切换 alias</span></TreeLine>
                <TreeLine prefix={sp(2) + '└─ '}><a href={gh('cfg/config/VNL/README.md')} target="_blank" rel="noopener">VNL/README.md</a><span className="comment">// KZ / 身法维护原则</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/VNL/movement.cfg')} target="_blank" rel="noopener">movement.cfg</a><span className="comment">// A/D 公共 alias</span></TreeLine>
                <TreeLine prefix={sp(6) + '└─ '}><a href={gh('cfg/config/VNL/VNL_Bind_大全_中文整理.md')} target="_blank" rel="noopener">VNL_Bind_大全_中文整理.md</a><span className="comment">// 来源资料整理</span></TreeLine>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
function Architecture() {
  return (
    <section id="architecture">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker="04 · Architecture" title="加载链一眼看清。">
            main.cfg 按编号顺序 exec 子模块，最后加载 VNL 公共移动 alias；场景模式与模块 4 的切换 alias 相连。
          </SectionHeading>

          <figure className="figure">
            <img src={architectureImg} alt="CS2 CFG 架构图：autoexec → main → modules 0-8 与 VNL 的加载关系" />
            <figcaption className="figure-caption">
              <span>assets/架构图.png · 2299 × 1300</span>
              <a href={architectureHtml} target="_blank" rel="noopener">打开交互版 ↗</a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Docs() {
  return (
    <section id="docs">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker="05 · Documents" title="从这里进入文档。">
            中文 / 英文 README、VNL 维护说明与键位图，按文件类型聚合在一起。
          </SectionHeading>

          <div className="doc-list">
            {docs.map((doc) => (
              <a className="doc-row" href={doc.href} target="_blank" rel="noopener" key={doc.title}>
                <span className="doc-type">{doc.type}</span>
                <span>
                  <span className="doc-title">{doc.title}</span>
                  <span className="doc-meta">{doc.meta}</span>
                </span>
                <span className="doc-arrow">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Keymap() {
  return (
    <section id="keymap">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker="06 · Keymap" title="键位全景。">
            mouse / bind / mode 切换的现状图，右键更换 assets/键位图.png 即可同步更新本页与 README。
          </SectionHeading>

          <figure className="figure">
            <img src={keymapImg} alt="CS2 CFG 键位图：鼠标、键盘与模式切换绑定" />
            <figcaption className="figure-caption">
              <span>assets/键位图.png · 850 × 598</span>
              <a href={keymapImg} target="_blank" rel="noopener">在新标签打开 ↗</a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ fontSize: 14 }}>
              <span className="brand-mark">~/</span>
              <span>cs2-cfg<span className="sep"> :</span> preset</span>
            </div>
            <p style={{ marginTop: 18, maxWidth: 440 }}>
              个人自用精简版 CS2 配置合集。基础方案 fork 自{' '}
              <a href="https://github.com/Purple-CSGO/CS2-Config-Presets" target="_blank" rel="noopener" style={{ color: 'var(--amber-bright)' }}>
                Purple-CSGO / CS2-Config-Presets
              </a>
              ，经二次精简与改造。
            </p>
            <div className="footer-links">
              <a href={REPO} target="_blank" rel="noopener">GitHub 仓库 ↗</a>
              <a href={gh('README.md')} target="_blank" rel="noopener">中文 README ↗</a>
              <a href={gh('README.en.md')} target="_blank" rel="noopener">English README ↗</a>
            </div>
          </div>
          <div>
            <div className="section-kicker" style={{ marginBottom: 12 }}>commit {'&'} push</div>
            <div className="footer-code">git add . {'&&'} git commit -m "描述本次修改" {'&&'} git push</div>
            <p style={{ marginTop: 14 }}>仓库只跟踪 autoexec.cfg、config/**、assets/** 与两份 README。</p>
          </div>
        </div>
        <div className="credit">
          <span>CS2 CFG Preset · 非官方个人配置，与 Valve 无关联。</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <QuickStart />
        <Commands />
        <FileMap />
        <Architecture />
        <Docs />
        <Keymap />
      </main>
      <Footer />
    </>
  )
}