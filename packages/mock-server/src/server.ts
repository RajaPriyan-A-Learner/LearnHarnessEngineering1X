import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock Auth: Step 1 - Login Credentials check
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !email.includes('@') || !password || password.length < 8) {
    return res.status(400).json({ error: 'Invalid email or password format (min 8 characters).' });
  }
  res.json({ status: 'mfa_required', sessionId: 'mock-session-id-' + Math.random().toString(36).substring(7) });
});

// Mock Auth: Step 2 - MFA Code verification
app.post('/api/auth/mfa', (req, res) => {
  const { sessionId, code } = req.body;
  if (!sessionId || !code || code.length !== 6 || !code.startsWith('12')) {
    return res.status(401).json({ error: 'Invalid MFA challenge code (must be 6 digits and start with 12).' });
  }
  res.json({
    accessToken: 'mock-access-token-' + Math.random().toString(36).substring(7),
    refreshToken: 'mock-refresh-token-' + Math.random().toString(36).substring(7),
    user: {
      name: 'Sarah Jenkins',
      role: 'Advisor',
      email: 'advisor@meridian.com'
    }
  });
});

// Mock Auth: Step 3 - Silent Token Refresh
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || refreshToken.includes('expired')) {
    return res.status(401).json({ error: 'Refresh token has expired or is invalid.' });
  }
  res.json({
    accessToken: 'mock-access-token-' + Math.random().toString(36).substring(7),
    refreshToken: 'mock-refresh-token-' + Math.random().toString(36).substring(7),
  });
});

const households = [
  {
    id: 'HH-804-MILLER',
    name: 'The Miller Family Trust',
    totalValue: 4850300.75,
    dayChangePercent: 0.0125,
    riskProfile: 'Moderate Growth',
    accounts: ['ACCT-8041', 'ACCT-8042'],
    taxId: '***-**-8041',
    segment: 'HNW',
    reviewDue: true
  },
  {
    id: 'HH-101-SMITH',
    name: 'The Smith Family Trust',
    totalValue: 750000.00,
    dayChangePercent: -0.0045,
    riskProfile: 'Conservative',
    accounts: ['ACCT-1011'],
    taxId: '***-**-1011',
    segment: 'Mass Affluent',
    reviewDue: false
  },
  {
    id: 'HH-202-VANDERBILT',
    name: 'The Vanderbilt Estate',
    totalValue: 12500000.50,
    dayChangePercent: 0.0210,
    riskProfile: 'Aggressive Growth',
    accounts: ['ACCT-2021', 'ACCT-2022', 'ACCT-2023'],
    taxId: '***-**-2021',
    segment: 'UHNW',
    reviewDue: true
  },
  {
    id: 'HH-303-JONES',
    name: 'Robert and Clara Jones',
    totalValue: 2400000.00,
    dayChangePercent: 0.0015,
    riskProfile: 'Moderate Growth',
    accounts: ['ACCT-3031', 'ACCT-3032'],
    taxId: '***-**-3031',
    segment: 'HNW',
    reviewDue: false
  },
  {
    id: 'HH-404-DOE',
    name: 'John Doe Portfolio',
    totalValue: 120000.00,
    dayChangePercent: 0.0085,
    riskProfile: 'Growth',
    accounts: ['ACCT-4041'],
    taxId: '***-**-4041',
    segment: 'Mass Affluent',
    reviewDue: true
  }
];

app.get('/api/clients', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
  const segments = typeof req.query.segments === 'string' ? req.query.segments.split(',') : [];
  const reviewDueOnly = req.query.reviewDue === 'true';

  let filtered = households;

  if (q) {
    filtered = filtered.filter(h => 
      h.name.toLowerCase().includes(q) ||
      h.id.toLowerCase().includes(q) ||
      h.taxId.includes(q) ||
      h.accounts.some(acc => acc.toLowerCase().includes(q))
    );
  }

  if (segments.length > 0 && segments[0] !== '') {
    filtered = filtered.filter(h => segments.includes(h.segment));
  }

  if (reviewDueOnly) {
    filtered = filtered.filter(h => h.reviewDue);
  }

  res.json(filtered);
});

