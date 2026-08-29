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
export default {
  ...sharpService,
  transform(inputBuffer, transform, config) {
    if (transform.quality == null) {
      transform = { ...transform, quality: 92 };
    }
    return sharpService.transform(inputBuffer, transform, config);
  },
};
