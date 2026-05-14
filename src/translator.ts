import Youdao from "./adapters";
import redaxios from './libs/redaxios'
import Workflow from './workflow/workflow'

class Translator {

  adapter: Youdao;

  constructor(key: string, secret: string) {
    this.adapter = new Youdao(key, secret);
  }

  public async translate(query: string): Promise<string> {
    const word = query.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    const body = this.adapter.llmBody(word);

    const http = redaxios.create();
    const response = await http.post(
      'https://openapi.youdao.com/proxy/http/llm-trans',
      body,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      }
    );

    const result = this.adapter.parse(response.data);
    return new Workflow().compose(result).output();
  }
}

export default Translator;
