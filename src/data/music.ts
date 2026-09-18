import type { ImageMetadata } from "astro";

/**
 * 音乐推荐。以单曲为单位。
 *
 * 加一首：在数组最前面插一条。封面把方图丢进 src/assets/music/，
 * cover 写文件名（不带扩展名），没有封面会自动退回一块带首字母的底。
 *
 * added 是加进来的日期，只用来排序和分组，和歌本身的发行年份无关。
 */

export interface Track {
  /** 曲名 */
  title: string;
  artist: string;
  /** 出自哪张专辑，单曲发行的可以不写 */
  album?: string;
  /** 发行年份 */
  year?: number;
  /** 风格，最多显示三个 */
  genres?: string[];
  /** src/assets/music/ 下的文件名，不带扩展名 */
  cover?: string;
  /** 外链。给哪个平台就出哪个图标，一个都不给就不显示 */
  links?: {
    spotify?: string;
    apple?: string;
    netease?: string;
    youtube?: string;
    bandcamp?: string;
  };
  /** 加进列表的日期 YYYY-MM-DD */
  added: string;
  /** 一两句你自己的话 */
  zh: string;
  en: string;
}

export const PLATFORM_LABEL: Record<string, string> = {
  spotify: "Spotify",
  apple: "Apple Music",
  netease: "网易云",
  youtube: "YouTube",
  bandcamp: "Bandcamp",
};

/** 新的加在最前面 */
export const TRACKS: Track[] = [
  // ⚠️ 下面三条是占位示例，用来看版式。换成你自己的之后把这行注释删掉。
  {
    title: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    year: 2010,
    genres: ["Synthwave", "Electronic"],
    added: "2026-09-18",
    zh: "开头那段合成器一进来就知道要开夜车了。副歌那句变声处理听了十几年还是觉得聪明。",
    en: "You know a night drive is coming the moment that synth line starts. The vocoded chorus still sounds like a clever idea after a decade.",
  },
  {
    title: "Teardrop",
    artist: "Massive Attack",
    album: "Mezzanine",
    year: 1998,
    genres: ["Trip Hop"],
    added: "2026-09-18",
    zh: "那个心跳一样的鼓点是整首歌的地基。Elizabeth Fraser 的声音飘在上面，两层几乎不在同一个空间里。",
    en: "That heartbeat of a drum pattern is the whole foundation. Elizabeth Fraser's voice floats above it, as though the two were recorded in different rooms.",
  },
  {
    title: "青春",
    artist: "沼泽",
    album: "沧浪之水",
    year: 2011,
    genres: ["Post-rock", "古琴"],
    added: "2026-09-18",
    zh: "古琴接进后摇的结构里，听着不像拼贴，是真的长在一起的。中段那段渐强每次都顶到该顶的位置。",
    en: "Guqin folded into a post-rock structure without sounding like a collage. The crescendo in the middle lands exactly where it should, every time.",
  },
];

/** 封面走 glob，构建时展开，照样进图片优化管线 */
const covers = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/music/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

export function getCover(track: Track): ImageMetadata | undefined {
  if (!track.cover) return undefined;
  for (const [path, mod] of Object.entries(covers)) {
    if (path.includes(`/music/${track.cover}.`)) return mod.default;
  }
  return undefined;
}

/** 没有封面时垫一个字，中文取第一个字，英文取首字母 */
export function coverLetter(track: Track): string {
  return [...track.title][0]?.toUpperCase() ?? "♪";
}

/** 按加入日期倒序 */
export function sortedTracks(): Track[] {
  return [...TRACKS].sort((a, b) => Date.parse(b.added) - Date.parse(a.added));
}

export function recentTracks(n: number): Track[] {
  return sortedTracks().slice(0, n);
}
