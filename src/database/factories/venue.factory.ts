import { faker } from '@faker-js/faker/locale/vi';
import { Venue } from 'src/venue/entities/venue.entity';
import { define } from 'typeorm-seeding';

define(Venue, () => {
  const venue = new Venue();

  venue.name = `Sân bóng ${faker.company.name()}`;
  venue.description = faker.lorem.paragraph();
  venue.address = faker.location.streetAddress();
  venue.province = faker.location.city();
  venue.district = faker.location.county();
  venue.location = {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  };
  venue.imageList = [
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
  venue.openAt = '08:00';
  venue.closeAt = '23:00';

  return venue;
});
