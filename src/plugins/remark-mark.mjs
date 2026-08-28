import { visit } from "unist-util-visit";

/**
 * 支持 Obsidian 的 ==高亮== 语法，渲染成 <mark>。
 * 标准 Markdown 没有高亮，不加这个的话笔记里的等号会原样显示出来。
 *
 * 只处理纯文本节点，所以代码块和行内代码里的 == 不会被误伤。
 */
export default function remarkMark() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === null || !node.value.includes("==")) return;

      // 捕获组会保留在 split 结果里，奇数位就是被 == 包住的内容
      const parts = node.value.split(/==(?=\S)([\s\S]*?\S)==/g);
      if (parts.length === 1) return;

      const nodes = [];
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i]) continue;
        nodes.push(
          i % 2 === 1
            ? { type: "html", value: `<mark>${parts[i]}</mark>` }
            : { type: "text", value: parts[i] },
        );
      }

      parent.children.splice(index, 1, ...nodes);
      return index + nodes.length;
    });
  };
}