const securities = [
  { symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'Equities', price: 180.50, sector: 'Technology', geography: 'North America' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', assetClass: 'Equities', price: 420.20, sector: 'Technology', geography: 'North America' },
  { symbol: 'TSLA', name: 'Tesla Inc.', assetClass: 'Equities', price: 175.40, sector: 'Consumer Cyclical', geography: 'North America' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', assetClass: 'Equities', price: 178.10, sector: 'Consumer Cyclical', geography: 'North America' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', assetClass: 'Equities', price: 150.30, sector: 'Communication Services', geography: 'North America' },
  { symbol: 'US-T-10Y', name: 'US Treasury 10-Year Bond', assetClass: 'Fixed Income', price: 98.25, sector: 'Government', geography: 'North America' },
  { symbol: 'MUNI-NY', name: 'New York Municipal Bond', assetClass: 'Fixed Income', price: 101.40, sector: 'Government', geography: 'North America' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', assetClass: 'Alternatives', price: 215.80, sector: 'Commodities', geography: 'Global' },
  { symbol: 'BTC-TRUST', name: 'Grayscale Bitcoin Trust', assetClass: 'Alternatives', price: 62.50, sector: 'Cryptocurrency', geography: 'Global' },
  { symbol: 'USD-CASH', name: 'US Dollar Cash', assetClass: 'Cash', price: 1.00, sector: 'Cash', geography: 'North America' }
];

const generateHoldings = (hhId: string, accounts: string[], date: string): any[] => {
  const result: any[] = [];
  const count = 10000;
  
  const prefix = hhId.substring(0, 3).toUpperCase();
  for (let i = 0; i < count; i++) {
    const secIndex = i % securities.length;
    const sec = securities[secIndex];
    const account = accounts[i % accounts.length];
    const lotId = `${prefix}-LOT-${100000 + i}`;
    
    const symbol = i < securities.length ? sec.symbol : `${sec.symbol}-${i}`;
    const name = i < securities.length ? sec.name : `${sec.name} (Lot ${i})`;
    
    const shares = ((i * 7 + 13) % 500) + 1;
    const price = sec.price;
    const marketValue = shares * price;
    
    result.push({
      id: lotId,
      symbol,
      name,
      assetClass: sec.assetClass,
      shares,
      price,
      marketValue,
      costBasis: marketValue * 0.9,
      unrealizedGainLoss: marketValue * 0.1,
      unrealizedGainLossPercent: 0.1,
      sector: sec.sector,
      geography: sec.geography,
      account,
      asOfDate: date
    });
  }
  return result;
};

app.get('/api/households/:id/holdings', (req, res) => {
  const hhId = req.params.id;
  const accountsQuery = typeof req.query.accounts === 'string' ? req.query.accounts.split(',') : [];
  const date = typeof req.query.asOfDate === 'string' ? req.query.asOfDate : '2026-07-18';

  const hh = households.find(h => h.id === hhId);
  if (!hh) {
    return res.status(404).json({ error: 'Household not found' });
  }

  const selectedAccounts = accountsQuery.length > 0 && accountsQuery[0] !== '' 
    ? accountsQuery 
    : hh.accounts;

  const holdings = generateHoldings(hhId, selectedAccounts, date);
  res.json(holdings);
});

app.get('/api/prices', (_req, res) => {
  // Map security symbols to their current mock prices
  const prices = securities.reduce((acc, sec) => {
    acc[sec.symbol] = sec.price;
    return acc;
  }, {} as Record<string, number>);
  res.json(prices);
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

let activeInterval: NodeJS.Timeout | null = null;

const startTickerStream = () => {
  if (activeInterval) clearInterval(activeInterval);

  activeInterval = setInterval(() => {
    // Exclude cash from price fluctuations
    const candidates = securities.filter(s => s.symbol !== 'USD-CASH');
    const sec = candidates[Math.floor(Math.random() * candidates.length)];
    
    // Tiny price tick fluctuation (+/- 0.5%)
    const pctChange = (Math.random() * 0.01) - 0.005;
    sec.price = Number((sec.price * (1 + pctChange)).toFixed(2));

    const tick = {
      type: 'TICK',
      symbol: sec.symbol,
      price: sec.price,
      changePercent: pctChange
    };

    const message = JSON.stringify(tick);
    wss.clients.forEach(client => {
      if (client.readyState === 1) { // OPEN
        client.send(message);
      }
    });
  }, 100);
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  if (wss.clients.size === 1) {
    startTickerStream();
  }
  
  ws.on('close', () => {
    console.log('Client disconnected');
    if (wss.clients.size === 0 && activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Mock server listening on port ${PORT}`);
});
