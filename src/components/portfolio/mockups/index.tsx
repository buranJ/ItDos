import type { MockupKind } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { BrowserMock } from "./BrowserMock";
import { DashboardMock } from "./DashboardMock";
import { MarketplaceMock } from "./MarketplaceMock";
import { PortalMock } from "./PortalMock";
import { ChatMock } from "./ChatMock";
import { IframeMock } from "./IframeMock";
import { PhoneMock } from "./PhoneMock";
import { LaptopMock } from "./LaptopMock";
import { LaptopVideoMock } from "./LaptopVideoMock";
import { BrowserVideoMock } from "./BrowserVideoMock";
import { ShowcaseMock } from "./ShowcaseMock";
import { FlowMock } from "./FlowMock";
import { AgentMock } from "./AgentMock";
import { NeuralMock } from "./NeuralMock";
import { CommandCenterMock } from "./CommandCenterMock";
import { UnifiedMock } from "./UnifiedMock";
import { AssistantMock } from "./AssistantMock";
import { AutomationFlowMock } from "./AutomationFlowMock";
import { AutomationJourneyMock } from "./AutomationJourneyMock";
import { AssistantEnhancedMock } from "./AssistantEnhancedMock";
import { AssistantEditorialMock } from "./AssistantEditorialMock";

export { BrowserMock, DashboardMock, MarketplaceMock, PortalMock, ChatMock, IframeMock, PhoneMock, LaptopMock, LaptopVideoMock, BrowserVideoMock, ShowcaseMock, FlowMock, AgentMock, NeuralMock, CommandCenterMock, UnifiedMock, AssistantMock, AutomationFlowMock, AutomationJourneyMock, AssistantEnhancedMock, AssistantEditorialMock };

type MockupDispatchProps = {
  kind: MockupKind;
  accent?: string;
  className?: string;
  /** Enable continuous "alive" behaviours (e.g. chat typing). */
  live?: boolean;
  /** Required when kind="iframe". */
  url?: string;
  /** Domain / address-bar text (kind="laptop-video" | "browser-video"). */
  address?: string;
  /** Project name shown while media is loading or still a placeholder. */
  projectTitle?: string;
  /** False while the mockup's step isn't on screen (video mockups). */
  active?: boolean;
  /** Controlled laptop/phones view for kind="laptop-video". */
  view?: "desktop" | "mobile";
  onViewChange?: (view: "desktop" | "mobile") => void;
  /** Crop for a browser-video recording (see BrowserVideoMock). */
  videoCrop?: { scale: number; top: number };
  /** Optional project-specific mobile screens for the laptop showcase. */
  mobileScreens?: readonly {
    src?: string;
    width: number;
    height: number;
  }[];
};

/** Renders the generative placeholder UI for a given kind. */
export function Mockup({
  kind,
  accent,
  className,
  live,
  url,
  address,
  projectTitle,
  mobileScreens,
  videoCrop,
  active,
  view,
  onViewChange,
}: MockupDispatchProps) {
  const base = cn("h-full w-full", className);
  switch (kind) {
    case "browser":
      return <BrowserMock accent={accent} className={base} />;
    case "dashboard":
      return <DashboardMock accent={accent} className={base} />;
    case "marketplace":
      return <MarketplaceMock accent={accent} className={base} />;
    case "portal":
      return <PortalMock accent={accent} className={base} />;
    case "chat":
      return <ChatMock accent={accent} className={base} typing={live} />;
    case "flow":
      return <FlowMock accent={accent} className={base} />;
    case "agent":
      return <AgentMock accent={accent} className={base} />;
    case "neural":
      return <NeuralMock accent={accent} className={base} />;
    case "command":
      return <CommandCenterMock accent={accent} className={base} />;
    case "unified":
      return <UnifiedMock accent={accent} className={base} />;
    case "assistant":
      return <AssistantMock accent={accent} className={base} />;
    case "assistant-enhanced":
      return <AssistantEnhancedMock accent={accent} className={base} />;
    case "assistant-editorial":
      return <AssistantEditorialMock accent={accent} className={base} />;
    case "automation":
      return <AutomationFlowMock accent={accent} className={base} />;
    case "journey":
      return <AutomationJourneyMock accent={accent} className={base} />;
    case "iframe":
      return <IframeMock accent={accent} url={url ?? ""} className={base} />;
    case "phone":
      return <PhoneMock accent={accent} url={url ?? ""} className={base} />;
    case "laptop":
      return <LaptopMock accent={accent} url={url ?? ""} className={base} />;
    case "laptop-video":
      return (
        <LaptopVideoMock
          accent={accent}
          url={url ?? ""}
          address={address}
          projectTitle={projectTitle}
          mobileScreens={mobileScreens}
          active={active}
          view={view}
          onViewChange={onViewChange}
          className={base}
        />
      );
    case "browser-video":
      return (
        <BrowserVideoMock
          accent={accent}
          url={url}
          address={address}
          projectTitle={projectTitle}
          videoCrop={videoCrop}
          active={active}
          className={base}
        />
      );
    case "showcase":
      return <ShowcaseMock accent={accent} url={url ?? ""} className={base} />;
    default:
      return <BrowserMock accent={accent} className={base} />;
  }
}
