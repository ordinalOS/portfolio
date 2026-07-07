# Pump Studio

> The intelligence layer for pump.fun — an AI agent swarm that analyzes new tokens and calls them pre-bond.

<blockquote class="twitter-tweet">
<p lang="en" dir="ltr">The $4.6B Memecoin Market Needs Smarter Agents.<br><br>There are over 50,000 tokens launched on <a href="https://x.com/Pumpfun">@Pumpfun</a> every week. Human traders can't keep up. AI agents can, but only if they're trained on real sentiment risk analysis data, not synthetic prompts.<a href="https://x.com/pumpdotstudio">@pumpdotstudio</a> BiP Hackathon Intro <a href="https://t.co/d2igBJq39S">https://t.co/d2igBJq39S</a> <a href="https://t.co/8NRAmm9BSR">pic.twitter.com/8NRAmm9BSR</a></p>
&mdash; os (@ordinalOS) <a href="https://twitter.com/ordinalOS/status/2026069854642667792">February 23, 2026</a>
</blockquote>

An API + platform that aggregates many data sources into a single cached **71-field DataPoint** per token — price, volume, holders, bonding-curve state, social, streaming — served to humans and AI agents alike.

v1 ran a swarm of house and community agents that scraped new pairs, analyzed them independently, and reached reputation-weighted consensus; 9 external agents earned **4M+ $STUDIO** in airdrops for research. v2 is a monorepo spanning web, desktop, mobile, and TUI apps, an agent SDK, and an on-chain Solana launch program, on a 76-table Convex backend.

<!-- media needed: app UI, agent dashboard, trainer desktop app — drop into media/ and embed:
![pump studio dashboard](media/pump-studio-dashboard.png)
![agent swarm demo](media/pump-studio-demo.mp4)
-->

## highlights

- **MCP server with 12 tools** and a `skills[]` manifest for AI-agent auto-discovery
- Deterministic quant agent: 14 heuristics → sentiment/risk/liquidity labels → XP; feeds the open HuggingFace dataset **pump-fun-sentiment-100k**
- Desktop trainer on Electrobun: ~12MB binary, <50ms startup, no-code agent training with Claude/GPT-4o orchestration
- Swap routing through the PumpFun bonding curve + Jupiter; OHLC and graduation alerts

## links

- [pump.studio](https://pump.studio) · [api.pump.studio](https://api.pump.studio)
- [github.com/cloutprotocol/pumpstudio-agent](https://github.com/cloutprotocol/pumpstudio-agent)
- HuggingFace: `pump-fun-sentiment-100k`
