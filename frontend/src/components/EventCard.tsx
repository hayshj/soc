import '../css/components/eventCard.css';
import { Link } from 'react-router-dom';

type EventCardProps = {
    title: string;
    date: string;
    location: string;
}

function EventCard({ title, date, location }: EventCardProps) {
    return (
        <>
            <div id='eventCard'>
                <div id='eventCardInfo'>
                    <h1 id='eventTitle'>{title}</h1>
                    <div id='eventDetails'>
                        <p>{date}</p>
                        <p>{location}</p>
                    </div>
                </div>
                <div id="eventCardButtonContainer">
                    <Link
                        id="eventCardButton"
                        to="#"
                    >
                        Register Now
                    </Link>
                </div>

            </div>
        </>
    )
}

export default EventCard;