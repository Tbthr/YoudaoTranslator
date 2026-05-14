import { Result } from "../adapters/adapter";
import Item from "./item";

class Workflow {

  private results: any[] = [];

  compose(results: Result[]): this {
    this.results = results.map(r => {
      const icon = r.arg.startsWith("~") ? 'assets/translate-say.png' : 'assets/translate.png';
      return new Item().setTitle(r.title)
      .setSubtitle(r.subtitle)
      .setArg(r.arg)
      .setIcon(icon)
      .setCmd('🔊 ' + r.pronounce, r.pronounce)
      .setAlt('📣 ' + r.pronounce, r.pronounce)
      .setCopy(r.fullText || r.arg)
      .setLargetype(r.fullText || r.arg)
      .setQuicklookurl(r.quicklookurl)
      .result();
    });

    return this;
  }

  output(): string {
    return JSON.stringify({ items: this.results });
  }
}

export default Workflow;
