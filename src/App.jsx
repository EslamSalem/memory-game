import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card";

function App() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    fetch("/api/pokemon?limit=20")
      .then((response) => response.json())
      .then((data) => {
        const fetchPromises = data.results.map((item) => {
          return fetch(item.url).then((response) => response.json());
        });
        Promise.all(fetchPromises).then((pokemonData) => {
          const pokemonDataMapped = pokemonData.map((item) => ({
            id: crypto.randomUUID(),
            name: item.name,
            imgURL: item.sprites["front_default"],
            isPressed: false,
          }));

          const shuffledCards = shuffleCards(pokemonDataMapped);

          setCards(shuffledCards);
        });
      });
  }, []);

  useEffect(() => {
    if (score === cards.length && cards.length > 0) {
      setIsOver(true);
    }
  }, [score]);

  function handleCardClick(id) {
    const clickedCard = cards.find((card) => card.id === id);
    calculateScore(clickedCard);
    const newCards = clickedCard.isPressed ? resetCards() : updateCard(id);
    const shuffledCards = shuffleCards(newCards);
    setCards(shuffledCards);
  }

  function calculateScore(clickedCard) {
    if (clickedCard.isPressed) {
      setScore(0);
    } else {
      if (score === best) {
        setBest((prev) => prev + 1);
      }
      setScore((prev) => prev + 1);
    }
  }

  function shuffleCards(arrCards) {
    const shuffledCards = [...arrCards];

    let currentIndex = shuffledCards.length;

    while (currentIndex > 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffledCards[currentIndex], shuffledCards[randomIndex]] = [
        shuffledCards[randomIndex],
        shuffledCards[currentIndex],
      ];
    }

    return shuffledCards;
  }

  function updateCard(id) {
    const updatedCards = cards.map((card) => {
      if (card.id === id) {
        return { ...card, isPressed: true };
      }
      return card;
    });

    return updatedCards;
  }

  function resetCards() {
    const unPressedCards = cards.map((card) => ({ ...card, isPressed: false }));
    return unPressedCards;
  }

  function restartGame() {
    const newCards = resetCards();
    const shuffledCards = shuffleCards(newCards);
    setCards(shuffledCards);
    setScore(0);
    setIsOver(false);
  }

  return (
    <>
      <h1 id="title">Memory Game</h1>
      <p id="description">
        Score by clicking a card you haven't clicked before!
      </p>

      <div id="score-board">
        <p id="currentScore">Current Score: {score}</p>
        <p id="bestScore">Best Score: {best}</p>
      </div>

      {isOver ? (
        <div id="win-screen">
          <h1>You Win!!</h1>
          <button
            type="button"
            id="play-again-btn"
            className="btn"
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div id="cards-container">
          {cards.map((item) => {
            return (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                imgURL={item.imgURL}
                handleCardClick={handleCardClick}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default App;
