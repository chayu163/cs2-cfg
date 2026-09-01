import { createContext, useContext, useEffect, useRef, useState } from 'react'
import architectureImg from './assets/架构图.png'
import keymapImg from './assets/键位图.png'
import architectureHtml from './assets/architecture.html?url'

const REPO = 'https://github.com/chayu163/cs2-cfg'
const LAUNCH = '-promptperfectworld -coop_fullscreen -nojoy -novid -tickrate 128 +exec config/main.cfg -disable_workshop_command_filtering'
const gh = (path) => `${REPO}/blob/main/${path}`
const sp = (n) => '\u00a0'.repeat(n)

const CONTENT = {
  zh: {
    htmlLang: 'zh-CN',
    htmlTitle: 'CS2 CFG Preset — 以文件为中心的配置',
    brand: 'cs2-cfg : preset',
    nav: {
      quickStart: '快速开始',
      commands: '指令',
      files: '文件地图',
      docs: '文档',
      keymap: '键位图',
      github: 'GitHub ↗',
      ariaLabel: '主导航',
      langSwitch: '语言切换',
      zhLabel: '中文',
      enLabel: 'English',
      skipLink: '跳到主要内容'
    },
    hero: {
      kicker: 'game\\csgo\\cfg\\ · 个人配置',
      titlePre: '一套以',
      titleAccent: '文件为中心',
      titlePost: '的 CS2 配置。',
      sub: '覆盖日常匹配、跑图训练、单挑对决、录像复盘与 KZ 跑酷。一个文件夹囊括全部设置——控制台随意尝试 bind，一条命令回滚。',
      primary: '四步开始',
      secondary: '查看仓库 ↗',
      terminalTitle: 'cs2 — console',
      success: 'Main CFG 加载成功!',
      note: '输入 main / pt / solo / demo / kz 切换场景模式。'
    },
    start: {
      kicker: '01 · Quick start',
      title: '四步，从克隆到进图。',
      lede: <>不需要额外工具、没有构建步骤——配置直接拷贝到本地目录，靠 <code>main</code> 一个命令回滚到文件源状态。</>,
      steps: [
        { num: '01', title: '定位目录', body: <>Steam → 右键 CS2 → 管理 → 浏览本地文件，进入 <code>game\csgo\</code>。</> },
        { num: '02', title: '应用配置', body: <>把仓库的 <code>cfg/</code> 内容复制到 <code>game\csgo\cfg\</code>。根 README 与 assets 不需要。</> },
        { num: '03', title: '设置启动项', body: <>属性 → 通用 → 启动选项，粘贴下方命令。</> },
        { num: '04', title: '启动游戏', body: <>按 <kbd>~</kbd> 输入 <code>main</code>，应看到 Main CFG 加载成功标题。</> }
      ],
      launchTitle: 'steam launch options',
      required: '+ REQUIRED：+exec config/main.cfg 是入口，缺少它 main/场景模式无法自动加载。'
    },
    commands: {
      kicker: '02 · Commands',
      title: '控制台输入，即换一套键位。',
      lede: <><code>main</code> 是基础模式；其余场景模式都是覆盖层，切换前先 <code>main</code> 回滚再加载新模式。</>,
      scenarioTitle: '场景模式 / 覆盖 main',
      scenarioColumns: ['指令', '场景', '说明'],
      scenarioRows: [
        ['pt / pt_help', '跑图', 'sv_cheats、无限子弹、轨迹、bots、补道具'],
        ['solo / solo_help', '单挑', '武器别名（ak / awp / usp / …）'],
        ['demo', '录像', 'demoui、播放速度齿轮、录屏预设'],
        ['kz', 'KZ 跑酷', '存点 / 计时 / 回放 / 夜视仪']
      ],
      vnlTitle: 'VNL 身法 / MWHEELDOWN 触发',
      vnlColumns: ['指令', '说明'],
      vnlRows: [
        ['cj / cja / cjd', '-w CJ 大跳（无旋 / 左旋 / 右旋）'],
        ['j / ja / jd', '-w 普通跳跃（无旋 / 左旋 / 右旋）'],
        ['jb', '滚轮 JumpBug'],
        ['vnltest', '加载测试占位']
      ],
      note: <>快捷键：<kbd>Insert</kbd> = 加载 main · <kbd>Delete</kbd> = 加载 pt。</>
    },
    files: {
      kicker: '03 · File map',
      title: '文档与配置都在这棵树里。',
      lede: '修改某项设置 = 打开对应文件。文件树中的名字可以直接跳到 GitHub 源码或 README。',
      entryTitle: '入口与模式',
      modulesTitle: 'modules 与 VNL',
      modulesHeader: 'config/modules/ · 编号 0–8 决定加载顺序',
      comments: {
        autoexec: '全局 alias → exec config/main',
        main: '基础配置 / 聚合模块',
        pt: '跑图',
        solo: '单挑',
        demo: '录像',
        kz: 'KZ',
        net: '网络 / 帧数据',
        mouse: '鼠标',
        crosshair: '准星 / 持枪',
        binds: '键位 / 切换 alias',
        vnlReadme: 'KZ / 身法维护原则',
        movement: 'A/D 公共 alias',
        bindNotes: '来源资料整理'
      }
    },
    architecture: {
      kicker: '04 · Architecture',
      title: '加载链一眼看清。',
      lede: 'main.cfg 按编号顺序 exec 子模块，最后加载 VNL 公共移动 alias；场景模式与模块 4 的切换 alias 相连。',
      caption: 'assets/架构图.png · 2299 × 1300',
      link: '打开交互版 ↗'
    },
    docs: {
      kicker: '05 · Documents',
      title: '从这里进入文档。',
      lede: '中文 / 英文 README、VNL 维护说明与键位图，按文件类型聚合在一起。',
      items: [
        { type: 'MD', title: 'README — 中文', meta: '项目说明 · 快速开始 · 工作流程 · 指令 · 自定义' },
        { type: 'MD', title: 'README — English', meta: 'English overview · quick start · workflow · commands' },
        { type: 'MD', title: 'VNL Movement Bind — 维护原则', meta: '目录结构 · 命名规范 · cj / j / jb 配置职责分离' },
        { type: 'MD', title: 'VNL Bind 大全 — 中文整理', meta: '来源资料整理 · KZ / 身法 bind 参考' },
        { type: 'HTML', title: '架构图 — 交互版', meta: '浅色双栏图版 · 面向打印与讲解' },
        { type: 'PNG', title: '键位图', meta: 'assets/键位图.png · 850 × 598' }
      ]
    },
    keymap: {
      kicker: '06 · Keymap',
      title: '键位全景。',
      lede: 'mouse / bind / mode 切换的现状图，右键更换 assets/键位图.png 即可同步更新本页与 README。',
      caption: 'assets/键位图.png · 850 × 598',
      link: '在新标签打开 ↗'
    },
    footer: {
      description: <>个人自用精简版 CS2 配置合集。基础方案 fork 自{' '}<a href="https://github.com/Purple-CSGO/CS2-Config-Presets" target="_blank" rel="noopener" style={{ color: 'var(--amber-bright)' }}>Purple-CSGO / CS2-Config-Presets</a>，经二次精简与改造。</>,
      repo: 'GitHub 仓库 ↗',
      zhReadme: '中文 README ↗',
      enReadme: 'English README ↗',
      commitKicker: 'commit & push',
      tracked: '仓库跟踪 cfg/autoexec.cfg、cfg/config/**、assets/**、README、site/** 与 mise.toml；自动生成的 .cfg、录像、缓存不会入库。',
      credit: 'CS2 CFG Preset · 非官方个人配置，与 Valve 无关联。'
    }
  },
  en: {
    htmlLang: 'en',
    htmlTitle: 'CS2 CFG Preset — a file-centric CS2 config',
    brand: 'cs2-cfg : preset',
    nav: {
      quickStart: 'Get started',
      commands: 'Commands',
      files: 'File map',
      docs: 'Docs',
      keymap: 'Keymap',
      github: 'GitHub ↗',
      ariaLabel: 'Main navigation',
      langSwitch: 'Language',
      zhLabel: '中文',
      enLabel: 'English',
      skipLink: 'Skip to content'
    },
    hero: {
      kicker: 'game\\csgo\\cfg\\ · personal preset',
      titlePre: 'A ',
      titleAccent: 'file-centric',
      titlePost: ' Counter-Strike 2 config.',
      sub: 'Covers daily matches, practice, 1v1 duels, demo review, and KZ. One folder holds your whole setup—freely try binds in the console, roll back with a single command.',
      primary: 'Get started',
      secondary: 'View repository ↗',
      terminalTitle: 'cs2 — console',
      success: 'Main CFG loaded successfully!',
      note: 'Type main / pt / solo / demo / kz to switch modes.'
    },
    start: {
      kicker: '01 · Quick start',
      title: 'Four steps, from clone to match.',
      lede: <>No extra tools or build steps—copy the config into your local folder and roll back to the file-source state with <code>main</code>.</>,
      steps: [
        { num: '01', title: 'Locate folder', body: <>Steam → right-click CS2 → Manage → Browse local files → enter <code>game\csgo\</code>.</> },
        { num: '02', title: 'Apply preset', body: <>Copy the repo’s <code>cfg/</code> into <code>game\csgo\cfg\</code>. You don’t need the root README or assets.</> },
        { num: '03', title: 'Set launch options', body: <>Properties → General → Launch options, paste the command below.</> },
        { num: '04', title: 'Launch game', body: <>Press <kbd>~</kbd>, type <code>main</code>, and see the Main CFG loaded banner.</> }
      ],
      launchTitle: 'steam launch options',
      required: '+ REQUIRED: +exec config/main.cfg is the entry point—without it, main/scenario modes won’t auto-load.'
    },
    commands: {
      kicker: '02 · Commands',
      title: 'One command, one keymap.',
      lede: <><code>main</code> is the base mode; the other modes are overlays. Reset with <code>main</code> before switching.</>,
      scenarioTitle: 'Scenario modes / overlay main',
      scenarioColumns: ['Command', 'Scenario', 'Description'],
      scenarioRows: [
        ['pt / pt_help', 'Practice', 'sv_cheats, infinite ammo, trajectory, bots, refill'],
        ['solo / solo_help', '1v1 duel', 'Weapon aliases (ak / awp / usp / …)'],
        ['demo', 'Demo review', 'demoui, playback-speed gears, recording presets'],
        ['kz', 'KZ', 'Checkpoints / timer / replay / NVGs']
      ],
      vnlTitle: 'VNL movement / MWHEELDOWN trigger',
      vnlColumns: ['Command', 'Description'],
      vnlRows: [
        ['cj / cja / cjd', '-w CJ bunny hop (no/left/right strafe)'],
        ['j / ja / jd', '-w plain jump (no/left/right strafe)'],
        ['jb', 'Wheel JumpBug'],
        ['vnltest', 'Load the test stub']
      ],
      note: <>Hotkeys: <kbd>Insert</kbd> = load main · <kbd>Delete</kbd> = load pt.</>
    },
    files: {
      kicker: '03 · File map',
      title: 'Docs and configs in one tree.',
      lede: 'Edit a setting = open the matching file. Tree entries link straight to GitHub source or README.',
      entryTitle: 'Entry & scenarios',
      modulesTitle: 'modules & VNL',
      modulesHeader: 'config/modules/ · numbered 0–8 determines load order',
      comments: {
        autoexec: 'global aliases → exec main',
        main: 'base preset / aggregate modules',
        pt: 'practice',
        solo: '1v1 duel',
        demo: 'demo review',
        kz: 'KZ',
        net: 'network / frame data',
        mouse: 'mouse',
        crosshair: 'crosshair / viewmodel',
        binds: 'binds / mode aliases',
        vnlReadme: 'KZ / movement principles',
        movement: 'shared A/D aliases',
        bindNotes: 'source notes'
      }
    },
    architecture: {
      kicker: '04 · Architecture',
      title: 'The load chain at a glance.',
      lede: 'main.cfg execs modules in numeric order, then loads VNL movement aliases; scenario modes connect through the aliases in module 4.',
      caption: 'assets/architecture.png · 2299 × 1300',
      link: 'Open interactive ↗'
    },
    docs: {
      kicker: '05 · Documents',
      title: 'Enter the docs from here.',
      lede: 'Chinese / English README, VNL maintenance notes, and the keymap, grouped by file type.',
      items: [
        { type: 'MD', title: 'README — 中文', meta: 'Overview · quick start · workflow · commands · customize' },
        { type: 'MD', title: 'README — English', meta: 'English overview · quick start · workflow · commands' },
        { type: 'MD', title: 'VNL Movement Bind — principles', meta: 'Directory layout · naming · cj / j / jb separation' },
        { type: 'MD', title: 'VNL Bind 大全 — Chinese notes', meta: 'Source notes · KZ / movement bind reference' },
        { type: 'HTML', title: 'Architecture — interactive', meta: 'Light two-column layout · print & walkthrough' },
        { type: 'PNG', title: 'Keymap', meta: 'assets/键位图.png · 850 × 598' }
      ]
    },
    keymap: {
      kicker: '06 · Keymap',
      title: 'The whole keymap.',
      lede: 'Current mouse / bind / mode switching map. Replace assets/键位图.png to update this page and the README.',
      caption: 'assets/键位图.png · 850 × 598',
      link: 'Open in new tab ↗'
    },
    footer: {
      description: <>A slimmed-down personal CS2 config preset. Base preset forked from{' '}<a href="https://github.com/Purple-CSGO/CS2-Config-Presets" target="_blank" rel="noopener" style={{ color: 'var(--amber-bright)' }}>Purple-CSGO / CS2-Config-Presets</a>, then trimmed and adapted.</>,
      repo: 'GitHub repository ↗',
      zhReadme: '中文 README ↗',
      enReadme: 'English README ↗',
      commitKicker: 'commit & push',
      tracked: 'The repo tracks cfg/autoexec.cfg, cfg/config/**, assets/**, READMEs, site/**, and mise.toml; auto-generated .cfg files, demos, and caches stay ignored.',
      credit: 'CS2 CFG Preset · Unofficial personal config, not affiliated with Valve.'
    }
  }
}
const LanguageContext = createContext({ lang: 'zh', setLang: () => {}, t: CONTENT.zh })

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('cs2-lang') === 'en' ? 'en' : 'zh'
    } catch (error) {
      return 'zh'
    }
  })

  useEffect(() => {
    const meta = CONTENT[lang]
    document.documentElement.lang = meta.htmlLang
    document.title = meta.htmlTitle
    try {
      localStorage.setItem('cs2-lang', lang)
    } catch (error) {
      /* ignore */
    }
  }, [lang])

  const value = { lang, setLang, t: CONTENT[lang] }
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function useLang() {
  return useContext(LanguageContext)
}

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
  const { lang } = useLang()
  const [label, setLabel] = useState(lang === 'zh' ? '复制' : 'Copy')
  const timer = useRef(null)

  useEffect(() => {
    setLabel(lang === 'zh' ? '复制' : 'Copy')
  }, [lang])

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

    setLabel(ok ? (lang === 'zh' ? '已复制' : 'Copied') : (lang === 'zh' ? '复制失败' : 'Copy failed'))
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLabel(lang === 'zh' ? '复制' : 'Copy'), 1400)
  }

  return <button className="copy-btn" type="button" onClick={copy} aria-live="polite">{label}</button>
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
  const { lang, setLang, t } = useLang()

  return (
    <header className="site-header">
      <a className="skip-link" href="#top">{t.nav.skipLink}</a>
      <nav className="nav" aria-label={t.nav.ariaLabel}>
        <a className="brand" href="#top" aria-label={t.brand}>
          <span className="brand-mark">~/</span>
          <span>cs2-cfg<span className="sep"> :</span> preset</span>
        </a>
        <div className="nav-links">
          <a href="#start">{t.nav.quickStart}</a>
          <a href="#commands">{t.nav.commands}</a>
          <a href="#files">{t.nav.files}</a>
          <a href="#docs">{t.nav.docs}</a>
          <a href="#keymap">{t.nav.keymap}</a>
          <div className="lang-switch" role="group" aria-label={t.nav.langSwitch}>
            <button type="button" className={lang === 'zh' ? 'is-active' : ''} aria-pressed={lang === 'zh'} aria-label={t.nav.zhLabel} onClick={() => setLang('zh')}>中</button>
            <button type="button" className={lang === 'en' ? 'is-active' : ''} aria-pressed={lang === 'en'} aria-label={t.nav.enLabel} onClick={() => setLang('en')}>EN</button>
          </div>
          <a className="nav-gh" href={REPO} target="_blank" rel="noopener">{t.nav.github}</a>
        </div>
      </nav>
    </header>
  )
}

