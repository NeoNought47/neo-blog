#!/usr/bin/env node
/**
 * 把一个目录里的 HEIC 转成网站能用的格式。
 *
 *   node scripts/from-heic.mjs <目录>              # 默认无损 WebP
 *   node scripts/from-heic.mjs <目录> --jpeg       # JPEG 质量 95，体积小得多
 *   node scripts/from-heic.mjs <目录> --png        # PNG，最大但最保险
 *
 * 为什么要先用 sips 解码：
 * sharp 虽然声称支持 HEIF 输入，但它的 libheif 有引用数量上限（16），
 * 而 iPhone 大尺寸照片是瓦片网格结构，动辄几十个引用，会直接报
 * "Security limit exceeded" 失败。sips 走 Apple 自己的解码器，没这个问题。
 *
 * 解码到 PNG 这一步是无损的，所以 --png 和 --lossless 全程不引入任何新损失
 * （HEIC 自身的有损压缩已经发生过，那部分找不回来）。
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
if (!dir) {
  console.error("用法: node scripts/from-heic.mjs <目录> [--jpeg|--png]");
  process.exit(1);
}
const mode = args.includes("--jpeg") ? "jpeg" : args.includes("--png") ? "png" : "webp";

const files = fs
  .readdirSync(dir)
  .filter((f) => /\.hei[cf]$/i.test(f))
  .sort();

if (!files.length) {
  console.error(`${dir} 里没有 .heic/.heif 文件`);
  process.exit(1);
}

const outDir = path.join(dir, "converted");
fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "heic-"));

let inTotal = 0;
let outTotal = 0;

for (const f of files) {
  const src = path.join(dir, f);
  const stem = path.basename(f).replace(/\.hei[cf]$/i, "");
  const png = path.join(tmp, `${stem}.png`);

  // 第一步：用 Apple 的解码器解到 PNG，无损
  execFileSync("sips", ["-s", "format", "png", src, "--out", png], { stdio: "ignore" });

  // sips 转格式时不会把 EXIF 旋转烘进像素，而 PNG 又不带 EXIF，
  // 旋转信息会在这一步丢掉，竖拍的照片就会横过来。
  // 所以另外转一张 64px 的小 JPEG 当探针，把方向值读出来。
  const probe = path.join(tmp, `${stem}-probe.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-Z", "64", src, "--out", probe], { stdio: "ignore" });
  const orientation = (await sharp(probe).metadata()).orientation ?? 1;
  fs.unlinkSync(probe);
  // 90 度整数倍旋转是纯像素重排，不会损失画质
  const ROT = { 3: 180, 6: 90, 8: 270 };
  const angle = ROT[orientation] ?? 0;

  const ext = mode === "jpeg" ? "jpg" : mode;
  const out = path.join(outDir, `${stem}.${ext}`);

  if (mode === "png") {
    if (angle) await sharp(png).rotate(angle).png({ compressionLevel: 9 }).toFile(out);
    else fs.copyFileSync(png, out);
  } else {
    const pipe = angle ? sharp(png).rotate(angle) : sharp(png);
    await (mode === "jpeg"
      ? pipe.jpeg({ quality: 95, chromaSubsampling: "4:4:4", mozjpeg: true })
      : pipe.webp({ lossless: true })
    ).toFile(out);
  }

  const a = fs.statSync(src).size;
  const b = fs.statSync(out).size;
  const m = await sharp(out).metadata();
  inTotal += a;
  outTotal += b;
  console.log(
    `  ${f.padEnd(26)} ${m.width}x${m.height}`.padEnd(48) +
      `${(a / 1048576).toFixed(2)}MB -> ${(b / 1048576).toFixed(2)}MB`,
  );
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(
  `\n共 ${files.length} 张，${(inTotal / 1048576).toFixed(1)}MB -> ` +
    `${(outTotal / 1048576).toFixed(1)}MB（${mode}）`,
);
console.log(`输出目录：${outDir}`);
