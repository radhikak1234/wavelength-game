import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import RedPointer from "../../assets/redpointer.png";

interface Props {
  currentTeam?: number;
  score: { team1: number; team2: number };
  teamNames: { 1: string; 2: string };
  setTeamNames: (names: { 1: string; 2: string }) => void;
}

type TeamKey = 1 | 2;

const defaultTeamNames: Record<TeamKey, string> = {
  1: "Team 1",
  2: "Team 2",
};

export const Header = ({
  score,
  currentTeam,
  teamNames,
  setTeamNames,
}: Props) => {
  const [editingTeam, setEditingTeam] = useState<TeamKey | null>(null);
  const [draftNames, setDraftNames] = useState(teamNames);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = headerRef.current;

    if (!element) {
      return;
    }

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--header-offset",
        `${element.getBoundingClientRect().height}px`
      );
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, [editingTeam]);

  const startEditing = (team: TeamKey) => {
    setDraftNames(teamNames);
    setEditingTeam(team);
  };

  const updateDraft = (team: TeamKey, value: string) => {
    setDraftNames((prev) => ({
      ...prev,
      [team]: value,
    }));
  };

  const saveTeamName = (team: TeamKey) => {
    const nextName = draftNames[team].trim() || defaultTeamNames[team];

    setTeamNames({
      ...teamNames,
      [team]: nextName,
    });
    setDraftNames((prev) => ({
      ...prev,
      [team]: nextName,
    }));
    setEditingTeam(null);
  };

  const cancelEditing = (team: TeamKey) => {
    setDraftNames((prev) => ({
      ...prev,
      [team]: teamNames[team],
    }));
    setEditingTeam(null);
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    team: TeamKey
  ) => {
    if (event.key === "Enter") {
      saveTeamName(team);
    }

    if (event.key === "Escape") {
      cancelEditing(team);
    }
  };

  return (
    <FixedHeader ref={headerRef}>
      <TitleBar>Wavelength: a game of provoking thoughts</TitleBar>

      <TeamScoreContainer>
        <TeamCard currentTeam={currentTeam === 1}>
          <TeamNameEditor
            team={1}
            label={teamNames[1]}
            draftValue={draftNames[1]}
            isEditing={editingTeam === 1}
            isCurrentTeam={currentTeam === 1}
            score={score.team1}
            startEditing={startEditing}
            updateDraft={updateDraft}
            saveTeamName={saveTeamName}
            cancelEditing={cancelEditing}
            onKeyDown={onKeyDown}
          />
        </TeamCard>

        <TeamCard currentTeam={currentTeam === 2}>
          <TeamNameEditor
            team={2}
            label={teamNames[2]}
            draftValue={draftNames[2]}
            isEditing={editingTeam === 2}
            isCurrentTeam={currentTeam === 2}
            score={score.team2}
            startEditing={startEditing}
            updateDraft={updateDraft}
            saveTeamName={saveTeamName}
            cancelEditing={cancelEditing}
            onKeyDown={onKeyDown}
          />
        </TeamCard>
      </TeamScoreContainer>

      <RedPointerImage
        isFirstTeam={currentTeam === 1}
        alt="current team pointer"
        src={RedPointer}
        width="25"
        height="25"
      />
    </FixedHeader>
  );
};

interface TeamNameEditorProps {
  team: TeamKey;
  label: string;
  draftValue: string;
  isEditing: boolean;
  isCurrentTeam: boolean;
  score: number;
  startEditing: (team: TeamKey) => void;
  updateDraft: (team: TeamKey, value: string) => void;
  saveTeamName: (team: TeamKey) => void;
  cancelEditing: (team: TeamKey) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    team: TeamKey
  ) => void;
}

