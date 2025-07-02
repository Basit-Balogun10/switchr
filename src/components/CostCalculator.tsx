import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function CostCalculator() {
  const [calculatorData, setCalculatorData] = useState({
    currentFuelType: "petrol",
    monthlyDistance: 1000,
    fuelEfficiency: 12,
    conversionType: "CNG",
  });

  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSavings = async () => {
    setIsCalculating(true);
    try {
      // Simulate calculation
      setTimeout(() => {
        const fuelPrices = {
          petrol: 617,
          diesel: 1100,
          cng: 230,
          electricity: 68,
        };

        const monthlyFuelConsumption = calculatorData.monthlyDistance / calculatorData.fuelEfficiency;
        const currentMonthlyCost = monthlyFuelConsumption * fuelPrices[calculatorData.currentFuelType as keyof typeof fuelPrices];

        let newMonthlyCost = 0;
        let conversionCost = 0;

        if (calculatorData.conversionType === "CNG") {
          const cngEfficiency = calculatorData.fuelEfficiency * 1.25;
          const cngConsumption = calculatorData.monthlyDistance / cngEfficiency;
          newMonthlyCost = cngConsumption * fuelPrices.cng;
          conversionCost = 800000;
        } else if (calculatorData.conversionType === "EV") {
          const evEfficiency = 6;
          const electricityConsumption = calculatorData.monthlyDistance / evEfficiency;
          newMonthlyCost = electricityConsumption * fuelPrices.electricity;
          conversionCost = 3500000;
        }

        const monthlySavings = currentMonthlyCost - newMonthlyCost;
        const annualSavings = monthlySavings * 12;
        const paybackPeriod = conversionCost / monthlySavings;

        setResult({
          currentMonthlyCost: Math.round(currentMonthlyCost),
          newMonthlyCost: Math.round(newMonthlyCost),
          monthlySavings: Math.round(monthlySavings),
          annualSavings: Math.round(annualSavings),
          conversionCost,
          paybackPeriod: Math.round(paybackPeriod),
          fiveYearSavings: Math.round(annualSavings * 5 - conversionCost),
        });
        setIsCalculating(false);
      }, 1000);
    } catch (error) {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Savings Calculator</h1>
        <p className="text-white/70">Calculate your potential savings from clean energy conversion</p>
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Vehicle Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">Current Fuel Type</label>
              <select
                value={calculatorData.currentFuelType}
                onChange={(e) => setCalculatorData({ ...calculatorData, currentFuelType: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Monthly Distance (km)</label>
              <input
                type="number"
                min="100"
                max="10000"
                value={calculatorData.monthlyDistance}
                onChange={(e) => setCalculatorData({ ...calculatorData, monthlyDistance: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Fuel Efficiency (km/liter)</label>
              <input
                type="number"
                min="5"
                max="30"
                step="0.1"
                value={calculatorData.fuelEfficiency}
                onChange={(e) => setCalculatorData({ ...calculatorData, fuelEfficiency: parseFloat(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Conversion Type</label>
              <div className="grid grid-cols-2 gap-4">
                {["CNG", "EV"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setCalculatorData({ ...calculatorData, conversionType: type })}
                    className={`p-4 rounded-lg border transition-all ${
                      calculatorData.conversionType === type
                        ? "border-green-500 bg-green-500/20 text-green-300"
                        : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="font-semibold">{type}</div>
                    <div className="text-sm">
                      {type === "CNG" ? "₦800k avg" : "₦3.5M avg"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculateSavings}
              disabled={isCalculating}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-semibold"
            >
              {isCalculating ? "Calculating..." : "Calculate Savings"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Your Savings Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Current Monthly Cost</span>
                  <span className="text-white font-semibold">₦{result.currentMonthlyCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">New Monthly Cost</span>
                  <span className="text-green-300 font-semibold">₦{result.newMonthlyCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Monthly Savings</span>
                  <span className="text-green-300 font-bold text-lg">₦{result.monthlySavings.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Annual Savings</span>
                  <span className="text-green-300 font-bold">₦{result.annualSavings.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Conversion Cost</span>
                  <span className="text-white font-semibold">₦{result.conversionCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Payback Period</span>
                  <span className="text-yellow-300 font-semibold">{result.paybackPeriod} months</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/70">5-Year Net Savings</span>
                  <span className={`font-bold text-lg ${result.fiveYearSavings > 0 ? 'text-green-300' : 'text-red-300'}`}>
                    ₦{result.fiveYearSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Environmental Impact</h3>
              <p className="text-white/70 text-sm">
                {calculatorData.conversionType === "CNG" ? 
                  "CNG reduces CO2 emissions by 20-30% compared to petrol" :
                  "Electric vehicles produce zero direct emissions"
                }
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Government Incentives</h3>
              <p className="text-white/70 text-sm">
                Take advantage of tax rebates and import duty waivers for clean vehicle conversions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
