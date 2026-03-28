import {
  AlertTriangle,
  Bike,
  CloudRain,
  Construction,
  FlashlightOff,
  GitMerge,
  Package,
} from 'lucide-react'

/**
 * Real-world style issue presets (display `type` matches persisted reports + seed data).
 */
export const KALSADA_ISSUES = [
  {
    type: 'Pothole',
    subtitle: 'Hole, crack, or rough pavement',
    defaultSeverity: 'High',
    Icon: Construction,
    listBg: 'bg-amber-50',
    listIcon: 'text-amber-700',
  },
  {
    type: 'Flooding',
    subtitle: 'Standing water after rain',
    defaultSeverity: 'Medium',
    Icon: CloudRain,
    listBg: 'bg-sky-50',
    listIcon: 'text-sky-700',
  },
  {
    type: 'No Bike Lane',
    subtitle: 'Lane ends or unsafe merge',
    defaultSeverity: 'Low',
    Icon: Bike,
    listBg: 'bg-primary/10',
    listIcon: 'text-primary',
  },
  {
    type: 'Dangerous Intersection',
    subtitle: 'Crossing, blind corner, fast traffic',
    defaultSeverity: 'High',
    Icon: GitMerge,
    listBg: 'bg-red-50',
    listIcon: 'text-red-700',
  },
  {
    type: 'Obstruction',
    subtitle: 'Parked vehicle, debris, closure',
    defaultSeverity: 'Medium',
    Icon: Package,
    listBg: 'bg-charcoal/10',
    listIcon: 'text-charcoal',
  },
  {
    type: 'Poor Lighting',
    subtitle: 'Dark underpass or street',
    defaultSeverity: 'Medium',
    Icon: FlashlightOff,
    listBg: 'bg-violet-50',
    listIcon: 'text-violet-700',
  },
]

export const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low', hint: 'Annoying', tone: 'teal' },
  { value: 'Medium', label: 'Med', hint: 'Use caution', tone: 'amber' },
  { value: 'High', label: 'High', hint: 'Avoid if possible', tone: 'red' },
]

export function getIssueVisual(type) {
  const row = KALSADA_ISSUES.find((x) => x.type === type)
  if (row) {
    return { Icon: row.Icon, listBg: row.listBg, listIcon: row.listIcon }
  }
  return {
    Icon: AlertTriangle,
    listBg: 'bg-accent/15',
    listIcon: 'text-amber-800',
  }
}
