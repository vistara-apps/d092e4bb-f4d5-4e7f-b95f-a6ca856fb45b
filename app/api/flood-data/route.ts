import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch weather data
    const weatherResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/weather?lat=${lat}&lon=${lon}&type=current`
    );

    // Fetch satellite data
    const satelliteResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/satellite?lat=${lat}&lon=${lon}`
    );

    // Calculate flood risk
    const floodRisk = calculateFloodRisk(
      weatherResponse.data.current,
      satelliteResponse.data.analysis
    );

    // Get historical flood events (simulated for now)
    const historicalEvents = await getHistoricalFloodEvents(parseFloat(lat), parseFloat(lon));

    // Generate actionable guidance
    const guidance = generatePreparednessGuidance(floodRisk.riskLevel);

    return NextResponse.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      timestamp: new Date().toISOString(),
      riskAssessment: floodRisk,
      weatherData: weatherResponse.data.current,
      satelliteData: satelliteResponse.data.analysis,
      historicalEvents,
      guidance,
      recommendations: getRecommendations(floodRisk.riskLevel)
    });
  } catch (error) {
    console.error('Flood data API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate flood risk' },
      { status: 500 }
    );
  }
}

function calculateFloodRisk(weatherData: any, satelliteData: any) {
  // Risk calculation algorithm
  let riskScore = 0;
  let riskLevel: 'low' | 'medium' | 'high' | 'extreme' = 'low';

  // Weather factors (40% weight)
  const precipitation = weatherData.precipitation || 0;
  const humidity = weatherData.humidity || 0;
  const pressure = weatherData.pressure || 1013;

  // Low pressure systems often bring rain
  const pressureFactor = Math.max(0, (1013 - pressure) / 50);
  const weatherRisk = (precipitation * 0.4 + humidity * 0.002 + pressureFactor * 0.3);

  // Satellite factors (60% weight)
  const satelliteRisk = satelliteData.floodRisk * 0.6;

  // Combine factors
  riskScore = weatherRisk * 0.4 + satelliteRisk * 0.6;

  // Determine risk level
  if (riskScore >= 0.8) {
    riskLevel = 'extreme';
  } else if (riskScore >= 0.6) {
    riskLevel = 'high';
  } else if (riskScore >= 0.4) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  return {
    riskScore: Math.min(1, riskScore),
    riskLevel,
    confidence: 0.85, // Simulated confidence level
    factors: {
      weather: weatherRisk,
      satellite: satelliteRisk,
      historical: 0.1, // Placeholder for historical data
      terrain: 0.05 // Placeholder for terrain analysis
    },
    predictedIntensity: Math.round(riskScore * 100)
  };
}

async function getHistoricalFloodEvents(lat: number, lon: number) {
  // Simulate historical flood events
  // In production, this would query a database of historical flood events
  const events = [];
  const baseDate = new Date();

  // Generate 0-3 random historical events
  const numEvents = Math.floor(Math.random() * 4);

  for (let i = 0; i < numEvents; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setFullYear(baseDate.getFullYear() - Math.floor(Math.random() * 10) - 1);

    events.push({
      eventId: `event-${i + 1}`,
      timestamp: eventDate.toISOString(),
      severity: ['minor', 'moderate', 'major'][Math.floor(Math.random() * 3)],
      affectedArea: {
        type: 'Polygon',
        coordinates: [[
          [lon - 0.01, lat - 0.01],
          [lon + 0.01, lat - 0.01],
          [lon + 0.01, lat + 0.01],
          [lon - 0.01, lat + 0.01],
          [lon - 0.01, lat - 0.01]
        ]]
      },
      description: `Historical flood event ${i + 1}`,
      source: 'historical-records',
      verified: Math.random() > 0.3
    });
  }

  return events;
}

function generatePreparednessGuidance(riskLevel: string) {
  const baseGuidance = {
    before: [
      'Prepare an emergency kit with water, food, medications, and important documents',
      'Identify evacuation routes and emergency meeting points',
      'Secure your property by moving valuables to higher ground',
      'Ensure your vehicle has sufficient fuel'
    ],
    during: [
      'Move to higher ground immediately if flooding is occurring',
      'Avoid walking or driving through flood waters',
      'Stay tuned to local emergency broadcasts',
      'Contact emergency services if you need assistance'
    ],
    after: [
      'Wait for official guidance before returning home',
      'Check for structural damage before entering buildings',
      'Avoid using electrical appliances that may have been damaged',
      'Contact your insurance provider to report any damage'
    ],
    emergencyContacts: [
      { type: 'emergency', name: 'Emergency Services', number: '911' },
      { type: 'fire', name: 'Fire Department', number: '911' },
      { type: 'police', name: 'Police Department', number: '911' }
    ]
  };

  // Adjust guidance based on risk level
  if (riskLevel === 'extreme') {
    baseGuidance.before.unshift('Consider immediate evacuation if in high-risk area');
    baseGuidance.during.unshift('Do not attempt to drive or walk through flood waters');
  } else if (riskLevel === 'high') {
    baseGuidance.before.unshift('Monitor weather conditions closely');
  }

  return baseGuidance;
}

function getRecommendations(riskLevel: string) {
  const recommendations = {
    low: [
      'Continue normal activities',
      'Stay informed about weather updates',
      'Review emergency plans periodically'
    ],
    medium: [
      'Prepare emergency kit',
      'Monitor local weather closely',
      'Review evacuation routes',
      'Consider sandbags for vulnerable areas'
    ],
    high: [
      'Move valuables to higher ground',
      'Prepare to evacuate if conditions worsen',
      'Stay in contact with neighbors',
      'Charge electronic devices and have backup power'
    ],
    extreme: [
      'Evacuate immediately if advised',
      'Move to designated emergency shelter',
      'Follow instructions from emergency services',
      'Do not return until declared safe'
    ]
  };

  return recommendations[riskLevel as keyof typeof recommendations] || recommendations.low;
}

