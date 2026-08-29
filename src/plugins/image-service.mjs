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
/** 渲染上限。正文图显示宽约 680px，灯箱最大约 1800px，
 *  2560 已经远超任何屏幕的实际需要，再高只是白白增加下载量。 */
const MAX_WIDTH = 2560;

export default {
  ...sharpService,
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
