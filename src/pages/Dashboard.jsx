import { TrendingUp, TrendingDown, Egg, Users, ShoppingCart, Wheat, AlertCircle, RefreshCw } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { SectionHeader } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { DASHBOARD_STATS, EGG_PRODUCTION_DATA, BROILER_GROWTH_DATA } from '../data'

const MORTALITY_DATA = [
  { week: 'W1', rate: 0.12 },
  { week: 'W2', rate: 0.08 },
  { week: 'W3', rate: 0.05 },
  { week: 'W4', rate: 0.09 },
  { week: 'W5', rate: 0.06 },
  { week: 'W6', rate: 0.04 },
]

const FEED_DATA = [
  { day: 'Mon', feed: 1.18 },
  { day: 'Tue', feed: 1.22 },
  { day: 'Wed', feed: 1.19 },
  { day: 'Thu', feed: 1.25 },
  { day: 'Fri', feed: 1.20 },
  { day: 'Sat', feed: 1.17 },
  { day: 'Sun', feed: 1.24 },
]

const STAT_ICONS = [Egg, Users, ShoppingCart, Wheat]
const STAT_COLORS = ['green', 'yellow', 'green', 'yellow']

function StatCard({ stat, icon: Icon, color }) {
  const isUp = stat.trend > 0
  const colorMap = {
    green: { bg: 'bg-farm-green-pale', text: 'text-farm-green', border: 'border-farm-green/20' },
    yellow: { bg: 'bg-farm-yellow-pale', text: 'text-farm-yellow', border: 'border-farm-yellow/20' },
  }
  const c = colorMap[color]

  return (
    <div className={`card p-6 border ${c.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
          ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(stat.trend)}%
        </span>
      </div>
      <p className="font-display text-3xl font-bold text-farm-dark mb-1">
        {stat.value.toLocaleString()}
        <span className="text-base font-sans font-normal text-farm-dark/40 ml-1">{stat.unit}</span>
      </p>
      <p className="text-farm-dark/60 text-sm font-medium">{stat.label}</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-hover border border-farm-green-pale p-3 text-sm">
        <p className="font-semibold text-farm-dark mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value.toLocaleString()} {p.unit || ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const ref = useScrollReveal()
  const now = new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })

  return (
    <div ref={ref} className="pt-20">
      {/* Header bar */}
      <div className="bg-farm-dark text-white py-6">
        <div className="container-max px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">Live Dashboard</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Farm Operations Centre</h1>
            <p className="text-white/50 text-sm mt-0.5">{now}</p>
          </div>
          <button className="flex items-center gap-2 btn-secondary-light !border-white/30 text-xs self-start sm:self-auto">
            <RefreshCw size={13} /> Refresh Data
          </button>
        </div>
      </div>

      <div className="section">
        <div className="container-max space-y-10">

          {/* KPI Cards */}
          <div>
            <p className="section-label mb-4">Key Performance Indicators</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
              {DASHBOARD_STATS.map((stat, i) => (
                <StatCard key={i} stat={stat} icon={STAT_ICONS[i]} color={STAT_COLORS[i]} />
              ))}
            </div>
          </div>

          {/* Egg Production Chart */}
          <div className="reveal">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="section-label !mb-0">Egg Production</p>
                  <h3 className="font-display font-bold text-xl text-farm-dark">Daily Output — This Week</h3>
                </div>
                <span className="badge">Layer Unit</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={EGG_PRODUCTION_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eggGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8F3DC" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[10000, 13000]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="eggs" name="Eggs" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#eggGrad)" dot={{ fill: '#2D6A4F', r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two charts side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 reveal">

            {/* Broiler Growth */}
            <div className="card p-6">
              <div className="mb-6">
                <p className="section-label !mb-0">Broiler Growth</p>
                <h3 className="font-display font-bold text-xl text-farm-dark">Weight by Week (Current Batch)</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={BROILER_GROWTH_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8F3DC" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} unit="kg" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="weight" name="Weight" fill="#40916C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Mortality Rate */}
            <div className="card p-6">
              <div className="mb-6">
                <p className="section-label !mb-0">Flock Health</p>
                <h3 className="font-display font-bold text-xl text-farm-dark">Weekly Mortality Rate (%)</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MORTALITY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8F3DC" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} unit="%" domain={[0, 0.2]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rate" name="Mortality" stroke="#F4A620" strokeWidth={2.5} dot={{ fill: '#F4A620', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feed Consumption */}
          <div className="reveal">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="section-label !mb-0">Feed Consumption</p>
                  <h3 className="font-display font-bold text-xl text-farm-dark">Daily Feed Usage — This Week (tonnes)</h3>
                </div>
                <span className="badge">All Houses</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={FEED_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="feedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F4A620" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#FFD166" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFF3CD" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} unit="t" domain={[1.0, 1.4]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="feed" name="Feed" fill="url(#feedGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-farm-yellow-pale border border-farm-yellow/30 text-farm-dark/70 text-sm reveal">
            <AlertCircle size={16} className="text-farm-yellow mt-0.5 flex-shrink-0" />
            <p>Data shown is representative and updates every 15 minutes. For real-time integrations, contact our team about our API access programme.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
