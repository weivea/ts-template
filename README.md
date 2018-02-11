# ts-template

嘿嘿嘿，一个基于模板字符串的模板引擎的最简实现~, 只适用于node环境，

## usage 使用

模板字符串的语法，发挥想象吧，嘿嘿嘿~

```

```


test.js

```javascript
const RenderClass = require('ts-template');

const renderVm = new RenderClass({
  rootName: 'root', // 数据跟字段 defaut: 'root'
  baseDir: '' // 模板根目录 defaut: path.join(process.cwd(), 'view');
  cache: true, // 是否缓存 defaut: true
})

renderVm.render('test.html', data)
renderVm.renderString('<div>${root.a} + ${root.b} = ${root.a + root.b}</div>', {
  a:1,
  b:2
})

```

test.html

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <title>ts-template</title>
  <style type="text/css">
    body {
      background: rebeccapurple;
    }
  </style>
  <script>
    var a = ${root.a};
  </script>
</head>

<body>
  include模板:
  ${await this.include('aa.html')}
  <div>嘿嘿嘿</div>
  1341<br>

  转意:
  ${e(root.b)}

  自运行函数:
  ${(() => { return 'adadfadfasdf' })()}
</body>

</html>
```

## extension 扩展

```javascript
const RenderClass = require('ts-template');
class SubRenderClass extends RenderClass {
  constructor(opt) {
    super(opt)
  }
  // format函数
  dateFormat(data, 'yyyy-MM-dd') {
    // ...
  }
  // async 函数
  async getFileData(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString('utf-8'));
        }
      });
    });
  }
} 
const renderVm = new SubRenderClass({
  rootName: 'root', // 数据跟字段 defaut: 'root'
  baseDir: '' // 模板根目录 defaut: path.join(process.cwd(), 'view');
  cache: true, // 是否缓存 defaut: true
})

renderVm.renderString('<div>${_.dateFormat(root.time)}</div> <div>${await _.getFileData(root.file)}</div>', {
  time: 1518344445732,
  file: '/path/to/file.txt'
})
// 或者
renderVm.renderString('<div>${this.dateFormat(root.time)}</div> <div>${await this.getFileData(root.file)}</div>', {
  time: 1518344445732,
  file: '/path/to/file.txt'
})
```