# FloodAlert NG

Hyperlocal Flood Alerts, Before They Happen.

A Next.js Base MiniApp that provides predictive flood risk notifications using real-time weather data, satellite imagery, and historical flood patterns. Built for the Base ecosystem with Farcaster integration for community alerting.

## 🚀 Features

- **Hyperlocal Predictive Flood Alerts**: Real-time flood risk assessment using weather and satellite data
- **Historical Flood Pattern Analysis**: Interactive dashboard showing past flood events
- **Actionable Preparedness Guidance**: Tailored advice for before, during, and after flood events
- **Community Alerting & Social Sharing**: Share alerts via Farcaster and direct messaging
- **Base Wallet Integration**: Seamless wallet connection for user authentication
- **Micro-transactions**: Pay-as-you-go model for premium alerts and historical data

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Blockchain**: Base network integration
- **Social**: Farcaster API integration

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- OpenWeatherMap API key
- Base wallet (for mini-app functionality)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/d092e4bb-f4d5-4e7f-b95f-a6ca856fb45b.git
   cd floodalert-ng
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key for weather data | Yes |
| `BASE_RPC_URL` | Base blockchain RPC endpoint | No |
| `FARCASTER_API_KEY` | Farcaster API key for social features | No |
| `NEXT_PUBLIC_BASE_URL` | Base URL for the application | Yes |

### API Keys Setup

1. **OpenWeatherMap**: Sign up at [openweathermap.org](https://openweathermap.org/api) and get your API key
2. **Farcaster**: Get API credentials from the Farcaster developer portal
3. **Base**: Use the default RPC URL or set up your own Base node

## 📚 API Documentation

### Weather API

**Endpoint**: `GET /api/weather`

**Parameters**:
- `lat` (number): Latitude
- `lon` (number): Longitude
- `type` (string, optional): 'current' or 'forecast' (default: 'current')

**Response**:
```json
{
  "location": { "lat": 40.7128, "lon": -74.0060 },
  "city": "New York",
  "country": "US",
  "current": {
    "timestamp": "2024-01-15T10:00:00Z",
    "temperature": 22.5,
    "humidity": 65,
    "precipitation": 0,
    "weather": "Clear",
    "description": "clear sky",
    "windSpeed": 3.5,
    "pressure": 1013,
    "visibility": 10000,
    "cloudCover": 20
  }
}
```

### Satellite Data API

**Endpoint**: `GET /api/satellite`

**Parameters**:
- `lat` (number): Latitude
- `lon` (number): Longitude
- `bbox` (string, optional): Bounding box for area analysis

**Response**:
```json
{
  "location": { "lat": 40.7128, "lon": -74.0060 },
  "timestamp": "2024-01-15T10:00:00Z",
  "satellite": "Sentinel-2",
  "analysis": {
    "cloudCover": 15,
    "vegetationIndex": 0.65,
    "waterExtent": 0.02,
    "floodRisk": 0.25,
    "soilMoisture": 0.45,
    "surfaceTemperature": 18.5
  },
  "indicators": {
    "potentialFloodZones": false,
    "vegetationStress": false,
    "waterAccumulation": false,
    "landslideRisk": false
  }
}
```

### Flood Risk Assessment API

**Endpoint**: `GET /api/flood-data`

**Parameters**:
- `lat` (number): Latitude
- `lon` (number): Longitude

**Response**:
```json
{
  "location": { "lat": 40.7128, "lon": -74.0060 },
  "timestamp": "2024-01-15T10:00:00Z",
  "riskAssessment": {
    "riskScore": 0.35,
    "riskLevel": "medium",
    "confidence": 0.85,
    "factors": {
      "weather": 0.4,
      "satellite": 0.25,
      "historical": 0.1,
      "terrain": 0.05
    },
    "predictedIntensity": 35
  },
  "weatherData": { /* current weather data */ },
  "satelliteData": { /* satellite analysis */ },
  "historicalEvents": [ /* past flood events */ ],
  "guidance": { /* preparedness guidance */ },
  "recommendations": [ /* action items */ ]
}
```

## 🏗️ Project Structure

```
floodalert-ng/
├── app/
│   ├── api/
│   │   ├── flood-data/
│   │   ├── satellite/
│   │   └── weather/
│   ├── components/
│   │   ├── ui/
│   │   ├── AppShell.tsx
│   │   ├── AlertCard.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── DataVizChart.tsx
│   │   ├── ActionableGuidanceCard.tsx
│   │   └── SocialShareButton.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── types/
│   │   └── index.ts
│   └── utils.ts
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#20496E)
- **Accent**: Orange (#FF6B35)
- **Danger**: Red (#DC2626)
- **Surface**: White (#FFFFFF)
- **Background**: Light Blue (#E0F2FE)

### Typography
- **Display**: 4xl font-bold
- **H1**: 3xl font-bold
- **H2**: 2xl font-semibold
- **Body**: base leading-7

### Spacing
- **Large**: 20px
- **Medium**: 12px
- **Small**: 8px

### Border Radius
- **Large**: 16px
- **Medium**: 10px
- **Small**: 6px

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy**

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Copernicus/Sentinel-2 for satellite imagery
- Base for blockchain infrastructure
- Farcaster for social features

## 📞 Support

For support, email support@floodalert.ng or join our community on Farcaster.

---

Built with ❤️ for flood-prone communities worldwide.