function TerminalExample() {
  const { t } = useLang()

  return (
    <div className="terminal" aria-label={t.hero.terminalTitle}>
      <div className="terminal-bar">
        <span className="dot amber"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="path">{t.hero.terminalTitle}</span>
      </div>
      <div className="terminal-body">
        <div className="line"><span className="prompt">&gt;</span><span>+exec config/main.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">modules/0_network_framedata.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">modules/2_crosshair_viewmodel.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">modules/4_binds.cfg</span></div>
        <div className="line"><span className="ok">ok</span><span className="dim">config/VNL/movement.cfg</span></div>
        <div className="line"><span className="prompt">&gt;</span><span>{t.hero.success}</span></div>
        <div className="terminal-note">{t.hero.note}</div>
      </div>
    </div>
  )
}

function Hero() {
  const { t } = useLang()

  return (
    <div className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="kicker">{t.hero.kicker}</div>
          <h1>{t.hero.titlePre}<span className="accent">{t.hero.titleAccent}</span>{t.hero.titlePost}</h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#start">{t.hero.primary}</a>
            <a className="btn btn-ghost" href={REPO} target="_blank" rel="noopener">{t.hero.secondary}</a>
          </div>
        </div>
        <TerminalExample />
      </div>
    </div>
  )
}
function QuickStart() {
  const { t } = useLang()
  const start = t.start

  return (
    <section id="start">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={start.kicker} title={start.title}>
            {start.lede}
          </SectionHeading>

          <div className="steps">
            {start.steps.map((step) => (
              <article className="step" key={step.num}>
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="launch">
            <div className="launch-bar">
              <span>{start.launchTitle}</span>
              <CopyButton text={LAUNCH} />
            </div>
            <div className="launch-code" tabIndex={0} aria-label={start.launchTitle}>{LAUNCH}</div>
          </div>
          <div className="required">{start.required}</div>
        </Reveal>
      </div>
    </section>
  )
}

function CommandTable({ columns, rows, label }) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label={label}>
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
  const { t } = useLang()
  const commands = t.commands

  return (
    <section id="commands">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={commands.kicker} title={commands.title}>
            {commands.lede}
          </SectionHeading>

          <div className="group-title">{commands.scenarioTitle}</div>
          <CommandTable columns={commands.scenarioColumns} rows={commands.scenarioRows} label={commands.scenarioTitle} />

          <div className="group-title">{commands.vnlTitle}</div>
          <CommandTable columns={commands.vnlColumns} rows={commands.vnlRows} label={commands.vnlTitle} />

          <div className="table-note">{commands.note}</div>
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
  const { t } = useLang()
  const f = t.files

  return (
    <section id="files">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={f.kicker} title={f.title}>
            {f.lede}
          </SectionHeading>

          <div className="tree-grid">
            <div className="tree-block">
              <h3>{f.entryTitle}</h3>
              <div className="tree">
                <TreeLine prefix=""><span className="dir">cfg/</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/autoexec.cfg')} target="_blank" rel="noopener">autoexec.cfg</a><span className="comment">{"// " + f.comments.autoexec}</span></TreeLine>
                <TreeLine prefix={sp(2) + '└─ '}><span className="dir">config/</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/main.cfg')} target="_blank" rel="noopener">main.cfg</a><span className="comment">{"// " + f.comments.main}</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/pt.cfg')} target="_blank" rel="noopener">pt.cfg</a><span className="comment">{"// " + f.comments.pt}</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/solo.cfg')} target="_blank" rel="noopener">solo.cfg</a><span className="comment">{"// " + f.comments.solo}</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/demo.cfg')} target="_blank" rel="noopener">demo.cfg</a><span className="comment">{"// " + f.comments.demo}</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/kz.cfg')} target="_blank" rel="noopener">kz.cfg</a><span className="comment">{"// " + f.comments.kz}</span></TreeLine>
                <TreeLine prefix={sp(6) + '└─ '}><a href={gh('cfg/config/pt_help.cfg')} target="_blank" rel="noopener">pt_help.cfg</a> · <a href={gh('cfg/config/solo_help.cfg')} target="_blank" rel="noopener">solo_help.cfg</a></TreeLine>
              </div>
            </div>

            <div className="tree-block">
              <h3>{f.modulesTitle}</h3>
              <div className="tree">
                <TreeLine prefix=""><span className="branch">{f.modulesHeader}</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/0_network_framedata.cfg')} target="_blank" rel="noopener">0_network_framedata.cfg</a><span className="comment">{"// " + f.comments.net}</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/1_mouse.cfg')} target="_blank" rel="noopener">1_mouse.cfg</a><span className="comment">{"// " + f.comments.mouse}</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/2_crosshair_viewmodel.cfg')} target="_blank" rel="noopener">2_crosshair_viewmodel.cfg</a><span className="comment">{"// " + f.comments.crosshair}</span></TreeLine>
                <TreeLine prefix={sp(2) + '├─ '}><a href={gh('cfg/config/modules/4_binds.cfg')} target="_blank" rel="noopener">4_binds.cfg</a><span className="comment">{"// " + f.comments.binds}</span></TreeLine>
                <TreeLine prefix={sp(2) + '└─ '}><a href={gh('cfg/config/VNL/README.md')} target="_blank" rel="noopener">VNL/README.md</a><span className="comment">{"// " + f.comments.vnlReadme}</span></TreeLine>
                <TreeLine prefix={sp(6) + '├─ '}><a href={gh('cfg/config/VNL/movement.cfg')} target="_blank" rel="noopener">movement.cfg</a><span className="comment">{"// " + f.comments.movement}</span></TreeLine>
                <TreeLine prefix={sp(6) + '└─ '}><a href={gh('cfg/config/VNL/VNL_Bind_大全_中文整理.md')} target="_blank" rel="noopener">VNL_Bind_大全_中文整理.md</a><span className="comment">{"// " + f.comments.bindNotes}</span></TreeLine>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
