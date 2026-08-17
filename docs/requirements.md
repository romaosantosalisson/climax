# Requisitos do Sistema - Climax

## 1. Visão Geral

O sistema é uma aplicação web de clima desenvolvida com Vite, HTML5, CSS3 e TypeScript puro, com foco em usabilidade, responsividade e apresentação visual moderna. A interface permite que o usuário pesquise uma cidade, visualize o clima atual e a previsão dos próximos sete dias, além de consultar informações complementares como UV Index, vento, umidade, visibilidade, qualidade do ar, nascer e pôr do sol.

A aplicação deve seguir a inspiração visual de um arquivo de referência, mas com adaptações para evitar cópia direta. A identidade visual deve ser refinada com tipografia, logo e composição visual originais, mantendo a sensação da referência sem reprodução literal.

## 2. Objetivo do Projeto

Permitir que o usuário:

- consulte o clima de uma cidade por busca manual;
- identifique automaticamente a localização do usuário via botão de geolocalização;
- veja o clima atual com indicadores relevantes;
- visualize a previsão semanal;
- alterne entre temas claro, escuro e o tema do sistema;
- alterne entre idiomas e unidades de temperatura;
- tenha uma experiência fluidas e responsiva em mobile e desktop.

## 3. Requisitos Funcionais

### 3.1 Busca por cidade

- O usuário deve digitar o nome da cidade em um campo de busca.
- A busca deve disparar a consulta pela cidade utilizando a API de geocodificação do OpenMeteo.
- O sistema deve considerar os dados retornados: nome, latitude, longitude, país e timezone.
- Caso a cidade não seja encontrada, a interface deve exibir um estado vazio ou mensagem de “Nenhum resultado encontrado”.
- A busca deve apresentar feedback de carregamento enquanto a consulta está em andamento.

### 3.2 Geolocalização do usuário

- Deve existir um botão à direita do campo de busca para detectar a localização do usuário automaticamente.
- O botão deve usar a API de geolocalização do navegador, se disponível.
- Quando o usuário permitir o acesso, o sistema deve usar a localização atual para consultar o clima correspondente.
- Caso o usuário negue a permissão ou o navegador não suporte a funcionalidade, a aplicação deve exibir uma mensagem amigável e continuar operando normalmente.

### 3.3 Consulta de clima atual

- O sistema deve realizar duas requisições em sequência:
  1. busca da cidade por nome para obter latitude, longitude e timezone;
  2. busca das condições climáticas da localização obtida.
- A interface deve tratar essa sequência como uma única ação para o usuário, com carregamento intercalado.
- O painel principal deve mostrar informações essenciais do clima atual, como:
  - temperatura atual;
  - nome da cidade;
  - nome do estado
  - código do país;
  - dia atual;
  - indicação de dia ou noite;
  - código meteorológico interpretado;
  - umidade relativa;
  - temperatura aparente;
  - probabilidade de precipitação;
  - velocidade e direção do vento.

### 3.4 Interpretação do weather code

- O sistema deve converter os códigos do OpenMeteo em descrições legíveis para o usuário, como:
  - clear sky;
  - mainly clear;
  - partly cloudy;
  - overcast;
  - fog;
  - drizzle;
  - rain;
  - snow;
  - thunderstorm.
- A interpretação deve ser exibida em texto amigável na interface.

### 3.5 Previsão para os próximos sete dias

- A aplicação deve exibir a previsão climática dos sete dias seguintes.
- Cada item da previsão deve conter:
  - dia da semana;
  - condição do clima (sol, chuva, nuvem, etc.);
  - temperatura máxima;
  - temperatura mínima;
  - alguns indicadores visuais por ícones e emojis.
- A previsão deve ser renderizada em cartões ou blocos organizados visualmente.

### 3.6 Highlights / destaques do dia

- A seção “Today’s Highlights” deve apresentar cards com os dados adicionais do clima, incluindo:
  - UV Index;
  - Wind Status;
  - Sunrise & Sunset;
  - Humidity;
  - Visibility;
  - Air Quality.
