module Jekyll
    module AutoSpacing
      def auto_spacing(input)
        input.gsub(/([\u4e00-\u9fa5])([a-zA-Z0-9])/,'\1 \2')
             .gsub(/([a-zA-Z0-9])([\u4e00-\u9fa5])/,'\1 \2')
      end
    end
  end
  
Liquid::Template.register_filter(Jekyll::AutoSpacing)  