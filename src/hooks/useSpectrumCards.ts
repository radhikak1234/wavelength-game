import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  spectrumCards as fallbackSpectrumCards,
  SpectrumCardItem,
  shuffleCards,
} from "../components/SpectrumCard/spectrumCards";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export type CardsSource = "local" | "supabase";

type CardSubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

const MAX_LABEL_LENGTH = 80;
const blockedTerms = [
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "slut",
  "whore",
  "dick",
  "pussy",
  "nigger",
  "nigga",
  "fag",
  "faggot",
  "retard",
  "rape",
  "rapist",
  "hitler",
  "nazis",
  "nazi",
];

const normalizeLabel = (value: string) =>
  value.trim().replace(/\s+/g, " ");

const containsBlockedTerm = (value: string) => {
  const normalized = value.toLowerCase();
  return blockedTerms.some((term) => normalized.includes(term));
};

const isLikelySpam = (value: string) => {
  return /(https?:\/\/|www\.|@)/i.test(value) || /(.)\1{5,}/.test(value);
};

const hasValidCharacters = (value: string) => {
  return /^[a-z0-9\s,'".!?&():;/+\-]+$/i.test(value);
};

const buildPairKey = (left: string, right: string) =>
  `${left.toLowerCase()}::${right.toLowerCase()}`;

const validateCardInput = (
  left: string,
  right: string,
  existingCards: SpectrumCardItem[]
) => {
  if (!left || !right) {
    return "Add both a left and right spectrum label.";
  }

  if (left.length > MAX_LABEL_LENGTH || right.length > MAX_LABEL_LENGTH) {
    return `Each side must be ${MAX_LABEL_LENGTH} characters or fewer.`;
  }

  if (left.toLowerCase() === right.toLowerCase()) {
    return "Left and right sides need to be different.";
  }

  if (containsBlockedTerm(left) || containsBlockedTerm(right)) {
    return "Please keep spectrum cards free of profanity or slurs.";
  }

  if (isLikelySpam(left) || isLikelySpam(right)) {
    return "Spectrum cards should not include links, emails, or spammy text.";
  }

  if (!hasValidCharacters(left) || !hasValidCharacters(right)) {
    return "Use plain words and punctuation only for spectrum cards.";
  }

  const nextKey = buildPairKey(left, right);
  const reversedKey = buildPairKey(right, left);
  const existingKeys = new Set(
    existingCards.flatMap((card) => [
      buildPairKey(normalizeLabel(card.left), normalizeLabel(card.right)),
      buildPairKey(normalizeLabel(card.right), normalizeLabel(card.left)),
    ])
  );

  if (existingKeys.has(nextKey) || existingKeys.has(reversedKey)) {
    return "That spectrum pair already exists.";
  }

  return null;
};

export const useSpectrumCards = () => {
  const [cards, setCards] = useState<SpectrumCardItem[]>(fallbackSpectrumCards);
  const [cardsSource, setCardsSource] = useState<CardsSource>("local");
  const [cardsStatus, setCardsStatus] = useState(
    hasSupabaseConfig ? "Loading saved cards..." : "Using starter cards"
  );
  const [cardForm, setCardForm] = useState({ left: "", right: "" });
  const [cardSubmitState, setCardSubmitState] = useState<CardSubmitState>({
    type: "idle",
    message: "",
  });
  const [currentCard, setCurrentCard] = useState<SpectrumCardItem>(
    fallbackSpectrumCards[0]
  );
  const drawCardRef = useRef<() => SpectrumCardItem>(
    shuffleCards(fallbackSpectrumCards)
  );

  useEffect(() => {
    let ignore = false;

    const loadCards = async () => {
      if (!supabase) {
        drawCardRef.current = shuffleCards(fallbackSpectrumCards);
        setCards(fallbackSpectrumCards);
        setCurrentCard(drawCardRef.current());
        return;
      }

      const { data, error } = await supabase
        .from("spectrum_cards")
        .select("left_text, right_text")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (ignore) {
        return;
      }

      if (error || !data || data.length === 0) {
        drawCardRef.current = shuffleCards(fallbackSpectrumCards);
        setCards(fallbackSpectrumCards);
        setCardsSource("local");
        setCardsStatus(
          error
            ? "Saved cards are unavailable right now, using starter cards"
            : "No saved cards found yet, using starter cards"
        );
        setCurrentCard(drawCardRef.current());
        return;
      }

      const mappedCards = data.map((card) => ({
        left: card.left_text,
        right: card.right_text,
      }));

      drawCardRef.current = shuffleCards(mappedCards);
      setCards(mappedCards);
      setCardsSource("supabase");
      setCardsStatus(`${mappedCards.length} saved cards available`);
      setCurrentCard(drawCardRef.current());
    };

    loadCards();

    return () => {
      ignore = true;
    };
  }, []);

  const drawCard = useCallback(() => {
    setCurrentCard(drawCardRef.current());
  }, []);

  const onCardFormChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, field: "left" | "right") => {
      setCardForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const submitCard = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const left = normalizeLabel(cardForm.left);
      const right = normalizeLabel(cardForm.right);
      const validationError = validateCardInput(left, right, cards);

      if (validationError) {
        setCardSubmitState({
          type: "error",
          message: validationError,
        });
        return;
      }

      if (!supabase) {
        setCardSubmitState({
          type: "error",
          message: "Card saving is not configured yet.",
        });
        return;
      }

      const { data, error } = await supabase
        .from("spectrum_cards")
        .insert({
          left_text: left,
          right_text: right,
          active: true,
        })
        .select("left_text, right_text")
        .single();

      if (error || !data) {
        setCardSubmitState({
          type: "error",
          message: "Could not save that card right now.",
        });
        return;
      }

      const nextCards = [
        ...cards,
        { left: data.left_text, right: data.right_text } satisfies SpectrumCardItem,
      ];
      const newCard = {
        left: data.left_text,
        right: data.right_text,
      } satisfies SpectrumCardItem;

      drawCardRef.current = shuffleCards(nextCards);
      setCards(nextCards);
      setCardsSource("supabase");
      setCardsStatus(`${nextCards.length} saved cards available`);
      setCurrentCard(newCard);
      setCardForm({ left: "", right: "" });
      setCardSubmitState({
        type: "success",
        message: "New spectrum card saved and previewed.",
      });
    },
    [cardForm.left, cardForm.right, cards]
  );

  return {
    cardForm,
    cards,
    cardsSource,
    cardsStatus,
    cardSubmitState,
    currentCard,
    drawCard,
    hasSupabaseConfig,
    onCardFormChange,
    submitCard,
  };
};