- Esses cards devem ter destaque visual, com layout claro e de fácil leitura.

### 3.7 Tema claro e escuro

- A aplicação deve suportar os temas:
  - light;
  - dark;
  - system, seguindo a preferência do sistema operacional do usuário.
- O tema deve ser aplicado automaticamente conforme as configurações do sistema quando o usuário não definir uma preferência manual.
- O visual deve manter boa legibilidade e contraste em ambos os temas.

### 3.8 Tradução

- A aplicação deve estar disponível em pelo menos três idiomas:
  - Português (pt-BR);
  - Inglês (en-US);
  - Espanhol (es).
- Os textos fixos da interface, mensagens de carregamento, estados vazios e rótulos devem estar traduzidos.
- A linguagem padrão pode seguir a preferencia do navegador ou do sistema operacional.

### 3.9 Unidades de temperatura

- O usuário deve poder alternar entre temperatura em Celsius e Fahrenheit.
- A conversão deve refletir em toda a interface onde a temperatura for exibida.
- O componente de troca de unidade deve ser acessível e visível.

### 3.10 Empty State e estados de erro

- A aplicação deve ter estados visuais para:
  - carregamento;
  - cidade não encontrada;
  - erro de requisição;
  - ausência de dados;
  - permissão de geolocalização negada.
- O empty state deve ser amigável, com texto claro e orientações de uso.

### 3.11 Layout e identidade visual

- A interface deve ter um painel centralizado com largura máxima definida para desktop.
- O fundo geral pode ser em tons escuros, com a área principal em destaque em uma caixa central com bordas arredondadas.
- O design deve ter inspiração no arquivo de referência, mas não pode ser uma cópia fiel.
- Deve ser aplicável a diferentes tamanhos de tela, preservando clareza e organização dos conteúdos.

### 3.12 Acessibilidade e UX

- Deve haver contraste adequado entre texto e fundo.
- Ícones e emojis devem complementar a informação, não substituir texto essencial.
- Os botões e campos devem ter foco visível.
- O layout deve ser legível em mobile, tablet e desktop.
- A aplicação deve ter uma semântica HTML adequada com uso de labels, headings e estrutura clara.

## 4. Requisitos Não Funcionais

### 4.1 Tecnologias e arquitetura

- O projeto deve ser desenvolvido com Vite como bundler.
- A base deve utilizar HTML5, CSS3 e TypeScript puro.
- Todo o CSS deve ficar em um arquivo dedicado, preferencialmente styles.css.
- Não deve haver CSS inline em elementos HTML.
- A manipulação do DOM deve ser tipada em TypeScript, com uso de tipos apropriados criados na pasta types com nomes descritivos.
- O código deve ser organizado em módulos e funções reutilizáveis.

### 4.2 Estrutura e organização do código

- O sistema deve separar responsabilidades entre:
  - consumo de API;
  - transformação de dados;
  - renderização em tela;
  - temas e idiomas;
  - estados de loading e erro;
  - utilitários de conversão e formatação.
- As funções da OpenMeteo devem validar parâmetros antes de realizar chamadas, tratando ausência de dados como falha controlada.

### 4.3 Performance

- A aplicação deve carregar rapidamente e evitar requisições desnecessárias.
- A busca deve mostrar feedback imediato de carregamento.
- O uso de ícones e emojis deve ser otimizado para não impactar negativamente a performance.
- O projeto deve priorizar renderização leve e baixa latência.

### 4.4 Confiabilidade da API

- O sistema deve tratar falhas da API OpenMeteo com mensagens claras para o usuário.
- Caso a pesquisa falhe, a interface não deve quebrar.
- Deve sanitizar o `input:search`
- A aplicação deve validar respostas vazias, nulas e inconsistentes.

### 4.5 Responsividade mobile-first

