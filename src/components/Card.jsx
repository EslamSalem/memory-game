import "../styles/Card.css";

function Card({ id, name, imgURL, handleCardClick }) {
  return (
    <div className="card" onClick={() => handleCardClick(id)}>
      <img className="cardImg" src={imgURL} alt="" />
      <h3 className="cardName">{name.toUpperCase()}</h3>
    </div>
  )
}

export default Card;