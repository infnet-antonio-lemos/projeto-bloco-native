# CryptoView — Guia de Migração: React Web → React Native (Expo)

> **Projeto de referência (web):** `projeto-bloco-react-native`  
> **Projeto nativo:** `projeto-bloco-native`  
> **Branch:** `feat/tp-4`

---

## 1. Motivação

O app **CryptoView** foi originalmente desenvolvido como uma aplicação web com React + Vite, voltada para desktop e mobile via browser. O objetivo desta migração é reescrever o app para **React Native com Expo**, tornando-o um aplicativo móvel nativo para Android e iOS, mantendo toda a funcionalidade original:

- Listagem de exchanges de criptomoedas  
- Busca e paginação de pares de negociação (Binance e Bybit)  
- Visualização de dados em tempo real: order book, trades recentes e velas (klines)  
- Auto-atualização a cada 5 segundos  

---

## 2. Stack Escolhida

| Camada | Web (original) | React Native (nativo) |
|--------|---------------|----------------------|
| Framework | React 19 + Vite | React Native via **Expo SDK 55** |
| Roteamento | React Router DOM 7 | **Expo Router 55** (file-based routing) |
| Navegação | Sidebar HTML + CSS | **Drawer Navigator** (`@react-navigation/drawer`) |
| Estilização | CSS puro + variáveis CSS | **`StyleSheet.create()`** + `constants/theme.js` |
| Estado | `useState` + `useEffect` | Mesmos hooks — sem mudanças |
| Requisições API | `fetch()` | Mesmos `fetch()` — sem mudanças |
| Listas | `<table>` / `<div>` grid | `<FlatList>` |
| Scroll | `overflow-y: scroll` | `<ScrollView>` |

### Por que Expo Router?

- **File-based routing** espelha o modelo web (arquivos em `app/` = rotas)  
- Suporte nativo a parâmetros dinâmicos (`[symbol].jsx` = `/binance/:symbol`)  
- Integrado com React Navigation internamente  
- Padrão moderno recomendado pela Expo (SDK 50+)  

---

## 3. Pré-Requisitos

```bash
# Node.js 18+
node --version

# Expo CLI (não precisa instalar globalmente, usa npx)
npx expo --version

# Para testar:
# - Android: Android Studio + emulador, OU
# - Expo Go: instalar no celular físico (Android/iOS)
#   → Escanear QR code ao rodar: npx expo start
```

---

## 4. Comandos para Rodar o Projeto

```bash
# Entrar na pasta do projeto nativo
cd projeto-bloco-native

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start

# Executar no Android (emulador ou dispositivo físico via USB)
npx expo start --android

# Executar no navegador web (para testes rápidos)
npx expo start --web
```

---

## 5. Estrutura do Projeto

```
projeto-bloco-native/
├── app/                          ← Rotas (Expo Router file-based)
│   ├── _layout.jsx              ← Root layout com Drawer Navigator
│   ├── index.jsx                ← Tela principal (Exchanges)
│   ├── binance/
│   │   ├── _layout.jsx          ← Stack Navigator da Binance
│   │   ├── index.jsx            ← Lista de pares Binance
│   │   └── [symbol].jsx         ← Detalhes do par (ex: BTCUSDT)
│   └── bybit/
│       ├── _layout.jsx          ← Stack Navigator da Bybit
│       ├── index.jsx            ← Lista de pares Bybit
│       └── [symbol].jsx         ← Detalhes do par
├── components/
│   ├── Exchanges/
│   │   ├── ExchangeCard.jsx     ← Card de cada exchange
│   │   └── ExchangeList.jsx     ← Lista com FlatList
│   ├── Binance/
│   │   ├── BinancePriceList.jsx ← Lista de pares com busca + paginação
│   │   └── BinanceMarketData.jsx← Ordem book + trades + klines
│   ├── Bybit/
│   │   ├── BybitPriceList.jsx
│   │   └── BybitMarketData.jsx
│   └── Shared/
│       ├── MarketData.jsx       ← Tabela de velas (klines)
│       ├── OrderBook.jsx        ← Bids e asks
│       └── RecentTrades.jsx     ← Trades recentes
├── constants/
│   └── theme.js                 ← Design tokens (cores, espaçamento, etc.)
├── data/
│   └── exchanges.js             ← Dados estáticos das exchanges
└── MIGRACAO.md                  ← Este arquivo
```

---

## 6. Mapeamento: Web → React Native

### Elementos HTML → Componentes Nativos

