
'use strict';
const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'view');

const ESCAPE_REG = /["&'<>]/;

class RenderClass {
  constructor(opt = {}) {
    this.opt = Object.assign({
      rootName: 'root',
      baseDir,
      cache: true,
    }, opt);
    this.cacheKeys = {};
    // 不缓存，需要监听文件变化
    if (!this.opt.cache) {
      console.log('cache: false, 开启view watch:');
      fs.watch(this.opt.baseDir, {
        recursive: true,
      }, (eventType, filename) => {
        console.log(`view watch: eventType:${eventType} filename: ${filename}`);
        if (filename) {
          this.cacheKeys[filename] = null;
        }
      });
    }
  }
  async include() {
    return await this.render(...arguments);
  }
  async render(file, data) {
    file = file.replace(/\//, '');
    if (!this.cacheKeys[file] || !this[file]) {
      let fileStr = await this.getFileStr(file);
      fileStr = fileStr.replace(/\\/g, '\\\\');
      // fileStr = fileStr.replace(/\${([^}]+)}/g, function ($1, $2) {
      //   return `\${this._escape(${$2})\}`;
      // });

      const funStr = 'const renderFun =  async function('+ this.opt.rootName +') {var scope = {}, _ = this, e = this.escape; return `' + fileStr + '`}; return renderFun;';
      let renderFun = new Function(funStr);
      renderFun = renderFun();
      this[file] = renderFun;
      this.cacheKeys[file] = true;
      console.log(`更新renderFun: ${file}`);
    }
    const re = this[file](data);
    return re;
  }
  renderString(fileStr, data) {
    if (!this.cacheKeys[fileStr] || !this[fileStr]) {
      fileStr = fileStr.replace(/\\/g, '\\\\');
      // fileStr = fileStr.replace(/\${([^}]+)}/g, function ($1, $2) {
      //   return `\${this._escape(${$2})\}`;
      // });
      const funStr = 'const renderFun =  async function('+ this.opt.rootName +') {var scope = {}, _ = this, e = this.escape; return `' + fileStr + '`}; return renderFun;';
      let renderFun = new Function(funStr);
      renderFun = renderFun();
      this[fileStr] = renderFun;
      this.cacheKeys[fileStr] = true;
      console.log(`更新renderFun: ${fileStr}`);
    }
    const re = this[fileStr](data);
    return new Promise((resolve, reject) => {
      resolve(re);
    });
  }
  async getFileStr(file) {
    file = path.join(this.opt.baseDir, file);
    return new Promise((resolve, reject) => {
      // 自运行返回Promise

      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString('utf-8'));
        }
      });
    });
  }
  // 编码 HTML 内容
  escape(content) {
    var html = '' + content;
    var regexResult = ESCAPE_REG.exec(html);
    if (!regexResult) {
      return content;
    }

    var result = '';
    var i = void 0,
      lastIndex = void 0,
      char = void 0;
    for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
      switch (html.charCodeAt(i)) {
        case 34:
          char = '&#34;';
          break;
        case 38:
          char = '&#38;';
          break;
        case 39:
          char = '&#39;';
          break;
        case 60:
          char = '&#60;';
          break;
        case 62:
          char = '&#62;';
          break;
        default:
          continue;
      }

      if (lastIndex !== i) {
        result += html.substring(lastIndex, i);
      }

      lastIndex = i + 1;
      result += char;
    }

    if (lastIndex !== i) {
      return result + html.substring(lastIndex, i);
    } else {
      return result;
    }
  }
}

class SubRender extends RenderClass {
  constructor(opt) {
    super(opt)
  }
}

module.exports = RenderClass;
