import sharpService from "astro/assets/services/sharp";

/**
 * 包一层默认图片质量。
 *
 * Astro 内置的 sharp service 不指定 quality 时，直接走 sharp 自己的默认值（WebP 80）。
 * 摄影类文章的照片经不起这个档位——尤其源文件已经是有损 JPEG，
 * 再来一次 80 的 WebP 就是二次压缩，细节纹理会糊成一片。
 *
 * Markdown 里的 ![](...) 没法逐张传 quality，所以在服务层统一抬到 92。
 * 显式写了 quality 的调用不受影响。
 *
 * quality 本来就在 DEFAULT_HASH_PROPS 里，所以改这个值会正常触发重新生成，
 * 不会命中旧缓存。
 */
/** 渲染上限。正文图显示宽约 680px，灯箱在 4K 屏上可达约 3600 物理像素，
 *  3840 覆盖到这个上限；再高就纯属浪费带宽了。 */
const MAX_WIDTH = 3840;

/**
 * 正文图片在页面上占的宽度。见 global.css 里的
 * `.prose p:has(> img:only-child) { max-width: min(100%, 880px) }`。
 *
 * Astro 自己生成的 sizes 是 `(min-width: 原图宽) 原图宽, 100vw`，
 * 对正文图来说是错的：它以为图会铺满视口，于是在宽屏上挑最大的那档下。
 * 实际插槽只有 880px，所以这里按真实插槽重写。
 */
const PROSE_SLOT = 880;
// 窄屏下 .page 两边各留 1.25rem，所以插槽是 100vw 减 2.5rem；
// 视口到 920px 时 920-40 正好等于 880，从这里开始锁死。
const PROSE_SIZES = `(min-width: ${PROSE_SLOT + 40}px) ${PROSE_SLOT}px, calc(100vw - 2.5rem)`;

export default {
  ...sharpService,
  validateOptions(options, config) {
    // 只有正文图会带 data-astro-image，组件里的 <Image> 都是 layout="none"
    if (options["data-astro-image"]) {
      options = { ...options, sizes: PROSE_SIZES };
    }
    return sharpService.validateOptions
      ? sharpService.validateOptions(options, config)
      : options;
  },
  transform(inputBuffer, transform, config) {
    if (transform.quality == null) {
      transform = { ...transform, quality: 95 };
    }
    // 源文件保留原始分辨率（仓库里是未经处理的原件），
    // 只在输出这一步限宽 —— 这样全程只有一次有损压缩。
    if (transform.width && transform.width > MAX_WIDTH) {
      const scale = MAX_WIDTH / transform.width;
      transform = {
        ...transform,
        width: MAX_WIDTH,
        height: transform.height ? Math.round(transform.height * scale) : undefined,
      };
    }
    return sharpService.transform(inputBuffer, transform, config);
  },
};