| Web (HTML/JSX) | React Native |
|----------------|-------------|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>`, `<h2>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` ou `<Pressable>` |
| `<input type="text">` | `<TextInput>` |
| `<ul>` / `<table>` | `<FlatList>` |
| `<select>` | Botões nativos com `ScrollView` horizontal |
| `<img>` | `<Image>` |
| `window.alert()` | `Alert.alert()` |
| `overflow-y: scroll` | `<ScrollView>` |

### Roteamento

| Web (React Router) | React Native (Expo Router) |
|--------------------|---------------------------|
| `<Route path="/binance/:symbol">` | Arquivo `app/binance/[symbol].jsx` |
| `useNavigate()` | `useRouter()` → `router.push('/binance')` |
| `useParams()` | `useLocalSearchParams()` |
| `<Navigate to="/" />` | `<Redirect href="/" />` |
| `<NavLink to="/binance">` | `<Link href="/binance">` |

### Estilização

| Web (CSS) | React Native (StyleSheet) |
|-----------|--------------------------|
| `variáveis CSS (--primary-color)` | `constants/theme.js` |
| `.classe { color: red }` | `StyleSheet.create({ estilo: { color: 'red' } })` |
| `display: flex` | Flex é padrão em todas as `<View>` |
| `flex-direction: row` | `flexDirection: 'row'` |
| `margin: 12px` | `margin: 12` (sem unidade — dp) |
| `border-radius: 8px` | `borderRadius: 8` |
| Sidebar CSS overlay | `DrawerNavigator` nativo |

---

## 7. Etapas de Migração por Commit

### ✅ Commit 1 — Setup Base + Estrutura
**O que foi feito:**
- Criação do projeto Expo com template `blank` via `create-expo-app`
- Instalação do Expo Router e dependências: `expo-router`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`, `expo-status-bar`
- Instalação do Drawer Navigator: `@react-navigation/drawer`, `react-native-gesture-handler`, `react-native-reanimated`
- Configuração do `package.json` (entry point: `expo-router/entry`) e `app.json` (scheme, bundler metro)
- Criação de `constants/theme.js` com design tokens (cores, espaçamentos, tipografia)
- Cópia e adaptação de `data/exchanges.js`
- Criação de `app/_layout.jsx` com Drawer Navigator (Exchanges, Binance, Bybit)
- Criação de `app/binance/_layout.jsx` e `app/bybit/_layout.jsx` com Stack Navigator
- Telas placeholder para cada rota
- Criação deste arquivo `MIGRACAO.md`

```bash
git add .
git commit -m "feat: setup inicial Expo + Expo Router + estrutura base"
```

---

### ✅ Commit 2 — Tela de Exchanges
**O que foi feito:**
- `components/Exchanges/ExchangeCard.jsx`: card de cada exchange com navegação via `useRouter()`
- `components/Exchanges/ExchangeList.jsx`: lista com `<FlatList>` (substituindo grid CSS)
- `app/index.jsx`: tela principal conectada ao ExchangeList
- Exchanges mockadas exibem `Alert.alert()` em vez de navegar

**Principais conversões:**
- `<div className="exchange-card">` → `<View style={styles.card}>`
- `useNavigate()` → `useRouter().push()`
- `alert()` → `Alert.alert()`
- CSS grid 2 colunas → `FlatList` com `numColumns={2}` (cards)

```bash
git add .
git commit -m "feat: tela de exchanges com lista de corretoras"
```

---

### ✅ Commit 3 — Lista de Pares Binance
**O que foi feito:**
- `components/Binance/BinancePriceList.jsx`: busca + paginação com `<FlatList>`
- `app/binance/index.jsx`: tela conectada ao componente
- Fetch de `https://api.binance.com/api/v3/ticker/price` (mantido identicamente)
- `<TextInput>` para busca, botões de paginação nativos

**Principais conversões:**
- `<input type="text">` → `<TextInput>`
- `<table>` → `<FlatList>`
- `<tr onClick>` → item do FlatList com `<TouchableOpacity>`
- Paginação com botões nativos em `<View flexDirection="row">`

```bash
git add .
git commit -m "feat: lista de pares Binance com busca e paginação"
```

---

### ✅ Commit 4 — Lista de Pares Bybit
**O que foi feito:**
- `components/Bybit/BybitPriceList.jsx`: equivalente ao Binance mas com API Bybit
- `app/bybit/index.jsx`: tela conectada
- Fetch de `https://api.bybit.com/v5/market/tickers?category=spot`

```bash
git add .
git commit -m "feat: lista de pares Bybit com busca e paginação"
```

---

