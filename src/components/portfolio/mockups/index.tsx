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
import { ShowcaseMock } from "./ShowcaseMock";
import { FlowMock } from "./FlowMock";
import { AgentMock } from "./AgentMock";
import { NeuralMock } from "./NeuralMock";
import { CommandCenterMock } from "./CommandCenterMock";
import { UnifiedMock } from "./UnifiedMock";
import { AssistantMock } from "./AssistantMock";

export { BrowserMock, DashboardMock, MarketplaceMock, PortalMock, ChatMock, IframeMock, PhoneMock, LaptopMock, ShowcaseMock, FlowMock, AgentMock, NeuralMock, CommandCenterMock, UnifiedMock, AssistantMock };

type MockupDispatchProps = {
  kind: MockupKind;
  accent?: string;
  className?: string;
  /** Enable continuous "alive" behaviours (e.g. chat typing). */
  live?: boolean;
  /** Required when kind="iframe". */
  url?: string;
};

/** Renders the generative placeholder UI for a given kind. */
export function Mockup({ kind, accent, className, live, url }: MockupDispatchProps) {
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
    case "iframe":
      return <IframeMock accent={accent} url={url ?? ""} className={base} />;
    case "phone":
      return <PhoneMock accent={accent} url={url ?? ""} className={base} />;
    case "laptop":
      return <LaptopMock accent={accent} url={url ?? ""} className={base} />;
    case "showcase":
      return <ShowcaseMock accent={accent} url={url ?? ""} className={base} />;
    default:
      return <BrowserMock accent={accent} className={base} />;
  }
}
