(function($) {
  // 缓存DOM查询结果
  let cachedElements = new Map();
  
  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 计算标签权重
  function calculateWeights(elements) {
    const weights = elements.map(el => parseInt($(el).attr("rel")) || 0);
    return {
      min: Math.min(...weights),
      max: Math.max(...weights),
      range: Math.max(...weights) - Math.min(...weights) || 1
    };
  }

  // RGB颜色转换
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }

  // Hex颜色转换为RGB
  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // 计算颜色渐变
  function calculateColor(startColor, endColor, weight, range) {
    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);
    if (!start || !end) return startColor;

    const r = Math.round(start.r + (end.r - start.r) * (weight / range));
    const g = Math.round(start.g + (end.g - start.g) * (weight / range));
    const b = Math.round(start.b + (end.b - start.b) * (weight / range));

    return rgbToHex(
      Math.min(255, Math.max(0, r)),
      Math.min(255, Math.max(0, g)),
      Math.min(255, Math.max(0, b))
    );
  }

  // 计算字体大小
  function calculateSize(start, end, weight, range, unit) {
    const size = start + ((end - start) * weight) / range;
    return Math.min(end, Math.max(start, size)) + unit;
  }

  // 主函数
  $.fn.tagcloud = function(options) {
    const opts = $.extend({}, $.fn.tagcloud.defaults, options);
    const elements = this.get();
    
    if (elements.length === 0) return this;
    
    // 计算权重
    const weights = calculateWeights(elements);
    
    // 更新样式
    const updateStyles = debounce(() => {
      elements.forEach(el => {
        const $el = $(el);
        const weight = parseInt($el.attr("rel")) - weights.min;
        
        // 应用样式
        const styles = {};
        
        if (opts.size) {
          styles["font-size"] = calculateSize(
            opts.size.start,
            opts.size.end,
            weight,
            weights.range,
            opts.size.unit
          );
        }
        
        if (opts.color) {
          styles.color = calculateColor(
            opts.color.start,
            opts.color.end,
            weight,
            weights.range
          );
        }
        
        $el.css(styles);
      });
    }, 16); // 约60fps的更新频率
    
    // 初始更新
    updateStyles();
    
    // 监听窗口大小变化
    $(window).on("resize", updateStyles);
    
    return this;
  };

  // 默认配置
  $.fn.tagcloud.defaults = {
    size: {
      start: 14,
      end: 28,
      unit: "px"
    },
    color: {
      start: "#6c757d",
      end: "#212529"
    }
  };
})(jQuery);
