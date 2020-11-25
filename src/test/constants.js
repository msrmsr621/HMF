import React from 'react';
import {Dimensions} from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import faker from 'faker';

export const carouselData = [
  {
    title: '1',
    description: 'Connect with friends and the world around you on Facebook.',
    renderIcon: () => <AwesomeIcon name="facebook-square" size={28} />,
    bgColor: '#3B5998',
  },
  {
    title: '2',
    description:
      'With WhatsApp, you will get fast, simple, secure messaging and calling for free*, available on phones all over the world.',
    renderIcon: () => <AwesomeIcon name="whatsapp" size={28} />,
    bgColor: '#43d854',
  },
  {
    title: '3',
    description: 'Bringing you closer to the people and things you love.',
    renderIcon: () => <AwesomeIcon name="instagram" size={28} />,
    bgColor: '#C13584',
  },
  {
    title: '4',
    description: 'Connect with friends and the world around you on Facebook.',
    renderIcon: () => <AwesomeIcon name="facebook-square" size={28} />,
    bgColor: '#3B5998',
  },
  {
    title: '5',
    description:
      'With WhatsApp, you will get fast, simple, secure messaging and calling for free*, available on phones all over the world.',
    renderIcon: () => <AwesomeIcon name="whatsapp" size={28} />,
    bgColor: '#43d854',
  },
  {
    title: '6',
    description: 'Bringing you closer to the people and things you love.',
    renderIcon: () => <AwesomeIcon name="instagram" size={28} />,
    bgColor: '#C13584',
  },
  {
    title: '7',
    description: 'Connect with friends and the world around you on Facebook.',
    renderIcon: () => <AwesomeIcon name="facebook-square" size={28} />,
    bgColor: '#3B5998',
  },
  {
    title: '8',
    description:
      'With WhatsApp, you will get fast, simple, secure messaging and calling for free*, available on phones all over the world.',
    renderIcon: () => <AwesomeIcon name="whatsapp" size={28} />,
    bgColor: '#43d854',
  },
  {
    title: '9',
    description: 'Bringing you closer to the people and things you love.',
    renderIcon: () => <AwesomeIcon name="instagram" size={28} />,
    bgColor: '#C13584',
  },
  {
    title: '10',
    description: 'Connect with friends and the world around you on Facebook.',
    renderIcon: () => <AwesomeIcon name="facebook-square" size={28} />,
    bgColor: '#3B5998',
  },
  {
    title: '11',
    description:
      'With WhatsApp, you will get fast, simple, secure messaging and calling for free*, available on phones all over the world.',
    renderIcon: () => <AwesomeIcon name="whatsapp" size={28} />,
    bgColor: '#43d854',
  },
  {
    title: '12',
    description: 'Bringing you closer to the people and things you love.',
    renderIcon: () => <AwesomeIcon name="instagram" size={28} />,
    bgColor: '#C13584',
  }
];

export const colors = {
  kellyGreen: '#6BCD28',
  shipCove: '#7A8EB1',
  white: '#FFFFFF',
  biscay: '#2B3857',
};

export const USERS = Array(10)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    avatar: faker.image.avatar(),
    fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  }));

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const CAROUSEL_VERTICAL_OUTPUT = 56;
export const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - CAROUSEL_VERTICAL_OUTPUT;
