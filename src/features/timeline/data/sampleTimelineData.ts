import { TimelineEntry } from '../types/TimelineEntry';

/**
 * Sample timeline data for demonstration purposes
 * Each entry represents a significant historical event with date, time, location and details
 */
export const timelineEntries: TimelineEntry[] = [
  {
    id: 1,
    date: 'July 20, 1969',
    time: '8:17',
    location: 'Moon',
    title: 'Apollo 11 Moon Landing',
    content:
      "Neil Armstrong and Buzz Aldrin became the first humans to land on the Moon, marking a historic achievement in space exploration. Armstrong's famous words, 'That's one small step for man, one giant leap for mankind,' were broadcast to millions around the world.",
  },
  {
    id: 2,
    date: 'November 9, 1989',
    time: '04:20',
    location: 'Berlin, Germany',
    title: 'Fall of the Berlin Wall',
    content:
      'The Berlin Wall, which had divided East and West Berlin for decades, was opened, symbolizing the end of the Cold War and paving the way for German reunification. Crowds celebrated as sections of the wall were dismantled.',
  },
  {
    id: 3,
    date: 'September 11, 2001',
    time: '8:46',
    location: 'New York City, USA',
    title: '9/11 Attacks',
    content:
      'Terrorist attacks destroyed the World Trade Center towers in New York City and damaged the Pentagon, resulting in thousands of deaths and changing global security policies forever.',
  },
  {
    id: 4,
    date: 'December 26, 2004',
    time: '7:58',
    location: 'Indian Ocean',
    title: 'Indian Ocean Tsunami',
    content:
      'A massive undersea earthquake triggered a tsunami that devastated coastal regions in 14 countries, causing over 230,000 deaths and widespread destruction.',
  },
  {
    id: 5,
    date: 'January 20, 2009',
    time: '12:00',
    location: 'Washington, D.C., USA',
    title: 'Barack Obama Inauguration',
    content:
      'Barack Obama was inaugurated as the 44th President of the United States, becoming the first African American to hold the office. The event was watched by millions and marked a significant moment in American history.',
  },
  {
    id: 6,
    date: 'March 11, 2020',
    time: '17:17',
    location: 'Worldwide',
    title: 'COVID-19 Declared a Pandemic',
    content:
      'The World Health Organization officially declared COVID-19 a global pandemic, leading to unprecedented public health measures, lockdowns, and a major impact on economies and societies worldwide.',
  },
];
