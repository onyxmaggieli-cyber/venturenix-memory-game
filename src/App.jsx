import { useState, useEffect, useCallback } from 'react';
import './App.css';

const BASE = import.meta.env.BASE_URL;

const initialCards = [
  { id: 1, src: `${BASE}img/animal1.jpg`, alt: 'Animal 1' },
  { id: 2, src: `${BASE}img/animal2.jpg`, alt: 'Animal 2' },
  { id: 3, src: `${BASE}img/animal3.jpg`, alt: 'Animal 3' },
  { id: 4, src: `${BASE}img/animal4.jpg`, alt: 'Animal 4' },
  { id: 5, src: `${BASE}img/animal5.jpg`, alt: 'Animal 5' },
  { id: 6, src: `${BASE}img/animal6.jpg`, alt: 'Animal 6' },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck() {
  const pairs = initialCards.flatMap((card) => [
    { ...card, uid: `${card.id}-a` },
    { ...card, uid: `${card.id}-b` },
  ]);
  return shuffle(pairs);
}

function preloadImages() {
  initialCards.forEach((card) => {
    const img = new Image();
    img.src = card.src;
  });
}

export default function App() {
  const [deck, setDeck] = useState(() => createDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    preloadImages();
  }, []);

  const handleNewGame = useCallback(() => {
    setDeck(createDeck());
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setSuccessCount(0);
    setLocked(false);
  }, []);

  const handleCardClick = useCallback(
    (uid) => {
      if (locked) return;
      if (flipped.includes(uid)) return;
      if (matched.includes(uid)) return;

      const newFlipped = [...flipped, uid];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setLocked(true);
        const [first, second] = newFlipped;
        const firstCard = deck.find((c) => c.uid === first);
        const secondCard = deck.find((c) => c.uid === second);

        if (firstCard.id === secondCard.id) {
          setTimeout(() => {
            setMatched((prev) => [...prev, first, second]);
            setAttempts((prev) => prev + 1);
            setSuccessCount((prev) => prev + 1);
            setFlipped([]);
            setLocked(false);
          }, 600);
        } else {
          setTimeout(() => {
            setAttempts((prev) => prev + 1);
            setFlipped([]);
            setLocked(false);
          }, 1600);
        }
      }
    },
    [locked, flipped, matched, deck]
  );

  return (
    <div className="app">
      <h1 className="title">Venturenix LAB Memory Game</h1>

      <div className="top-bar">
        <span className="stat">成功配對次數: <strong>{successCount}</strong></span>
        <span className="stat">嘗試配對次數: <strong>{attempts}</strong></span>
        <button className="new-game-btn" onClick={handleNewGame}>
          新遊戲
        </button>
      </div>

      <div className="grid">
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.uid) || matched.includes(card.uid);
          const isMatched = matched.includes(card.uid);
          return (
            <div
              key={card.uid}
              className={`card-wrapper${isFlipped ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}
              onClick={() => handleCardClick(card.uid)}
            >
              <div className="card-inner">
                <div className="card-face card-back">
                  <span className="card-back-text">Venturenix LAB</span>
                </div>
                <div className="card-face card-front">
                  <img src={card.src} alt={card.alt} draggable="false" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
