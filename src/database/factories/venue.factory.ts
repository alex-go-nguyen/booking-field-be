import { faker } from '@faker-js/faker/locale/vi';
import { Venue } from 'src/venue/entities/venue.entity';
import { VenueStatusEnum } from 'src/venue/enums/venue.enum';
import { define } from 'typeorm-seeding';

const imageList = [
  {
    imagePath:
      'https://parksports.co.uk/media/images/Venue-Pages/Lammas-Park/_1200xAUTO_crop_center-center_none_ns/Lammas-Park-3G-Football-Pitches_2022-11-10-152625_bbtd.jpg',
  },
  {
    imagePath:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4lrxR5MnRQSZdMgaA3G4z3WP-Q7Zv2HiWiKQcf0o8EEHuF6SP-VM-kvIbCxBlBwKizL8&usqp=CAU',
  },
  {
    imagePath:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh7P2SCvmgrraiSqo4cRRyCfCpY9SnFGHgsngmDmVhtqL_0xH2b-lDnUxzCrdImTRR4uc&usqp=CAU',
  },
  {
    imagePath:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE0VAUxie9Vw10cN5kpBNMv0GtIlHXkuKqy3S0UGFSKuNsDUfY9xyIerWQJ6jSFjtI0dM&usqp=CAU',
  },
  {
    imagePath:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZP0S7racPbru0j-2JDOlZSV4ljjcYyWCvnQwoiZpXJGZKnhr8FKl1-yjMbTA7zA0masU&usqp=CAU',
  },
  {
    imagePath:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDANB7zNMGA95fK6oBRuhOc9io-Cze0Pq69q9dfewNtT_pqxrULjcm55PTe1ktR5YS1Q0&usqp=CAU',
  },
  {
    imagePath:
      'https://res-5.cloudinary.com/gll/image/upload/c_fit,f_auto,h_391,w_1280/v1562115014/Homepage_Banner_Desktop-Tadworth_-_10-10-2015_16.jpg',
  },
];
define(Venue, () => {
  const venue = new Venue();

  imageList.sort(() => 0.5 - Math.random());

  venue.name = `Sân bóng ${faker.location.city()}`;
  venue.description = faker.lorem.paragraph();
  venue.address = faker.location.streetAddress();
  venue.province = faker.location.city();
  venue.district = faker.location.county();
  venue.location = {
    lat: faker.location.latitude({ min: 8.18, max: 23.39 }),
    lng: faker.location.longitude({ min: 102.14, max: 109.46 }),
  };
  venue.imageList = imageList;
  venue.openAt = '08:00';
  venue.closeAt = '23:00';
  venue.status = VenueStatusEnum.Waiting;

  return venue;
});