function Architecture() {
  const { t } = useLang()
  const a = t.architecture

  return (
    <section id="architecture">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={a.kicker} title={a.title}>
            {a.lede}
          </SectionHeading>

          <figure className="figure">
            <img src={architectureImg} alt="CS2 CFG 架构图：autoexec → main → modules 0-8 与 VNL 的加载关系" width={2299} height={1300} style={{ aspectRatio: "2299 / 1300" }} loading="lazy" decoding="async" />
            <figcaption className="figure-caption">
              <span>{a.caption}</span>
              <a href={architectureHtml} target="_blank" rel="noopener">{a.link}</a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Docs() {
  const { t } = useLang()
  const docsContent = t.docs
  const docHrefs = [
    gh('README.md'),
    gh('README.en.md'),
    gh('cfg/config/VNL/README.md'),
    gh('cfg/config/VNL/VNL_Bind_大全_中文整理.md'),
    architectureHtml,
    keymapImg
  ]

  return (
    <section id="docs">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={docsContent.kicker} title={docsContent.title}>
            {docsContent.lede}
          </SectionHeading>

          <div className="doc-list">
            {docsContent.items.map((doc, index) => (
              <a className="doc-row" href={docHrefs[index]} target="_blank" rel="noopener" key={doc.title}>
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
  const { t } = useLang()
  const k = t.keymap

  return (
    <section id="keymap">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={k.kicker} title={k.title}>
            {k.lede}
          </SectionHeading>

          <figure className="figure">
            <img src={keymapImg} alt="CS2 CFG 键位图：鼠标、键盘与模式切换绑定" width={850} height={598} style={{ aspectRatio: "850 / 598" }} loading="lazy" decoding="async" />
            <figcaption className="figure-caption">
              <span>{k.caption}</span>
              <a href={keymapImg} target="_blank" rel="noopener">{k.link}</a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const { t, lang } = useLang()
  const f = t.footer

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ fontSize: 14 }}>
              <span className="brand-mark">~/</span>
              <span>cs2-cfg<span className="sep"> :</span> preset</span>
            </div>
            <p style={{ marginTop: 18, maxWidth: 440 }}>{f.description}</p>
            <div className="footer-links">
              <a href={REPO} target="_blank" rel="noopener">{f.repo}</a>
              <a href={gh('README.md')} target="_blank" rel="noopener">{f.zhReadme}</a>
              <a href={gh('README.en.md')} target="_blank" rel="noopener">{f.enReadme}</a>
            </div>
          </div>
          <div>
            <div className="section-kicker" style={{ marginBottom: 12 }}>{f.commitKicker}</div>
            <div className="footer-code" tabIndex={0} aria-label={f.commitKicker}>git add . {'&&'} git commit -m {lang === 'zh' ? '"描述本次修改"' : '"describe the change"'} {'&&'} git push</div>
            <p style={{ marginTop: 14 }}>{f.tracked}</p>
          </div>
        </div>
        <div className="credit">
          <span>{f.credit}</span>
        </div>
      </div>
    </footer>
  )
}

function Site() {
  return (
    <>
      <SiteHeader />
      <main id="top" tabIndex={-1}>
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

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  )
}