### ✅ Commit 5 — Componentes Compartilhados
**O que foi feito:**
- `components/Shared/MarketData.jsx`: tabela de velas (klines) com `FlatList` e seletor de intervalo/limite via botões horizontais
- `components/Shared/OrderBook.jsx`: bids e asks lado a lado com `View flexDirection="row"`
- `components/Shared/RecentTrades.jsx`: lista de trades com cor condicional (verde/vermelho)

**Principais conversões:**
- `<table>/<thead>/<tbody>/<tr>/<td>` → `<FlatList>` com renderItem personalizado
- `<select>` → botões horizontais com `ScrollView horizontal`
- Cores condicionais: `style={{ color: isBuy ? '#00ff88' : '#ff4444' }}`

```bash
git add .
git commit -m "feat: componentes compartilhados (MarketData, OrderBook, RecentTrades)"
```

---

### ✅ Commit 6 — Tela de Detalhes Binance
**O que foi feito:**
- `components/Binance/BinanceMarketData.jsx`: integra OrderBook + RecentTrades + MarketData
- `app/binance/[symbol].jsx`: tela com `useLocalSearchParams()` para ler o símbolo
- `Promise.all()` para buscar os 3 endpoints paralelamente (mantido identicamente)
- `setInterval(fetchData, 5000)` com cleanup no `useEffect` (mantido identicamente)
- `<ScrollView>` para organizar os três painéis verticalmente

**Principais conversões:**
- `useParams()` → `useLocalSearchParams()`
- Container `<div>` → `<ScrollView>`
- Botão "Voltar" → `router.back()`

```bash
git add .
git commit -m "feat: tela de detalhes do par Binance (orderbook, trades, klines)"
```

---

### ✅ Commit 7 — Tela de Detalhes Bybit
**O que foi feito:**
- `components/Bybit/BybitMarketData.jsx`: equivalente ao Binance com endpoints Bybit
- `app/bybit/[symbol].jsx`: tela de detalhes Bybit

```bash
git add .
git commit -m "feat: tela de detalhes do par Bybit"
```

---

### ✅ Commit 8 — Polimentos Finais
**O que foi feito:**
- `<ActivityIndicator>` consistente em todos os loading states
- Mensagens de erro padronizadas com `<Text style={styles.error}>`
- Revisão e consistência do dark theme em todos os componentes
- Ajustes de padding/margin para SafeAreaView
- Atualização deste arquivo com observações finais

```bash
git add .
git commit -m "chore: polimentos de estilo e tratamento de erros"
```

---

## 8. Diferenças Importantes entre Web e Native

### Flexbox
No React Native, **Flex é a direção padrão é coluna** (`flexDirection: 'column'`), ao contrário do web onde é linha. Além disso, não há `display: grid` — use `FlatList` com `numColumns` para grades.

### Unidades de medida
Não existem `px`, `rem`, `em`, `%` (exceto em alguns contextos). Todos os valores numéricos são em **dp (density-independent pixels)**, que o React Native converte automaticamente para a densidade de tela correta.

### Fontes
Não há carregamento automático de fontes do Google. Para usar fontes customizadas, instalar `expo-font` e usar `useFonts()`.

### Imagens
`<img src="...">` vira `<Image source={{ uri: '...' }} style={{ width, height }}>` — dimensões obrigatórias.

### CORS
No React Native **não há problemas de CORS** — as requisições vão direto do dispositivo para a API. No web, o Vite usava um proxy para contornar isso.

### Seletor de opções
Não há `<select>`. Este projeto usa **botões horizontais com `ScrollView horizontal`** para selecionar o intervalo dos klines. Outra opção seria `@react-native-picker/picker`.

---

## 9. APIs Utilizadas

### Binance
| Endpoint | Propósito |
|----------|-----------|
| `https://api.binance.com/api/v3/ticker/price` | Lista todos os pares com preço atual |
| `https://api.binance.com/api/v3/depth?symbol={S}&limit=10` | Order book |
| `https://api.binance.com/api/v3/trades?symbol={S}&limit=10` | Trades recentes |
| `https://api.binance.com/api/v3/klines?symbol={S}&interval={I}&limit={L}` | Velas (klines) |

### Bybit
| Endpoint | Propósito |
|----------|-----------|
| `https://api.bybit.com/v5/market/tickers?category=spot` | Lista todos os pares spot |
| `https://api.bybit.com/v5/market/orderbook?category=spot&symbol={S}&limit=10` | Order book |
| `https://api.bybit.com/v5/market/recent-trade?category=spot&symbol={S}&limit=20` | Trades recentes |
| `https://api.bybit.com/v5/market/kline?category=spot&symbol={S}&interval={I}&limit={L}` | Velas (klines) |

---

*Última atualização: Commit 1 — Setup Base*
