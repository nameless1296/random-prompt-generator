import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  defaultCategories,
  getTotalTags,
  getVisibleSubcategories,
  toTag,
  formatTagByMode,
  formatPromptByMode,
  type TagCategory,
  type TagDisplayMode,
} from './data/tags';
import { getBoostScores, pickWeighted, TOTAL_RULES } from './data/correlations';
import { Slider } from './components/Slider';

interface Limits { [k: string]: number }
interface Hist  { id: number; prompt: string }

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function App() {
  const [cats] = useState<TagCategory[]>(defaultCategories);

  // disabledSubs tracks DISABLED subcategories.  key = "catId:subId"
  // A main category is "enabled" if at least one of its subs is NOT disabled.
  const [disabledSubs, setDisabledSubs] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('rp7-ds') || '{}'); } catch { return {}; }
  });

  const [limits, setLimits]         = useState<Limits>({});
  const [nsfw, setNsfw]             = useState(false);
  const [tagCount, setTagCount]     = useState(15);
  const [blacklist, setBlacklist]   = useState('');
  const [whitelist, setWhitelist]   = useState('');
  const [lastOutput, setLastOutput] = useState('');
  const [catTags, setCatTags] = useState<Record<string, string[]>>({});
  // Prompt Cleaner: tracks which tags in the output are temporarily hidden
  const [hiddenOutputTags, setHiddenOutputTags] = useState<Set<string>>(new Set());
  const [outputMode, setOutputMode] = useState<'preview' | 'clean'>('clean'); // preview=划掉, clean=干净
  const [displayMode, setDisplayMode] = useState<TagDisplayMode>('space');
  const [hist, setHist] = useState<Hist[]>(() => {
    try { return JSON.parse(localStorage.getItem('rp7-hist') || '[]'); } catch { return []; }
  });
  const [showHist, setShowHist]     = useState(false);
  const [openId, setOpenId]         = useState<string | null>(null);
  const [subId, setSubId]           = useState('');
  const [copied, setCopied]         = useState(false);
  const [showLimits, setShowLimits] = useState(false);

  /* ── helpers ── */
  const vis = useMemo(() => cats.filter(c => nsfw || !c.nsfw), [cats, nsfw]);

  // A sub is enabled if it's NOT in disabledSubs
  const isSubEnabled = useCallback((catId: string, sId: string) =>
    !disabledSubs[`${catId}:${sId}`], [disabledSubs]);

  // A cat is enabled if ANY visible sub is enabled
  const isCatEnabled = useCallback((cat: TagCategory) => {
    const subs = getVisibleSubcategories(cat, nsfw);
    return subs.some(s => isSubEnabled(cat.id, s.id));
  }, [nsfw, isSubEnabled]);

  const enabledCats = useMemo(() => vis.filter(c => isCatEnabled(c)), [vis, isCatEnabled]);

  const totalN = useMemo(() => vis.reduce((s, c) => s + getTotalTags(c, nsfw), 0), [vis, nsfw]);

  const blacklistSet = useMemo(() =>
    new Set(blacklist.split(/[,\n]/).map(s => s.trim().toLowerCase()).filter(Boolean)), [blacklist]);
  const whitelistTags = useMemo(() =>
    whitelist.split(/[,\n]/).map(s => toTag(s.trim())).filter(Boolean), [whitelist]);

  // Limit warning
  const totalLimitsSum = useMemo(() => {
    let sum = 0;
    for (const cat of enabledCats) {
      const cl = limits[cat.id] || 0;
      if (cl > 0) { sum += cl; continue; }
      for (const sub of getVisibleSubcategories(cat, nsfw)) {
        if (!isSubEnabled(cat.id, sub.id)) continue;
        const sl = limits[`${cat.id}:${sub.id}`] || 0;
        if (sl > 0) sum += sl;
      }
    }
    return sum;
  }, [enabledCats, limits, nsfw, isSubEnabled]);
  const limitWarning = totalLimitsSum > 0 && totalLimitsSum > tagCount;

  /* ── persist ── */
  useEffect(() => { localStorage.setItem('rp7-ds', JSON.stringify(disabledSubs)); }, [disabledSubs]);
  useEffect(() => { localStorage.setItem('rp7-hist', JSON.stringify(hist.slice(0, 50))); }, [hist]);

  /* ── toggle helpers ── */
  const toggleSub = useCallback((key: string) =>
    setDisabledSubs(p => ({ ...p, [key]: !p[key] })), []);

  // Toggle ALL subs of a category at once
  const toggleCat = useCallback((cat: TagCategory) => {
    const subs = getVisibleSubcategories(cat, nsfw);
    const allEnabled = subs.every(s => isSubEnabled(cat.id, s.id));
    setDisabledSubs(p => {
      const next = { ...p };
      for (const s of subs) next[`${cat.id}:${s.id}`] = allEnabled; // if all on → turn all off, else all on
      return next;
    });
  }, [nsfw, isSubEnabled]);

  const enableAllCats = useCallback(() => {
    setDisabledSubs(p => {
      const next = { ...p };
      for (const cat of vis) {
        for (const s of getVisibleSubcategories(cat, nsfw))
          next[`${cat.id}:${s.id}`] = false;
      }
      return next;
    });
  }, [vis, nsfw]);

  const disableAllCats = useCallback(() => {
    setDisabledSubs(p => {
      const next = { ...p };
      for (const cat of vis) {
        for (const s of getVisibleSubcategories(cat, nsfw))
          next[`${cat.id}:${s.id}`] = true;
      }
      return next;
    });
  }, [vis, nsfw]);

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const e = document.createElement('textarea'); e.value = text; document.body.appendChild(e); e.select(); document.execCommand('copy'); document.body.removeChild(e); }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  /* ════════════════════════════════════════════════════════════
     GENERATION — retry-based: never delete, always replace
     Priority: earlier tags are kept, later conflicts get replaced
  ════════════════════════════════════════════════════════════ */
  const generate = useCallback((batchN = 1) => {
    const newHist: Hist[] = [];
    let lastPerCat: Record<string, string[]> = {};

    for (let b = 0; b < batchN; b++) {
      const result: string[] = [];
      const resultCat: string[] = [];      // parallel array: catId for each tag
      const usedSet = new Set<string>();

      // helper: try to pick a compatible tag from a pool, with retries
      const tryPick = (pool: string[], catId: string, maxRetries = 30): boolean => {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          const boosts = getBoostScores(result);
          const chosen = pickWeighted(pool, boosts, blacklistSet, result);
          if (!chosen) return false;                       // pool exhausted
          if (usedSet.has(chosen)) {
            pool = pool.filter(t => t !== chosen);         // remove and retry
            continue;
          }
          // chosen is compatible (pickWeighted already filters conflicts)
          result.push(chosen);
          resultCat.push(catId);
          usedSet.add(chosen);
          return true;
        }
        return false;
      };

      // 1. Whitelist first (these are always priority)
      for (const wt of whitelistTags) {
        if (!blacklistSet.has(wt.toLowerCase()) && !usedSet.has(wt)) {
          result.push(wt); resultCat.push('__whitelist'); usedSet.add(wt);
        }
      }

      // 2. Build pools per category/subcategory — randomized order
      interface Pool { catId: string; tags: string[]; budget: number }
      const limitedPools: Pool[] = [];
      const unlimitedPools: Pool[] = [];

      const randomizedCats = shuffle(enabledCats);
      for (const cat of randomizedCats) {
        const catLimit = limits[cat.id] || 0;
        const subs = shuffle(
          getVisibleSubcategories(cat, nsfw).filter(s => isSubEnabled(cat.id, s.id))
        );
        if (subs.length === 0) continue;

        if (catLimit > 0) {
          const tags = shuffle(
            subs.flatMap(s => s.tags.map(toTag))
              .filter(t => !blacklistSet.has(t.toLowerCase()))
          );
          limitedPools.push({ catId: cat.id, tags, budget: catLimit });
        } else {
          for (const sub of subs) {
            const subLimit = limits[`${cat.id}:${sub.id}`] || 0;
            const tags = shuffle(
              sub.tags.map(toTag)
                .filter(t => !blacklistSet.has(t.toLowerCase()))
            );
            if (tags.length === 0) continue;
            if (subLimit > 0) limitedPools.push({ catId: cat.id, tags, budget: subLimit });
            else unlimitedPools.push({ catId: cat.id, tags, budget: 0 });
          }
        }
      }

      // Also randomize pool order itself so categories don't feel sequential
      const shuffledLimitedPools = shuffle(limitedPools);
      const shuffledUnlimitedPools = shuffle(unlimitedPools);

      const target = tagCount;

      // 3. Fill from limited pools
      for (const pool of shuffledLimitedPools) {
        if (result.length >= target) break;
        const n = Math.min(pool.budget, target - result.length);
        for (let i = 0; i < n; i++) {
          if (result.length >= target) break;
          const available = shuffle(pool.tags.filter(t => !usedSet.has(t)));
          if (!tryPick(available, pool.catId)) break;
        }
      }

      // 4. Round-robin from unlimited pools until we reach target
      if (result.length < target && shuffledUnlimitedPools.length > 0) {
        let globalStale = 0;
        let idx = Math.floor(Math.random() * shuffledUnlimitedPools.length);
        while (result.length < target && globalStale < shuffledUnlimitedPools.length * 3) {
          const pool = shuffledUnlimitedPools[idx % shuffledUnlimitedPools.length];
          const available = shuffle(pool.tags.filter(t => !usedSet.has(t)));
          if (available.length > 0) {
            if (tryPick(available, pool.catId)) { globalStale = 0; }
            else globalStale++;
          } else {
            globalStale++;
          }
          idx++;
        }
      }

      // 5. Final fill — if still short, try ALL enabled pools with relaxed retries
      if (result.length < target) {
        const allPools = shuffle([...shuffledLimitedPools, ...shuffledUnlimitedPools]);
        let fillStale = 0;
        while (result.length < target && fillStale < allPools.length * 2) {
          let filled = false;
          for (const pool of allPools) {
            if (result.length >= target) break;
            const available = shuffle(pool.tags.filter(t => !usedSet.has(t)));
            if (tryPick(available, pool.catId, 50)) { filled = true; fillStale = 0; }
          }
          if (!filled) fillStale++;
        }
      }

      // 6. Hard-cap at exactly tagCount
      const finalTags = result.slice(0, target);
      const finalCats = resultCat.slice(0, target);

      // Build per-category map
      const perCat: Record<string, string[]> = {};
      for (let i = 0; i < finalTags.length; i++) {
        const cid = finalCats[i];
        if (!perCat[cid]) perCat[cid] = [];
        perCat[cid].push(finalTags[i]);
      }

      if (finalTags.length > 0) {
        newHist.push({ id: Date.now() + b, prompt: finalTags.join(', ') });
        if (b === 0) lastPerCat = perCat;
      }
    }

    if (newHist.length > 0) {
      setLastOutput(newHist[0].prompt);
      setCatTags(lastPerCat);
      setHiddenOutputTags(new Set());
      setHist(h => [...newHist, ...h].slice(0, 50));
    }
  }, [enabledCats, limits, isSubEnabled, nsfw, tagCount, whitelistTags, blacklistSet]);

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  const outputTags = lastOutput ? lastOutput.split(', ') : [];
  const cleanedOutput = outputTags.filter(t => !hiddenOutputTags.has(t));
  const cleanedDisplayPrompt = cleanedOutput.map(t => formatTagByMode(t, displayMode)).join(', ');
  const formatDisplayTag = (tag: string) => formatTagByMode(tag, displayMode);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0e' }}>

      {/* TOP BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(10,10,14,.85)', borderBottom: '1px solid rgba(255,255,255,.10)' }}>
        <div className="max-w-[1480px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🎲</span>
            <span className="text-[13px] font-bold text-white/90">Danbooru-style 随机提示词</span>
            <span className="text-[10px] text-white/20 hidden md:inline ml-1">{totalN.toLocaleString()} tags · {TOTAL_RULES.toLocaleString()} rules</span>
          </div>
          <button onClick={() => setNsfw(n => !n)}
            className={`h-7 rounded-full px-2.5 text-[11px] font-semibold flex items-center gap-1.5 border ${nsfw ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' : 'bg-white/[.03] border-white/[.06] text-white/25 hover:text-white/40'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${nsfw ? 'bg-rose-500' : 'bg-white/15'}`} />
            NSFW
          </button>
        </div>
      </header>

      <div className="max-w-[1480px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row gap-5 xl:gap-6">

          {/* ═══ LEFT ═══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 lg:pr-1 xl:pr-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-white/50">分类 ({enabledCats.length}/{vis.length} 启用)</span>
              <div className="flex gap-1.5">
                <Btn onClick={enableAllCats}>全选</Btn>
                <Btn onClick={disableAllCats}>全不选</Btn>
                <Btn onClick={() => setShowLimits(s => !s)} active={showLimits}>⚙️ 限制</Btn>
              </div>
            </div>

            {limitWarning && (
              <div className="rounded-lg px-3 py-2 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-400">
                ⚠️ 限制总数 <b>{totalLimitsSum}</b> 超过标签数量 <b>{tagCount}</b>，部分限制将被截断
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
              {vis.map(cat => {
                const subs = getVisibleSubcategories(cat, nsfw);
                const anySubOn = subs.some(s => isSubEnabled(cat.id, s.id));
                const allSubOn = subs.every(s => isSubEnabled(cat.id, s.id));
                return (
                  <CatCard key={cat.id}
                    cat={cat} nsfw={nsfw} anySubOn={anySubOn} allSubOn={allSubOn}
                    limits={limits}
                    pickedTags={catTags[cat.id] || []}
                    displayMode={displayMode}
                    isOpen={openId === cat.id} subId={subId}
                    showLimits={showLimits} tagCount={tagCount}
                    isSubEnabled={isSubEnabled}
                    onToggleCat={() => toggleCat(cat)}
                    onToggleSub={toggleSub}
                    onOpen={() => {
                      const n = openId === cat.id ? null : cat.id;
                      setOpenId(n);
                      if (n && subs.length) setSubId(subs[0].id);
                    }}
                    onSubId={setSubId}
                    onLimitChange={(id, v) => setLimits(l => ({ ...l, [id]: v }))}
                  />
                );
              })}
            </div>
          </div>

          {/* ═══ RIGHT ═══ */}
          <div className="lg:w-[440px] xl:w-[470px] flex flex-col gap-3 shrink-0 lg:pl-1 xl:pl-2">
            <Panel title="生成设置">
              <Slider label="标签数量" tooltip="输出中包含的标签总数" value={tagCount} min={1} max={100} onChange={setTagCount} color="#6366f1" />
            </Panel>

            <div className="flex gap-2">
              <button onClick={() => generate(1)} disabled={!enabledCats.length}
                className="flex-1 h-10 rounded-lg text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[.98] disabled:opacity-25 disabled:pointer-events-none shadow-md shadow-indigo-900/30">
                🎲 随机生成
              </button>
              <button onClick={() => { setLastOutput(''); setLimits({}); }}
                className="h-10 px-3 rounded-lg text-[11px] text-white/30 hover:text-rose-400" style={{ border: '1px solid rgba(255,255,255,.12)' }}>
                重置
              </button>
            </div>

            {/* ═══ PANEL 1: 输出结果 ═══ */}
            <div className="rounded-xl overflow-hidden" style={{ background: '#101016', border: '1px solid rgba(255,255,255,.12)' }}>
              <div className="flex items-center justify-between px-4 h-9" style={{ borderBottom: '1px solid rgba(255,255,255,.10)' }}>
                <span className="text-[10px] text-white/80 font-semibold">
                  📤 输出结果
                  {outputTags.length > 0 && (
                    <span className="ml-1.5 font-normal text-white/80">
                      <span>保留 {cleanedOutput.length}</span>
                      {hiddenOutputTags.size > 0 && <span className="ml-1">· 屏蔽 {hiddenOutputTags.size}</span>}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  {outputTags.length > 0 && (
                    <div className="flex rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.12)' }}>
                      <button onClick={() => setOutputMode('clean')}
                        className={`px-2 py-0.5 text-[9px] font-medium ${outputMode === 'clean' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/20 hover:text-white/40'}`}>
                        干净输出
                      </button>
                      <button onClick={() => setOutputMode('preview')}
                        className={`px-2 py-0.5 text-[9px] font-medium ${outputMode === 'preview' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/20 hover:text-white/40'}`}
                        style={{ borderLeft: '1px solid rgba(255,255,255,.12)' }}>
                        划掉预览
                      </button>
                    </div>
                  )}
                  <div className="flex rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.12)' }}>
                    <button onClick={() => setDisplayMode('space')}
                      className={`px-2 py-0.5 text-[9px] font-medium ${displayMode === 'space' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/20 hover:text-white/40'}`}>
                      空格
                    </button>
                    <button onClick={() => setDisplayMode('underscore')}
                      className={`px-2 py-0.5 text-[9px] font-medium ${displayMode === 'underscore' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/20 hover:text-white/40'}`}
                      style={{ borderLeft: '1px solid rgba(255,255,255,.12)' }}>
                      _模式
                    </button>
                  </div>
                  <button onClick={() => cleanedDisplayPrompt && copy(cleanedDisplayPrompt)} disabled={!cleanedDisplayPrompt}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${copied ? 'text-emerald-400' : cleanedDisplayPrompt ? 'text-indigo-400 hover:text-indigo-300' : 'text-white/10'}`}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="px-4 py-3 min-h-[56px] max-h-[190px] overflow-y-auto">
                {outputTags.length > 0 ? (
                  outputMode === 'clean' ? (
                    <code className="text-[11px] leading-[1.8] text-emerald-400/80 break-all select-all font-mono whitespace-pre-wrap block">
                      {cleanedDisplayPrompt}
                    </code>
                  ) : (
                    <code className="text-[11px] leading-[1.8] font-mono whitespace-pre-wrap block break-all">
                      {outputTags.map((tag, i) => {
                        const hidden = hiddenOutputTags.has(tag);
                        const isLast = i === outputTags.length - 1;
                        return (
                          <span key={`${tag}-${i}`}>
                            <span style={{
                              color: hidden ? 'rgba(255,255,255,.12)' : 'rgba(52,211,153,.8)',
                              textDecoration: hidden ? 'line-through' : 'none',
                            }}>{formatDisplayTag(tag)}</span>
                            {!isLast && <span className="text-white/25">, </span>}
                          </span>
                        );
                      })}
                    </code>
                  )
                ) : (
                  <span className="text-[10px] text-white/12 block text-center py-2">点击「随机生成」开始</span>
                )}
              </div>
            </div>

            {/* ═══ PANEL 2: 标签屏蔽 ═══ */}
            {outputTags.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ background: '#101016', border: '1px solid rgba(255,255,255,.12)' }}>
                <div className="flex items-center justify-between px-4 h-9" style={{ borderBottom: '1px solid rgba(255,255,255,.10)' }}>
                  <span className="text-[10px] text-white/80 font-semibold">
                    🏷️ 点击标签进行屏蔽
                    <span className="text-white/80 font-normal ml-1">({outputTags.length}个)</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setHiddenOutputTags(new Set(outputTags))}
                      className="text-[9px] text-white/80 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/5">
                      全选
                    </button>
                    <button onClick={() => setHiddenOutputTags(new Set())}
                      className="text-[9px] text-white/80 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/5">
                      清除
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 max-h-[210px] overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {outputTags.map((tag, i) => {
                      const isHidden = hiddenOutputTags.has(tag);
                      return (
                        <button key={`${tag}-${i}`}
                          onClick={() => {
                            setHiddenOutputTags(prev => {
                              const next = new Set(prev);
                              if (next.has(tag)) next.delete(tag); else next.add(tag);
                              return next;
                            });
                          }}
                          className="rounded px-1.5 py-[3px] text-[10px] font-mono transition-all"
                          title={isHidden ? '点击取消屏蔽' : '点击屏蔽'}
                          style={{
                            background: isHidden ? 'rgba(244,63,94,.06)' : 'rgba(16,185,129,.07)',
                            color: isHidden ? 'rgba(244,63,94,.5)' : 'rgba(52,211,153,.7)',
                            textDecoration: isHidden ? 'line-through' : 'none',
                            border: `1px solid ${isHidden ? 'rgba(244,63,94,.22)' : 'rgba(16,185,129,.22)'}`,
                          }}>
                          {formatDisplayTag(tag)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <Panel title="✅ 白名单" subtitle="必定出现"
              action={whitelistTags.length > 0 ? <span className="text-[9px] text-emerald-400/60">{whitelistTags.length}</span> : null}>
              <textarea value={whitelist} onChange={e => setWhitelist(e.target.value)}
                placeholder="逗号或换行分隔…" className="w-full h-16 bg-transparent text-[10px] text-white/50 placeholder:text-white/15 outline-none resize-none font-mono" />
            </Panel>

            <Panel title="🚫 黑名单" subtitle="永不出现"
              action={blacklistSet.size > 0 ? <span className="text-[9px] text-rose-400/60">{blacklistSet.size}</span> : null}>
              <textarea value={blacklist} onChange={e => setBlacklist(e.target.value)}
                placeholder="逗号或换行分隔…" className="w-full h-16 bg-transparent text-[10px] text-white/50 placeholder:text-white/15 outline-none resize-none font-mono" />
            </Panel>

            {hist.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ background: '#101016', border: '1px solid rgba(255,255,255,.12)' }}>
                <button onClick={() => setShowHist(h => !h)}
                  className="w-full flex items-center justify-between px-4 h-9 hover:bg-white/[.015]">
                    <span className="text-[10px] text-white/80 font-semibold">🕐 历史 ({hist.length})</span>
                  <div className="flex items-center gap-2">
                    <span onClick={e => { e.stopPropagation(); setHist([]); }} className="text-[9px] text-white/80 hover:text-white cursor-pointer">清空</span>
                    <svg className={`w-3 h-3 text-white/80 ${showHist ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
                {showHist && (
                  <div className="max-h-40 overflow-y-auto" style={{ borderTop: '1px solid rgba(255,255,255,.10)' }}>
                    {hist.map(h => (
                      <div key={h.id} onClick={() => copy(formatPromptByMode(h.prompt, displayMode))}
                        className="px-4 py-2 cursor-pointer hover:bg-white/[.02]" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                        <p className="font-mono text-[9px] text-white/20 hover:text-white/40 line-clamp-2">{formatPromptByMode(h.prompt, displayMode)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <footer className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,.10)' }}>
          <p className="text-[10px] text-white/10">Danbooru-style Random Prompt Generator · {totalN.toLocaleString()} tags</p>
        </footer>
      </div>
    </div>
  );
}

/* ═══ Small button ═══ */
function Btn({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`h-6 px-2 rounded text-[10px] ${active ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/25 hover:text-white/50'}`}
      style={active ? undefined : { background: 'rgba(255,255,255,.03)' }}>
      {children}
    </button>
  );
}

/* ═══ Panel ═══ */
function Panel({ title, subtitle, action, children }: {
  title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#101016', border: '1px solid rgba(255,255,255,.12)' }}>
      <div className="flex items-center justify-between px-4 h-9" style={{ borderBottom: '1px solid rgba(255,255,255,.10)' }}>
        <span className="text-[10px] text-white/80 font-semibold">
          {title}{subtitle && <span className="text-white/80 font-normal ml-1">({subtitle})</span>}
        </span>
        {action}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CatCard
═══════════════════════════════════════════════════════════ */
function CatCard({ cat, nsfw, anySubOn, allSubOn, limits, pickedTags, displayMode, isOpen, subId,
  showLimits, tagCount, isSubEnabled,
  onToggleCat, onToggleSub, onOpen, onSubId, onLimitChange }: {
  cat: TagCategory; nsfw: boolean; anySubOn: boolean; allSubOn: boolean;
  limits: Limits; pickedTags: string[]; displayMode: TagDisplayMode;
  isOpen: boolean; subId: string; showLimits: boolean; tagCount: number;
  isSubEnabled: (catId: string, subId: string) => boolean;
  onToggleCat: () => void; onToggleSub: (key: string) => void;
  onOpen: () => void; onSubId: (id: string) => void;
  onLimitChange: (id: string, v: number) => void;
}) {
  const subs = getVisibleSubcategories(cat, nsfw);
  const total = getTotalTags(cat, nsfw);
  const activeSub = subs.find(s => s.id === subId) || subs[0];
  const ref = useRef<HTMLDivElement>(null);
  const c = cat.color;
  const catLimit = limits[cat.id] || 0;

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOpen(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [isOpen, onOpen]);

  // Checkbox visual: filled = all on, half = partial, empty = all off
  const checkState = allSubOn ? 'all' : anySubOn ? 'partial' : 'none';

  return (
    <div ref={ref} className="rounded-lg overflow-hidden" style={{
      background: '#111117',
      border: `1px solid ${anySubOn ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.10)'}`,
    }}>
      {/* ── Header row ── */}
      <div className="flex items-center h-12 px-4 gap-3">
        <span className="text-base shrink-0">{cat.icon}</span>
        <span className={`text-[12px] font-semibold truncate flex-1 ${anySubOn ? 'text-white/90' : 'text-white/30'}`}>{cat.name}</span>
        <span className="text-[10px] text-white/25 shrink-0">{total}</span>
        {catLimit > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded text-white/40 font-mono" style={{ background: c + '25' }}>≤{catLimit}</span>}

        {/* Expand arrow — ALWAYS visible */}
        <button onClick={onOpen} className="shrink-0 p-1.5 rounded hover:bg-white/[.08] transition-colors cursor-pointer" title="展开/收起标签">
          <svg className={`w-3.5 h-3.5 text-white/30 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Main checkbox — on the RIGHT, with clear spacing from the border */}
        <button onClick={onToggleCat}
          className="w-4 h-4 rounded shrink-0 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          title={checkState === 'all' ? '全部启用 — 点击全部关闭' : checkState === 'partial' ? '部分启用 — 点击全部关闭' : '全部关闭 — 点击全部启用'}
          style={{
            background: checkState === 'none' ? 'transparent' : c,
            border: checkState === 'none' ? '1.5px solid rgba(255,255,255,.25)' : 'none',
            opacity: checkState === 'partial' ? .65 : 1,
          }}>
          {checkState !== 'none' && (
            checkState === 'all'
              ? <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              : <span className="block w-2 h-0.5 bg-white rounded" />
          )}
        </button>
      </div>

      {/* ── Picked tags preview (collapsed view) ── */}
      {!isOpen && pickedTags.length > 0 && (
        <div className="px-5 pb-2.5 flex flex-wrap gap-1">
          {pickedTags.slice(0, 4).map(t => (
            <span key={t} className="rounded px-1.5 py-[2px] text-[9px] font-medium truncate max-w-[100px]"
              style={{ background: c + '14', color: c + 'cc', border: `1px solid ${c}38` }}>
              {formatTagByMode(t, displayMode)}
            </span>
          ))}
          {pickedTags.length > 4 && (
            <span className="text-[9px] text-white/20 py-[2px]">+{pickedTags.length - 4}</span>
          )}
        </div>
      )}

      {/* ── Limit slider (collapsed view) ── */}
      {showLimits && !isOpen && (
        <div className="px-5 pb-3">
          <Slider label="分类限制" tooltip="此分类最多输出几个标签（0=不限）"
            value={catLimit} min={0} max={tagCount}
            onChange={v => onLimitChange(cat.id, v)} color={c} small />
        </div>
      )}

      {/* ── Expanded panel ── */}
      {isOpen && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,.10)' }}>

          {/* Cat limit inside expanded */}
          {showLimits && (
            <div className="px-5 pt-3.5 pb-2">
              <Slider label="分类限制" tooltip="此分类最多输出几个标签（0=不限）"
                value={catLimit} min={0} max={tagCount}
                onChange={v => onLimitChange(cat.id, v)} color={c} small />
            </div>
          )}

          {/* Sub tabs with comfortable spacing */}
          {subs.length > 0 && (
            <div
              className="flex overflow-x-auto px-3 gap-2 py-2"
              style={{
                borderTop: '1px solid rgba(255,255,255,.10)',
                borderBottom: '1px solid rgba(255,255,255,.12)',
                background: 'rgba(255,255,255,.05)',
              }}>
              {subs.map(s => {
                const subKey = `${cat.id}:${s.id}`;
                const subOn = isSubEnabled(cat.id, s.id);
                const subLimit = limits[subKey] || 0;
                const active = subId === s.id;
                return (
                  <div
                    key={s.id}
                    className="shrink-0 flex items-center gap-2 rounded-md px-2.5 py-1.5"
                    style={{
                      background: active ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.25)',
                      border: active ? `1px solid ${c}66` : '1px solid rgba(255,255,255,.10)',
                    }}>
                    {/* Sub checkbox */}
                    <button onClick={e => { e.stopPropagation(); onToggleSub(subKey); }}
                      className="w-3.5 h-3.5 rounded-sm shrink-0 flex items-center justify-center cursor-pointer"
                      title={subOn ? '点击屏蔽此子分类' : '点击启用此子分类'}
                      style={{
                        background: subOn ? c + '99' : 'rgba(255,255,255,.06)',
                        border: subOn ? 'none' : '1px solid rgba(255,255,255,.30)',
                      }}>
                      {subOn && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    {/* Sub tab label */}
                    <button onClick={() => onSubId(s.id)}
                      className="shrink-0 text-[10px] font-medium flex items-center gap-1.5 py-0.5 cursor-pointer"
                      style={{
                        color: !subOn ? 'rgba(255,255,255,.20)' : active ? c : 'rgba(255,255,255,.65)',
                        textDecoration: !subOn ? 'line-through' : 'none',
                      }}>
                      {s.name}
                      <span style={{ opacity: .5 }}>{s.tags.length}</span>
                      {subLimit > 0 && subOn && <span className="text-[8px] px-1 rounded bg-white/[.15] text-white/50 font-mono">≤{subLimit}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub limit slider */}
          {showLimits && activeSub && isSubEnabled(cat.id, activeSub.id) && (
            <div className="px-5 pt-3">
              <Slider label={`${activeSub.name} 限制`} tooltip="此子分类最多输出几个标签（0=不限）"
                value={limits[`${cat.id}:${activeSub.id}`] || 0}
                min={0} max={tagCount}
                onChange={v => onLimitChange(`${cat.id}:${activeSub.id}`, v)}
                color={c} small />
            </div>
          )}

          {/* Tags library with generous padding and clear pill styling */}
          {activeSub && (
            <div
              className="max-h-[180px] overflow-y-auto px-4 py-3"
              style={{
                opacity: isSubEnabled(cat.id, activeSub.id) ? 1 : .25,
                background: 'rgba(0,0,0,.35)',
                borderTop: '1px solid rgba(255,255,255,.10)',
              }}>
              <div className="flex flex-wrap gap-2">
                {activeSub.tags.map(raw => {
                  const t = toTag(raw);
                  return (
                    <span key={raw}
                      className="rounded-md px-2 py-1 text-[10px] leading-snug font-mono"
                      style={{
                        background: 'rgba(255,255,255,.08)',
                        color: 'rgba(255,255,255,.75)',
                        border: '1px solid rgba(255,255,255,.15)'
                      }}>
                      {formatTagByMode(t, displayMode)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
