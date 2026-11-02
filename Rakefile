task :default => :generate

desc 'Create new post with rake "post[post-name]"'
task :post, [:title] do |t, args|
  if args.title then
    new_post(args.title)
  else
    puts 'rake "post[post-name]"'
  end
end

# 原来这里挂着一个 :scss 任务，调外部 `scss` 二进制把 style.scss 编成 style.css。
# 两个文件内容一模一样、也没有用到任何 SCSS 语法，现在只留 media/css/style.css。
desc 'Build site with Jekyll'
task :generate => :clean do
  sh 'bundle exec jekyll build'
end

desc 'Start server'
task :server do
  sh 'bundle exec jekyll serve'
end

# 正文（中英文）切 OPPO Sans 子集；代码切 Commit Mono。新文章加了未见过的汉字就重跑一次。
desc 'Rebuild the self-hosted webfonts from tools/fonts-src'
task :fonts do
  sh "uvx --from 'fonttools==4.64.0' --with brotli python3 tools/build_fonts.py"
end

desc 'Deploy with rake "deploy[comment]"'
task :deploy, [:comment] => :generate do |t, args|
  message = args.comment || 'new deployment'
  sh "git commit . -m '#{message}' && git push"
end

desc 'Clean up'
task :clean do
  rm_rf '_site'
end

def new_post(title)
  time = Time.now
  filename = "_posts/" + time.strftime("%Y-%m-%d-") + title + '.markdown'
  if File.exist? filename then
    puts "Post already exists: #{filename}"
    return
  end
  uuid = `uuidgen | tr "[:upper:]" "[:lower:]" | tr -d "\n"`
  File.open(filename, "wb") do |f|
    f << <<-EOS
---
title: #{title}
layout: post
guid: urn:uuid:#{uuid}
tags:
  -
---


EOS
  %x[echo "#{filename}" | pbcopy]
  end
  puts "created #{filename}"
  `git add #{filename}`
end
