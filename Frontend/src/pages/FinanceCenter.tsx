import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const FinanceCenter: React.FC = () => {
  // Monthly financial overview data
  const monthlyData = [
    { name: 'Jan', Revenue: 3.2, Expenses: 2.2 },
    { name: 'Feb', Revenue: 3.5, Expenses: 2.4 },
    { name: 'Mar', Revenue: 2.9, Expenses: 2.0 },
    { name: 'Apr', Revenue: 4.0, Expenses: 2.6 },
    { name: 'May', Revenue: 3.8, Expenses: 2.5 },
    { name: 'Jun', Revenue: 4.2, Expenses: 2.8 }
  ];

  // Expense Breakdown Data
  const expenseData = [
    { name: 'Fuel', value: 35, color: '#0F172A' },
    { name: 'Maintenance', value: 25, color: '#334155' },
    { name: 'Repairs', value: 15, color: '#64748B' },
    { name: 'Other', value: 25, color: '#94A3B8' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Header Title */}
        <section>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Financial Oversight</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Monitor revenue, expenses, profitability, operational costs, fleet ROI, and financial performance across transport operations.
          </p>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Total Revenue */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Total Revenue</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit block mb-1">₹4.2M</span>
            <span className="text-[10px] text-emerald-500 font-bold">📈 +12%</span>
          </div>

          {/* Total Expenses */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Total Expenses</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit block mb-1">₹2.8M</span>
            <span className="text-[10px] text-emerald-500 font-bold">📈 +4%</span>
          </div>

          {/* Net Profit */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Net Profit</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit block mb-1">₹1.4M</span>
            <span className="text-[10px] text-emerald-500 font-bold">📈 +18%</span>
          </div>

          {/* Fleet ROI */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Fleet ROI</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit block mb-1">18%</span>
            <span className="text-[10px] text-emerald-500 font-bold">📈 +2.1%</span>
          </div>

          {/* Cost/KM */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Cost/KM</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit block mb-1">₹1.12</span>
            <span className="text-[10px] text-emerald-500 font-bold">📉 -0.05</span>
          </div>

          {/* Fuel Spend */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Fuel Spend</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit block mb-1">₹840k</span>
            <span className="text-[10px] text-emerald-500 font-bold">📉 -1.5%</span>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Financial Health Overview Bar Chart (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Financial Health Overview</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-950"></span>Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>Expenses</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} />
                  <Bar dataKey="Revenue" fill="#0B132B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown Pie Chart (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-4">Expense Breakdown</h3>
              <div className="flex items-center justify-center relative py-4">
                <div className="w-40 h-40 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900 font-outfit">₹2.8M</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Spend</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-4">
              {expenseData.map((exp) => (
                <div key={exp.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color }}></span>
                    <span>{exp.name}</span>
                  </div>
                  <span className="text-slate-900 font-extrabold">{exp.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* AI Financial Insights Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Insight 1 */}
          <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-5 flex items-start gap-4">
            <div className="bg-[#F3E8FF] text-purple-700 p-2.5 rounded-xl shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-black text-purple-950">Fuel expenses increased 12% on Route B</h4>
              <p className="text-[10px] text-purple-600 font-bold mt-1">AI Insight • Detected 2h ago</p>
            </div>
          </div>

          {/* Insight 2 */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex items-start gap-4">
            <div className="bg-slate-200 text-slate-700 p-2.5 rounded-xl shrink-0">
              📉
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Vehicle V-102 ROI declining</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-1">Maintenance suggested to improve fuel efficiency</p>
            </div>
          </div>

          {/* Insight 3 */}
          <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-5 flex items-start gap-4">
            <div className="bg-[#F3E8FF] text-purple-700 p-2.5 rounded-xl shrink-0">
              📊
            </div>
            <div>
              <h4 className="text-xs font-black text-purple-950">Forecast: Upcoming maintenance costs</h4>
              <p className="text-[10px] text-purple-600 font-bold mt-1">Expected to rise by 8% next quarter</p>
            </div>
          </div>
        </section>

        {/* Vehicle Profitability Analysis */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Vehicle Profitability Analysis</h3>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-650">View Full Fleet ↗</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">VEHICLE</th>
                  <th className="pb-3">REVENUE</th>
                  <th className="pb-3">COST</th>
                  <th className="pb-3">PROFIT</th>
                  <th className="pb-3">ROI</th>
                  <th className="pb-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                <tr>
                  <td className="py-4 font-black text-slate-900">V-204 (Tractor-Trailer)</td>
                  <td className="py-4">₹142,000</td>
                  <td className="py-4">₹94,000</td>
                  <td className="py-4 text-emerald-600 font-bold">+₹48,000</td>
                  <td className="py-4">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                      33.8% (Highest)
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-600">•••</td>
                </tr>

                <tr>
                  <td className="py-4 font-black text-slate-900">V-102 (Cargo Van)</td>
                  <td className="py-4">₹86,000</td>
                  <td className="py-4">₹61,000</td>
                  <td className="py-4 text-emerald-600 font-bold">+₹25,000</td>
                  <td className="py-4">29.0%</td>
                  <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-600">•••</td>
                </tr>

                <tr>
                  <td className="py-4 font-black text-slate-900">V-305 (Box Truck)</td>
                  <td className="py-4">₹112,000</td>
                  <td className="py-4">₹88,000</td>
                  <td className="py-4 text-emerald-600 font-bold">+₹24,000</td>
                  <td className="py-4">21.4%</td>
                  <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-600">•••</td>
                </tr>

                <tr>
                  <td className="py-4 font-black text-slate-900">V-112 (Delivery Van)</td>
                  <td className="py-4">₹42,000</td>
                  <td className="py-4">₹39,500</td>
                  <td className="py-4 text-rose-600 font-bold">+₹2,500</td>
                  <td className="py-4">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-600 rounded">
                      6.3% (Lowest)
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-600">•••</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Lower Row (Fuel & Maintenance + Forecasts) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Fuel & Maintenance (Left 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Efficiency */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">⛽ Average Efficiency</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-outfit">8.4</span>
                <span className="text-xs text-slate-400 font-semibold">MPG Avg</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-950 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-[10px] text-emerald-500 font-bold block">+0.5 MPG from last month</span>
            </div>

            {/* Maintenance trend */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">🛠️ Maintenance Trend</h4>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-[#EF4444] font-outfit">₹12.4k</span>
                <span className="text-[10px] text-slate-400 font-bold">This Month</span>
              </div>
              <div className="h-6 flex items-end gap-1 px-1">
                <div className="flex-1 bg-slate-100 rounded-xs h-2"></div>
                <div className="flex-1 bg-slate-200 rounded-xs h-3"></div>
                <div className="flex-1 bg-slate-300 rounded-xs h-1.5"></div>
                <div className="flex-1 bg-slate-400 rounded-xs h-4"></div>
                <div className="flex-1 bg-slate-950 rounded-xs h-5"></div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Scheduled maintenance peaking soon</span>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
              <h4 className="text-xs font-black text-slate-950">Recent Activity</h4>
              <div className="space-y-4 text-xs font-semibold text-slate-650">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>Revenue Milestone Achieved</span>
                  <span className="text-[10px] text-slate-400">12m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>Large Fuel Expense Recorded</span>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>Maintenance Audit Logged</span>
                  <span className="text-[10px] text-slate-400">1d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Forecasts (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Predictive Forecasts</h3>

            <div className="space-y-4 font-inter text-xs">
              <div className="border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Next Month Revenue (Est.)</span>
                  <span className="text-base font-black text-slate-800 font-outfit mt-0.5 block">₹4.52M</span>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">92% Confidence score</span>
                </div>
                <span className="text-emerald-500 font-bold text-lg">📈</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Next Month Expense (Est.)</span>
                  <span className="text-base font-black text-slate-800 font-outfit mt-0.5 block">₹2.94M</span>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Based on projected fuel costs</span>
                </div>
                <span className="text-rose-500 font-bold text-lg">📈</span>
              </div>

              <div className="bg-slate-950 text-white rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Projected Net Profit</span>
                  <span className="text-base font-black text-emerald-400 font-outfit mt-0.5 block">₹1.58M</span>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">+11.4% growth predicted</span>
                </div>
                <span className="text-emerald-400 text-lg">📈</span>
              </div>

              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm">
                Run Sensitivity Analysis
              </button>
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};
