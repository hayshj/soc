import '../css/components/eventCard.css';

type EventCardProps = {
  title: string;
  date: string;
  location: string;
  description?: string;
};

function EventCard({ title, date, location, description }: EventCardProps) {
  // Format date as MM-DD-YYYY
  const formattedDate = (() => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date; // fallback if invalid date
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${month}-${day}-${year}`;
  })();

  return (
    <div id="eventCard">
      <div id="eventCardInfo">
        <h1 id="eventTitle">{title}</h1>
        {description && <p className="eventDescription">{description}</p>}
        <div id="eventDetails">
          <p>{formattedDate}</p>
          <p>{location}</p>
        </div>
      </div>
      {/* 
      <div id="eventCardButtonContainer">
        <Link id="eventCardButton" to="#">
          Register Now
        </Link>
      </div>
      */}
    </div>
  );
}

export default EventCard;
