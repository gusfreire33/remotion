import type { IconType } from "react-icons";
import {
  LuAlarmClock, LuArrowRight, LuBadgeCheck, LuBadgeDollarSign, LuBan, LuChartBar,
  LuBell, LuBrain, LuBriefcase, LuBuilding2, LuCalendar, LuChartLine, LuCheck,
  LuCircleDollarSign, LuClock, LuCoins, LuCompass, LuCpu, LuCreditCard, LuCrown,
  LuDatabase, LuEye, LuFilter, LuFlag, LuFlame, LuGauge, LuGift, LuGlobe, LuHandshake,
  LuHeart, LuInfinity, LuKey, LuLayers, LuLightbulb, LuLink, LuListChecks, LuLock,
  LuMagnet, LuMail, LuMap, LuMegaphone, LuMessageCircle, LuMessagesSquare, LuMonitor,
  LuMousePointerClick, LuPackage, LuPercent, LuPhone, LuPiggyBank, LuPlay, LuPuzzle,
  LuRepeat, LuRocket, LuScale, LuSearch, LuSend, LuSettings, LuShield, LuShoppingCart,
  LuSmartphone, LuSparkles, LuStar, LuTarget, LuThumbsUp, LuTimer, LuTrendingDown,
  LuTrendingUp, LuTriangleAlert, LuTrophy, LuUser, LuUserPlus, LuUsers, LuVideo,
  LuWallet, LuWorkflow, LuX, LuZap, LuBot, LuFileText, LuInstagram, LuYoutube,
  LuHourglass, LuRefreshCw, LuDoorOpen, LuHandCoins, LuBuilding, LuSprout,
  LuNetwork, LuGraduationCap, LuTag, LuReceipt, LuHammer, LuWrench, LuMic,
  LuCamera, LuStore, LuHouse, LuBookOpen, LuPen, LuLaptop, LuCar, LuCloud, LuShare2,
  LuCode, LuBrickWall, LuEyeOff, LuCircleHelp, LuCalendarDays, LuBanknote, LuPencilLine,
} from "react-icons/lu";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../lib/theme";

/* ------------------------------------------------------------------------
   REACT ICONS — pedido do dono (11/09/2026): "pode usar alguns símbolos,
   React Icons, pra representar ilustrações".

   Conjunto Lucide (traço fino, combina com a Inter). O mapa referencia o
   ícone pelo nome; a entrada é um pop com spring (mesma gramática dos chips).
   --------------------------------------------------------------------- */

export const ICONS = {
  alarm: LuAlarmClock, arrow: LuArrowRight, badge: LuBadgeCheck, dollarBadge: LuBadgeDollarSign,
  ban: LuBan, bars: LuChartBar, bell: LuBell, brain: LuBrain, briefcase: LuBriefcase,
  building: LuBuilding2, calendar: LuCalendar, chart: LuChartLine, check: LuCheck,
  dollar: LuCircleDollarSign, clock: LuClock, coins: LuCoins, compass: LuCompass, cpu: LuCpu,
  card: LuCreditCard, crown: LuCrown, database: LuDatabase, eye: LuEye, filter: LuFilter,
  flag: LuFlag, flame: LuFlame, gauge: LuGauge, gift: LuGift, globe: LuGlobe,
  handshake: LuHandshake, heart: LuHeart, infinity: LuInfinity, key: LuKey, layers: LuLayers,
  bulb: LuLightbulb, link: LuLink, checklist: LuListChecks, lock: LuLock, magnet: LuMagnet,
  mail: LuMail, map: LuMap, megaphone: LuMegaphone, chat: LuMessageCircle,
  chats: LuMessagesSquare, monitor: LuMonitor, click: LuMousePointerClick, box: LuPackage,
  percent: LuPercent, phone: LuPhone, piggy: LuPiggyBank, play: LuPlay, puzzle: LuPuzzle,
  repeat: LuRepeat, rocket: LuRocket, scale: LuScale, search: LuSearch, send: LuSend,
  settings: LuSettings, shield: LuShield, cart: LuShoppingCart, smartphone: LuSmartphone,
  sparkles: LuSparkles, star: LuStar, target: LuTarget, thumbs: LuThumbsUp, timer: LuTimer,
  down: LuTrendingDown, up: LuTrendingUp, alert: LuTriangleAlert, trophy: LuTrophy,
  user: LuUser, userPlus: LuUserPlus, users: LuUsers, video: LuVideo, wallet: LuWallet,
  workflow: LuWorkflow, x: LuX, zap: LuZap, bot: LuBot, file: LuFileText,
  instagram: LuInstagram, youtube: LuYoutube, hourglass: LuHourglass, refresh: LuRefreshCw,
  door: LuDoorOpen, handCoins: LuHandCoins, office: LuBuilding, sprout: LuSprout,
  network: LuNetwork, graduation: LuGraduationCap, tag: LuTag, receipt: LuReceipt,
  hammer: LuHammer, wrench: LuWrench, mic: LuMic, camera: LuCamera, store: LuStore,
  home: LuHouse, book: LuBookOpen, pen: LuPen, laptop: LuLaptop, car: LuCar, cloud: LuCloud,
  share: LuShare2, code: LuCode, wall: LuBrickWall, eyeOff: LuEyeOff, question: LuCircleHelp,
  days: LuCalendarDays, banknote: LuBanknote, write: LuPencilLine,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof ICONS;

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  /** frame (relativo) em que entra com pop; sem `delay` entra parado */
  delay?: number;
  glow?: boolean;
  /** pulsa de leve depois de entrar */
  pulse?: boolean;
}> = ({ name, size = 64, color = COLORS.orange, delay, glow = true, pulse = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Cmp = ICONS[name];
  const s =
    delay === undefined
      ? 1
      : spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const p = pulse ? 1 + 0.04 * Math.sin(frame * 0.25) : 1;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${s * p}) rotate(${(1 - s) * -20}deg)`,
        opacity: Math.min(1, s * 1.4),
        filter: glow
          ? `drop-shadow(0 0 ${size * 0.22}px ${color === COLORS.orange ? "rgba(255,122,26,0.7)" : "rgba(255,255,255,0.45)"})`
          : undefined,
        color,
        lineHeight: 0,
      }}
    >
      <Cmp size={size} strokeWidth={2.2} />
    </span>
  );
};
