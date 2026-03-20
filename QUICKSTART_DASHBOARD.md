# 🚀 Quick Start - React Dashboard

## Start Development Server

```powershell
cd C:\Users\Colle\quantum-pi-forge
npm install
npm run dev
```

Dashboard will open at: **http://localhost:3000**

## What You'll See

✅ **Quantum Pi Forge Dashboard** header  
✅ **Treasury Widget** with Polygon balance  
✅ **Contract verification table**  
✅ **Auto-refresh every 5 minutes**

## Update Contract Addresses

After deploying to Aristotle, edit [`App.tsx`](../frontend/src/App.tsx):

```tsx
treasuryAddresses={{
  polygon: "0x742d35Cc6634C0532925a3b8B9C4A1d3F1a8b1c2",
  aristotle: "0xYourDeployedAddress"  // ← Add here
}}
```

And update [`TreasuryWidget.tsx`](../frontend/src/components/Treasury/TreasuryWidget.tsx):

```tsx
aristotle: [
  { 
    name: 'OINIO Token', 
    address: '0xYourOinioAddress',  // ← Add here
    verified: false 
  },
  { 
    name: 'SlimRouter', 
    address: '0xYourRouterAddress',  // ← Add here
    verified: false 
  }
]
```

## Commands

```bash
npm run dev         # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Status

- ✅ React app configured
- ✅ TreasuryWidget integrated
- ✅ Polygon contracts configured
- ⏳ Aristotle contracts (pending deployment)
- ⏳ npm install (run this first!)

**Ready to run!** 🎉
