# ComplianceOne — Manual de UI e UX

Este manual documenta a linguagem visual usada no ComplianceOne para ser reutilizada em novas aplicações frontend.

## 1. Princípios

- **Clareza antes de decoração:** cada tela deve ter um título, uma ação principal e um próximo passo evidente.
- **Confiança:** use espaço, hierarquia e mensagens objetivas em fluxos sensíveis.
- **Consistência:** reutilize os mesmos botões, campos, cards, badges e estados.
- **Acessibilidade:** todos os controles devem ter foco visível, contraste adequado e rótulos claros.
- **Responsividade:** comece pelo celular e expanda para tablet e desktop.

## 2. Identidade visual

### Cores

| Token | Hexadecimal | Uso |
|---|---|---|
| `navy` | `#0B1F3A` | Ações principais, navegação e marca |
| `slate-900` | `#0F172A` | Títulos e texto principal |
| `slate-700` | `#334155` | Texto secundário forte |
| `slate-600` | `#475569` | Texto de apoio |
| `slate-400` | `#94A3B8` | Labels auxiliares e metadados |
| `slate-200` | `#E2E8F0` | Bordas |
| `slate-100` | `#F1F5F9` | Superfícies secundárias |
| `slate-50` | `#F8FAFC` | Fundo geral |
| `emerald-600` | Tailwind | Sucesso e concluído |
| `amber-600` | Tailwind | Atenção e análise |
| `red-600` | Tailwind | Erros e ações destrutivas |

Evite criar novas cores sem necessidade. Prefira os tokens existentes do Tailwind.

### Tipografia

- Fonte padrão: `Inter`, com fallback `sans-serif`.
- Título de página: `text-3xl font-extrabold tracking-tight`.
- Título de seção: `text-xl font-bold`.
- Texto principal: `text-slate-800` ou `text-slate-900`.
- Texto auxiliar: `text-sm text-slate-500`.
- Label: `text-xs font-bold uppercase tracking-widest text-slate-400`.

## 3. Espaçamento e layout

- Container desktop: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Conteúdo de formulário: `max-w-2xl mx-auto`.
- Espaçamento entre seções: `space-y-8` ou `py-20`.
- Grid padrão: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
- Use `p-6` para cards compactos e `p-8`/`p-10` para formulários importantes.

## 4. Componentes

### Card

```html
<div class="card-premium p-6 bg-white">
  <h2 class="text-xl font-bold text-slate-900">Título</h2>
  <p class="text-sm text-slate-500 mt-2">Descrição curta.</p>
</div>
```

`card-premium` fornece fundo branco, borda sutil, cantos arredondados e elevação discreta.

### Botões

Use `app-button` sempre que possível:

```html
<app-button>Salvar</app-button>
<app-button variant="secondary">Cancelar</app-button>
<app-button variant="outline">Detalhes</app-button>
<app-button variant="danger">Excluir</app-button>
<app-button [loading]="saving" [disabled]="form.invalid">Enviar</app-button>
```

Regras:

- Uma ação primária por área.
- `danger` somente para ações destrutivas.
- O botão deve mostrar loading durante requisições.
- Nunca esconda uma falha apenas desabilitando o botão.

### Campos

```html
<app-input
  label="E-mail"
  type="email"
  formControlName="email"
  placeholder="seu@email.com"
  [error]="emailError">
</app-input>
```

Todo campo deve ter label visível, placeholder auxiliar e mensagem de erro específica.

### Status

Use badges com texto, nunca apenas cores. Estados recomendados:

- azul: recebido/triagem;
- âmbar: em análise;
- verde: concluído;
- vermelho: cancelado ou erro.

## 5. Fluxos e feedback

- Mostre skeleton durante carregamento de listas e cards.
- Mostre estado vazio quando não houver dados.
- Diferencie erro de validação, erro de permissão e erro de conexão.
- Após uma ação bem-sucedida, exiba toast curto e objetivo.
- Em fluxos críticos, confirme a ação antes de desativar ou excluir.
- Após criar um registro, ofereça uma ação de continuidade, como copiar protocolo ou consultar status.

## 6. Responsividade

- Nunca dependa de tabelas largas no celular sem `overflow-x-auto`.
- Use sidebar fixa apenas em desktop; no mobile, transforme-a em menu recolhível.
- Ações lado a lado devem virar coluna em `sm`.
- Mantenha áreas clicáveis com pelo menos aproximadamente 44px.
- Teste em 360px, 768px e 1280px.

## 7. Acessibilidade

- Todo botão somente com ícone precisa de `aria-label`.
- Todo input precisa de label associado.
- Use `type="button"` em botões que não submetem formulários.
- Mantenha foco visível com `focus:ring-*`.
- Não use apenas cor para comunicar status.
- Mensagens de erro devem aparecer próximas ao campo.
- Evite texto em caixa alta para frases longas; reserve uppercase para labels curtos.

## 8. Checklist antes de publicar

- [ ] Build de produção concluído sem erros.
- [ ] Fluxo principal testado em desktop e celular.
- [ ] Loading, sucesso, erro e estado vazio revisados.
- [ ] Botões e links possuem foco e rótulos acessíveis.
- [ ] Nenhum segredo está no frontend ou no repositório.
- [ ] API e proxy foram testados no mesmo domínio de produção.
- [ ] Mensagens estão em português claro e consistente.

