# Tarefas de Implementação - Climax

Baseado nos requisitos descritos em [requirements.md](/home/ubuntu/Documents/learning-programming/projects/climax/docs/requirements.md). Este documento divide a implementação em blocos progressivos, com critérios de aprovação claros para cada etapa. As tarefas devem ser executadas em ordem e validadas antes de avançar para a próxima.

## Ordem de execução sugerida

- [x] 1. Configurar a base do projeto e a estrutura de arquivos
  - Contexto: O projeto deve seguir a arquitetura e padrões descritos em [requirements.md](/home/ubuntu/Documents/learning-programming/projects/climax/docs/requirements.md), especialmente os itens de tecnologias, organização de módulos e separação de responsabilidades.
  - Critério de aprovação:
    - Vite configurado e funcionando localmente.
    - Estrutura inicial criada com HTML, CSS e TypeScript separados.
    - Arquivos organizados por responsabilidade (API, tipos, utilitários, renderização, temas/idiomas).
    - CSS externo em arquivo dedicado e sem inline styles.
    - Projeto pronto para receber a lógica de clima sem quebra inicial.

- [x] 2. Definir tipos, mapeamento de dados e utilitários de OpenMeteo
  - Contexto: A implementação deve validar entradas, tratar ausência de dados e transformar respostas da API em estruturas tipadas reutilizáveis.
  - Critério de aprovação:
    - Criados tipos TypeScript para cidade, clima atual, previsão e highlights.
    - Funções de conversão e interpretação de weather codes implementadas.
    - Mapeamentos de traduções/descrições centralizados e reutilizáveis.
    - Validação de parâmetros de busca e tratamento de resposta vazia/nula em funções de API.
    - Lógica do OpenMeteo isolada em módulo específico sem mistura com renderização.

- [x] 3. Implementar busca por cidade e feedback de carregamento/erro
  - Contexto: A busca por cidade é o fluxo principal de uso da aplicação, conforme os requisitos funcionais e os estados de loading/erro.
  - Critério de aprovação:
    - Campo de busca funcional com entrada de texto e botão de ação.
    - Consulta de geocodificação via OpenMeteo realizada com validação de input.
    - Estado de carregamento visível durante a pesquisa.
    - Mensagem amigável para cidade não encontrada.
    - Mensagem clara para falha de requisição ou ausência de dados.
    - UI continua operando sem quebrar quando a consulta falha.

- [x] 4. Implementar geolocalização do usuário e tratamento de permissões
  - Contexto: A localização automática deve usar a API de geolocalização do navegador quando disponível e manter a aplicação estável quando a permissão for negada.
  - Critério de aprovação:
    - Botão de geolocalização visível e posicionado conforme o layout esperado.
    - API de geolocalização chamada somente após consentimento explícito.
    - Quando permitido, usa a posição atual para consultar o clima.
    - Quando negado ou indisponível, exibe mensagem amigável sem bloquear o restante da aplicação.
    - Estado de carregamento e erro tratados consistentemente com a busca manual.

- [x] 5. Construir painel principal do clima atual
  - Contexto: O painel principal deve apresentar os dados essenciais do clima atual, integrando localização, temperatura, condições e indicadores de tempo.
  - Critério de aprovação:
    - Exibe temperatura atual, cidade, estado, país, data e indicação de dia/noite.
    - Mostra código meteorológico interpretado em texto legível para o usuário.
    - Inclui umidade, temperatura aparente, precipitação, velocidade e direção do vento.
    - Layout visual refinado, legível e consistente com a identidade do projeto.
    - Dados renderizados a partir do estado da aplicação, sem hardcoded values.

- [x] 6. Implementar previsão dos próximos sete dias
  - Contexto: A seção de previsão semanal deve exibir uma visão geral do clima dos 7 dias seguintes com indicadores visuais e valores de mínima/máxima.
  - Critério de aprovação:
    - Lista de 7 dias renderizada corretamente com dia da semana e condição climática.
    - Cada cartão mostra temperatura máxima e mínima.
    - Ícones/emoji e texto complementam a informação sem substituir conteúdo essencial.
    - Layout responsivo e organizado em mobile e desktop.
    - Dados chegam corretamente da API transformada para apresentação.

- [x] 7. Implementar highlights do dia e detalhes complementares
  - Contexto: A área “Today’s Highlights” reúne métricas adicionais do clima e deve estar funcional e legível em todas as telas.
  - Critério de aprovação:
    - Cards exibindo UV Index, Wind Status, Sunrise & Sunset, Humidity, Visibility e Air Quality.
    - Layout visual com destaque e leitura clara.
    - Formatação das datas/horas e unidades adequadas para o contexto.
    - Dados tratados com fallback para ausência de informações.
    - Sem overflow ou quebra de layout em telas menores.

- [x] 8. Implementar temas claro, escuro e do sistema
  - Contexto: A aplicação deve oferecer personalização visual e aderir à preferência do sistema quando não houver escolha manual.
  - Critério de aprovação:
    - Suporte aos temas light, dark e system.
    - Aplicação automática do tema do sistema quando a opção não for definida manualmente.
    - Boa legibilidade e contraste em todos os modos.
    - Controle visual de troca de tema acessível e visível.
    - Persistência ou comportamento consistente ao recarregar a aplicação.

- [x] 9. Implementar tradução e troca de unidade de temperatura
  - Contexto: A experiência deve estar disponível em português, inglês e espanhol, com suporte a Celsius/Fahrenheit.
  - Critério de aprovação:
    - Traduções dos textos fixos e estados da interface aplicadas em pt-BR, en-US e es.
    - Linguagem padrão seguindo preferência do navegador/sistema quando não definida manualmente.
    - Alternância entre °C e °F refletida em toda a interface relevante.
    - Componentes de idioma e unidade acessíveis e visíveis.
    - Conversões consistentes e sem inconsistência entre dados e labels.

- [x] 10. Garantir responsividade, acessibilidade e qualidade visual
  - Contexto: A interface deve funcionar bem em mobile first, seguir técnicas de UX e acessibilidade, e manter identidade própria inspirada no mockup referenciado.
  - Critério de aprovação:
    - Layout mobile-first com base em uma coluna e evolução para telas maiores.
    - Breakpoints em linha com TailwindCSS (sm, md, lg, xl, 2xl) considerados no CSS.
    - Contraste adequado, foco visível em elementos interativos e semântica HTML adequada.
    - Uso de labels, headings e estrutura semântica corretos.
    - Nenhum problema visível de overflow, cortes ou compressão em tamanhos de tela comuns.

- [x] 11. Realizar revisão final de segurança, performance e manutenibilidade
  - Contexto: Antes de considerar a entrega concluída, a aplicação deve passar por checagens de robustez, confiabilidade e organização do código.
  - Critério de aprovação:
    - Geolocalização usada somente com permissão explícita e dados sensíveis não persistidos sem necessidade.
    - Tratamento de falhas da API e respostas inválidas funcionando sem quebrar a interface.
    - Código bem modularizado, reutilizável e preparado para futuras expansões.
    - Performance aceitável sem uso excessivo de recursos ou requisições redundantes.
    - Projeto atende aos critérios de aceitação do documento de requisitos e está pronto para revisão final.

## Observações

- Esta lista é incremental e progressiva; cada tarefa deve ser validada antes da próxima.
- Sempre que necessário, consulte os requisitos detalhados em [requirements.md](/home/ubuntu/Documents/learning-programming/projects/climax/docs/requirements.md) para confirmar comportamento esperado e critérios de aceitação.
- O objetivo é manter a implementação rastreável, divisível e pronta para execução por agentes de IA em etapas menores e verificáveis.
