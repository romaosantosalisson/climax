# Climax

Este projeto deve ser possível pegar a cidade do usuário via `input:search` e o design como tipografia e logo devem ser feitos como base (não deve ser igual para isso aplique algumas mudanças) no arquivo design-inspiration.png.

## Aspectos Técnicos

O projeto deve usar Vite(bundler), HTML5, CSS3 e Vanilla TYpeScript.

**Observações:** Não aplique CSS inline todo CSS deve ficar no arquivo styles.css (use classes, IDs, pseudo-classes e pseudo-elementos) e use a tipagem do TypeScript na manipulação do DOM.

### API Usada

#### Pegar o Clima do dia Atual (Current Today Weather)

Vamos usar a API OpenMeteo, com os endpoints abaixo:
https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json

{NOME_DA_CIDADE}: Nome da cidade pega no input do usuário

**Observações:** Pegue também o clima do usuário (Identificando-o automaticamente) através de um botão ao lado direito do `input:search`.

#### Pegar a Previsão do Clima para os Últimos Sete Dias

Pegue também através da API Open-Meteo o clima previsto para os sete dia da semana com os detalhes como o dia, se está fazendo sol, chovendo e etc, temperatura máxima e mínima.

Pegue também o UV Index, Wind Status, Sunrise & Sunset, Humidity, Visibility Air Quality coloque os em cards abaixo do titulo Todays's Highlight.

O projeto deve possuir temas escuro(dark), claro(light) e o tema de acordo com tema do sistema do usuário se está claro ou escuro.

Deve Também possuir tradução para Português(pt-BR), Inglês(en-US) e Espanhol(ES).

Deve ser possível ter a temperatura em C° e em F°.
