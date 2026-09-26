import { SignalItem } from "@/types/signal";

export const INITIAL_SIGNALS: SignalItem[] = [
  {
    id: "sig-1790354544215-roif",
    title: "Your Transformer Can Hold Two Thoughts at Once: Evidence of Linear Superposition in LLMs",
    titleZh: "大模型线性叠加实证：Transformer 可在单一前向传播中同时容纳双重思考路径",
    summary:
      "While LLMs rely on non-linear activations, research demonstrates fundamental linearity in latent activations, allowing models to superimpose and process parallel semantic computations simultaneously.",
    summaryZh:
      "机制可解释性前沿研究证实，大模型内部激活空间存在基本线性叠加特性，能够在同一前向计算中解耦并并行处理多个语义子空间的独立思维计算。",
    whyItMatters:
      "Demonstrates that neural networks exhibit multi-threaded, parallel cognitive representations beneath discrete token outputs. This breaks traditional sequential-only assumptions, providing mechanistic evidence for deep latent-space implicit reasoning—a cornerstone of autonomous Superintelligence.",
    whyItMattersZh:
      "证明了神经网络在离散词表之下，潜伏着多线程并行认知与概念叠加的内部表征。这打破了传统单序列计算的假定，为模型实现深层潜空间隐式推理（Latent Reasoning）提供了理论基石。",
    source: {
      name: "arXiv / HuggingFace",
      url: "https://arxiv.org/abs/2609.29845",
      domain: "arxiv.org",
    },
    timestamp: "2026-09-26T00:42:24Z",
    dateLabel: "TODAY",
    dateLabelZh: "今日",
    isSignal: true,
    tags: ["REASONING", "MODELS"],
    weeklyPick: true,
  },
  {
    id: "sig-1790354544216-rgyx",
    title: "Rufus-Air: An Open LLM Post-Training Recipe for 106B Models Across Eight Reasoning Stages",
    titleZh: "Rufus-Air 开源后训练配方：106B 模型八阶段强化学习与自主推理全流程复现",
    summary:
      "A fully open and reproducible post-training pipeline for GLM-4.5-Air-Base (106B), detailing SFT, Reasoning Reinforcement Learning, Code Synthesis, and cognitive alignment.",
    summaryZh:
      "全流程开源可复现的 106B 基座后训练方案，完整公开了涵盖 SFT、推理强化学习（Reasoning RL）与认知对齐的八阶段工业级训练流水线。",
    whyItMatters:
      "Shatters the closed-lab monopoly on o1-like reasoning reinforcement learning recipes. By making the multi-stage reasoning RL pipeline open, it allows the broader community to inspect and accelerate long-horizon self-deliberation dynamics without billion-dollar gatekeeping.",
    whyItMattersZh:
      "打破了闭源实验室对 o1-like 推理强化学习（Reasoning RL）核心配方的黑盒封锁。通过全流程开源，使得学术界和开源社区能够低成本自主复现并加速长链条推理演化过程。",
    source: {
      name: "arXiv / HuggingFace",
      url: "https://arxiv.org/abs/2609.29421",
      domain: "arxiv.org",
    },
    timestamp: "2026-09-26T00:42:24Z",
    dateLabel: "TODAY",
    dateLabelZh: "今日",
    isSignal: true,
    tags: ["REASONING", "MODELS"],
    weeklyPick: true,
  },
  {
    id: "sig-1790354544217-tuur",
    title: "Neural Spectral Capacity: Designing Architectures from Network Specification Alone",
    titleZh: "神经谱容量理论：仅凭网络拓扑规格即可预先度量与设计 Transformer 架构表达极限",
    summary:
      "Spectral graph theory applied to network topology calculates representational expressivity directly from specifications, bypassing millions of GPU-hours of brute-force training trial-and-error.",
    summaryZh:
      "引入谱图理论度量架构信息吞吐与表达容量，摆脱了以往必须消耗数百万 GPU 时暴力训练才能评估新型注意力和架构优劣的经验主义瓶颈。",
    whyItMatters:
      "Shifts the design of synthetic neural architectures from empirical capital expenditure (FLOPs brute force) to rigorous mathematical topology priors, fundamentally accelerating the convergence rate of next-generation compute brains.",
    whyItMattersZh:
      "将超智能架构设计从高昂的资本试错（FLOPs 蛮力探索）转变为严谨的拓扑数学先验设计，极大加速了新型超算脑架构的收敛迭代效率。",
    source: {
      name: "arXiv / HuggingFace",
      url: "https://arxiv.org/abs/2609.23087",
      domain: "arxiv.org",
    },
    timestamp: "2026-09-26T00:42:24Z",
    dateLabel: "TODAY",
    dateLabelZh: "今日",
    isSignal: false,
    tags: ["COMPUTE", "MODELS"],
    weeklyPick: false,
  },
  {
    id: "sig-001",
    title: "OpenAI Unveils Test-Time Compute Scaling Laws: Models Deliberate to Solve Unseen PhD-Level Conjectures",
    titleZh: "OpenAI 揭秘测试期计算（Test-Time Compute）扩展定律：模型通过自主深度思考攻克未见之博士级猜想",
    summary:
      "Empirical results prove that extending inference-time deliberation yields logarithmic performance gains on benchmark frontiers, outpacing brute-force pretraining.",
    summaryZh:
      "实证研究表明，在推理阶段延长模型思考时间的算力扩展，可在前沿基准上带来对数级的性能跃升，其边际回报已显著超越单纯依靠预训练的暴力堆砌。",
    whyItMatters:
      "This marks the formal architectural pivot from static next-token prediction to autonomous cognitive exploration. Models are no longer simply regurgitating training distributions; they are navigating problem spaces through self-correction and internal verification—the defining hallmark of proto-Superintelligence.",
    whyItMattersZh:
      "这标志着底层范式从「静态的下一词预测」正式转向「自主的认知空间探索」。模型不再只是机械反刍训练语料分布，而是能够通过自我反思与内部验证来搜索未知解空间——这是迈向原始超智能（Proto-SI）的决定性分水岭。",
    source: {
      name: "OpenAI Research",
      url: "https://openai.com/research",
      domain: "openai.com",
    },
    timestamp: "2026-09-25T14:30:00Z",
    dateLabel: "YESTERDAY",
    dateLabelZh: "昨日",
    isSignal: true,
    tags: ["REASONING", "MODELS"],
    weeklyPick: true,
  },
  {
    id: "sig-002",
    title: "Constellation Energy Inks 20-Year PPA with Microsoft to Reopen Three Mile Island Nuclear Unit 1 for AI Compute",
    titleZh: "星座能源与微软签署 20 年购电协议：重启三哩岛 1 号核电机组独供 AI 算力集群",
    summary:
      "An 835-megawatt nuclear plant will be recommissioned exclusively to supply 24/7 carbon-free baseload electricity directly to hyperscale AI clusters.",
    summaryZh:
      "一座容量达 835 兆瓦的核电站将重新并网，全天候 24 小时零碳基荷电力将以专属管线直接注入超大规模 AI 数据中心。",
    whyItMatters:
      "Superintelligence is colliding with fundamental physics and thermodynamics. Frontier compute is no longer constrained by algorithmic ingenuity or chip manufacturing alone, but by gigawatt-scale power generation. Dedicated nuclear infrastructure establishes compute as critical sovereign physical assets.",
    whyItMattersZh:
      "超智能的发展正与物理学及热力学底层定律发生剧烈碰撞。前沿算力的制约瓶颈已不再仅仅是算法精妙度或芯片产能，而是吉瓦级的发电与输电能力。专属核能基建的介入，标志着算力已被视为关乎文明存续的国家级实体主权资产。",
    source: {
      name: "Reuters",
      url: "https://www.reuters.com",
      domain: "reuters.com",
    },
    timestamp: "2026-09-25T11:15:00Z",
    dateLabel: "YESTERDAY",
    dateLabelZh: "昨日",
    isSignal: true,
    tags: ["ENERGY", "COMPUTE"],
    weeklyPick: true,
  },
  {
    id: "sig-003",
    title: "Trump Frames National AI Policy Around 'Super Intelligence (SI)' Supremacy and Accelerated Energy Deregulation",
    titleZh: "川普将国家战略定调为「超智能（SI）」霸权，承诺对吉瓦级能源基建实行全面监管松绑",
    summary:
      "In a major policy address, former president explicitly moves beyond 'AI' nomenclature, declaring the era of 'SI' and promising fast-tracked permits for gigawatt power pipelines.",
    summaryZh:
      "在重要政策演讲中，川普明确弃用传统的「AI」称谓，定调当下已进入「SI（超智能）」时代，并承诺为吉瓦级能源与超算走廊设立极速特批绿色通道。",
    whyItMatters:
      "The political lexicon has officially caught up with technological reality: AI is no longer categorized as an enterprise software productivity tool, but as state-level civilizational power. Framing the competition as 'SI' signals that governments view this as a Manhattan Project-scale geopolitical imperative.",
    whyItMattersZh:
      "政治话语体系已正式追赶上技术演进的真实烈度：这不再是一款提高写代码或画图效率的软件应用，而是大国之间的文明级力量角逐。将竞争定性为「SI」，意味着全球顶层决策圈已将其等同于曼哈顿工程级别的国家战略核心。",
    source: {
      name: "Bloomberg",
      url: "https://www.bloomberg.com",
      domain: "bloomberg.com",
    },
    timestamp: "2026-09-25T08:45:00Z",
    dateLabel: "YESTERDAY",
    dateLabelZh: "昨日",
    isSignal: true,
    tags: ["GOVERNANCE", "ENERGY"],
    weeklyPick: true,
  },
  {
    id: "sig-004",
    title: "First GB200 NVL72 Rack-Scale Systems Begin Hyperscale Deployments, Delivering 1.4 Exaflops of FP4 Compute",
    titleZh: "首批 GB200 NVL72 柜级超算系统启动超大规模部署，单柜提供 1.4 Exaflops FP4 算力",
    summary:
      "Liquid-cooled 72-GPU racks operating over a single 130 TB/s NVLink domain transition the cluster from loosely coupled nodes into a unified monolithic computing fabric.",
    summaryZh:
      "采用全水冷设计的 72 颗 GPU 机柜通过单域 130 TB/s 的 NVLink 5 互联，将整个算力集群从松散的服务器节点聚合为单一单体计算中枢。",
    whyItMatters:
      "Communication latency between individual chips was the primary bottleneck to training multi-trillion parameter systems. NVLink 5 turns entire data hall racks into a single synthetic brain, dissolving the boundary between internal memory and network interconnect.",
    whyItMattersZh:
      "芯片之间的通信延迟曾是训练多万亿参数超脑的致命瓶颈。NVLink 5 使得整排机柜能够如同单一合成大脑般协同吞吐，内存墙与网络通信的界限正在被彻底消解。",
    source: {
      name: "NVIDIA Technical Blog",
      url: "https://developer.nvidia.com/blog",
      domain: "nvidia.com",
    },
    timestamp: "2026-09-24T18:20:00Z",
    dateLabel: "SEP 24",
    dateLabelZh: "9月24日",
    isSignal: false,
    tags: ["COMPUTE", "INFRASTRUCTURE"],
    weeklyPick: true,
  },
  {
    id: "sig-005",
    title: "Frontier Mathematical Agent Proves Long-Standing Open Combinatorics Lemma in Lean 4 Without Human Hints",
    titleZh: "前沿数学智能体在 Lean 4 中实现突破：无人类提示下自主证明 20 年未解组合数学引理",
    summary:
      "Using monte-carlo tree search over formalized proof tactics, an autonomous agent generated a verified proof for a 20-year-old conjecture in extremal graph theory.",
    summaryZh:
      "通过在形式化证明战术空间中运用蒙特卡洛树搜索与自我博弈，自主数学智能体成功为极值图论中一个沉寂 20 年的猜想给出了计算机全量验证的严谨证明。",
    whyItMatters:
      "Superintelligence begins when AI produces novel synthetic science that human mathematicians cannot easily refute or conceive. Verified formal reasoning bridges the trust gap, paving the way for autonomous automated scientific discovery.",
    whyItMattersZh:
      "当智能体开始产出人类顶尖科学家难以轻易构想或推演的合成科学成果时，超智能的序幕已然拉开。可形式化验证的推理跨越了“幻觉信赖度”的鸿沟，为完全自主化的科学探索铺平了道路。",
    source: {
      name: "arXiv Formal Math",
      url: "https://arxiv.org",
      domain: "arxiv.org",
    },
    timestamp: "2026-09-24T14:05:00Z",
    dateLabel: "SEP 24",
    dateLabelZh: "9月24日",
    isSignal: true,
    tags: ["REASONING"],
    weeklyPick: true,
  },
  {
    id: "sig-006",
    title: "DeepSeek Architectures Challenge Closed Frontiers with Multi-Head Latent Attention and High-Throughput FP8 Training",
    titleZh: "DeepSeek 架构突破：多头潜在注意力（MLA）与高吞吐 FP8 训练大幅压缩闭源壁垒",
    summary:
      "Open research paper details architectural modifications that compress KV-cache memory overhead by 80% while retaining full contextual reasoning fidelity.",
    summaryZh:
      "开源论文详述了新型注意力架构，在保留完整长上下文推理保真度的同时，将显存 KV-Cache 占用骤降 80%，显著降低前沿大模型推理成本。",
    whyItMatters:
      "Demonstrates that the path to SI is not purely an expenditure war of capital expenditure (CapEx). Algorithmic compression and novel attention topologies can unlock radical efficiency, preventing frontier intelligence from becoming an impenetrable closed-monopoly.",
    whyItMattersZh:
      "这有力证明了通往超智能的路径并非只有资本支出（CapEx）这一场残酷的消耗战。算法拓扑的精简与数学压缩同样能激发超额效能，打破超智能被极少数寡头封闭垄断的宿命。",
    source: {
      name: "DeepSeek AI",
      url: "https://github.com/deepseek-ai",
      domain: "github.com",
    },
    timestamp: "2026-09-23T16:40:00Z",
    dateLabel: "SEP 23",
    dateLabelZh: "9月23日",
    isSignal: false,
    tags: ["MODELS", "COMPUTE"],
    weeklyPick: false,
  },
  {
    id: "sig-007",
    title: "PJM Interconnection Reports Over 40 Gigawatts of Dedicated AI Data Center Grid Queues Across Rust Belt",
    titleZh: "PJM 电网互联报告显示：美铁锈地带超 40 吉瓦专用 AI 数据中心排队申请并网",
    summary:
      "Regional transmission grid operators scramble to accommodate unprecedented industrial load forecasts driven by clustered AI mega-campuses.",
    summaryZh:
      "区域电网运营商正全力应对前所未有的工业负荷激增，AI 超级园区的电力需求正在重绘区域输电网规划。",
    whyItMatters:
      "The physical geography of intelligence is shifting toward proximity to high-voltage transmission lines, cooling rivers, and nuclear/gas reserves. SI development is reshaping regional infrastructure planning faster than the EV transition.",
    whyItMattersZh:
      "智能的物理地理学正在重塑——超算中心正向特高压输电走廊、冷却水源及核电/天然气枢纽加速聚拢。超智能的重资产属性正在以快于电动汽车转型的速度改造现实能源图谱。",
    source: {
      name: "Financial Times",
      url: "https://www.ft.com",
      domain: "ft.com",
    },
    timestamp: "2026-09-22T09:10:00Z",
    dateLabel: "SEP 22",
    dateLabelZh: "9月22日",
    isSignal: false,
    tags: ["ENERGY", "INFRASTRUCTURE"],
    weeklyPick: false,
  },
];
