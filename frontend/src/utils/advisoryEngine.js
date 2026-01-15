export const getAdvisory = (aqi, pollutants) => {
  let status = "";
  let colorVar = "";
  let summary = "";
  let healthRisks = "";
  let precaution = "";
  
  // Basic AQI categorization
  if (aqi <= 50) {
    status = "Good";
    colorVar = "var(--color-good)";
    summary = "The air quality is excellent today. It's a perfect day to be outside!";
    healthRisks = "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    precaution = "Enjoy your outdoor activities without restriction. Great for running, cycling, or picnics.";
  } else if (aqi <= 100) {
    status = "Moderate";
    colorVar = "var(--color-moderate)";
    summary = "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.";
    healthRisks = "Minimal risk for the general public, but sensitive individuals might experience slight respiratory discomfort.";
    precaution = "Sensitive groups should reduce prolonged or heavy exertion. Everyone else can enjoy outdoor activities.";
  } else if (aqi <= 150) {
    status = "Unhealthy for Sensitive Groups";
    colorVar = "var(--color-unhealthy-sensitive)";
    summary = "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
    healthRisks = "People with heart/lung disease, older adults, and children are at greater risk of exposure symptoms.";
    precaution = "Sensitive groups: Reduce prolonged or heavy exertion. General public: You're likely okay, but take breaks if you feel winded.";
  } else if (aqi <= 200) {
    status = "Unhealthy";
    colorVar = "var(--color-unhealthy)";
    summary = "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    healthRisks = "Increased aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; increased respiratory effects in general population.";
    precaution = "Avoid prolonged or heavy exertion. Move activities indoors or reschedule to a time when air quality is better.";
  } else if (aqi <= 300) {
    status = "Very Unhealthy";
    colorVar = "var(--color-very-unhealthy)";
    summary = "Health warnings of emergency conditions. The entire population is more likely to be affected.";
    healthRisks = "Significant increase in respiratory effects in general population.";
    precaution = "Everyone should avoid all physical activity outdoors. Sensitive groups should remain indoors and keep activity levels low.";
  } else {
    status = "Hazardous";
    colorVar = "var(--color-hazardous)";
    summary = "Health alert: everyone may experience more serious health effects.";
    healthRisks = "Serious risk of respiratory effects and aggravation of heart/lung disease to everyone.";
    precaution = "Everyone should remain indoors and keep activity levels low. Close windows and run an air purifier if available.";
  }

  // Pollutant specific insights (basic rules)
  let pollutantInsights = [];
  if (pollutants?.pm25 > 35) {
    pollutantInsights.push("High PM2.5 levels detected. These fine particles can penetrate deep into lungs.");
  }
  if (pollutants?.pm10 > 150) {
    pollutantInsights.push("High PM10 levels. Dust or smoke might be prevalent.");
  }

  return {
    status,
    colorVar,
    summary,
    healthRisks,
    precaution,
    pollutantInsights
  };
};