const TeamNameEditor = ({
  team,
  label,
  draftValue,
  isEditing,
  isCurrentTeam,
  score,
  startEditing,
  updateDraft,
  saveTeamName,
  cancelEditing,
  onKeyDown,
}: TeamNameEditorProps) => {
  return (
    <TeamContent>
      {isEditing ? (
        <InlineEditor>
          <TeamInput
            autoFocus
            value={draftValue}
            onChange={(event) => updateDraft(team, event.target.value)}
            onKeyDown={(event) => onKeyDown(event, team)}
            onBlur={() => saveTeamName(team)}
            placeholder={defaultTeamNames[team]}
            aria-label={`Rename ${defaultTeamNames[team]}`}
          />
          <EditHint>Press Enter to save</EditHint>
        </InlineEditor>
      ) : (
        <DisplayButton
          type="button"
          onClick={() => startEditing(team)}
          aria-label={`Edit ${label}`}
        >
          <TeamNameRow>
            <TeamLabel>{label}</TeamLabel>
            {isCurrentTeam && <ActivePill>Current Turn</ActivePill>}
          </TeamNameRow>
          <TeamHint className="team-hint">Click team name to update</TeamHint>
        </DisplayButton>
      )}

      <ScoreWrap>
        <ScoreLabel>Score</ScoreLabel>
        <ScorePill>{score}</ScorePill>
      </ScoreWrap>
    </TeamContent>
  );
};

const RedPointerImage = styled.img<{
  isFirstTeam?: boolean;
}>`
  position: absolute;
  bottom: 12px;
  left: ${({ isFirstTeam }) =>
    isFirstTeam ? "calc(50% - 25px)" : "calc(50% - 1px)"};
  transition: 0.5s ease-in-out;
  rotate: ${({ isFirstTeam }) => (isFirstTeam ? `90deg` : `270deg`)};
  pointer-events: none;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 20;
  overflow: visible;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
`;

const TitleBar = styled.div`
  display: flex;
  justify-content: center;
  background: linear-gradient(90deg, #c8efd6 0%, #abe1bf 100%);
  color: #203128;
  padding: 12px 20px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
`;

const TeamScoreContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: #5a9b72;
  color: #203128;
`;

const TeamCard = styled.div<{
  currentTeam?: boolean;
}>`
  position: relative;
  padding: 10px 12px 12px;
  overflow: hidden;
  background: ${({ currentTeam }) =>
    currentTeam
      ? "linear-gradient(180deg, #9fd9f7 0%, #84c8ef 100%)"
      : "linear-gradient(180deg, #a8dcbc 0%, #8eca9e 100%)"};
  box-shadow: ${({ currentTeam }) =>
    currentTeam
      ? "inset 0 0 0 2px rgba(255, 255, 255, 0.48), inset 0 -18px 32px rgba(255, 255, 255, 0.12)"
      : "inset 0 0 0 1px rgba(255, 255, 255, 0.18)"};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ currentTeam }) =>
      currentTeam
        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%)"
        : "transparent"};
    pointer-events: none;
  }
`;

const TeamContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const DisplayButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.52);
  color: inherit;
  cursor: pointer;
  padding: 10px 14px 8px;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background 0.16s ease;
  box-shadow: inset 0 0 0 1px rgba(32, 49, 40, 0.08);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.72);
    box-shadow:
      0 12px 22px rgba(32, 49, 40, 0.1),
      inset 0 0 0 1px rgba(32, 49, 40, 0.06);
  }

  &:hover .team-hint,
  &:focus-visible .team-hint {
    opacity: 0.78;
    max-height: 20px;
    margin-top: 6px;
  }
`;

const TeamNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 24px;
`;

const TeamLabel = styled.div`
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.01em;
`;

const ActivePill = styled.span`
  border-radius: 999px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.7);
  color: #1f4f6a;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 6px 12px rgba(31, 79, 106, 0.14);
`;

const TeamHint = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  overflow: hidden;
  transition:
    opacity 0.16s ease,
    max-height 0.16s ease,
    margin-top 0.16s ease;
`;

const ScoreWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const ScoreLabel = styled.div`
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(32, 49, 40, 0.66);
`;

const InlineEditor = styled.div`
  width: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  padding: 10px 12px 8px;
  box-shadow: inset 0 0 0 1px rgba(32, 49, 40, 0.1);
`;

const TeamInput = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: #203128;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
`;

const EditHint = styled.div`
  margin-top: 6px;
  text-align: center;
  font-size: 0.66rem;
  letter-spacing: 0.03em;
  opacity: 0.72;
`;

const ScorePill = styled.div`
  min-width: 52px;
  padding: 7px 14px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
  color: #203128;
  font-size: 1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  box-shadow:
    0 10px 20px rgba(18, 31, 24, 0.1),
    inset 0 0 0 1px rgba(94, 133, 111, 0.14);
`;
