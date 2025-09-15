// src/components/config/ConfigurationPanelItem.tsx
import { ReactNode, useState } from "react";
import { PlaygroundDeviceSelector } from "@/components/playground/PlaygroundDeviceSelector";
import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

type ConfigurationPanelItemProps = {
  title: string;
  children?: ReactNode;
  source?: Track.Source;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

// Mirror of the ToggleSource union used internally by the library
type MyToggleSource =
  | "camera"
  | "microphone"
  | "screenShare"
  | "screenShareAudio"
  | "unknown";

const mapSourceToToggle = (s?: Track.Source): MyToggleSource | undefined => {
  if (!s) return undefined;
  switch (s) {
    case Track.Source.Camera:
      return "camera";
    case Track.Source.Microphone:
      return "microphone";
    case Track.Source.ScreenShare:
      return "screenShare";
    // add more mappings here if your app uses other Track.Source values
    default:
      return "unknown";
  }
};

export const ConfigurationPanelItem: React.FC<ConfigurationPanelItemProps> = ({
  children,
  title,
  source,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const toggleSource = mapSourceToToggle(source);

  return (
    <div className="w-full text-gray-300 py-4 border-b border-b-gray-800 relative">
      <div className="flex flex-row justify-between items-center px-4 text-xs uppercase tracking-wider">
        <h3>{title}</h3>
        <div className="flex items-center gap-2">
          {toggleSource && (
            <span className="flex flex-row gap-2">
              {/* The library's ToggleSource type is internal and not exported.
                  We map Track.Source -> literal strings and cast to `any` here
                  to satisfy the compiler during production build. */}
              <TrackToggle
                className="px-2 py-1 bg-gray-900 text-gray-300 border border-gray-800 rounded-sm hover:bg-gray-800"
                source={toggleSource as any}
              />
              {source === Track.Source.Camera && (
                <PlaygroundDeviceSelector kind="videoinput" />
              )}
              {source === Track.Source.Microphone && (
                <PlaygroundDeviceSelector kind="audioinput" />
              )}
            </span>
          )}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  !isCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div className="px-4 py-2 text-xs text-gray-500 leading-normal">
          {children}
        </div>
      )}
    </div>
  );
};
