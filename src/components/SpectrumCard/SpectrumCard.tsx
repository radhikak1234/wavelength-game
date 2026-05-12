import React, { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
interface Props {
  spectrumLeft?: string;
  spectrumRight?: string;
  drawVersion?: number;
}

type CardContent = {
  left: string;
  right: string;
};

const DISCARD_DURATION_MS = 170;
const DEAL_DURATION_MS = 220;

const stackPulse = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.82;
  }

  45% {
    transform: translateY(10px) scale(0.99);
    opacity: 0.98;
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 0.82;
  }
`;

const incomingCard = keyframes`
  0% {
    transform: translateY(26px) scale(0.95) rotate(-4deg);
    opacity: 0;
    filter: blur(5px);
  }

  60% {
    transform: translateY(-5px) scale(1.01) rotate(0.75deg);
    opacity: 1;
    filter: blur(0);
  }

  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
    filter: blur(0);
  }
`;

const discardCard = keyframes`
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    opacity: 1;
    filter: blur(0);
  }

  100% {
    transform: translate3d(112px, -96px, 0) rotate(12deg) scale(0.92);
    opacity: 0;
    filter: blur(4px);
  }
`;

export const SpectrumCard = ({
  spectrumLeft,
  spectrumRight,
  drawVersion = 0,
}: Props) => {
  const nextCard: CardContent = {
    left: spectrumLeft ?? "",
    right: spectrumRight ?? "",
  };
  const [displayCard, setDisplayCard] = useState<CardContent>(nextCard);
  const [discardedCard, setDiscardedCard] = useState<CardContent | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "discarding" | "dealing"
  >("idle");
  const isFirstRender = useRef(true);
  const displayCardRef = useRef(displayCard);
  const previousDrawVersion = useRef(drawVersion);
  const timeoutIds = useRef<number[]>([]);

  useEffect(() => {
    displayCardRef.current = displayCard;
  }, [displayCard]);

  useEffect(() => {
    const clearTimers = () => {
      timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.current = [];
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDrawVersion.current = drawVersion;
      return;
    }

    if (previousDrawVersion.current === drawVersion) {
      clearTimers();
      setDiscardedCard(null);
      setAnimationPhase("idle");
      setDisplayCard(nextCard);
      return clearTimers;
    }

    previousDrawVersion.current = drawVersion;
    clearTimers();
    setDiscardedCard(displayCardRef.current);
    setDisplayCard(nextCard);
    setAnimationPhase("discarding");

    const discardTimeout = window.setTimeout(() => {
      setAnimationPhase("dealing");
    }, DISCARD_DURATION_MS);

    const settleTimeout = window.setTimeout(() => {
      setDiscardedCard(null);
      setAnimationPhase("idle");
    }, DISCARD_DURATION_MS + DEAL_DURATION_MS);

    timeoutIds.current = [discardTimeout, settleTimeout];

    return clearTimers;
  }, [drawVersion, nextCard.left, nextCard.right]);

  const isAnimating = animationPhase !== "idle";
  const incomingVariant =
    animationPhase === "discarding"
      ? "waiting"
      : animationPhase === "dealing"
        ? "incoming"
        : "idle";

  return (
    <Flex>
      <CardStage>
        <PileShadow />
        <StackShadow $isAnimating={isAnimating} $offset={14} $rotation={-7} />
        <StackShadow $isAnimating={isAnimating} $offset={9} $rotation={5} />
        <StackShadow $isAnimating={isAnimating} $offset={4} $rotation={-3} />
        {discardedCard && (
          <Card
            $variant="discard"
            aria-hidden={animationPhase === "discarding" ? undefined : true}
          >
            <Concept>{discardedCard.left}</Concept>
            <Concept>{discardedCard.right}</Concept>
          </Card>
        )}
        <Card $variant={incomingVariant}>
          <Concept>{displayCard.left}</Concept>
          <Concept>{displayCard.right}</Concept>
        </Card>
      </CardStage>
    </Flex>
  );
};
const Concept = styled.div`
  width: 50%;
  font-size: 20px;
  text-wrap: wrap;
  padding: 16px;
`;

const CardStage = styled.div`
  position: relative;
  width: 20rem;
  height: 246px;
  z-index: 0;
`;

const PileShadow = styled.div`
  position: absolute;
  left: 50%;
  bottom: 10px;
  width: 86%;
  height: 44px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.28) 0%,
    rgba(0, 0, 0, 0.16) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  filter: blur(10px);
`;

const StackShadow = styled.div<{
  $offset: number;
  $rotation: number;
  $isAnimating: boolean;
}>`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(221, 162, 230, 0.42) 0%,
    rgba(221, 162, 230, 0.42) 50%,
    rgba(209, 209, 104, 0.42) 50%,
    rgba(209, 209, 104, 0.42) 100%
  );
  transform: ${({ $offset, $rotation }) =>
    `translateY(${$offset}px) rotate(${$rotation}deg) scale(${1 - $offset / 220})`};
  opacity: 0.88;
  box-shadow:
    0 22px 34px rgba(0, 0, 0, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.16);
  ${({ $isAnimating }) =>
    $isAnimating &&
    css`
      animation: ${stackPulse} 620ms ease-out;
    `}
`;

const Card = styled.div<{ $variant: "idle" | "waiting" | "incoming" | "discard" }>`
  position: absolute;
  inset: 0 auto auto 0;
  color: black;
  background: linear-gradient(
    to right,
    #dda2e6 0%,
    #dda2e6 50%,
    #d1d168 50%,
    #d1d168 100%
  );
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 16px;
  box-shadow:
    0 26px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.26);
  will-change: transform, opacity, filter;

  ${({ $variant }) => {
    if ($variant === "waiting") {
      return css`
        transform: translateY(26px) scale(0.95) rotate(-4deg);
        opacity: 0;
        filter: blur(5px);
        z-index: 1;
      `;
    }

    if ($variant === "incoming") {
      return css`
        z-index: 2;
        animation: ${incomingCard} ${DEAL_DURATION_MS}ms
          cubic-bezier(0.2, 0.8, 0.2, 1);
      `;
    }

    if ($variant === "discard") {
      return css`
        z-index: 3;
        animation: ${discardCard} ${DISCARD_DURATION_MS}ms
          cubic-bezier(0.22, 1, 0.36, 1) forwards;
      `;
    }

    return css`
      z-index: 2;
      transform: translateY(0) scale(1) rotate(0deg);
      opacity: 1;
      filter: blur(0);
    `;
  }}
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;
