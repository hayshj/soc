import '../css/components/testCard.css';

type TestCardProps = {
  quote: string;
  image: string;
  name: string;
};

function TestCard({ quote, image, name }: TestCardProps) {
    return (
        <div id="testCard">
            <div id="quoteMark">“</div>
            <div id="quoteSection">
                <p className="quote">"{quote}"</p>
            </div>
            <div id="userSection">
                <img src={image} alt={name} className="profileImage" />
                <div className="userInfo">
                    <p className="userName">{name}</p>
                </div>
            </div>
        </div>
    );
}

export default TestCard;