- O desenvolvimento deve seguir o padrão mobile-first como regra principal.
- O layout base deve ser otimizado para dispositivos móveis e, a partir daí, evoluir para telas maiores.
- Os componentes devem possuir espaçamento, tamanho de fonte e organização adequados para leitura em telas pequenas.
- O layout deve evitar overflow, cortes e compressão excessiva de textos.

### 4.6 Media queries no padrão do TailwindCSS

- A adaptação de layout deve seguir os breakpoints do TailwindCSS, mesmo que o projeto não use Tailwind como framework principal, como referência visual e de responsividade:
  - sm: 640px;
  - md: 768px;
  - lg: 1024px;
  - xl: 1280px;
  - 2xl: 1536px.
- A lógica de responsividade pode ser descrita como:
  - base: mobile-first;
  - sm: ajustes para tablet pequeno;
  - md: reorganização de cards e sidebar;
  - lg: layout em duas colunas e maior densidade de informação;
  - xl: refinamento de espaçamento e proporções.
- Em termos práticos, o design deve começar mobile com uma coluna única e expandir conforme a tela cresce.

### 4.7 Uso de biblioteca de ícones

- A biblioteca recomendada é Lucide, por ser leve, moderna, consistente e amplamente usada em interfaces web.
- Os ícones devem ser usados para representar clima, vento, umidade, sol, chuva, neve, local, busca e outros elementos do sistema.
- Para o índice UV usar gráfico no padrão do design mencionado
- A escolha da biblioteca deve priorizar legibilidade, estética e desempenho.

### 4.8 Uso de emojis

- Emojis devem ser incorporados de maneira moderada e funcional, principalmente para reforçar o estado do clima, como:
  - ☀️ sol;
  - 🌧️ chuva;
  - ☁️ nuvem;
  - ❄️ neve;
  - 🌙 lua;
  - 🌬️ vento;
  - 💧 umidade;
  - 📍 localização;
  - 🔍 busca.
  - 🖥️ tema do sistema
- Os emojis devem apoiar o entendimento visual do conteúdo sem substituir completamente os textos.

### 4.9 Manutenibilidade

- O código deve ser fácil de evoluir para novos recursos.
- Dados fixos, traduções e mapeamentos de clima devem estar centralizados e reutilizáveis.
- A estrutura deve permitir futuras integrações com outros provedores de clima, caso necessário.

### 4.10 Segurança e privacidade

- O acesso à geolocalização deve ocorrer somente com permissão explícita do usuário.
- Dados sensíveis, como localização atual, devem ser usados apenas para fins de consulta climática.
- Não devem ser armazenados dados de localização sem necessidade.

## 5. Critérios de Aceitação

A aplicação será considerada atendida quando:

1. o usuário conseguir buscar uma cidade e visualizar o clima atual;
2. a busca por geolocalização funcionar quando permitido;
3. a previsão dos próximos sete dias seja mostrada corretamente;
4. os highlights do dia apareçam com os dados esperados;
5. o projeto suporte temas claro, escuro e do sistema;
6. a aplicação esteja em pt-BR, en-US e es;
7. a unidade de temperatura possa ser trocada entre C° e F°;
8. o layout funcione bem em mobile e em telas maiores;
9. o comportamento em caso de erro e ausência de dados seja amigável;
10. o CSS esteja em arquivo externo e o TypeScript seja usado com tipagem no DOM.

## 6. Resumo Executivo

O projeto Climax deve funcionar como um dashboard climático moderno, com foco em mobile-first, simplicidade visual e boa experiência do usuário. Ele deve consumir a API OpenMeteo, apresentar clima atual e previsão semanal, permitir busca por cidade ou geolocalização, além de oferecer acessibilidade, responsividade e personalização por tema, idioma e unidade de temperatura.

O desenvolvimento deve seguir as boas práticas de front-end com Vite, TypeScript, CSS externo e arquitetura organizada, priorizando uma solução leve, acessível e visualmente agradável em qualquer dispositivo.
