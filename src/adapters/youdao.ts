import { Result } from "./adapter";
import sha256 from "../libs/sha256";

class Youdao {

  key: string;

  secret: string;

  word: string = "";

  isChinese: boolean = false;

  results: Result[] = [];

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }

  private buildSign(q: string, salt: string, curtime: string): string {
    const input = q.length > 20
      ? q.slice(0, 10) + q.length + q.slice(-10)
      : q;
    return sha256(`${this.key}${input}${salt}${curtime}${this.secret}`);
  }

  llmBody(word: string): string {
    this.isChinese = this.detectChinese(word);
    this.word = word;

    const from = this.isChinese ? "zh-CHS" : "auto";
    const to = this.isChinese ? "en" : "zh-CHS";
    const salt = Math.floor(Math.random() * 10000).toString();
    const curtime = Math.floor(Date.now() / 1000).toString();
    const sign = this.buildSign(word, salt, curtime);

    return new URLSearchParams({
      appKey: this.key,
      salt,
      signType: "v3",
      sign,
      curtime,
      i: word,
      handleOption: "0",
      from,
      to,
      streamType: "full",
    }).toString();
  }

  parse(llmText: string): Result[] {
    const result = this.parseSSE(llmText);
    if (result) {
      const segments = this.splitByPunctuation(result);
      const pronounce = this.isChinese ? result : this.word;
      segments.forEach((seg, i) => {
        const sub = segments.length > 1
          ? `有道翻译 (${i + 1}/${segments.length})`
          : "有道翻译";
        this.addResult(seg, sub, seg, pronounce, result);
      });
    } else {
      this.addResult("👻 翻译出错啦", "未获取到翻译结果", "Ooops...");
    }

    return this.results;
  }

  private splitByPunctuation(text: string): string[] {
    if (text.length <= 60) return [text];

    // 按句末标点拆分：。. ！! ？? ；; \n
    // 不拆分：引号 "" '' 括号 （）() 《》 【】 等
    const segments: string[] = [];
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];
      if (/[。.!！？?；;\n]/.test(text[i])) {
        const trimmed = current.trim();
        if (trimmed) {
          segments.push(trimmed);
          current = "";
        }
      }
    }

    // 剩余内容
    const remaining = current.trim();
    if (remaining) {
      // 如果剩余太长，按逗号拆分
      if (remaining.length > 60 && segments.length > 0) {
        const last = segments[segments.length - 1];
        segments[segments.length - 1] = last + remaining;
      } else {
        segments.push(remaining);
      }
    }

    return segments.length > 0 ? segments : [text];
  }

  private parseSSE(text: string): string | null {
    let lastFull = "";
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.startsWith("data:")) {
        try {
          const json = JSON.parse(line.slice(5).trim());
          if (json.code === "0" && json.data && json.data.transFull) {
            lastFull = json.data.transFull;
          }
        } catch (_) {}
      }
    }
    return lastFull || null;
  }

  private addResult(title: string, subtitle: string, arg: string = "", pronounce: string = "", fullText?: string): Result[] {
    const quicklookurl = "https://www.youdao.com/w/" + this.word;
    this.results.push({ title, subtitle, arg, pronounce, quicklookurl, fullText });
    return this.results;
  }

  private detectChinese(word: string): boolean {
    return /^[一-龥]+$/.test(word);
  }
}

export default Youdao;
