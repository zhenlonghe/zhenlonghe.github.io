/**
 * Add line numbers to code blocks
 * 已禁用以移除行号
 */
document.addEventListener('DOMContentLoaded', function() {
  // 行号功能已被禁用
  // 如需重新启用，请取消注释下方代码
  /*
  // 延迟执行，确保 highlight.js 已经处理完成
  setTimeout(function() {
    // 获取所有代码块
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(codeBlock) {
      // 获取代码块的父元素
      const preElement = codeBlock.parentNode;
      
      // 跳过已经处理过的代码块
      if (preElement.querySelector('.line-numbers-col')) {
        return;
      }
      
      // 获取代码内容
      const codeText = codeBlock.textContent;
      
      // 计算行数
      const lines = codeText.split('\n').length;
      
      // 创建行号容器
      const lineNumbersCol = document.createElement('div');
      lineNumbersCol.className = 'line-numbers-col';
      lineNumbersCol.setAttribute('aria-hidden', 'true');
      
      // 设置行号容器样式
      lineNumbersCol.style.position = 'absolute';
      lineNumbersCol.style.left = '0';
      lineNumbersCol.style.top = '0';
      lineNumbersCol.style.height = '100%';
      lineNumbersCol.style.paddingTop = '0.5em';
      lineNumbersCol.style.paddingRight = '0.5em';
      lineNumbersCol.style.textAlign = 'right';
      lineNumbersCol.style.width = '2.5em';
      lineNumbersCol.style.userSelect = 'none';
      lineNumbersCol.style.borderRight = '1px solid rgba(128, 128, 128, 0.3)';
      lineNumbersCol.style.background = 'rgba(40, 44, 52, 0.5)';
      lineNumbersCol.style.color = 'rgba(171, 178, 191, 0.7)';
      lineNumbersCol.style.fontFamily = "'Monaspace Argon', monospace";
      lineNumbersCol.style.fontSize = '0.9em';
      
      // 生成行号
      let lineNumbersContent = '';
      for (let i = 1; i < lines; i++) {
        lineNumbersContent += i + '<br>';
      }
      lineNumbersCol.innerHTML = lineNumbersContent;
      
      // 添加相对定位到pre元素
      preElement.style.position = 'relative';
      
      // 为代码块添加左侧内边距以容纳行号
      codeBlock.style.marginLeft = '3em';
      codeBlock.style.paddingLeft = '0.5em';
      
      // 创建样式元素确保每行等高
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        pre code .hljs-line {
          line-height: 1.5em;
          display: block;
        }
        .line-numbers-col {
          line-height: 1.5em;
        }
      `;
      document.head.appendChild(styleElement);
      
      // 将行号添加到pre元素
      preElement.insertBefore(lineNumbersCol, codeBlock);
    });
  }, 800); // 增加延迟时间，确保highlight.js有足够时间处理所有代码块
  */
}); 