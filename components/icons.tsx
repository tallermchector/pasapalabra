import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Trophy, 
  Star,
  ChevronRight,
  ChevronLeft,
  Settings,
  Home,
  User,
  Target,
  Zap,
  Award,
  Medal,
  Crown,
  type LucideIcon
} from 'lucide-react'

export const Icons = {
  play: Play,
  pause: Pause,
  reset: RotateCcw,
  volume: Volume2,
  volumeOff: VolumeX,
  clock: Clock,
  trophy: Trophy,
  star: Star,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  settings: Settings,
  home: Home,
  user: User,
  target: Target,
  zap: Zap,
  award: Award,
  medal: Medal,
  crown: Crown,
} as const

export type IconName = keyof typeof Icons
export type IconComponent = LucideIcon
</btml:action>